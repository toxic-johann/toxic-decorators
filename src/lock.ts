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
export default function lock(obj: object, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor | void {
  if (descriptor === undefined) {
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') {
      // tslint:disable-next-line: max-line-length
      warn(`You are using @lock on an undefined property "${prop}". This property will become a lock undefined forever, which is meaningless.`);
    }
    return {
      configurable: false,
      enumerable: true,
      value: undefined,
      writable: false,
    };
  }
  descriptor.configurable = false;
  if (isAccessorDescriptor(descriptor)) {
    const { get } = descriptor;
    descriptor.set = undefined;
    if (!isFunction(get)) {
      // tslint:disable-next-line: max-line-length
      warn('You are using @lock on one accessor descriptor without getter. This property will become a lock undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      configurable: false,
      enumerable: descriptor.enumerable,
      get() {
        // $FlowFixMe: get is a function now
        const value = bind(get, this)();
        defineProperty(this, prop, {
          configurable: false,
          enumerable: descriptor.enumerable,
          value,
          writable: false,
        });
        return value;
      },
      set: undefined,
    };
  }
  // $FlowFixMe: comeon, can disjoint union be reliable?
  descriptor.writable = false;
  return descriptor;
}