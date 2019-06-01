import { bind, isArray, isFunction, isObject, isPlainObject, isString } from 'lodash-es';
import { getDeepProperty } from 'toxic-utils';
import accessor from './accessor';
import applyDecorators from './helper/apply-decorators';
import { compressMultipleDecorators, getOwnKeys, warn } from './helper/utils';
import initialize from './initialize';
import nonenumerable from './nonenumerable';
import { AccessorDescriptor } from './typings/base';
const arrayChangeMethod = [ 'push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse' ];

function deepProxy(
  value: object | any[],
  hook: (...args: any[]) => any,
  // tslint:disable-next-line: trailing-comma
  { diff, operationPrefix }: { diff: boolean, operationPrefix: string }
): object | any[] {
  const mapStore: { [x: string]: boolean | any[] | object } = {};
  let arrayChanging = false;
  const proxyValue = new Proxy(value, {
    get(target: any, property: string, receiver: any) {
      const value = target[property];
      if (isArray(target) && arrayChangeMethod.indexOf(property) > -1) {
        return (...args: any[]) => {
          arrayChanging = true;
          bind(value, receiver)(...args);
          arrayChanging = false;
          hook();
        };
      }
      if (mapStore[property] === true) { return value; }
      if (isPlainObject(value) || isArray(value)) {
        const proxyValue = mapStore[property] || deepProxy(value, hook, { diff, operationPrefix });
        mapStore[property] = proxyValue;
        return proxyValue;
      }
      mapStore[property] = true;
      return value;
    },
    set(target: any, property: string, value: any) {
      const oldVal = target[property];
      const newVal = (isPlainObject(value) || isArray(value))
        ? deepProxy(value, hook, { diff, operationPrefix })
        : value;
      target[property] = newVal;
      mapStore[property] = true;
      if (arrayChanging || (diff && oldVal === newVal)) { return true; }
      hook();
      return true;
    },
    deleteProperty(target: any, property: string) {
      delete target[property];
      delete mapStore[property];
      if (arrayChanging) { return true; }
      hook();
      return true;
    },
  });
  const operateProps = {
    [operationPrefix + 'set']: [
      initialize(() => {
        return (property: string, val: any) => {
          proxyValue[property] = val;
        };
      }),
      nonenumerable,
    ],
    [operationPrefix + 'del']: [
      initialize(() => {
        return (property: string) => {
          delete proxyValue[property];
        };
      }),
      nonenumerable,
    ],
  };
  applyDecorators(proxyValue, operateProps, { self: true });
  return proxyValue;
}

function deepObserve(
  value: object | any[],
  hook: (...args: any[]) => any,
  // tslint:disable-next-line: trailing-comma
  { operationPrefix, diff }: { diff: boolean, operationPrefix: string}
): object | any[] {
  const mapStore: { [x: string]: boolean | any[] | object } = {};
  let arrayChanging = false;
  function getPropertyDecorators(keys: string[]): {
    [x: string]: PropertyDecorator
      | MethodDecorator
      | Array<PropertyDecorator | MethodDecorator>,
    } {
    let oldVal: any;
    return keys.reduce((
      props: {
        [x: string]: PropertyDecorator
          | MethodDecorator
          | Array<PropertyDecorator | MethodDecorator>,
      },
      key: string) => {
      props[key] = [
        accessor({
          set(value) {
            oldVal = this[key];
            return value;
          },
        }),
        accessor({
          get(val) {
            if (mapStore[key]) { return val; }
            if (isPlainObject(val) || isArray(val)) {
              deepObserve(val, hook, { operationPrefix, diff });
            }
            mapStore[key] = true;
            return val;
          },
          set(val) {
            if (isPlainObject(val) || isArray(val)) { deepObserve(val, hook, { operationPrefix, diff }); }
            mapStore[key] = true;
            if (!arrayChanging && (!diff || oldVal !== val)) { hook(); }
            return val;
          },
        }, { preSet: false }),
      ];
      return props;
    }, {});
  }
  // @ts-ignore: symbol[] is the same to string[]
  const props = getPropertyDecorators(getOwnKeys(value));
  applyDecorators(value, props, { self: true, omit: true });
  if (isArray(value)) {
    const methodProps = arrayChangeMethod.reduce((
      props: { [x: string]: Array<MethodDecorator | PropertyDecorator>},
      key) => {
      props[key] = [
        initialize((method) => {
          method = isFunction(method)
            ? method
            : Array.prototype[(key as any)];
          return (...args: any[]) => {
            const originLength = value.length;
            arrayChanging = true;
            bind(method, value)(...args);
            arrayChanging = false;
            if (originLength < value.length) {
              const keys = new Array(value.length - originLength)
              .fill(1)
              .map((value, index) => (index + originLength).toString());
              const props = getPropertyDecorators(keys);
              applyDecorators(value, props, { self: true, omit: true });
            }
            hook();
          };
        }),
        nonenumerable,
      ];
      return props;
    }, {});
    applyDecorators(value, methodProps, { self: true });
  }
  const operateProps = {
    [operationPrefix + 'set']: [
      initialize((method) => {
        return (
          property: string,
          val: any,
          { disable, isNewVal }: { disable?: boolean, isNewVal?: boolean } = {}) => {
          isNewVal = isNewVal || getOwnKeys(value).indexOf(property) === -1;
          if (isFunction(method)) {
            bind(method, this)(property, val, { disable: true, isNewVal });
          }
          if (isNewVal) {
            const props = getPropertyDecorators([ property ]);
            applyDecorators(value, props, { self: true, omit: true });
          }
          if (!disable) {
            // @ts-ignore: omit index error
            value[property] = val;
          }
        };
      }),
      nonenumerable,
    ],
    [operationPrefix + 'del']: [
      initialize((method) => {
        return (property: string) => {
          if (isFunction(method)) {
            bind(method, this)(property);
          } else {
            // @ts-ignore: omit index error
            delete value[property];
          }
          hook();
        };
      }),
      nonenumerable,
    ],
  };
  applyDecorators(value, operateProps, { self: true });
  return value;
}

