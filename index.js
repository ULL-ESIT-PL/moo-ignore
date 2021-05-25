// @ts-check

/**
 * moo-ignore module.
 * @module moo-ignore
 * @see module:moo
 */

const moo = require("moo");

/**
 * Has all the properties and methods of a moo lexer
 * @typedef {Function} MooLexer
 * @property {Set} moolexer.ignoreSet - Set of tokens to ignore
 * @property {Function} moolexer.ignore  - Method to add/set tokens to ignore
 */

/**
 * A function that provides a nearley.js compatible lexer 
 * @param {Array<Rules>} tokens - The Array of Moo rules specifying the lexer
 * @param {Array<String>} ignoreTokens - Array of Strings containing the token types to ignore
 * @returns {MooLexer} moolexer - The Moo lexer for the specified tokens ignoring tokens in ignoreTokens
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


/**
 * This module exports an object having the `makeLexer` constructor and the `moo` object (as in `const moo = require("moo")`):
 */

module.exports = {
  /**
   * The lexer constructor
   */
  makeLexer, 
  /**
   * The moo object (as built in `const moo = require("moo")`)
   */
  moo
};
