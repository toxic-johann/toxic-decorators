import {
  compressOneArgFnArray,
  isAccessorDescriptor,
  isInitializerDescriptor,
  warn,
} from 'helper/utils';
import { bind, isArray, isFunction } from 'lodash';
import {
  AccessorDescriptor,
} from 'typings/base';

export default function accessor(
  {
    get,
    set,
  }: {
    get?: ((v: any) => any) | Array<(v: any) => any>,
    set?: ((v: any) => any) | Array<(v: any) => any>,
  } = {},
  {
    preGet = false,
    preSet = true,
  }: {
    preGet?: boolean,
    preSet?: boolean,
  } = {}): MethodDecorator | PropertyDecorator {
  if (!(isArray(get) && get.length > 0) &&
    !(isArray(set) && set.length > 0) &&
    !isFunction(get) &&
    !isFunction(set)
  ) {
    // tslint:disable-next-line: max-line-length
    throw new TypeError('@accessor need a getter or setter. If you don\'t need to add setter/getter. You should remove @accessor');
  }
  const errmsg = '@accessor only accept function or array of function as getter/setter';
  const singleFnGet = isArray(get)
    ? compressOneArgFnArray(get, errmsg)
    : get;
  const singleFnSet = isArray(set)
    ? compressOneArgFnArray(set, errmsg)
    : set;
  return function(obj: object, prop: string, descriptor: PropertyDescriptor): AccessorDescriptor {
    const {
      configurable = true,
      enumerable = true,
    } = descriptor || {};
    const hasGet = isFunction(singleFnGet);
    const hasSet = isFunction(singleFnSet);
    const handleGet = function(value: any) {
      return hasGet ? bind(singleFnGet, this)(value) : value;
    };
    const handleSet = function(value: any) {
      return hasSet ? bind(singleFnSet, this)(value) : value;
    };
    if (isAccessorDescriptor(descriptor)) {
      const { get: originGet, set: originSet } = descriptor;
      const hasOriginGet = isFunction(originGet);
      const hasOriginSet = isFunction(originSet);
      if (process.env.NODE_ENV !== 'production' && !hasOriginGet && hasGet) {
        warn(`You are trying to set getter via @accessor on ${prop} without getter. That's not a good idea.`);
      }
      if (process.env.NODE_ENV !== 'production' && !hasOriginSet && hasSet) {
        warn(`You are trying to set setter via @accessor on  ${prop} without setter. That's not a good idea.`);
      }
      const getter = (hasOriginGet || hasGet)
        ? function() {
          const boundGetter = bind(handleGet, this);
          const originBoundGetter = () => {
            return hasOriginGet
              ? bind(originGet, this)()
              : undefined;
          };
          const order = preGet ? [ boundGetter, originBoundGetter ] : [ originBoundGetter, boundGetter ];
          return order.reduce((value, fn) => fn(value), undefined);
        }
        : undefined;
      const setter = (hasOriginSet || hasSet)
        ? function(val: any) {
          const boundSetter = bind(handleSet, this);
          const originBoundSetter = (value: any) => (hasOriginSet
            ? bind(originSet, this)(value)
            : value);
          const order = preSet ? [ boundSetter, originBoundSetter ] : [ originBoundSetter, boundSetter ];
          return order.reduce((value, fn) => fn(value), val);
        }
        : undefined;
      return {
        configurable,
        enumerable,
        get: getter,
        set: setter,
      };
    } else if (isInitializerDescriptor(descriptor)) {
      const { initializer } = descriptor;
      let value: any;
      let inited = false;
      return {
        get() {
          const boundFn = bind(handleGet, this);
          if (inited) { return boundFn(value); }
          value = bind(initializer, this)();
          inited = true;
          return boundFn(value);
        },
        set(val) {
          const boundFn = bind(handleSet, this);
          value = preSet ? boundFn(val) : val;
          inited = true;
          if (!preSet) {
            boundFn(value);
          }
          return value;
        },
        configurable,
        enumerable,
      };
    }
    let { value } = descriptor || { value: undefined };
    return {
      get() {
        return bind(handleGet, this)(value);
      },
      set(val) {
        const boundFn = bind(handleSet, this);
        value = preSet ? boundFn(val) : val;
        if (!preSet) {
          boundFn(value);
        }
        return value;
      },
      configurable,
      enumerable,
    };

  };
}
