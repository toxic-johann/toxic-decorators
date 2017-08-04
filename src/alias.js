// @flow
import {isString, isAccessorDescriptor, isInitializerDescriptor, isPrimitive, isObject} from 'helper/utils';
import {getDeepProperty} from 'toxic-utils';
import accessor from 'accessor';
import initialize from 'initialize';
const {getOwnPropertyDescriptor, defineProperty} = Object;
function setAlias (root: Object, prop: string, {configurable, enumerable}: Descriptor, obj: Object, key: string, {force, omit}: {force: boolean, omit: boolean}): void {
  const originDesc = getOwnPropertyDescriptor(obj, key);
  if(originDesc !== undefined) {
    if(omit) return;
    // TODO: we should add an github link here
    if(!force) throw new Error(`"${prop}" is an existing property, if you want to override it, please set "force" true in @alias option.`);
    if(!originDesc.configurable) {
      throw new Error(`property "${prop}" is unconfigurable.`);
    }
  }
  defineProperty(obj, key, {
    get () {
      return root[prop];
    },
    set (value) {
      root[prop] = value;
      return prop;
    },
    configurable,
    enumerable
  });
}
export default function alias (other?: any, key: string, option?: {force: boolean, omit: boolean}): Function {
  // set argument into right position
  if(arguments.length === 2) {
    if(isString(other)) {
      // $FlowFixMe: i will check this later
      option = key;
      key = other;
      other = undefined;
    }
  } else if(arguments.length === 1) {
    // $FlowFixMe: i will check this later
    key = other;
    other = undefined;
  }
  // argument validate
  if(!isString(key)) throw new TypeError('@alias need a string as a key to find the porperty to set alias on');
  const illegalObjErrorMsg = 'If you want to use @alias to set alias on other instance, you must pass in a legal instance';
  if(other !== undefined && isPrimitive(other)) throw new TypeError(illegalObjErrorMsg);
  const {force, omit} = isObject(option) ? option : {force: false, omit: false};
  return function (obj: Object, prop: string, descriptor: Descriptor): Descriptor {
    descriptor = descriptor || {
      value: undefined,
      configurable: true,
      writable: true,
      enumerable: true
    };
    function getTargetAndName (other: any, obj: any, key: string): {target: any, name: string} {
      let target = isPrimitive(other) ? obj : other;
      const keys = key.split('.');
      const [name] = keys.slice(-1);
      target = getDeepProperty(target, keys.slice(0, -1), {throwError: true});
      if(isPrimitive(target)) {
        throw new TypeError(illegalObjErrorMsg);
      }
      return {
        target,
        name
      };
    }
    if(isInitializerDescriptor(descriptor)) {
      return initialize(function (value) {
        const {target, name} = getTargetAndName(other, this, key);
        setAlias(this, prop, descriptor, target, name, {force, omit});
        return value;
      })(obj, prop, descriptor);
    }
    if(isAccessorDescriptor(descriptor)) {
      let inited;
      const handler = function (value) {
        if(inited) return value;
        const {target, name} = getTargetAndName(other, this, key);
        setAlias(this, prop, descriptor, target, name, {force, omit});
        inited = true;
        return value;
      };
      return accessor({get: handler, set: handler})(obj, prop, descriptor);
    }
    const {target, name} = getTargetAndName(other, obj, key);
    setAlias(obj, prop, descriptor, target, name, {force, omit});
    return descriptor;
  };
}
