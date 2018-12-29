import { isDescriptor } from 'helper/utils';
import { bind, isArray, isFunction } from 'lodash';
import { DataDescriptor } from 'typings/base';

export default function before(...fns: Array<(...args: any[]) => any>): (obj: object, prop: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => DataDescriptor {
  if (fns.length === 0) {
    throw new Error('@before accept at least one parameter. If you don\'t need to preprocess before your function, do not add @before decorators');
  }
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @before straightly, @before return decorators, you should call it before you set it as decorator.');
  }
  for (let i = fns.length - 1; i > -1; i--) {
    if (!isFunction(fns[i])) { throw new TypeError('@before only accept function parameter'); }
  }
  return function(obj: object, prop: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>): DataDescriptor {
    const { value: fn, configurable, enumerable, writable } = descriptor || {
      configurable: undefined,
      enumerable: undefined,
      value: undefined,
      writable: undefined,
    };
    if (!isFunction(fn)) {
      throw new TypeError(`@before can only be used on function, please check the property "${prop}" is a method or not.`);
    }
    const handler = function(...args: any[]) {
      const paras = fns.reduce((paras, fn) => {
        const result = bind(fn, this)(...paras);
        return result === undefined
          ? paras
          : isArray(result)
            ? result
            : [ result ];
      }, args);
      return bind(fn, this)(...paras);
    };
    return {
      configurable,
      enumerable,
      value: handler,
      writable,
    };
  };
}
