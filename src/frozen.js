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
  descriptor.enumerable = false;
  descriptor.configurable = false;
  if(isAccessorDescriptor(descriptor)) {
    descriptor.set = undefined;
    return descriptor;
  }
  descriptor.writable = false;
  return descriptor;
}
