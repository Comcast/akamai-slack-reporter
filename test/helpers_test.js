var helpers = require('../src/helpers'),
    assert = require('assert');

describe('helpers', function() {
  describe('#sortByKey', function() {
    it('sorts an array of objects by the key it specified', function() {
      var arr = [{
        name: 'c'
      },{
        name: 'z'
      },{
        name: 'a'
      }];

      assert.equal(helpers.sortByKey(arr, 'name')[0].name, 'a');
      assert.equal(helpers.sortByKey(arr, 'name')[1].name, 'c');
      assert.equal(helpers.sortByKey(arr, 'name')[2].name, 'z');
    });
  });
});
