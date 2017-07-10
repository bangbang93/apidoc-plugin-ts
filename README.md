# apidoc-plugin-ts

[![Build Status](https://travis-ci.org/tgreyuk/apidoc-plugin-ts.svg?branch=master)](https://travis-ci.org/tgreyuk/typedoc-plugin-markdown)
[![npm](https://img.shields.io/npm/v/apidoc-plugin-ts.svg)](https://www.npmjs.com/package/typedoc-plugin-markdown)
[![Greenkeeper badge](https://badges.greenkeeper.io/tgreyuk/apidoc-plugin-ts.svg)](https://greenkeeper.io/)

A plugin for [apidoc](https://www.npmjs.com/package/apidoc) that injects @apiSuccess properties from TypeScript interfaces.

## Getting started

```
npm install --save-dev apidoc apidoc-plugin-ts
```

### How to use

```
@apiInterface {INTERFACE_NAME}
 ```

 ## Example

 ```
export interface Employer {
  /**
   * The job title string
   */
  jobTitle: string;
  /**
   * The department string
   */
  department
  /**
   * The person object
   */
  person: Person;
}

export interface Person {
  /**
   * The name of the person
   */
  name: string;
  /**
   * The age of the person
   */
  age: number;
  /**
   * The persons Address
   */
  address: {
    /**
    * Address line 1
    */
    address_line_1: string;
    /**
    * Address postcode
    */
    postcode: string;
  }  
};

```

### Input

```
/**
 * @api {get} /user/:id Request Person
 * @apiName GetPerson
 * @apiGroup Person
 *
 * @apiParam {Number} id Person's unique ID.
 * @apiInterface {Person} apiSuccess
 */
 ```

 ### Output