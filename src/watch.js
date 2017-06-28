// @flow
import {getOwnKeys, isFunction, isString, isPrimitive, getDeepProperty, bind, compressMultipleDecorators, isObject} from 'helper/utils';
const {getOwnPropertyDescriptor, defineProperty} = Object;
import accessor from 'accessor';
class Hooks {
  oldVal: any;
  newVal: any;
  inited: boolean;
  handler: Function;
  deep: boolean;
  prop: string;
  oldVal = undefined;
  newVal = undefined;
  inited = false;
  constructor ({prop, handler, deep}: {prop: string, handler: Function, deep: boolean} = {}) {
    this.prop = prop;
    this.handler = handler;
    this.deep = deep;
  }
  pre (value, context) {
    this.oldVal = context[this.prop];
    return value;
  }
  post (value, context) {
    const {oldVal, handler, deep, prop} = this;
    console.log(handler, value)
    if(oldVal === value) return value;
    const newVal = this.newVal = context[prop];
    bind(handler, context)(newVal, oldVal);
    if(deep && isObject(oldVal)) {
      const keys = getOwnKeys(newVal);
      for(let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];
        this.deepObeserve(newVal, key, context);
      }
    }
    this.inited = true;
    this.oldVal = newVal;
    return value;
  }
  getter (value, context) {
    const {inited, oldVal, deep} = this;
    if(!inited && oldVal !== value) {
      this.inited = true;
      this.oldVal = value;
      if(deep && isObject(value)) {
        const keys = getOwnKeys(value);
        for(let i = 0, len = keys.length; i < len; i++) {
          const key = keys[i];
          this.deepObeserve(value, key, context);
        }
      }
    }
    return value;
  }
  deepObeserve (obj, key, context) {
    const {handler, deep} = this;
    const descriptor = getOwnPropertyDescriptor(obj, key);
    if(descriptor.writable === false) return;
    // $FlowFixMe: flow do not support symbol yet
    const hooks = new Hooks({prop: key, handler, deep});
    defineProperty(obj, key, compressMultipleDecorators(
      accessor({
        set (value) {
          return hooks.pre(value, context);
        },
        get (value) {
          return hooks.getter(value, context);
        }
      }, {preSet: true}),
      accessor({
        set (value) {
          return hooks.post(value, context);
        }
      }, {preSet: false}))(obj, key, descriptor));
  }
}
export default function watch (keyOrFn: string | Function, {deep, other, omit}: {
  deep: boolean,
  omit: boolean,
  other: any
} = {}): Function {
  if(!isString(keyOrFn) && !isFunction(keyOrFn)) throw new TypeError('You must pass a function or a string to find the hanlder function.');
  if(other !== undefined && isPrimitive(other)) throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
  return function (obj: any, prop: string, descriptor: void | Descriptor): AccessorDescriptor {
    const handler = isString(keyOrFn)
    ? function (newVal, oldVal) {
      const target = isPrimitive(other) ? obj : other;
      // $FlowFixMe: we have ensure it must be a string
      const fn = getDeepProperty(target, keyOrFn);
      if(!isFunction(fn)) {
        if(!omit) throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
        return function () {};
      }
      return fn;
    }
    : keyOrFn;
    const hooks = new Hooks({
      prop,
      handler,
      deep
    });
    return compressMultipleDecorators(
      accessor({
        set (value) {
          return hooks.pre(value, this);
        },
        get (value) {
          return hooks.getter(value, this);
        }
      }, {preSet: true}),
      accessor({
        set (value) {
          console.log('you call this', value)
          return hooks.post(value, this);
        }
      }, {preSet: false}))(obj, prop, descriptor);
  };
}
