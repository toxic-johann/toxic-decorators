import { bind, isFunction, isNil, isObject, isString } from 'lodash-es';
import { getDeepProperty } from 'toxic-utils';
import accessor from './accessor';
import { isDescriptor, isPromise } from './helper/utils';
import { DataDescriptor} from './typings/base';
const { getOwnPropertyDescriptor, defineProperty } = Object;
export default function waituntil(
  key: ((...args: any[]) => (Promise<any> | boolean)) | Promise<any> | string,
  { other }: {other?: any} = {},
): MethodDecorator {
  if (!isFunction(key) && !isPromise(key) && !isString(key)) {
    throw new TypeError('@waitUntil only accept Function, Promise or String');
  }
  return function(obj: object, prop: string, descriptor: DataDescriptor): DataDescriptor {
    const { value, configurable } = descriptor || {
      configurable: undefined,
      value: undefined,
    };
    if (!isFunction(value)) {
      throw new TypeError(`@waituntil can only be used on function, but not ${value} on property "${prop}"`);
    }
    let binded = false;
    const waitingQueue: Array<(...args: any[]) => any> = [];
    const canIRun = isPromise(key)
      ? function() { return key; }
      : isFunction(key)
        ? key
        : function() {
          const keys = key.split('.');
          const [ prop ] = keys.slice(-1);
          const originTarget = !isObject(other) ? this : other;
          if (!binded) {
            const target = getDeepProperty(originTarget, keys.slice(0, -1));
            if (isNil(target)) { return target; }
            const descriptor = getOwnPropertyDescriptor(target, prop);
            /**
             * create a setter hook here
             * when it get ture, it will run all function in waiting queue immediately
             */
            const set = function(value: any) {
              if (value === true) {
                while (waitingQueue.length > 0) {
                  waitingQueue[0]();
                  waitingQueue.shift();
                }
              }
              return value;
            };
            const desc = isDescriptor(descriptor)
              ? accessor({ set })(target, prop, descriptor)
              : accessor({ set })(target, prop, {
                configurable: true,
                enumerable: true,
                value: undefined,
                writable: true,
              });
            if (desc) {
              defineProperty(target, prop, desc);
            }
            binded = true;
          }
          return getDeepProperty(originTarget, keys);
        };
    return {
      configurable,
      // function should not be enmuerable
      enumerable: false,
      value(...args: any[]) {
        const boundFn = bind(value, this);
        const runnable = bind(canIRun, this)(...args);
        if (isPromise(runnable)) {
          return Promise.resolve(runnable).then(() => {
            return bind(value, this)(...args);
          });
        } else if (runnable === true) {
          return bind(value, this)(...args);
        }
        return new Promise((resolve) => {
          const cb = function() {
            boundFn(...args);
            resolve();
          };
          waitingQueue.push(cb);
        });

      },
      // as we have delay this function
      // it's not a good idea to change it
      writable: false,
    };
  };
}
