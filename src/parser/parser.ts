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
            const innerExpr = parseExpression();
            const closingpunc = peek();
            if (closingpunc?.type === "PUNCTUATION" && closingpunc?.value === ")"){
                advance();
                return innerExpr;
            } else {
                throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of ')' `)

            }
        } else {
            throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of '('  `)
        }
    }

    function parseExpression() : Expr{

        let current = peek();
        let leftNode: Expr = {kind: "Identifier", name: ""};

        if (current?.type === "PUNCTUATION" && current?.value === "("){
            return parseParenthesized();
        }  else if (current?.type === "NUMBER" || current?.type === "STRING" || current?.type === "BOOLEAN" || current?.type === "IDENTIFIER"){
            leftNode = parseLiteral();
        
            current = peek();

            if (current?.value === "("  && leftNode.kind === "Identifier"){
                const callNode = parseCall(leftNode.name);
                return callNode;
            }
        } else {
            throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of '(' or literal `)
        }
        
        current = peek();
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

    function parseCall(funcName: string): CallExpr {

        let current = peek();

        
        if (current?.type === "PUNCTUATION" && current?.value === "("){
            advance();
            current = peek();

            const args: Expr[] = [];

            while (current?.value !== ")") {
                args.push(parseExpression());

                current = peek();

                if (current?.value === ","){
                    advance();
                    current = peek();
                }
            }

            advance();
            return { 
                kind : "CallExpr" as const,
                name: funcName,
                args: args
            }
        
        } else {
            throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of '('  `)
        }
    
}

    function parseExpressionStatement(){
        const expr = parseExpression();
        let current = peek();

        if (current?.type === "PUNCTUATION" && current?.value === ";" ) {
            advance();
            return {
                kind: "ExprStatement" as const,
                expr: expr
            }
        } else {
            throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of ;`)
        }
    }

    function parseLetStatement(){
        let current = peek();
        let typeAnnotation: string | null = null;

        if (current?.value === "let" && current?.type==="KEYWORD"){
            advance();

            const varNameToken = expect("IDENTIFIER");
            const varName = varNameToken?.value ?? ""
            current = peek();

            if (current?.value === ":"){
                advance();
                const typeToken = expect("KEYWORD");
                typeAnnotation = typeToken?.value ?? null;
            } 
            expect("OPERATOR");
            current = peek();
            const valueExpr = parseExpression();
            current = peek();

            if (current?.type === "PUNCTUATION" && current?.value === ";"){
                advance();
                return{
                    kind: "LetStatement" as const,
                    name: varName,
                    typeAnnotation: typeAnnotation,
                    value: valueExpr
                }
            } else {
                throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of ;`)
            }
        } else { 
            throw new Error(`Expected 'let' keyword`);
        }
    }    

    function parseReturn(){
        let current = peek();
        let returnExpr: Expr | null = null;

        if (current?.type === "KEYWORD" && current?.value === "return"){
            advance();

            current = peek();

            if (current?.value !== ";"){
                returnExpr = parseExpression();
                current = peek();
            } 
        
            if (current?.type === "PUNCTUATION" && current.value === ";"){
                advance();
                return {
                    kind: "ReturnStatement" as const,
                    returnType: returnExpr
                }
            } else {
                throw new Error (`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} insted of ;`);
            }
        
        } else {
            throw new Error (`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of return`);
        }
    } 

    function parseBlock(){
        let current = peek();
        const statements: Statement[] = [];

        if (current?.value === "{"){
            advance();
            current = peek();
            while (current?.value !=="}"){
                const stmt = parseStatement();
                statements.push(stmt);
                current = peek();
            }
        } else {
            throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of '{'`);  
        } 
        advance();
        return statements;
    } 

    function parseStatement(){
        let current = peek();

        if (current?.type === "KEYWORD" && current?.value === "let"){
            return parseLetStatement();
        } else if (current?.type === "KEYWORD" && current?.value === "return"){
            return parseReturn();
        } else if (current?.type === "KEYWORD" && current?.value === "while"){
            return parseWhile();
        } else if (current?.type === "KEYWORD" && current?.value === "if"){
            return parseIfStatement();
        } else if (current?.type === "KEYWORD" && current?.value === "function"){
            return parseFunctionDecl();
        } else {
            return parseExpressionStatement();
        }
    }

    function parseWhile() {
        let current = peek();
        let cond: Expr;

        if (current?.value === "while" && current.type === "KEYWORD"){
            advance();
            current = peek();
            if (current?.type === "PUNCTUATION" && current.value === "(" ){
                advance();
                cond = parseExpression();
                current = peek();
                if (current?.type === "PUNCTUATION" && current.value === ")"){
                    advance();
                } else {
                    throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of ')'`);
                }
            } else {
                    throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of '('`);
                }

            const body = parseBlock();
            return {
                kind: "WhileStatement" as const,
                condition: cond,
                body: body
            } 
        } else {
            throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of 'while'`);
        }
    }
    
    function parseIfStatement(){
        let current = peek();
        let ifCond : Expr;
        let ifBody: Statement[];
        let elseBody: Statement[] | null = null;
        if (current?.type === "KEYWORD" && current.value === "if"){
            advance();
            current = peek();
        
            if (current?.type === "PUNCTUATION" && current.value === "("){
                advance();
                ifCond = parseExpression();
                current = peek();

                if (current?.type === "PUNCTUATION" && current.value === ")"){
                    advance();
                } else {
                    throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of ')'`);
                }
            } else {
                throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of '('`);
            }

                ifBody = parseBlock();
        } else {
            throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of 'if'`);
        }

        current = peek();
        
        if (current?.type === "KEYWORD" && current.value === "else"){
            advance();
            current = peek();

            elseBody = parseBlock();
        }

        return {
            kind: "IfStatement" as const,
            condition: ifCond,
            thenBranch: ifBody,
            elseBranch: elseBody
        }
    } 

    function parseFunctionDecl(){
        let params: {name: string, type: string}[] = [];
        let current = peek();
        if (current?.type === "KEYWORD" && current.value === "function"){
            advance();
            const funcName = peek();
            advance();
            current = peek();

            if (current?.type === "PUNCTUATION" && current.value === "("){
                advance();
                current = peek();

                while (current?.value !== ")"){
                    const paramNametoken = expect("IDENTIFIER");
                    const paramName = paramNametoken?.value ?? "";
                    current = peek();

                    if (current?.value === ":"){
                        advance();
                        const paramTypeToken = expect("KEYWORD");
                        const paramType = paramTypeToken?.value ?? "";

                        params.push({name: paramName, type: paramType});
                    } else {
                        throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of ':'`);
                    }
                    current = peek();
                    if (current?.value === ","){
                        advance();
                        current = peek();
                    } else {
                        break;
                    }
                }   

                if (current?.type === "PUNCTUATION" && current.value === ")"){
                    advance();
                    current = peek();

                    if (current?.value === ":"){
                        advance();
                        const returnTypeToken = expect("KEYWORD");
                        const returnType = returnTypeToken?.value ?? "";
                        const body = parseBlock();
                        return {
                            kind: "FunctionDecl" as const,
                            funcName: funcName?.value ?? "",
                            params: params,
                            returnType: returnType,
                            body: body
                        }

                    } else {
                        throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of ':'`);
                    }
                } else {
                    throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of ')'`);
                } 
            } else {
                throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of '('`);
            }
        } else {
            throw new Error(`Unexpected character '${current?.value}' at line ${current?.line}, column ${current?.col} instead of 'function'`);
        }
    }

    const statements: Statement[] = [];
    let current = peek();
    while (current?.type !== "EOF"){
        const stmt = parseStatement();
        statements.push(stmt);
        current = peek();
    }
        return {
            kind: "Program" as const,
            body: statements
        }
}


