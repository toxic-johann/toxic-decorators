import initialize from './initialize';
const { preventExtensions } = Object;
export default function nonextendable(obj: any, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (descriptor === undefined) {
    throw new Error(`@nonextendable could not handle undefined property "${prop}".`);
  }
  // @ts-ignore: decorator can run as function in javascript
  return initialize(function(value) {
    preventExtensions(value);
    return value;
  })(obj, prop, descriptor);
}
