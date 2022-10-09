
/**
 * toxic-decorators v0.4.0-beta.16
 * (c) 2017-2022 toxic-johann
 * Released under MIT
 * Built ad Sun Oct 09 2022 12:57:52 GMT+0800 (China Standard Time)
 */

import { isFunction, isBoolean, isArray, bind, isString, isObject, isPlainObject, isNil, isNumber } from 'lodash-es';
import _typeof from '@babel/runtime/helpers/typeof';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import { isPromise } from 'toxic-predicate-functions';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { getDeepProperty } from 'toxic-utils';
import _defineProperty from '@babel/runtime/helpers/defineProperty';

var getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;
function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  var keys = ['value', 'initializer', 'get', 'set'];

  for (var i = 0, l = keys.length; i < l; i++) {
    if (desc.hasOwnProperty(keys[i])) {
      return true;
    }
  }

  return false;
}
function isAccessorDescriptor(desc) {
  return desc && (isFunction(desc.get) || isFunction(desc.set)) && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && desc.writable === undefined;
}
function isDataDescriptor(desc) {
  return desc && desc.hasOwnProperty('value') && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && isBoolean(desc.writable);
}
function isInitializerDescriptor(desc) {
  return desc && isFunction(desc.initializer) && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && isBoolean(desc.writable);
}
function createDefaultSetter(key) {
  return function set(newValue) {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      value: newValue,
      writable: true
    });
    return newValue;
  };
}
function compressOneArgFnArray(fns) {
  var errmsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'You must pass me an array of function';

  if (!isArray(fns) || fns.length < 1) {
    throw new TypeError(errmsg);
  }

  if (fns.length === 1) {
    if (!isFunction(fns[0])) {
      throw new TypeError(errmsg);
    }

    return fns[0];
  }

  return fns.reduce(function (prev, curr) {
    if (!isFunction(curr) || !isFunction(prev)) {
      throw new TypeError(errmsg);
    }

    return function (value) {
      return bind(curr, this)(bind(prev, this)(value));
    };
  });
}
function warn(message) {
  if (isFunction(console.warn)) {
    return console.warn(message);
  }

  console.log(message);
}
function getOwnKeysFn() {
  var getOwnPropertyNames = Object.getOwnPropertyNames,
      getOwnPropertySymbols = Object.getOwnPropertySymbols;
  return isFunction(getOwnPropertySymbols) ? function (obj) {
    return [].concat(_toConsumableArray(getOwnPropertySymbols(obj)), _toConsumableArray(getOwnPropertyNames(obj)));
  } : getOwnPropertyNames;
}
var getOwnKeys = getOwnKeysFn();
function getOwnPropertyDescriptorsFn() {
  return isFunction(Object.getOwnPropertyDescriptors) ? Object.getOwnPropertyDescriptors : function (obj) {
    return getOwnKeys(obj).reduce(function (descs, key) {
      descs[key] = getOwnPropertyDescriptor$3(obj, key);
      return descs;
    }, {});
  };
}
var getOwnPropertyDescriptors = getOwnPropertyDescriptorsFn();
function compressMultipleDecorators() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (!fns.length) {
    throw new TypeError('You must pass in decorators in compressMultipleDecorators');
  }

  fns.forEach(function (fn) {
    if (!isFunction(fn)) {
      throw new TypeError("Decorators must be a function, but not \"".concat(fn, "\" in ").concat(_typeof(fn)));
    }
  });

  if (fns.length === 1) {
    return fns[0];
  }

  return function (obj, prop, descirptor) {
    return fns.reduce(function (aDescirptor, fn) {
      return fn(obj, prop, aDescirptor);
    }, descirptor);
  };
}

