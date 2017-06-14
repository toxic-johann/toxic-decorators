// @flow
import {isAccessorDescriptor} from 'helper/utils';
export default function readonly (obj: Object, prop: string, descriptor: Object): Object {
  if(isAccessorDescriptor(descriptor)) {
    descriptor.set = undefined;
    return descriptor;
  }
  descriptor.writable = false;
  return descriptor;
}
