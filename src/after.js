// @flow
import {isFunction, isDescriptor, compressOneArgFnArray} from 'helper/utils';
import {bind} from 'toxic-utils';
export default function after (...fns: Array<Function>): Function {
  if(fns.length === 0) throw new Error("@after accept at least one parameter. If you don't need to preprocess after your function, do not add @after decorators");
  if(fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may have used @after straightly. @after return decorators. You should call it before you use it as decorators');
  }
  const fn = compressOneArgFnArray(fns, '@after only accept function parameter');
  return function (obj: Object, prop: string, descriptor: DataDescriptor): DataDescriptor {
    const {value, configurable, enumerable, writable} = descriptor || {};
    if(!isFunction(value)) throw new TypeError(`@after can only be used on function, please checkout your property "${prop}" is a method or not.`);
    const handler = function (...args: any) {
      const ret = bind(value, this)(...args);
      return bind(fn, this)(ret);
    };
    return {
      value: handler,
      configurable,
      enumerable,
      writable
    };
  };
}
