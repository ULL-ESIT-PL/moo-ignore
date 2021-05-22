# Moo-ignore

Moo-ignore (🐄) is a wrapper around the [moo](https://www.npmjs.com/package/moo) tokenizer/lexer generator that provides a [nearley.js](https://github.com/hardmath123/nearley) compatible lexer with the capacity to ignore specified tokens.


## Usage

Install it: 

```
$ npm install moo-ignore
``` 

### Ignoring tokens

Then you can use it in your Nearley.js program and ignore white spaces and comments:


```js
@{%
const tokens = require("./tokens");
const { makeLexer } = require("../index.js");

let lexer = makeLexer(tokens);
lexer.ignore("ws", "comment");
%}

@lexer lexer

S -> Function  {% d => true %}
Function -> FUN  LP NameList  RP StList END  
NameList -> name  
    | NameList COMMA  name 
StList -> Statement         
    | StList SEMICOLON Statement 
Statement -> null  
     | DO StList  END 

name  ->      %identifier
COMMA ->       ","       
LP    ->       "("       
RP    ->       ")"       
END   ->      %end       
DO    ->      %dolua     
FUN   ->      %fun       
SEMICOLON ->  ";"        
```

Here is the contents of the file `tokens.js` we have used in the former code:

```js
const { moo } = require("moo-ignore");

module.exports = {
    ws: { match: /\s+/, lineBreaks: true },
    comment: /#[^\n]*/,
    lparan: "(",
    rparan: ")",
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

Here is a program `test.js` to use the grammar and lexer:

```js
const nearley = require("nearley");
const grammar = require("./test-grammar.js");
const util = require('util');
const ins = obj => console.log(util.inspect(obj, { depth: null }));

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
