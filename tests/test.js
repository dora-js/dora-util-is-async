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
  it('[ custom', function() {
    var s =  'this["cb"]()';
    expect(isAsync(s, 'cb')).to.eql(true);
  });
  it('not call', function() {
    var s =  'this.callback';
    expect(isAsync(s)).to.eql(false);
  });
  it('[ not call', function() {
    var s =  'this["callback"]';
    expect(isAsync(s)).to.eql(false);
  });
});

describe('var', function() {
  it('global', function() {
    var s =  'var a = this;a.callback()';
    expect(isAsync(s)).to.eql(true);
  });
  it('custom', function() {
    var s =  'var a = this;a.cb()';
    expect(isAsync(s, 'cb')).to.eql(true);
  });
  it('[', function() {
    var s =  'var a = this;a["callback"]()';
    expect(isAsync(s)).to.eql(true);
  });
  it('[ custom', function() {
    var s =  'var a = this;a["cb"]()';
    expect(isAsync(s, 'cb')).to.eql(true);
  });
  it('not call', function() {
    var s =  'var a = this;a.callback';
    expect(isAsync(s)).to.eql(false);
  });
  it('[ not call', function() {
    var s =  'var a = this;a["callback"]';
    expect(isAsync(s)).to.eql(false);
  });
});

describe('in function', function() {
  it('normal', function() {
    var s =  'var a = this;function b(){a.callback()}';
    expect(isAsync(s)).to.eql(true);
  });
  it('custom', function() {
    var s =  'var a = this;function b(){a.cb()}';
    expect(isAsync(s, 'cb')).to.eql(true);
  });
  it('ignore this', function() {
    var s =  'function b(){this.callback()}';
    expect(isAsync(s)).to.eql(false);
  });
  it('[', function() {
    var s =  'var a = this;function b(){a["callback"]()}';
    expect(isAsync(s)).to.eql(true);
  });
  it('[ custom', function() {
    var s =  'var a = this;function b(){a["cb"]()}';
    expect(isAsync(s, 'cb')).to.eql(true);
  });
  it('[ ignore this', function() {
    var s =  'function b(){this["callback"]()}';
    expect(isAsync(s)).to.eql(false);
  });
});
