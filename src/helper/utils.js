// @flow
export * from 'toxic-predicate-functions';
import {isFunction, isArray, isBoolean} from 'toxic-predicate-functions';
import {bind} from 'toxic-utils';
const {getOwnPropertyDescriptor} = Object;
// **********************  对象操作  ************************
/**
 * sort Object attributes by function
 * and transfer them into array
 * @param  {Object} obj Object form from numric
 * @param  {Function} fn sort function
 * @return {Array} the sorted attirbutes array
 */
export function transObjectAttrIntoArray (obj: Object, fn: Function = (a, b) => +a - +b): Array<string> {
  return Object.keys(obj)
  .sort(fn)
  .reduce((order, key) => {
    return order.concat(obj[key]);
  }, []);
}
/**
 * to check if an descriptor
 * @param {anything} desc
 */
export function isDescriptor (desc: any): boolean {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  const keys = ['value', 'initializer', 'get', 'set'];

  for (let i = 0, l = keys.length; i < l; i++) {
    if (desc.hasOwnProperty(keys[i])) {
      return true;
    }
  }
  return false;
}
/**
 * to check if the descirptor is an accessor descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
export function isAccessorDescriptor (desc: any): boolean %checks {
  return !!desc &&
    (isFunction(desc.get) || isFunction(desc.set)) &&
    isBoolean(desc.configurable) &&
    isBoolean(desc.enumerable) &&
    desc.writable === undefined;
}
/**
 * to check if the descirptor is an data descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
export function isDataDescriptor (desc: any): boolean %checks {
  return !!desc &&
    desc.hasOwnProperty('value') &&
    isBoolean(desc.configurable) &&
    isBoolean(desc.enumerable) &&
    isBoolean(desc.writable);
}
/**
 * to check if the descirptor is an initiallizer descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
export function isInitializerDescriptor (desc: any): boolean %checks {
  return !!desc &&
    isFunction(desc.initializer) &&
    isBoolean(desc.configurable) &&
    isBoolean(desc.enumerable) &&
    isBoolean(desc.writable);
}
/**
 * set one value on the object
 * @param {string} key
 */
export function createDefaultSetter (key: string) {
  return function set (newValue: any): any {
    Object.defineProperty(this, key, {
      configurable: true,
      writable: true,
      // IS enumerable when reassigned by the outside word
      enumerable: true,
      value: newValue
    });
    return newValue;
  };
}

/**
 * Compress many function into one function, but this function only accept one arguments;
 * @param {Array<Function>} fns the array of function we need to compress into one function
 * @param {string} errmsg When we check that there is something is not function, we will throw an error, you can set your own error message
 */
export function compressOneArgFnArray (fns: Array<Function>, errmsg: string = 'You must pass me an array of function'): Function {
  if(!isArray(fns) || fns.length < 1) {
    throw new TypeError(errmsg);
  }
  if(fns.length === 1) {
    if(!isFunction(fns[0])) {
      throw new TypeError(errmsg);
    }
    return fns[0];
  }
  return fns.reduce((prev, curr) => {
    if(!isFunction(curr) || !isFunction(prev)) throw new TypeError(errmsg);
    return function (value) {
      return bind(curr, this)(bind(prev, this)(value));
    };
  });
}
/**
 * just a method to call console.warn, maybe i will add some handler on it someday
 * @param {anything} args
 */
export function warn (message: string): void {
  if(isFunction(console.warn)) return console.warn(message);
  console.log(message);
}

export function getOwnKeysFn () {
  const {getOwnPropertyNames, getOwnPropertySymbols} = Object;
  return isFunction(getOwnPropertySymbols)
    ? function (obj: any) {
      // $FlowFixMe: do not support symwbol yet
      return Array.from(getOwnPropertyNames(obj).concat(getOwnPropertySymbols(obj)));
    }
    : getOwnPropertyNames;
}

export const getOwnKeys = getOwnKeysFn();

export function getOwnPropertyDescriptorsFn (): Function {
  // $FlowFixMe: In some environment, Object.getOwnPropertyDescriptors has been implemented;
  return isFunction(Object.getOwnPropertyDescriptors)
    ? Object.getOwnPropertyDescriptors
    : function (obj: any) {
        return getOwnKeys(obj).reduce((descs, key) => {
          descs[key] = getOwnPropertyDescriptor(obj, key);
          return descs;
        }, {});
      };
}

export const getOwnPropertyDescriptors = getOwnPropertyDescriptorsFn();

export function compressMultipleDecorators (...fns: Array<Function>): Function {
  if(!fns.length) throw new TypeError('You must pass in decorators in compressMultipleDecorators');
  fns.forEach(fn => {if(!isFunction(fn)) throw new TypeError(`Decorators must be a function, but not "${fn}" in ${typeof fn}`);});
  if(fns.length === 1) return fns[0];
  return function (obj: any, prop: string, descirptor: Descriptor | void): Descriptor {
    // $FlowFixMe: the reduce will return a descriptor
    return fns.reduce((descirptor, fn) => {
      return fn(obj, prop, descirptor);
    }, descirptor);
  };
}
