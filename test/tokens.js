const { moo } = require("../index.js");

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