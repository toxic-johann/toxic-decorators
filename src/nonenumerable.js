// @flow
export default function nonenumerable (obj: Object, prop: string, descriptor: Descriptor): Descriptor {
  if(descriptor === undefined) {
    return {
      value: undefined,
      enumerable: false,
      configurable: true,
      writable: true
    };
  }
  descriptor.enumerable = false;
  return descriptor;
}
