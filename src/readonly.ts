import { isAccessorDescriptor, warn } from 'helper/utils';
export default function readonly(obj: object, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (descriptor === undefined) {
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') {

      warn(`You are using @readonly on an undefined property "${prop}". This property will become a readonly undefined forever, which is meaningless.`);
    }
    return {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: false,
    };
  }
  if (isAccessorDescriptor(descriptor)) {
    descriptor.set = undefined;
    return descriptor;
  }
  descriptor.writable = false;
  return descriptor;
}
