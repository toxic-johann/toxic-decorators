// @flow
import {isFunction, isArray, bind, isAccessorDescriptor, isInitializerDescriptor, compressOneArgFnArray, warn} from 'helper/utils';
export default function accessor ({get, set}: {get?: Function | Array<Function>, set?: Function | Array<Function>} = {}): Function {
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
    if(descriptor === undefined) {
      // $FlowFixMe: ok, that's enough, disjoint union
      return {
        get,
        set,
        configurable: true,
        enumerable: true
      };
    }
    const configurable = descriptor.configurable;
    const enumerable = descriptor.enumerable;
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
      if(!hasOriginGet && hasGet) {
        warn("You are trying to set getter via @accessor on one property without getter. That's not a good idea.");
      }
      if(!hasOriginSet && hasSet) {
        warn("You are trying to set setter via @accessor on one property without setter. That's not a good idea.");
      }
      const getter = (hasOriginGet || hasGet)
        ? function () {
          // $FlowFixMe: flow act like a retarded child on optional property
          const value = hasOriginGet ? bind(originGet, this)() : undefined;
          return bind(handleGet, this)(value);
        }
        : undefined;
      const setter = (hasOriginSet || hasSet)
        ? function (val) {
          const value = bind(handleSet, this)(val);
          return hasOriginSet
            // $FlowFixMe: flow act like a retarded child on optional property
            ? bind(originSet, this)(value)
            : value;
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
          value = bind(handleSet, this)(val);
          return value;
        },
        configurable,
        enumerable
      };
    } else {
      // $FlowFixMe: disjoint union is horrible, descriptor is DataDescriptor now
      let {value} = descriptor;
      return {
        get () {
          return bind(handleGet, this)(value);
        },
        set (val) {
          value = bind(handleSet, set)(val);
          return value;
        },
        configurable,
        enumerable
      };
    }
  };
}
