import { bind, isFunction, isObject, isString } from 'lodash';
import { getDeepProperty } from 'toxic-utils';
import { DataDescriptor, DecoratorFunction } from 'typings/base';
export default function runnable(key: (...args: any[]) => any | string, {
  other,
  backup,
}: {
  other?: any,
  backup?: (...args: any[]) => any,
} = {}): DecoratorFunction {
  if (!isFunction(key) && !isString(key)) { throw new TypeError('@runnable only accept Function or String'); }
  return function(obj: object, prop: string, descriptor: DataDescriptor): DataDescriptor {
    const { value, configurable } = descriptor || { configurable: undefined, value: undefined };
    if (!isFunction(value)) {
      throw new TypeError(`@runnable can only be used on method, but not ${value} on property "${prop}".`);
    }
    const canIRun = isFunction(key)
      ? key
      : function() {
        const keys = (key as string).split('.');
        const originTarget = !isObject(other) ? this : other;
        return getDeepProperty(originTarget, keys);
      };
    // tslint:disable: no-empty
    backup = isFunction(backup) ? backup : function() {};
    return {
      configurable,
      // function should not be enmuerable
      enumerable: false,
      // as we have delay this function
      // it's not a good idea to change it
      writable: false,
      value(...args: any[]) {
        if (bind(canIRun, this)(...args) === true) {
          return bind(value, this)(...args);
        }
        // $FlowFixMe: I have reassign it when it's not a function
        return bind(backup, this)(...args);
      },
    };
  };
}