function accessor() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      get = _ref.get,
      set = _ref.set;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$preGet = _ref2.preGet,
      preGet = _ref2$preGet === void 0 ? false : _ref2$preGet,
      _ref2$preSet = _ref2.preSet,
      preSet = _ref2$preSet === void 0 ? true : _ref2$preSet;

  if (!(isArray(get) && get.length > 0) && !(isArray(set) && set.length > 0) && !isFunction(get) && !isFunction(set)) {
    throw new TypeError('@accessor need a getter or setter. If you don\'t need to add setter/getter. You should remove @accessor');
  }

  var errmsg = '@accessor only accept function or array of function as getter/setter';
  var singleFnGet = isArray(get) ? compressOneArgFnArray(get, errmsg) : get;
  var singleFnSet = isArray(set) ? compressOneArgFnArray(set, errmsg) : set;
  return function (obj, prop, descriptor) {
    var _ref3 = descriptor || {},
        _ref3$configurable = _ref3.configurable,
        configurable = _ref3$configurable === void 0 ? true : _ref3$configurable,
        _ref3$enumerable = _ref3.enumerable,
        enumerable = _ref3$enumerable === void 0 ? true : _ref3$enumerable;

    var hasGet = isFunction(singleFnGet);
    var hasSet = isFunction(singleFnSet);

    var handleGet = function handleGet(value) {
      return hasGet ? bind(singleFnGet, this)(value) : value;
    };

    var handleSet = function handleSet(value) {
      return hasSet ? bind(singleFnSet, this)(value) : value;
    };

    if (isAccessorDescriptor(descriptor)) {
      var originGet = descriptor.get,
          originSet = descriptor.set;
      var hasOriginGet = isFunction(originGet);
      var hasOriginSet = isFunction(originSet);

      if (process.env.NODE_ENV !== 'production' && !hasOriginGet && hasGet) {
        warn("You are trying to set getter via @accessor on ".concat(prop, " without getter. That's not a good idea."));
      }

      if (process.env.NODE_ENV !== 'production' && !hasOriginSet && hasSet) {
        warn("You are trying to set setter via @accessor on  ".concat(prop, " without setter. That's not a good idea."));
      }

      var getter = hasOriginGet || hasGet ? function () {
        var _this = this;

        var boundGetter = bind(handleGet, this);

        var originBoundGetter = function originBoundGetter() {
          return hasOriginGet ? bind(originGet, _this)() : undefined;
        };

        var order = preGet ? [boundGetter, originBoundGetter] : [originBoundGetter, boundGetter];
        return order.reduce(function (value, fn) {
          return fn(value);
        }, undefined);
      } : undefined;
      var setter = hasOriginSet || hasSet ? function (val) {
        var _this2 = this;

        var boundSetter = bind(handleSet, this);

        var originBoundSetter = function originBoundSetter(value) {
          return hasOriginSet ? bind(originSet, _this2)(value) : value;
        };

        var order = preSet ? [boundSetter, originBoundSetter] : [originBoundSetter, boundSetter];
        return order.reduce(function (value, fn) {
          return fn(value);
        }, val);
      } : undefined;
      return {
        configurable: configurable,
        enumerable: enumerable,
        get: getter,
        set: setter
      };
    } else if (isInitializerDescriptor(descriptor)) {
      var initializer = descriptor.initializer;

      var _value;

      var inited = false;
      return {
        get: function get() {
          var boundFn = bind(handleGet, this);

          if (inited) {
            return boundFn(_value);
          }

          _value = bind(initializer, this)();
          inited = true;
          return boundFn(_value);
        },
        set: function set(val) {
          var boundFn = bind(handleSet, this);
          _value = preSet ? boundFn(val) : val;
          inited = true;

          if (!preSet) {
            boundFn(_value);
          }

          return _value;
        },
        configurable: configurable,
        enumerable: enumerable
      };
    }

    var _ref4 = descriptor || {
      value: undefined
    },
        value = _ref4.value;

    return {
      get: function get() {
        return bind(handleGet, this)(value);
      },
      set: function set(val) {
        var boundFn = bind(handleSet, this);
        value = preSet ? boundFn(val) : val;

        if (!preSet) {
          boundFn(value);
        }

        return value;
      },
      configurable: configurable,
      enumerable: enumerable
    };
  };
}

function before$1() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) {
    throw new Error('@before accept at least one parameter. If you don\'t need to preprocess before your function, do not add @before decorators');
  }

  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @before straightly, @before return decorators, you should call it before you set it as decorator.');
  }

  for (var i = fns.length - 1; i > -1; i--) {
    if (!isFunction(fns[i])) {
      throw new TypeError('@before only accept function parameter');
    }
  }

  return function (obj, prop, descriptor) {
    var _ref = descriptor || {
      configurable: undefined,
      enumerable: undefined,
      value: undefined,
      writable: undefined
    },
        fn = _ref.value,
        configurable = _ref.configurable,
        enumerable = _ref.enumerable,
        writable = _ref.writable;

    if (!isFunction(fn)) {
      throw new TypeError("@before can only be used on function, please check the property \"".concat(prop, "\" is a method or not."));
    }

    var handler = function handler() {
      var _this = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var paras = fns.reduce(function (paras, fn) {
        var result = bind(fn, _this).apply(void 0, _toConsumableArray(paras));
        return result === undefined ? paras : isArray(result) ? result : [result];
      }, args);
      return bind(fn, this).apply(void 0, _toConsumableArray(paras));
    };

    return {
      configurable: configurable,
      enumerable: enumerable,
      value: handler,
      writable: writable
    };
  };
}

function after$1() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) {
    throw new Error('@after accept at least one parameter. If you don\'t need to preprocess after your function, do not add @after decorators');
  }

  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may have used @after straightly. @after return decorators. You should call it before you use it as decorators');
  }

  var fn = compressOneArgFnArray(fns, '@after only accept function parameter');
  return function (obj, prop, descriptor) {
    var _ref = descriptor || {
      configurable: undefined,
      enumerable: undefined,
      value: undefined,
      writable: undefined
    },
        value = _ref.value,
        configurable = _ref.configurable,
        enumerable = _ref.enumerable,
        writable = _ref.writable;

    if (!isFunction(value)) {
      throw new TypeError("@after can only be used on function, please checkout your property \"".concat(prop, "\" is a method or not."));
    }

    var handler = function handler() {
      var ret = bind(value, this).apply(void 0, arguments);
      return bind(fn, this)(ret);
    };

    return {
      configurable: configurable,
      enumerable: enumerable,
      value: handler,
      writable: writable
    };
  };
}

