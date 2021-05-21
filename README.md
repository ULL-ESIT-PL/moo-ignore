Moo-ignore
====

Moo-ignore is a wrapper around the [moo](https://www.npmjs.com/package/moo) tokenizer/lexer generator. Use it to tokenize your strings, before parsing 'em with a parser like [nearley](https://github.com/hardmath123/nearley) or whatever else you're into.


Usage
-----

First, you need to do the needful: `$ npm install moo`, or whatever will ship this code to your computer. Alternatively, grab the `moo.js` file by itself and slap it into your web page via a `<script>` tag; moo is completely standalone.

Then you can start roasting your very own lexer/tokenizer:

```js
    const moo = require('moo')

    let lexer = moo.compile({
      WS:      /[ \t]+/,
      comment: /\/\/.*?$/,
      number:  /0|[1-9][0-9]*/,
      string:  /"(?:\\["\\]|[^\n"\\])*"/,
      lparen:  '(',
      rparen:  ')',
      keyword: ['while', 'if', 'else', 'moo', 'cows'],
      NL:      { match: /\n/, lineBreaks: true },
    })
```

And now throw some text at it:

```js
    lexer.reset('while (10) cows\nmoo')
    lexer.next() // -> { type: 'keyword', value: 'while' }
    lexer.next() // -> { type: 'WS', value: ' ' }
    lexer.next() // -> { type: 'lparen', value: '(' }
    lexer.next() // -> { type: 'number', value: '10' }
    // ...
```

When you reach the end of Moo's internal buffer, next() will return `undefined`. You can always `reset()` it and feed it more data when that happens.

