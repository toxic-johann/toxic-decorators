// @flow
import {isDescriptor, isAccessorDescriptor, bind, isInitializerDescriptor, compressOneArgFnArray} from 'helper/utils';
import accessor from 'accessor';
export default function initialize (...fns: Array<Function>): Function {
  if(fns.length === 0) throw new Error("@initialize accept at least one parameter. If you don't need to initialize your value, do not add @initialize.");
  if(fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @initialize straightly, @initialize return decorators, you need to call it');
  }
  const fn = compressOneArgFnArray(fns, '@initialize only accept function parameter');
  return function (obj: Object, prop: string, descriptor: Descriptor): Descriptor {
    if(isAccessorDescriptor(descriptor)) {
      let hasBeenReset = false;
      return accessor({
        get (value) {
          if(hasBeenReset) return value;
          return bind(fn, this)(value);
        },
        set (value) {
          hasBeenReset = true;
          return value;
        }
      })(obj, prop, descriptor);
    }
    /**
     * when we set decorator on propery
     * we will get a descriptor with initializer
     * as they will be attach on the instance later
     * so, we need to substitute the initializer function
     */
    if(isInitializerDescriptor(descriptor)) {
      // $FlowFixMe: useless disjoint union
      const {initializer} = descriptor;
      const handler = function () {
        return bind(fn, this)(bind(initializer, this)());
      };
      return {
        initializer: handler,
        configurable: descriptor.configurable,
        // $FlowFixMe: useless disjoint union
        writable: descriptor.writable,
        enumerable: descriptor.enumerable
      };
    }
    // $FlowFixMe: useless disjoint union
    const value = bind(fn, this)(descriptor.value);
    return {
      value,
      // $FlowFixMe: useless disjoint union
      writable: descriptor.writable,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
  };
}
