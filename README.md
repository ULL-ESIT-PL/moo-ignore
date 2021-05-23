[![npm version](https://badge.fury.io/js/moo-ignore.svg)](https://badge.fury.io/js/moo-ignore)
[![Test](https://github.com/ULL-ESIT-PL/moo-ignore/actions/workflows/node.yml/badge.svg?branch=main)](https://github.com/ULL-ESIT-PL/moo-ignore/actions/workflows/node.yml)

# Moo-ignore

Moo-ignore (🐄) is a wrapper around the [moo](https://www.npmjs.com/package/moo) tokenizer/lexer generator that provides a [nearley.js](https://github.com/hardmath123/nearley) compatible lexer with the capacity to ignore specified tokens.

Moo-ignore is a wrapper around the moo tokenizer/lexer generator that provides a nearley.js compatible lexer with the capacity to ignore specified tokens.

## Usage

Install it: 

```
$ npm install moo-ignore
``` 

### Ignoring tokens

Then you can use it in your Nearley.js program and ignore some tokens like white spaces and comments:


```js
@{%
const tokens = require("./tokens");
const { makeLexer } = require("../index.js");

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

Alternatively, you can set to ignore some tokens in the call to `makeLexer`:

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
