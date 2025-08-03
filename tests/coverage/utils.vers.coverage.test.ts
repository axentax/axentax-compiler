import { easyX, colon_length, percent_length, Base12Sym, tuningPitch100 } from '../../src/conductor/utils.vers';

describe('utils.vers.ts coverage', () => {
  test('colon_length should be 1', () => {
    expect(colon_length).toBe(1);
  });

  test('percent_length should be 1', () => {
    expect(percent_length).toBe(1);
  });

  test('easyX should return empty string for undefined', () => {
    expect(easyX(undefined)).toBe('');
  });

  test('easyX should handle array with undefined values', () => {
    const result = easyX([1.5, undefined, 2.7, 3]);
    expect(result).toEqual([1, '', 2, 3]);
  });

  test('easyX should floor numeric values', () => {
    const result = easyX([1.9, 2.1, 3.8]);
    expect(result).toEqual([1, 2, 3]);
  });

  test('easyX should handle empty array', () => {
    const result = easyX([]);
    expect(result).toEqual([]);
  });

  test('Base12Sym should contain all 12 keys', () => {
    const keys = Object.keys(Base12Sym);
    expect(keys).toHaveLength(12);
    expect(keys).toContain('C');
    expect(keys).toContain('C#');
    expect(keys).toContain('D');
    expect(keys).toContain('D#');
    expect(keys).toContain('E');
    expect(keys).toContain('F');
    expect(keys).toContain('F#');
    expect(keys).toContain('G');
    expect(keys).toContain('G#');
    expect(keys).toContain('A');
    expect(keys).toContain('A#');
    expect(keys).toContain('B');
  });

  test('Base12Sym should have correct chromatic patterns', () => {
    expect(Base12Sym['C']).toEqual(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']);
    expect(Base12Sym['G']).toEqual(['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#']);
  });

  test('Base12Sym patterns should all be length 12', () => {
    Object.values(Base12Sym).forEach(pattern => {
      expect(pattern).toHaveLength(12);
    });
  });

  test('tuningPitch100 should contain correct number of pitches', () => {
    expect(tuningPitch100).toHaveLength(89);
  });

  test('tuningPitch100 should have correct min and max values', () => {
    const minPitch = tuningPitch100[0];
    const maxPitch = tuningPitch100[tuningPitch100.length - 1];
    
    expect(minPitch.id).toBe(0);
    expect(minPitch.keySym).toBe('C');
    expect(maxPitch.id).toBe(88);
    expect(maxPitch.keySym).toBe('E');
  });

  test('tuningPitch100 should have correct octave calculations', () => {
    const cNote = tuningPitch100.find(p => p.id === 48);
    expect(cNote?.oct).toBe(4);
    expect(cNote?.keyNum).toBe(0);
    expect(cNote?.keySym).toBe('C');
    
    const gNote = tuningPitch100.find(p => p.id === 55);
    expect(gNote?.oct).toBe(4);
    expect(gNote?.keyNum).toBe(7);
    expect(gNote?.keySym).toBe('G');
  });

  test('tuningPitch100 should have sequential IDs starting from 0', () => {
    expect(tuningPitch100[0].id).toBe(0);
    expect(tuningPitch100[1].id).toBe(1);
    expect(tuningPitch100[tuningPitch100.length - 1].id).toBe(88);
  });

  test('tuningPitch100 should have correct key number cycling', () => {
    const pitch12 = tuningPitch100[12];
    const pitch24 = tuningPitch100[24];
    
    expect(pitch12.keyNum).toBe(0);
    expect(pitch12.keySym).toBe('C');
    expect(pitch24.keyNum).toBe(0);
    expect(pitch24.keySym).toBe('C');
  });
});