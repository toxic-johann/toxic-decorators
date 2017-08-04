// @flow
import {isAccessorDescriptor, warn} from 'helper/utils';
export default function readonly (obj: Object, prop: string, descriptor: Descriptor): Descriptor {
  if(descriptor === undefined) {
    /* istanbul ignore else  */
    if(process.env.NODE_ENV !== 'production') warn(`You are using @readonly on an undefined property "${prop}". This property will become a readonly undefined forever, which is meaningless.`);
    return {
      value: undefined,
      writable: false,
      enumerable: true,
      configurable: true
    };
  }
  if(isAccessorDescriptor(descriptor)) {
    descriptor.set = undefined;
    return descriptor;
  }
  // $FlowFixMe: disjoint union makes me disappointed
  descriptor.writable = false;
  return descriptor;
}