function readonly(obj, prop, descriptor) {
  if (descriptor === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      warn("You are using @readonly on an undefined property \"".concat(prop, "\". This property will become a readonly undefined forever, which is meaningless."));
    }

    return {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: false
    };
  }

  if (isAccessorDescriptor(descriptor)) {
    descriptor.set = undefined;
    return descriptor;
  }

  descriptor.writable = false;
  return descriptor;
}

function initialize() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) {
    throw new Error('@initialize accept at least one parameter. If you don\'t need to initialize your value, do not add @initialize.');
  }

  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @initialize straightly, @initialize return decorators, you need to call it');
  }

  var fn = compressOneArgFnArray(fns, '@initialize only accept function parameter');
  return function (obj, prop, descriptor) {
    if (descriptor === undefined) {
      return {
        configurable: true,
        enumerable: true,
        value: bind(fn, obj)(),
        writable: true
      };
    }

    if (isAccessorDescriptor(descriptor)) {
      var hasBeenReset = false;
      var originSet = descriptor.set;
      return accessor({
        get: function get(value) {
          if (hasBeenReset) {
            return value;
          }

          return bind(fn, this)(value);
        },
        set: originSet ? function (value) {
          hasBeenReset = true;
          return value;
        } : undefined
      })(obj, prop, descriptor);
    }

    if (isInitializerDescriptor(descriptor)) {
      var initializer = descriptor.initializer;

      var handler = function handler() {
        return bind(fn, this)(bind(initializer, this)());
      };

      return {
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable,
        initializer: handler,
        writable: descriptor.writable
      };
    }

    var value = bind(fn, this)(descriptor.value);
    return {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      value: value,
      writable: descriptor.writable
    };
  };
}

var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor,
    defineProperty$6 = Object.defineProperty;

function setAlias(root, prop, _ref, obj, key, _ref2) {
  var configurable = _ref.configurable,
      enumerable = _ref.enumerable;
  var force = _ref2.force,
      omit = _ref2.omit;
  var originDesc = getOwnPropertyDescriptor$2(obj, key);

  if (originDesc !== undefined) {
    if (omit) {
      return;
    }

    if (!force) {
      throw new Error("\"".concat(prop, "\" is an existing property, if you want to override it, please set \"force\" true in @alias option."));
    }

    if (!originDesc.configurable) {
      throw new Error("property \"".concat(prop, "\" is unconfigurable."));
    }
  }

  defineProperty$6(obj, key, {
    get: function get() {
      return root[prop];
    },
    set: function set(value) {
      root[prop] = value;
    },
    configurable: configurable,
    enumerable: enumerable
  });
}

function alias(other, key, option) {
  if (arguments.length === 2) {
    if (isString(other)) {
      option = key;
      key = other;
      other = undefined;
    }
  } else if (arguments.length === 1) {
    key = other;
    other = undefined;
  }

  if (!isString(key)) {
    throw new TypeError('@alias need a string as a key to find the porperty to set alias on');
  }

  var illegalObjErrorMsg = 'If you want to use @alias to set alias on other instance, you must pass in a legal instance';

  if (other !== undefined && !isObject(other)) {
    throw new TypeError(illegalObjErrorMsg);
  }

  var _ref3 = isPlainObject(option) ? option : {
    force: false,
    omit: false
  },
      force = _ref3.force,
      omit = _ref3.omit;

  return function (obj, prop, descriptor) {
    descriptor = descriptor || {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: true
    };

    function getTargetAndName(other, obj, key) {
      var target = !isObject(other) ? obj : other;
      var keys = key.split('.');

      var _keys$slice = keys.slice(-1),
          _keys$slice2 = _slicedToArray(_keys$slice, 1),
          name = _keys$slice2[0];

      target = getDeepProperty(target, keys.slice(0, -1), {
        throwError: true
      });

      if (!isObject(target)) {
        throw new TypeError(illegalObjErrorMsg);
      }

      return {
        name: name,
        target: target
      };
    }

    if (isInitializerDescriptor(descriptor)) {
      return initialize(function (value) {
        var _getTargetAndName = getTargetAndName(other, this, key),
            target = _getTargetAndName.target,
            name = _getTargetAndName.name;

        setAlias(this, prop, descriptor, target, name, {
          force: force,
          omit: omit
        });
        return value;
      })(obj, prop, descriptor);
    }

    if (isAccessorDescriptor(descriptor)) {
      var inited;

      var handler = function handler(value) {
        if (inited) {
          return value;
        }

        var _getTargetAndName2 = getTargetAndName(other, this, key),
            target = _getTargetAndName2.target,
            name = _getTargetAndName2.name;

        setAlias(this, prop, descriptor, target, name, {
          force: force,
          omit: omit
        });
        inited = true;
        return value;
      };

      return accessor({
        get: handler,
        set: handler
      })(obj, prop, descriptor);
    }

    var _getTargetAndName3 = getTargetAndName(other, obj, key),
        target = _getTargetAndName3.target,
        name = _getTargetAndName3.name;

    setAlias(obj, prop, descriptor, target, name, {
      force: force,
      omit: omit
    });
    return descriptor;
  };
}

