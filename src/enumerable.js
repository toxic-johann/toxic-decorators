// @flow
export default function enumerable (obj: Object, prop: string, descriptor: Descriptor): Descriptor {
  if(descriptor === undefined) {
    return {
      value: undefined,
      enumerable: true,
      configurable: true,
      writable: true
    };
  }
  descriptor.enumerable = true;
  return descriptor;
}
