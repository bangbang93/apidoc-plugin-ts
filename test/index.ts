import { Employer } from './interfaces';

interface Shape {
    color: string;
    radius: number;
}

interface Square extends Shape {
    sideLength: number;
}

/**
 * @api {get} /api/:id
 * @apiParam {Number} id Unique ID.
 * @apiInterface {Square}
 * @apiGroup localInterfaceTest
 */
export function localInterfaceTest() {
  return false;
}

/**
 * @api {get} /api/:id
 * @apiParam {Number} id Unique ID.
 * @apiInterface (./test/interfaces.ts) { Employer }
 * @apiGroup importedInterfaceTest
 */
export function importedInterfaceTest() {
  return false;
}

/**
 * @api {get} /api/:id
 * @apiParam {Number} id Unique ID.
 * @apiInterface {X}
 * @apiGroup notFoundTest
 */
export function notFoundTest() {
  return false;
}
