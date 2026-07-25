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
});

