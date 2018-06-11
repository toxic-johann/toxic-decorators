// @flow
export default function nonconfigurable(obj: Object, prop: string, descriptor: Descriptor): Descriptor {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: true,
      configurable: false,
      writable: true,
    };
  }
  descriptor.configurable = false;
  return descriptor;
}
