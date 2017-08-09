
/**
 * toxic-decorators v0.3.8
 * (c) 2017 toxic-johann
 * Released under GPL-3.0
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _Object$getOwnPropertyDescriptors = _interopDefault(require('babel-runtime/core-js/object/get-own-property-descriptors'));
var _Array$from = _interopDefault(require('babel-runtime/core-js/array/from'));
var _Object$getOwnPropertySymbols = _interopDefault(require('babel-runtime/core-js/object/get-own-property-symbols'));
var _Object$getOwnPropertyNames = _interopDefault(require('babel-runtime/core-js/object/get-own-property-names'));
var _Object$defineProperty = _interopDefault(require('babel-runtime/core-js/object/define-property'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _Object$getOwnPropertyDescriptor = _interopDefault(require('babel-runtime/core-js/object/get-own-property-descriptor'));
var toxicPredicateFunctions = require('toxic-predicate-functions');
var toxicUtils = require('toxic-utils');
var _toConsumableArray = _interopDefault(require('babel-runtime/helpers/toConsumableArray'));
var _slicedToArray = _interopDefault(require('babel-runtime/helpers/slicedToArray'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _WeakMap = _interopDefault(require('babel-runtime/core-js/weak-map'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _defineProperty = _interopDefault(require('babel-runtime/helpers/defineProperty'));
var _Object$preventExtensions = _interopDefault(require('babel-runtime/core-js/object/prevent-extensions'));

var getOwnPropertyDescriptor = _Object$getOwnPropertyDescriptor;
// **********************  对象操作  ************************
/**
 * sort Object attributes by function
 * and transfer them into array
 * @param  {Object} obj Object form from numric
 * @param  {Function} fn sort function
 * @return {Array} the sorted attirbutes array
 */


/**
 * to check if an descriptor
 * @param {anything} desc
 */
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
/**
 * to check if the descirptor is an accessor descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isAccessorDescriptor(desc) {
  return !!desc && (toxicPredicateFunctions.isFunction(desc.get) || toxicPredicateFunctions.isFunction(desc.set)) && toxicPredicateFunctions.isBoolean(desc.configurable) && toxicPredicateFunctions.isBoolean(desc.enumerable) && desc.writable === undefined;
}
/**
 * to check if the descirptor is an data descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isDataDescriptor(desc) {
  return !!desc && desc.hasOwnProperty('value') && toxicPredicateFunctions.isBoolean(desc.configurable) && toxicPredicateFunctions.isBoolean(desc.enumerable) && toxicPredicateFunctions.isBoolean(desc.writable);
}
/**
 * to check if the descirptor is an initiallizer descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isInitializerDescriptor(desc) {
  return !!desc && toxicPredicateFunctions.isFunction(desc.initializer) && toxicPredicateFunctions.isBoolean(desc.configurable) && toxicPredicateFunctions.isBoolean(desc.enumerable) && toxicPredicateFunctions.isBoolean(desc.writable);
}
/**
 * set one value on the object
 * @param {string} key
 */
function createDefaultSetter(key) {
  return function set(newValue) {
    _Object$defineProperty(this, key, {
      configurable: true,
      writable: true,
      // IS enumerable when reassigned by the outside word
      enumerable: true,
      value: newValue
    });
    return newValue;
  };
}

/**
 * Compress many function into one function, but this function only accept one arguments;
 * @param {Array<Function>} fns the array of function we need to compress into one function
 * @param {string} errmsg When we check that there is something is not function, we will throw an error, you can set your own error message
 */
function compressOneArgFnArray(fns) {
  var errmsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'You must pass me an array of function';

  if (!toxicPredicateFunctions.isArray(fns) || fns.length < 1) {
    throw new TypeError(errmsg);
  }
  if (fns.length === 1) {
    if (!toxicPredicateFunctions.isFunction(fns[0])) {
      throw new TypeError(errmsg);
    }
    return fns[0];
  }
  return fns.reduce(function (prev, curr) {
    if (!toxicPredicateFunctions.isFunction(curr) || !toxicPredicateFunctions.isFunction(prev)) throw new TypeError(errmsg);
    return function (value) {
      return toxicUtils.bind(curr, this)(toxicUtils.bind(prev, this)(value));
    };
  });
}
/**
 * just a method to call console.warn, maybe i will add some handler on it someday
 * @param {anything} args
 */
function warn(message) {
  if (toxicPredicateFunctions.isFunction(console.warn)) return console.warn(message);
  console.log(message);
}

function getOwnKeysFn() {
  var getOwnPropertyNames = _Object$getOwnPropertyNames,
      getOwnPropertySymbols = _Object$getOwnPropertySymbols;

  return toxicPredicateFunctions.isFunction(getOwnPropertySymbols) ? function (obj) {
    // $FlowFixMe: do not support symwbol yet
    return _Array$from(getOwnPropertyNames(obj).concat(getOwnPropertySymbols(obj)));
  } : getOwnPropertyNames;
}

var getOwnKeys = getOwnKeysFn();

function getOwnPropertyDescriptorsFn() {
  // $FlowFixMe: In some environment, Object.getOwnPropertyDescriptors has been implemented;
  return toxicPredicateFunctions.isFunction(_Object$getOwnPropertyDescriptors) ? _Object$getOwnPropertyDescriptors : function (obj) {
    return getOwnKeys(obj).reduce(function (descs, key) {
      descs[key] = getOwnPropertyDescriptor(obj, key);
      return descs;
    }, {});
  };
}

var getOwnPropertyDescriptors = getOwnPropertyDescriptorsFn();