var defineProperty$5 = Object.defineProperty;
function classify(decorator) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      requirement = _ref.requirement,
      _ref$customArgs = _ref.customArgs,
      customArgs = _ref$customArgs === void 0 ? false : _ref$customArgs;

  return function () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$exclude = _ref2.exclude,
        exclude = _ref2$exclude === void 0 ? [] : _ref2$exclude,
        _ref2$include = _ref2.include,
        include = _ref2$include === void 0 ? [] : _ref2$include,
        _ref2$construct = _ref2.construct,
        construct = _ref2$construct === void 0 ? false : _ref2$construct,
        _ref2$self = _ref2.self,
        self = _ref2$self === void 0 ? false : _ref2$self;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!isArray(exclude)) {
      throw new TypeError('options.exclude must be an array');
    }

    if (!isArray(include)) {
      throw new TypeError('options.include must be an array');
    }

    return function (Klass) {
      var isClass = isFunction(Klass);

      if (!self && !isClass) {
        throw new TypeError("@".concat(decorator.name, "Class can only be used on class"));
      }

      if (self && !isObject(Klass)) {
        throw new TypeError("@".concat(decorator.name, "Class must be used on non-primitive type value in 'self' mode"));
      }

      var prototype = self ? Klass : Klass.prototype;

      if (isNil(prototype)) {
        throw new Error("The prototype of the ".concat(Klass.name, " is empty, please check it"));
      }

      var descs = getOwnPropertyDescriptors(prototype);
      getOwnKeys(prototype).concat(include).forEach(function (key) {
        var desc = descs[key];

        if (key === 'constructor' && !construct || self && isClass && ['name', 'length', 'prototype'].indexOf(key) > -1 || exclude.indexOf(key) > -1 || isFunction(requirement) && requirement(prototype, key, desc, {
          self: self
        }) === false) {
          return;
        }

        defineProperty$5(prototype, key, (customArgs ? decorator.apply(void 0, args) : decorator)(prototype, key, desc));
      });
    };
  };
}

var mapStore;

function getBoundSuper(obj, fn) {
  if (typeof WeakMap === 'undefined') {
    throw new Error("Using @autobind on ".concat(fn.name, "() requires WeakMap support due to its use of super.").concat(fn.name, "()"));
  }

  if (!mapStore) {
    mapStore = new WeakMap();
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new WeakMap());
  }

  var superStore = mapStore.get(obj);

  if (superStore.has(fn) === false) {
    superStore.set(fn, bind(fn, obj));
  }

  return superStore.get(fn);
}

function autobind$1(obj, prop, descriptor) {
  if (arguments.length === 1) {
    return classify(autobind$1, {
      requirement: function requirement(obj, prop, desc) {
        return isDataDescriptor(desc) && isFunction(desc.value);
      }
    })()(obj);
  }

  var _ref = descriptor || {
    configurable: undefined,
    value: undefined
  },
      fn = _ref.value,
      configurable = _ref.configurable;

  if (!isFunction(fn)) {
    throw new TypeError("@autobind can only be used on functions, not \"".concat(fn, "\" in ").concat(_typeof(fn), " on property \"").concat(prop, "\""));
  }

  var constructor = obj.constructor;
  return {
    configurable: configurable,
    enumerable: false,
    get: function get() {
      var _this = this;

      var boundFn = function boundFn() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return fn.call.apply(fn, [_this].concat(args));
      };

      if (this === obj) {
        return fn;
      }

      if (this.constructor !== constructor && Object.getPrototypeOf(this).constructor === constructor) {
        return fn;
      }

      if (this.constructor !== constructor && prop in this.constructor.prototype) {
        return getBoundSuper(this, fn);
      }

      Object.defineProperty(this, prop, {
        configurable: true,
        enumerable: false,
        value: boundFn,
        writable: true
      });
      return boundFn;
    },
    set: createDefaultSetter(prop)
  };
}

var defineProperty$4 = Object.defineProperty;
function frozen(obj, prop, descriptor) {
  if (descriptor === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      warn("You are using @frozen on an undefined property. This property will become a frozen undefined forever, which is meaningless. It's property name is ".concat(prop, "."));
    }

    return {
      configurable: false,
      enumerable: false,
      value: undefined,
      writable: false
    };
  }

  descriptor.enumerable = false;
  descriptor.configurable = false;

  if (isAccessorDescriptor(descriptor)) {
    var _get = descriptor.get;
    descriptor.set = undefined;

    if (!isFunction(_get)) {
      if (process.env.NODE_ENV !== 'production') {
        warn('You are using @frozen on one accessor descriptor without getter. This property will become a frozen undefined finally.Which maybe meaningless.');
      }

      return;
    }

    return {
      configurable: false,
      enumerable: false,
      get: function get() {
        var value = bind(_get, this)();
        defineProperty$4(this, prop, {
          configurable: false,
          enumerable: false,
          value: value,
          writable: false
        });
        return value;
      },
      set: undefined
    };
  }

  descriptor.writable = false;
  return descriptor;
}

