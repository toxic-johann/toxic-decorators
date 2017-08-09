
/**
 * toxic-decorators v0.3.8
 * (c) 2017 toxic-johann
 * Released under GPL-3.0
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.toxicDecorators = {})));
}(this, (function (exports) { 'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// 7.1.4 ToInteger
var ceil  = Math.ceil;
var floor = Math.floor;
var _toInteger = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function(TO_STRING){
  return function(that, pos){
    var s = String(_defined(that))
      , i = _toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function(fn, that, length){
  _aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function(it){
  if(!_isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var document$1 = _global.document;
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function(it){
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!_isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if(_ie8DomDefine)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var _hide = _descriptors ? function(object, key, value){
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? _core : _core[name] || (_core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])_hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
var _export = $export;

var _redefine = _hide;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var _iterators = {};

var toString = {}.toString;

var _cof = function(it){
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings

var _toIobject = function(it){
  return _iobject(_defined(it));
};

// 7.1.15 ToLength
var min       = Math.min;
var _toLength = function(it){
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max       = Math.max;
var min$1       = Math.min;
var _toIndex = function(index, length){
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes

var _arrayIncludes = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = _toIobject($this)
      , length = _toLength(O.length)
      , index  = _toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store  = _global[SHARED] || (_global[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');
var _sharedKey = function(key){
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$1     = _sharedKey('IE_PROTO');

var _objectKeysInternal = function(object, names){
  var O      = _toIobject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO$1)_has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(_has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)


var _objectKeys = Object.keys || function keys(O){
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
  _anObject(O);
  var keys   = _objectKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)_objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var _html = _global.document && document.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var IE_PROTO    = _sharedKey('IE_PROTO');
var Empty       = function(){ /* empty */ };
var PROTOTYPE$1   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe')
    , i      = _enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty;
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store      = _shared('wks')
  , Symbol     = _global.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;
var TAG = _wks('toStringTag');

var _setToStringTag = function(it, tag, stat){
  if(it && !_has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

var _iterCreate = function(Constructor, NAME, next){
  Constructor.prototype = _objectCreate(IteratorPrototype, {next: _propertyDesc(1, next)});
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function(it){
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var IE_PROTO$2    = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = _toObject(O);
  if(_has(O, IE_PROTO$2))return O[IE_PROTO$2];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR       = _wks('iterator');
var BUGGY          = !([].keys && 'next' in [].keys());
var FF_ITERATOR    = '@@iterator';
var KEYS           = 'keys';
var VALUES         = 'values';

var returnThis = function(){ return this; };

var _iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  _iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = _objectGpo($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!_library && !_has(IteratorPrototype, ITERATOR))_hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))_redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at  = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

var _addToUnscopables = function(){ /* empty */ };

var _iterStep = function(done, value){
  return {value: value, done: !!done};
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return _iterStep(1);
  }
  if(kind == 'keys'  )return _iterStep(0, index);
  if(kind == 'values')return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var TO_STRING_TAG = _wks('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = _global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])_hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

var f$1 = _wks;

var _wksExt = {
	f: f$1
};

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
});

var _meta = createCommonjsModule(function (module) {
var META     = _uid('meta')
  , setDesc  = _objectDp.f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !_fails(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!_isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!_has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!_has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !_has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
});

var defineProperty = _objectDp.f;
var _wksDefine = function(name){
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: _wksExt.f(name)});
};

var _keyof = function(object, el){
  var O      = _toIobject(object)
    , keys   = _objectKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

var f$2 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$3
};

// all enumerable object keys, includes symbols

var _enumKeys = function(it){
  var result     = _objectKeys(it)
    , getSymbols = _objectGops.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = _objectPie.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg){
  return _cof(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$5
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var gOPN$1      = _objectGopn.f;
var toString$1  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN$1(it);
  } catch(e){
    return windowNames.slice();
  }
};

var f$4 = function getOwnPropertyNames(it){
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
};

var _objectGopnExt = {
	f: f$4
};