function compressMultipleDecorators() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (!fns.length) throw new TypeError('You must pass in decorators in compressMultipleDecorators');
  fns.forEach(function (fn) {
    if (!toxicPredicateFunctions.isFunction(fn)) throw new TypeError('Decorators must be a function, but not "' + fn + '" in ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
  });
  if (fns.length === 1) return fns[0];
  return function (obj, prop, descirptor) {
    // $FlowFixMe: the reduce will return a descriptor
    return fns.reduce(function (descirptor, fn) {
      return fn(obj, prop, descirptor);
    }, descirptor);
  };
}

function accessor() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      get = _ref.get,
      set = _ref.set;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$preGet = _ref2.preGet,
      preGet = _ref2$preGet === undefined ? false : _ref2$preGet,
      _ref2$preSet = _ref2.preSet,
      preSet = _ref2$preSet === undefined ? true : _ref2$preSet;

  if (!toxicPredicateFunctions.isFunction(get) && !toxicPredicateFunctions.isFunction(set) && !(toxicPredicateFunctions.isArray(get) && get.length > 0) && !(toxicPredicateFunctions.isArray(set) && set.length > 0)) throw new TypeError("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
  var errmsg = '@accessor only accept function or array of function as getter/setter';
  get = toxicPredicateFunctions.isArray(get) ? compressOneArgFnArray(get, errmsg) : get;
  set = toxicPredicateFunctions.isArray(set) ? compressOneArgFnArray(set, errmsg) : set;
  return function (obj, prop, descriptor) {
    var _ref3 = descriptor || {},
        _ref3$configurable = _ref3.configurable,
        configurable = _ref3$configurable === undefined ? true : _ref3$configurable,
        _ref3$enumerable = _ref3.enumerable,
        enumerable = _ref3$enumerable === undefined ? true : _ref3$enumerable;

    var hasGet = toxicPredicateFunctions.isFunction(get);
    var hasSet = toxicPredicateFunctions.isFunction(set);
    var handleGet = function handleGet(value) {
      // $FlowFixMe: it's really function here
      return hasGet ? toxicUtils.bind(get, this)(value) : value;
    };
    var handleSet = function handleSet(value) {
      // $FlowFixMe: it's really function here
      return hasSet ? toxicUtils.bind(set, this)(value) : value;
    };
    if (isAccessorDescriptor(descriptor)) {
      var originGet = descriptor.get,
          originSet = descriptor.set;

      var hasOriginGet = toxicPredicateFunctions.isFunction(originGet);
      var hasOriginSet = toxicPredicateFunctions.isFunction(originSet);
      if (process.env.NODE_ENV !== 'production' && !hasOriginGet && hasGet) {
        warn('You are trying to set getter via @accessor on ' + prop + ' without getter. That\'s not a good idea.');
      }
      if (process.env.NODE_ENV !== 'production' && !hasOriginSet && hasSet) {
        warn('You are trying to set setter via @accessor on  ' + prop + ' without setter. That\'s not a good idea.');
      }
      var getter = hasOriginGet || hasGet ? function () {
        var _this = this;

        var boundGetter = toxicUtils.bind(handleGet, this);
        var originBoundGetter = function originBoundGetter() {
          return hasOriginGet
          // $FlowFixMe: we have do a check here
          ? toxicUtils.bind(originGet, _this)() : undefined;
        };
        var order = preGet ? [boundGetter, originBoundGetter] : [originBoundGetter, boundGetter];
        // $FlowFixMe: it's all function here
        return order.reduce(function (value, fn) {
          return fn(value);
        }, undefined);
      } : undefined;
      var setter = hasOriginSet || hasSet ? function (val) {
        var _this2 = this;

        var boundSetter = toxicUtils.bind(handleSet, this);
        var originBoundSetter = function originBoundSetter(value) {
          return hasOriginSet
          // $FlowFixMe: flow act like a retarded child on optional property
          ? toxicUtils.bind(originSet, _this2)(value) : value;
        };
        var order = preSet ? [boundSetter, originBoundSetter] : [originBoundSetter, boundSetter];
        return order.reduce(function (value, fn) {
          return fn(value);
        }, val);
      } : undefined;
      return {
        get: getter,
        set: setter,
        configurable: configurable,
        enumerable: enumerable
      };
    } else if (isInitializerDescriptor(descriptor)) {
      // $FlowFixMe: disjoint union is horrible, descriptor is initializerDescriptor now
      var initializer = descriptor.initializer;

      var value = void 0;
      var inited = false;
      return {
        get: function get() {
          var boundFn = toxicUtils.bind(handleGet, this);
          if (inited) return boundFn(value);
          value = toxicUtils.bind(initializer, this)();
          inited = true;
          return boundFn(value);
        },
        set: function set(val) {
          var boundFn = toxicUtils.bind(handleSet, this);
          value = preSet ? boundFn(val) : val;
          inited = true;
          if (!preSet) {
            boundFn(value);
          }
          return value;
        },

        configurable: configurable,
        enumerable: enumerable
      };
    } else {
      // $FlowFixMe: disjoint union is horrible, descriptor is DataDescriptor now
      var _ref4 = descriptor || {},
          _value = _ref4.value;

      return {
        get: function get() {
          return toxicUtils.bind(handleGet, this)(_value);
        },
        set: function set(val) {
          var boundFn = toxicUtils.bind(handleSet, this);
          _value = preSet ? boundFn(val) : val;
          if (!preSet) {
            boundFn(_value);
          }
          return _value;
        },

        configurable: configurable,
        enumerable: enumerable
      };
    }
  };
}

