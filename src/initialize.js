// @flow
import {isDescriptor, isFunction, isAccessorDescriptor, bind} from 'helper/utils';
export default function initialize (...fns: Array<Function>): Function {
  if(fns.length === 0) throw new Error("@initialize accept at least one parameter. If you don't need to initialize your value, do not add @initialize.");
  if(fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @initialize straightly, @initialize return decorators, you need to call it');
  }
  for(let i = fns.length - 1; i > -1; i--) {
    if(!isFunction(fns[i])) throw new TypeError('@initialize only accept function parameter');
  }
  return function (obj: Object, prop: string, descriptor: DataDescriptor | InitialDescriptor): DataDescriptor | InitialDescriptor{
    if(isAccessorDescriptor(descriptor)) {
      throw new Error('@initialize do not support accessor descriptor');
    }
    /**
     * when we set decorator on propery
     * we will get a descriptor with initializer
     * as they will be attach on the instance later
     * so, we need to substitute the initializer function
     */
    // $FlowFixMe: useless disjoint union
    if(isFunction(descriptor.initializer)) {
      // $FlowFixMe: useless disjoint union
      const {initializer} = descriptor;
      const handler = function () {
        return fns.reduce((value, fn) => bind(fn, this)(value), bind(initializer, this)());
      };
      return {
        initializer: handler,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        enumerable: descriptor.enumerable
      };
    }
    // $FlowFixMe: useless disjoint union
    const value = fns.reduce((value, fn) => fn(value), descriptor.value);
    return {
      value,
      writable: descriptor.writable,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
  };
}
