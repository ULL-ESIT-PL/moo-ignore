const moo = require("moo");

// Static Method
/**
 * A function that provides a nearley.js compatible lexer 
 * @param {Iterable} tokens - The tokens specifying the lexer
 * @param {Iterable} ignoreTokens - List of tokens to ignore
 * @return {Function} The lexer for the specified tokens ignoring tokens in ignoreTokens
 * @throws Wherever moo throws
 */

function makeLexer(tokens, ignoreTokens) {
  let lexer; 
  let oldnext; 

  try {
    lexer = moo.compile(tokens);
    oldnext = lexer.next;
  
    lexer.ignore = function(...types) {
      if (this.ignoreSet) {
        this.ignoreSet = new Set([...this.ignoreSet, ...types]);
      }
      else  this.ignoreSet = new Set(types);
    }
    
    lexer.next = function () {
      try {
        while (true) {
          let token = oldnext.call(this);
          if (token == undefined || !this.ignoreSet.has(token.type)) {
            return token;
          } 
          //console.error("ignoring token "+token.type);
        }
      } catch (e) {
          console.error("Eh!\n" + e)
      }
    };
  
    if (ignoreTokens) {
      lexer.ignoreSet = new Set(ignoreTokens);
    }

    return lexer;
  } catch (e) {
    throw new Error(`Error in moo-ignore inside makeLexer:\n${e}`);
  }

}

module.exports = {makeLexer, moo};
