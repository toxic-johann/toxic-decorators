// @flow
import {isFunction, isPromise, bind} from 'helper/utils';
export default function waituntil (fn: Function): Object {
  if(!isFunction(fn)) throw new TypeError('@waitUntil only accept function');
  return function (obj: Object, prop: string, { value, configurable, enumerable, writable}: {value: Function, configurable: boolean, enumerable: boolean, writable: boolean}) {
    if(!isFunction(value)) throw new TypeError('@verificate can only be used on function, but not ${value}');
    return {
      value (...args: Array<any>) {
        const runnable = bind(fn, this)(...args);
        if(isPromise(runnable)) {
          return Promise.resolve(runnable).then(() => {
            bind(value, this)(...args);
          });
        } else if(runnable !== false) {
          return bind(value, this)(...args);
        }
      },
      enumerable,
      configurable,
      writable
    };
  };
}
