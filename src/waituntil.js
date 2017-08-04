// @flow
import {isFunction, isPromise, isString, isDescriptor, isPrimitive, isVoid} from 'helper/utils';
import accessor from 'accessor';
import {bind, getDeepProperty} from 'toxic-utils';
const {getOwnPropertyDescriptor, defineProperty} = Object;
export default function waituntil (key: Function | Promise<*> | string, {other}: {other?: any} = {}): Function {
  if(!isFunction(key) && !isPromise(key) && !isString(key)) throw new TypeError('@waitUntil only accept Function, Promise or String');
  return function (obj: Object, prop: string, descriptor: DataDescriptor): DataDescriptor {
    const {value, configurable} = descriptor || {};
    if(!isFunction(value)) throw new TypeError(`@waituntil can only be used on function, but not ${value} on property "${prop}"`);
    let binded = false;
    const waitingQueue = [];
    const canIRun = isPromise(key)
      ? function () {return key;}
      : isFunction(key)
        ? key
        : function () {
            // $FlowFixMe: We have use isPromise to exclude
            const keys = key.split('.');
            const prop = keys.slice(-1);
            const originTarget = isPrimitive(other) ? this : other;
            if(!binded) {
              const target = getDeepProperty(originTarget, keys.slice(0, -1));
              if(isVoid(target)) return target;
              const descriptor = getOwnPropertyDescriptor(target, prop);
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
                ? accessor({set})(target, prop, descriptor)
                : accessor({set})(target, prop, {
                  value: undefined,
                  configurable: true,
                  enumerable: true,
                  writable: true
                });
              defineProperty(target, prop, desc);
              binded = true;
            }
            return getDeepProperty(originTarget, keys);
          };
    return {
      value (...args: Array<any>) {
        const boundFn = bind(value, this);
        const runnable = bind(canIRun, this)(...args);
        if(isPromise(runnable)) {
          return Promise.resolve(runnable).then(() => {
            return bind(value, this)(...args);
          });
        } else if(runnable === true) {
          return bind(value, this)(...args);
        } else {
          return new Promise(resolve => {
            const cb = function () {
              boundFn(...args);
              resolve();
            };
            waitingQueue.push(cb);
          });
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
