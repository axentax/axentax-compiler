import { greatestCommonDivisor } from '../../src/conductor/utils/x-math-utils';

describe('x-math-utils', () => {
  describe('greatestCommonDivisor', () => {
    test('should calculate GCD of two positive numbers', () => {
      expect(greatestCommonDivisor(48, 18)).toBe(6);
      expect(greatestCommonDivisor(54, 24)).toBe(6);
      expect(greatestCommonDivisor(7, 13)).toBe(1);
    });

    test('should handle zero values', () => {
      expect(greatestCommonDivisor(0, 5)).toBe(5);
      expect(greatestCommonDivisor(5, 0)).toBe(5);
      expect(greatestCommonDivisor(0, 0)).toBe(0);
    });

    test('should handle negative numbers', () => {
      expect(greatestCommonDivisor(-48, 18)).toBe(6);
      expect(greatestCommonDivisor(48, -18)).toBe(-6);
      expect(greatestCommonDivisor(-48, -18)).toBe(-6);
    });

    test('should handle same numbers', () => {
      expect(greatestCommonDivisor(12, 12)).toBe(12);
      expect(greatestCommonDivisor(1, 1)).toBe(1);
      expect(greatestCommonDivisor(0, 0)).toBe(0);
    });

    test('should handle large numbers', () => {
      expect(greatestCommonDivisor(1000, 500)).toBe(500);
      expect(greatestCommonDivisor(999, 333)).toBe(333);
    });

    test('should handle prime numbers', () => {
      expect(greatestCommonDivisor(17, 23)).toBe(1);
      expect(greatestCommonDivisor(29, 31)).toBe(1);
      expect(greatestCommonDivisor(2, 3)).toBe(1);
    });
  });
}); 