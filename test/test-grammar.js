// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const tokens = require("./tokens");
const { makeLexer } = require("../index.js");

let lexer = makeLexer(tokens);
lexer.ignore("ws", "comment");
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "S", "symbols": ["Function"], "postprocess": d => true},
    {"name": "Function", "symbols": ["FUN", "LP", "NameList", "RP", "StList", "END"]},
    {"name": "NameList", "symbols": ["name"]},
    {"name": "NameList", "symbols": ["NameList", "COMMA", "name"]},
    {"name": "StList", "symbols": ["Statement"]},
    {"name": "StList", "symbols": ["StList", "SEMICOLON", "Statement"]},
    {"name": "Statement", "symbols": []},
    {"name": "Statement", "symbols": ["DO", "StList", "END"]},
    {"name": "name", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "COMMA", "symbols": [{"literal":","}]},
    {"name": "LP", "symbols": [{"literal":"("}]},
    {"name": "RP", "symbols": [{"literal":")"}]},
    {"name": "END", "symbols": [(lexer.has("end") ? {type: "end"} : end)]},
    {"name": "DO", "symbols": [(lexer.has("dolua") ? {type: "dolua"} : dolua)]},
    {"name": "FUN", "symbols": [(lexer.has("fun") ? {type: "fun"} : fun)]},
    {"name": "SEMICOLON", "symbols": [{"literal":";"}]}
]
  , ParserStart: "S"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
