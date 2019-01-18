import { bind } from 'lodash';
import accessor from './accessor';
import { compressOneArgFnArray, isAccessorDescriptor, isDescriptor, isInitializerDescriptor } from './helper/utils';
export default function initialize(...fns: Array<(x: any) => any>): MethodDecorator | PropertyDecorator {
  if (fns.length === 0) {

    throw new Error('@initialize accept at least one parameter. If you don\'t need to initialize your value, do not add @initialize.');
  }
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @initialize straightly, @initialize return decorators, you need to call it');
  }
  const fn = compressOneArgFnArray(fns, '@initialize only accept function parameter');
  return function(obj: object, prop: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    if (descriptor === undefined) {
      return {
        configurable: true,
        enumerable: true,
        value: bind(fn, obj)(),
        writable: true,
      };
    }
    if (isAccessorDescriptor(descriptor)) {
      let hasBeenReset = false;
      const { set: originSet } = descriptor;
      // @ts-ignore: decorator can run as function in javascript
      return accessor({
        get(value) {
          if (hasBeenReset) { return value; }
          return bind(fn, this)(value);
        },
        set: originSet
          ? function(value) {
            hasBeenReset = true;
            return value;
          }
          : undefined,
      })(obj, prop, descriptor);
    }
    /**
     * when we set decorator on propery
     * we will get a descriptor with initializer
     * as they will be attach on the instance later
     * so, we need to substitute the initializer function
     */
    if (isInitializerDescriptor(descriptor)) {
      const { initializer } = descriptor;
      const handler = function() {
        return bind(fn, this)(bind(initializer, this)());
      };
      return {
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable,
        // @ts-ignore: initializer
        initializer: handler,
        writable: descriptor.writable,
      };
    }
    const value = bind(fn, this)(descriptor.value);
    return {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      value,
      writable: descriptor.writable,
    };
  };
}