function before() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) throw new Error("@before accept at least one parameter. If you don't need to preprocess before your function, do not add @before decorators");
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @before straightly, @before return decorators, you should call it before you set it as decorator.');
  }
  for (var i = fns.length - 1; i > -1; i--) {
    if (!toxicPredicateFunctions.isFunction(fns[i])) throw new TypeError('@before only accept function parameter');
  }
  return function (obj, prop, descriptor) {
    var _ref = descriptor || {},
        fn = _ref.value,
        configurable = _ref.configurable,
        enumerable = _ref.enumerable,
        writable = _ref.writable;

    if (!toxicPredicateFunctions.isFunction(fn)) throw new TypeError('@before can only be used on function, please check the property "' + prop + '" is a method or not.');
    var handler = function handler() {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var paras = fns.reduce(function (paras, fn) {
        var result = toxicUtils.bind(fn, _this).apply(undefined, _toConsumableArray(paras));
        return result === undefined ? paras : toxicPredicateFunctions.isArray(result) ? result
        // $FlowFixMe: what the hell, it can be anything
        : [result];
      }, args);
      return toxicUtils.bind(fn, this).apply(undefined, _toConsumableArray(paras));
    };
    return {
      value: handler,
      configurable: configurable,
      enumerable: enumerable,
      writable: writable
    };
  };
}

function after() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) throw new Error("@after accept at least one parameter. If you don't need to preprocess after your function, do not add @after decorators");
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may have used @after straightly. @after return decorators. You should call it before you use it as decorators');
  }
  var fn = compressOneArgFnArray(fns, '@after only accept function parameter');
  return function (obj, prop, descriptor) {
    var _ref = descriptor || {},
        value = _ref.value,
        configurable = _ref.configurable,
        enumerable = _ref.enumerable,
        writable = _ref.writable;

    if (!toxicPredicateFunctions.isFunction(value)) throw new TypeError('@after can only be used on function, please checkout your property "' + prop + '" is a method or not.');
    var handler = function handler() {
      var ret = toxicUtils.bind(value, this).apply(undefined, arguments);
      return toxicUtils.bind(fn, this)(ret);
    };
    return {
      value: handler,
      configurable: configurable,
      enumerable: enumerable,
      writable: writable
    };
  };
}

function readonly(obj, prop, descriptor) {
  if (descriptor === undefined) {
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') warn('You are using @readonly on an undefined property "' + prop + '". This property will become a readonly undefined forever, which is meaningless.');
    return {
      value: undefined,
      writable: false,
      enumerable: true,
      configurable: true
    };
  }
  if (isAccessorDescriptor(descriptor)) {
    descriptor.set = undefined;
    return descriptor;
  }
  // $FlowFixMe: disjoint union makes me disappointed
  descriptor.writable = false;
  return descriptor;
}

function initialize() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) throw new Error("@initialize accept at least one parameter. If you don't need to initialize your value, do not add @initialize.");
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @initialize straightly, @initialize return decorators, you need to call it');
  }
  var fn = compressOneArgFnArray(fns, '@initialize only accept function parameter');
  return function (obj, prop, descriptor) {
    if (descriptor === undefined) {
      return {
        value: toxicUtils.bind(fn, obj)(),
        configurable: true,
        writable: true,
        enumerable: true
      };
    }
    if (isAccessorDescriptor(descriptor)) {
      var hasBeenReset = false;
      var originSet = descriptor.set;

      return accessor({
        get: function get(value) {
          if (hasBeenReset) return value;
          return toxicUtils.bind(fn, this)(value);
        },

        set: originSet ? function (value) {
          hasBeenReset = true;
          return value;
        } : undefined
      })(obj, prop, descriptor);
    }
    /**
     * when we set decorator on propery
     * we will get a descriptor with initializer
     * as they will be attach on the instance later
     * so, we need to substitute the initializer function
     */
    if (isInitializerDescriptor(descriptor)) {
      // $FlowFixMe: useless disjoint union
      var initializer = descriptor.initializer;

      var handler = function handler() {
        return toxicUtils.bind(fn, this)(toxicUtils.bind(initializer, this)());
      };
      return {
        initializer: handler,
        configurable: descriptor.configurable,
        // $FlowFixMe: useless disjoint union
        writable: descriptor.writable,
        enumerable: descriptor.enumerable
      };
    }
    // $FlowFixMe: useless disjoint union
    var value = toxicUtils.bind(fn, this)(descriptor.value);
    return {
      value: value,
      // $FlowFixMe: useless disjoint union
      writable: descriptor.writable,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
  };
}

var getOwnPropertyDescriptor$1 = _Object$getOwnPropertyDescriptor;
var defineProperty = _Object$defineProperty;

