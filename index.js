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
      while (true) {
        let token = oldnext.call(this);
        if (token == undefined || !this.ignore.has(token.type)) {
          return token;
        }
      }
    } catch (e) {
        console.error("Eh!\n" + e)
    }
  };
  return lexer;
}

module.exports = {makeLexer, moo};
