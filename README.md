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


On Regular Expressions
----------------------

RegExps are nifty for making tokenizers, but they can be a bit of a pain. Here are some things to be aware of:

* You often want to use **non-greedy quantifiers**: e.g. `*?` instead of `*`. Otherwise your tokens will be longer than you expect:

    ```js
    let lexer = moo.compile({
      string: /".*"/,   // greedy quantifier *
      // ...
    })

    lexer.reset('"foo" "bar"')
    lexer.next() // -> { type: 'string', value: 'foo" "bar' }
    ```

    Better:

    ```js
    let lexer = moo.compile({
      string: /".*?"/,   // non-greedy quantifier *?
      // ...
    })

    lexer.reset('"foo" "bar"')
    lexer.next() // -> { type: 'string', value: 'foo' }
    lexer.next() // -> { type: 'space', value: ' ' }
    lexer.next() // -> { type: 'string', value: 'bar' }
    ```

* The **order of your rules** matters. Earlier ones will take precedence.

    ```js
    moo.compile({
        identifier:  /[a-z0-9]+/,
        number:  /[0-9]+/,
    }).reset('42').next() // -> { type: 'identifier', value: '42' }

    moo.compile({
        number:  /[0-9]+/,
        identifier:  /[a-z0-9]+/,
    }).reset('42').next() // -> { type: 'number', value: '42' }
    ```

* Moo uses **multiline RegExps**. This has a few quirks: for example, the **dot `/./` doesn't include newlines**. Use `[^]` instead if you want to match newlines too.

* Since an excluding character ranges like `/[^ ]/` (which matches anything but a space) _will_ include newlines, you have to be careful not to include them by accident! In particular, the whitespace metacharacter `\s` includes newlines.

