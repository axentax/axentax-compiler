import {
  getSoundLength,
  calculateTimeForTicks,
  getTicksByTime,
  untilNextToTick,
  reduceUntilNextArrByGCD
} from '../../src/conductor/utils/x-tick-utils';

describe('x-tick-utils', () => {
  describe('getSoundLength', () => {
    test('should calculate sound length in milliseconds from BPM and ticks', () => {
      // At 120 BPM, 1920 ticks (PPS) should be 500ms 
      expect(getSoundLength(120, 1920)).toBeCloseTo(500, 5);
    });

    test('should handle different BPM values', () => {
      // At 60 BPM, 1920 ticks should be 1000ms (1 second)
      expect(getSoundLength(60, 1920)).toBeCloseTo(1000, 5);
      
      // At 240 BPM, 1920 ticks should be 250ms 
      expect(getSoundLength(240, 1920)).toBeCloseTo(250, 5);
    });

    test('should handle different tick values', () => {
      // At 120 BPM, 960 ticks should be 250ms 
      expect(getSoundLength(120, 960)).toBeCloseTo(250, 5);
      
      // At 120 BPM, 3840 ticks should be 1000ms (1 second)
      expect(getSoundLength(120, 3840)).toBeCloseTo(1000, 5);
    });

    test('should handle zero ticks', () => {
      expect(getSoundLength(120, 0)).toBe(0);
    });

    test('should handle fractional BPM', () => {
      const result = getSoundLength(120.5, 1920);
      expect(result).toBeCloseTo(497.93, 2);
    });

    test('should handle fractional ticks', () => {
      const result = getSoundLength(120, 1920.5);
      expect(result).toBeCloseTo(500.13, 2);
    });

    test('should handle very high BPM', () => {
      expect(getSoundLength(300, 1920)).toBeCloseTo(200, 1);
    });

    test('should handle very low BPM', () => {
      expect(getSoundLength(30, 1920)).toBeCloseTo(2000, 1);
    });
  });

  describe('calculateTimeForTicks', () => {
    test('should calculate time in seconds from BPM and ticks', () => {
      // At 120 BPM, 1920 ticks (PPS) should be 0.5 second
      expect(calculateTimeForTicks(120, 1920)).toBe(0.5);
    });

    test('should handle different BPM values', () => {
      // At 60 BPM, 1920 ticks should be 1 second
      expect(calculateTimeForTicks(60, 1920)).toBe(1.0);
      
      // At 240 BPM, 1920 ticks should be 0.25 seconds
      expect(calculateTimeForTicks(240, 1920)).toBe(0.25);
    });

    test('should handle different tick values', () => {
      // At 120 BPM, 960 ticks should be 0.25 seconds
      expect(calculateTimeForTicks(120, 960)).toBe(0.25);
      
      // At 120 BPM, 3840 ticks should be 1 second
      expect(calculateTimeForTicks(120, 3840)).toBe(1.0);
    });

    test('should handle zero ticks', () => {
      expect(calculateTimeForTicks(120, 0)).toBe(0);
    });

    test('should handle fractional results', () => {
      const result = calculateTimeForTicks(100, 1920);
      expect(result).toBeCloseTo(0.6, 6);
    });

    test('should handle large tick values', () => {
      const result = calculateTimeForTicks(120, 19200);
      expect(result).toBe(5.0);
    });

    test('should handle very high BPM with precision', () => {
      const result = calculateTimeForTicks(300, 1920);
      expect(result).toBeCloseTo(0.2, 4);
    });
  });

  describe('getTicksByTime', () => {
    test('should convert milliseconds to ticks', () => {
      // At 120 BPM, 1000ms should be 3840 ticks
      expect(getTicksByTime(120, 1000)).toBe(3840);
    });

    test('should handle different BPM values', () => {
      // At 60 BPM, 1000ms should be 1920 ticks
      expect(getTicksByTime(60, 1000)).toBe(1920);
      
      // At 240 BPM, 1000ms should be 7680 ticks
      expect(getTicksByTime(240, 1000)).toBe(7680);
    });

    test('should handle different time values', () => {
      // At 120 BPM, 500ms should be 1920 ticks
      expect(getTicksByTime(120, 500)).toBe(1920);
      
      // At 120 BPM, 2000ms should be 7680 ticks
      expect(getTicksByTime(120, 2000)).toBe(7680);
    });

    test('should handle zero milliseconds', () => {
      expect(getTicksByTime(120, 0)).toBe(0);
    });

    test('should handle fractional milliseconds', () => {
      const result = getTicksByTime(120, 1500);
      expect(result).toBe(5760);
    });

    test('should handle very short time intervals', () => {
      const result = getTicksByTime(120, 10);
      expect(result).toBeCloseTo(38.4, 6);
    });

    test('should handle large time values', () => {
      const result = getTicksByTime(120, 60000); // 1 minute
      expect(result).toBe(230400);
    });

    test('should be inverse of getSoundLength calculation', () => {
      const bpm = 120;
      const originalTicks = 1920;
      const milliseconds = getSoundLength(bpm, originalTicks);
      const calculatedTicks = getTicksByTime(bpm, milliseconds);
      expect(calculatedTicks).toBeCloseTo(originalTicks, 5);
    });
  });

  describe('untilNextToTick', () => {
    test('should convert quarter note to ticks', () => {
      // [1, 4] = quarter note = 480 ticks (PPS=1920, so 1920/4 = 480)
      expect(untilNextToTick([1, 4])).toBe(480);
    });

    test('should convert half note to ticks', () => {
      // [1, 2] = half note = 960 ticks (1920/2 = 960)
      expect(untilNextToTick([1, 2])).toBe(960);
    });

    test('should convert eighth note to ticks', () => {
      // [1, 8] = eighth note = 240 ticks (1920/8 = 240)
      expect(untilNextToTick([1, 8])).toBe(240);
    });

    test('should convert whole note to ticks', () => {
      // [1, 1] = whole note = 1920 ticks (1920/1 = 1920)
      expect(untilNextToTick([1, 1])).toBe(1920);
    });

    test('should convert dotted half note to ticks', () => {
      // [3, 4] = three quarter notes = 1440 ticks (480 * 3 = 1440)
      expect(untilNextToTick([3, 4])).toBe(1440);
    });

    test('should convert triplet quarter note to ticks', () => {
      // [2, 6] = two sixth notes = 640 ticks (1920/6 * 2 = 640)
      expect(untilNextToTick([2, 6])).toBe(640);
    });

    test('should convert sixteenth note to ticks', () => {
      // [1, 16] = sixteenth note = 120 ticks (1920/16 = 120)
      expect(untilNextToTick([1, 16])).toBe(120);
    });

    test('should handle complex ratios', () => {
      // [5, 8] = five eighth notes = 1200 ticks (240 * 5 = 1200)
      expect(untilNextToTick([5, 8])).toBe(1200);
    });

    test('should handle zero numerator', () => {
      // [0, 4] = no duration = 0 ticks
      expect(untilNextToTick([0, 4])).toBe(0);
    });

    test('should handle large numerator', () => {
      // [8, 4] = eight quarter notes = 3840 ticks (480 * 8 = 3840)
      expect(untilNextToTick([8, 4])).toBe(3840);
    });

    test('should handle thirty-second note', () => {
      // [1, 32] = thirty-second note = 60 ticks (1920/32 = 60)
      expect(untilNextToTick([1, 32])).toBe(60);
    });
  });

  describe('reduceUntilNextArrByGCD', () => {
    test('should reduce simple fractions', () => {
      expect(reduceUntilNextArrByGCD([4, 8])).toEqual([1, 2]);
      expect(reduceUntilNextArrByGCD([6, 4])).toEqual([3, 2]);
      expect(reduceUntilNextArrByGCD([2, 4])).toEqual([1, 2]);
    });

    test('should handle already reduced fractions', () => {
      expect(reduceUntilNextArrByGCD([1, 4])).toEqual([1, 4]);
      expect(reduceUntilNextArrByGCD([3, 8])).toEqual([3, 8]);
      expect(reduceUntilNextArrByGCD([5, 7])).toEqual([5, 7]);
    });

    test('should reduce fractions with large common factors', () => {
      expect(reduceUntilNextArrByGCD([12, 16])).toEqual([3, 4]);
      expect(reduceUntilNextArrByGCD([15, 25])).toEqual([3, 5]);
      expect(reduceUntilNextArrByGCD([24, 36])).toEqual([2, 3]);
    });

    test('should handle fractions with GCD of 1', () => {
      expect(reduceUntilNextArrByGCD([7, 11])).toEqual([7, 11]);
      expect(reduceUntilNextArrByGCD([13, 17])).toEqual([13, 17]);
    });

    test('should handle zero numerator', () => {
      expect(reduceUntilNextArrByGCD([0, 4])).toEqual([0, 1]);
      expect(reduceUntilNextArrByGCD([0, 8])).toEqual([0, 1]);
    });

    test('should handle equal numerator and denominator', () => {
      expect(reduceUntilNextArrByGCD([4, 4])).toEqual([1, 1]);
      expect(reduceUntilNextArrByGCD([12, 12])).toEqual([1, 1]);
    });

    test('should handle large numbers', () => {
      expect(reduceUntilNextArrByGCD([100, 150])).toEqual([2, 3]);
      expect(reduceUntilNextArrByGCD([48, 72])).toEqual([2, 3]);
    });

    test('should handle prime number fractions', () => {
      expect(reduceUntilNextArrByGCD([17, 23])).toEqual([17, 23]);
      expect(reduceUntilNextArrByGCD([19, 29])).toEqual([19, 29]);
    });

    test('should handle numerator greater than denominator', () => {
      expect(reduceUntilNextArrByGCD([8, 6])).toEqual([4, 3]);
      expect(reduceUntilNextArrByGCD([15, 10])).toEqual([3, 2]);
    });

    test('should handle fractions that reduce to whole numbers', () => {
      expect(reduceUntilNextArrByGCD([8, 4])).toEqual([2, 1]);
      expect(reduceUntilNextArrByGCD([12, 3])).toEqual([4, 1]);
    });
  });
});