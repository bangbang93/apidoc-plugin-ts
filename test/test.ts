import { expect } from 'chai';
import 'mocha';

/*tslint:disable*/
const fixtureJson = require('./fixture.json');
const outputJson = require('./out/api_data.json');
/*tslint:enable*/

describe('should compile', () => {

  it('should compile api data correctly', () => {
    expect(outputJson).to.deep.equal(fixtureJson);
  });

});
