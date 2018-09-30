import { compressMultipleDecorators, warn } from 'helper/utils';
import { isArray, isFunction, isNil, isObject, isPlainObject } from 'lodash';
import { PropertyOrMethodOrClassDecorator } from 'typings/base';
const { defineProperty, getOwnPropertyDescriptor } = Object;

export default function applyDecorators(
  Class: any,
  props: {[x: string]: PropertyOrMethodOrClassDecorator[] | PropertyOrMethodOrClassDecorator }
    | PropertyOrMethodOrClassDecorator
    | PropertyOrMethodOrClassDecorator[],
  {
    self = false,
    omit = false,
  }: {
    self?: boolean,
    omit?: boolean,
  // tslint:disable-next-line: trailing-comma
  } = {}
) {
  const isPropsFunction = isFunction(props);
  if (isPropsFunction || isArray(props)) {
    // apply decorators on class
    if (!isFunction(Class)) {
      throw new TypeError('If you want to decorator class, you must pass it a legal class');
    }
    if (isPropsFunction) {
      // @ts-ignore: decorator can run as function in javascript
      props(Class);
    } else {
      for (let i = 0, len = props.length; i < len; i++) {
        const fn = (props as PropertyOrMethodOrClassDecorator[])[i];
        if (!isFunction(fn)) {
          throw new TypeError('If you want to decorate an class, you must pass it function or array of function');
        }
        fn(Class);
      }
    }
    return Class;
  }
  if (!self && !isFunction(Class)) {
    // tslint:disable-next-line: max-line-length
    throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
  }
  if (self && !isObject(Class)) {
    throw new TypeError('We can\'t apply docorators on a primitive value, even in self mode');
  }
  if (!isPlainObject(props)) { throw new TypeError('applyDecorators only accept object as second arguments'); }
  const prototype = self ? Class : Class.prototype;
  if (isNil(prototype)) { throw new Error('The class muse have a prototype, please take a check'); }
  // tslint:disable-next-line: forin
  for (const key in props) {
    const value = (props as {[x: string]: PropertyOrMethodOrClassDecorator[] | PropertyOrMethodOrClassDecorator })[key];
    const decorators = isArray(value) ? value : [ value ];
    let handler;
    try {
      handler = compressMultipleDecorators(...decorators);
    } catch (err) {
      /* istanbul ignore else  */
      if (process.env.NODE_ENV !== 'production') { warn(err && err.message); }
      throw new Error('The decorators set on props must be Function or Array of Function');
    }
    const descriptor = getOwnPropertyDescriptor(prototype, key);
    if (descriptor && !descriptor.configurable) {
      if (!omit) { throw new Error(`${key} of ${prototype} is unconfigurable`); }
      continue;
    }
    defineProperty(
      prototype,
      key,
      // @ts-ignore: decorator can run as function in javascript
      // tslint:disable-next-line trailing-comma
      handler(prototype, key, descriptor)
    );
  }
  return Class;
}
