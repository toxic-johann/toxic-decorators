// @flow
export * from 'toxic-predicate-functions';
import {isFunction, isArray, isObject, isBoolean, isString, isPrimitive, isVoid} from 'toxic-predicate-functions';
const {getOwnPropertyNames, getOwnPropertySymbols, getOwnPropertyDescriptor} = Object;
// **********************  对象操作  ************************
/**
 * 转变一个类数组对象为数组
 */
export function makeArray (obj: any): Array<any> {
  return Array.from(obj);
}
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
 * 生成深度遍历函数的处理器，常用于生成深度拷贝等
 * @param  {Function} fn 遍历到深度变量的时候的操作
 * @return {Function}     可用的操作函数
 */
export function genTraversalHandler (fn: Function): Function {
  function recursiveFn (source, target, key) {
    if(isArray(source) || isObject(source)) {
      target = target || (isObject(source) ? {} : []);
      for(const key in source) {
        target[key] = recursiveFn(source[key], target[key], key);
      }
      return target;
    }
    return fn(source, target, key);
  };
  return recursiveFn;
};
const _deepAssign = genTraversalHandler(val => val);
/**
 * 对象克隆
 * @param  {Array|Object} source 传其他值会直接返回
 * @return {clone-target}        [description]
 */
export function deepClone<T: Object | Array<any>> (source: T): T {
  if(isPrimitive(source)) {
      throw new TypeError('deepClone only accept non primitive type');
    }
  return _deepAssign(source);
};
/**
 * merge multiple objects
 * @param  {...Object} args [description]
 * @return {merge-object}         [description]
 */
export function deepAssign<T: any> (...args: Array<T>): T & T {
  if(args.length < 2) {
    throw new Error('deepAssign accept two and more argument');
  }
  for(let i = args.length - 1; i > -1; i--) {
    if(isPrimitive(args[i])) {
      throw new TypeError('deepAssign only accept non primitive type');
    }
  }
  const target = args.shift();
  args.forEach(source => _deepAssign(source, target));
  return target;
}

/**
 * camelize any string, e.g hello world -> helloWorld
 * @param  {string} str only accept string!
 * @return {string}     camelize string
 */
export function camelize (str: string, isBig: ?boolean): string {
  return str.replace(/(^|[^a-zA-Z]+)([a-zA-Z])/g, function (match, spilt, initials, index) {
    return (!isBig && index === 0)
      ? initials.toLowerCase()
      : initials.toUpperCase();
  });
}
/**
 * hypenate any string e.g hello world -> hello-world
 * @param  {string} str only accept string
 * @return {string}
 */
export function hypenate (str: string): string {
  return camelize(str).replace(/([A-Z])/g, match => '-' + match.toLowerCase());
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
 * bind the function with some context. we have some fallback strategy here
 * @param {function} fn the function which we need to bind the context on
 * @param {any} context the context object
 */
export function bind (fn: Function, context: any): Function {
  if (fn.bind) {
    return fn.bind(context);
  } else if(fn.apply) {
    return function __autobind__ (...args: any) {
      return fn.apply(context, args);
    };
  } else {
    return function __autobind__ (...args: any) {
      return fn.call(context, ...args);
    };
  }
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
export function warn (...args: any): void {
  const {warn, log} = console;
  if(isFunction(warn)) return warn(...args);
  log(...args);
}

export function getDeepProperty (obj: any, keys: string | Array<string>, {
  throwError = false,
  backup,
}: {
  throwError?: boolean,
  backup?: any
} = {}) {
  if(isString(keys)) {
    keys = keys.split('.');
  }
  if(!isArray(keys)) {
    throw new TypeError('keys of getDeepProperty must be string or Array<string>');
  }
  const read = [];
  let target = obj;
  for(let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    if(isVoid(target)) {
      if(throwError) {
        throw new Error(`obj${read.length > 0 ? ('.' + read.join('.')) : ' itself'} is ${target}`);
      } else {
        return backup;
      }
    }
    target = target[key];
    read.push(key);
  }
  return target;
}

export const getOwnKeys = isFunction(getOwnPropertySymbols)
  ? function (obj: any) {
    // $FlowFixMe: do not support symwbol yet
    return getOwnPropertyNames(obj).concat(getOwnPropertySymbols(obj));
  }
  : getOwnPropertyNames;

// $FlowFixMe: In some environment, Object.getOwnPropertyDescriptors has been implemented;
export const getOwnPropertyDescriptors = isFunction(Object.getOwnPropertyDescriptors)
  ? Object.getOwnPropertyDescriptors
  : function (obj: any) {
      return getOwnKeys(obj).reduce((descs, key) => {
        descs[key] = getOwnPropertyDescriptor(obj, key);
        return descs;
      }, {});
    };

export function compressMultipleDecorators (...fns: Array<Function>): Function {
  const fnOnlyErrorMsg = 'compressMultipleDecorators only accept function';
  if(fns.length === 1) {
    if(!isFunction(fns[0])) throw new TypeError(fnOnlyErrorMsg);
    return fns[0];
  }
  return function (obj: any, prop: string, descirptor: Descriptor | void): Descriptor {
    // $FlowFixMe: the reduce will return a descriptor
    return fns.reduce((descirptor, fn) => {
      if(!isFunction(fn)) throw new TypeError(fnOnlyErrorMsg);
      return fn(obj, prop, descirptor);
    }, descirptor);
  };
}
