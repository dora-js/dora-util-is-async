var homunculus = require('homunculus');

function isAsync(code) {
  var parser = homunculus.getParser('js');
  var ast = parser.parse(code);
  console.log(ast);
}

module.exports = isAsync;