var gOPD$1           = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P){
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if(_ie8DomDefine)try {
    return gOPD$1(O, P);
  } catch(e){ /* empty */ }
  if(_has(O, P))return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

// ECMAScript 6 symbols shim
var META           = _meta.KEY;
var gOPD           = _objectGopd.f;
var dP$1             = _objectDp.f;
var gOPN           = _objectGopnExt.f;
var $Symbol        = _global.Symbol;
var $JSON          = _global.JSON;
var _stringify     = $JSON && $JSON.stringify;
var PROTOTYPE$2      = 'prototype';
var HIDDEN         = _wks('_hidden');
var TO_PRIMITIVE   = _wks('toPrimitive');
var isEnum         = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols     = _shared('symbols');
var OPSymbols      = _shared('op-symbols');
var ObjectProto$1    = Object[PROTOTYPE$2];
var USE_NATIVE     = typeof $Symbol == 'function';
var QObject        = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function(){
  return _objectCreate(dP$1({}, 'a', {
    get: function(){ return dP$1(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto$1, key);
  if(protoDesc)delete ObjectProto$1[key];
  dP$1(it, key, D);
  if(protoDesc && it !== ObjectProto$1)dP$1(ObjectProto$1, key, protoDesc);
} : dP$1;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty$1 = function defineProperty(it, key, D){
  if(it === ObjectProto$1)$defineProperty$1(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if(_has(AllSymbols, key)){
    if(!D.enumerable){
      if(!_has(it, HIDDEN))dP$1(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(_has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _objectCreate(D, {enumerable: _propertyDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP$1(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty$1(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if(this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key))return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = _toIobject(it);
  key = _toPrimitive(key, true);
  if(it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(_toIobject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto$1
    , names  = gOPN(IS_OP ? OPSymbols : _toIobject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto$1)$set.call(OPSymbols, value);
      if(_has(this, HIDDEN) && _has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if(_descriptors && setter)setSymbolDesc(ObjectProto$1, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString(){
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f   = $defineProperty$1;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f  = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if(_descriptors && !_library){
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function(name){
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i$1 = 0; symbols.length > i$1; )_wks(symbols[i$1++]);

for(var symbols = _objectKeys(_wks.store), i$1 = 0; symbols.length > i$1; )_wksDefine(symbols[i$1++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return _keyof(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty$1,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !_isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var index = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": index, __esModule: true };
});

var _typeof_1 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _iterator2 = _interopRequireDefault(iterator);



var _symbol2 = _interopRequireDefault(symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof = unwrapExports(_typeof_1);

// most Object methods by ES6 should accept primitives

var _objectSap = function(KEY, exec){
  var fn  = (_core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function(){ fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)


_objectSap('keys', function(){
  return function keys(it){
    return _objectKeys(_toObject(it));
  };
});

var keys$1 = _core.Object.keys;

var keys = createCommonjsModule(function (module) {
module.exports = { "default": keys$1, __esModule: true };
});

// 20.1.2.3 Number.isInteger(number)
var floor$1    = Math.floor;
var _isInteger = function isInteger(it){
  return !_isObject(it) && isFinite(it) && floor$1(it) === it;
};

// 20.1.2.3 Number.isInteger(number)


_export(_export.S, 'Number', {isInteger: _isInteger});

var isInteger$2 = _core.Number.isInteger;

var isInteger$1 = createCommonjsModule(function (module) {
module.exports = { "default": isInteger$2, __esModule: true };
});

var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var space   = '[' + _stringWs + ']';
var non     = '\u200b\u0085';
var ltrim   = RegExp('^' + space + space + '*');
var rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = _fails(function(){
    return !!_stringWs[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  _export(_export.P + _export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(_defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

var _stringTrim = exporter;

var $parseFloat = _global.parseFloat;
var $trim       = _stringTrim.trim;

var _parseFloat$3 = 1 / $parseFloat(_stringWs + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

// 20.1.2.12 Number.parseFloat(string)
_export(_export.S + _export.F * (Number.parseFloat != _parseFloat$3), 'Number', {parseFloat: _parseFloat$3});

var _parseFloat$1 = parseFloat;

var _parseFloat = createCommonjsModule(function (module) {
module.exports = { "default": _parseFloat$1, __esModule: true };
});

/**
 * toxic-predicate-functions v0.1.2
 * (c) 2017 toxic-johann
 * Released under MIT
 */

/**
 * is void element or not ? Means it will return true when val is undefined or null
 * @param  {Anything}  obj
 * @return {Boolean}   return true when val is undefined or null
 */
function isVoid(obj) {
  return obj === undefined || obj === null;
}
/**
 * to check whether a variable is array
 * @param {Anything} arr
 * @return {Boolean} true when it is a boolean
 */
function isArray(arr) {
  return Array.isArray(arr);
}

/**
 * 判断是否为function
 * @param  {Anything}  obj [description]
 * @return {Boolean}     [description]
 */
function isFunction(obj) {
  return typeof obj === 'function';
}

/**
 * 判断是否是对象
 * @param  {Anything}  obj 传入对象
 * @return {Boolean}     [description]
 */
function isObject(obj) {
  // incase of arrow function and array
  return Object(obj) === obj && String(obj) === '[object Object]' && !isFunction(obj) && !isArray(obj);
}
/**
 * to tell you if it's a real number
 * @param  {Anything}  obj
 * @return {Boolean}   return true when it's a number
 */
function isNumber(obj) {
  return typeof obj === 'number';
}
/**
 * 判断是否是string
 * @param  {Anything}  str [description]
 * @return {Boolean}     [description]
 */
function isString(str) {
  return typeof str === 'string' || str instanceof String;
}
/**
 * is Boolean or not
 * @param  {Anything} bool
 * @return {Boolean}
 */
function isBoolean(bool) {
  return typeof bool === 'boolean';
}
/**
 * is a promise or not
 * @param {Anything} obj
 * @return {boolean}
 */
function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
/**
 * is Primitive type or not, whick means it will return true when data is number/string/boolean/undefined/null
 * @param  {Anyting}  val
 * @return {Boolean}  true when type is number/string/boolean/undefined/null
 */
function isPrimitive(val) {
  return isVoid(val) || isBoolean(val) || isString(val) || isNumber(val);
}

// call something on iterator step with safe closing on error

var _iterCall = function(iterator, fn, value, entries){
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)_anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator
var ITERATOR$1   = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function(it){
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var _createProperty = function(object, index, value){
  if(index in object)_objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

// getting tag from 19.1.3.6 Object.prototype.toString()
var TAG$1 = _wks('toStringTag');
var ARG = _cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

var _classof = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$2  = _wks('iterator');
var core_getIteratorMethod = _core.getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var ITERATOR$3     = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

var _iterDetect = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR$3]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR$3] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

_export(_export.S + _export.F * !_iterDetect(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = _toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = core_getIteratorMethod(O)
      , length, result, step, iterator;
    if(mapping)mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && _isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for(result = new C(length); length > index; index++){
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from$2 = _core.Array.from;

var from = createCommonjsModule(function (module) {
module.exports = { "default": from$2, __esModule: true };
});

var toConsumableArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _from2 = _interopRequireDefault(from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
});

var _toConsumableArray = unwrapExports(toConsumableArray);

/**
 * toxic-utils v0.1.5
 * (c) 2017 toxic-johann
 * Released under MIT
 */

/**
 * the handler to generate an deep traversal handler
 * @param  {Function} fn the function you wanna run when you reach in the deep property
 * @return {Function}    the handler
 */
function genTraversalHandler(fn) {
  function recursiveFn(source, target, key) {
    if (isArray(source) || isObject(source)) {
      target = target || (isObject(source) ? {} : []);
      for (var _key in source) {
        target[_key] = recursiveFn(source[_key], target[_key], _key);
      }
      return target;
    }
    return fn(source, target, key);
  }
  return recursiveFn;
}
var _deepAssign = genTraversalHandler(function (val) {
  return val;
});
/**
 * bind the function with some context. we have some fallback strategy here
 * @param {function} fn the function which we need to bind the context on
 * @param {any} context the context object
 */
function bind(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else if (fn.apply) {
    return function __autobind__() {
      for (var _len2 = arguments.length, args = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return fn.apply(context, args);
    };
  } else {
    return function __autobind__() {
      for (var _len3 = arguments.length, args = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return fn.call.apply(fn, [context].concat(_toConsumableArray(args)));
    };
  }
}

/**
 * get an deep property
 */
function getDeepProperty(obj, keys) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$throwError = _ref.throwError,
      throwError = _ref$throwError === undefined ? false : _ref$throwError,
      backup = _ref.backup;

  if (isString(keys)) {
    keys = keys.split('.');
  }
  if (!isArray(keys)) {
    throw new TypeError('keys of getDeepProperty must be string or Array<string>');
  }
  var read = [];
  var target = obj;
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    if (isVoid(target)) {
      if (throwError) {
        throw new Error('obj' + (read.length > 0 ? '.' + read.join('.') : ' itself') + ' is ' + target);
      } else {
        return backup;
      }
    }
    target = target[key];
    read.push(key);
  }
  return target;
}

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty$1 = function (obj, key, value) {
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
};





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
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
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray$1 = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
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
  return !!desc && (isFunction(desc.get) || isFunction(desc.set)) && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && desc.writable === undefined;
}
/**
 * to check if the descirptor is an data descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isDataDescriptor(desc) {
  return !!desc && desc.hasOwnProperty('value') && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && isBoolean(desc.writable);
}
/**
 * to check if the descirptor is an initiallizer descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isInitializerDescriptor(desc) {
  return !!desc && isFunction(desc.initializer) && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && isBoolean(desc.writable);
}
/**
 * set one value on the object
 * @param {string} key
 */
function createDefaultSetter(key) {
  return function set$$1(newValue) {
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

/**
 * Compress many function into one function, but this function only accept one arguments;
 * @param {Array<Function>} fns the array of function we need to compress into one function
 * @param {string} errmsg When we check that there is something is not function, we will throw an error, you can set your own error message
 */
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
    if (!isFunction(curr) || !isFunction(prev)) throw new TypeError(errmsg);
    return function (value) {
      return bind(curr, this)(bind(prev, this)(value));
    };
  });
}
/**
 * just a method to call console.warn, maybe i will add some handler on it someday
 * @param {anything} args
 */
function warn(message) {
  if (isFunction(console.warn)) return console.warn(message);
  console.log(message);
}

function getOwnKeysFn() {
  var getOwnPropertyNames = Object.getOwnPropertyNames,
      getOwnPropertySymbols = Object.getOwnPropertySymbols;

  return isFunction(getOwnPropertySymbols) ? function (obj) {
    // $FlowFixMe: do not support symwbol yet
    return Array.from(getOwnPropertyNames(obj).concat(getOwnPropertySymbols(obj)));
  } : getOwnPropertyNames;
}

var getOwnKeys = getOwnKeysFn();

function getOwnPropertyDescriptorsFn() {
  // $FlowFixMe: In some environment, Object.getOwnPropertyDescriptors has been implemented;
  return isFunction(Object.getOwnPropertyDescriptors) ? Object.getOwnPropertyDescriptors : function (obj) {
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
    if (!isFunction(fn)) throw new TypeError('Decorators must be a function, but not "' + fn + '" in ' + (typeof fn === 'undefined' ? 'undefined' : _typeof$1(fn)));
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

  if (!isFunction(get) && !isFunction(set) && !(isArray(get) && get.length > 0) && !(isArray(set) && set.length > 0)) throw new TypeError("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
  var errmsg = '@accessor only accept function or array of function as getter/setter';
  get = isArray(get) ? compressOneArgFnArray(get, errmsg) : get;
  set = isArray(set) ? compressOneArgFnArray(set, errmsg) : set;
  return function (obj, prop, descriptor) {
    var _ref3 = descriptor || {},
        _ref3$configurable = _ref3.configurable,
        configurable = _ref3$configurable === undefined ? true : _ref3$configurable,
        _ref3$enumerable = _ref3.enumerable,
        enumerable = _ref3$enumerable === undefined ? true : _ref3$enumerable;

    var hasGet = isFunction(get);
    var hasSet = isFunction(set);
    var handleGet = function handleGet(value) {
      // $FlowFixMe: it's really function here
      return hasGet ? bind(get, this)(value) : value;
    };
    var handleSet = function handleSet(value) {
      // $FlowFixMe: it's really function here
      return hasSet ? bind(set, this)(value) : value;
    };
    if (isAccessorDescriptor(descriptor)) {
      var originGet = descriptor.get,
          originSet = descriptor.set;

      var hasOriginGet = isFunction(originGet);
      var hasOriginSet = isFunction(originSet);
      if ("development" !== 'production' && !hasOriginGet && hasGet) {
        warn('You are trying to set getter via @accessor on ' + prop + ' without getter. That\'s not a good idea.');
      }
      if ("development" !== 'production' && !hasOriginSet && hasSet) {
        warn('You are trying to set setter via @accessor on  ' + prop + ' without setter. That\'s not a good idea.');
      }
      var getter = hasOriginGet || hasGet ? function () {
        var _this = this;

        var boundGetter = bind(handleGet, this);
        var originBoundGetter = function originBoundGetter() {
          return hasOriginGet
          // $FlowFixMe: we have do a check here
          ? bind(originGet, _this)() : undefined;
        };
        var order = preGet ? [boundGetter, originBoundGetter] : [originBoundGetter, boundGetter];
        // $FlowFixMe: it's all function here
        return order.reduce(function (value, fn) {
          return fn(value);
        }, undefined);
      } : undefined;
      var setter = hasOriginSet || hasSet ? function (val) {
        var _this2 = this;

        var boundSetter = bind(handleSet, this);
        var originBoundSetter = function originBoundSetter(value) {
          return hasOriginSet
          // $FlowFixMe: flow act like a retarded child on optional property
          ? bind(originSet, _this2)(value) : value;
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
          var boundFn = bind(handleGet, this);
          if (inited) return boundFn(value);
          value = bind(initializer, this)();
          inited = true;
          return boundFn(value);
        },
        set: function set(val) {
          var boundFn = bind(handleSet, this);
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
          return bind(handleGet, this)(_value);
        },
        set: function set(val) {
          var boundFn = bind(handleSet, this);
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
    if (!isFunction(fns[i])) throw new TypeError('@before only accept function parameter');
  }
  return function (obj, prop, descriptor) {
    var _ref = descriptor || {},
        fn = _ref.value,
        configurable = _ref.configurable,
        enumerable = _ref.enumerable,
        writable = _ref.writable;

    if (!isFunction(fn)) throw new TypeError('@before can only be used on function, please check the property "' + prop + '" is a method or not.');
    var handler = function handler() {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var paras = fns.reduce(function (paras, fn) {
        var result = bind(fn, _this).apply(undefined, toConsumableArray$1(paras));
        return result === undefined ? paras : isArray(result) ? result
        // $FlowFixMe: what the hell, it can be anything
        : [result];
      }, args);
      return bind(fn, this).apply(undefined, toConsumableArray$1(paras));
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

    if (!isFunction(value)) throw new TypeError('@after can only be used on function, please checkout your property "' + prop + '" is a method or not.');
    var handler = function handler() {
      var ret = bind(value, this).apply(undefined, arguments);
      return bind(fn, this)(ret);
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
    warn('You are using @readonly on an undefined property "' + prop + '". This property will become a readonly undefined forever, which is meaningless.');
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
        value: bind(fn, obj)(),
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
          return bind(fn, this)(value);
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
        return bind(fn, this)(bind(initializer, this)());
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
    var value = bind(fn, this)(descriptor.value);
    return {
      value: value,
      // $FlowFixMe: useless disjoint union
      writable: descriptor.writable,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
  };
}

var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
var defineProperty$2 = Object.defineProperty;

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
  defineProperty$2(obj, key, {
    get: function get$$1() {
      return root[prop];
    },
    set: function set$$1(value) {
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
    if (isString(other)) {
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
  if (!isString(key)) throw new TypeError('@alias need a string as a key to find the porperty to set alias on');
  var illegalObjErrorMsg = 'If you want to use @alias to set alias on other instance, you must pass in a legal instance';
  if (other !== undefined && isPrimitive(other)) throw new TypeError(illegalObjErrorMsg);

  var _ref3 = isObject(option) ? option : { force: false, omit: false },
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
      var target = isPrimitive(other) ? obj : other;
      var keys = key.split('.');

      var _keys$slice = keys.slice(-1),
          _keys$slice2 = slicedToArray(_keys$slice, 1),
          name = _keys$slice2[0];

      target = getDeepProperty(target, keys.slice(0, -1), { throwError: true });
      if (isPrimitive(target)) {
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

var defineProperty$3 = Object.defineProperty;

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

    if (!isArray(exclude)) throw new TypeError('options.exclude must be an array');
    if (!isArray(include)) throw new TypeError('options.include must be an array');
    return function (Klass) {
      var isClass = isFunction(Klass);
      if (!self && !isClass) throw new TypeError('@' + decorator.name + 'Class can only be used on class');
      if (self && isPrimitive(Klass)) throw new TypeError('@' + decorator.name + 'Class must be used on non-primitive type value in \'self\' mode');
      var prototype = self ? Klass : Klass.prototype;
      if (isVoid(prototype)) throw new Error('The prototype of the ' + Klass.name + ' is empty, please check it');
      var descs = getOwnPropertyDescriptors(prototype);
      getOwnKeys(prototype).concat(include).forEach(function (key) {
        var desc = descs[key];
        if (key === 'constructor' && !construct || self && isClass && ['name', 'length', 'prototype'].indexOf(key) > -1 || exclude.indexOf(key) > -1 || isFunction(requirement) && requirement(prototype, key, desc, { self: self }) === false) return;
        defineProperty$3(prototype, key, (customArgs ? decorator.apply(undefined, toConsumableArray$1(args)) : decorator)(prototype, key, desc));
      });
    };
  };
}

var autobindClass = classify(autobind, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  }
});

var mapStore = void 0;
// save bound function for super
function getBoundSuper(obj, fn) {
  if (typeof WeakMap === 'undefined') {
    throw new Error('Using @autobind on ' + fn.name + '() requires WeakMap support due to its use of super.' + fn.name + '()');
  }

  if (!mapStore) {
    mapStore = new WeakMap();
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new WeakMap());
  }

  var superStore = mapStore.get(obj);
  // $FlowFixMe: already insure superStore is not undefined
  if (superStore.has(fn) === false) {
    // $FlowFixMe: already insure superStore is not undefined
    superStore.set(fn, bind(fn, obj));
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

  if (!isFunction(fn)) {
    throw new TypeError('@autobind can only be used on functions, not "' + fn + '" in ' + (typeof fn === 'undefined' ? 'undefined' : _typeof$1(fn)) + ' on property "' + prop + '"');
  }
  var constructor = obj.constructor;

  return {
    configurable: configurable,
    enumerable: false,
    get: function get$$1() {
      var _this = this;

      var boundFn = function boundFn() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return fn.call.apply(fn, [_this].concat(toConsumableArray$1(args)));
      };
      // Someone accesses the property directly on the prototype on which it is
      // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
      if (this === obj) {
        return fn;
      }
      // Someone accesses the property directly on a prototype,
      // but it was found up the chain, not defined directly on it
      // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
      if (this.constructor !== constructor && Object.getPrototypeOf(this).constructor === constructor) {
        return fn;
      }

      // Autobound method calling super.sameMethod() which is also autobound and so on.
      if (this.constructor !== constructor && prop in this.constructor.prototype) {
        return getBoundSuper(this, fn);
      }
      Object.defineProperty(this, prop, {
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

var defineProperty$4 = Object.defineProperty;
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
    warn('You are using @frozen on an undefined property. This property will become a frozen undefined forever, which is meaningless');
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
    if (!isFunction(_get)) {
      /* istanbul ignore else  */
      warn('You are using @frozen on one accessor descriptor without getter. This property will become a frozen undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      get: function get() {
        var value = bind(_get, this)();
        defineProperty$4(this, prop, {
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

var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
var defineProperty$5 = Object.defineProperty;

function waituntil(key) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      other = _ref.other;

  if (!isFunction(key) && !isPromise(key) && !isString(key)) throw new TypeError('@waitUntil only accept Function, Promise or String');
  return function (obj, prop, descriptor) {
    var _ref2 = descriptor || {},
        _value = _ref2.value,
        configurable = _ref2.configurable;

    if (!isFunction(_value)) throw new TypeError('@waituntil can only be used on function, but not ' + _value + ' on property "' + prop + '"');
    var binded = false;
    var waitingQueue = [];
    var canIRun = isPromise(key) ? function () {
      return key;
    } : isFunction(key) ? key : function () {
      // $FlowFixMe: We have use isPromise to exclude
      var keys = key.split('.');
      var prop = keys.slice(-1);
      var originTarget = isPrimitive(other) ? this : other;
      if (!binded) {
        var target = getDeepProperty(originTarget, keys.slice(0, -1));
        if (isVoid(target)) return target;
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
        defineProperty$5(target, prop, desc);
        binded = true;
      }
      return getDeepProperty(originTarget, keys);
    };
    return {
      value: function value() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var boundFn = bind(_value, this);
        var runnable = bind(canIRun, this).apply(undefined, args);
        if (isPromise(runnable)) {
          return Promise.resolve(runnable).then(function () {
            return bind(_value, _this).apply(undefined, args);
          });
        } else if (runnable === true) {
          return bind(_value, this).apply(undefined, args);
        } else {
          return new Promise(function (resolve) {
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

var defineProperty$6 = Object.defineProperty;

function lazyInit(obj, prop, descriptor) {
  if (descriptor === undefined) throw new TypeError('@lazyInit cannot be apply on undefined property.');
  if (!isFunction(descriptor.initializer)) {
    /* istanbul ignore else  */
    warn('@lazyInit can only be used on property, but not propery "' + prop + '" which may be methods or getter/setter.');
    // $FlowFixMe: disjoint union ****
    return descriptor;
  }
  var initializer = descriptor.initializer,
      configurable = descriptor.configurable,
      enumerable = descriptor.enumerable,
      writable = descriptor.writable;

  return {
    get: function get() {
      var value = bind(initializer, this)();
      defineProperty$6(this, prop, {
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

var defineProperty$7 = Object.defineProperty;
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
    warn('You are using @lock on an undefined property "' + prop + '". This property will become a lock undefined forever, which is meaningless.');
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
    if (!isFunction(_get)) {
      warn('You are using @lock on one accessor descriptor without getter. This property will become a lock undefined finally.Which maybe meaningless.');
      return;
    }
    return {
      get: function get() {
        var value = bind(_get, this)();
        defineProperty$7(this, prop, {
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

var defineProperty$8 = Object.defineProperty;
var getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;


function applyDecorators(Class, props) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$self = _ref.self,
      self = _ref$self === undefined ? false : _ref$self,
      _ref$omit = _ref.omit,
      omit = _ref$omit === undefined ? false : _ref$omit;

  var isPropsFunction = isFunction(props);
  if (isPropsFunction || isArray(props)) {
    // apply decorators on class
    if (!isFunction(Class)) throw new TypeError('If you want to decorator class, you must pass it a legal class');
    // $FlowFixMe: Terrible union, it's function now
    if (isPropsFunction) props(Class);else {
      // $FlowFixMe: Terrible union, it's array now
      for (var i = 0, len = props.length; i < len; i++) {
        // $FlowFixMe: Terrible union, it's array now
        var fn = props[i];
        if (!isFunction(fn)) throw new TypeError('If you want to decorate an class, you must pass it function or array of function');
        fn(Class);
      }
    }
    return Class;
  }
  if (!self && !isFunction(Class)) throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
  if (self && isPrimitive(Class)) throw new TypeError("We can't apply docorators on a primitive value, even in self mode");
  if (!isObject(props)) throw new TypeError('applyDecorators only accept object as second arguments');
  var prototype = self ? Class : Class.prototype;
  if (isVoid(prototype)) throw new Error('The class muse have a prototype, please take a check');
  for (var key in props) {
    var value = props[key];
    var decorators = isArray(value) ? value : [value];
    var handler = void 0;
    try {
      handler = compressMultipleDecorators.apply(undefined, toConsumableArray$1(decorators));
    } catch (err) {
      /* istanbul ignore else  */
      warn(err && err.message);
      throw new Error('The decorators set on props must be Function or Array of Function');
    }
    var descriptor = getOwnPropertyDescriptor$3(prototype, key);
    if (descriptor && !descriptor.configurable) {
      if (!omit) throw new Error(key + ' of ' + prototype + ' is unconfigurable');
      continue;
    }
    defineProperty$8(prototype, key, handler(prototype, key, descriptor));
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
    get: function get$$1(target, property, receiver) {
      var value = target[property];
      if (isArray(target) && arrayChangeMethod.indexOf(property) > -1) {
        return function () {
          arrayChanging = true;
          bind(value, receiver).apply(undefined, arguments);
          arrayChanging = false;
          hook();
        };
      }
      if (mapStore[property] === true) return value;
      if (isObject(value) || isArray(value)) {
        var _proxyValue = mapStore[property] || deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix });
        mapStore[property] = _proxyValue;
        return _proxyValue;
      }
      mapStore[property] = true;
      return value;
    },
    set: function set$$1(target, property, value) {
      var oldVal = target[property];
      var newVal = isObject(value) || isArray(value) ? deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix }) : value;
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
  var operateProps = (_operateProps = {}, defineProperty$1(_operateProps, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      // $FlowFixMe: we have check the computed value
      proxyValue[property] = val;
    };
  }), nonenumerable]), defineProperty$1(_operateProps, operationPrefix + 'del', [initialize(function (method) {
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
        set: function set$$1(value) {
          oldVal = this[key];
          return value;
        }
      }), accessor({
        get: function get$$1(val) {
          if (mapStore[key]) return val;
          if (isObject(val) || isArray(val)) {
            deepObserve(val, hook, { operationPrefix: operationPrefix, diff: diff });
          }
          mapStore[key] = true;
          return val;
        },
        set: function set$$1(val) {
          if (isObject(val) || isArray(val)) deepObserve(val, hook, { operationPrefix: operationPrefix, diff: diff });
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
  if (isArray(value)) {
    var methodProps = arrayChangeMethod.reduce(function (props, key) {
      props[key] = [initialize(function (method) {
        method = isFunction(method) ? method
        // $FlowFixMe: we have check the key
        : Array.prototype[key];
        return function () {
          var originLength = value.length;
          arrayChanging = true;
          bind(method, value).apply(undefined, arguments);
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
  var operateProps = (_operateProps2 = {}, defineProperty$1(_operateProps2, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          disable = _ref3.disable,
          isNewVal = _ref3.isNewVal;

      isNewVal = isNewVal || getOwnKeys(value).indexOf(property) === -1;
      if (isFunction(method)) {
        bind(method, _this)(property, val, { disable: true, isNewVal: isNewVal });
      }
      if (isNewVal) {
        var _props2 = getPropertyDecorators([property]);
        applyDecorators(value, _props2, { self: true, omit: true });
      }
      if (!disable) {
        value[property] = val;
      }
    };
  }), nonenumerable]), defineProperty$1(_operateProps2, operationPrefix + 'del', [initialize(function (method) {
    return function (property) {
      if (isFunction(method)) {
        bind(method, _this)(property);
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

  var option = isObject(args[args.length - 1]) ? args[args.length - 1] : {};
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
    warn('You browser do not support Proxy, we will fall back into observe mode.');
  }
  if (!args.length) throw new TypeError('You must pass a function or a string to find the hanlder function.');
  if (other !== undefined && isPrimitive(other)) throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
  if (!isString(operationPrefix)) throw new TypeError('operationPrefix must be an string');
  return function (obj, prop, descriptor) {
    var fns = args.reduce(function (fns, keyOrFn, index) {
      if (!isString(keyOrFn) && !isFunction(keyOrFn)) {
        if (!index || index !== args.length - 1) throw new TypeError('You can only pass function or string as handler');
        return fns;
      }
      fns.push(isString(keyOrFn) ? function (newVal, oldVal) {
        var target = other || obj;
        // $FlowFixMe: we have ensure it must be a string
        var fn = getDeepProperty(target, keyOrFn);
        if (!isFunction(fn)) {
          if (!omit) throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
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
    var oldVal = void 0;
    var newVal = void 0;
    var proxyValue = void 0;
    return compressMultipleDecorators(accessor({
      set: function set$$1(value) {
        var _this3 = this;

        oldVal = this[prop];
        proxyValue = undefined;
        var hook = function hook() {
          return bind(handler, _this3)(newVal, oldVal);
        };
        return deep && (isObject(value) || isArray(value)) ? proxy ? deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix }) : deepObserve(value, hook, { operationPrefix: operationPrefix, diff: diff }) : value;
      },
      get: function get$$1(value) {
        var _this4 = this;

        if (proxyValue) return proxyValue;
        if (!inited) {
          inited = true;
          var hook = function hook() {
            return bind(handler, _this4)(newVal, oldVal);
          };
          if (deep && (isObject(value) || isArray(value))) {
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
      set: function set$$1(value) {
        newVal = value;
        if (!diff || oldVal !== value) bind(handler, this)(newVal, oldVal);
        oldVal = value;
        return value;
      }
    }, { preSet: false }))(obj, prop, descriptor);
  };
}

var preventExtensions = Object.preventExtensions;

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

  if (!isFunction(key) && !isString(key)) throw new TypeError('@runnable only accept Function or String');
  return function (obj, prop, descriptor) {
    var _ref2 = descriptor || {},
        _value = _ref2.value,
        configurable = _ref2.configurable;

    if (!isFunction(_value)) throw new TypeError('@runnable can only be used on method, but not ' + _value + ' on property "' + prop + '".');
    var canIRun = isFunction(key) ? key : function () {
      var keys = key.split('.');
      var originTarget = isPrimitive(other) ? this : other;
      return getDeepProperty(originTarget, keys);
    };
    backup = isFunction(backup) ? backup : function () {};
    return {
      value: function value() {
        if (bind(canIRun, this).apply(undefined, arguments) === true) {
          return bind(_value, this).apply(undefined, arguments);
        } else {
          // $FlowFixMe: I have reassign it when it's not a function
          return bind(backup, this).apply(undefined, arguments);
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

  var defaultValue = isString(args[0]) ? args.shift() : '';
  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function boolean() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isBoolean(args[0]) ? args.shift() : false;
  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function array() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isArray(args[0]) ? args.shift() : [];
  args.unshift(function (value) {
    return isArray(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function number() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isNumber(args[0]) ? args.shift() : 0;
  args.unshift(function (value) {
    return isNumber(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function string$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isString(args[0]) ? args.shift() : '';
  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function boolean$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isBoolean(args[0]) ? args.shift() : false;
  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function array$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isArray(args[0]) ? args.shift() : [];
  args.unshift(function (value) {
    return isArray(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function number$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isNumber(args[0]) ? args.shift() : 0;
  args.unshift(function (value) {
    return isNumber(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

var before$1 = classify(before, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  },

  customArgs: true
});

var after$1 = classify(after, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  },

  customArgs: true
});

var runnable$1 = classify(runnable, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  },

  customArgs: true
});

var waituntil$1 = classify(waituntil, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
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

Object.defineProperty(exports, '__esModule', { value: true });

})));
