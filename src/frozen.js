// @flow
import {isAccessorDescriptor, bind, isFunction, warn} from 'helper/utils';
const {defineProperty} = Object;
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */
export default function frozen (obj: Object, prop: string, descriptor: Descriptor): Descriptor | void {
  descriptor.enumerable = false;
  descriptor.configurable = false;
  if(isAccessorDescriptor(descriptor)) {
    const {get} = descriptor;
    descriptor.set = undefined;
    if(!isFunction(get)) {
      warn('You are using @frozen on one accessor descriptor without getter. This property will become a frozen undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      get () {
        const value = bind(get, this)();
        defineProperty(this, prop, {
          value,
          writable: false,
          configurable: false,
          enumerable: false
        });
        return value;
      },
      set: undefined,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
  }
  // $FlowFixMe: comeon, can disjoint union be reliable?
  descriptor.writable = false;
  return descriptor;
}
