export default function nonconfigurable(obj: object, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (descriptor === undefined) {
    return {
      configurable: false,
      enumerable: true,
      value: undefined,
      writable: true,
    };
  }
  descriptor.configurable = false;
  return descriptor;
}
