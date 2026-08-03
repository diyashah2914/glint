// export function tokenize(source: string){
//     //TODO : implement
// }

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
    kind : "BinaryExp";
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
    iftrue_branch : Statement[];
    else_branch : Statement[] | null;
}
interface WhileStatement { 
    kind: "WhileStatement";
    condition: Expr;
    body: Statement[];
}
interface ReturnStatement {
    kind : "ReturnStatement";
    output: Expr | null;
}
interface FunctionDecl {
    kind : "FunctionDecl";
    func_name: string;
    params: {name: string, type: string}[];
    output : string | null;
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

