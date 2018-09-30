export default function configurable(obj: object, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (descriptor === undefined) {
    return {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: true,
    };
  }
  descriptor.configurable = true;
  return descriptor;
}