function setAlias(root, prop, _ref, obj, key, _ref2) {
  var configurable = _ref.configurable,
      enumerable = _ref.enumerable;
  var force = _ref2.force,
      omit = _ref2.omit;

  var originDesc = getOwnPropertyDescriptor$1(obj, key);
  if (originDesc !== undefined) {
    if (omit) return;
    // TODO: we should add an github link here
    if (!force) throw new Error('"' + prop + '" is an existing property, if you want to override it, please set "force" true in @alias option.');
    if (!originDesc.configurable) {
      throw new Error('property "' + prop + '" is unconfigurable.');
    }
  }
  defineProperty(obj, key, {
    get: function get() {
      return root[prop];
    },
    set: function set(value) {
      root[prop] = value;
      return prop;
    },

    configurable: configurable,
    enumerable: enumerable
  });
}
function alias(other, key, option) {
  // set argument into right position
  if (arguments.length === 2) {
    if (toxicPredicateFunctions.isString(other)) {
      // $FlowFixMe: i will check this later
      option = key;
      key = other;
      other = undefined;
    }
  } else if (arguments.length === 1) {
    // $FlowFixMe: i will check this later
    key = other;
    other = undefined;
  }
  // argument validate
  if (!toxicPredicateFunctions.isString(key)) throw new TypeError('@alias need a string as a key to find the porperty to set alias on');
  var illegalObjErrorMsg = 'If you want to use @alias to set alias on other instance, you must pass in a legal instance';
  if (other !== undefined && toxicPredicateFunctions.isPrimitive(other)) throw new TypeError(illegalObjErrorMsg);

  var _ref3 = toxicPredicateFunctions.isObject(option) ? option : { force: false, omit: false },
      force = _ref3.force,
      omit = _ref3.omit;

  return function (obj, prop, descriptor) {
    descriptor = descriptor || {
      value: undefined,
      configurable: true,
      writable: true,
      enumerable: true
    };
    function getTargetAndName(other, obj, key) {
      var target = toxicPredicateFunctions.isPrimitive(other) ? obj : other;
      var keys = key.split('.');

      var _keys$slice = keys.slice(-1),
          _keys$slice2 = _slicedToArray(_keys$slice, 1),
          name = _keys$slice2[0];

      target = toxicUtils.getDeepProperty(target, keys.slice(0, -1), { throwError: true });
      if (toxicPredicateFunctions.isPrimitive(target)) {
        throw new TypeError(illegalObjErrorMsg);
      }
      return {
        target: target,
        name: name
      };
    }
    if (isInitializerDescriptor(descriptor)) {
      return initialize(function (value) {
        var _getTargetAndName = getTargetAndName(other, this, key),
            target = _getTargetAndName.target,
            name = _getTargetAndName.name;

        setAlias(this, prop, descriptor, target, name, { force: force, omit: omit });
        return value;
      })(obj, prop, descriptor);
    }
    if (isAccessorDescriptor(descriptor)) {
      var inited = void 0;
      var handler = function handler(value) {
        if (inited) return value;

        var _getTargetAndName2 = getTargetAndName(other, this, key),
            target = _getTargetAndName2.target,
            name = _getTargetAndName2.name;

        setAlias(this, prop, descriptor, target, name, { force: force, omit: omit });
        inited = true;
        return value;
      };
      return accessor({ get: handler, set: handler })(obj, prop, descriptor);
    }

    var _getTargetAndName3 = getTargetAndName(other, obj, key),
        target = _getTargetAndName3.target,
        name = _getTargetAndName3.name;

    setAlias(obj, prop, descriptor, target, name, { force: force, omit: omit });
    return descriptor;
  };
}

var defineProperty$1 = _Object$defineProperty;

function classify(decorator) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      requirement = _ref.requirement,
      _ref$customArgs = _ref.customArgs,
      customArgs = _ref$customArgs === undefined ? false : _ref$customArgs;

  return function () {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$exclude = _ref2.exclude,
        exclude = _ref2$exclude === undefined ? [] : _ref2$exclude,
        _ref2$include = _ref2.include,
        include = _ref2$include === undefined ? [] : _ref2$include,
        _ref2$construct = _ref2.construct,
        construct = _ref2$construct === undefined ? false : _ref2$construct,
        _ref2$self = _ref2.self,
        self = _ref2$self === undefined ? false : _ref2$self;

    if (!toxicPredicateFunctions.isArray(exclude)) throw new TypeError('options.exclude must be an array');
    if (!toxicPredicateFunctions.isArray(include)) throw new TypeError('options.include must be an array');
    return function (Klass) {
      var isClass = toxicPredicateFunctions.isFunction(Klass);
      if (!self && !isClass) throw new TypeError('@' + decorator.name + 'Class can only be used on class');
      if (self && toxicPredicateFunctions.isPrimitive(Klass)) throw new TypeError('@' + decorator.name + 'Class must be used on non-primitive type value in \'self\' mode');
      var prototype = self ? Klass : Klass.prototype;
      if (toxicPredicateFunctions.isVoid(prototype)) throw new Error('The prototype of the ' + Klass.name + ' is empty, please check it');
      var descs = getOwnPropertyDescriptors(prototype);
      getOwnKeys(prototype).concat(include).forEach(function (key) {
        var desc = descs[key];
        if (key === 'constructor' && !construct || self && isClass && ['name', 'length', 'prototype'].indexOf(key) > -1 || exclude.indexOf(key) > -1 || toxicPredicateFunctions.isFunction(requirement) && requirement(prototype, key, desc, { self: self }) === false) return;
        defineProperty$1(prototype, key, (customArgs ? decorator.apply(undefined, _toConsumableArray(args)) : decorator)(prototype, key, desc));
      });
    };
  };
}

var autobindClass = classify(autobind, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && toxicPredicateFunctions.isFunction(desc.value);
  }
});

var mapStore = void 0;
// save bound function for super
function getBoundSuper(obj, fn) {
  if (typeof _WeakMap === 'undefined') {
    throw new Error('Using @autobind on ' + fn.name + '() requires WeakMap support due to its use of super.' + fn.name + '()');
  }

  if (!mapStore) {
    mapStore = new _WeakMap();
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new _WeakMap());
  }

  var superStore = mapStore.get(obj);
  // $FlowFixMe: already insure superStore is not undefined
  if (superStore.has(fn) === false) {
    // $FlowFixMe: already insure superStore is not undefined
    superStore.set(fn, toxicUtils.bind(fn, obj));
  }
  // $FlowFixMe: already insure superStore is not undefined
  return superStore.get(fn);
}
/**
 * auto bind the function on the class, just support function
 * @param {Object} obj Target Object
 * @param {string} prop prop strong
 * @param {Object} descriptor
 */
function autobind(obj, prop, descriptor) {
  if (arguments.length === 1) return autobindClass()(obj);

  var _ref = descriptor || {},
      fn = _ref.value,
      configurable = _ref.configurable;

  if (!toxicPredicateFunctions.isFunction(fn)) {
    throw new TypeError('@autobind can only be used on functions, not "' + fn + '" in ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) + ' on property "' + prop + '"');
  }
  var constructor = obj.constructor;

  return {
    configurable: configurable,
    enumerable: false,
    get: function get() {
      var _this = this;

      var boundFn = function boundFn() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return fn.call.apply(fn, [_this].concat(_toConsumableArray(args)));
      };
      // Someone accesses the property directly on the prototype on which it is
      // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
      if (this === obj) {
        return fn;
      }
      // Someone accesses the property directly on a prototype,
      // but it was found up the chain, not defined directly on it
      // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
      if (this.constructor !== constructor && _Object$getPrototypeOf(this).constructor === constructor) {
        return fn;
      }

      // Autobound method calling super.sameMethod() which is also autobound and so on.
      if (this.constructor !== constructor && prop in this.constructor.prototype) {
        return getBoundSuper(this, fn);
      }
      _Object$defineProperty(this, prop, {
        configurable: true,
        writable: true,
        // NOT enumerable when it's a bound method
        enumerable: false,
        value: boundFn
      });

      return boundFn;
    },

    set: createDefaultSetter(prop)
  };
}

