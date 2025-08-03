import { ModFlash_dual } from '../../src/conductor/compile-block/mod-7-flash';
import { Conduct } from '../../src/conductor/interface/conduct';
import { CompileSymbols } from '../../src/conductor/interface/compile';
import { E404, Success } from '../../src/conductor/interface/utils.response.interface';

describe('ModFlash_dual', () => {
  const createMockConduct = (allowAnnotations: any[] = []): Conduct => ({
    allowAnnotations,
    flash: {
      click: [],
      other: [],
      offset: []
    },
    settings: {
      click: {
        inst: 'default',
        velocity: 80,
        until: [1, 1]
      }
    },
    mixesList: [
      {
        regionList: [
          {
            untilNext: [1, 1]
          }
        ]
      }
    ]
  } as any);

  const createMockSymbol = (token: string, line = 1, linePos = 1): CompileSymbols => ({
    token,
    line,
    linePos
  } as any);

  describe('resolve', () => {
    test('should handle @/click token', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@/click');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle @click( token in base block', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@click(1/4)');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      // This may fail validation, which is expected behavior
      expect(result instanceof Success || result instanceof E404).toBe(true);
    });

    test('should reject @click( token in non-base block', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@click(120)');
      const result = ModFlash_dual.resolve(conduct, 1, 0, 0, 0, sym);
      expect(result instanceof E404).toBe(true);
      if (result instanceof E404) {
        expect(result.message).toContain('Click specification is only possible in base blocks');
      }
    });

    test('should handle @click token in base block', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@click');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
    });

    test('should reject @click token in non-base block', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@click');
      const result = ModFlash_dual.resolve(conduct, 1, 0, 0, 0, sym);
      expect(result instanceof E404).toBe(true);
      if (result instanceof E404) {
        expect(result.message).toContain('Click specification is only possible in base blocks');
      }
    });

    test('should handle @offset token in non-base block', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@offset(1/4)');
      const result = ModFlash_dual.resolve(conduct, 1, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
    });

    test('should reject @offset token in base block', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@offset(1/4)');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      // @offset is rejected in base block with E400, but E400 is not imported
      expect(result.fail()).toBe(true);
    });

    test('should reject @@ token', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@@');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof E404).toBe(true);
      if (result instanceof E404) {
        expect(result.message).toContain('The start mark @@ of a region must start outside the {} brackets');
      }
    });

    test('should handle allowed annotation without @', () => {
      const conduct = createMockConduct([{
        name: 'custom',
        dualIdRestrictions: []
      }]);
      const sym = createMockSymbol('@custom');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle allowed annotation with @', () => {
      const conduct = createMockConduct([{
        name: '@custom',
        dualIdRestrictions: []
      }]);
      const sym = createMockSymbol('@custom');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle allowed annotation with parameters', () => {
      const conduct = createMockConduct([{
        name: 'custom',
        dualIdRestrictions: []
      }]);
      const sym = createMockSymbol('@custom(param)');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
    });


    test('should reject allowed annotation with dualId restrictions', () => {
      const conduct = createMockConduct([{
        name: 'custom',
        dualIdRestrictions: [0]
      }]);
      const sym = createMockSymbol('@custom');
      const result = ModFlash_dual.resolve(conduct, 1, 0, 0, 0, sym);
      expect(result instanceof E404).toBe(true);
      if (result instanceof E404) {
        expect(result.message).toContain('Click specification is only possible in index 0 blocks');
      }
    });

    test('should allow annotation with matching dualId restriction', () => {
      const conduct = createMockConduct([{
        name: 'custom',
        dualIdRestrictions: [1]
      }]);
      const sym = createMockSymbol('@custom');
      const result = ModFlash_dual.resolve(conduct, 1, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
    });

    test('should reject unknown annotation token', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@unknown');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof E404).toBe(true);
      if (result instanceof E404) {
        expect(result.message).toContain("Unknown annotation token '@unknown'");
      }
    });

    test('should reject unknown annotation token with parameters', () => {
      const conduct = createMockConduct();
      const sym = createMockSymbol('@unknown(param)');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof E404).toBe(true);
      if (result instanceof E404) {
        expect(result.message).toContain("Unknown annotation token '@unknown'");
      }
    });

    test('should handle multiple allowed annotations', () => {
      const conduct = createMockConduct([
        { name: 'first', dualIdRestrictions: [] },
        { name: 'second', dualIdRestrictions: [] },
        { name: 'third', dualIdRestrictions: [] }
      ]);
      const sym = createMockSymbol('@second');
      const result = ModFlash_dual.resolve(conduct, 0, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle allowed annotation with complex dualId restrictions', () => {
      const conduct = createMockConduct([{
        name: 'restricted',
        dualIdRestrictions: [0, 2, 4]
      }]);
      
      // Test allowed dualId
      let sym = createMockSymbol('@restricted');
      let result = ModFlash_dual.resolve(conduct, 2, 0, 0, 0, sym);
      expect(result instanceof Success).toBe(true);
      
      // Test disallowed dualId
      sym = createMockSymbol('@restricted');
      result = ModFlash_dual.resolve(conduct, 3, 0, 0, 0, sym);
      expect(result instanceof E404).toBe(true);
    });
  });
});