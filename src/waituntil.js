// @flow
import {isFunction, isPromise, bind, isString, isDescriptor, isPrimitive} from 'helper/utils';
import accessor from 'accessor';
const {getOwnPropertyDescriptor, defineProperty} = Object;
export default function waituntil (fn: Function | Promise<*> | string, other?: any): Object {
  if(!isFunction(fn) && !isPromise(fn) && !isString(fn)) throw new TypeError('@waitUntil only accept Function, Promise or String');
  if(isPromise(fn)) {
    const promise = fn;
    fn = function () {return promise;};
  }
  const waitingQueue = [];
  return function (obj: Object, prop: string, {value, configurable, enumerable, writable}: {value: Function, configurable: boolean, enumerable: boolean, writable: boolean}) {
    if(!isFunction(value)) throw new TypeError(`@waituntil can only be used on function, but not ${value}`);
    if(isString(fn)) {
      const target = isPrimitive(other) ? obj : other;
      const descriptor = getOwnPropertyDescriptor(target, fn);
      /**
       * create a setter hook here
       * when it get ture, it will run all function in waiting queue immediately
       */
      const set = function (value) {
        if(value === true) {
          while(waitingQueue.length > 0) {
            waitingQueue[0]();
            waitingQueue.shift();
          }
        }
        return value;
      };
      const desc = isDescriptor(descriptor)
        ? accessor({set})(target, fn, descriptor)
        : accessor({set})(target, fn, {
          value: undefined,
          configurable: true,
          enumerable: true,
          writable: true
        });
      defineProperty(target, fn, desc);
    }
    return {
      value (...args: Array<any>) {
        const boundFn = bind(value, this);
        if(isString(fn)) {
          // if we can run the function we run it
          if(this[fn]) return boundFn(...args);
          // else we just put it into waiting queue
          const cb = () => boundFn(...args);
          waitingQueue.push(cb);
          return;
        }
        // $FlowFixMe: we have change promise into function
        const runnable = bind(fn, this)(...args);
        if(isPromise(runnable)) {
          return Promise.resolve(runnable).then(() => {
            return bind(value, this)(...args);
          });
        } else if(runnable === true) {
          return bind(value, this)(...args);
        }
      },
      // function should not be enmuerable
      enumerable: false,
      configurable,
      // as we have delay this function
      // it's not a good idea to change it
      writable: false
    };
  };
}
