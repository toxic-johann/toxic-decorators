// @flow
import {isAccessorDescriptor, isFunction, warn} from 'helper/utils';
import {bind} from 'toxic-utils';
const {defineProperty} = Object;
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */
export default function lock (obj: Object, prop: string, descriptor: Descriptor): Descriptor | void {
  if(descriptor === undefined) {
    /* istanbul ignore else  */
    if(process.env.NODE_ENV !== 'production') warn(`You are using @lock on an undefined property "${prop}". This property will become a lock undefined forever, which is meaningless.`);
    return {
      value: undefined,
      writable: false,
      enumerable: true,
      configurable: false
    };
  }
  descriptor.configurable = false;
  if(isAccessorDescriptor(descriptor)) {
    const {get} = descriptor;
    descriptor.set = undefined;
    if(!isFunction(get)) {
      warn('You are using @lock on one accessor descriptor without getter. This property will become a lock undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      get () {
        const value = bind(get, this)();
        defineProperty(this, prop, {
          value,
          writable: false,
          configurable: false,
          enumerable: descriptor.enumerable
        });
        return value;
      },
      set: undefined,
      configurable: false,
      enumerable: descriptor.enumerable
    };
  }
  // $FlowFixMe: comeon, can disjoint union be reliable?
  descriptor.writable = false;
  return descriptor;
}
