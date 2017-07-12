# apidoc-plugin-ts

[![Build Status](https://travis-ci.org/tgreyuk/apidoc-plugin-ts.svg?branch=master)](https://travis-ci.org/tgreyuk/typedoc-plugin-markdown)
[![npm](https://img.shields.io/npm/v/apidoc-plugin-ts.svg)](https://www.npmjs.com/package/typedoc-plugin-markdown)
[![Greenkeeper badge](https://badges.greenkeeper.io/tgreyuk/apidoc-plugin-ts.svg)](https://greenkeeper.io/)

A plugin for [apidoc](https://www.npmjs.com/package/apidoc) that injects @apiSuccess properties from TypeScript interfaces.
Supports extended and nested interfaces.

## Getting started

```
npm install --save-dev apidoc apidoc-plugin-ts
```

A custom api-doc param "@apiInterface" is the exposed:

```
@apiInterface (optional path) {INTERFACE_NAME}
 ```



 ### How to use

Given the following interface:

 ```
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

```
/**
 * @apiInterface (./employers.ts) {Person}
 */
 ```

 under the hood this would transpile to:

 ```
 @apiSuccess {String} jobTitle Job title
 @apiSuccess {Object} personalDetails Empoyer personal details
 @apiSuccess {String} personalDetails.name 
 @apiSuccess {Number} personalDetails.age 
```

 *Note if the Person interface is defined in the same file then drop the path:*

 ```
 @apiInterface {Person}
  ```
