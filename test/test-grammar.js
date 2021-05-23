// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const tokens = require("./tokens");
const { makeLexer } = require("../index.js");

let lexer = makeLexer(tokens);
lexer.ignore("ws", "comment");

const getType = ([t]) => t.type;
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "S", "symbols": ["FUN", "LP", "name", "COMMA", "name", "COMMA", "name", "RP", "DO", "DO", "END", "SEMICOLON", "DO", "END", "END", "END"]},
    {"name": "name", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": getType},
    {"name": "COMMA", "symbols": [{"literal":","}], "postprocess": getType},
    {"name": "LP", "symbols": [{"literal":"("}], "postprocess": getType},
    {"name": "RP", "symbols": [{"literal":")"}], "postprocess": getType},
    {"name": "END", "symbols": [(lexer.has("end") ? {type: "end"} : end)], "postprocess": getType},
    {"name": "DO", "symbols": [(lexer.has("dolua") ? {type: "dolua"} : dolua)], "postprocess": getType},
    {"name": "FUN", "symbols": [(lexer.has("fun") ? {type: "fun"} : fun)], "postprocess": getType},
    {"name": "SEMICOLON", "symbols": [{"literal":";"}], "postprocess": getType}
]
  , ParserStart: "S"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
