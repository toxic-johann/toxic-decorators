// @flow
import {isVoid, isObject, isFunction, isArray, isPrimitive} from 'helper/utils';
const { defineProperty, getOwnPropertyDescriptor } = Object;

export default function applyDecorators (Class: any, props: {[string]: Array<Function> | Function}, {self = false}: {self?: boolean} = {}) {
  if(!self && !isFunction(Class)) throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
  if(self && isPrimitive(Class)) throw new TypeError("We can't apply docorators on a primitive value, even in self mode");
  if(!isObject(props)) throw new TypeError('applyDecorators only accept object as second arguments');
  const prototype = self ? Class : Class.prototype;
  if(isVoid(prototype)) throw new Error('The class muse have a prototype, please take a check');
  for (const key in props) {
    const value = props[key];
    const decorators = isArray(value) ? value : [value];

    for (let i = 0, l = decorators.length; i < l; i++) {
      const decorator = decorators[i];
      if(!isFunction(decorator)) throw new Error('The decorators set on props must be Function or Array of Function');
      const descriptor = getOwnPropertyDescriptor(prototype, key);

      defineProperty(prototype, key, decorator(prototype, key, descriptor));
    }
  }
  return Class;
}
