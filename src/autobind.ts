import { bind, isFunction } from 'lodash-es';
import classify from './helper/classify';
import { createDefaultSetter } from './helper/utils';
import { isDataDescriptor } from './helper/utils';
import { AccessorDescriptor, DataDescriptor } from './typings/base';
let mapStore: WeakMap<object, WeakMap<(...args: any[]) => any, (...args: any[]) => any>>;
// save bound function for super
function getBoundSuper(obj: object, fn: (...args: any[]) => any): (...args: any[]) => any {
  if (typeof WeakMap === 'undefined') {
    throw new Error(
      `Using @autobind on ${fn.name}() requires WeakMap support due to its use of super.${fn.name}()`,
    );
  }

  if (!mapStore) {
    mapStore = new WeakMap();
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new WeakMap());
  }

  const superStore = mapStore.get(obj);
  if (superStore.has(fn) === false) {
    superStore.set(fn, bind(fn, obj));
  }
  return superStore.get(fn);
}
/**
 * auto bind the function on the class, just support function
 * @param {Object} obj Target Object
 * @param {string} prop prop strong
 * @param {Object} descriptor
 */
export default function autobind(obj: any, prop: string, descriptor: DataDescriptor): AccessorDescriptor {
  if (arguments.length === 1) {
    return classify(autobind, {
      requirement(obj: any, prop: string, desc: PropertyDescriptor) {
        return isDataDescriptor(desc) && isFunction(desc.value);
      },
    })()(obj);
  }
  const { value: fn, configurable } = descriptor || {
    configurable: undefined,
    value: undefined,
  };
  if (!isFunction(fn)) {
    throw new TypeError(`@autobind can only be used on functions, not "${fn}" in ${typeof fn} on property "${prop}"`);
  }
  const { constructor } = obj;
  return {
    configurable,
    enumerable: false,
    get() {
      const boundFn = (...args: any[]) => fn.call(this, ...args);
      // Someone accesses the property directly on the prototype on which it is
      // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
      if (this === obj) {
        return fn;
      }
      // Someone accesses the property directly on a prototype,
      // but it was found up the chain, not defined directly on it
      // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
      if (this.constructor !== constructor && Object.getPrototypeOf(this).constructor === constructor) {
        return fn;
      }

      // Autobound method calling super.sameMethod() which is also autobound and so on.
      if (this.constructor !== constructor && prop in this.constructor.prototype) {
        return getBoundSuper(this, fn);
      }
      Object.defineProperty(this, prop, {
        configurable: true,
        // NOT enumerable when it's a bound method
        enumerable: false,
        value: boundFn,
        writable: true,
      });

      return boundFn;
    },
    set: createDefaultSetter(prop),
  };
}
