// @flow
import {isFunction, isString, isPrimitive} from 'helper/utils';
import {bind, getDeepProperty} from 'toxic-utils';
export default function runnable (key: Function | string, {
  other,
  backup
}: {
  other?: any,
  backup?: Function
} = {}): Function {
  if(!isFunction(key) && !isString(key)) throw new TypeError('@runnable only accept Function or String');
  return function (obj: Object, prop: string, descriptor: DataDescriptor): DataDescriptor {
    const {value, configurable} = descriptor || {};
    if(!isFunction(value)) throw new TypeError(`@runnable can only be used on method, but not ${value} on property "${prop}".`);
    const canIRun = isFunction(key)
      ? key
      : function () {
          const keys = key.split('.');
          const originTarget = isPrimitive(other) ? this : other;
          return getDeepProperty(originTarget, keys);
        };
    backup = isFunction(backup) ? backup : function () {};
    return {
      value (...args: Array<any>) {
        if(bind(canIRun, this)(...args) === true) {
          return bind(value, this)(...args);
        } else {
          // $FlowFixMe: I have reassign it when it's not a function
          return bind(backup, this)(...args);
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
