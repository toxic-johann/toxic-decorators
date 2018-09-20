export default function enumerable(obj: object, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (descriptor === undefined) {
    return {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: true,
    };
  }
  descriptor.enumerable = true;
  return descriptor;
}
