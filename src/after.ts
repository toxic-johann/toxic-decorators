import { compressOneArgFnArray, isDescriptor } from 'helper/utils';
import { bind, isFunction } from 'lodash';
import { DataDescriptor } from 'typings/base';
export default function after(...fns: Array<(...args: any[]) => any>): MethodDecorator {
  if (fns.length === 0) {

    throw new Error('@after accept at least one parameter. If you don\'t need to preprocess after your function, do not add @after decorators');
  }
  if (fns.length > 2 && isDescriptor(fns[2])) {

    throw new Error('You may have used @after straightly. @after return decorators. You should call it before you use it as decorators');
  }
  const fn = compressOneArgFnArray(fns, '@after only accept function parameter');
  return function(obj: object, prop: string, descriptor: DataDescriptor): DataDescriptor {
    const { value, configurable, enumerable, writable } = descriptor || {
      configurable: undefined,
      enumerable: undefined,
      value: undefined,
      writable: undefined,
    };
    if (!isFunction(value)) {

      throw new TypeError(`@after can only be used on function, please checkout your property "${prop}" is a method or not.`);
    }
    const handler = function(...args: any[]) {
      const ret = bind(value, this)(...args);
      return bind(fn, this)(ret);
    };
    return {
      configurable,
      enumerable,
      value: handler,
      writable,
    };
  };
}
