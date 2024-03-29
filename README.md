[![npm version](https://badge.fury.io/js/moo-ignore.svg)](https://badge.fury.io/js/moo-ignore)
[![Test](https://github.com/ULL-ESIT-PL/moo-ignore/actions/workflows/node.yml/badge.svg?branch=main)](https://github.com/ULL-ESIT-PL/moo-ignore/actions/workflows/node.yml)

# Moo-ignore

Moo-ignore (🐄) is a wrapper around the [moo](https://www.npmjs.com/package/moo) tokenizer/lexer generator that provides a [nearley.js](https://github.com/hardmath123/nearley) compatible lexer with the capacity to ignore specified tokens.


## Usage

Install it: 

```
$ npm install moo-ignore
``` 

## Exports

This module exports an object having the `makeLexer` constructor and the `moo` object (as in `const moo = require("moo")`):

```js
const { makeLexer, moo } = require("moo-ignore");
```

## Ignoring tokens

Then you can use it in your Nearley.js program and ignore some tokens like white spaces and comments:


```js
@{%
const tokens = require("./tokens");
const { makeLexer } = require("moo-ignore");

let lexer = makeLexer(tokens);
lexer.ignore("ws", "comment");

const getType = ([t]) => t.type;
%}

@lexer lexer

S -> FUN LP name COMMA name COMMA name RP 
      DO 
        DO  END SEMICOLON 
        DO END 
      END
     END

name  ->      %identifier {% getType %}
COMMA ->       ","        {% getType %}
LP    ->       "("        {% getType %}
RP    ->       ")"        {% getType %}
END   ->      %end        {% getType %}
DO    ->      %dolua      {% getType %}
FUN   ->      %fun        {% getType %}
SEMICOLON ->  ";"         {% getType %}
```

Alternatively, you can set to ignore some tokens at construction time in the call to `makeLexer`:

```js
let lexer = makeLexer(tokens, ["ws", "comment"]);
```

Or you can also combine both ways:

```js
let lexer = makeLexer(tokens, ["ws"]);
lexer.ignore("comment");
```

For sake of completeness, here is the contents of the file `tokens.js` we have used in the former code:

```js
const { moo } = require("moo-ignore");

module.exports = {
    ws: { match: /\s+/, lineBreaks: true },
    comment: /#[^\n]*/,
    lp: "(",
    rp: ")",
    comma: ",",
    semicolon: ";",
    identifier: {
        match: /[a-z_][a-z_0-9]*/,
        type: moo.keywords({
            fun: "fun",
            end: "end",
            dolua: "do"
        })
    }
}
```

See the [tests](https://github.com/ULL-ESIT-PL/moo-ignore/tree/main/test) folder in this distribution for more examples of use. Here is a program that tests the former example:

```js
const nearley = require("nearley");
const grammar = require("./test-grammar.js");

let s = `
fun (id, idtwo, idthree)  
  do   #hello
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
```

## The eof option: Emitting a token to signal the End Of File

The last  argument of `makeLexer` is an object with configuration options:

```js
let lexer = makeLexer(Tokens, [ tokens, to, ignore ], { options });
```


Currently, the only `option` supported in this version is `eof`. 

Remember that lexers generated by moo emit `undefined` when the end of the input is reached. This option changes this behavior.

If the option `{ eof : true }` is specified,  and a token with the name `EOF: "termination string"` appears in the tokens specification, `moo-ignore` will concat the `"termination string"`  at the end of the input stream. 

```js
const { makeLexer } = require("moo-ignore");
const Tokens = {
  EOF: "__EOF__",
  WHITES: { match: /\s+/, lineBreaks: true },
  /* etc. */
};

let lexer = makeLexer(Tokens, ["WHITES"], { eof: true });
```

The generated lexer will emit this `EOF` token when the end of the input is reached. 

Inside your grammar you'll have to explicit the use of the `EOF` token. Something like this:

```js
@{%
const { lexer } = require('./lex.js');
%}
@lexer lexer
program -> expression %EOF {% id %}
# ... other rules
```