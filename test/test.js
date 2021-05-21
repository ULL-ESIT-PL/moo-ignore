const nearley = require("nearley");
const grammar = require("./test-grammar.js");
const util = require('util');
const ins = obj => console.log(util.inspect(obj, { depth: null }));

let s = `
fun (id, idtwo, idthree)  
  do  
    do end;
    do end
  end 
end`;
let ans;
try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
   // Parse something!
    parser.feed(s);
    ins(parser.results);
} catch (e) {
    console.log(e);
}

