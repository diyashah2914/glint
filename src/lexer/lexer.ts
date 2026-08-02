
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

    const punctuationSet = new Set<string>(['(', ')', '{', '}', ',' , ';']);
    const operatorSet = new Set<string>(['+', '-', '*', '/']);
    const digitRegex : RegExp = /\d/;
    const alphabetRegex : RegExp = /[A-Za-z]/;
    const varRegex : RegExp = /\w/;
    const keywordsSet = new Set<string>(['let', 'number', 'string', 'boolean', 'if', 'else', 'while', 'function', 'return']);

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

        
        if (punctuationSet.has(currentToken)){
            const newToken = new Token("PUNCTUATION", currentToken, line, col);
            out.push(newToken);
            currentPosition ++
            col++
            continue
        }

        
        if (operatorSet.has(currentToken)){
            const newToken = new Token("OPERATOR", currentToken,line, col);
            out.push(newToken);
            currentPosition++
            col++
            continue
        }


        //Match = vs. ==
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

        
        //Match ! vs. !=
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
        
        //Match < , > vs. <= , >=
        if (currentToken === '<' || currentToken === '>'){
            let nextToken = input[currentPosition + 1]
            if (nextToken === '='){
                const newToken = new Token("COMPARISON", currentToken+nextToken, line,col);
                out.push(newToken);
                currentPosition = currentPosition+2;
                col = col + 2;
                continue
            }
            else{
                const newToken = new Token("COMPARISON", currentToken, line, col);
                out.push(newToken);
                currentPosition ++;
                col ++;
                continue
            }
        }
        
        //Match number literals
        if(digitRegex.test(currentToken)){
            let numString = '';
            const startCol = col;
            while (currentPosition < input.length && digitRegex.test(input[currentPosition]!)){
                numString += input[currentPosition]!;
                currentPosition ++;
                col ++;
            }

            const newToken = new Token("NUMBER", numString, line, startCol);
            out.push(newToken);
            continue
        }

        //Match String literal
        if (currentToken === '"'){
            let charString = '';
            let startCol = col;
            currentPosition++;
            col++;
            while(currentPosition < input.length && input[currentPosition] !== '"'){
                charString += input[currentPosition]!;
                currentPosition++ ;
                col++;
            }
            if (currentPosition === input.length){
                throw new Error(` Unterminated String literal starting at line ${line}, column ${col} `);
            } else {
                const newToken = new Token("STRING", charString, line, startCol);
                out.push(newToken);
                currentPosition++;
                col++;
                continue
            }

        }

        if (alphabetRegex.test(currentToken)){
            let varString = currentToken;
            let startCol = col;
            currentPosition ++
            col ++;
            while(currentPosition < input.length && varRegex.test(input[currentPosition]!)){
                varString += input[currentPosition]!;
                currentPosition++
                col++

            }

        if (varString === 'true' || varString === 'false' ){
            const newToken = new Token("BOOLEAN", varString, line, startCol);
            out.push(newToken);
            continue
        }
        else if (keywordsSet.has(varString)){
            const newToken = new Token('KEYWORD', varString, line, startCol);
            out.push(newToken);
            continue
        }

        else{
            const newToken = new Token("IDENTIFIER", varString, line, startCol);
            out.push(newToken);
            continue
        }
        
        }
        
        throw new Error(`Unexpected character '${currentToken}' at line ${line}, column ${col}`);
    }

    const newToken = new Token("EOF", null, line, col )
    out.push(newToken);
    return out
}