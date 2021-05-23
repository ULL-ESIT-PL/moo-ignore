# Moo-ignore

Moo-ignore (🐄) is a wrapper around the [moo](https://www.npmjs.com/package/moo) tokenizer/lexer generator that provides a [nearley.js](https://github.com/hardmath123/nearley) compatible lexer with the capacity to ignore specified tokens.


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

// Alternatively, you can set to ignore some tokens in the call to `makeLexer`:
// let lexer = makeLexer(tokens, ["ws", "comment"]);
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


Here is the contents of the file `tokens.js` we have used in the former code:

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

See the [tests](https://github.com/ULL-ESIT-PL/moo-ignore/tree/main/test) for more examples of use.
