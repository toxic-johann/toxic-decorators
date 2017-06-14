// @flow
export default function before (...args: Array<Function>) {
  return function (obj: Object, prop: string, descriptor: DataDescriptor) {}
}
