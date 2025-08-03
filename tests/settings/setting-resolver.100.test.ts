import { SettingResolver, normalization } from '../../src/conductor/setting-resolve/setting-resolver';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';
import { Conduct } from '../../src/conductor/interface/conduct';

describe('SettingResolver and Normalization Coverage Test', () => {

  const createConduct = (): Conduct => {
    const conduct = { syntax: '' } as Conduct;
    new SettingResolver().resolve(conduct);
    return conduct;
  };

  describe('SettingResolver.resolve', () => {
    let resolver: SettingResolver;

    beforeEach(() => {
      resolver = new SettingResolver();
    });

    test('should apply a variety of valid settings correctly', () => {
      const conduct = { syntax: '' } as Conduct;
      conduct.syntax = `
        set.style.until: 1/3
        set.click.velocity: 18
        set.click.inst: 22
        set.click.accent: 50
        set.style.scale: C minor
        set.dual.pan: false
        set.hash.compose: my-hash-string
      `;
      const result = resolver.resolve(conduct);

      expect(result).toBeInstanceOf(Success);
      expect(conduct.settings.style.until).toEqual([1, 3]);
      expect(conduct.settings.click.velocity).toBe(18);
      expect(conduct.settings.click.inst).toBe(22);
      expect(conduct.settings.click.accent).toBe(50);
      expect(conduct.settings.style.scale.key).toBe('C');
      expect(conduct.settings.style.scale.scale).toBe(1);
      expect(conduct.settings.dual.pan).toBe(false);
      expect(conduct.settings.hash.compose).toBe('my-hash-string');
    });

    test('should return E400 for invalid intermediate path', () => {
        const conduct = { syntax: '\nset.song.nonexistent.path: 123\n' } as Conduct;
        const result = resolver.resolve(conduct);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid settings because path 'song.nonexistent' is missing.");
        }
    });

    test('should return E400 for a completely invalid setting key', () => {
        const conduct = { syntax: '\nset.thisKeyDoesNotExist: 123\n' } as Conduct;
        const result = resolver.resolve(conduct);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid setting because path 'thisKeyDoesNotExist' is missing.");
        }
    });
  });

  describe('normalization (direct test for 100% coverage)', () => {
    const conduct = createConduct();

    test('hash: should fail if value is too long', () => {
      const result = normalization(conduct, 'compose', 'a'.repeat(2048), 'hash.compose', 1);
      expect(result).toBeInstanceOf(E400);
    });

    test('degree: should fail on invalid combination', () => {
      const result = normalization(conduct, 'degree', 'C melodic major', 'style.degree', 1);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) expect(result.message).toContain('Invalid scale combination');
    });

    test('degree: should fail on invalid token', () => {
      const result = normalization(conduct, 'degree', 'C major bad-token', 'style.degree', 1);
      expect(result).toBeInstanceOf(E400);
    });

    test('scale: should fail on invalid scale name', () => {
      const result = normalization(conduct, 'scale', 'C foobar', 'style.scale', 1);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) expect(result.message).toContain("Invalid scale token 'foobar'");
    });

    test('panning: should fail on malformed JSON', () => {
      const result = normalization(conduct, 'panning', '[0.1, 0.5,', 'dual.panning', 1);
      expect(result).toBeInstanceOf(E400);
    });

    test('panning: should fail on malformed JSON with extra comma', () => {
      const result = normalization(conduct, 'panning', '[0.5, ,0, 1]', 'dual.panning', 1);
      expect(result).toBeInstanceOf(E400);
    });

  });
});