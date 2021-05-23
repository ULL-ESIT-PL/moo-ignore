const expect = require("chai").expect;

const nearley = require("nearley");
const grammar = require("./test-grammar.js");
const grammar2args = require("./test-grammar-2-args.js");
const grammarCombined = require("./test-grammar-combined.js");

const util = require('util');
const ins = obj => console.log(util.inspect(obj, { depth: null }));

describe("Testing moo-ignore", function () {
  it('test-grammar lexer.ignore("ws", "comment");', function (done) {
    let s = `
fun (id, idtwo, idthree)  
  do   #hello
    do end;
    do end # another comment
  end 
end`;
    let ans;
    try {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      // Parse something!
        parser.feed(s);
        expect(parser.results[0]).deep.equal([
          'fun',        'lp',
          'identifier', 'comma',
          'identifier', 'comma',
          'identifier', 'rp',
          'dolua',      'dolua',
          'end',        'semicolon',
          'dolua',      'end',
          'end',        'end'
        ]);
        done();
    } catch (e) {
        console.log(e);
    }
  });

  it('test-grammar lexer = makeLexer(tokens, ["ws", "comment"])', function (done) {
    let s = `
fun (id, idtwo, idthree)  
  do   #hello
    do end;
    do end # another comment
  end 
end`;
    let ans;
    try {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar2args));
      // Parse something!
        parser.feed(s);
        expect(parser.results[0]).deep.equal([
          'fun',        'lp',
          'identifier', 'comma',
          'identifier', 'comma',
          'identifier', 'rp',
          'dolua',      'dolua',
          'end',        'semicolon',
          'dolua',      'end',
          'end',        'end'
        ]);
        done();
    } catch (e) {
        console.log(e);
    }
  });

  it('test-grammar lexer = makeLexer(tokens, ["ws"]); lexer.ignore("comment");', function (done) {
    let s = `
fun (id, idtwo, idthree)  
  do   #hello
    do end;
    do end # another comment
  end 
end`;
    let ans;
    try {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammarCombined));
      // Parse something!
        parser.feed(s);
        expect(parser.results[0]).deep.equal([
          'fun',        'lp',
          'identifier', 'comma',
          'identifier', 'comma',
          'identifier', 'rp',
          'dolua',      'dolua',
          'end',        'semicolon',
          'dolua',      'end',
          'end',        'end'
        ]);
        done();
    } catch (e) {
        console.log(e);
    }
  });

});

