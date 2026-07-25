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
});

