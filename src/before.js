// @flow
import {isFunction, isArray, bind, isDescriptor} from 'helper/utils';
export default function before (...fns: Array<Function>): Function {
  if(fns.length === 0) throw new Error("@before accept at least one parameter. If you don't need to preprocess before your function, do not add @before decorators");
  if(fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @before straightly, @before return decorators, you need to call it');
  }
  for(let i = fns.length - 1; i > -1; i--) {
    if(!isFunction(fns[i])) throw new TypeError('@before only accept function parameter');
  }
  return function (obj: Object, prop: string, descriptor: DataDescriptor): DataDescriptor {
    if(descriptor === undefined) {
      throw new Error('@before must used on descriptor, are you using it on undefined property?');
    }
    const {value: fn, configurable, enumerable, writable} = descriptor;
    if(!isFunction(fn)) throw new TypeError('@before can only be used on function');
    const handler = function (...args: any) {
        const paras = fns.reduce((paras, fn) => {
          const result = bind(fn, this)(...paras);
          return result === undefined
            ? paras
            : isArray(result)
              ? result
              // $FlowFixMe: what the hell, it can be anything
              : [result];
        }, args);
        return bind(fn, this)(...paras);
      };
      return {
        value: handler,
        configurable,
        enumerable,
        writable
      };
  };
}