var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor,
    defineProperty$3 = Object.defineProperty;
function waituntil$1(key) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      other = _ref.other;

  if (!isFunction(key) && !isPromise(key) && !isString(key)) {
    throw new TypeError('@waitUntil only accept Function, Promise or String');
  }

  return function (obj, prop, descriptor) {
    var _ref2 = descriptor || {
      configurable: undefined,
      value: undefined
    },
        _value = _ref2.value,
        configurable = _ref2.configurable;

    if (!isFunction(_value)) {
      throw new TypeError("@waituntil can only be used on function, but not ".concat(_value, " on property \"").concat(prop, "\""));
    }

    var binded = false;
    var waitingQueue = [];
    var canIRun = isPromise(key) ? function () {
      return key;
    } : isFunction(key) ? key : function () {
      var keys = key.split('.');

      var _keys$slice = keys.slice(-1),
          _keys$slice2 = _slicedToArray(_keys$slice, 1),
          prop = _keys$slice2[0];

      var originTarget = !isObject(other) ? this : other;

      if (!binded) {
        var target = getDeepProperty(originTarget, keys.slice(0, -1));

        if (isNil(target)) {
          return target;
        }

        var _descriptor = getOwnPropertyDescriptor$1(target, prop);

        var set = function set(value) {
          if (value === true) {
            while (waitingQueue.length > 0) {
              waitingQueue[0]();
              waitingQueue.shift();
            }
          }

          return value;
        };

        var desc = isDescriptor(_descriptor) ? accessor({
          set: set
        })(target, prop, _descriptor) : accessor({
          set: set
        })(target, prop, {
          configurable: true,
          enumerable: true,
          value: undefined,
          writable: true
        });

        if (desc) {
          defineProperty$3(target, prop, desc);
        }

        binded = true;
      }

      return getDeepProperty(originTarget, keys);
    };
    return {
      configurable: configurable,
      enumerable: false,
      value: function value() {
        var _this = this;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var boundFn = bind(_value, this);
        var runnable = bind(canIRun, this).apply(void 0, args);

        if (isPromise(runnable)) {
          return Promise.resolve(runnable).then(function () {
            return bind(_value, _this).apply(void 0, args);
          });
        } else if (runnable === true) {
          return bind(_value, this).apply(void 0, args);
        }

        return new Promise(function (resolve) {
          var cb = function cb() {
            boundFn.apply(void 0, args);
            resolve();
          };

          waitingQueue.push(cb);
        });
      },
      writable: false
    };
  };
}

var defineProperty$2 = Object.defineProperty;
function lazyInit(obj, prop, descriptor) {
  if (descriptor === undefined) {
    throw new TypeError('@lazyInit cannot be apply on undefined property.');
  }

  if (!isFunction(descriptor.initializer)) {
    if (process.env.NODE_ENV !== 'production') {
      warn("@lazyInit can only be used on property, but not propery \"".concat(prop, "\" which may be methods or getter/setter."));
    }

    return descriptor;
  }

  var initializer = descriptor.initializer,
      configurable = descriptor.configurable,
      enumerable = descriptor.enumerable,
      writable = descriptor.writable;
  return {
    configurable: configurable,
    enumerable: enumerable,
    get: function get() {
      var value = bind(initializer, this)();
      defineProperty$2(this, prop, {
        configurable: configurable,
        enumerable: enumerable,
        value: value,
        writable: writable
      });
      return value;
    },
    set: createDefaultSetter(prop)
  };
}

var defineProperty$1 = Object.defineProperty;
function lock(obj, prop, descriptor) {
  if (descriptor === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      warn("You are using @lock on an undefined property \"".concat(prop, "\". This property will become a lock undefined forever, which is meaningless."));
    }

    return {
      configurable: false,
      enumerable: true,
      value: undefined,
      writable: false
    };
  }

  descriptor.configurable = false;

  if (isAccessorDescriptor(descriptor)) {
    var _get = descriptor.get;
    descriptor.set = undefined;

    if (!isFunction(_get)) {
      warn('You are using @lock on one accessor descriptor without getter. This property will become a lock undefined finally.Which maybe meaningless.');
      return;
    }

    return {
      configurable: false,
      enumerable: descriptor.enumerable,
      get: function get() {
        var value = bind(_get, this)();
        defineProperty$1(this, prop, {
          configurable: false,
          enumerable: descriptor.enumerable,
          value: value,
          writable: false
        });
        return value;
      },
      set: undefined
    };
  }

  descriptor.writable = false;
  return descriptor;
}

