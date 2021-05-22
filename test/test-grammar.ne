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
