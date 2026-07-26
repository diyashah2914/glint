
//Define TokenType union
type TokenType = "KEYWORD" | "IDENTIFIER" | "OPERATOR" | "COMPARISON" | "PUNCTUATION" | "NUMBER" | "STRING" | "BOOLEAN" | "EOF";

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
        const currentToken = input[currentPosition]!

        if (currentToken === ' '){
        currentPosition ++
        col ++
        continue
    }
        if (currentToken === '\t'){
            currentPosition ++
            col = col + 4
            continue
        }
        if (currentToken === '\n'){
            line++
            col = 1
            currentPosition ++
            continue
        }

        const punctuation_set = new Set<string>(['(', ')', '{', '}', ',' , ';']);
        if (punctuation_set.has(currentToken)){
            const newToken = new Token("PUNCTUATION", currentToken, line, col);
            out.push(newToken);
            currentPosition ++
            col++
            continue
        }

        const operator_set = new Set<string>(['+', '-', '*', '/']);
        if (operator_set.has(currentToken)){
            const newToken = new Token("OPERATOR", currentToken,line, col);
            out.push(newToken);
            currentPosition++
            col++
            continue
        }

        if (currentToken === '='){
            let nextToken = input[currentPosition+1]
            if (nextToken === '='){
                const newToken = new Token("COMPARISON", '==' , line, col);
                out.push(newToken)

                currentPosition = currentPosition + 2
                col = col + 2

                
            }
            else{
                const newToken = new Token("OPERATOR", currentToken, line, col);
                out.push(newToken);
                currentPosition ++;
                col ++;
            }
                continue
        }

        if (currentToken === '!'){
            let nextToken = input[currentPosition + 1]
            if (nextToken === '='){
                const newToken = new Token("COMPARISON", '!=', line,col);
                out.push(newToken);
                currentPosition = currentPosition+2;
                col = col + 2;
                continue
            } else {
                throw new Error(`Unexpected character '${currentToken}' at line ${line}, column ${col}`);
            }
        }
    }

    const newToken = new Token("EOF", null, line, col )
    out.push(newToken);
    return out
}