var defineProperty = Object.defineProperty,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function applyDecorators(Class, props) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$self = _ref.self,
      self = _ref$self === void 0 ? false : _ref$self,
      _ref$omit = _ref.omit,
      omit = _ref$omit === void 0 ? false : _ref$omit;

  var isPropsFunction = isFunction(props);

  if (isPropsFunction || isArray(props)) {
    if (!isFunction(Class)) {
      throw new TypeError('If you want to decorator class, you must pass it a legal class');
    }

    if (isPropsFunction) {
      props(Class);
    } else {
      for (var i = 0, len = props.length; i < len; i++) {
        var fn = props[i];

        if (!isFunction(fn)) {
          throw new TypeError('If you want to decorate an class, you must pass it function or array of function');
        }

        fn(Class);
      }
    }

    return Class;
  }

  if (!self && !isFunction(Class)) {
    throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
  }

  if (self && !isObject(Class)) {
    throw new TypeError('We can\'t apply docorators on a primitive value, even in self mode');
  }

  if (!isPlainObject(props)) {
    throw new TypeError('applyDecorators only accept object as second arguments');
  }

  var prototype = self ? Class : Class.prototype;

  if (isNil(prototype)) {
    throw new Error('The class muse have a prototype, please take a check');
  }

  for (var key in props) {
    var value = props[key];
    var decorators = isArray(value) ? value : [value];
    var handler = void 0;

    try {
      handler = compressMultipleDecorators.apply(void 0, _toConsumableArray(decorators));
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        warn(err && err.message);
      }

      throw new Error('The decorators set on props must be Function or Array of Function');
    }

    var descriptor = getOwnPropertyDescriptor(prototype, key);

    if (descriptor && !descriptor.configurable) {
      if (!omit) {
        throw new Error("".concat(key, " of ").concat(prototype, " is unconfigurable"));
      }

      continue;
    }

    defineProperty(prototype, key, handler(prototype, key, descriptor));
  }

  return Class;
}

function nonenumerable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      configurable: true,
      enumerable: false,
      value: undefined,
      writable: true
    };
  }

  descriptor.enumerable = false;
  return descriptor;
}

var arrayChangeMethod = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];

function deepProxy(value, hook, _ref) {
  var _operateProps;

  var diff = _ref.diff,
      operationPrefix = _ref.operationPrefix;
  var mapStore = {};
  var arrayChanging = false;
  var proxyValue = new Proxy(value, {
    get: function get(target, property, receiver) {
      var value = target[property];

      if (isArray(target) && arrayChangeMethod.indexOf(property) > -1) {
        return function () {
          arrayChanging = true;
          bind(value, receiver).apply(void 0, arguments);
          arrayChanging = false;
          hook();
        };
      }

      if (mapStore[property] === true) {
        return value;
      }

      if (isPlainObject(value) || isArray(value)) {
        var _proxyValue = mapStore[property] || deepProxy(value, hook, {
          diff: diff,
          operationPrefix: operationPrefix
        });

        mapStore[property] = _proxyValue;
        return _proxyValue;
      }

      mapStore[property] = true;
      return value;
    },
    set: function set(target, property, value) {
      var oldVal = target[property];
      var newVal = isPlainObject(value) || isArray(value) ? deepProxy(value, hook, {
        diff: diff,
        operationPrefix: operationPrefix
      }) : value;
      target[property] = newVal;
      mapStore[property] = true;

      if (arrayChanging || diff && oldVal === newVal) {
        return true;
      }

      hook();
      return true;
    },
    deleteProperty: function deleteProperty(target, property) {
      delete target[property];
      delete mapStore[property];

      if (arrayChanging) {
        return true;
      }

      hook();
      return true;
    }
  });
  var operateProps = (_operateProps = {}, _defineProperty(_operateProps, operationPrefix + 'set', [initialize(function () {
    return function (property, val) {
      proxyValue[property] = val;
    };
  }), nonenumerable]), _defineProperty(_operateProps, operationPrefix + 'del', [initialize(function () {
    return function (property) {
      delete proxyValue[property];
    };
  }), nonenumerable]), _operateProps);
  applyDecorators(proxyValue, operateProps, {
    self: true
  });
  return proxyValue;
}

