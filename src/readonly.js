// @flow
export default function readonly (obj: Object, prop: string, descriptor: descriptor): descriptor {
  descriptor.writable = false;
  return descriptor;
}
