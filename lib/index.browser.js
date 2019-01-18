
/**
 * toxic-decorators v0.4.0-beta.5
 * (c) 2017-2019 toxic-johann
 * Released under GPL-3.0
 * Built ad Fri Jan 18 2019 22:00:03 GMT+0800 (China Standard Time)
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.toxicDecorators = {}));
}(this, function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = _freeGlobal || freeSelf || Function('return this')();

	var _root = root;

	/** Built-in value references. */
	var Symbol$1 = _root.Symbol;

	var _Symbol = Symbol$1;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$1.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString$1.call(value);
	}

	var _objectToString = objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag$1 && symToStringTag$1 in Object(value))
	    ? _getRawTag(value)
	    : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject_1(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = _baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1 = isFunction;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	var isArray_1 = isArray;

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	var identity_1 = identity;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	var _apply = apply;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return _apply(func, this, otherArgs);
	  };
	}

	var _overRest = overRest;

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	var constant_1 = constant;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = _root['__core-js_shared__'];

	var _coreJsData = coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked;

	/** Used for built-in method references. */
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto$1 = Function.prototype,
	    objectProto$2 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject_1(value) || _isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(_toSource(value));
	}

	var _baseIsNative = baseIsNative;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = _getValue(object, key);
	  return _baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative;

	var defineProperty = (function() {
	  try {
	    var func = _getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	var _defineProperty = defineProperty;

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
	  return _defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant_1(string),
	    'writable': true
	  });
	};

	var _baseSetToString = baseSetToString;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	var _shortOut = shortOut;

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = _shortOut(_baseSetToString);

	var _setToString = setToString;

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return _setToString(_overRest(func, start, identity_1), func + '');
	}

	var _baseRest = baseRest;

	/* Built-in method references that are verified to be native. */
	var WeakMap$1 = _getNative(_root, 'WeakMap');

	var _WeakMap = WeakMap$1;

	/** Used to store function metadata. */
	var metaMap = _WeakMap && new _WeakMap;

	var _metaMap = metaMap;

	/**
	 * The base implementation of `setData` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to associate metadata with.
	 * @param {*} data The metadata.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetData = !_metaMap ? identity_1 : function(func, data) {
	  _metaMap.set(func, data);
	  return func;
	};

	var _baseSetData = baseSetData;

	/** Built-in value references. */
	var objectCreate = Object.create;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject_1(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	var _baseCreate = baseCreate;

	/**
	 * Creates a function that produces an instance of `Ctor` regardless of
	 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
	 *
	 * @private
	 * @param {Function} Ctor The constructor to wrap.
	 * @returns {Function} Returns the new wrapped function.
	 */
	function createCtor(Ctor) {
	  return function() {
	    // Use a `switch` statement to work with class constructors. See
	    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
	    // for more details.
	    var args = arguments;
	    switch (args.length) {
	      case 0: return new Ctor;
	      case 1: return new Ctor(args[0]);
	      case 2: return new Ctor(args[0], args[1]);
	      case 3: return new Ctor(args[0], args[1], args[2]);
	      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
	      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
	      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
	      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
	    }
	    var thisBinding = _baseCreate(Ctor.prototype),
	        result = Ctor.apply(thisBinding, args);

	    // Mimic the constructor's `return` behavior.
	    // See https://es5.github.io/#x13.2.2 for more details.
	    return isObject_1(result) ? result : thisBinding;
	  };
	}

	var _createCtor = createCtor;

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG = 1;

	/**
	 * Creates a function that wraps `func` to invoke it with the optional `this`
	 * binding of `thisArg`.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @returns {Function} Returns the new wrapped function.
	 */
	function createBind(func, bitmask, thisArg) {
	  var isBind = bitmask & WRAP_BIND_FLAG,
	      Ctor = _createCtor(func);

	  function wrapper() {
	    var fn = (this && this !== _root && this instanceof wrapper) ? Ctor : func;
	    return fn.apply(isBind ? thisArg : this, arguments);
	  }
	  return wrapper;
	}

	var _createBind = createBind;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax$1 = Math.max;

	/**
	 * Creates an array that is the composition of partially applied arguments,
	 * placeholders, and provided arguments into a single array of arguments.
	 *
	 * @private
	 * @param {Array} args The provided arguments.
	 * @param {Array} partials The arguments to prepend to those provided.
	 * @param {Array} holders The `partials` placeholder indexes.
	 * @params {boolean} [isCurried] Specify composing for a curried function.
	 * @returns {Array} Returns the new array of composed arguments.
	 */
	function composeArgs(args, partials, holders, isCurried) {
	  var argsIndex = -1,
	      argsLength = args.length,
	      holdersLength = holders.length,
	      leftIndex = -1,
	      leftLength = partials.length,
	      rangeLength = nativeMax$1(argsLength - holdersLength, 0),
	      result = Array(leftLength + rangeLength),
	      isUncurried = !isCurried;

	  while (++leftIndex < leftLength) {
	    result[leftIndex] = partials[leftIndex];
	  }
	  while (++argsIndex < holdersLength) {
	    if (isUncurried || argsIndex < argsLength) {
	      result[holders[argsIndex]] = args[argsIndex];
	    }
	  }
	  while (rangeLength--) {
	    result[leftIndex++] = args[argsIndex++];
	  }
	  return result;
	}

	var _composeArgs = composeArgs;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax$2 = Math.max;

	/**
	 * This function is like `composeArgs` except that the arguments composition
	 * is tailored for `_.partialRight`.
	 *
	 * @private
	 * @param {Array} args The provided arguments.
	 * @param {Array} partials The arguments to append to those provided.
	 * @param {Array} holders The `partials` placeholder indexes.
	 * @params {boolean} [isCurried] Specify composing for a curried function.
	 * @returns {Array} Returns the new array of composed arguments.
	 */
	function composeArgsRight(args, partials, holders, isCurried) {
	  var argsIndex = -1,
	      argsLength = args.length,
	      holdersIndex = -1,
	      holdersLength = holders.length,
	      rightIndex = -1,
	      rightLength = partials.length,
	      rangeLength = nativeMax$2(argsLength - holdersLength, 0),
	      result = Array(rangeLength + rightLength),
	      isUncurried = !isCurried;

	  while (++argsIndex < rangeLength) {
	    result[argsIndex] = args[argsIndex];
	  }
	  var offset = argsIndex;
	  while (++rightIndex < rightLength) {
	    result[offset + rightIndex] = partials[rightIndex];
	  }
	  while (++holdersIndex < holdersLength) {
	    if (isUncurried || argsIndex < argsLength) {
	      result[offset + holders[holdersIndex]] = args[argsIndex++];
	    }
	  }
	  return result;
	}

	var _composeArgsRight = composeArgsRight;

	/**
	 * Gets the number of `placeholder` occurrences in `array`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} placeholder The placeholder to search for.
	 * @returns {number} Returns the placeholder count.
	 */
	function countHolders(array, placeholder) {
	  var length = array.length,
	      result = 0;

	  while (length--) {
	    if (array[length] === placeholder) {
	      ++result;
	    }
	  }
	  return result;
	}

	var _countHolders = countHolders;

	/**
	 * The function whose prototype chain sequence wrappers inherit from.
	 *
	 * @private
	 */
	function baseLodash() {
	  // No operation performed.
	}

	var _baseLodash = baseLodash;

	/** Used as references for the maximum length and index of an array. */
	var MAX_ARRAY_LENGTH = 4294967295;

	/**
	 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
	 *
	 * @private
	 * @constructor
	 * @param {*} value The value to wrap.
	 */
	function LazyWrapper(value) {
	  this.__wrapped__ = value;
	  this.__actions__ = [];
	  this.__dir__ = 1;
	  this.__filtered__ = false;
	  this.__iteratees__ = [];
	  this.__takeCount__ = MAX_ARRAY_LENGTH;
	  this.__views__ = [];
	}

	// Ensure `LazyWrapper` is an instance of `baseLodash`.
	LazyWrapper.prototype = _baseCreate(_baseLodash.prototype);
	LazyWrapper.prototype.constructor = LazyWrapper;

	var _LazyWrapper = LazyWrapper;

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
	  // No operation performed.
	}

	var noop_1 = noop;

	/**
	 * Gets metadata for `func`.
	 *
	 * @private
	 * @param {Function} func The function to query.
	 * @returns {*} Returns the metadata for `func`.
	 */
	var getData = !_metaMap ? noop_1 : function(func) {
	  return _metaMap.get(func);
	};

	var _getData = getData;

	/** Used to lookup unminified function names. */
	var realNames = {};

	var _realNames = realNames;

	/** Used for built-in method references. */
	var objectProto$3 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

	/**
	 * Gets the name of `func`.
	 *
	 * @private
	 * @param {Function} func The function to query.
	 * @returns {string} Returns the function name.
	 */
	function getFuncName(func) {
	  var result = (func.name + ''),
	      array = _realNames[result],
	      length = hasOwnProperty$2.call(_realNames, result) ? array.length : 0;

	  while (length--) {
	    var data = array[length],
	        otherFunc = data.func;
	    if (otherFunc == null || otherFunc == func) {
	      return data.name;
	    }
	  }
	  return result;
	}

	var _getFuncName = getFuncName;

	/**
	 * The base constructor for creating `lodash` wrapper objects.
	 *
	 * @private
	 * @param {*} value The value to wrap.
	 * @param {boolean} [chainAll] Enable explicit method chain sequences.
	 */
	function LodashWrapper(value, chainAll) {
	  this.__wrapped__ = value;
	  this.__actions__ = [];
	  this.__chain__ = !!chainAll;
	  this.__index__ = 0;
	  this.__values__ = undefined;
	}

	LodashWrapper.prototype = _baseCreate(_baseLodash.prototype);
	LodashWrapper.prototype.constructor = LodashWrapper;

	var _LodashWrapper = LodashWrapper;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	var _copyArray = copyArray;

	/**
	 * Creates a clone of `wrapper`.
	 *
	 * @private
	 * @param {Object} wrapper The wrapper to clone.
	 * @returns {Object} Returns the cloned wrapper.
	 */
	function wrapperClone(wrapper) {
	  if (wrapper instanceof _LazyWrapper) {
	    return wrapper.clone();
	  }
	  var result = new _LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
	  result.__actions__ = _copyArray(wrapper.__actions__);
	  result.__index__  = wrapper.__index__;
	  result.__values__ = wrapper.__values__;
	  return result;
	}

	var _wrapperClone = wrapperClone;

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

	/**
	 * Creates a `lodash` object which wraps `value` to enable implicit method
	 * chain sequences. Methods that operate on and return arrays, collections,
	 * and functions can be chained together. Methods that retrieve a single value
	 * or may return a primitive value will automatically end the chain sequence
	 * and return the unwrapped value. Otherwise, the value must be unwrapped
	 * with `_#value`.
	 *
	 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
	 * enabled using `_.chain`.
	 *
	 * The execution of chained methods is lazy, that is, it's deferred until
	 * `_#value` is implicitly or explicitly called.
	 *
	 * Lazy evaluation allows several methods to support shortcut fusion.
	 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
	 * the creation of intermediate arrays and can greatly reduce the number of
	 * iteratee executions. Sections of a chain sequence qualify for shortcut
	 * fusion if the section is applied to an array and iteratees accept only
	 * one argument. The heuristic for whether a section qualifies for shortcut
	 * fusion is subject to change.
	 *
	 * Chaining is supported in custom builds as long as the `_#value` method is
	 * directly or indirectly included in the build.
	 *
	 * In addition to lodash methods, wrappers have `Array` and `String` methods.
	 *
	 * The wrapper `Array` methods are:
	 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
	 *
	 * The wrapper `String` methods are:
	 * `replace` and `split`
	 *
	 * The wrapper methods that support shortcut fusion are:
	 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
	 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
	 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
	 *
	 * The chainable wrapper methods are:
	 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
	 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
	 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
	 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
	 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
	 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
	 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
	 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
	 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
	 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
	 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
	 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
	 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
	 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
	 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
	 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
	 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
	 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
	 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
	 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
	 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
	 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
	 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
	 * `zipObject`, `zipObjectDeep`, and `zipWith`
	 *
	 * The wrapper methods that are **not** chainable by default are:
	 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
	 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
	 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
	 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
	 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
	 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
	 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
	 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
	 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
	 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
	 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
	 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
	 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
	 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
	 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
	 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
	 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
	 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
	 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
	 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
	 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
	 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
	 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
	 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
	 * `upperFirst`, `value`, and `words`
	 *
	 * @name _
	 * @constructor
	 * @category Seq
	 * @param {*} value The value to wrap in a `lodash` instance.
	 * @returns {Object} Returns the new `lodash` wrapper instance.
	 * @example
	 *
	 * function square(n) {
	 *   return n * n;
	 * }
	 *
	 * var wrapped = _([1, 2, 3]);
	 *
	 * // Returns an unwrapped value.
	 * wrapped.reduce(_.add);
	 * // => 6
	 *
	 * // Returns a wrapped value.
	 * var squares = wrapped.map(square);
	 *
	 * _.isArray(squares);
	 * // => false
	 *
	 * _.isArray(squares.value());
	 * // => true
	 */
	function lodash(value) {
	  if (isObjectLike_1(value) && !isArray_1(value) && !(value instanceof _LazyWrapper)) {
	    if (value instanceof _LodashWrapper) {
	      return value;
	    }
	    if (hasOwnProperty$3.call(value, '__wrapped__')) {
	      return _wrapperClone(value);
	    }
	  }
	  return new _LodashWrapper(value);
	}

	// Ensure wrappers are instances of `baseLodash`.
	lodash.prototype = _baseLodash.prototype;
	lodash.prototype.constructor = lodash;

	var wrapperLodash = lodash;

	/**
	 * Checks if `func` has a lazy counterpart.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
	 *  else `false`.
	 */
	function isLaziable(func) {
	  var funcName = _getFuncName(func),
	      other = wrapperLodash[funcName];

	  if (typeof other != 'function' || !(funcName in _LazyWrapper.prototype)) {
	    return false;
	  }
	  if (func === other) {
	    return true;
	  }
	  var data = _getData(other);
	  return !!data && func === data[0];
	}

	var _isLaziable = isLaziable;

	/**
	 * Sets metadata for `func`.
	 *
	 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
	 * period of time, it will trip its breaker and transition to an identity
	 * function to avoid garbage collection pauses in V8. See
	 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
	 * for more details.
	 *
	 * @private
	 * @param {Function} func The function to associate metadata with.
	 * @param {*} data The metadata.
	 * @returns {Function} Returns `func`.
	 */
	var setData = _shortOut(_baseSetData);

	var _setData = setData;

	/** Used to match wrap detail comments. */
	var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
	    reSplitDetails = /,? & /;

	/**
	 * Extracts wrapper details from the `source` body comment.
	 *
	 * @private
	 * @param {string} source The source to inspect.
	 * @returns {Array} Returns the wrapper details.
	 */
	function getWrapDetails(source) {
	  var match = source.match(reWrapDetails);
	  return match ? match[1].split(reSplitDetails) : [];
	}

	var _getWrapDetails = getWrapDetails;

	/** Used to match wrap detail comments. */
	var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

	/**
	 * Inserts wrapper `details` in a comment at the top of the `source` body.
	 *
	 * @private
	 * @param {string} source The source to modify.
	 * @returns {Array} details The details to insert.
	 * @returns {string} Returns the modified source.
	 */
	function insertWrapDetails(source, details) {
	  var length = details.length;
	  if (!length) {
	    return source;
	  }
	  var lastIndex = length - 1;
	  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
	  details = details.join(length > 2 ? ', ' : ' ');
	  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
	}

	var _insertWrapDetails = insertWrapDetails;

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	var _arrayEach = arrayEach;

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	var _baseFindIndex = baseFindIndex;

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}

	var _baseIsNaN = baseIsNaN;

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	var _strictIndexOf = strictIndexOf;

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? _strictIndexOf(array, value, fromIndex)
	    : _baseFindIndex(array, _baseIsNaN, fromIndex);
	}

	var _baseIndexOf = baseIndexOf;

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array == null ? 0 : array.length;
	  return !!length && _baseIndexOf(array, value, 0) > -1;
	}

	var _arrayIncludes = arrayIncludes;

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG$1 = 1,
	    WRAP_BIND_KEY_FLAG = 2,
	    WRAP_CURRY_FLAG = 8,
	    WRAP_CURRY_RIGHT_FLAG = 16,
	    WRAP_PARTIAL_FLAG = 32,
	    WRAP_PARTIAL_RIGHT_FLAG = 64,
	    WRAP_ARY_FLAG = 128,
	    WRAP_REARG_FLAG = 256,
	    WRAP_FLIP_FLAG = 512;

	/** Used to associate wrap methods with their bit flags. */
	var wrapFlags = [
	  ['ary', WRAP_ARY_FLAG],
	  ['bind', WRAP_BIND_FLAG$1],
	  ['bindKey', WRAP_BIND_KEY_FLAG],
	  ['curry', WRAP_CURRY_FLAG],
	  ['curryRight', WRAP_CURRY_RIGHT_FLAG],
	  ['flip', WRAP_FLIP_FLAG],
	  ['partial', WRAP_PARTIAL_FLAG],
	  ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
	  ['rearg', WRAP_REARG_FLAG]
	];

	/**
	 * Updates wrapper `details` based on `bitmask` flags.
	 *
	 * @private
	 * @returns {Array} details The details to modify.
	 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	 * @returns {Array} Returns `details`.
	 */
	function updateWrapDetails(details, bitmask) {
	  _arrayEach(wrapFlags, function(pair) {
	    var value = '_.' + pair[0];
	    if ((bitmask & pair[1]) && !_arrayIncludes(details, value)) {
	      details.push(value);
	    }
	  });
	  return details.sort();
	}

	var _updateWrapDetails = updateWrapDetails;

	/**
	 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
	 * with wrapper details in a comment at the top of the source body.
	 *
	 * @private
	 * @param {Function} wrapper The function to modify.
	 * @param {Function} reference The reference function.
	 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	 * @returns {Function} Returns `wrapper`.
	 */
	function setWrapToString(wrapper, reference, bitmask) {
	  var source = (reference + '');
	  return _setToString(wrapper, _insertWrapDetails(source, _updateWrapDetails(_getWrapDetails(source), bitmask)));
	}

	var _setWrapToString = setWrapToString;

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG$2 = 1,
	    WRAP_BIND_KEY_FLAG$1 = 2,
	    WRAP_CURRY_BOUND_FLAG = 4,
	    WRAP_CURRY_FLAG$1 = 8,
	    WRAP_PARTIAL_FLAG$1 = 32,
	    WRAP_PARTIAL_RIGHT_FLAG$1 = 64;

	/**
	 * Creates a function that wraps `func` to continue currying.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	 * @param {Function} wrapFunc The function to create the `func` wrapper.
	 * @param {*} placeholder The placeholder value.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {Array} [partials] The arguments to prepend to those provided to
	 *  the new function.
	 * @param {Array} [holders] The `partials` placeholder indexes.
	 * @param {Array} [argPos] The argument positions of the new function.
	 * @param {number} [ary] The arity cap of `func`.
	 * @param {number} [arity] The arity of `func`.
	 * @returns {Function} Returns the new wrapped function.
	 */
	function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
	  var isCurry = bitmask & WRAP_CURRY_FLAG$1,
	      newHolders = isCurry ? holders : undefined,
	      newHoldersRight = isCurry ? undefined : holders,
	      newPartials = isCurry ? partials : undefined,
	      newPartialsRight = isCurry ? undefined : partials;

	  bitmask |= (isCurry ? WRAP_PARTIAL_FLAG$1 : WRAP_PARTIAL_RIGHT_FLAG$1);
	  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$1 : WRAP_PARTIAL_FLAG$1);

	  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
	    bitmask &= ~(WRAP_BIND_FLAG$2 | WRAP_BIND_KEY_FLAG$1);
	  }
	  var newData = [
	    func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
	    newHoldersRight, argPos, ary, arity
	  ];

	  var result = wrapFunc.apply(undefined, newData);
	  if (_isLaziable(func)) {
	    _setData(result, newData);
	  }
	  result.placeholder = placeholder;
	  return _setWrapToString(result, func, bitmask);
	}

	var _createRecurry = createRecurry;

	/**
	 * Gets the argument placeholder value for `func`.
	 *
	 * @private
	 * @param {Function} func The function to inspect.
	 * @returns {*} Returns the placeholder value.
	 */
	function getHolder(func) {
	  var object = func;
	  return object.placeholder;
	}

	var _getHolder = getHolder;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	var _isIndex = isIndex;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMin = Math.min;

	/**
	 * Reorder `array` according to the specified indexes where the element at
	 * the first index is assigned as the first element, the element at
	 * the second index is assigned as the second element, and so on.
	 *
	 * @private
	 * @param {Array} array The array to reorder.
	 * @param {Array} indexes The arranged array indexes.
	 * @returns {Array} Returns `array`.
	 */
	function reorder(array, indexes) {
	  var arrLength = array.length,
	      length = nativeMin(indexes.length, arrLength),
	      oldArray = _copyArray(array);

	  while (length--) {
	    var index = indexes[length];
	    array[length] = _isIndex(index, arrLength) ? oldArray[index] : undefined;
	  }
	  return array;
	}

	var _reorder = reorder;

	/** Used as the internal argument placeholder. */
	var PLACEHOLDER = '__lodash_placeholder__';

	/**
	 * Replaces all `placeholder` elements in `array` with an internal placeholder
	 * and returns an array of their indexes.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {*} placeholder The placeholder to replace.
	 * @returns {Array} Returns the new array of placeholder indexes.
	 */
	function replaceHolders(array, placeholder) {
	  var index = -1,
	      length = array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (value === placeholder || value === PLACEHOLDER) {
	      array[index] = PLACEHOLDER;
	      result[resIndex++] = index;
	    }
	  }
	  return result;
	}

	var _replaceHolders = replaceHolders;

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG$3 = 1,
	    WRAP_BIND_KEY_FLAG$2 = 2,
	    WRAP_CURRY_FLAG$2 = 8,
	    WRAP_CURRY_RIGHT_FLAG$1 = 16,
	    WRAP_ARY_FLAG$1 = 128,
	    WRAP_FLIP_FLAG$1 = 512;

	/**
	 * Creates a function that wraps `func` to invoke it with optional `this`
	 * binding of `thisArg`, partial application, and currying.
	 *
	 * @private
	 * @param {Function|string} func The function or method name to wrap.
	 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {Array} [partials] The arguments to prepend to those provided to
	 *  the new function.
	 * @param {Array} [holders] The `partials` placeholder indexes.
	 * @param {Array} [partialsRight] The arguments to append to those provided
	 *  to the new function.
	 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
	 * @param {Array} [argPos] The argument positions of the new function.
	 * @param {number} [ary] The arity cap of `func`.
	 * @param {number} [arity] The arity of `func`.
	 * @returns {Function} Returns the new wrapped function.
	 */
	function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
	  var isAry = bitmask & WRAP_ARY_FLAG$1,
	      isBind = bitmask & WRAP_BIND_FLAG$3,
	      isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2,
	      isCurried = bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1),
	      isFlip = bitmask & WRAP_FLIP_FLAG$1,
	      Ctor = isBindKey ? undefined : _createCtor(func);

	  function wrapper() {
	    var length = arguments.length,
	        args = Array(length),
	        index = length;

	    while (index--) {
	      args[index] = arguments[index];
	    }
	    if (isCurried) {
	      var placeholder = _getHolder(wrapper),
	          holdersCount = _countHolders(args, placeholder);
	    }
	    if (partials) {
	      args = _composeArgs(args, partials, holders, isCurried);
	    }
	    if (partialsRight) {
	      args = _composeArgsRight(args, partialsRight, holdersRight, isCurried);
	    }
	    length -= holdersCount;
	    if (isCurried && length < arity) {
	      var newHolders = _replaceHolders(args, placeholder);
	      return _createRecurry(
	        func, bitmask, createHybrid, wrapper.placeholder, thisArg,
	        args, newHolders, argPos, ary, arity - length
	      );
	    }
	    var thisBinding = isBind ? thisArg : this,
	        fn = isBindKey ? thisBinding[func] : func;

	    length = args.length;
	    if (argPos) {
	      args = _reorder(args, argPos);
	    } else if (isFlip && length > 1) {
	      args.reverse();
	    }
	    if (isAry && ary < length) {
	      args.length = ary;
	    }
	    if (this && this !== _root && this instanceof wrapper) {
	      fn = Ctor || _createCtor(fn);
	    }
	    return fn.apply(thisBinding, args);
	  }
	  return wrapper;
	}

	var _createHybrid = createHybrid;

	/**
	 * Creates a function that wraps `func` to enable currying.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	 * @param {number} arity The arity of `func`.
	 * @returns {Function} Returns the new wrapped function.
	 */
	function createCurry(func, bitmask, arity) {
	  var Ctor = _createCtor(func);

	  function wrapper() {
	    var length = arguments.length,
	        args = Array(length),
	        index = length,
	        placeholder = _getHolder(wrapper);

	    while (index--) {
	      args[index] = arguments[index];
	    }
	    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
	      ? []
	      : _replaceHolders(args, placeholder);

	    length -= holders.length;
	    if (length < arity) {
	      return _createRecurry(
	        func, bitmask, _createHybrid, wrapper.placeholder, undefined,
	        args, holders, undefined, undefined, arity - length);
	    }
	    var fn = (this && this !== _root && this instanceof wrapper) ? Ctor : func;
	    return _apply(fn, this, args);
	  }
	  return wrapper;
	}

	var _createCurry = createCurry;

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG$4 = 1;

	/**
	 * Creates a function that wraps `func` to invoke it with the `this` binding
	 * of `thisArg` and `partials` prepended to the arguments it receives.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} partials The arguments to prepend to those provided to
	 *  the new function.
	 * @returns {Function} Returns the new wrapped function.
	 */
	function createPartial(func, bitmask, thisArg, partials) {
	  var isBind = bitmask & WRAP_BIND_FLAG$4,
	      Ctor = _createCtor(func);

	  function wrapper() {
	    var argsIndex = -1,
	        argsLength = arguments.length,
	        leftIndex = -1,
	        leftLength = partials.length,
	        args = Array(leftLength + argsLength),
	        fn = (this && this !== _root && this instanceof wrapper) ? Ctor : func;

	    while (++leftIndex < leftLength) {
	      args[leftIndex] = partials[leftIndex];
	    }
	    while (argsLength--) {
	      args[leftIndex++] = arguments[++argsIndex];
	    }
	    return _apply(fn, isBind ? thisArg : this, args);
	  }
	  return wrapper;
	}

	var _createPartial = createPartial;

	/** Used as the internal argument placeholder. */
	var PLACEHOLDER$1 = '__lodash_placeholder__';

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG$5 = 1,
	    WRAP_BIND_KEY_FLAG$3 = 2,
	    WRAP_CURRY_BOUND_FLAG$1 = 4,
	    WRAP_CURRY_FLAG$3 = 8,
	    WRAP_ARY_FLAG$2 = 128,
	    WRAP_REARG_FLAG$1 = 256;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMin$1 = Math.min;

	/**
	 * Merges the function metadata of `source` into `data`.
	 *
	 * Merging metadata reduces the number of wrappers used to invoke a function.
	 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
	 * may be applied regardless of execution order. Methods like `_.ary` and
	 * `_.rearg` modify function arguments, making the order in which they are
	 * executed important, preventing the merging of metadata. However, we make
	 * an exception for a safe combined case where curried functions have `_.ary`
	 * and or `_.rearg` applied.
	 *
	 * @private
	 * @param {Array} data The destination metadata.
	 * @param {Array} source The source metadata.
	 * @returns {Array} Returns `data`.
	 */
	function mergeData(data, source) {
	  var bitmask = data[1],
	      srcBitmask = source[1],
	      newBitmask = bitmask | srcBitmask,
	      isCommon = newBitmask < (WRAP_BIND_FLAG$5 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);

	  var isCombo =
	    ((srcBitmask == WRAP_ARY_FLAG$2) && (bitmask == WRAP_CURRY_FLAG$3)) ||
	    ((srcBitmask == WRAP_ARY_FLAG$2) && (bitmask == WRAP_REARG_FLAG$1) && (data[7].length <= source[8])) ||
	    ((srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$1)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG$3));

	  // Exit early if metadata can't be merged.
	  if (!(isCommon || isCombo)) {
	    return data;
	  }
	  // Use source `thisArg` if available.
	  if (srcBitmask & WRAP_BIND_FLAG$5) {
	    data[2] = source[2];
	    // Set when currying a bound function.
	    newBitmask |= bitmask & WRAP_BIND_FLAG$5 ? 0 : WRAP_CURRY_BOUND_FLAG$1;
	  }
	  // Compose partial arguments.
	  var value = source[3];
	  if (value) {
	    var partials = data[3];
	    data[3] = partials ? _composeArgs(partials, value, source[4]) : value;
	    data[4] = partials ? _replaceHolders(data[3], PLACEHOLDER$1) : source[4];
	  }
	  // Compose partial right arguments.
	  value = source[5];
	  if (value) {
	    partials = data[5];
	    data[5] = partials ? _composeArgsRight(partials, value, source[6]) : value;
	    data[6] = partials ? _replaceHolders(data[5], PLACEHOLDER$1) : source[6];
	  }
	  // Use source `argPos` if available.
	  value = source[7];
	  if (value) {
	    data[7] = value;
	  }
	  // Use source `ary` if it's smaller.
	  if (srcBitmask & WRAP_ARY_FLAG$2) {
	    data[8] = data[8] == null ? source[8] : nativeMin$1(data[8], source[8]);
	  }
	  // Use source `arity` if one is not provided.
	  if (data[9] == null) {
	    data[9] = source[9];
	  }
	  // Use source `func` and merge bitmasks.
	  data[0] = source[0];
	  data[1] = newBitmask;

	  return data;
	}

	var _mergeData = mergeData;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
	}

	var isSymbol_1 = isSymbol;

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol_1(value)) {
	    return NAN;
	  }
	  if (isObject_1(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject_1(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	var toNumber_1 = toNumber;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308;

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber_1(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	var toFinite_1 = toFinite;

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite_1(value),
	      remainder = result % 1;

	  return result === result ? (remainder ? result - remainder : result) : 0;
	}

	var toInteger_1 = toInteger;

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG$6 = 1,
	    WRAP_BIND_KEY_FLAG$4 = 2,
	    WRAP_CURRY_FLAG$4 = 8,
	    WRAP_CURRY_RIGHT_FLAG$2 = 16,
	    WRAP_PARTIAL_FLAG$2 = 32,
	    WRAP_PARTIAL_RIGHT_FLAG$2 = 64;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax$3 = Math.max;

	/**
	 * Creates a function that either curries or invokes `func` with optional
	 * `this` binding and partially applied arguments.
	 *
	 * @private
	 * @param {Function|string} func The function or method name to wrap.
	 * @param {number} bitmask The bitmask flags.
	 *    1 - `_.bind`
	 *    2 - `_.bindKey`
	 *    4 - `_.curry` or `_.curryRight` of a bound function
	 *    8 - `_.curry`
	 *   16 - `_.curryRight`
	 *   32 - `_.partial`
	 *   64 - `_.partialRight`
	 *  128 - `_.rearg`
	 *  256 - `_.ary`
	 *  512 - `_.flip`
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {Array} [partials] The arguments to be partially applied.
	 * @param {Array} [holders] The `partials` placeholder indexes.
	 * @param {Array} [argPos] The argument positions of the new function.
	 * @param {number} [ary] The arity cap of `func`.
	 * @param {number} [arity] The arity of `func`.
	 * @returns {Function} Returns the new wrapped function.
	 */
	function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
	  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4;
	  if (!isBindKey && typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var length = partials ? partials.length : 0;
	  if (!length) {
	    bitmask &= ~(WRAP_PARTIAL_FLAG$2 | WRAP_PARTIAL_RIGHT_FLAG$2);
	    partials = holders = undefined;
	  }
	  ary = ary === undefined ? ary : nativeMax$3(toInteger_1(ary), 0);
	  arity = arity === undefined ? arity : toInteger_1(arity);
	  length -= holders ? holders.length : 0;

	  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$2) {
	    var partialsRight = partials,
	        holdersRight = holders;

	    partials = holders = undefined;
	  }
	  var data = isBindKey ? undefined : _getData(func);

	  var newData = [
	    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
	    argPos, ary, arity
	  ];

	  if (data) {
	    _mergeData(newData, data);
	  }
	  func = newData[0];
	  bitmask = newData[1];
	  thisArg = newData[2];
	  partials = newData[3];
	  holders = newData[4];
	  arity = newData[9] = newData[9] === undefined
	    ? (isBindKey ? 0 : func.length)
	    : nativeMax$3(newData[9] - length, 0);

	  if (!arity && bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2)) {
	    bitmask &= ~(WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2);
	  }
	  if (!bitmask || bitmask == WRAP_BIND_FLAG$6) {
	    var result = _createBind(func, bitmask, thisArg);
	  } else if (bitmask == WRAP_CURRY_FLAG$4 || bitmask == WRAP_CURRY_RIGHT_FLAG$2) {
	    result = _createCurry(func, bitmask, arity);
	  } else if ((bitmask == WRAP_PARTIAL_FLAG$2 || bitmask == (WRAP_BIND_FLAG$6 | WRAP_PARTIAL_FLAG$2)) && !holders.length) {
	    result = _createPartial(func, bitmask, thisArg, partials);
	  } else {
	    result = _createHybrid.apply(undefined, newData);
	  }
	  var setter = data ? _baseSetData : _setData;
	  return _setWrapToString(setter(result, newData), func, bitmask);
	}

	var _createWrap = createWrap;

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG$7 = 1,
	    WRAP_PARTIAL_FLAG$3 = 32;

	/**
	 * Creates a function that invokes `func` with the `this` binding of `thisArg`
	 * and `partials` prepended to the arguments it receives.
	 *
	 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
	 * may be used as a placeholder for partially applied arguments.
	 *
	 * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
	 * property of bound functions.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {...*} [partials] The arguments to be partially applied.
	 * @returns {Function} Returns the new bound function.
	 * @example
	 *
	 * function greet(greeting, punctuation) {
	 *   return greeting + ' ' + this.user + punctuation;
	 * }
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * var bound = _.bind(greet, object, 'hi');
	 * bound('!');
	 * // => 'hi fred!'
	 *
	 * // Bound with placeholders.
	 * var bound = _.bind(greet, object, _, '!');
	 * bound('hi');
	 * // => 'hi fred!'
	 */
	var bind = _baseRest(function(func, thisArg, partials) {
	  var bitmask = WRAP_BIND_FLAG$7;
	  if (partials.length) {
	    var holders = _replaceHolders(partials, _getHolder(bind));
	    bitmask |= WRAP_PARTIAL_FLAG$3;
	  }
	  return _createWrap(func, bitmask, thisArg, partials, holders);
	});

	// Assign default placeholders.
	bind.placeholder = {};

	var bind_1 = bind;

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

	function _typeof(obj) {
	  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
	    module.exports = _typeof = function _typeof(obj) {
	      return _typeof2(obj);
	    };
	  } else {
	    module.exports = _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
	    };
	  }

	  return _typeof(obj);
	}

	module.exports = _typeof;
	});

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  }
	}

	var arrayWithoutHoles = _arrayWithoutHoles;

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	var iterableToArray = _iterableToArray;

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	var nonIterableSpread = _nonIterableSpread;

	function _toConsumableArray(arr) {
	  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
	}

	var toConsumableArray = _toConsumableArray;

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]';

	/**
	 * Checks if `value` is classified as a boolean primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
	 * @example
	 *
	 * _.isBoolean(false);
	 * // => true
	 *
	 * _.isBoolean(null);
	 * // => false
	 */
	function isBoolean(value) {
	  return value === true || value === false ||
	    (isObjectLike_1(value) && _baseGetTag(value) == boolTag);
	}

	var isBoolean_1 = isBoolean;

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */

	var _nodeUtil = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && _freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    // Use `util.types` for Node.js 10+.
	    var types = freeModule && freeModule.require && freeModule.require('util').types;

	    if (types) {
	      return types;
	    }

	    // Legacy `process.binding('util')` for Node.js < 10.
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
	});

	/* Node.js helper references. */
	var nodeIsRegExp = _nodeUtil && _nodeUtil.isRegExp;

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	var _overArg = overArg;

	/** Built-in value references. */
	var getPrototype = _overArg(Object.getPrototypeOf, Object);

	var _getPrototype = getPrototype;

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var funcProto$2 = Function.prototype,
	    objectProto$5 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$2 = funcProto$2.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString$2.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = _getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty$4.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString$2.call(Ctor) == objectCtorString;
	}

	var isPlainObject_1 = isPlainObject;

	/* Node.js helper references. */
	var nodeIsDate = _nodeUtil && _nodeUtil.isDate;

	/** `Object#toString` result references. */
	var numberTag = '[object Number]';

	/**
	 * Checks if `value` is classified as a `Number` primitive or object.
	 *
	 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
	 * classified as numbers, use the `_.isFinite` method.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
	 * @example
	 *
	 * _.isNumber(3);
	 * // => true
	 *
	 * _.isNumber(Number.MIN_VALUE);
	 * // => true
	 *
	 * _.isNumber(Infinity);
	 * // => true
	 *
	 * _.isNumber('3');
	 * // => false
	 */
	function isNumber(value) {
	  return typeof value == 'number' ||
	    (isObjectLike_1(value) && _baseGetTag(value) == numberTag);
	}

	var isNumber_1 = isNumber;

	/**
	 * Checks if `value` is `undefined`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	 * @example
	 *
	 * _.isUndefined(void 0);
	 * // => true
	 *
	 * _.isUndefined(null);
	 * // => false
	 */

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag);
	}

	var isString_1 = isString;

	/**
	 * Checks if `value` is `null` or `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
	 * @example
	 *
	 * _.isNil(null);
	 * // => true
	 *
	 * _.isNil(void 0);
	 * // => true
	 *
	 * _.isNil(NaN);
	 * // => false
	 */
	function isNil(value) {
	  return value == null;
	}

	var isNil_1 = isNil;

	function isPromise(obj) {
	  return !!obj && (_typeof_1(obj) === "object" || typeof obj === "function") && typeof obj.then === "function";
	}

	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
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
	  return desc && (isFunction_1(desc.get) || isFunction_1(desc.set)) && isBoolean_1(desc.configurable) && isBoolean_1(desc.enumerable) && desc.writable === undefined;
	}
	function isDataDescriptor(desc) {
	  return desc && desc.hasOwnProperty('value') && isBoolean_1(desc.configurable) && isBoolean_1(desc.enumerable) && isBoolean_1(desc.writable);
	}
	function isInitializerDescriptor(desc) {
	  return desc && isFunction_1(desc.initializer) && isBoolean_1(desc.configurable) && isBoolean_1(desc.enumerable) && isBoolean_1(desc.writable);
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

	  if (!isArray_1(fns) || fns.length < 1) {
	    throw new TypeError(errmsg);
	  }

	  if (fns.length === 1) {
	    if (!isFunction_1(fns[0])) {
	      throw new TypeError(errmsg);
	    }

	    return fns[0];
	  }

	  return fns.reduce(function (prev, curr) {
	    if (!isFunction_1(curr) || !isFunction_1(prev)) {
	      throw new TypeError(errmsg);
	    }

	    return function (value) {
	      return bind_1(curr, this)(bind_1(prev, this)(value));
	    };
	  });
	}
	function warn(message) {
	  if (isFunction_1(console.warn)) {
	    return console.warn(message);
	  }

	  console.log(message);
	}
	function getOwnKeysFn() {
	  var getOwnPropertyNames = Object.getOwnPropertyNames,
	      getOwnPropertySymbols = Object.getOwnPropertySymbols;
	  return isFunction_1(getOwnPropertySymbols) ? function (obj) {
	    return toConsumableArray(getOwnPropertySymbols(obj)).concat(toConsumableArray(getOwnPropertyNames(obj)));
	  } : getOwnPropertyNames;
	}
	var getOwnKeys = getOwnKeysFn();
	function getOwnPropertyDescriptorsFn() {
	  return isFunction_1(Object.getOwnPropertyDescriptors) ? Object.getOwnPropertyDescriptors : function (obj) {
	    return getOwnKeys(obj).reduce(function (descs, key) {
	      descs[key] = getOwnPropertyDescriptor(obj, key);
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
	    if (!isFunction_1(fn)) {
	      throw new TypeError("Decorators must be a function, but not \"".concat(fn, "\" in ").concat(_typeof_1(fn)));
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

	  if (!(isArray_1(get) && get.length > 0) && !(isArray_1(set) && set.length > 0) && !isFunction_1(get) && !isFunction_1(set)) {
	    throw new TypeError('@accessor need a getter or setter. If you don\'t need to add setter/getter. You should remove @accessor');
	  }

	  var errmsg = '@accessor only accept function or array of function as getter/setter';
	  var singleFnGet = isArray_1(get) ? compressOneArgFnArray(get, errmsg) : get;
	  var singleFnSet = isArray_1(set) ? compressOneArgFnArray(set, errmsg) : set;
	  return function (obj, prop, descriptor) {
	    var _ref3 = descriptor || {},
	        _ref3$configurable = _ref3.configurable,
	        configurable = _ref3$configurable === void 0 ? true : _ref3$configurable,
	        _ref3$enumerable = _ref3.enumerable,
	        enumerable = _ref3$enumerable === void 0 ? true : _ref3$enumerable;

	    var hasGet = isFunction_1(singleFnGet);

	    var hasSet = isFunction_1(singleFnSet);

	    var handleGet = function handleGet(value) {
	      return hasGet ? bind_1(singleFnGet, this)(value) : value;
	    };

	    var handleSet = function handleSet(value) {
	      return hasSet ? bind_1(singleFnSet, this)(value) : value;
	    };

	    if (isAccessorDescriptor(descriptor)) {
	      var originGet = descriptor.get,
	          originSet = descriptor.set;

	      var hasOriginGet = isFunction_1(originGet);

	      var hasOriginSet = isFunction_1(originSet);

	      if (process.env.NODE_ENV !== 'production' && !hasOriginGet && hasGet) {
	        warn("You are trying to set getter via @accessor on ".concat(prop, " without getter. That's not a good idea."));
	      }

	      if (process.env.NODE_ENV !== 'production' && !hasOriginSet && hasSet) {
	        warn("You are trying to set setter via @accessor on  ".concat(prop, " without setter. That's not a good idea."));
	      }

	      var getter = hasOriginGet || hasGet ? function () {
	        var _this = this;

	        var boundGetter = bind_1(handleGet, this);

	        var originBoundGetter = function originBoundGetter() {
	          return hasOriginGet ? bind_1(originGet, _this)() : undefined;
	        };

	        var order = preGet ? [boundGetter, originBoundGetter] : [originBoundGetter, boundGetter];
	        return order.reduce(function (value, fn) {
	          return fn(value);
	        }, undefined);
	      } : undefined;
	      var setter = hasOriginSet || hasSet ? function (val) {
	        var _this2 = this;

	        var boundSetter = bind_1(handleSet, this);

	        var originBoundSetter = function originBoundSetter(value) {
	          return hasOriginSet ? bind_1(originSet, _this2)(value) : value;
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
	          var boundFn = bind_1(handleGet, this);

	          if (inited) {
	            return boundFn(_value);
	          }

	          _value = bind_1(initializer, this)();
	          inited = true;
	          return boundFn(_value);
	        },
	        set: function set(val) {
	          var boundFn = bind_1(handleSet, this);

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
	        return bind_1(handleGet, this)(value);
	      },
	      set: function set(val) {
	        var boundFn = bind_1(handleSet, this);

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

	function before() {
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
	    if (!isFunction_1(fns[i])) {
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

	    if (!isFunction_1(fn)) {
	      throw new TypeError("@before can only be used on function, please check the property \"".concat(prop, "\" is a method or not."));
	    }

	    var handler = function handler() {
	      var _this = this;

	      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      var paras = fns.reduce(function (paras, fn) {
	        var result = bind_1(fn, _this).apply(void 0, toConsumableArray(paras));

	        return result === undefined ? paras : isArray_1(result) ? result : [result];
	      }, args);
	      return bind_1(fn, this).apply(void 0, toConsumableArray(paras));
	    };

	    return {
	      configurable: configurable,
	      enumerable: enumerable,
	      value: handler,
	      writable: writable
	    };
	  };
	}

	function after() {
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

	    if (!isFunction_1(value)) {
	      throw new TypeError("@after can only be used on function, please checkout your property \"".concat(prop, "\" is a method or not."));
	    }

	    var handler = function handler() {
	      var ret = bind_1(value, this).apply(void 0, arguments);

	      return bind_1(fn, this)(ret);
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

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	var arrayWithHoles = _arrayWithHoles;

	function _iterableToArrayLimit(arr, i) {
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	var iterableToArrayLimit = _iterableToArrayLimit;

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	var nonIterableRest = _nonIterableRest;

	function _slicedToArray(arr, i) {
	  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
	}

	var slicedToArray = _slicedToArray;

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
	        value: bind_1(fn, obj)(),
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

	          return bind_1(fn, this)(value);
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
	        return bind_1(fn, this)(bind_1(initializer, this)());
	      };

	      return {
	        configurable: descriptor.configurable,
	        enumerable: descriptor.enumerable,
	        initializer: handler,
	        writable: descriptor.writable
	      };
	    }

	    var value = bind_1(fn, this)(descriptor.value);

	    return {
	      configurable: descriptor.configurable,
	      enumerable: descriptor.enumerable,
	      value: value,
	      writable: descriptor.writable
	    };
	  };
	}

	/**
	 * get an deep property
	 */
	function getDeepProperty(obj, keys, _a) {
	    var _b = _a === void 0 ? {} : _a,
	        _c = _b.throwError,
	        throwError = _c === void 0 ? false : _c,
	        backup = _b.backup;
	    if (isString_1(keys)) {
	        keys = keys.split(".");
	    }
	    if (!isArray_1(keys)) {
	        throw new TypeError("keys of getDeepProperty must be string or Array<string>");
	    }
	    var read = [];
	    var target = obj;
	    for (var i = 0, len = keys.length; i < len; i++) {
	        var key = keys[i];
	        if (isNil_1(target)) {
	            if (throwError) {
	                throw new Error("obj" + (read.length > 0 ? "." + read.join(".") : " itself") + " is " + target);
	            } else {
	                return backup;
	            }
	        }
	        target = target[key];
	        read.push(key);
	    }
	    return target;
	}

	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor,
	    defineProperty$1 = Object.defineProperty;

	function setAlias(root, prop, _ref, obj, key, _ref2) {
	  var configurable = _ref.configurable,
	      enumerable = _ref.enumerable;
	  var force = _ref2.force,
	      omit = _ref2.omit;
	  var originDesc = getOwnPropertyDescriptor$1(obj, key);

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

	  defineProperty$1(obj, key, {
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
	    if (isString_1(other)) {
	      option = key;
	      key = other;
	      other = undefined;
	    }
	  } else if (arguments.length === 1) {
	    key = other;
	    other = undefined;
	  }

	  if (!isString_1(key)) {
	    throw new TypeError('@alias need a string as a key to find the porperty to set alias on');
	  }

	  var illegalObjErrorMsg = 'If you want to use @alias to set alias on other instance, you must pass in a legal instance';

	  if (other !== undefined && !isObject_1(other)) {
	    throw new TypeError(illegalObjErrorMsg);
	  }

	  var _ref3 = isPlainObject_1(option) ? option : {
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
	      var target = !isObject_1(other) ? obj : other;
	      var keys = key.split('.');

	      var _keys$slice = keys.slice(-1),
	          _keys$slice2 = slicedToArray(_keys$slice, 1),
	          name = _keys$slice2[0];

	      target = getDeepProperty(target, keys.slice(0, -1), {
	        throwError: true
	      });

	      if (!isObject_1(target)) {
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

	var defineProperty$2 = Object.defineProperty;
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

	    if (!isArray_1(exclude)) {
	      throw new TypeError('options.exclude must be an array');
	    }

	    if (!isArray_1(include)) {
	      throw new TypeError('options.include must be an array');
	    }

	    return function (Klass) {
	      var isClass = isFunction_1(Klass);

	      if (!self && !isClass) {
	        throw new TypeError("@".concat(decorator.name, "Class can only be used on class"));
	      }

	      if (self && !isObject_1(Klass)) {
	        throw new TypeError("@".concat(decorator.name, "Class must be used on non-primitive type value in 'self' mode"));
	      }

	      var prototype = self ? Klass : Klass.prototype;

	      if (isNil_1(prototype)) {
	        throw new Error("The prototype of the ".concat(Klass.name, " is empty, please check it"));
	      }

	      var descs = getOwnPropertyDescriptors(prototype);
	      getOwnKeys(prototype).concat(include).forEach(function (key) {
	        var desc = descs[key];

	        if (key === 'constructor' && !construct || self && isClass && ['name', 'length', 'prototype'].indexOf(key) > -1 || exclude.indexOf(key) > -1 || isFunction_1(requirement) && requirement(prototype, key, desc, {
	          self: self
	        }) === false) {
	          return;
	        }

	        defineProperty$2(prototype, key, (customArgs ? decorator.apply(void 0, args) : decorator)(prototype, key, desc));
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
	    superStore.set(fn, bind_1(fn, obj));
	  }

	  return superStore.get(fn);
	}

	function autobind(obj, prop, descriptor) {
	  if (arguments.length === 1) {
	    return classify(autobind, {
	      requirement: function requirement(obj, prop, desc) {
	        return isDataDescriptor(desc) && isFunction_1(desc.value);
	      }
	    })()(obj);
	  }

	  var _ref = descriptor || {
	    configurable: undefined,
	    value: undefined
	  },
	      fn = _ref.value,
	      configurable = _ref.configurable;

	  if (!isFunction_1(fn)) {
	    throw new TypeError("@autobind can only be used on functions, not \"".concat(fn, "\" in ").concat(_typeof_1(fn), " on property \"").concat(prop, "\""));
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

	var defineProperty$3 = Object.defineProperty;
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

	    if (!isFunction_1(_get)) {
	      if (process.env.NODE_ENV !== 'production') {
	        warn('You are using @frozen on one accessor descriptor without getter. This property will become a frozen undefined finally.Which maybe meaningless.');
	      }

	      return;
	    }

	    return {
	      configurable: false,
	      enumerable: false,
	      get: function get() {
	        var value = bind_1(_get, this)();

	        defineProperty$3(this, prop, {
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

	var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor,
	    defineProperty$4 = Object.defineProperty;
	function waituntil(key) {
	  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	      other = _ref.other;

	  if (!isFunction_1(key) && !isPromise(key) && !isString_1(key)) {
	    throw new TypeError('@waitUntil only accept Function, Promise or String');
	  }

	  return function (obj, prop, descriptor) {
	    var _ref2 = descriptor || {
	      configurable: undefined,
	      value: undefined
	    },
	        _value = _ref2.value,
	        configurable = _ref2.configurable;

	    if (!isFunction_1(_value)) {
	      throw new TypeError("@waituntil can only be used on function, but not ".concat(_value, " on property \"").concat(prop, "\""));
	    }

	    var binded = false;
	    var waitingQueue = [];
	    var canIRun = isPromise(key) ? function () {
	      return key;
	    } : isFunction_1(key) ? key : function () {
	      var keys = key.split('.');

	      var _keys$slice = keys.slice(-1),
	          _keys$slice2 = slicedToArray(_keys$slice, 1),
	          prop = _keys$slice2[0];

	      var originTarget = !isObject_1(other) ? this : other;

	      if (!binded) {
	        var target = getDeepProperty(originTarget, keys.slice(0, -1));

	        if (isNil_1(target)) {
	          return target;
	        }

	        var _descriptor = getOwnPropertyDescriptor$2(target, prop);

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
	        defineProperty$4(target, prop, desc);
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

	        var boundFn = bind_1(_value, this);

	        var runnable = bind_1(canIRun, this).apply(void 0, args);

	        if (isPromise(runnable)) {
	          return Promise.resolve(runnable).then(function () {
	            return bind_1(_value, _this).apply(void 0, args);
	          });
	        } else if (runnable === true) {
	          return bind_1(_value, this).apply(void 0, args);
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

	var defineProperty$5 = Object.defineProperty;
	function lazyInit(obj, prop, descriptor) {
	  if (descriptor === undefined) {
	    throw new TypeError('@lazyInit cannot be apply on undefined property.');
	  }

	  if (!isFunction_1(descriptor.initializer)) {
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
	      var value = bind_1(initializer, this)();

	      defineProperty$5(this, prop, {
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

	var defineProperty$6 = Object.defineProperty;
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

	    if (!isFunction_1(_get)) {
	      warn('You are using @lock on one accessor descriptor without getter. This property will become a lock undefined finally.Which maybe meaningless.');
	      return;
	    }

	    return {
	      configurable: false,
	      enumerable: descriptor.enumerable,
	      get: function get() {
	        var value = bind_1(_get, this)();

	        defineProperty$6(this, prop, {
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

	function _defineProperty$1(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	var defineProperty$7 = _defineProperty$1;

	var defineProperty$8 = Object.defineProperty,
	    getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;
	function applyDecorators(Class, props) {
	  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      _ref$self = _ref.self,
	      self = _ref$self === void 0 ? false : _ref$self,
	      _ref$omit = _ref.omit,
	      omit = _ref$omit === void 0 ? false : _ref$omit;

	  var isPropsFunction = isFunction_1(props);

	  if (isPropsFunction || isArray_1(props)) {
	    if (!isFunction_1(Class)) {
	      throw new TypeError('If you want to decorator class, you must pass it a legal class');
	    }

	    if (isPropsFunction) {
	      props(Class);
	    } else {
	      for (var i = 0, len = props.length; i < len; i++) {
	        var fn = props[i];

	        if (!isFunction_1(fn)) {
	          throw new TypeError('If you want to decorate an class, you must pass it function or array of function');
	        }

	        fn(Class);
	      }
	    }

	    return Class;
	  }

	  if (!self && !isFunction_1(Class)) {
	    throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
	  }

	  if (self && !isObject_1(Class)) {
	    throw new TypeError('We can\'t apply docorators on a primitive value, even in self mode');
	  }

	  if (!isPlainObject_1(props)) {
	    throw new TypeError('applyDecorators only accept object as second arguments');
	  }

	  var prototype = self ? Class : Class.prototype;

	  if (isNil_1(prototype)) {
	    throw new Error('The class muse have a prototype, please take a check');
	  }

	  for (var key in props) {
	    var value = props[key];
	    var decorators = isArray_1(value) ? value : [value];
	    var handler = void 0;

	    try {
	      handler = compressMultipleDecorators.apply(void 0, toConsumableArray(decorators));
	    } catch (err) {
	      if (process.env.NODE_ENV !== 'production') {
	        warn(err && err.message);
	      }

	      throw new Error('The decorators set on props must be Function or Array of Function');
	    }

	    var descriptor = getOwnPropertyDescriptor$3(prototype, key);

	    if (descriptor && !descriptor.configurable) {
	      if (!omit) {
	        throw new Error("".concat(key, " of ").concat(prototype, " is unconfigurable"));
	      }

	      continue;
	    }

	    defineProperty$8(prototype, key, handler(prototype, key, descriptor));
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

	      if (isArray_1(target) && arrayChangeMethod.indexOf(property) > -1) {
	        return function () {
	          arrayChanging = true;

	          bind_1(value, receiver).apply(void 0, arguments);

	          arrayChanging = false;
	          hook();
	        };
	      }

	      if (mapStore[property] === true) {
	        return value;
	      }

	      if (isPlainObject_1(value) || isArray_1(value)) {
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
	      var newVal = isPlainObject_1(value) || isArray_1(value) ? deepProxy(value, hook, {
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
	  var operateProps = (_operateProps = {}, defineProperty$7(_operateProps, operationPrefix + 'set', [initialize(function () {
	    return function (property, val) {
	      proxyValue[property] = val;
	    };
	  }), nonenumerable]), defineProperty$7(_operateProps, operationPrefix + 'del', [initialize(function () {
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

	          if (isPlainObject_1(val) || isArray_1(val)) {
	            deepObserve(val, hook, {
	              operationPrefix: operationPrefix,
	              diff: diff
	            });
	          }

	          mapStore[key] = true;
	          return val;
	        },
	        set: function set(val) {
	          if (isPlainObject_1(val) || isArray_1(val)) {
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

	  if (isArray_1(value)) {
	    var methodProps = arrayChangeMethod.reduce(function (props, key) {
	      props[key] = [initialize(function (method) {
	        method = isFunction_1(method) ? method : Array.prototype[key];
	        return function () {
	          var originLength = value.length;
	          arrayChanging = true;

	          bind_1(method, value).apply(void 0, arguments);

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

	  var operateProps = (_operateProps2 = {}, defineProperty$7(_operateProps2, operationPrefix + 'set', [initialize(function (method) {
	    return function (property, val) {
	      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	          disable = _ref3.disable,
	          isNewVal = _ref3.isNewVal;

	      isNewVal = isNewVal || getOwnKeys(value).indexOf(property) === -1;

	      if (isFunction_1(method)) {
	        bind_1(method, _this)(property, val, {
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
	  }), nonenumerable]), defineProperty$7(_operateProps2, operationPrefix + 'del', [initialize(function (method) {
	    return function (property) {
	      if (isFunction_1(method)) {
	        bind_1(method, _this)(property);
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

	  var option = isPlainObject_1(args[args.length - 1]) ? args[args.length - 1] : {};
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

	  if (other !== undefined && !isObject_1(other)) {
	    throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
	  }

	  if (!isString_1(operationPrefix)) {
	    throw new TypeError('operationPrefix must be an string');
	  }

	  return function (obj, prop, descriptor) {
	    var fns = args.reduce(function (fns, keyOrFn, index) {
	      if (!isString_1(keyOrFn) && !isFunction_1(keyOrFn)) {
	        if (!index || index !== args.length - 1) {
	          throw new TypeError('You can only pass function or string as handler');
	        }

	        return fns;
	      }

	      fns.push(isString_1(keyOrFn) ? function (newVal, oldVal) {
	        var target = other || obj;
	        var fn = getDeepProperty(target, keyOrFn);

	        if (!isFunction_1(fn)) {
	          if (!omit) {
	            throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
	          }

	          return;
	        }

	        return bind_1(fn, this)(newVal, oldVal);
	      } : keyOrFn);
	      return fns;
	    }, []);

	    var handler = function handler(newVal, oldVal) {
	      var _this2 = this;

	      fns.forEach(function (fn) {
	        return bind_1(fn, _this2)(newVal, oldVal);
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
	          return bind_1(handler, _this3)(newVal, oldVal);
	        };

	        return deep && (isPlainObject_1(value) || isArray_1(value)) ? proxy ? deepProxy(value, hook, {
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
	            return bind_1(handler, _this4)(newVal, oldVal);
	          };

	          if (deep && (isPlainObject_1(value) || isArray_1(value))) {
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
	          bind_1(handler, this)(newVal, oldVal);
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

	function runnable(key) {
	  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	      other = _ref.other,
	      backup = _ref.backup;

	  if (!isFunction_1(key) && !isString_1(key)) {
	    throw new TypeError('@runnable only accept Function or String');
	  }

	  return function (obj, prop, descriptor) {
	    var _ref2 = descriptor || {
	      configurable: undefined,
	      value: undefined
	    },
	        _value = _ref2.value,
	        configurable = _ref2.configurable;

	    if (!isFunction_1(_value)) {
	      throw new TypeError("@runnable can only be used on method, but not ".concat(_value, " on property \"").concat(prop, "\"."));
	    }

	    var canIRun = isFunction_1(key) ? key : function () {
	      var keys = key.split('.');
	      var originTarget = !isObject_1(other) ? this : other;
	      return getDeepProperty(originTarget, keys);
	    };
	    backup = isFunction_1(backup) ? backup : function () {};
	    return {
	      configurable: configurable,
	      enumerable: false,
	      writable: false,
	      value: function value() {
	        if (bind_1(canIRun, this).apply(void 0, arguments) === true) {
	          return bind_1(_value, this).apply(void 0, arguments);
	        }

	        return bind_1(backup, this).apply(void 0, arguments);
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

	function string(defaultValue) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (isFunction_1(defaultValue)) {
	    args.unshift(defaultValue);
	    defaultValue = '';
	  } else if (!isString_1(defaultValue)) {
	    defaultValue = '';
	  }

	  args.unshift(function (value) {
	    return isString_1(value) ? value : defaultValue;
	  });
	  return initialize.apply(void 0, args);
	}

	function boolean(defaultValue) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (isFunction_1(defaultValue)) {
	    args.unshift(defaultValue);
	    defaultValue = false;
	  } else if (!isBoolean_1(defaultValue)) {
	    defaultValue = false;
	  }

	  args.unshift(function (value) {
	    return isBoolean_1(value) ? value : defaultValue;
	  });
	  return initialize.apply(void 0, args);
	}

	function array(defaultValue) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (isFunction_1(defaultValue)) {
	    args.unshift(defaultValue);
	    defaultValue = [];
	  } else if (!isArray_1(defaultValue)) {
	    defaultValue = [];
	  }

	  args.unshift(function (value) {
	    return isArray_1(value) ? value : defaultValue;
	  });
	  return initialize.apply(void 0, args);
	}

	function number(defaultValue) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (isFunction_1(defaultValue)) {
	    args.unshift(defaultValue);
	    defaultValue = 0;
	  } else if (!isNumber_1(defaultValue)) {
	    defaultValue = 0;
	  }

	  args.unshift(function (value) {
	    return isNumber_1(value) ? value : defaultValue;
	  });
	  return initialize.apply(void 0, args);
	}

	function string$1(defaultValue) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (isFunction_1(defaultValue)) {
	    args.unshift(defaultValue);
	    defaultValue = '';
	  } else if (!isString_1(defaultValue)) {
	    defaultValue = '';
	  }

	  args.unshift(function (value) {
	    return isString_1(value) ? value : defaultValue;
	  });
	  return accessor({
	    set: args,
	    get: args
	  });
	}

	function boolean$1(defaultValue) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (isFunction_1(defaultValue)) {
	    args.unshift(defaultValue);
	    defaultValue = false;
	  } else if (!isBoolean_1(defaultValue)) {
	    defaultValue = false;
	  }

	  args.unshift(function (value) {
	    return isBoolean_1(value) ? value : defaultValue;
	  });
	  return accessor({
	    set: args,
	    get: args
	  });
	}

	function array$1(defaultValue) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (isFunction_1(defaultValue)) {
	    args.unshift(defaultValue);
	    defaultValue = [];
	  } else if (!isArray_1(defaultValue)) {
	    defaultValue = [];
	  }

	  args.unshift(function (value) {
	    return isArray_1(value) ? value : defaultValue;
	  });
	  return accessor({
	    set: args,
	    get: args
	  });
	}

	function number$1(defaultValue) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (isFunction_1(defaultValue)) {
	    args.unshift(defaultValue);
	    defaultValue = 0;
	  } else if (!isNumber_1(defaultValue)) {
	    defaultValue = 0;
	  }

	  args.unshift(function (value) {
	    return isNumber_1(value) ? value : defaultValue;
	  });
	  return accessor({
	    set: args,
	    get: args
	  });
	}

	var autobind$1 = classify(autobind, {
	  requirement: function requirement(obj, prop, desc) {
	    return isDataDescriptor(desc) && isFunction_1(desc.value);
	  }
	});

	var before$1 = classify(before, {
	  requirement: function requirement(obj, prop, desc) {
	    return isDataDescriptor(desc) && isFunction_1(desc.value);
	  },
	  customArgs: true
	});

	var after$1 = classify(after, {
	  requirement: function requirement(obj, prop, desc) {
	    return isDataDescriptor(desc) && isFunction_1(desc.value);
	  },
	  customArgs: true
	});

	var runnable$1 = classify(runnable, {
	  requirement: function requirement(obj, prop, desc) {
	    return isDataDescriptor(desc) && isFunction_1(desc.value);
	  },
	  customArgs: true
	});

	var waituntil$1 = classify(waituntil, {
	  requirement: function requirement(obj, prop, desc) {
	    return isDataDescriptor(desc) && isFunction_1(desc.value);
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
	exports.configurable = configurable;
	exports.nonconfigurable = nonconfigurable;
	exports.initString = string;
	exports.initBoolean = boolean;
	exports.initArray = array;
	exports.initNumber = number;
	exports.alwaysString = string$1;
	exports.alwaysBoolean = boolean$1;
	exports.alwaysArray = array$1;
	exports.alwaysNumber = number$1;
	exports.autobindClass = autobind$1;
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

	Object.defineProperty(exports, '__esModule', { value: true });

}));
