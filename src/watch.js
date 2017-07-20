// @flow
import {getOwnKeys, isFunction, isString, isPrimitive, getDeepProperty, compressMultipleDecorators, isObject, isArray} from 'helper/utils';
import {bind} from 'toxic-utils';
import accessor from 'accessor';
import nonenumerable from 'nonenumerable';
import initialize from 'initialize';
import applyDecorators from 'helper/apply-decorators';
const arrayChangeMethod = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];

function deepProxy (value: Object | Array<*>, hook: Function): Object | Array<*> {
  const mapStore = {};
  let arrayChanging = false;
  const proxyValue = new Proxy(value, {
    get (target: any, property: string, receiver: any) {
      const value = target[property];
      if(isArray(target) && arrayChangeMethod.indexOf(property) > -1) {
        return (...args) => {
          arrayChanging = true;
          bind(value, receiver)(...args);
          arrayChanging = false;
          hook();
        };
      }
      if(mapStore[property] === true) return value;
      if(isObject(value) || isArray(value)) {
        const proxyValue = mapStore[property] || deepProxy(value, hook);
        mapStore[property] = proxyValue;
        return proxyValue;
      }
      mapStore[property] = true;
      return value;
    },
    set (target: any, property: string, value: any) {
      target[property] = (isObject(value) || isArray(value))
        ? deepProxy(value, hook)
        : value;
      mapStore[property] = true;
      if(arrayChanging) return true;
      hook();
      return true;
    },
    deleteProperty (target: any, property: string) {
      delete target[property];
      delete mapStore[property];
      if(arrayChanging) return true;
      hook();
      return true;
    }
  });
  return proxyValue;
}

function deepObserve (value: Object | Array<*>, hook: Function, {operationPrefix}): Object | Array<*> {
  const mapStore = {};
  let arrayChanging = false;
  function getPropertyDecorators (keys: Array<string>): {[string]: Function | Array<Function>} {
    return keys.reduce((props, key) => {
      props[key] = accessor({
        get (val) {
          if(mapStore[key]) return val;
          if(isObject(val) || isArray(val)) {
            deepObserve(val, hook, {operationPrefix});
          }
          mapStore[key] = true;
          return val;
        },
        set (val) {
          if(isObject(val) || isArray(val)) deepObserve(val, hook, {operationPrefix});
          mapStore[key] = true;
          if(!arrayChanging) hook();
          return val;
        }
      }, {preSet: false});
      return props;
    }, {});
  }
  const props = getPropertyDecorators(getOwnKeys(value));
  applyDecorators(value, props, {self: true, omit: true});
  if(isArray(value)) {
      const methodProps = arrayChangeMethod.reduce((props, key) => {
      props[key] = [
        initialize(method => {
          method = isFunction(method)
            ? method
            // $FlowFixMe: we have check the key
            : Array.prototype[key];
          return (...args) => {
            const originLength = value.length;
            arrayChanging = true;
            bind(method, value)(...args);
            arrayChanging = false;
            if(originLength < value.length) {
              const keys = new Array(value.length - originLength).fill(1).map((value, index) => (index + originLength).toString());
              const props = getPropertyDecorators(keys);
              applyDecorators(value, props, {self: true, omit: true});
            }
            hook();
          };
        }),
        nonenumerable
      ];
      return props;
    }, {});
    applyDecorators(value, methodProps, {self: true});
  }
  const operateProps = {
    [operationPrefix + 'set']: [
      initialize(method => {
        return (property, val, {disable, isNewVal} = {}) => {
          isNewVal = isNewVal || getOwnKeys(value).indexOf(property) === -1;
          if(isFunction(method)) {
            bind(method, this)(property, val, {disable: true, isNewVal});
          }
          if(isNewVal) {
            const props = getPropertyDecorators([property]);
            applyDecorators(value, props, {self: true, omit: true});
          }
          if(!disable) {
            value[property] = val;
          }
        };
      }),
      nonenumerable
    ],
    [operationPrefix + 'del']: [
      initialize(method => {
        return (property) => {
          if(getOwnKeys(value).indexOf(property) === -1) {
            const props = getPropertyDecorators([property]);
            applyDecorators(value, props, {self: true, omit: true});
          }
          if(isFunction(method)) {
            bind(method, this)(property);
          } else {
            delete value[property];
          }
          hook();
        };
      }),
      nonenumerable
    ]
  };
  applyDecorators(value, operateProps, {self: true});
  return value;
}

export default function watch (...args: Array<string | Function | {
  deep?: boolean,
  omit?: boolean,
  proxy?: boolean,
  other?: any,
  operationPrefix?: string
}>): Function {
  // $FlowFixMe: we have check if it's an object
  const {deep, omit, proxy, other, operationPrefix = '__'} = isObject(args[args.length - 1])
    ? args[args.length - 1]
    : {};
  if(!args.length) throw new TypeError('You must pass a function or a string to find the hanlder function.');
  if(other !== undefined && isPrimitive(other)) throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
  return function (obj: any, prop: string, descriptor: void | Descriptor): AccessorDescriptor {
    const fns = args.reduce((fns, keyOrFn, index) => {
      if(!isString(keyOrFn) && !isFunction(keyOrFn)) {
        if(!index || index !== args.length - 1) throw new TypeError('You can only pass function or string as handler');
        return fns;
      }
      fns.push(isString(keyOrFn)
        ? function (newVal, oldVal) {
          const target = other || obj;
          // $FlowFixMe: we have ensure it must be a string
          const fn = getDeepProperty(target, keyOrFn);
          if(!isFunction(fn)) {
            if(!omit) throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
            return;
          }
          return bind(fn, this)(newVal, oldVal);
        }
        : keyOrFn);
      return fns;
    }, []);
    const handler = function (newVal, oldVal) {
      fns.forEach(fn => bind(fn, this)(newVal, oldVal));
    };
    let inited = false;
    let oldVal;
    let newVal;
    let proxyValue;
    return compressMultipleDecorators(
      accessor({
        set (value) {
          oldVal = this[prop];
          proxyValue = undefined;
          const hook = () => bind(handler, this)(newVal, oldVal);
          return (deep && (isObject(value) || isArray(value)))
            ? proxy
              ? deepProxy(value, hook)
              : deepObserve(value, hook, {operationPrefix})
            : value;
        },
        get (value) {
          if(proxyValue) return proxyValue;
          if(!inited && oldVal !== value) {
            inited = true;
            const hook = () => bind(handler, this)(newVal, oldVal);
            if(deep && (isObject(value) || isArray(value))) {
              if(proxy) {
                proxyValue = deepProxy(value, hook);
                oldVal = proxyValue;
                newVal = proxyValue;
                return proxyValue;
              }
              deepObserve(value, hook, {operationPrefix});
            }
            oldVal = value;
            newVal = value;
          }
          return value;
        }
      }, {preSet: true}),
      accessor({
        set (value) {
          newVal = value;
          if(oldVal !== value) bind(handler, this)(newVal, oldVal);
          oldVal = value;
          return value;
        }
      }, {preSet: false}))(obj, prop, descriptor);
  };
}
