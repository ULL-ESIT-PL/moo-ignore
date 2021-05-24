const { moo } = require("../index.js");

module.exports = {
    ws: { match: /\s+/, lineBreaks: true },
    comment: /#[^\n]*/,
    lp: "(",
    rp: ")",
    //comma: ",",
    semicolon: ";",
    identifier: {
        match: /\b[a-z_][\w_]*\b/, 
        type: moo.keywords({
            fun: "fun",
            end: "end",
            dolua: "do"
        })
    }
}