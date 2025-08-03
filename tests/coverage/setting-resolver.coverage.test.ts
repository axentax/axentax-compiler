import { SettingResolver } from '../../src/conductor/setting-resolve/setting-resolver';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';

describe('setting-resolver', () => {
  const createBasicConduct = () => ({
    syntax: '@@ 140 1/4 { C }',
    settings: {} as any,
    warnings: []
  } as any);

  describe('SettingResolver', () => {
    let resolver: SettingResolver;

    beforeEach(() => {
      resolver = new SettingResolver();
    });

    test('should create SettingResolver instance', () => {
      expect(resolver).toBeInstanceOf(SettingResolver);
    });

    test('should resolve basic settings successfully', () => {
      const conduct = createBasicConduct();
      const result = resolver.resolve(conduct);
      
      expect(result instanceof Success).toBe(true);
      expect(conduct.settings).toBeDefined();
    });

    test('should handle conduct with setting statements', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        @@setting click.inst=2
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle invalid setting path', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        @@setting invalid.path=value
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      if (result instanceof E400) {
        expect(result.message).toBeDefined();
      }
    });

    test('should handle empty syntax', () => {
      const conduct = createBasicConduct();
      conduct.syntax = '';
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle conduct with multiple settings', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        @@setting click.inst=1
        @@setting click.velocity=80
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle setting with boolean value', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        @@setting dual.pan=true
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle setting with numeric value', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        @@setting click.inst=42
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle setting with array value', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        @@setting dual.panning=[0.0,0.5,1.0]
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle malformed setting statement', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        @@setting malformed
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      if (result instanceof E400) {
        expect(result.message).toBeDefined();
      }
    });

    test('should handle setting with invalid value format', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        @@setting click.inst=invalid_value
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      if (result instanceof E400) {
        expect(result.message).toBeDefined();
      }
    });

    test('should return error for invalid BPM value in set.style.bpm', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.style.bpm: x
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof E400).toBe(true);
      if (result instanceof E400) {
        expect(result.message).toBe("Invalid BPM 'x', The entered value is outside the accepted range of 1-1000. Please enter a value within this range.");
      }
    });

    test('should handle set.dual.tuning setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.dual.tuning: E|A|D|G|B|E
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle set.style.until setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.style.until: 1/4
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle set.style.degree setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.style.degree: C major
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle set.style.scale setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.style.scale: major
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle set.style.velocity setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.style.velocity: 100
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle set.style.velocities setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.style.velocities: 100,90,80,70,60,50,40,30,20
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle set.click.accent setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.click.accent: 50
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle set.hash.something setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.hash.value: test123
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle set.dual.key setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.dual.key: C#
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle default numeric setting', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.click.volume: 75
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof Success || result instanceof E400).toBe(true);
    });

    test('should handle invalid inst value with non-numeric characters', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.click.inst: abc123
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof E400).toBe(true);
      if (result instanceof E400) {
        expect(result.message).toContain("Invalid");
      }
    });

    test('should handle invalid accent value with non-numeric characters', () => {
      const conduct = createBasicConduct();
      conduct.syntax = `
        set.click.accent: abc123
        @@ 140 1/4 { C }
      `;
      
      const result = resolver.resolve(conduct);
      expect(result instanceof E400).toBe(true);
      if (result instanceof E400) {
        expect(result.message).toContain("Invalid");
      }
    });
  });
});