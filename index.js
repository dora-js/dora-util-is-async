var homunculus = require('homunculus');
var Node = homunculus.getClass('Node', 'js');
var Token = homunculus.getClass('Token');

var res;
var flag;

function isAsync(code, f) {
  res = false;
  flag = f || 'callback';
  var parser = homunculus.getParser('js');
  var ast = parser.parse(code);
  parse(ast, {});
  return res;
}

function parse(ast, context) {
  preVar(ast, context);
  search(ast, context, true);
}

function preVar(ast, context) {
  if(ast.isToken()) {
    return;
  }
  switch(ast.name()) {
    case Node.FNDECL:
    case Node.FNEXPR:
      break;
    case Node.VARDECL:
      var id = ast.first().token().content();
      var assign = ast.leaf(1);
      if(assign.name() == Node.ASSIGN) {
        varThis(context, id, assign);
      }
      break;
    default:
      ast.leaves().forEach(function(leaf) {
        preVar(leaf, context);
      });
  }
}

function varThis(context, id, ast) {
  if(!ast) {
    return;
  }
  var assign = ast.leaf(1);
  switch(assign.name()) {
    case Node.PRMREXPR:
      var t = assign.first();
      if(t && t.isToken() && t.token().content() == 'this') {
        context[id] = true;
      }
      break;
    case Node.ASSIGNEXPR:
      varThis(context, id, assign.leaf(2));
      break;
  }
}

function search(ast, context, inGlobal) {
  if(ast.isToken()) {
    return;
  }
  switch(ast.name()) {
    case Node.CALLEXPR:
      var mmb = ast.first();
      var args = ast.leaf(1);
      if(mmb.name() == Node.MMBEXPR && args.name() == Node.ARGS) {
        var prmr = mmb.first();
        if(prmr.name() == Node.PRMREXPR) {
          var t = prmr.first();
          if(t && t.isToken()) {
            var id = t.token().content();
            if(id == 'this' && inGlobal
              || context.hasOwnProperty(id)
            ) {
              var dot = mmb.leaf(1);
              if(dot && dot.isToken()) {
                switch(dot.token().content()) {
                  case '.':
                    var name = mmb.leaf(2);
                    if(name && name.isToken() && name.token().content() == flag) {
                      return res = true;
                    }
                    break;
                  case '[':
                    prmr = mmb.leaf(2);
                    if(prmr && prmr.name() == Node.PRMREXPR) {
                      t = prmr.first();
                      if(t && t.isToken()) {
                        t = t.token();
                        if(t.type() == Token.STRING && t.val() == flag) {
                          return res = true;
                        }
                      }
                    }
                    break;
                }
              }
            }
          }
        }
      }
      break;
  }
  ast.leaves().forEach(function(leaf) {
    if(res) {
      return;
    }
    switch(ast.name()) {
      case Node.FNDECL:
      case Node.FNEXPR:
        inGlobal = false;
        break;
    }
    search(leaf, context, inGlobal);
  });
}

module.exports = isAsync;
