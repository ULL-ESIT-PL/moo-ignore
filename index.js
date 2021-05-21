const moo = require("moo");

// Static Method
function makeLexer(tokens) {
  let lexer; 
  let oldnext; 

  lexer = moo.compile(tokens);
  oldnext = lexer.next;

  lexer.ignore = function(...types) {
    this.ignore = new Set(types);
  }
  
  lexer.next = function () {
      try {
          let token = oldnext.call(this);
          if (token && this.ignore.has(token.type)) {
              token = oldnext.call(this);
          }
          return token;
      } catch (e) {
          console.error("Eh!\n" + e)
      }
  
  };
  return lexer;
}

module.exports = {makeLexer};
