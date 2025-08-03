import * as ModLegatoValidation from '../../src/conductor/validation/mod-legato-validation';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';

describe('mod-legato-validation', () => {
  const createTabObj = (regionIndex: number, noteStr: string) => ({
    regionIndex,
    noteStr,
    syntaxLocation: {
      line: 1,
      linePos: 1
    }
  } as any);

  describe('valid', () => {
    test('should pass validation for same region', () => {
      const legTOLine = [
        createTabObj(0, 'C'),
        createTabObj(0, 'D'),
        createTabObj(0, 'E')
      ];
      
      const result = ModLegatoValidation.valid(legTOLine);
      expect(result instanceof Success).toBe(true);
    });

    test('should fail validation for different regions', () => {
      const legTOLine = [
        createTabObj(0, 'C'),
        createTabObj(1, 'D')
      ];
      
      const result = ModLegatoValidation.valid(legTOLine);
      expect(result instanceof E400).toBe(true);
      if (result instanceof E400) {
        expect(result.message).toContain('Invalid legato place');
        expect(result.message).toContain('Legato cannot be applied across regions');
      }
    });

    test('should handle single note (no validation needed)', () => {
      const legTOLine = [
        createTabObj(0, 'C')
      ];
      
      const result = ModLegatoValidation.valid(legTOLine);
      expect(result instanceof Success).toBe(true);
    });

    test('should fail validation when crossing regions in middle of sequence', () => {
      const legTOLine = [
        createTabObj(0, 'C'),
        createTabObj(0, 'D'),
        createTabObj(1, 'E'),
        createTabObj(1, 'F')
      ];
      
      const result = ModLegatoValidation.valid(legTOLine);
      expect(result instanceof E400).toBe(true);
      if (result instanceof E400) {
        expect(result.message).toContain('Invalid legato place \'E\'');
      }
    });
  });
});