// @flow
import {isVoid, isObject, isFunction, isArray, isPrimitive, compressMultipleDecorators, warn} from 'helper/utils';
const { defineProperty, getOwnPropertyDescriptor } = Object;

export default function applyDecorators (Class: any, props: {[string]: Array<Function> | Function} | Function | Array<Function>, {
  self = false,
  omit = false
}: {
  self?: boolean,
  omit?: boolean
} = {}) {
  const isPropsFunction = isFunction(props);
  if(isPropsFunction || isArray(props)) {
    // apply decorators on class
    if(!isFunction(Class)) throw new TypeError('If you want to decorator class, you must pass it a legal class');
    // $FlowFixMe: Terrible union, it's function now
    if(isPropsFunction) props(Class);
    else {
      // $FlowFixMe: Terrible union, it's array now
      for(let i = 0, len = props.length; i < len; i++) {
        // $FlowFixMe: Terrible union, it's array now
        const fn = props[i];
        if(!isFunction(fn)) throw new TypeError('If you want to decorate an class, you must pass it function or array of function');
        fn(Class);
      }
    }
    return Class;
  }
  if(!self && !isFunction(Class)) throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
  if(self && isPrimitive(Class)) throw new TypeError("We can't apply docorators on a primitive value, even in self mode");
  if(!isObject(props)) throw new TypeError('applyDecorators only accept object as second arguments');
  const prototype = self ? Class : Class.prototype;
  if(isVoid(prototype)) throw new Error('The class muse have a prototype, please take a check');
  for (const key in props) {
    const value = props[key];
    const decorators = isArray(value) ? value : [value];
    let handler;
    try {
      handler = compressMultipleDecorators(...decorators);
    } catch (err) {
      /* istanbul ignore else  */
      if(process.env.NODE_ENV !== 'production') warn(err && err.message);
      throw new Error('The decorators set on props must be Function or Array of Function');
    }
    const descriptor = getOwnPropertyDescriptor(prototype, key);
    if(descriptor && !descriptor.configurable) {
      if(!omit) throw new Error(`${key} of ${prototype} is unconfigurable`);
      continue;
    }
    defineProperty(prototype, key, handler(prototype, key, descriptor));
  }
  return Class;
}
