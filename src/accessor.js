// @flow
import {isFunction, isArray, bind, isAccessorDescriptor, isInitializerDescriptor} from 'helper/utils';
function compressFunctionArray (fns: Array<Function>): Function {
  const errmsg = '@accessor only accept function or array of function as getter/setter';
  if(fns.length === 1) {
    if(!isFunction(fns[0])) {
      throw new TypeError(errmsg);
    }
    return fns[0];
  }
  return fns.reduce((prev, curr) => {
    if(!isFunction(curr) || !isFunction(prev)) throw new TypeError(errmsg);
    return function (value) {
      return bind(curr, this)(bind(prev, this)(value));
    };
  });
}
export default function accessor ({get, set}: {get?: Function | Array<Function>, set?: Function | Array<Function>} = {}): Function {
  if(!isFunction(get) &&
    !isFunction(set) &&
    !(isArray(get) && get.length > 0) &&
    !(isArray(set) && set.length > 0)
  ) throw new TypeError("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
  get = isArray(get)
    ? compressFunctionArray(get)
    : get;
  set = isArray(set)
    ? compressFunctionArray(set)
    : set;
  return function (obj: Object, prop: string, descriptor: Descriptor): AccessorDescriptor {
    const configurable = descriptor.configurable;
    const enumerable = descriptor.enumerable;
    if(isAccessorDescriptor(descriptor)) {
      // we will get accessor when we are handling getter/setter
      return {
        get () {
          // $FlowFixMe: dummy flow, get is function now.
          return bind(get, this)(bind(descriptor.get, this)());
        },
        set  (value) {
          // $FlowFixMe: dummy flow, set is function now.
          return bind(descriptor.set, this)(bind(set, this)(value));
        },
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
          // $FlowFixMe: dummy flow, get is function now.
          const boundFn = bind(get, this);
          if(inited) return boundFn(value);
          value = bind(initializer, this)();
          inited = true;
          return boundFn(value);
        },
        set (val) {
          // $FlowFixMe: dummy flow, set is function now.
          value = bind(set, this)(val);
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
          // $FlowFixMe: dummy flow, get is function now.
          return bind(get, this)(value);
        },
        set (val) {
          // $FlowFixMe: dummy flow, set is function now.
          value = bind(set, this)(val);
          return value;
        },
        configurable,
        enumerable
      };
    }
  };
}
