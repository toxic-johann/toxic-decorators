import { bind, isFunction } from 'lodash';
import { createDefaultSetter, warn } from './helper/utils';
import { AccessorDescriptor, InitializerDescriptor } from './typings/base';
const { defineProperty } = Object;
export default function lazyInit(obj: any, prop: string, descriptor: InitializerDescriptor): AccessorDescriptor {
  if (descriptor === undefined) { throw new TypeError('@lazyInit cannot be apply on undefined property.'); }
  if (!isFunction(descriptor.initializer)) {
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') {
      warn(`@lazyInit can only be used on property, but not propery "${prop}" which may be methods or getter/setter.`);
    }
    return descriptor;
  }
  const { initializer, configurable, enumerable, writable } = descriptor;
  return {
    configurable,
    enumerable,
    get() {
      const value = bind(initializer, this)();
      defineProperty(this, prop, {
        configurable,
        enumerable,
        value,
        writable,
      });
      return value;
    },
    set: createDefaultSetter(prop),
  };
}
