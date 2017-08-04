// @flow
import {isFunction, warn, createDefaultSetter} from 'helper/utils';
import {bind} from 'toxic-utils';
const {defineProperty} = Object;
export default function lazyInit (obj: any, prop: string, descriptor: InitialDescriptor): AccessorDescriptor {
  if(descriptor === undefined) throw new TypeError('@lazyInit cannot be apply on undefined property.');
  if(!isFunction(descriptor.initializer)) {
    /* istanbul ignore else  */
    if(process.env.NODE_ENV !== 'production') warn(`@lazyInit can only be used on property, but not propery "${prop}" which may be methods or getter/setter.`);
    // $FlowFixMe: disjoint union ****
    return descriptor;
  }
  const {initializer, configurable, enumerable, writable} = descriptor;
  return {
    get () {
      const value = bind(initializer, this)();
      defineProperty(this, prop, {
        value,
        configurable,
        enumerable,
        writable
      });
      return value;
    },
    set: createDefaultSetter(prop),
    configurable,
    enumerable
  };
}
