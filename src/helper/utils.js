// @flow
// **********************  judgement   ************************
/**
 * check if the code running in browser environment (not include worker env)
 * @returns {Boolean}
 */
export const inBrowser =
    typeof window !== 'undefined' &&
    Object.prototype.toString.call(window) !== '[object Object]';
/**
 * is void element or not ? Means it will return true when val is undefined or null
 * @param  {Anything}  obj
 * @return {Boolean}   return true when val is undefined or null
 */
export function isVoid (obj: any): boolean %checks {
  return obj === undefined || obj === null;
}
/**
 * to check whether a variable is array
 * @param {Anything} arr
 * @return {Boolean} true when it is a boolean
 */
export function isArray (arr: any): boolean %checks {
  return Array.isArray(arr);
}

/**
 * 转变一个类数组对象为数组
 */
export function makeArray (obj: any): Array<any> {
  return Array.from(obj);
}

/**
 * 判断是否为function
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isFunction (obj: any): boolean %checks {
  return typeof obj === 'function';
}

/**
 * 判断是否是对象
 * @param  {Anything}  obj 传入对象
 * @return {Boolean}     [description]
 */
export function isObject (obj: any): boolean %checks {
  // incase of arrow function and array
  return !!obj && typeof obj === 'object' && Object(obj) === obj && String(obj) === '[object Object]' && !isFunction(obj) && !isArray(obj);
}
/**
 * to tell you if it's a real number
 * @param  {Anything}  obj
 * @return {Boolean}   return true when it's a number
 */
export function isNumber (obj: any): boolean %checks {
  return typeof obj === 'number';
}
/**
 * to tell you if the val can be transfer into data
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isNumeric (obj: any): boolean %checks {
  return !isArray(obj) && (obj - Number.parseFloat(obj) + 1) >= 0;
}
/**
 * 判断是否为整数
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isInteger (num: any): boolean %checks {
  return Number.isInteger(num);
}

/**
 * 判断是否为空
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 * @example
 * "", {}, [], 0, null, undefined, false 为空
 */
export function isEmpty (obj: any): boolean {
  if(isArray(obj)) {
    return obj.length === 0;
  } else if(isObject(obj)) {
    return Object.keys(obj).length === 0;
  } else {
    return !obj;
  }
}
/**
 * 判断是否为事件
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isEvent (obj: any): boolean %checks {
  return obj instanceof Event || obj.originalEvent instanceof Event;
}
/**
 * 判断是否为blob
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isBlob (obj: any): boolean %checks {
  return obj instanceof Blob;
}
/**
 * 判断是否为file上传的文件
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isFile (obj: any): boolean %checks {
  return isBlob(obj) && isString(obj.name);
}
/**
 * 判断是否为日期对象
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isDate (obj: any): boolean %checks {
  return Object.prototype.toString.call(obj) === '[object Date]';
}
/**
 * 判断是否是string
 * @param  {Anything}  str [description]
 * @return {Boolean}     [description]
 */
export function isString (str: any): boolean %checks {
  return typeof str === 'string';
   // || str instanceof String;
   // not support new String() because of flow
}
/**
 * is Boolean or not
 * @param  {Anything} bool
 * @return {Boolean}
 */
export function isBoolean (bool: any): boolean %checks {
  return typeof bool === 'boolean';
}
/**
 * is a promise or not
 * @param {Anything} obj
 * @return {boolean}
 */