var defineProperty$2 = _Object$defineProperty;
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */

function frozen(obj, prop, descriptor) {
  if (descriptor === undefined) {
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') warn('You are using @frozen on an undefined property. This property will become a frozen undefined forever, which is meaningless');
    return {
      value: undefined,
      writable: false,
      enumerable: false,
      configurable: false
    };
  }
  descriptor.enumerable = false;
  descriptor.configurable = false;
  if (isAccessorDescriptor(descriptor)) {
    var _get = descriptor.get;

    descriptor.set = undefined;
    if (!toxicPredicateFunctions.isFunction(_get)) {
      /* istanbul ignore else  */
      if (process.env.NODE_ENV !== 'production') warn('You are using @frozen on one accessor descriptor without getter. This property will become a frozen undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      get: function get() {
        var value = toxicUtils.bind(_get, this)();
        defineProperty$2(this, prop, {
          value: value,
          writable: false,
          configurable: false,
          enumerable: false
        });
        return value;
      },

      set: undefined,
      configurable: false,
      enumerable: false
    };
  }
  // $FlowFixMe: comeon, can disjoint union be reliable?
  descriptor.writable = false;
  return descriptor;
}

var getOwnPropertyDescriptor$2 = _Object$getOwnPropertyDescriptor;
var defineProperty$3 = _Object$defineProperty;

function waituntil(key) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      other = _ref.other;

  if (!toxicPredicateFunctions.isFunction(key) && !toxicPredicateFunctions.isPromise(key) && !toxicPredicateFunctions.isString(key)) throw new TypeError('@waitUntil only accept Function, Promise or String');
  return function (obj, prop, descriptor) {
    var _ref2 = descriptor || {},
        _value = _ref2.value,
        configurable = _ref2.configurable;

    if (!toxicPredicateFunctions.isFunction(_value)) throw new TypeError('@waituntil can only be used on function, but not ' + _value + ' on property "' + prop + '"');
    var binded = false;
    var waitingQueue = [];
    var canIRun = toxicPredicateFunctions.isPromise(key) ? function () {
      return key;
    } : toxicPredicateFunctions.isFunction(key) ? key : function () {
      // $FlowFixMe: We have use isPromise to exclude
      var keys = key.split('.');
      var prop = keys.slice(-1);
      var originTarget = toxicPredicateFunctions.isPrimitive(other) ? this : other;
      if (!binded) {
        var target = toxicUtils.getDeepProperty(originTarget, keys.slice(0, -1));
        if (toxicPredicateFunctions.isVoid(target)) return target;
        var _descriptor = getOwnPropertyDescriptor$2(target, prop);
        /**
         * create a setter hook here
         * when it get ture, it will run all function in waiting queue immediately
         */
        var set = function set(value) {
          if (value === true) {
            while (waitingQueue.length > 0) {
              waitingQueue[0]();
              waitingQueue.shift();
            }
          }
          return value;
        };
        var desc = isDescriptor(_descriptor) ? accessor({ set: set })(target, prop, _descriptor) : accessor({ set: set })(target, prop, {
          value: undefined,
          configurable: true,
          enumerable: true,
          writable: true
        });
        defineProperty$3(target, prop, desc);
        binded = true;
      }
      return toxicUtils.getDeepProperty(originTarget, keys);
    };
    return {
      value: function value() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var boundFn = toxicUtils.bind(_value, this);
        var runnable = toxicUtils.bind(canIRun, this).apply(undefined, args);
        if (toxicPredicateFunctions.isPromise(runnable)) {
          return _Promise.resolve(runnable).then(function () {
            return toxicUtils.bind(_value, _this).apply(undefined, args);
          });
        } else if (runnable === true) {
          return toxicUtils.bind(_value, this).apply(undefined, args);
        } else {
          return new _Promise(function (resolve) {
            var cb = function cb() {
              boundFn.apply(undefined, args);
              resolve();
            };
            waitingQueue.push(cb);
          });
        }
      },

      // function should not be enmuerable
      enumerable: false,
      configurable: configurable,
      // as we have delay this function
      // it's not a good idea to change it
      writable: false
    };
  };
}

var defineProperty$4 = _Object$defineProperty;

function lazyInit(obj, prop, descriptor) {
  if (descriptor === undefined) throw new TypeError('@lazyInit cannot be apply on undefined property.');
  if (!toxicPredicateFunctions.isFunction(descriptor.initializer)) {
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') warn('@lazyInit can only be used on property, but not propery "' + prop + '" which may be methods or getter/setter.');
    // $FlowFixMe: disjoint union ****
    return descriptor;
  }
  var initializer = descriptor.initializer,
      configurable = descriptor.configurable,
      enumerable = descriptor.enumerable,
      writable = descriptor.writable;

  return {
    get: function get() {
      var value = toxicUtils.bind(initializer, this)();
      defineProperty$4(this, prop, {
        value: value,
        configurable: configurable,
        enumerable: enumerable,
        writable: writable
      });
      return value;
    },

    set: createDefaultSetter(prop),
    configurable: configurable,
    enumerable: enumerable
  };
}

var defineProperty$5 = _Object$defineProperty;
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */

