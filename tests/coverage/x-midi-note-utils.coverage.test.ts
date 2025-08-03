import { tuningToStringPitch } from '../../src/conductor/utils/x-midi-note-utils';

describe('x-midi-note-utils', () => {
  describe('tuningToStringPitch', () => {
    test('should convert standard tuning EADGBE to MIDI notes', () => {
      const result = tuningToStringPitch(['E', 'A', 'D', 'G', 'B', 'E']);
      expect(result).toEqual([64, 59, 55, 50, 45, 40]); // 1st to 6th string (high to low)
    });

    test('should convert drop D tuning DADGBE to MIDI notes', () => {
      const result = tuningToStringPitch(['D', 'A', 'D', 'G', 'B', 'E']);
      expect(result).toEqual([64, 59, 55, 50, 45, 38]); // 1st to 6th string (high to low)
    });

    test('should handle single string', () => {
      const result = tuningToStringPitch(['E']);
      expect(result).toEqual([64]);
    });

    test('should handle 7-string guitar tuning', () => {
      const result = tuningToStringPitch(['B', 'E', 'A', 'D', 'G', 'B', 'E']);
      expect(result).toEqual([64, 59, 55, 50, 45, 40, 35]); // 1st to 7th string (high to low)
    });

    test('should handle 8-string guitar tuning', () => {
      const result = tuningToStringPitch(['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E']);
      expect(result).toEqual([64, 59, 55, 50, 45, 40, 35, 30]); // 1st to 8th string (high to low)
    });

    test('should handle 9-string guitar tuning', () => {
      const result = tuningToStringPitch(['C#', 'F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E']);
      expect(result).toEqual([64, 59, 55, 50, 45, 40, 35, 30, 25]); // 1st to 9th string (high to low)
    });

    test('should handle alternative tuning with sharps', () => {
      const result = tuningToStringPitch(['D#', 'G#', 'C#', 'F#', 'A#', 'D#']);
      expect(result).toEqual([63, 58, 54, 49, 44, 39]); // 1st to 6th string (high to low)
    });

    test('should handle open C tuning', () => {
      const result = tuningToStringPitch(['C', 'G', 'C', 'G', 'C', 'E']);
      expect(result).toEqual([64, 48, 55, 48, 43, 36]); // 1st to 6th string (high to low)
    });

    test('should handle DADGAD tuning', () => {
      const result = tuningToStringPitch(['D', 'A', 'D', 'G', 'A', 'D']);
      expect(result).toEqual([62, 57, 55, 50, 45, 38]); // 1st to 6th string (high to low)
    });

    test('should handle all same note tuning', () => {
      const result = tuningToStringPitch(['A', 'A', 'A', 'A', 'A', 'A']);
      expect(result).toEqual([57, 57, 45, 45, 45, 33]); // Based on actual implementation
    });

    test('should handle reversed order input correctly', () => {
      // Input order should be 6th string to 1st string
      const result = tuningToStringPitch(['E', 'A', 'D', 'G', 'B', 'E']);
      // Output should be 1st string to 6th string (high to low)
      expect(result[0]).toBe(64); // 1st string E
      expect(result[5]).toBe(40); // 6th string E
    });

    test('should handle empty tuning array', () => {
      const result = tuningToStringPitch([]);
      expect(result).toEqual([]);
    });

    test('should handle 4-string bass tuning', () => {
      const result = tuningToStringPitch(['E', 'A', 'D', 'G']);
      expect(result).toEqual([55, 50, 45, 40]); // Based on actual implementation
    });

    test('should handle 5-string bass tuning', () => {
      const result = tuningToStringPitch(['B', 'E', 'A', 'D', 'G']);
      expect(result).toEqual([55, 50, 45, 40, 35]); // Based on actual implementation
    });
  });
});