export default function watch(...args: Array<string | ((...args: any[]) => any) | {
  deep?: boolean,
  diff?: boolean,
  omit?: boolean,
  proxy?: boolean,
  other?: any,
  operationPrefix?: string,
}>): PropertyDecorator {
  // @ts-ignore: type is narrow down to object here
  const option: {
    deep?: boolean,
    diff?: boolean,
    omit?: boolean,
    proxy?: boolean,
    other?: any,
    operationPrefix?: string,
  } = isPlainObject(args[args.length - 1])
    ? args[args.length - 1]
    : {};
  const {
    deep,
    omit,
    other,
    operationPrefix = '__',
    diff = true,
  } = option;
  let { proxy } = option;
  if (typeof Proxy !== 'function') {
    proxy = false;
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') {
      warn('You browser do not support Proxy, we will fall back into observe mode.');
    }
  }
  if (!args.length) { throw new TypeError('You must pass a function or a string to find the hanlder function.'); }
  if (other !== undefined && !isObject(other)) {
    throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
  }
  if (!isString(operationPrefix)) { throw new TypeError('operationPrefix must be an string'); }
  // @ts-ignore: this is a propertydecorator
  return function(obj: any, prop: string, descriptor: void | PropertyDescriptor): AccessorDescriptor {
    const fns = args.reduce((fns, keyOrFn, index) => {
      if (!isString(keyOrFn) && !isFunction(keyOrFn)) {
        if (!index || index !== args.length - 1) {
          throw new TypeError('You can only pass function or string as handler');
        }
        return fns;
      }
      fns.push(isString(keyOrFn)
        ? function(newVal: any, oldVal: any) {
          const target = other || obj;
          const fn = getDeepProperty(target, keyOrFn);
          if (!isFunction(fn)) {
            if (!omit) {
              // tslint:disable-next-line max-line-length
              throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
            }
            return;
          }
          return bind(fn, this)(newVal, oldVal);
        }
        : keyOrFn);
      return fns;
    }, []);
    const handler = function(newVal: any, oldVal: any) {
      fns.forEach((fn) => bind(fn, this)(newVal, oldVal));
    };
    let inited = false;
    let oldVal: any;
    let newVal: any;
    let proxyValue: any;
    // @ts-ignore: docorator can call in JavaScript
    return compressMultipleDecorators(
      accessor({
        set(value) {
          oldVal = this[prop];
          proxyValue = undefined;
          const hook = () => bind(handler, this)(newVal, oldVal);
          return (deep && (isPlainObject(value) || isArray(value)))
            ? proxy
              ? deepProxy(value, hook, { diff, operationPrefix })
              : deepObserve(value, hook, { operationPrefix, diff })
            : value;
        },
        get(value) {
          if (proxyValue) { return proxyValue; }
          if (!inited) {
            inited = true;
            const hook = () => bind(handler, this)(newVal, oldVal);
            if (deep && (isPlainObject(value) || isArray(value))) {
              if (proxy) {
                proxyValue = deepProxy(value, hook, { diff, operationPrefix });
                oldVal = proxyValue;
                newVal = proxyValue;
                return proxyValue;
              }
              deepObserve(value, hook, { operationPrefix, diff });
            }
            oldVal = value;
            newVal = value;
          }
          return value;
        },
      }, { preSet: true }),
      accessor({
        set(value) {
          newVal = value;
          if (!diff || oldVal !== value) { bind(handler, this)(newVal, oldVal); }
          oldVal = value;
          return value;
        },
      }, { preSet: false }))(obj, prop, descriptor);
  };
}