function lock(obj, prop, descriptor) {
  if (descriptor === undefined) {
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') warn('You are using @lock on an undefined property "' + prop + '". This property will become a lock undefined forever, which is meaningless.');
    return {
      value: undefined,
      writable: false,
      enumerable: true,
      configurable: false
    };
  }
  descriptor.configurable = false;
  if (isAccessorDescriptor(descriptor)) {
    var _get = descriptor.get;

    descriptor.set = undefined;
    if (!toxicPredicateFunctions.isFunction(_get)) {
      warn('You are using @lock on one accessor descriptor without getter. This property will become a lock undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      get: function get() {
        var value = toxicUtils.bind(_get, this)();
        defineProperty$5(this, prop, {
          value: value,
          writable: false,
          configurable: false,
          enumerable: descriptor.enumerable
        });
        return value;
      },

      set: undefined,
      configurable: false,
      enumerable: descriptor.enumerable
    };
  }
  // $FlowFixMe: comeon, can disjoint union be reliable?
  descriptor.writable = false;
  return descriptor;
}

function nonenumerable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: false,
      configurable: true,
      writable: true
    };
  }
  descriptor.enumerable = false;
  return descriptor;
}

var defineProperty$6 = _Object$defineProperty;
var getOwnPropertyDescriptor$3 = _Object$getOwnPropertyDescriptor;


function applyDecorators(Class, props) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$self = _ref.self,
      self = _ref$self === undefined ? false : _ref$self,
      _ref$omit = _ref.omit,
      omit = _ref$omit === undefined ? false : _ref$omit;

  var isPropsFunction = toxicPredicateFunctions.isFunction(props);
  if (isPropsFunction || toxicPredicateFunctions.isArray(props)) {
    // apply decorators on class
    if (!toxicPredicateFunctions.isFunction(Class)) throw new TypeError('If you want to decorator class, you must pass it a legal class');
    // $FlowFixMe: Terrible union, it's function now
    if (isPropsFunction) props(Class);else {
      // $FlowFixMe: Terrible union, it's array now
      for (var i = 0, len = props.length; i < len; i++) {
        // $FlowFixMe: Terrible union, it's array now
        var fn = props[i];
        if (!toxicPredicateFunctions.isFunction(fn)) throw new TypeError('If you want to decorate an class, you must pass it function or array of function');
        fn(Class);
      }
    }
    return Class;
  }
  if (!self && !toxicPredicateFunctions.isFunction(Class)) throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
  if (self && toxicPredicateFunctions.isPrimitive(Class)) throw new TypeError("We can't apply docorators on a primitive value, even in self mode");
  if (!toxicPredicateFunctions.isObject(props)) throw new TypeError('applyDecorators only accept object as second arguments');
  var prototype = self ? Class : Class.prototype;
  if (toxicPredicateFunctions.isVoid(prototype)) throw new Error('The class muse have a prototype, please take a check');
  for (var key in props) {
    var value = props[key];
    var decorators = toxicPredicateFunctions.isArray(value) ? value : [value];
    var handler = void 0;
    try {
      handler = compressMultipleDecorators.apply(undefined, _toConsumableArray(decorators));
    } catch (err) {
      /* istanbul ignore else  */
      if (process.env.NODE_ENV !== 'production') warn(err && err.message);
      throw new Error('The decorators set on props must be Function or Array of Function');
    }
    var descriptor = getOwnPropertyDescriptor$3(prototype, key);
    if (descriptor && !descriptor.configurable) {
      if (!omit) throw new Error(key + ' of ' + prototype + ' is unconfigurable');
      continue;
    }
    defineProperty$6(prototype, key, handler(prototype, key, descriptor));
  }
  return Class;
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
      if (toxicPredicateFunctions.isArray(target) && arrayChangeMethod.indexOf(property) > -1) {
        return function () {
          arrayChanging = true;
          toxicUtils.bind(value, receiver).apply(undefined, arguments);
          arrayChanging = false;
          hook();
        };
      }
      if (mapStore[property] === true) return value;
      if (toxicPredicateFunctions.isObject(value) || toxicPredicateFunctions.isArray(value)) {
        var _proxyValue = mapStore[property] || deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix });
        mapStore[property] = _proxyValue;
        return _proxyValue;
      }
      mapStore[property] = true;
      return value;
    },
    set: function set(target, property, value) {
      var oldVal = target[property];
      var newVal = toxicPredicateFunctions.isObject(value) || toxicPredicateFunctions.isArray(value) ? deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix }) : value;
      target[property] = newVal;
      mapStore[property] = true;
      if (arrayChanging || diff && oldVal === newVal) return true;
      hook();
      return true;
    },
    deleteProperty: function deleteProperty(target, property) {
      delete target[property];
      delete mapStore[property];
      if (arrayChanging) return true;
      hook();
      return true;
    }
  });
  var operateProps = (_operateProps = {}, _defineProperty(_operateProps, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      // $FlowFixMe: we have check the computed value
      proxyValue[property] = val;
    };
  }), nonenumerable]), _defineProperty(_operateProps, operationPrefix + 'del', [initialize(function (method) {
    return function (property) {
      // $FlowFixMe: we have check the computed value
      delete proxyValue[property];
    };
  }), nonenumerable]), _operateProps);
  applyDecorators(proxyValue, operateProps, { self: true });
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
    var oldVal = void 0;
    return keys.reduce(function (props, key) {
      props[key] = [accessor({
        set: function set(value) {
          oldVal = this[key];
          return value;
        }
      }), accessor({
        get: function get(val) {
          if (mapStore[key]) return val;
          if (toxicPredicateFunctions.isObject(val) || toxicPredicateFunctions.isArray(val)) {
            deepObserve(val, hook, { operationPrefix: operationPrefix, diff: diff });
          }
          mapStore[key] = true;
          return val;
        },
        set: function set(val) {
          if (toxicPredicateFunctions.isObject(val) || toxicPredicateFunctions.isArray(val)) deepObserve(val, hook, { operationPrefix: operationPrefix, diff: diff });
          mapStore[key] = true;
          if (!arrayChanging && (!diff || oldVal !== val)) hook();
          return val;
        }
      }, { preSet: false })];
      return props;
    }, {});
  }
  var props = getPropertyDecorators(getOwnKeys(value));
  applyDecorators(value, props, { self: true, omit: true });
  if (toxicPredicateFunctions.isArray(value)) {
    var methodProps = arrayChangeMethod.reduce(function (props, key) {
      props[key] = [initialize(function (method) {
        method = toxicPredicateFunctions.isFunction(method) ? method
        // $FlowFixMe: we have check the key
        : Array.prototype[key];
        return function () {
          var originLength = value.length;
          arrayChanging = true;
          toxicUtils.bind(method, value).apply(undefined, arguments);
          arrayChanging = false;
          if (originLength < value.length) {
            var keys = new Array(value.length - originLength).fill(1).map(function (value, index) {
              return (index + originLength).toString();
            });
            var _props = getPropertyDecorators(keys);
            applyDecorators(value, _props, { self: true, omit: true });
          }
          hook();
        };
      }), nonenumerable];
      return props;
    }, {});
    applyDecorators(value, methodProps, { self: true });
  }
  var operateProps = (_operateProps2 = {}, _defineProperty(_operateProps2, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          disable = _ref3.disable,
          isNewVal = _ref3.isNewVal;

      isNewVal = isNewVal || getOwnKeys(value).indexOf(property) === -1;
      if (toxicPredicateFunctions.isFunction(method)) {
        toxicUtils.bind(method, _this)(property, val, { disable: true, isNewVal: isNewVal });
      }
      if (isNewVal) {
        var _props2 = getPropertyDecorators([property]);
        applyDecorators(value, _props2, { self: true, omit: true });
      }
      if (!disable) {
        value[property] = val;
      }
    };
  }), nonenumerable]), _defineProperty(_operateProps2, operationPrefix + 'del', [initialize(function (method) {
    return function (property) {
      if (toxicPredicateFunctions.isFunction(method)) {
        toxicUtils.bind(method, _this)(property);
      } else {
        delete value[property];
      }
      hook();
    };
  }), nonenumerable]), _operateProps2);
  applyDecorators(value, operateProps, { self: true });
  return value;
}

