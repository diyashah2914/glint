
//Define TokenType union
type TokenType = "KEYWORD" | "IDENTIFIER" | "OPERATOR" | "PUNCTUATION" | "NUMBER" | "STRING" | "BOOLEAN" | "EOF";

// Define Token Type
class Token {
    readonly type : TokenType;
    readonly value : string | null;
    readonly line : number;
    readonly col : number;

    constructor(type: TokenType, value: string | null, line:number, col: number){
        this.type = type;
        this.value = value;
        this.line = line;
        this.col = col;


    }
}