function deepObserve(value, hook, _ref2) {
  var _this = this,
      _operateProps2;

  var operationPrefix = _ref2.operationPrefix,
      diff = _ref2.diff;
  var mapStore = {};
  var arrayChanging = false;

  function getPropertyDecorators(keys) {
    var oldVal;
    return keys.reduce(function (props, key) {
      props[key] = [accessor({
        set: function set(value) {
          oldVal = this[key];
          return value;
        }
      }), accessor({
        get: function get(val) {
          if (mapStore[key]) {
            return val;
          }

          if (isPlainObject(val) || isArray(val)) {
            deepObserve(val, hook, {
              operationPrefix: operationPrefix,
              diff: diff
            });
          }

          mapStore[key] = true;
          return val;
        },
        set: function set(val) {
          if (isPlainObject(val) || isArray(val)) {
            deepObserve(val, hook, {
              operationPrefix: operationPrefix,
              diff: diff
            });
          }

          mapStore[key] = true;

          if (!arrayChanging && (!diff || oldVal !== val)) {
            hook();
          }

          return val;
        }
      }, {
        preSet: false
      })];
      return props;
    }, {});
  }

  var props = getPropertyDecorators(getOwnKeys(value));
  applyDecorators(value, props, {
    self: true,
    omit: true
  });

  if (isArray(value)) {
    var methodProps = arrayChangeMethod.reduce(function (props, key) {
      props[key] = [initialize(function (method) {
        method = isFunction(method) ? method : Array.prototype[key];
        return function () {
          var originLength = value.length;
          arrayChanging = true;
          bind(method, value).apply(void 0, arguments);
          arrayChanging = false;

          if (originLength < value.length) {
            var keys = new Array(value.length - originLength).fill(1).map(function (value, index) {
              return (index + originLength).toString();
            });

            var _props = getPropertyDecorators(keys);

            applyDecorators(value, _props, {
              self: true,
              omit: true
            });
          }

          hook();
        };
      }), nonenumerable];
      return props;
    }, {});
    applyDecorators(value, methodProps, {
      self: true
    });
  }

  var operateProps = (_operateProps2 = {}, _defineProperty(_operateProps2, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          disable = _ref3.disable,
          isNewVal = _ref3.isNewVal;

      isNewVal = isNewVal || getOwnKeys(value).indexOf(property) === -1;

      if (isFunction(method)) {
        bind(method, _this)(property, val, {
          disable: true,
          isNewVal: isNewVal
        });
      }

      if (isNewVal) {
        var _props2 = getPropertyDecorators([property]);

        applyDecorators(value, _props2, {
          self: true,
          omit: true
        });
      }

      if (!disable) {
        value[property] = val;
      }
    };
  }), nonenumerable]), _defineProperty(_operateProps2, operationPrefix + 'del', [initialize(function (method) {
    return function (property) {
      if (isFunction(method)) {
        bind(method, _this)(property);
      } else {
        delete value[property];
      }

      hook();
    };
  }), nonenumerable]), _operateProps2);
  applyDecorators(value, operateProps, {
    self: true
  });
  return value;
}

function watch() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var option = isPlainObject(args[args.length - 1]) ? args[args.length - 1] : {};
  var deep = option.deep,
      omit = option.omit,
      other = option.other,
      _option$operationPref = option.operationPrefix,
      operationPrefix = _option$operationPref === void 0 ? '__' : _option$operationPref,
      _option$diff = option.diff,
      diff = _option$diff === void 0 ? true : _option$diff;
  var proxy = option.proxy;

  if (typeof Proxy !== 'function') {
    proxy = false;

    if (process.env.NODE_ENV !== 'production') {
      warn('You browser do not support Proxy, we will fall back into observe mode.');
    }
  }

  if (!args.length) {
    throw new TypeError('You must pass a function or a string to find the hanlder function.');
  }

  if (other !== undefined && !isObject(other)) {
    throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
  }

  if (!isString(operationPrefix)) {
    throw new TypeError('operationPrefix must be an string');
  }

  return function (obj, prop, descriptor) {
    var fns = args.reduce(function (fns, keyOrFn, index) {
      if (!isString(keyOrFn) && !isFunction(keyOrFn)) {
        if (!index || index !== args.length - 1) {
          throw new TypeError('You can only pass function or string as handler');
        }

        return fns;
      }

      fns.push(isString(keyOrFn) ? function (newVal, oldVal) {
        var target = other || obj;
        var fn = getDeepProperty(target, keyOrFn);

        if (!isFunction(fn)) {
          if (!omit) {
            throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
          }

          return;
        }

        return bind(fn, this)(newVal, oldVal);
      } : keyOrFn);
      return fns;
    }, []);

    var handler = function handler(newVal, oldVal) {
      var _this2 = this;

      fns.forEach(function (fn) {
        return bind(fn, _this2)(newVal, oldVal);
      });
    };

    var inited = false;
    var oldVal;
    var newVal;
    var proxyValue;
    return compressMultipleDecorators(accessor({
      set: function set(value) {
        var _this3 = this;

        oldVal = this[prop];
        proxyValue = undefined;

        var hook = function hook() {
          return bind(handler, _this3)(newVal, oldVal);
        };

        return deep && (isPlainObject(value) || isArray(value)) ? proxy ? deepProxy(value, hook, {
          diff: diff,
          operationPrefix: operationPrefix
        }) : deepObserve(value, hook, {
          operationPrefix: operationPrefix,
          diff: diff
        }) : value;
      },
      get: function get(value) {
        var _this4 = this;

        if (proxyValue) {
          return proxyValue;
        }

        if (!inited) {
          inited = true;

          var hook = function hook() {
            return bind(handler, _this4)(newVal, oldVal);
          };

          if (deep && (isPlainObject(value) || isArray(value))) {
            if (proxy) {
              proxyValue = deepProxy(value, hook, {
                diff: diff,
                operationPrefix: operationPrefix
              });
              oldVal = proxyValue;
              newVal = proxyValue;
              return proxyValue;
            }

            deepObserve(value, hook, {
              operationPrefix: operationPrefix,
              diff: diff
            });
          }

          oldVal = value;
          newVal = value;
        }

        return value;
      }
    }, {
      preSet: true
    }), accessor({
      set: function set(value) {
        newVal = value;

        if (!diff || oldVal !== value) {
          bind(handler, this)(newVal, oldVal);
        }

        oldVal = value;
        return value;
      }
    }, {
      preSet: false
    }))(obj, prop, descriptor);
  };
}

