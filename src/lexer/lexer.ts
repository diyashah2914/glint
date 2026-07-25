
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

export function tokenize(input: string) : Token[] {
    const out: Token[] = []
    let currentPosition = 0
    let line = 1
    let col = 1

    while (currentPosition < input.length){
        //TODO : match token here
        const currentToken = input[currentPosition]
        currentPosition ++
        col ++

        if (currentToken === '\n'){
            line++
            col = 1
            continue
        }
    }

    const newToken = new Token("EOF", null, line, col )
    out.push(newToken);
    return out
}