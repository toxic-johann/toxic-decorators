// @flow
import {isFunction, isPromise, bind, isString, isDescriptor} from 'helper/utils';
import accessor from 'accessor';
const {getOwnPropertyDescriptor, defineProperty} = Object;
export default function waituntil (fn: Function | Promise<*> | string): Object {
  if(!isFunction(fn) && !isPromise(fn) && !isString(fn)) throw new TypeError('@waitUntil only accept Function, Promise or String');
  if(isPromise(fn)) {
    const promise = fn;
    fn = function () {return promise;};
  }
  const waitingQueue = [];
  return function (obj: Object, prop: string, {value, configurable, enumerable, writable}: {value: Function, configurable: boolean, enumerable: boolean, writable: boolean}) {
    if(!isFunction(value)) throw new TypeError(`@waituntil can only be used on function, but not ${value}`);
    if(isString(fn)) {
      const descriptor = getOwnPropertyDescriptor(obj, fn);
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
      /**
       * we may handle different descriptor
       * 1. we may get an accessor desciptor
       *    if user pass into an getter/setter property
       * 2. we may handle an data descriptor
       *    if user pass into an static property etc
       * 3. we may got nothing
       *    if user pass into property on instance
       */
      const desc = isDescriptor(descriptor)
        ? accessor({set})(obj, fn, descriptor)
        : accessor({set})(obj, fn, {
          value: undefined,
          configurable: true,
          enumerable: true,
          writable: true
        });
      defineProperty(obj, fn, desc);
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
