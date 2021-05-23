const moo = require("moo");

// Static Method
function makeLexer(tokens, ignoreTokens) {
  let lexer; 
  let oldnext; 

  lexer = moo.compile(tokens);
  oldnext = lexer.next;

  lexer.ignore = function(...types) {
    this.ignore = new Set(types);
  }
  
  lexer.next = function () {
    try {
      while (true) {
        let token = oldnext.call(this);
        if (token == undefined || !this.ignore.has(token.type)) {
          return token;
        } 
        //console.error("ignoring token "+token.type);
      }
    } catch (e) {
        console.error("Eh!\n" + e)
    }
  };

  if (ignoreTokens) {
    lexer.ignore = new Set(ignoreTokens);
  }

  return lexer;
}

module.exports = {makeLexer, moo};
