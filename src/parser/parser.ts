import {Token} from "../lexer/lexer.js"
//Expressions AST nodes
type Expr = NumberLiteral | StringLiteral | BooleanLiteral| Identifier | BinaryExpr| CallExpr;
interface NumberLiteral {
    kind: "NumberLiteral";
    value: number;
}
interface StringLiteral {
    kind: "StringLiteral";
    value: string;
}
interface BooleanLiteral { 
    kind: "BooleanLiteral";
    value: boolean;
}
interface Identifier {
    kind: "Identifier";
    name: string;
}
interface BinaryExpr {
    kind : "BinaryExpr";
    operator: string  ;
    left: Expr;
    right: Expr;
}
interface CallExpr {
    kind: "CallExpr";
    name: string;
    args: Expr[];
}

//Statements AST nodes
type Statement = LetStatement | IfStatement | WhileStatement | FunctionDecl | ExprStatement | ReturnStatement;
interface LetStatement {
    kind: "LetStatement";
    name: string;
    typeAnnotation: string | null;
    value : Expr;
}
interface IfStatement {
    kind : "IfStatement";
    condition: Expr;
    thenBranch : Statement[];
    elseBranch : Statement[] | null;
}
interface WhileStatement { 
    kind: "WhileStatement";
    condition: Expr;
    body: Statement[];
}
interface ReturnStatement {
    kind : "ReturnStatement";
    returnType: Expr | null;
}
interface FunctionDecl {
    kind : "FunctionDecl";
    funcName: string;
    params: {name: string, type: string}[];
    returnType : string | null;
    body : Statement[];
}
interface ExprStatement { 
    kind : "ExprStatement";
    expr : Expr;
}

//root of AST
interface Program { 
    kind : "Program";
    body : Statement[]
}

export function parse(tokens: Token[]) : Program {
    let pos = 0;

    function peek() {
        return tokens[pos];
    } 

    function advance() {
        const current = peek();
        pos++;
        return current;
    }

    function expect(type : string) {
        if (type === tokens[pos]?.type){
            const next = advance();
            return next;
        }
        else {
            throw new Error(`Unexpected type '${tokens[pos]?.type}' at line '${tokens[pos]?.line}', column '${tokens[pos]?.col}' instead of '${type}' type'`)
        }
    }

    function parseLiteral(): Expr {
        const current = peek();

        if (!current) {
            throw new Error(`Unexpected end of input`);
        }

        if (current?.type === "NUMBER"){
            advance();
            return {
                kind: "NumberLiteral",
                value: Number(current.value)
            }
        }   else if (current?.type === "STRING"){
            advance();
            return {
                kind: "StringLiteral",
                value: current.value ?? ""
            }
        }   else if (current?.type === "BOOLEAN"){
            advance();
            return {
                kind: "BooleanLiteral",
                value: current.value === "true"
            }
        } else if (current?.type === "IDENTIFIER"){
            advance();
            return {
                kind: "Identifier",
                name: current.value ?? ""
            }
        } else {
            throw new Error(`Unexpected literal token: ${current.type}`)
        }
    }

    function parseParenthesized(){
        const current = peek();

        if (current?.type === "PUNCTUATION" && current?.value === "("){
            advance();
            // yet to code. need parseExpression() first!
        }
    }

    function parseExpression() :Expr{
        const leftNode = parseLiteral();
        
        const current = peek();
        if (current?.type === "OPERATOR" || current?.type === "COMPARISON"){
            const operatorToken = advance();
            const rightNode = parseExpression(); 

            return {
                kind: "BinaryExpr",
                operator: operatorToken?.value ?? "",
                left: leftNode,
                right: rightNode 
            }
        }
        return leftNode;
    }
            
        return { kind: "Program", body: [] };

}