var preventExtensions = Object.preventExtensions;
function nonextendable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    throw new Error("@nonextendable could not handle undefined property \"".concat(prop, "\"."));
  }

  return initialize(function (value) {
    preventExtensions(value);
    return value;
  })(obj, prop, descriptor);
}

function runnable$1(key) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      other = _ref.other,
      backup = _ref.backup;

  if (!isFunction(key) && !isString(key)) {
    throw new TypeError('@runnable only accept Function or String');
  }

  return function (obj, prop, descriptor) {
    var _ref2 = descriptor || {
      configurable: undefined,
      value: undefined
    },
        _value = _ref2.value,
        configurable = _ref2.configurable;

    if (!isFunction(_value)) {
      throw new TypeError("@runnable can only be used on method, but not ".concat(_value, " on property \"").concat(prop, "\"."));
    }

    var canIRun = isFunction(key) ? key : function () {
      var keys = key.split('.');
      var originTarget = !isObject(other) ? this : other;
      return getDeepProperty(originTarget, keys);
    };
    backup = isFunction(backup) ? backup : function () {};
    return {
      configurable: configurable,
      enumerable: false,
      writable: false,
      value: function value() {
        if (bind(canIRun, this).apply(void 0, arguments) === true) {
          return bind(_value, this).apply(void 0, arguments);
        }

        return bind(backup, this).apply(void 0, arguments);
      }
    };
  };
}

function enumerable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: true
    };
  }

  descriptor.enumerable = true;
  return descriptor;
}

function configurable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      configurable: true,
      enumerable: true,
      value: undefined,
      writable: true
    };
  }

  descriptor.configurable = true;
  return descriptor;
}

function nonconfigurable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      configurable: false,
      enumerable: true,
      value: undefined,
      writable: true
    };
  }

  descriptor.configurable = false;
  return descriptor;
}

function string$1(defaultValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = '';
  } else if (!isString(defaultValue)) {
    defaultValue = '';
  }

  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return initialize.apply(void 0, args);
}

function boolean$1(defaultValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = false;
  } else if (!isBoolean(defaultValue)) {
    defaultValue = false;
  }

  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return initialize.apply(void 0, args);
}

function array$1(defaultValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = [];
  } else if (!isArray(defaultValue)) {
    defaultValue = [];
  }

  args.unshift(function (value) {
    return isArray(value) ? value : defaultValue;
  });
  return initialize.apply(void 0, args);
}

function number$1(defaultValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = 0;
  } else if (!isNumber(defaultValue)) {
    defaultValue = 0;
  }

  args.unshift(function (value) {
    return isNumber(value) ? value : defaultValue;
  });
  return initialize.apply(void 0, args);
}

function string(defaultValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = '';
  } else if (!isString(defaultValue)) {
    defaultValue = '';
  }

  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return accessor({
    set: args,
    get: args
  });
}

function boolean(defaultValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = false;
  } else if (!isBoolean(defaultValue)) {
    defaultValue = false;
  }

  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return accessor({
    set: args,
    get: args
  });
}

function array(defaultValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = [];
  } else if (!isArray(defaultValue)) {
    defaultValue = [];
  }

  args.unshift(function (value) {
    return isArray(value) ? value : defaultValue;
  });
  return accessor({
    set: args,
    get: args
  });
}

function number(defaultValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isFunction(defaultValue)) {
    args.unshift(defaultValue);
    defaultValue = 0;
  } else if (!isNumber(defaultValue)) {
    defaultValue = 0;
  }

  args.unshift(function (value) {
    return isNumber(value) ? value : defaultValue;
  });
  return accessor({
    set: args,
    get: args
  });
}

var autobind = classify(autobind$1, {
  requirement: function requirement(obj, prop, desc) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  }
});

var before = classify(before$1, {
  requirement: function requirement(obj, prop, desc) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true
});

var after = classify(after$1, {
  requirement: function requirement(obj, prop, desc) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true
});

var runnable = classify(runnable$1, {
  requirement: function requirement(obj, prop, desc) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true
});

var waituntil = classify(waituntil$1, {
  requirement: function requirement(obj, prop, desc) {
    return isDataDescriptor(desc) && isFunction(desc.value);
  },
  customArgs: true
});

export { accessor, after$1 as after, after as afterClass, alias, array as alwaysArray, boolean as alwaysBoolean, number as alwaysNumber, string as alwaysString, applyDecorators, autobind$1 as autobind, autobind as autobindClass, before$1 as before, before as beforeClass, classify, configurable, enumerable, frozen, getOwnKeys, getOwnPropertyDescriptors, array$1 as initArray, boolean$1 as initBoolean, number$1 as initNumber, string$1 as initString, initialize, isAccessorDescriptor, isDataDescriptor, isDescriptor, isInitializerDescriptor, lazyInit, lock, nonconfigurable, nonenumerable, nonextendable, readonly, runnable$1 as runnable, runnable as runnableClass, waituntil$1 as waituntil, waituntil as waituntilClass, watch };
