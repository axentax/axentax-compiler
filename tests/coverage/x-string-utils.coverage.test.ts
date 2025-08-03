import {
  splitValuesEvenOnLineBrakes,
  resolveLocationOfRoundBracket,
  splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos,
  addPre
} from '../../src/conductor/utils/x-string-utils';
import { Success } from '../../src/conductor/interface/utils.response.interface';

describe('x-string-utils', () => {
  describe('splitValuesEvenOnLineBrakes', () => {
    test('should split values with line breaks', () => {
      const result = splitValuesEvenOnLineBrakes(1, 1, 'value1\nvalue2\nvalue3');
      expect(result).toEqual([
        { token: 'value1', line: 1, pos: 1 },
        { token: 'value2', line: 2, pos: 1 },
        { token: 'value3', line: 3, pos: 1 }
      ]);
    });

    test('should handle other delimiters', () => {
      const result = splitValuesEvenOnLineBrakes(1, 1, 'value1,value2;value3', [',', ';']);
      expect(result).toEqual([
        { token: 'value1', line: 1, pos: 1 },
        { token: 'value2', line: 1, pos: 8 },
        { token: 'value3', line: 1, pos: 15 }
      ]);
    });

    test('should handle parentheses', () => {
      const result = splitValuesEvenOnLineBrakes(1, 1, 'value1(value2)value3');
      expect(result).toEqual([
        { token: 'value1value2value3', line: 1, pos: 1 }
      ]);
    });

    test('should handle whitespace', () => {
      const result = splitValuesEvenOnLineBrakes(1, 1, '  value1  \n  value2  ');
      expect(result).toEqual([
        { token: 'value1', line: 1, pos: 3 },
        { token: 'value2', line: 2, pos: 3 }
      ]);
    });

    test('should handle empty input', () => {
      const result = splitValuesEvenOnLineBrakes(1, 1, '');
      expect(result).toEqual([]);
    });

    test('should handle only whitespace', () => {
      const result = splitValuesEvenOnLineBrakes(1, 1, '   \n   ');
      expect(result).toEqual([]);
    });
  });

  describe('resolveLocationOfRoundBracket', () => {
    test('should resolve location in single line', () => {
      const result = resolveLocationOfRoundBracket('(value)', 1, 1);
      expect(result).toEqual({ line: 1, pos: 2 });
    });

    test('should resolve location with multiple lines', () => {
      const result = resolveLocationOfRoundBracket('(\n  value\n)', 1, 1);
      expect(result).toEqual({ line: 2, pos: 3 });
    });

    test('should handle leading whitespace', () => {
      const result = resolveLocationOfRoundBracket('  (value)', 1, 1);
      expect(result).toEqual({ line: 1, pos: 4 });
    });

    test('should handle no content', () => {
      const result = resolveLocationOfRoundBracket('()', 1, 1);
      expect(result).toEqual({ line: 1, pos: 2 });
    });
  });

  describe('splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos', () => {
    test('should split tokens with spaces', () => {
      const result = splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(1, 1, 'token1 token2 token3');
      expect(result).toEqual([
        { token: 'token1', line: 1, pos: 1 },
        { token: 'token2', line: 1, pos: 8 },
        { token: 'token3', line: 1, pos: 15 }
      ]);
    });

    test('should handle line breaks', () => {
      const result = splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(1, 1, 'token1\ntoken2\ntoken3');
      expect(result).toEqual([
        { token: 'token1', line: 1, pos: 1 },
        { token: 'token2', line: 2, pos: 1 },
        { token: 'token3', line: 3, pos: 1 }
      ]);
    });

    test('should handle parentheses', () => {
      const result = splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(1, 1, 'token1 (token2) token3');
      expect(result).toEqual([
        { token: 'token1', line: 1, pos: 1 },
        { token: '(token2)', line: 1, pos: 8 },
        { token: 'token3', line: 1, pos: 17 }
      ]);
    });

    test('should handle nested parentheses', () => {
      const result = splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(1, 1, 'token1 (token2 (token3))');
      expect(result).toEqual([
        { token: 'token1', line: 1, pos: 1 },
        { token: '(token2 (token3))', line: 1, pos: 9 }
      ]);
    });

    test('should handle empty input', () => {
      const result = splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(1, 1, '');
      expect(result).toEqual([]);
    });

    test('should handle single token', () => {
      const result = splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(1, 1, 'token1');
      expect(result).toEqual([
        { token: 'token1', line: 1, pos: 1 }
      ]);
    });
  });

  describe('addPre', () => {
    test('should add prefix to string', () => {
      expect(addPre('value', 'prefix_')).toBe('valueprefix_');
    });

    test('should add prefix to number', () => {
      expect(addPre(42, 'prefix_')).toBe('42prefix_');
    });

    test('should return empty string for undefined', () => {
      expect(addPre(undefined, 'prefix_')).toBe('');
    });

    test('should return empty string for null', () => {
      expect(addPre(null as any, 'prefix_')).toBe('');
    });

    test('should handle empty prefix', () => {
      expect(addPre('value', '')).toBe('value');
    });

    test('should return empty string for zero', () => {
      expect(addPre(0, 'prefix_')).toBe('');
    });

    test('should return empty string for empty string', () => {
      expect(addPre('', 'prefix_')).toBe('');
    });
  });
});
