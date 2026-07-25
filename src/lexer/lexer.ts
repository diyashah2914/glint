// export function tokenize(source: string){
//     //TODO : implement
// }

class Token {
    readonly type : "KEYWORD" | "IDENTIFIER" | "OPERATOR" | "PUNCTUATION" | "NUMBER" | "STRING" | "BOOLEAN" | "EOF";
    readonly value : string | null;
    readonly line : number;
    readonly col : number;

    constructor(type:"KEYWORD" | "IDENTIFIER" | "OPERATOR" | "PUNCTUATION" | "NUMBER" | "STRING" | "BOOLEAN" | "EOF", value: string | null, line:number, col: number){
        this.type = type;
        this.value = value;
        this.line = line;
        this.col = col;


    }
}