function watch() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var option = toxicPredicateFunctions.isObject(args[args.length - 1]) ? args[args.length - 1] : {};
  // $FlowFixMe: we have check if it's an object
  var deep = option.deep,
      omit = option.omit,
      other = option.other,
      _option$operationPref = option.operationPrefix,
      operationPrefix = _option$operationPref === undefined ? '__' : _option$operationPref,
      _option$diff = option.diff,
      diff = _option$diff === undefined ? true : _option$diff;
  // $FlowFixMe: we have check if it's an object

  var proxy = option.proxy;

  if (typeof Proxy !== 'function') {
    proxy = false;
    /* istanbul ignore else  */
    if (process.env.NODE_ENV !== 'production') warn('You browser do not support Proxy, we will fall back into observe mode.');
  }
  if (!args.length) throw new TypeError('You must pass a function or a string to find the hanlder function.');
  if (other !== undefined && toxicPredicateFunctions.isPrimitive(other)) throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
  if (!toxicPredicateFunctions.isString(operationPrefix)) throw new TypeError('operationPrefix must be an string');
  return function (obj, prop, descriptor) {
    var fns = args.reduce(function (fns, keyOrFn, index) {
      if (!toxicPredicateFunctions.isString(keyOrFn) && !toxicPredicateFunctions.isFunction(keyOrFn)) {
        if (!index || index !== args.length - 1) throw new TypeError('You can only pass function or string as handler');
        return fns;
      }
      fns.push(toxicPredicateFunctions.isString(keyOrFn) ? function (newVal, oldVal) {
        var target = other || obj;
        // $FlowFixMe: we have ensure it must be a string
        var fn = toxicUtils.getDeepProperty(target, keyOrFn);
        if (!toxicPredicateFunctions.isFunction(fn)) {
          if (!omit) throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
          return;
        }
        return toxicUtils.bind(fn, this)(newVal, oldVal);
      } : keyOrFn);
      return fns;
    }, []);
    var handler = function handler(newVal, oldVal) {
      var _this2 = this;

      fns.forEach(function (fn) {
        return toxicUtils.bind(fn, _this2)(newVal, oldVal);
      });
    };
    var inited = false;
    var oldVal = void 0;
    var newVal = void 0;
    var proxyValue = void 0;
    return compressMultipleDecorators(accessor({
      set: function set(value) {
        var _this3 = this;

        oldVal = this[prop];
        proxyValue = undefined;
        var hook = function hook() {
          return toxicUtils.bind(handler, _this3)(newVal, oldVal);
        };
        return deep && (toxicPredicateFunctions.isObject(value) || toxicPredicateFunctions.isArray(value)) ? proxy ? deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix }) : deepObserve(value, hook, { operationPrefix: operationPrefix, diff: diff }) : value;
      },
      get: function get(value) {
        var _this4 = this;

        if (proxyValue) return proxyValue;
        if (!inited) {
          inited = true;
          var hook = function hook() {
            return toxicUtils.bind(handler, _this4)(newVal, oldVal);
          };
          if (deep && (toxicPredicateFunctions.isObject(value) || toxicPredicateFunctions.isArray(value))) {
            if (proxy) {
              proxyValue = deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix });
              oldVal = proxyValue;
              newVal = proxyValue;
              return proxyValue;
            }
            deepObserve(value, hook, { operationPrefix: operationPrefix, diff: diff });
          }
          oldVal = value;
          newVal = value;
        }
        return value;
      }
    }, { preSet: true }), accessor({
      set: function set(value) {
        newVal = value;
        if (!diff || oldVal !== value) toxicUtils.bind(handler, this)(newVal, oldVal);
        oldVal = value;
        return value;
      }
    }, { preSet: false }))(obj, prop, descriptor);
  };
}

