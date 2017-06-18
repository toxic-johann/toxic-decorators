// @flow
import {isString, isFunction, isAccessorDescriptor, isInitializerDescriptor} from 'helper/utils';
import accessor from 'accessor';
import initialize from 'initialize';
const {getOwnPropertyDescriptor, defineProperty} = Object;
function setAlias (root: Object, prop: string, descriptor: Descriptor, obj: Object, key: string): void {
  if(getOwnPropertyDescriptor(obj, key) !== undefined) {
    throw new Error("@alias can't set alias on an existing attribute");
  }
  defineProperty(obj, key, {
    get () {
      return root[prop];
    },
    set (value) {
      root[prop] = value;
      return prop;
    },
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable
  });
}
export default function alias (key: string, other?: Object): Function {
  if(!isString(key)) {
    throw new TypeError('@alias need a string as a key to find the porperty to set alias on');
  }
  return function (obj: Object, prop: string, descriptor: Descriptor): Descriptor {
    descriptor = descriptor || {
      value: undefined,
      configurable: true,
      writable: true,
      enumerable: true
    };
    const isOtherLegal = other && isFunction(other.hasOwnProperty);
    if(isInitializerDescriptor(descriptor)) {
      return initialize(function (value) {
        // $FlowFixMe: Jesus, you have check it already!!
        setAlias(this, prop, descriptor, isOtherLegal ? other : this, key);
        return value;
      })(obj, prop, descriptor);
    }
    if(isAccessorDescriptor(descriptor)) {
      let inited;
      const handler = function (value) {
        if(inited) return value;
        // $FlowFixMe: Jesus, you have check it already!!
        setAlias(this, prop, descriptor, isOtherLegal ? other : this, key);
        inited = true;
        return value;
      };
      return accessor({get: handler, set: handler})(obj, prop, descriptor);
    }
    // $FlowFixMe: Jesus, you have check it already!!
    setAlias(obj, prop, descriptor, isOtherLegal ? other : obj, key);
    return descriptor;
  };
}
