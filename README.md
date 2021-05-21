Moo-ignore
====

Moo-ignore is a wrapper around the [moo](https://www.npmjs.com/package/moo) tokenizer/lexer generator that provides a [nearley.js](https://github.com/hardmath123/nearley)compatible lexer with the capacity to ignore specified tokens.


Usage
-----

Install it: 

```
$ npm install moo-ignore
``` 

Then you can use it in your Nearley.js program and ignore white spaces and comments:


```js
@{%
const tokens = require("./tokens");
const { makeLexer } = require("moo-ignore");
let lexer = makeLexer(tokens);
lexer.ignore("ws");
%}

@lexer lexer

S -> Function  

Function -> FUN  LP NameList  RP StList END  

NameList -> name  
    | NameList COMMA  name 

StList -> Statement   
    | StList SEMICOLON Statement 

Statement -> null  
     | DO StList  END 

# Lexical part

name  ->      %identifier {% id %}
COMMA ->       ","        {% id %}
LP    ->       "("        {% id %}
RP    ->       ")"        {% id %}
END   ->      %end        {% id %}
DO    ->      %dolua      {% id %}
FUN   ->      %fun        {% id %}
SEMICOLON ->  ";"         {% id %}
```

Here is the contents of the file `tokens.js` we have used in the former code:

```js
const moo = require("moo");

module.exports = {
    ws: { match: /\s+|#[^\n]*/, lineBreaks: true },
    eq: "==",
    lparan: "(",
    rparan: ")",
    comma: ",",
    lbracket: "[",

    semicolon: ";",

    identifier: {
        match: /[a-z_][a-z_0-9]*/,
        type: moo.keywords({
            fun: "fun",
            proc: "proc",
            while: "while",
            for: "for",
            else: "else",
            return: "return",
            and: "and",
            or: "or",
            true: "true",
            false: "false",
            end: "end",
            dolua: "do"
        })
    }
}
```

Here is a program `test.js` to use the grammar and lexer:

```js
const nearley = require("nearley");
const grammar = require("./test-grammar.js");
const { lexer } = require('moo-ignore');
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
```

To execute it:

```
$ npx nearleyc test/test-grammar.ne -o test/test-grammar.js
$ node test/test.js"
```

When you reach the end of Moo's internal buffer, next() will return `undefined`. You can always `reset()` it and feed it more data when that happens.

