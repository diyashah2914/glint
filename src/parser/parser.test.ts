import { describe, expect, it } from "vitest";
import { tokenize } from "../lexer/lexer.js";
import { parse } from "./parser.js";

describe ('Parser', () => {
    it('should parse a simple let statement', () => {
        const tokens = tokenize('let x = 5;');
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe('LetStatement');
    });

    it ('should parse if-else statement', () => {
        const tokens = tokenize(' if (5 > 3) { return 1; } else { return 2; }');
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("IfStatement");
    });

    it ('should parse a simple let statement and if else block', () => {
        const tokens = tokenize('let x = 5; if (x>0) {x = x + 1; } else {x = 0;}');
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("LetStatement");
        expect(ast.body[1]?.kind).toBe("IfStatement");
    });

    it ('should parse a WhileStatement', () => {
        const tokens = tokenize('let x = 5; while (x > 0) {x = x - 1;}');
        const ast = parse(tokens);
        expect(ast.body[1]?.kind).toBe("WhileStatement");
    });

    it ('should parse a ReturnStatement', () => {
        const tokens = tokenize('let x = 5; return x;')
        const ast = parse(tokens);
        expect(ast.body[1]?.kind).toBe("ReturnStatement");
    });

    it ('should parse a FunctionDecl', () => {
        const tokens = tokenize('function add(x: number, y: number): number {return x + y;}');
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("FunctionDecl");
    });

    it ('should parse a ExprStatement', () => {
        const tokens = tokenize('let x = 5; add(x, 4);');
        const ast = parse(tokens);
        expect(ast.body[1]?.kind).toBe("ExprStatement");
    });

    it ('should parse a ExprStatement pt.2', () => {
        const tokens = tokenize('let x = 5; add();');
        const ast = parse(tokens);
        expect(ast.body[1]?.kind).toBe("ExprStatement");
    });

    it ('should parse a ExprStatement pt.3', () => {
        const tokens = tokenize('(1+2+3);');
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("ExprStatement");
    });

    it ('simple literals', () => {
        const tokens = tokenize("hello;");
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("ExprStatement");
    });

    it ('identifier' ,() => {
        const tokens = tokenize("x;");
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("ExprStatement");
    });

    it ("error handling for unexpected token", () => {
        const tokens = tokenize("let x = 5; if (x > 0) {x = x + 1;} else {x = 0;}}");
        expect(() => parse(tokens)).toThrow();
    });

    it('Binary expr', () => {
        const tokens = tokenize("x < 10;");
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("ExprStatement");
    });

    it("nested conditions", () => {
        const tokens = tokenize("let x = 5; if (x > 3){ if (x > 4){ x = x - 1; } else { x = x + 1;} } else { x = x; }");
        const ast = parse(tokens);
        expect(ast.body[1]?.kind).toBe("IfStatement");
    });

    it ("Function with no params", () => {
        const tokens = tokenize("function add(): number {return 5;}");
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("FunctionDecl");
    });

    it ("Type Annotations in let statements" ,() => {
        const tokens = tokenize("let x: string = hello;");
        const ast = parse(tokens);
        expect(ast.body[0]?.kind).toBe("LetStatement");
    });


})