import { DataDescriptor } from 'helper/types';
import { compressOneArgFnArray, isDescriptor } from 'helper/utils';
import { bind, isFunction } from 'lodash';
export default function after(...fns: Array<(...args: any[]) => any>): (...args: any[]) => any {
  if (fns.length === 0) {
    // tslint:disable-next-line: max-line-length
    throw new Error('@after accept at least one parameter. If you don\'t need to preprocess after your function, do not add @after decorators');
  }
  if (fns.length > 2 && isDescriptor(fns[2])) {
    // tslint:disable-next-line: max-line-length
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
      // tslint:disable-next-line: max-line-length
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
