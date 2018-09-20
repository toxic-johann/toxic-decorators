export default function nonenumerable(obj: object, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (descriptor === undefined) {
    return {
      configurable: true,
      enumerable: false,
      value: undefined,
      writable: true,
    };
  }
  descriptor.enumerable = false;
  return descriptor;
}
