import { mathSuffixExtension } from '../../src/conductor/validation/mod-suffix-validation';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';
import { UntilNext } from '../../src/conductor/interface/utils.interface';

describe('mod-suffix-validation', () => {
  describe('mathSuffixExtension', () => {
    test('should return false for no suffix', () => {
      const untilNext: [number, number] = [1, 4];
      const result = mathSuffixExtension(untilNext, 'token', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe(false);
      }
    });

    it('should return false when no suffix extension matches', () => {
      const untilNext: UntilNext = [1, 2];
      const result = mathSuffixExtension(untilNext, 'C', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(false);
      }
      expect(untilNext).toEqual([1, 2]); // unchanged
    });

    test('should apply double suffix (~)', () => {
      const untilNext: [number, number] = [1, 4];
      const result = mathSuffixExtension(untilNext, 'token~', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe(true);
        expect(untilNext[0]).toBeGreaterThanOrEqual(1);
      }
    });

    it('should apply ~ (double) extension correctly', () => {
      const untilNext: UntilNext = [2, 1];
      const result = mathSuffixExtension(untilNext, 'C~', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      expect(untilNext[0]).toBe(4); // 2 * (1 + 1) = 4
    });

    test('should apply multiple double suffixes (~)', () => {
      const untilNext: [number, number] = [1, 4];
      const result = mathSuffixExtension(untilNext, 'token~~', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe(true);
        expect(untilNext[0]).toBe(3); // 1 * (2 + 1)
      }
    });

    it('should apply multiple ~ extensions correctly', () => {
      const untilNext: UntilNext = [1, 1];
      const result = mathSuffixExtension(untilNext, 'C~~', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      expect(untilNext[0]).toBe(3); // 1 * (2 + 1) = 3
    });

    test('should apply half suffix (^)', () => {
      const untilNext: [number, number] = [1, 4];
      const result = mathSuffixExtension(untilNext, 'token^', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe(true);
        expect(untilNext[1]).toBe(8); // 4 * 2
      }
    });

    it('should apply ^ (half) extension correctly', () => {
      const untilNext: UntilNext = [1, 4];
      const result = mathSuffixExtension(untilNext, 'C^', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      expect(untilNext[1]).toBe(8); // 4 * (1 * 2) = 8
    });

    test('should apply multiple half suffixes (^)', () => {
      const untilNext: [number, number] = [1, 4];
      const result = mathSuffixExtension(untilNext, 'token^^', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe(true);
        expect(untilNext[1]).toBe(16); // 4 * (2 * 2)
      }
    });

    it('should apply multiple ^ extensions correctly', () => {
      const untilNext: UntilNext = [1, 1];
      const result = mathSuffixExtension(untilNext, 'C^^', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      expect(untilNext[1]).toBe(4); // 1 * (2 * 2) = 4
    });

    test('should apply third suffix (=)', () => {
      const untilNext: [number, number] = [1, 4];
      const result = mathSuffixExtension(untilNext, 'token=', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe(true);
        expect(untilNext[1]).toBe(12); // 4 * 3
      }
    });

    it('should apply = (triple) extension correctly', () => {
      const untilNext: UntilNext = [1, 4];
      const result = mathSuffixExtension(untilNext, 'C=', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      expect(untilNext[1]).toBe(12); // 4 * (1 * 3) = 12
    });

    test('should apply multiple third suffixes (=)', () => {
      const untilNext: [number, number] = [1, 4];
      const result = mathSuffixExtension(untilNext, 'token==', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe(true);
        expect(untilNext[1]).toBeGreaterThanOrEqual(12);
      }
    });

    it('should apply multiple = extensions correctly', () => {
      const untilNext: UntilNext = [1, 2];
      const result = mathSuffixExtension(untilNext, 'C===', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      expect(untilNext[1]).toBe(18); // 2 * (3 * 3) = 18
    });

    test('should apply mixed suffixes', () => {
      const untilNext: [number, number] = [1, 4];
      const result = mathSuffixExtension(untilNext, 'token~^=', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe(true);
        expect(untilNext[0]).toBeGreaterThanOrEqual(1);
        expect(untilNext[1]).toBeGreaterThanOrEqual(4);
      }
    });

    it('should apply mixed extensions correctly', () => {
      const untilNext: UntilNext = [2, 3];
      const result = mathSuffixExtension(untilNext, 'C~=^', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      // ~ : untilNext[0] = 2 * (1 + 1) = 4
      // = : untilNext[1] = 3 * (1 * 3) = 9
      // ^ : untilNext[1] = 9 * (1 * 2) = 18
      // After GCD reduction: [4, 18] -> [2, 9]
      expect(untilNext).toEqual([2, 9]);
    });

    test('should handle long suffix gracefully', () => {
      const untilNext: [number, number] = [1, 4];
      const longSuffix = '~'.repeat(10);
      const result = mathSuffixExtension(untilNext, `token${longSuffix}`, 1, 1);
      // 実装では長すぎるサフィックスでもエラーにならない場合がある
      expect(result instanceof Success).toBe(true);
    });

    it('should return error when suffix extension exceeds maximum length', () => {
      const untilNext: UntilNext = [1, 1];
      // Create 17 = characters (exceeds maxSuffixExtensionLength of 16)
      const longSuffix = 'C' + '='.repeat(17);
      const result = mathSuffixExtension(untilNext, longSuffix, 1, 1);
      
      expect(result.fail()).toBe(true);
      if (result.fail()) {
        expect(result.message).toContain('Invalid suffix extension token');
        expect(result.message).toContain('Up to 16 suffix extensions can be used');
      }
    });

    it('should handle suffix at exactly maximum length', () => {
      const untilNext: UntilNext = [1, 1];
      // Create exactly 16 = characters (at maxSuffixExtensionLength)
      const maxSuffix = 'C' + '='.repeat(16);
      const result = mathSuffixExtension(untilNext, maxSuffix, 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      expect(untilNext[1]).toBe(48); // 1 * (16 * 3) = 48
    });

    it('should reduce by GCD correctly', () => {
      const untilNext: UntilNext = [6, 9];
      const result = mathSuffixExtension(untilNext, 'C=', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      // Before GCD: [6, 27] (9 * 3 = 27)
      // After GCD: [2, 9] (GCD of 6 and 27 is 3)
      expect(untilNext).toEqual([2, 9]);
    });

    it('should handle complex suffix combinations', () => {
      const untilNext: UntilNext = [4, 6];
      const result = mathSuffixExtension(untilNext, 'Dm7~~~===^^^', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      // ~~~ : untilNext[0] = 4 * (3 + 1) = 16
      // === : untilNext[1] = 6 * (3 * 3) = 54
      // ^^^ : untilNext[1] = 54 * (3 * 2) = 324
      // After GCD reduction
      const gcd = gcdCalculate(16, 324); // GCD of 16 and 324 = 4
      expect(untilNext).toEqual([4, 81]); // [16/4, 324/4] = [4, 81]
    });

    it('should handle tokens with numbers and suffixes', () => {
      const untilNext: UntilNext = [1, 1];
      const result = mathSuffixExtension(untilNext, '2|3|4~~', 1, 1);
      
      expect(result.fail()).toBe(false);
      if (!result.fail()) {
        expect(result.res).toBe(true);
      }
      expect(untilNext[0]).toBe(3); // 1 * (2 + 1) = 3
    });
  });
});

// Helper function to calculate GCD for test verification
function gcdCalculate(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}