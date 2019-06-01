import { isArray, isFunction, isNil, isObject } from 'lodash-es';
import { getOwnKeys, getOwnPropertyDescriptors } from '../helper/utils';
const { defineProperty } = Object;
export default function classify(
  decorator: MethodDecorator | PropertyDecorator | ((...args: any[]) => (MethodDecorator | PropertyDecorator)),
  {
    requirement,
    customArgs = false,
  }: {
    requirement?: (...args: any[]) => any,
    customArgs?: boolean,
  } = {}): (
    opt?: {
      exclude?: string[],
      include?: string[],
      construct?: boolean,
      self?: boolean,
    },
    // tslint:disable-next-line: trailing-comma
    ...args: any[]
  ) => ClassDecorator {
  return function(
    {
      exclude = [],
      include = [],
      construct = false,
      self = false,
    }: {
      exclude?: string[],
      include?: string[],
      construct?: boolean,
      self?: boolean,
    } = {},
    // tslint:disable-next-line: trailing-comma
    ...args: any[]
  ): ClassDecorator {
    if (!isArray(exclude)) { throw new TypeError('options.exclude must be an array'); }
    if (!isArray(include)) { throw new TypeError('options.include must be an array'); }
    // tslint:disable-next-line: ban-types
    return function(Klass: any): void {
      const isClass = isFunction(Klass);
      if (!self && !isClass) {
        throw new TypeError(`@${decorator.name}Class can only be used on class`);
      }
      if (self && !isObject(Klass)) {
        throw new TypeError(`@${decorator.name}Class must be used on non-primitive type value in 'self' mode`);
      }
      const prototype = self ? Klass : Klass.prototype;
      if (isNil(prototype)) { throw new Error(`The prototype of the ${Klass.name} is empty, please check it`); }
      const descs = getOwnPropertyDescriptors(prototype);
      getOwnKeys(prototype)
        .concat(include)
        .forEach((key) => {
          const desc = descs[(key as string)];
          if ((key === 'constructor' && !construct) ||
          (self && isClass && [ 'name', 'length', 'prototype' ].indexOf((key as string)) > -1) ||
          exclude.indexOf((key as string)) > -1 ||
          isFunction(requirement) && requirement(prototype, key, desc, { self }) === false) { return; }
          defineProperty(prototype, key, (
            customArgs
              // @ts-ignore: ignore the arguments length
              ? decorator(...args)
              : decorator
            )(prototype, key, desc));
        });
    };
  };
}
