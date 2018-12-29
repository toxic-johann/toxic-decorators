import { isAccessorDescriptor, warn } from 'helper/utils';
import { bind, isFunction } from 'lodash';
const { defineProperty } = Object;
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */
export default function frozen(obj: object, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor | void {
  if (descriptor === undefined) {
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') {

      warn('You are using @frozen on an undefined property. This property will become a frozen undefined forever, which is meaningless');
    }
    return {
      configurable: false,
      enumerable: false,
      value: undefined,
      writable: false,
    };
  }
  descriptor.enumerable = false;
  descriptor.configurable = false;
  if (isAccessorDescriptor(descriptor)) {
    const { get } = descriptor;
    descriptor.set = undefined;
    if (!isFunction(get)) {
      /* istanbul ignore else  */
      if (process.env.NODE_ENV !== 'production') {

        warn('You are using @frozen on one accessor descriptor without getter. This property will become a frozen undefined finally.Which maybe meaningless.');
      }
      return;
    }
    return {
      configurable: false,
      enumerable: false,
      get() {
        const value = bind(get, this)();
        defineProperty(this, prop, {
          configurable: false,
          enumerable: false,
          value,
          writable: false,
        });
        return value;
      },
      set: undefined,
    };
  }
  descriptor.writable = false;
  return descriptor;
}
