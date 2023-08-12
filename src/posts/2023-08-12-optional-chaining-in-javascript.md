---
title: 'Optional Chaining in JavaScript'
description: "Optional chaining in JavaScript enables you to read property values from within a chain of connected objects without checking if each reference in it is valid. The optional chaining operator `?.` stops evaluation if any value before `?.` is null or undefined."
date: 2023-08-12
toc: true
postId: 7
tags:
  - typescript
  - optional chaining
  - javascript operators
  - node.js
  - technical
---

Optional chaining in JavaScript enables you to read property values from within a chain of connected objects without checking if each reference in it is valid. The optional chaining operator "?." stops evaluation if any value before "?." is null or undefined.

The following examples demonstrate how TypeScript type checking can benefit our variables and interfaces by specifying their types. If any properties can be undefined, we specify this in their types; otherwise optional chaining remains unchanged from JavaScript.

```typescript
interface Property {
    prop2?: {
        prop3?: string;
        prop4?: string;
    };
    prop5?: {
        prop3?: string;
    };
}

interface Obj {
    prop1?: Property;
}

const obj: Obj = {
    prop1: {
        prop2: {
            prop3: 'Hello, world!'
        }
    }
}

console.log(obj.prop1?.prop2?.prop3); // 'Hello, world!'
console.log(obj.prop1?.prop2?.prop4); // undefined
console.log(obj.prop1?.prop5?.prop3); // undefined
```

In this example, optional chaining saves us time by eliminating the need to verify whether `prop1` and `prop2` exist before trying to access `prop3`. Without optional chaining, any time one of them didn't exist we'd get a `TypeError` error instead.

## Optional chaining in numerous ways:

### 1. Object properties: `obj?.prop`

```typescript
interface User {
    address?: {
        street?: string;
    };
}

let user: User = {}; // an empty object

console.log( user?.address?.street ); // undefined (no error)
```

Here, `user?.address?.street` returns `undefined` since user is an empty object with no address property and thus no street is present.

### 2. Dynamic properties: `obj?.[expr]`

```typescript
interface User {
    firstName?: string;
    lastName?: string;
    [key: string]: any;
}

let user: User = { 
    firstName: "John",
    lastName: "Doe"
};

let key: string = "firstName";

console.log( user?.[key] ); // "John"
console.log( user?.["address"]?.["street"] ); // undefined (no error)
```

Here, `user?.[key]` dynamically accesses the `firstName` property of user object; while `user?.["address"]?.[street"]` attempts to access street property of address but returns `undefined` since address does not exist.

### 3. Function or method calls: `func?.(...)`

```typescript
interface User {
    foo?: Function;
}

let user: User = {
    foo() {
        console.log("I am foo");
    }
};

let guest: User = {};

user.foo?.(); // I am foo
guest.foo?.(); // nothing (no error)
```

In this example, `user.foo?.()` calls the function only if `foo` exists; otherwise (similarly with `guest.foo?.()`), nothing happens and there's no indication of an error message being returned.

### 4. Arrays and Optional Chaining

```typescript
let arr: (string | undefined)[] = ['a', 'b', 'c'];

console.log(arr[0]); // 'a'
console.log(arr[1]); // 'b'
console.log(arr[2]); // 'c'
console.log(arr[3]); // undefined
console.log(arr[4]?.toUpperCase()); // undefined
```

As `arr[4]` is `undefined`, we don't evaluate any other parts of the chain based on it; thus we avoid calling `toUpperCase()` on `undefined`, which would have resulted in a `TypeError` message. Instead, all expression evaluates to `undefined`.

Optional chaining can greatly simplify your code by eliminating the need to check that each part of a property chain exists before trying to use it.

## When shouldn't you use Optional Chaining?

Optional chaining can be an extremely useful feature, but there may be instances in which its use could produce unexpected outcomes or hide any underlying problems within your code. Here are a few scenarios when considering using optional chaining:

### 1. When you need to know whether an object is missing a property or its value is `undefined`:

optional chaining will return `undefined` if it can't locate or can't detect said property or its value is `undefined` - making this method unsuitable when trying to distinguish between these two scenarios.

### 2. When `null` or `undefined` values should generate errors

Optional chaining prevents errors from being generated when trying to access properties with `null` or `undefine` values, thus masking issues or errors used for bug-detection and potentially leading to unexpected behaviour in applications that rely on them for detection purposes.

### 3. When default values are required

To provide default values when properties don't exist, optional chaining and nullish coalescing operators `(??)` cannot be combined directly; you might end up providing default values even though properties exist but have falsy values such as `0`, `''`, or `false` as their values. For example:

```javascript
const obj = { prop: 0 };
console.log(obj?.prop ?? 'default'); // 'default', but we might expect 0
```

### 4. Overuse of optional chaining may result in silent failures:

Overusing optional chaining can result in silent failures that do not generate errors and make debugging more challenging, so one should use it cautiously and not abuse it just to avoid writing defensive code.

### 5. Performance

Although optional chaining usually has negligible performance implications for most applications, using it can sometimes be slower than traditional forms of checking property existence, such as using `&&`. Therefore, performance-critical code may benefit from considering alternative solutions before opting for optional chaining.

## Support for Optional Chaining

Optional chaining (?.) is part of the ECMAScript 2020 specification (commonly referred to as ES11).

### Browsers

Optional chaining is supported by all modern browsers. Refer to [Can I use](https://caniuse.com/?search=optional%20chaining) for detailed browser support.

### Node.js

Node.js version 14 onwards support optional chaining.

### TypeScript

Optional chaining was introduced in TypeScript 3.7.

### Babel

Babel can help you transpile optional chaining for wider compatibility by using `@babel/preset-env` or its respective plugin (`@babel/plugin-proposal-optional-chaining`). Doing this ensures your code can run in environments which don't support optional chaining natively.

## Conclusion

Note that while optional chaining can make your code shorter and simpler to read, it shouldn't replace proper error checking and handling practices. Optional chaining serves only to make specific tasks simpler but doesn't absolve you from ensuring your code is robust and handles errors properly.