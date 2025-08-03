import {
  bitScaleToSymScale,
  createExtensionBin,
  getMidiNoteFromFingering,
  createActiveNoteOnlyList,
  addExtendKeyIntoScale,
  createBoardFullLine
} from '../../src/conductor/utils/x-scale-utils';
import { IKey, bin12 } from '../../src/conductor/interface/utils.interface';
import { ScaleName } from '../../src/conductor/diatonic-and-scale/mod-scale';

describe('x-scale-utils', () => {
  describe('bitScaleToSymScale', () => {
    test('should convert binary scale to symbol scale', () => {
      const result = bitScaleToSymScale('C', [1,0,1,0,1,1,0,1,0,1,0,1]);
      expect(result[0]).toBe('C');
      expect(result[1]).toBeUndefined();
      expect(result[2]).toBe('D');
      expect(result[4]).toBe('E');
      expect(result[5]).toBe('F');
    });

    test('should handle different starting keys', () => {
      const result = bitScaleToSymScale('G', [1,0,1,0,1,1,0,1,0,1,0,1]);
      expect(result[0]).toBe('G');
      expect(result[2]).toBe('A');
      expect(result[4]).toBe('B');
      expect(result[5]).toBe('C');
    });

    test('should handle all 1s scale', () => {
      const result = bitScaleToSymScale('C', [1,1,1,1,1,1,1,1,1,1,1,1]);
      expect(result.every(note => note !== undefined)).toBe(true);
      expect(result).toHaveLength(12);
    });

    test('should handle all 0s scale', () => {
      const result = bitScaleToSymScale('C', [0,0,0,0,0,0,0,0,0,0,0,0]);
      expect(result.every(note => note === undefined)).toBe(true);
      expect(result).toHaveLength(12);
    });
  });

  describe('createExtensionBin', () => {
    test('should add extension keys to scale', () => {
      const result = createExtensionBin('C', [1,0,1,0,1,1,0,1,0,1,0,1], ['C#', 'F#']);
      expect(result[0]).toBe('C'); // Original scale
      expect(result[1]).toBe('C#'); // Added key
      expect(result[2]).toBe('D'); // Original scale
      expect(result[6]).toBe('F#'); // Added key
    });

    test('should not duplicate existing scale notes', () => {
      const result = createExtensionBin('C', [1,0,1,0,1,1,0,1,0,1,0,1], ['C', 'D']);
      expect(result[0]).toBe('C'); // Original scale note
      expect(result[2]).toBe('D'); // Original scale note
    });

    test('should handle empty extension array', () => {
      const result = createExtensionBin('C', [1,0,1,0,1,1,0,1,0,1,0,1], []);
      expect(result[0]).toBe('C');
      expect(result[1]).toBeUndefined();
      expect(result[2]).toBe('D');
    });

    test('should handle different starting keys with extensions', () => {
      const result = createExtensionBin('G', [1,0,1,0,1,1,0,1,0,1,0,1], ['G#']);
      expect(result[0]).toBe('G');
      expect(result[1]).toBe('G#');
    });
  });

  describe('getMidiNoteFromFingering', () => {
    const standardTuning = [40, 45, 50, 55, 59, 64]; // E A D G B E

    test('should analyze fingering with multiple frets', () => {
      const result = getMidiNoteFromFingering([12, 13, undefined, undefined, undefined, undefined], standardTuning);
      expect(result.originFretArr).toEqual([12, 13]);
      expect(result.originStringArr).toEqual([0, 1]);
      expect(result.originKeyArr).toHaveLength(2);
      expect(result.originNoteNumArr).toHaveLength(2);
    });

    test('should handle open strings (fret 0)', () => {
      const result = getMidiNoteFromFingering([0, 0, 0, 0, 0, 0], standardTuning);
      expect(result.originFretArr).toEqual([0, 0, 0, 0, 0, 0]);
      expect(result.originStringArr).toEqual([0, 1, 2, 3, 4, 5]);
      expect(result.originKeyArr).toHaveLength(6);
    });

    test('should ignore muted strings (-1)', () => {
      const result = getMidiNoteFromFingering([-1, 5, -1, 7, -1, 8], standardTuning);
      expect(result.originFretArr).toEqual([5, 7, 8]);
      expect(result.originStringArr).toEqual([1, 3, 5]);
      expect(result.originKeyArr).toHaveLength(3);
    });

    test('should ignore undefined strings', () => {
      const result = getMidiNoteFromFingering([undefined, 5, undefined, 7, undefined, 8], standardTuning);
      expect(result.originFretArr).toEqual([5, 7, 8]);
      expect(result.originStringArr).toEqual([1, 3, 5]);
      expect(result.originKeyArr).toHaveLength(3);
    });

    test('should handle all muted strings', () => {
      const result = getMidiNoteFromFingering([-1, -1, -1, -1, -1, -1], standardTuning);
      expect(result.originFretArr).toEqual([]);
      expect(result.originStringArr).toEqual([]);
      expect(result.originKeyArr).toEqual([]);
      expect(result.originNoteNumArr).toEqual([]);
    });

    test('should handle high fret numbers', () => {
      const result = getMidiNoteFromFingering([15, undefined, undefined, undefined, undefined, undefined], standardTuning);
      expect(result.originFretArr).toEqual([15]);
      expect(result.originStringArr).toEqual([0]);
      expect(result.originKeyArr).toHaveLength(1);
    });
  });

  describe('createActiveNoteOnlyList', () => {
    test('should extract active notes and their indexes', () => {
      const board: (IKey | undefined)[] = ['E', undefined, 'F#', 'G', undefined, 'A'];
      const result = createActiveNoteOnlyList(board);
      expect(result.activeInIndexes).toEqual([0, 2, 3, 5]);
      expect(result.activeInKeys).toEqual(['E', 'F#', 'G', 'A']);
    });

    test('should handle board with no active notes', () => {
      const board: (IKey | undefined)[] = [undefined, undefined, undefined];
      const result = createActiveNoteOnlyList(board);
      expect(result.activeInIndexes).toEqual([]);
      expect(result.activeInKeys).toEqual([]);
    });

    test('should handle board with all active notes', () => {
      const board: IKey[] = ['C', 'D', 'E', 'F'];
      const result = createActiveNoteOnlyList(board);
      expect(result.activeInIndexes).toEqual([0, 1, 2, 3]);
      expect(result.activeInKeys).toEqual(['C', 'D', 'E', 'F']);
    });

    test('should handle empty board', () => {
      const board: (IKey | undefined)[] = [];
      const result = createActiveNoteOnlyList(board);
      expect(result.activeInIndexes).toEqual([]);
      expect(result.activeInKeys).toEqual([]);
    });

    test('should handle single active note', () => {
      const board: (IKey | undefined)[] = [undefined, 'A', undefined];
      const result = createActiveNoteOnlyList(board);
      expect(result.activeInIndexes).toEqual([1]);
      expect(result.activeInKeys).toEqual(['A']);
    });
  });

  describe('addExtendKeyIntoScale', () => {
    test('should add new keys to scale', () => {
      const boardFullArr: (IKey | undefined)[] = ['E', undefined, 'F#', 'G', undefined, 'A', undefined, undefined, undefined, undefined, undefined, undefined];
      const iKeysWithTuningStart: IKey[] = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
      const result = addExtendKeyIntoScale(boardFullArr, iKeysWithTuningStart, ['A#', 'C#']);
      
      expect(result[6]).toBe('A#'); // Added at index 6
      expect(result[9]).toBe('C#'); // Added at index 9
      expect(result[0]).toBe('E'); // Original unchanged
      expect(result[2]).toBe('F#'); // Original unchanged
    });

    test('should not add keys that already exist in scale', () => {
      const boardFullArr: (IKey | undefined)[] = ['E', undefined, 'F#', 'G'];
      const iKeysWithTuningStart: IKey[] = ['E', 'F', 'F#', 'G'];
      const originalLength = boardFullArr.length;
      const result = addExtendKeyIntoScale(boardFullArr, iKeysWithTuningStart, ['E', 'F#']);
      
      expect(result).toHaveLength(originalLength);
      expect(result[0]).toBe('E');
      expect(result[2]).toBe('F#');
    });

    test('should handle empty origin key array', () => {
      const boardFullArr: (IKey | undefined)[] = ['E', undefined, 'F#', 'G'];
      const iKeysWithTuningStart: IKey[] = ['E', 'F', 'F#', 'G'];
      const result = addExtendKeyIntoScale(boardFullArr, iKeysWithTuningStart, []);
      
      expect(result).toEqual(boardFullArr);
    });

    test('should handle repeating pattern beyond 12 notes', () => {
      const boardFullArr: (IKey | undefined)[] = new Array(24).fill(undefined);
      boardFullArr[0] = 'C';
      const iKeysWithTuningStart: IKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const result = addExtendKeyIntoScale(boardFullArr, iKeysWithTuningStart, ['D']);
      
      expect(result[2]).toBe('D'); // First occurrence at index 2
      expect(result[14]).toBe('D'); // Second occurrence at index 14 (2 + 12)
    });
  });

  describe('createBoardFullLine', () => {
    const standardTuning = [40, 45, 50, 55, 59, 64]; // E A D G B E
    const cMajorScale = { key: 'C' as IKey, scale: ScaleName.major, bin: [1,0,1,0,1,1,0,1,0,1,0,1] as bin12 };

    test('should create board full line for standard tuning and C major', () => {
      const result = createBoardFullLine(standardTuning, cMajorScale, 'E');
      
      expect(result.boardFullArr).toBeDefined();
      expect(result.iKeysWithKeyStart).toBeDefined();
      expect(result.iKeysWithTuningStart).toBeDefined();
      
      expect(result.iKeysWithKeyStart).toHaveLength(12);
      expect(result.iKeysWithTuningStart).toHaveLength(12);
      expect(result.boardFullArr.length).toBeGreaterThanOrEqual(1); // Should cover fretboard range
    });

    test('should start iKeysWithKeyStart with scale key', () => {
      const result = createBoardFullLine(standardTuning, cMajorScale, 'E');
      expect(result.iKeysWithKeyStart[0]).toBe('C');
    });

    test('should start iKeysWithTuningStart with tuning min key', () => {
      const result = createBoardFullLine(standardTuning, cMajorScale, 'E');
      expect(result.iKeysWithTuningStart[0]).toBe('E');
    });

    test('should handle different scales', () => {
      const gMajorScale = { key: 'G' as IKey, scale: ScaleName.major, bin: [1,0,1,0,1,1,0,1,0,1,0,1] as bin12 };
      const result = createBoardFullLine(standardTuning, gMajorScale, 'E');
      
      expect(result.iKeysWithKeyStart[0]).toBe('G');
      expect(result.boardFullArr).toBeDefined();
    });

    test('should handle different tunings', () => {
      const dropDTuning = [38, 45, 50, 55, 59, 64]; // D A D G B E
      const result = createBoardFullLine(dropDTuning, cMajorScale, 'D');
      
      expect(result.iKeysWithTuningStart[0]).toBe('D');
      expect(result.boardFullArr).toBeDefined();
    });

    test('should create board with appropriate length based on tuning range', () => {
      const result = createBoardFullLine(standardTuning, cMajorScale, 'E');
      const expectedLength = standardTuning[0] + 25 - standardTuning[standardTuning.length - 1]; // max fret + 1 - min note
      expect(result.boardFullArr).toHaveLength(expectedLength);
    });
  });
});