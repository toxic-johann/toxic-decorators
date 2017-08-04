// @flow
import {isFunction, isArray, isAccessorDescriptor, isInitializerDescriptor, compressOneArgFnArray, warn} from 'helper/utils';
import {bind} from 'toxic-utils';
export default function accessor ({get, set}: {get?: Function | Array<Function>, set?: Function | Array<Function>} = {}, {preGet = false, preSet = true}: {preGet?: boolean, preSet?: boolean} = {}): Function {
  if(!isFunction(get) &&
    !isFunction(set) &&
    !(isArray(get) && get.length > 0) &&
    !(isArray(set) && set.length > 0)
  ) throw new TypeError("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
  const errmsg = '@accessor only accept function or array of function as getter/setter';
  get = isArray(get)
    ? compressOneArgFnArray(get, errmsg)
    : get;
  set = isArray(set)
    ? compressOneArgFnArray(set, errmsg)
    : set;
  return function (obj: Object, prop: string, descriptor: Descriptor): AccessorDescriptor {
    const {
      configurable = true,
      enumerable = true
    } = descriptor || {};
    const hasGet = isFunction(get);
    const hasSet = isFunction(set);
    const handleGet = function (value) {
      // $FlowFixMe: it's really function here
      return hasGet ? bind(get, this)(value) : value;
    };
    const handleSet = function (value) {
      // $FlowFixMe: it's really function here
      return hasSet ? bind(set, this)(value) : value;
    };
    if(isAccessorDescriptor(descriptor)) {
      const {get: originGet, set: originSet} = descriptor;
      const hasOriginGet = isFunction(originGet);
      const hasOriginSet = isFunction(originSet);
      if(process.env.NODE_ENV !== 'production' && !hasOriginGet && hasGet) {
        warn(`You are trying to set getter via @accessor on ${prop} without getter. That's not a good idea.`);
      }
      if(process.env.NODE_ENV !== 'production' && !hasOriginSet && hasSet) {
        warn(`You are trying to set setter via @accessor on  ${prop} without setter. That's not a good idea.`);
      }
      const getter = (hasOriginGet || hasGet)
        ? function () {
          const boundGetter = bind(handleGet, this);
          const originBoundGetter = () => {
            return hasOriginGet
              // $FlowFixMe: we have do a check here
              ? bind(originGet, this)()
              : undefined;
          };
          const order = preGet ? [boundGetter, originBoundGetter] : [originBoundGetter, boundGetter];
          // $FlowFixMe: it's all function here
          return order.reduce((value, fn) => fn(value), undefined);
        }
        : undefined;
      const setter = (hasOriginSet || hasSet)
        ? function (val) {
          const boundSetter = bind(handleSet, this);
          const originBoundSetter = value => hasOriginSet
            // $FlowFixMe: flow act like a retarded child on optional property
            ? bind(originSet, this)(value)
            : value;
          const order = preSet ? [boundSetter, originBoundSetter] : [originBoundSetter, boundSetter];
          return order.reduce((value, fn) => fn(value), val);
        }
        : undefined;
      return {
        get: getter,
        set: setter,
        configurable,
        enumerable
      };
    } else if(isInitializerDescriptor(descriptor)) {
      // $FlowFixMe: disjoint union is horrible, descriptor is initializerDescriptor now
      const {initializer} = descriptor;
      let value;
      let inited = false;
      return {
        get () {
          const boundFn = bind(handleGet, this);
          if(inited) return boundFn(value);
          value = bind(initializer, this)();
          inited = true;
          return boundFn(value);
        },
        set (val) {
          const boundFn = bind(handleSet, this);
          value = preSet ? boundFn(val) : val;
          inited = true;
          if(!preSet) {
            boundFn(value);
          }
          return value;
        },
        configurable,
        enumerable
      };
    } else {
      // $FlowFixMe: disjoint union is horrible, descriptor is DataDescriptor now
      let {value} = descriptor || {};
      return {
        get () {
          return bind(handleGet, this)(value);
        },
        set (val) {
          const boundFn = bind(handleSet, this);
          value = preSet ? boundFn(val) : val;
          if(!preSet) {
            boundFn(value);
          }
          return value;
        },
        configurable,
        enumerable
      };
    }
  };
}
