// @flow
import {getOwnKeys, getOwnPropertyDescriptors, isVoid, isFunction, isArray, isPrimitive} from 'helper/utils';
const {defineProperty} = Object;
export default function classify (decorator: Function, {
  requirement,
  customArgs = false
}: {
  requirement?: Function,
  customArgs?: boolean
} = {}): Function {
  return function ({
    exclude = [],
    include = [],
    construct = false,
    self = false,
  }: {
    exclude?: Array<string>,
    include?: Array<string>,
    construct?: boolean,
    self?: boolean
  } = {}, ...args: any): Function {
    if(!isArray(exclude)) throw new TypeError('options.exclude must be an array');
    if(!isArray(include)) throw new TypeError('options.include must be an array');
    return function (Klass: Function): void {
      const isClass = isFunction(Klass);
      if(!self && !isClass) throw new TypeError(`@${decorator.name}Class can only be used on class`);
      if(self && isPrimitive(Klass)) throw new TypeError(`@${decorator.name}Class must be used on non-primitive type value in 'self' mode`);
      const prototype = self ? Klass : Klass.prototype;
      if(isVoid(prototype)) throw new Error(`The prototype of the ${Klass.name} is empty, please check it`);
      const descs = getOwnPropertyDescriptors(prototype);
      getOwnKeys(prototype)
      .concat(include)
      .forEach(key => {
        const desc = descs[key];
        if((key === 'constructor' && !construct) ||
          (self && isClass && ['name', 'length', 'prototype'].indexOf(key) > -1) ||
          exclude.indexOf(key) > -1 ||
          isFunction(requirement) && requirement(prototype, key, desc, {self}) === false) return;
        defineProperty(prototype, key, (customArgs ? decorator(...args) : decorator)(prototype, key, desc));
      });
    };
  };
}
