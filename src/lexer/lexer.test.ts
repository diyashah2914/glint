import { describe, it, expect } from 'vitest';
import { tokenize } from '../lexer/lexer.js';

describe('sanity check', () => {
  it('true is true', () => {
    expect(true).toBe(true);
  });
  it('EOF token', () => {
    const result = tokenize("");
    expect(result.length).toBe(1);
    expect(result[0]?.type).toBe("EOF")
  })
  it('skip whitespace', () => {
    const result = tokenize("\t\t\t");
    expect(result.length).toBe(1)
    expect(result[0]?.col).toBe(13);
  })
  it('punctuation matching', () => {
    const result = tokenize("({,;})");
    expect(result.length).toBe(7);
    expect(result[0]?.col).toBe(1);
    for (let i: number = 0; i < 6; i++){
      expect(result[i]?.type).toBe("PUNCTUATION");
    }
  })
  it('operator matching', () => {
    const result = tokenize(" - / * + ");
    expect(result.length).toBe(5);
    expect(result[0]?.col).toBe(2);
    for(let j: number = 0; j < 4; j++){
      expect(result[j]?.type).toBe("OPERATOR")
    }
    
  })

  it ('match = vs ==', () => {
    const result = tokenize('== =')
    expect(result.length).toBe(3);
    expect(result[1]?.col).toBe(4);
    expect(result[0]?.type).toBe("COMPARISON");
    expect(result[1]?.type).toBe("OPERATOR");
  })
  it('match ! vs !=', () => {
    const result = tokenize('!=')
    expect(result.length).toBe(2);
    expect(result[0]?.col).toBe(1);
    expect(result[0]?.type).toBe("COMPARISON");
   })

  it ('shows error for !', () => {
    expect(() => tokenize("!")).toThrow()
   })
  
  it ('match <> with <=>=', () => {
    const result = tokenize('< >=');
    expect(result[0]?.value).toBe('<');
    expect(result[1]?.value).toBe('>=');
    for (let i : number = 0; i<2;i++){
      expect(result[i]?.type).toBe("COMPARISON");
    }
   })

  it ('Number literal Matching', () => {
    const result = tokenize('123=');
    expect(result.length).toBe(3);
    expect(result[0]?.col).toBe(1);
    expect(result[1]?.col).toBe(4);
    expect(result[0]?.type).toBe("NUMBER");
  })

  it ('String literal Matching', () => {
    const result = tokenize('"abc"');
    expect(result.length).toBe(2);
    expect(result[0]?.col).toBe(1);
    expect(result[0]?.type).toBe("STRING");
  })

  it ('String literal error', () => {
    expect(() =>  tokenize('"abc')).toThrow();
  })

  it ('match identifier', () => {
    const result = tokenize("age");
    expect(result[0]?.type).toBe("IDENTIFIER");
    expect(result[0]?.value).toBe("age");
  })

  it ('match keyword', () => {
    const result = tokenize("let");
    expect(result[0]?.type).toBe("KEYWORD");
    expect(result[0]?.value).toBe("let");
  })

  it('match boolean', () => {
    const result = tokenize("true");
    expect(result[0]?.type).toBe("BOOLEAN");
    expect(result[0]?.value).toBe("true");
  })
  
});

