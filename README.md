# apidoc-plugin-ts

[![Build Status](https://travis-ci.org/tgreyuk/apidoc-plugin-ts.svg?branch=master)](https://travis-ci.org/tgreyuk/apidoc-plugin-ts)
[![npm](https://img.shields.io/npm/v/apidoc-plugin-ts.svg)](https://www.npmjs.com/package/apidoc-plugin-ts)
[![Greenkeeper badge](https://badges.greenkeeper.io/tgreyuk/apidoc-plugin-ts.svg)](https://greenkeeper.io/)

A plugin for [apidoc](https://www.npmjs.com/package/apidoc) that injects @apiSuccess params from TypeScript interfaces.
Supports extended and nested interfaces.

## Getting started

```javascript
npm install --save-dev apidoc apidoc-plugin-ts
```

A custom api-doc param "@apiInterface" is the exposed:

```javascript
@apiInterface (optional path) {INTERFACE_NAME}
 ```

## Example

Given the following interface:

```javascript
filename: ./employers.ts

export interface Employer {
  /**
   * Employer job title
   */
  jobTitle: string;
  /**
   * Employer personal details
   */
  personalDetails: {
    name: string;
    age: number;
  }
}
```

and the following custom param:

```javascript
/**
 * @apiInterface (./employers.ts) {Person}
 */

 ```

 under the hood this would transpile to:

```javascript
 @apiSuccess {String} jobTitle Job title
 @apiSuccess {Object} personalDetails Empoyer personal details
 @apiSuccess {String} personalDetails.name 
 @apiSuccess {Number} personalDetails.age 
```

 *Note if the Person interface is defined in the same file then drop the path:*

```javascript
 @apiInterface {Person}
  ```
