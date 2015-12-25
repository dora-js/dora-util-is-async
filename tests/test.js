var isAsync = require('../index');
var expect = require('expect.js');

describe('normal', function() {
  it('global', function() {
    var s =  'this.callback()';
    expect(isAsync(s)).to.eql(true);
  });
  it('custom', function() {
    var s =  'this.cb()';
    expect(isAsync(s, 'cb')).to.eql(true);
  });
  it('[', function() {
    var s =  'this["callback"]()';
    expect(isAsync(s)).to.eql(true);
  });
});
