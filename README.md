# toxic-decorators

[![Build Status](https://img.shields.io/travis/toxic-johann/toxic-decorators/master.svg?style=flat-square)](https://travis-ci.org/toxic-johann/toxic-decorators.svg?branch=master)
[![Coverage Status](https://img.shields.io/coveralls/toxic-johann/toxic-decorators/master.svg?style=flat-square)](https://coveralls.io/github/toxic-johann/toxic-decorators?branch=master)
[![npm](https://img.shields.io/npm/v/toxic-decorators.svg?colorB=brightgreen&style=flat-square)](https://www.npmjs.com/package/toxic-decorators)
[![devDependency Status](https://david-dm.org/toxic-johann/toxic-decorators.svg)](https://david-dm.org/toxic-johann/toxic-decorators)



> Inspired by [core-decorators written by jayphelps](https://github.com/jayphelps/core-decorators.js). I think decorators will one powerful util for developer. So I create some function I want to use.

Library of [JavaScript stage-0 decorators](https://github.com/wycats/javascript-decorators) (aka ES2016/ES7 decorators [but that's not accurate](https://medium.com/@jayphelps/please-stop-referring-to-proposed-javascript-features-as-es7-cad29f9dcc4b)) include methods like @autobind, @waituntil, @alias etc. It's mainly focus on some useful methods to help us create javascript application.

If you have any idea of function you want. Please tell me or help me.

## state of decoratos

>Most of the paragraph below  is mainly quoted from  [core-decorators written by jayhelps](https://github.com/jayphelps/core-decorators.js).
>
>These are stage-0 decorators because while [the decorators spec has changed](http://tc39.github.io/proposal-decorators/) and is now stage-2, no transpiler has yet to implement these changes and until they do, this library won't either. Although the [TypeScript documentation](http://www.typescriptlang.org/docs/handbook/decorators.html)uses the phrase "Decorators are a stage 2 proposal for JavaScript" this is misleading because TypeScript still only implements the **stage-0** version of the spec, which is very incompatible with stage-2 (as of this writing). Though we have [babel-plugin-transform-decorators-stage-2-initial](https://github.com/jkrems/babel-plugin-transform-decorators-stage-2-initial) to translate stage-2 version of decorators. But the author do not encourage us to use it.
>
>So I think we will support stage-2 when we have mature compiler.

## Get start

**npm**

A version compiled to ES5 in CJS format is published to npm as [toxic-decorators](https://www.npmjs.com/package/toxic-decorators).

If you want to use it in Node.js.

```sh
npm install --save toxic-decorators
```

If you want to use it in the front-end project, I encourage you to use:

```sh
npm install --save-dev toxic-decorators
```

**just get the code**

You can get the compiled code in the `lib` file

* `lib/toxic-decorators.js`  cjs version, require babel-runtime
* `lib/toxic-decorators.mjs`  es version, which face to js:next require babel-runtime
* `lib/toxic-decorators.browser.js`  umd version, which you can use in the browser, but maybe you will need to add babel-polyfill in some situation.
* `lib/toxic-decorators.min.js` minify version based on umd version.

## Decorators

**For Properties a Methods**

* [@accessor](#accessor)
* [@alias](#alias)
* [@enumerable](#enumerable)
* [@initialize](#initialize)
* [@nonconfigurable](#nonconfigurable)
* [@configurable](#configurable)
* [@readonly](#readonly)
* [@frozen](@frozen)

**For Properties**

* [@initString](#initString)
* [@initNumber](#initNumber)
* [@initArray](#initArray)
* [@initBoolean](#initBoolean)
* [@alwaysString](#alwaysString)
* [@alwaysNumber](#alwaysNumber)
* [@alwaysArray](#alwaysArray)
* [@alwaysBoolean](#alwaysBoolean)

**For Methods**

* [@autobind](#autobind)
* [@before](#before)
* [@waituntil](#waituntil)

**For Classes**

* [@autobind](#autobind)
* [@autobindClass](#autobindClass)

## Helpers

* [applyDecorators()](#applyDecorators)

## Docs

### @accessor

Set getter/setter hook on any properties or methods. In fact, it will change all kind of descriptors into an accessor descriptor.

**arguments**

* **handler**: `Object`
  * get: `Function | Array<Function>`
  * set: `Function | Array<Function>`

```javascript
import {accessor} from 'toxic-decorators';

class Foo {
  @accessor({
    get (value) {
      // must return value here
      return ++value;
    },
    set (value) {
      return ++value
    }
  })
  bar = 1;
}

console.log(foo.bar); // 2
foo.bar = 3;
console.log(foo.bar); // 5
```

### @alias

Help you to set alias for properties  on any instance or for methods on any class.

**arguments**

* **name**: `string` the alias name
* **other**: `non-primitive` the other instance you want set alias on

```javascript
import {alias} from 'toxic-decorators';

class Cat {};
const cat = new Cat();
class Dog {
  @alias('run')
  @alias('run', Cat.prototype)
  @alias('move', cat)
  move() {
    console.log('it moved');
  }
  @alias('old')
  @alias('age', cat)
  age = 1;
}
const dog = new Dog();
const antoherCat = new Cat();
dog.move(); // it moved
dog.run(); // it moved
cat.run(); // it moved
anotherCat.run(); // it moved
cat.move(); // it moved
console.log(anotherCat.move === undefined); // true
console.log(cat.age); // 1
console.log(dog.old); // 1
```

> You can also set alias on getter/setter too.
>
> But there's one problem is we will set the alias until the origin one has been initialized.
>
> It means that you must get access to your origin property before you get access to your alias property, otherwise the alias one will be undefined.

### @nonconfigurable

Makes a porperty or method so that they cannot be deleted. Also accroding to the specification, it can prevent them from editing via `Object.defineProperty`. But it doesn't work quiet well. In that situation,  [@readonly](#readonly) may be a better choice.

**arguments** none.

```javascript
import {nonconfigurable} from 'toxic-decorators';

class Foo {
  @nonconfigurable
  bar = 1;
}
delete foo.bar; // Cannot delete property 'bar' of #<Foo>"
```

### @enumerable

Marks a property or method as being enumerable. As we know, property is enumerable by default.

**arguments** none.

```javascript
import {enumerable} from 'toxic-decoarators';

class Foo {
  @enumerable
  bar () {}
  car () {}
}

const foo = new Foo();
for (const key in foo) console.log(key);
// bar
```

### @nonenumerable

Marks a property as not being enumerable. Note that methods aren't enumerable by default.

**arguments** none.

```javascript
import {nonenumerable} from 'toxic-decorators';

class Foo {
  @nonenumerable
  a = 1;
  b = 2;
}

const foo = new Foo();
for (const key in foo) console.log(key); // b
```

### @initialize

Help you to do something when you initialize your property or function.

**arguments** 

* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```javascript
import {initialize} from 'toxic-decorators';

class Foo {
  @initialize(function (value) {
    return ++value;
  })
  bar = 1;
};
const foo = new Foo();
console.log(foo.bar); // 2;
foo.bar = 3;
console.log(foo.bar); // 3
```

> You can use this on getter/setter, too. Once you use that, we will always run the initialze function that until you set the value again.

### @readonly

You cannot write the porperty again.

**arguments** none

```javascript
import { readonly } from 'toxic-decorators';

class Meal {
  @readonly
  entree = 'steak';
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot assign to read only property 'entree' of [object Object]
```

You can also use readonly on getter/setter, but there is something you should pay attention.

We have just remove the setter here. But you getter stillreturn the origin value. You can change the origin value.

```javascript
import { readonly } from 'toxic-decorators';

let dish = 'steak'

class Meal {
  @readonly
  get entree () {return dish};
  set entree (value) {
    dish = value;
    return dish
  }
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot set property dinner of #<Meal> which has only a getter
dish = 'salmon';
console.log(dinner.entree); // 'salmon'
```

### @frozen

We will totally freeze the property. It can not be rewrite, delete or iterate.

**arguments** none

```javascript
import { frozen } from 'toxic-decorators';

class Meal {
  @frozen
  entree = 'steak';
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot assign to read only property 'entree' of [object Object]
delete dinner.entree;
// Cannot delete property 'entree' of #<Meal>"
```

You can also set the getter/setter property frozen. In this way, it's value could change once it's settle down.

```javascript
import { frozen } from 'toxic-decorators';

let dish = 'steak'

class Meal {
  @frozen
  get entree () {return dish};
  set entree (value) {
    dish = value;
    return dish
  }
}

const dinner = new Meal();
dinner.entree = 'salmon';
// Cannot set property dinner of #<Meal> which has only a getter
dish = 'salmon';
console.log(dinner.entree); // 'steak'
```

> Note: Escpecially on property, Once you set frozen, it can't be change, even with decorators. So you may better put it on the top.

### @initString

Ensure a property's initial value must be string. You can also pass another function as you want. It's just a grammar sugar for [@initialize](#initialize).

**arguments** 

* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```Javascript
import {initString} from 'toxic-decorators';

const info = {
  name: 'Kobe Bryant',
  champions: 5
};
class Intro {
  @initString(value => value.toLowerCase())
  name = info.name
  @initString(value => value.toLowerCase())
  champions = info.champions
}
const intro = new Intro();
console.log(intro.name); // kobe bryant
console.log(intro.champions); // ''
```

### @initNumber

Ensure a property's initial value must be number. You can see the detial in [@intiString](#initString)

### @initBoolean

Ensure a property's initial value must be boolean. You can see the detial in [@intiString](#initString)

### @initArray

Ensure a property's initial value must be Array. You can see the detial in [@intiString](#initString).

### @alwaysString

Ensure the property's value always be string. We change the property into getter/setter to implement this. It's a grammar sugar for [@accessor](#accessor).

**arguments** 

* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```Javascript
import {initString} from 'toxic-decorators';

class Intro {
  @initString(value => value.toLowerCase())
  name = 'BEN'
}
const intro = new Intro();
console.log(intro.name); // ben
intro.name = 'JONES';
console.log(intro.name); // jones
```

### @alwaysNumber

Ensure the property's value always be number. You can see the detail in [@alwaysString](#alwaysString)

### @alwaysBoolean

Ensure the property's value always be boolean. You can see the detail in [@alwaysString](#alwaysString)

### @alwaysArray

Ensure the property's value always be Array. You can see the detail in [@alwaysString](#alwaysString)

### @autobind

Forces invocation of this function to always have `this` refet to the class instance, even if the class  is passed around or would otherwise lose its `this`. e.g. `const fn = context.method`.

You can use it on the methods.

**arguments** none.

```javascript
import { autobind } from 'toxic-decorators';

class Person {
  @autobind
  getPerson() {
  	return this;
  }
}

const person = new Person();
const { getPerson } = person;

getPerson() === person;
// true
```

 You can use it on entire class, it will bind all methods of the class.

```Javascript
import { autobind } from 'toxic-decorators';

@autobind
class Person {
  getPerson() {
    return this;
  }

  getPersonAgain() {
    return this;
  }
}

const person = new Person();
const { getPerson, getPersonAgain } = person;

getPerson() === person;
// true

getPersonAgain() === person;
// true
```

Well, sometime we have lots of methods of class to bind, but not all of them. So we maybe need to exclude some of them. In this situation, you can use [@autobindClass](#autobindClass).

### @before

You can add your preprocessor here on your methods.Mostly, we will use this to do some arguments check.

**arguments** 

* **fn1** `Function` the handler
* **fn2** `Function` the handler
* … and so on

```javascript
import {before} from 'toxic-decorators';

class Foo {
  @before(function (a, b) {
    if(typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('only accept number');
    }
    // return the arguments in array
    return [a, b];
  })
  sum (a, b) {
    return a + b;
  }
}
const foo = new Foo();
foo.sum(1, 3); // 4
foo.sum('1', 3); // only accept number
```

### @waituntil

In some situation, our application is not ready. But others can call our function. We hope that they can wait for us. This decorators can let your function do not run until the flag is true

**arguments**

* **handler** `Function | Promise<*> | string`
  * `Function` will tell us can we call the function
    * `return promise` , we will wait until resolved
    * `return true`, we will run immediately
    * `return false`, we would not run it.
    * when you return promise, your function will become an **asynchronous** function.
    * when you return false, your call will be throw away and **never run**.
  * `Promise<*>`, we will wait until resolved.
    *  your function will become an **asynchronous** function.
  * `string` **recommend**
    * we will get the property and spy on it according to the string.
    * if the property do not equal to true when the function is called, we will put the function into waiting queue.
    * once the property become true, we will run the function in the waiting queue
    * if the property is true when the function is called, we will run the function immediately.
* **other** `non-primitive`
  * optional
  * only useful when handler is `string`
  * if it exist, we will look up the property on this instance
  * else, we will look up on the class itself

```Javascript
import {waituntil} from 'toxic-decorators';
let promiseResolve;
class Bar {
  flag = false;
}
const bar = new Bar();
class Foo {
  ready = new Promise(resolve => {promiseResolve = resolve});
  @waituntil(function () {return this.ready})
  runUntilPromise () {
    console.log('Promise is resolve!');
  }
  @waituntil(function () {return bar.flag});
  runUntilTrue () {
    console.log('flag is true!');
  }
  @waituntil('flag', bar);
  runUntilReady () {
    console.log('bar.flag is true!');
  }
}
const foo = new Foo();
foo.runUntilPromise();
foo.runUntilTrue();
foo.runUntilReady();
bar.flag = true;
// bar.flag is true!
foo.runUntilTrue();
// flag is true!
promiseResolve();
setTimeout(async () => {
  // Promise is resolve!
  foo.runUntilPromise();
  await foo.ready;
  // Promise is resolve!
}, 0)
```

### @autobindClass

When you not pass options. [@autobindClass](#autobindClass) does totally the same as [@autobind](#autobind). 

**arguments**

* **options**: Object
  * exclude: Array
    * Defaults: []

```Javascript
import {autobindClass} from 'toxic-decorators';

@autobindClass({exclude: ['b']})
class Foo {
  a () {
    return this;
  }
  b () {
    return this;
  }
}

const foo = new Foo();
const {a, b} = foo;
a() === foo; // true
b() === foo; // false
```

### applyDecorators()

If you want to use decorators, you may need to use [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) to compile. What if you don't want to use that. You can use `applyDecorators`.

**arguments**

* **Class** the class you want to handle
* **props** `{[string]: Function | Array<Function>}` the props map and their handler
* **option**
  * **self** `boolean` 
    * `false` we will handle on the `Class.prototype`
    * `true` we will handle on the Class itself
    * default is false

```javascript
import {applyDecorators, before} from 'toxic-decorators';

class Person {
  run () {
    console.log('i am running');
  }
  walk () {
    console.log('i am walking');
  }
}

// Besides class, you can also use normal function like `function foo {}`
applyDecorators(Foo, {
  // you can add only one function
  walk: before(() => console.log('go')),
  run: [before(() => console.log('ready')), before(() => console.log('go'))]
});

const foo = new Foo();
foo.walk();
// go
// i am walking
foo.run();
// ready
// go
// i am running
```

In the way above, we can apply decorators on function's prototype. That's enough for methods. But what if we want to apply some property decorators.

You can act like above, but it will modify portotype's property. They make take effect on multiple instance, and it's works bad on some situation.

So, if you want to apply decorators on property, I advice you to pass in an instance in self mode.

```javascript
import {initialize, applyDecorators} from 'toxic-decorators';

class Foo {
  a = 1;
  b = 2;
};
const foo = new Foo();
console.log(foo.a); // 1
console.log(foo.b); // 2

applyDecorators(foo, {
  a: initialize(function () {return 2;}),
  b: initialize(function () {return 3;})
}, {self: true});

console.log(foo.a); // 2
console.log(foo.b); // 3
```

What's more, you can also use applyDecorators to decorate the whole class.

**arguments**

* **Class** the class you want us to handle
* **decorators** `Function | Array<Function>` handlers

```Javascript
import {autobindClass, applyDecoratos} from 'toxic-decorators';

class Foo {
  a () {
    return this;
  }
  b () {
    return this;
  }
}

applyDecorators(Foo, autobindClass({exclude: ['b']}))
const foo = new Foo();
const {a, b} = foo;
a() === foo; // true
b() === foo; // false
```



## Need lodash utilities as decorators?

> We have mostly the same idea with core-decorators. So I just quote this from it's README.

toxic-decorators aims to provide decorators that are fundamental to JavaScript itself--mostly things you could do with normal `Object.defineProperty` but not as easily when using ES2015 classes. Things like debouncing, throttling, and other more opinionated decorators are being phased out in favor of [lodash-decorators](https://www.npmjs.com/package/lodash-decorators) which wraps applicable lodash utilities as decorators. We don't want to duplicate the effort of lodash, which has years and years of robust testing and bugfixes.