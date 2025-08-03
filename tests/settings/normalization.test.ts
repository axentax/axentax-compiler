import { normalization } from '../../src/conductor/setting-resolve/setting-resolver';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';
import { Conduct } from '../../src/conductor/interface/conduct';
import { SettingResolver } from '../../src/conductor/setting-resolve/setting-resolver';

describe('normalization() Full Coverage Test', () => {

  const createConduct = (): Conduct => {
    const conduct = { syntax: '' } as Conduct;
    new SettingResolver().resolve(conduct); // To initialize settings
    return conduct;
  };

  const conduct = createConduct();

  // Test Suite for each 'case' in the switch statement

  describe('hash', () => {
    test('should pass for valid hash string', () => {
      const result = normalization(conduct, 'compose', 'a-valid-hash', 'hash.compose', 1);
      expect(result).toBeInstanceOf(Success);
      if (result instanceof Success) expect(result.res).toBe('a-valid-hash');
    });
    test('should fail if value is too long', () => {
      const result = normalization(conduct, 'compose', 'a'.repeat(2048), 'hash.compose', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('tuning', () => {
    test('should fail for invalid tuning string', () => {
      const result = normalization(conduct, 'tuning', 'E|A|D|G|B|X', 'style.tuning', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('until', () => {
    test('should fail for invalid fraction format', () => {
      const result = normalization(conduct, 'until', '1-4', 'style.until', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('degree', () => {
    test('should fail for invalid scale combination', () => {
      const result = normalization(conduct, 'degree', 'C melodic major', 'style.degree', 1);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) expect(result.message).toContain('Invalid scale combination');
    });
    test('should fail for invalid token', () => {
      const result = normalization(conduct, 'degree', 'C major bad-token', 'style.degree', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('scale', () => {
    test('should fail for invalid scale name', () => {
      const result = normalization(conduct, 'scale', 'C foobar', 'style.scale', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('bpm', () => {
    test('should fail for out-of-range value', () => {
      const result = normalization(conduct, 'bpm', '9999', 'style.bpm', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('velocity', () => {
    test('should fail for out-of-range value', () => {
      const result = normalization(conduct, 'velocity', '-10', 'style.velocity', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('velocities', () => {
    test('should fail for invalid content', () => {
      const result = normalization(conduct, 'velocities', '1,2,foo', 'play.velocities', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('inst', () => {
    test('should fail for non-digit value', () => {
      const result = normalization(conduct, 'inst', 'abc', 'click.inst', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('accent', () => {
    test('should fail for non-digit value', () => {
      const result = normalization(conduct, 'accent', '1.5', 'click.accent', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('pan & mappingNotResolved', () => {
    test('should fail for non-boolean value', () => {
      const result = normalization(conduct, 'pan', 'yes', 'dual.pan', 1);
      expect(result).toBeInstanceOf(E400);
    });
    test('should correctly parse \'true\'', () => {
      const result = normalization(conduct, 'mappingNotResolved', 'true', 'compile.mappingNotResolved', 1);
      expect(result).toBeInstanceOf(Success);
      if (result instanceof Success) expect(result.res).toBe(true);
    });
    test('should correctly parse \'false\'', () => {
      const result = normalization(conduct, 'pan', 'false', 'dual.pan', 1);
      expect(result).toBeInstanceOf(Success);
      if (result instanceof Success) expect(result.res).toBe(false);
    });
  });

  describe('panning', () => {
    test('should fail for non-array string', () => {
      const result = normalization(conduct, 'panning', '0.5, 0.5', 'dual.panning', 1);
      expect(result).toBeInstanceOf(E400);
    });
    test('should fail on malformed JSON', () => {
      const result = normalization(conduct, 'panning', '[0.1, 0.5,', 'dual.panning', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('key', () => {
    test('should fail for invalid key name', () => {
      const result = normalization(conduct, 'key', 'H', 'song.key', 1);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('default', () => {
    test('should parse a valid integer', () => {
      const result = normalization(conduct, 'someOtherNumericSetting', '123', 'play.someOtherNumericSetting', 1);
      expect(result).toBeInstanceOf(Success);
      if (result instanceof Success) expect(result.res).toBe(123);
    });
  });
});
