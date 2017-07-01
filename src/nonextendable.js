// @flow
import initialize from 'initialize';
const {preventExtensions} = Object;
export default function nonextendable (obj: any, prop: string, descriptor: Descriptor): Descriptor {
  if(descriptor === undefined) throw new Error('@nonextendable could not handle undefined');
  return initialize(function (value) {
    preventExtensions(value);
    return value;
  })(obj, prop, descriptor);
}
