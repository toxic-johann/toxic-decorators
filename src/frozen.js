// @flow
import {isAccessorDescriptor} from 'helper/utils';
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */
export default function frozen (obj: Object, prop: string, descriptor: DataDescriptor): DataDescriptor {
  if(isAccessorDescriptor(descriptor)) {
    throw new TypeError("@frozen can't be used on accessor descriptor");
  }
  descriptor.writable = false;
  descriptor.enumerable = false;
  descriptor.configurable = false;
  return descriptor;
}
