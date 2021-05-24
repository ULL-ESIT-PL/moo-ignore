// @ts-check

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

  
    lexer = moo.compile(tokens);
    oldnext = lexer.next;
  
    lexer.ignore = function(...types) {
      if (this.ignoreSet) { // ignoreSet was built at construction time
        this.ignoreSet = new Set([...this.ignoreSet, ...types]); // union
      }
      else  this.ignoreSet = new Set(types); // build it now
    }
 
    lexer.next = function () {    
        while (true) {
          let token = oldnext.call(this);
          // moo oldnext iterator returns undefined when finished
          if (token == undefined || !this.ignoreSet.has(token.type)) {
            return token;
          } 
          //console.error("ignoring token "+token.type);
        }
    };
  
    if (ignoreTokens) {
      lexer.ignoreSet = new Set(ignoreTokens);
    }
    return lexer;
   
}

module.exports = {makeLexer, moo};