var preventExtensions = _Object$preventExtensions;

function nonextendable(obj, prop, descriptor) {
  if (descriptor === undefined) throw new Error('@nonextendable could not handle undefined property "' + prop + '".');
  return initialize(function (value) {
    preventExtensions(value);
    return value;
  })(obj, prop, descriptor);
}

function runnable(key) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      other = _ref.other,
      backup = _ref.backup;

  if (!toxicPredicateFunctions.isFunction(key) && !toxicPredicateFunctions.isString(key)) throw new TypeError('@runnable only accept Function or String');
  return function (obj, prop, descriptor) {
    var _ref2 = descriptor || {},
        _value = _ref2.value,
        configurable = _ref2.configurable;

    if (!toxicPredicateFunctions.isFunction(_value)) throw new TypeError('@runnable can only be used on method, but not ' + _value + ' on property "' + prop + '".');
    var canIRun = toxicPredicateFunctions.isFunction(key) ? key : function () {
      var keys = key.split('.');
      var originTarget = toxicPredicateFunctions.isPrimitive(other) ? this : other;
      return toxicUtils.getDeepProperty(originTarget, keys);
    };
    backup = toxicPredicateFunctions.isFunction(backup) ? backup : function () {};
    return {
      value: function value() {
        if (toxicUtils.bind(canIRun, this).apply(undefined, arguments) === true) {
          return toxicUtils.bind(_value, this).apply(undefined, arguments);
        } else {
          // $FlowFixMe: I have reassign it when it's not a function
          return toxicUtils.bind(backup, this).apply(undefined, arguments);
        }
      },

      // function should not be enmuerable
      enumerable: false,
      configurable: configurable,
      // as we have delay this function
      // it's not a good idea to change it
      writable: false
    };
  };
}

function enumerable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: true,
      configurable: true,
      writable: true
    };
  }
  descriptor.enumerable = true;
  return descriptor;
}

function nonconfigurable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: true,
      configurable: true,
      writable: true
    };
  }
  descriptor.configurable = true;
  return descriptor;
}

function nonconfigurable$1(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: true,
      configurable: false,
      writable: true
    };
  }
  descriptor.configurable = false;
  return descriptor;
}

function string() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = toxicPredicateFunctions.isString(args[0]) ? args.shift() : '';
  args.unshift(function (value) {
    return toxicPredicateFunctions.isString(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function boolean() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = toxicPredicateFunctions.isBoolean(args[0]) ? args.shift() : false;
  args.unshift(function (value) {
    return toxicPredicateFunctions.isBoolean(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function array() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = toxicPredicateFunctions.isArray(args[0]) ? args.shift() : [];
  args.unshift(function (value) {
    return toxicPredicateFunctions.isArray(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function number() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = toxicPredicateFunctions.isNumber(args[0]) ? args.shift() : 0;
  args.unshift(function (value) {
    return toxicPredicateFunctions.isNumber(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function string$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = toxicPredicateFunctions.isString(args[0]) ? args.shift() : '';
  args.unshift(function (value) {
    return toxicPredicateFunctions.isString(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function boolean$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = toxicPredicateFunctions.isBoolean(args[0]) ? args.shift() : false;
  args.unshift(function (value) {
    return toxicPredicateFunctions.isBoolean(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function array$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = toxicPredicateFunctions.isArray(args[0]) ? args.shift() : [];
  args.unshift(function (value) {
    return toxicPredicateFunctions.isArray(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function number$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = toxicPredicateFunctions.isNumber(args[0]) ? args.shift() : 0;
  args.unshift(function (value) {
    return toxicPredicateFunctions.isNumber(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

var before$1 = classify(before, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && toxicPredicateFunctions.isFunction(desc.value);
  },

  customArgs: true
});

var after$1 = classify(after, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && toxicPredicateFunctions.isFunction(desc.value);
  },

  customArgs: true
});

var runnable$1 = classify(runnable, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && toxicPredicateFunctions.isFunction(desc.value);
  },

  customArgs: true
});

var waituntil$1 = classify(waituntil, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && toxicPredicateFunctions.isFunction(desc.value);
  },

  customArgs: true
});

exports.accessor = accessor;
exports.before = before;
exports.after = after;
exports.readonly = readonly;
exports.alias = alias;
exports.autobind = autobind;
exports.frozen = frozen;
exports.initialize = initialize;
exports.waituntil = waituntil;
exports.lazyInit = lazyInit;
exports.lock = lock;
exports.watch = watch;
exports.nonextendable = nonextendable;
exports.runnable = runnable;
exports.enumerable = enumerable;
exports.nonenumerable = nonenumerable;
exports.configurable = nonconfigurable;
exports.nonconfigurable = nonconfigurable$1;
exports.initString = string;
exports.initBoolean = boolean;
exports.initArray = array;
exports.initNumber = number;
exports.alwaysString = string$1;
exports.alwaysBoolean = boolean$1;
exports.alwaysArray = array$1;
exports.alwaysNumber = number$1;
exports.autobindClass = autobindClass;
exports.beforeClass = before$1;
exports.afterClass = after$1;
exports.runnableClass = runnable$1;
exports.waituntilClass = waituntil$1;
exports.applyDecorators = applyDecorators;
exports.classify = classify;
exports.getOwnKeys = getOwnKeys;
exports.getOwnPropertyDescriptors = getOwnPropertyDescriptors;
exports.isDescriptor = isDescriptor;
exports.isAccessorDescriptor = isAccessorDescriptor;
exports.isInitializerDescriptor = isInitializerDescriptor;
exports.isDataDescriptor = isDataDescriptor;
