import * as ModFlashValidation from '../../src/conductor/validation/mod-flash-validation';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';

describe('mod-flash-validation', () => {
  const createConduct = () => ({
    flash: {
      other: [],
      offset: {},
      click: []
    },
    settings: {
      click: {
        inst: 1,
        velocity: 100,
        until: [1, 4]
      }
    },
    mixesList: [
      {
        regionList: [
          { untilNext: [1, 4] }
        ]
      }
    ]
  } as any);

  describe('allowAnnotation', () => {
    test('should add annotation', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.allowAnnotation(conduct, 0, 0, 0, 0, 'test', 'token', 1, 1);
      expect(result instanceof Success).toBe(true);
      expect(conduct.flash.other.length).toBe(1);
      expect(conduct.flash.other[0].name).toBe('test');
    });
  });

  describe('offset', () => {
    test('should error on dualId 0', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.offset(conduct, 0, 0, 0, 'token', 1, 1);
      expect(result instanceof E400).toBe(true);
    });

    test('should add offset', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.offset(conduct, 1, 0, 2, 'token', 1, 1);
      expect(result instanceof Success).toBe(true);
      expect(conduct.flash.offset['1_0']).toBeDefined();
      expect(conduct.flash.offset['1_0'].blockNoteIndex).toBe(2);
    });

    test('should error on duplicate offset', () => {
      const conduct = createConduct();
      conduct.flash.offset['1_0'] = { syntaxLocation: { row: 'token', line: 1, linePos: 1 }, blockNoteIndex: 2 };
      const result = ModFlashValidation.offset(conduct, 1, 0, 2, 'token', 1, 1);
      expect(result instanceof E400).toBe(true);
    });
  });

  describe('click', () => {
    test('should error on dualId !== 0', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.click(conduct, 1, 0, 0, '@click', 1, 1);
      expect(result instanceof E400).toBe(true);
    });

    test('should add stop click', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.click(conduct, 0, 0, 0, '@/click', 1, 1);
      expect(result instanceof Success).toBe(true);
      expect(conduct.flash.click[0].stop).toBeDefined();
    });

    test('should add start click (empty)', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.click(conduct, 0, 0, 0, '@click', 1, 1);
      expect(result instanceof Success).toBe(true);
      expect(conduct.flash.click[0].start).toBeDefined();
    });

    test('should add start click (with fraction)', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.click(conduct, 0, 0, 0, '@click(1/2)', 1, 1);
      expect(result instanceof Success).toBe(true);
      expect(conduct.flash.click[0].start).toBeDefined();
    });

    test('should add start click (with another fraction)', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.click(conduct, 0, 0, 0, '@click(1/3)', 1, 1);
      expect(result instanceof Success).toBe(true);
      expect(conduct.flash.click[0].start).toBeDefined();
    });

    test('should error on invalid click step', () => {
      const conduct = createConduct();
      // @click(0) は untilNext = 0 でエラーになる想定
      const result = ModFlashValidation.click(conduct, 0, 0, 0, '@click(0)', 1, 1);
      expect(result instanceof E400).toBe(true);
    });

    test('should error on invalid click format', () => {
      const conduct = createConduct();
      // @click(2) は不正な形式でエラーになる想定
      const result = ModFlashValidation.click(conduct, 0, 0, 0, '@click(2)', 1, 1);
      expect(result instanceof E400).toBe(true);
    });

    test('should return error for click syntax with zero denominator', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.click(conduct, 0, 0, 0, '@click(1/0)', 11, 3);
      expect(result instanceof E400).toBe(true);
      if (result instanceof E400) {
        expect(result.message).toBe("Invalid token '1/0', The entered value is outside the accepted range of 1-128. Please enter a value within this range.");
      }
    });

    test('should return error for click syntax with zero numerator', () => {
      const conduct = createConduct();
      const result = ModFlashValidation.click(conduct, 0, 0, 0, '@click(0/1)', 11, 0);
      expect(result instanceof E400).toBe(true);
      if (result instanceof E400) {
        expect(result.message).toBe("Invalid click step value '0', The entered value is outside the accepted range.");
      }
    });
  });
}); 