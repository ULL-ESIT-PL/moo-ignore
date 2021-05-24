const nearley = require("nearley");
const grammar = require("./test-grammar-error-tokens.js");

let s = `
fun (id, idtwo, idthree)do #hello
    do end;
    do end # another comment
  end
end`;
try {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(s);
  console.log(parser.results[0]) /* [ 'fun', 'lp', 'identifier', 'comma',
          'identifier', 'comma', 'identifier', 'rp',
          'dolua',      'dolua', 'end', 'semicolon',
          'dolua',      'end', 'end', 'end' */
} catch (e) {
    console.log(e);
}