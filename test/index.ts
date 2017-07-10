import {Employer} from './interfaces';

interface Params {
    /**
     * the id
     */
    id: number;
}

interface Props {
    /**
     * Name
     */
    name: string;
    /**
     * Position
     */
    position: string;
    /**
     * Height
     */
    height: number;
}

/**
 * @api {get} /user/:id
 * @apiGroup DefaultTest
 * @apiSuccess {Boolean} active        Specify if the account is active.
 * @apiSuccess {Object}  profile       User profile information.
 * @apiSuccess {Number}  profile.age   Users age.
 * @apiSuccess {String}  profile.image Avatar-Image.
 * @apiSuccess {String}  profile.image.width Avatar-Image width
 * @apiSuccess {String}  profile.image.height Avatar-Image height
 */
 export function test1(){
     return false;
 }

  /**
 * @api {get} /api/:id
 * @apiParam {Number} id Unique ID.
 * @apiInterface {Props} apiSuccess
 * @apiGroup LocalInterfaceTest
 */
 export function test2(){
     return false;
 }

/**
 * @api {get} /api/:id
 * @apiParam {Number} id Unique ID.
 * @apiInterface { Employer } apiSuccess
 * @apiGroup ImportedInterfaceTest
 */
 export function test3(){
     return false;
 }

 /**
 * @api {get} /api/:id
 * @apiParam {Number} id Unique ID.
 * @apiInterface {X} apiSuccess
 * @apiGroup NotFoundTest
 */
 export function test4(){
     return false;
 }
