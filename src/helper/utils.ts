export * from 'toxic-predicate-functions';
import { bind, isArray, isBoolean, isFunction } from 'lodash';
import { AccessorDescriptor, DataDescriptor, DecoratorFunction, InitializerDescriptor } from 'typings/base';
const { getOwnPropertyDescriptor } = Object;
/**
 * to check if an descriptor
 * @param {anything} desc
 */
export function isDescriptor(desc: any): desc is PropertyDescriptor {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  const keys = [ 'value', 'initializer', 'get', 'set' ];

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
export function isAccessorDescriptor(desc: any): desc is AccessorDescriptor {
  return desc &&
    (isFunction(desc.get) || isFunction(desc.set)) &&
    isBoolean(desc.configurable) &&
    isBoolean(desc.enumerable) &&
    desc.writable === undefined;
}
/**
 * to check if the descirptor is an data descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
export function isDataDescriptor(desc: any): desc is DataDescriptor {
  return desc &&
    desc.hasOwnProperty('value') &&
    isBoolean(desc.configurable) &&
    isBoolean(desc.enumerable) &&
    isBoolean(desc.writable);
}
/**
 * to check if the descirptor is an initiallizer descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
export function isInitializerDescriptor(desc: any): desc is InitializerDescriptor {
  return desc &&
    isFunction(desc.initializer) &&
    isBoolean(desc.configurable) &&
    isBoolean(desc.enumerable) &&
    isBoolean(desc.writable);
}
/**
 * set one value on the object
 * @param {string} key
 */
export function createDefaultSetter(key: string) {
  return function set(newValue: any): any {
    Object.defineProperty(this, key, {
      configurable: true,
      // IS enumerable when reassigned by the outside word
      enumerable: true,
      value: newValue,
      writable: true,
    });
    return newValue;
  };
}
/**
 * Compress many functions into one function, but these function should only accept one argument;
 * @param {Array<Function>} fns the array of function we need to compress
 * @param {string} errmsg When we check that there is something which is not a function, we will throw an error.
 * You can set your own error message through that.
 */
export function compressOneArgFnArray<T>(
  fns: Array<(obj: T) => T>,
  errmsg: string = 'You must pass me an array of function',
): (obj: T) => T {
  if (!isArray(fns) || fns.length < 1) {
    throw new TypeError(errmsg);
  }
  if (fns.length === 1) {
    if (!isFunction(fns[0])) {
      throw new TypeError(errmsg);
    }
    return fns[0];
  }
  return fns.reduce((prev, curr) => {
    if (!isFunction(curr) || !isFunction(prev)) { throw new TypeError(errmsg); }
    return function(value: any): any {
      return bind(curr, this)(bind(prev, this)(value));
    };
  });
}
/**
 * just a method to call console.warn, maybe i will add some handler on it someday
 * @param {anything} args
 */
export function warn(message: string): void {
  /* tslint:disable:no-console */
  if (isFunction(console.warn)) { return console.warn(message); }
  console.log(message);
  /* tslint:enable:no-console */
}

export function getOwnKeysFn() {
  const { getOwnPropertyNames, getOwnPropertySymbols } = Object;
  return isFunction(getOwnPropertySymbols)
    ? (obj: any) => [ ...getOwnPropertySymbols(obj), ...getOwnPropertyNames(obj)]
    : getOwnPropertyNames;
}

export const getOwnKeys = getOwnKeysFn();

export function getOwnPropertyDescriptorsFn<T>(): (o: T) => { [P in keyof T]: TypedPropertyDescriptor<T[P]>; } & {
  [x: string]: PropertyDescriptor;
} {
  // @ts-ignore: A polyfill for getOwnPropertyDescriptors
  return isFunction(Object.getOwnPropertyDescriptors)
    ? Object.getOwnPropertyDescriptors
    : (obj: any) => {
      return getOwnKeys(obj).reduce((descs: { [x: string]: PropertyDescriptor }, key) => {
        // @ts-ignore: ignore symbol
        descs[key] = getOwnPropertyDescriptor(obj, key);
        return descs;
      }, {});
    };
}

export const getOwnPropertyDescriptors = getOwnPropertyDescriptorsFn();

export function compressMultipleDecorators(...fns: DecoratorFunction[]): DecoratorFunction {
  if (!fns.length) { throw new TypeError('You must pass in decorators in compressMultipleDecorators'); }
  fns.forEach((fn) => {
    if (!isFunction(fn)) {
      throw new TypeError(`Decorators must be a function, but not "${fn}" in ${typeof fn}`);
    }
  });
  if (fns.length === 1) { return fns[0]; }
  return (obj: any, prop: string, descirptor: PropertyDescriptor | void): PropertyDescriptor => {
    // @ts-ignore: must return PropertyDescriptor as the number of function is bigger than zero
    return fns.reduce((aDescirptor: PropertyDescriptor | void, fn) => {
      return fn(obj, prop, aDescirptor);
    }, descirptor);
  };
}