export function isPromise (obj: any): boolean %checks {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
/**
 * is Primitive type or not, whick means it will return true when data is number/string/boolean/undefined/null
 * @param  {Anyting}  val
 * @return {Boolean}  true when type is number/string/boolean/undefined/null
 */
export function isPrimitive (val: any): boolean %checks {
  return isVoid(val) || isBoolean(val) || isString(val) || isNumber(val);
}
/**
 * 判断是否为url且必须要带有协议头
 * @param  {Anything}  str [description]
 * @return {Boolean}     [description]
 */
export function isUrl (str: any): boolean %checks {
  return isString(str) && !!str.match(/^((https?|ftp|rtsp|mms):\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6}|localhost)(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/i);
}
/**
 * to test if a HTML node
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isNode (obj: any): boolean %checks {
  return !!(typeof Node === 'object'
      ? obj instanceof Node
      : obj &&
        typeof obj === 'object' &&
        typeof obj.nodeType === 'number' &&
        typeof obj.nodeName === 'string');
}
/**
 * to test if a HTML element
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
export function isElement (obj: any): boolean %checks {
  return !!(typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement
    : obj &&
      typeof obj === 'object' &&
      obj !== null &&
      obj.nodeType === 1 &&
      typeof obj.nodeName === 'string');
}
/**
 * check if node A is node B's parent or not
 * @param  {Node}  parent
 * @param  {Node}  child
 * @return {Boolean}
 */
export function isChildNode (parent: Node, child: Node): boolean {
  if(!isNode(parent) || !isNode(child)) {
    return false;
  }
  return child.parentNode === parent;
}
/**
 * check if node B is node A's posterrity or not
 * @param  {Node}  parent
 * @param  {Node}  child
 * @return {Boolean}
 */
export function isPosterityNode (parent: Node, child: Node): boolean {
  if(!isNode(parent) || !isNode(child)) {
    return false;
  }
  while(child.parentNode) {
    child = child.parentNode;
    if(child === parent) {
      return true;
    }
  }
  return false;
}
/**
 * check if the string is an HTMLString
 * @param  {string}  str only accept string
 * @return {Boolean}
 */
export function isHTMLString (str: string): boolean %checks {
  return /<[^>]+?>/.test(str);
}
// **********************  对象操作  ************************
/**
 * sort Object attributes by function
 * and transfer them into array
 * @param  {Object} obj Object form from numric
 * @param  {Function} fn sort function
 * @return {Array} the sorted attirbutes array
 */
export function transObjectAttrIntoArray (obj: Object, fn: Function = (a, b) => +a - +b): Array<string> {
  return Object.keys(obj)
  .sort(fn)
  .reduce((order, key) => {
    return order.concat(obj[key]);
  }, []);
}
/**
 * 生成深度遍历函数的处理器，常用于生成深度拷贝等
 * @param  {Function} fn 遍历到深度变量的时候的操作
 * @return {Function}     可用的操作函数
 */
export function genTraversalHandler (fn: Function): Function {
  function recursiveFn (source, target, key) {
    if(isArray(source) || isObject(source)) {
      target = target || (isObject(source) ? {} : []);
      for(const key in source) {
        target[key] = recursiveFn(source[key], target[key], key);
      }
      return target;
    }
    return fn(source, target, key);
  };
  return recursiveFn;
};
const _deepAssign = genTraversalHandler(val => val);
/**
 * 对象克隆
 * @param  {Array|Object} source 传其他值会直接返回
 * @return {clone-target}        [description]
 */
export function deepClone<T: Object | Array<any>> (source: T): T {
  if(isPrimitive(source)) {
      throw new TypeError('deepClone only accept non primitive type');
    }
  return _deepAssign(source);
};
/**
 * merge multiple objects
 * @param  {...Object} args [description]
 * @return {merge-object}         [description]
 */
export function deepAssign<T: any> (...args: Array<T>): T & T {
  if(args.length < 2) {
    throw new Error('deepAssign accept two and more argument');
  }
  for(let i = args.length - 1; i > -1; i--) {
    if(isPrimitive(args[i])) {
      throw new TypeError('deepAssign only accept non primitive type');
    }
  }
  const target = args.shift();
  args.forEach(source => _deepAssign(source, target));
  return target;
}
// **********************  计算类    ************************
// 计算获取某种东西或者计算出某种东西
// ********************************************************
// 生成uuid
export function uuid () {
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}
// 生成四个随机数
export function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
// 生成任意长度的随机数
export function rand (length: number): string {
  let str = '';
  while(str.length < length) {
    str += S4();
  }
  return str.slice(0, length);
}
// ********************** class operation ***************************
// class MixinBuilder {
//   constructor (superclass) {
//     this.superclass = superclass || class {};
//   }

//   with (...mixins) {
//     return mixins.reduce((c, mixin) => mixin(c), this.superclass);
//   }
// }
// export const mix = (superclass) => {
//   return new MixinBuilder(superclass);
// };
/**
 * run a queue one by one.If include function reject or return false it will stop
 * @param  {Array} queue the queue which we want to run one by one
 * @return {Promise}    tell us whether a queue run finished
 */
export function runRejectableQueue (queue: Array<any>, ...args: any): Promise<*> {
  return new Promise((resolve, reject) => {
    const step = index => {
      if(index >= queue.length) {
        resolve();
        return;
      }
      const result = isFunction(queue[index])
        ? queue[index](...args)
        : queue[index];
      if(result === false) return reject('stop');
      return Promise.resolve(result)
        .then(() => step(index + 1))
        .catch(() => reject('stop'));
    };
    step(0);
  });
}
/**
 * run a queue one by one.If include function return false it will stop
 * @param  {Array} queue the queue which we want to run one by one
 * @return {boolean} tell the user if the queue run finished
 */
export function runStoppableQueue (queue: Array<any>, ...args: any): boolean {
  const step = index => {
    if(index >= queue.length) {
      return true;
    }
    const result = isFunction(queue[index])
      ? queue[index](...args)
      : queue[index];
    if(result === false) return false;
    return step(++index);
  };
  return step(0);
}
/**
 * set an attribute to an object which is frozen.
 * Means you can't remove it, iterate it or rewrite it.
 * @param {!primitive} obj
 * @param {string} key
 * @param {Anything} value
 */
export function setFrozenAttr (obj: Object, key: string, value: any) {
  if(isPrimitive(obj)) throw TypeError('setFrozenAttr obj parameter can not be primitive type');
  if(!isString(key)) throw TypeError('setFrozenAttr key parameter must be String');
  Object.defineProperty(obj, key, {
    value,
    configurable: false,
    enumerable: false,
    writable: false
  });
}
/**
 * set attr on an Object. We will bind getter and setter on it if you provide to us
 * @param {!primitive} obj
 * @param {string} key
 * @param {Function} options.get
 * @param {Function} options.set
 * @param {String} prefix the origin data's prefix. We do not plan to save it by closure.
 */
export function setAttrGetterAndSetter (obj: Object, key: string, {get, set}: {get?: Function, set?: Function} = {}, prefix: string = '__') {
  if(isPrimitive(obj)) throw TypeError('setFrozenAttr obj parameter can not be primitive type');
  if(!isString(key)) throw TypeError('setAttrGetterAndSetter key parameter must be String');
  const originalData = obj[key];
  if(!isFunction(get)) {
    Object.defineProperty(obj, prefix + key, {
      value: originalData,
      configurable: true,
      writable: true,
      enumerable: false
    });
    get = function () {return this[prefix + key];};
    if(set && isFunction(set)) {
      const originSetter = set;
      set = function (...args) {
        this[prefix + key] = originSetter.call(this, ...args);
      };
    }
  }
  Object.defineProperty(obj, key, {get, set});
}
/**
 * camelize any string, e.g hello world -> helloWorld
 * @param  {string} str only accept string!
 * @return {string}     camelize string
 */
export function camelize (str: string, isBig: ?boolean): string {
  return str.replace(/(^|[^a-zA-Z]+)([a-zA-Z])/g, function (match, spilt, initials, index) {
    return (!isBig && index === 0)
      ? initials.toLowerCase()
      : initials.toUpperCase();
  });
}
/**
 * hypenate any string e.g hello world -> hello-world
 * @param  {string} str only accept string
 * @return {string}
 */
export function hypenate (str: string): string {
  return camelize(str).replace(/([A-Z])/g, match => '-' + match.toLowerCase());
}
/**
 * to check if an descriptor
 * @param {anything} desc
 */
export function isDescriptor (desc: any): boolean {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  const keys = ['value', 'initializer', 'get', 'set'];

  for (let i = 0, l = keys.length; i < l; i++) {
    if (desc.hasOwnProperty(keys[i])) {
      return true;
    }
  }

  return false;
}

export function isAccessorDescriptor (desc: any): boolean %checks {
  return isFunction(desc.get) &&
    // isFunction(desc.set) &&
    isBoolean(desc.configurable) &&
    isBoolean(desc.enumerable) &&
    desc.writable === undefined;
}

export function createDefaultSetter (key: string) {
  return function set (newValue: any): any {
    Object.defineProperty(this, key, {
      configurable: true,
      writable: true,
      // IS enumerable when reassigned by the outside word
      enumerable: true,
      value: newValue
    });

    return newValue;
  };
}

export function bind (fn: Function, context: Object): Function {
  if (fn.bind) {
    return fn.bind(context);
  } else if(fn.apply) {
    return function __autobind__ (...args: any) {
      return fn.apply(context, args);
    };
  } else {
    return function __autobind__ (...args: any) {
      return fn.call(context, ...args);
    };
  }
}

export function wrapAccessorDescriptor ({get, set}: {get?: Function, set?: Function}, desc: AccessorDescriptor): AccessorDescriptor {
  if(!isFunction(get) && !isFunction(set)) return desc;
  const getter = isFunction(get)
    ? function () {
      // $FlowFixMe: isFunction has already excluded undefined.
      return bind(get, this)(bind(desc.get, this)());
    }
    : desc.get;
  const setter = isFunction(set)
    ? function (value) {
      // $FlowFixMe: isFunction has already excluded undefined.
      return bind(desc.set, this)((bind(set, this)(value)));
    }
    : desc.set;
  return {
    get: getter,
    set: setter,
    configurable: desc.configurable,
    enumerable: desc.enumerable
  };
}

export function transDataIntoAccessor ({get, set}: {get?: Function, set?: Function}, desc: DataDescriptor): AccessorDescriptor {
  let val = desc.value;
  const getter = isFunction(get)
    ? function () {
      // $FlowFixMe: isFunction has already excluded undefined.
      return bind(get, this)(val);
    }
    : function () {
      return val;
    };
  const setter = isFunction(set)
    ? function (value) {
      // $FlowFixMe: isFunction has already excluded undefined.
      val = bind(set, this)(value);
      return val;
    }
    : function (value) {
      val = value;
      return val;
    };
  return {
    get: getter,
    set: setter,
    configurable: desc.configurable,
    enumerable: desc.enumerable
  };
}
