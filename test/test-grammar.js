// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const tokens = require("./tokens");
const { makeLexer } = require("../index.js");
const util = require('util');
const ins = obj => console.log(util.inspect(obj, { depth: null }));

let lexer = makeLexer(tokens);
lexer.ignore("ws");

function makeWord(token) {
  const { text, line, offset, col, name } = token;
  //console.log(text); ins(token);
  return {type: 'word', name: (text || name)}; //, line: line, col: col, offset: offset};
}

function makeApply(operator, args, comment) { 
    let node = { 
        comment: comment? comment: '',
        type: "apply", 
        operator: makeWord(operator), 
        args: args,
        //line: operator.line,
        //col: operator.col,
    };
    return node;
}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "S", "symbols": ["Function"], "postprocess": id},
    {"name": "Function", "symbols": ["FUN", "LP", "NameList", "RP", "StList", "END"], "postprocess":  
        ([fun, lp, namelist, rp, stlist]) => {
           let doToken = { type:  "do", text: "do", /* line: fun.line, offset: fun.offset, col: fun.col */};
           return makeApply(fun, 
                            namelist.concat([makeApply(doToken, stlist, "the body of the function")]),
                            "the function")
          } 
                     },
    {"name": "NameList", "symbols": ["name"], "postprocess": d => [makeWord(d[0])]},
    {"name": "NameList", "symbols": ["NameList", "COMMA", "name"], "postprocess":  
        ([list, _, name ]) => { 
          // console.log(name.text);
           list.push(makeWord(name)); 
           return list
         } 
               },
    {"name": "StList", "symbols": ["Statement"], "postprocess": ([st]) => st? [ st ] : []},
    {"name": "StList", "symbols": ["StList", "SEMICOLON", "Statement"], "postprocess": ([list, _, st ]) => { if (st) list.push(st); return list }},
    {"name": "Statement", "symbols": [], "postprocess": d => null},
    {"name": "Statement", "symbols": ["DO", "StList", "END"], "postprocess":   ([dolua, stlist]) => { 
          //ins(dolua);
          return makeApply(makeWord(dolua), stlist, "Lua 'do' to Egg 'do'")
        } 
                },
    {"name": "name", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": id},
    {"name": "COMMA", "symbols": [{"literal":","}], "postprocess": id},
    {"name": "LP", "symbols": [{"literal":"("}], "postprocess": id},
    {"name": "RP", "symbols": [{"literal":")"}], "postprocess": id},
    {"name": "END", "symbols": [(lexer.has("end") ? {type: "end"} : end)], "postprocess": id},
    {"name": "DO", "symbols": [(lexer.has("dolua") ? {type: "dolua"} : dolua)], "postprocess": id},
    {"name": "FUN", "symbols": [(lexer.has("fun") ? {type: "fun"} : fun)], "postprocess": id},
    {"name": "SEMICOLON", "symbols": [{"literal":";"}], "postprocess": id}
]
  , ParserStart: "S"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
