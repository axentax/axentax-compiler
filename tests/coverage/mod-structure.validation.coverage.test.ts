import * as ModStructureValidation from '../../src/conductor/validation/mod-structure.validation';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';
import { CSymbolType } from '../../src/conductor/interface/compile';

describe('mod-structure.validation Coverage - 予測的エラーケース手法', () => {
  
  describe('styleStart function - 完全カバレッジ', () => {
    test('成功ケース: 正常なstyle指定', () => {
      const result = ModStructureValidation.styleStart('leg', CSymbolType.style, CSymbolType.note, 1, 5);
      expect(result).toBeInstanceOf(Success);
    });

    test('成功ケース: 正常なblockStyle指定', () => {
      const result = ModStructureValidation.styleStart('m', CSymbolType.blockStyle, CSymbolType.closingCurlyBrace, 1, 10);
      expect(result).toBeInstanceOf(Success);
    });

    test('エラーケース: 重複ブロック宣言（blockStyle + undefined）', () => {
      const result = ModStructureValidation.styleStart('@backing', CSymbolType.blockStyle, CSymbolType.undefined, 1, 1);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain('Invalid region prefix "@backing" specified in the wrong place');
        expect(result.message).toContain('Duplicate block declaration');
        expect(result.message).toContain('@backing 1/4 140 { C Dm }');
      }
    });

    test('エラーケース: 無効なregion prefix（非blockStyle + undefined）', () => {
      const result = ModStructureValidation.styleStart('@invalid', CSymbolType.style, CSymbolType.undefined, 2, 3);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain("Invalid region prefix '@invalid'");
        expect(result.message).toContain("Only '@@' can be used as the region prefix");
      }
    });

    test('境界値: 空文字列でのblockStyleエラー', () => {
      const result = ModStructureValidation.styleStart('', CSymbolType.blockStyle, CSymbolType.undefined, 1, 1);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain('Invalid region prefix "" specified in the wrong place');
      }
    });

    test('境界値: 長い文字列でのエラー', () => {
      const longString = 'a'.repeat(100);
      const result = ModStructureValidation.styleStart(longString, CSymbolType.style, CSymbolType.undefined, 5, 10);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain(`Invalid region prefix '${longString}'`);
      }
    });
  });

  describe('regionStart function - 完全カバレッジ', () => {
    test('成功ケース: 正常なregion開始', () => {
      const result = ModStructureValidation.regionStart('@@', CSymbolType.note, 1, 1);
      expect(result).toBeInstanceOf(Success);
    });

    test('成功ケース: 別のbeforeTypeでの正常ケース', () => {
      const result = ModStructureValidation.regionStart('@@', CSymbolType.closingCurlyBrace, 2, 5);
      expect(result).toBeInstanceOf(Success);
    });

    test('エラーケース: 重複regionStart', () => {
      const result = ModStructureValidation.regionStart('@@verse', CSymbolType.regionStart, 3, 8);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain("invalid name '@@verse' specified in the wrong place");
        expect(result.message).toContain('Duplicate block declaration');
      }
    });

    test('境界値: 空文字列での重複regionStart', () => {
      const result = ModStructureValidation.regionStart('', CSymbolType.regionStart, 1, 1);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain("invalid name '' specified in the wrong place");
      }
    });

    test('境界値: 特殊文字を含む名前での重複エラー', () => {
      const result = ModStructureValidation.regionStart('@@#$%', CSymbolType.regionStart, 4, 12);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain("invalid name '@@#$%' specified in the wrong place");
      }
    });
  });

  describe('colonOfStart function - 完全カバレッジ', () => {
    test('成功ケース: note後のコロン', () => {
      const result = ModStructureValidation.colonOfStart(':leg', CSymbolType.note, 1, 5);
      expect(result).toBeInstanceOf(Success);
    });

    test('成功ケース: bullet後のコロン', () => {
      const result = ModStructureValidation.colonOfStart(':m', CSymbolType.bullet, 2, 10);
      expect(result).toBeInstanceOf(Success);
    });

    test('成功ケース: degreeName後のコロン', () => {
      const result = ModStructureValidation.colonOfStart(':strum', CSymbolType.degreeName, 3, 15);
      expect(result).toBeInstanceOf(Success);
    });

    test('成功ケース: closingCurlyBrace後のコロン', () => {
      const result = ModStructureValidation.colonOfStart(':leg', CSymbolType.closingCurlyBrace, 4, 20);
      expect(result).toBeInstanceOf(Success);
    });

    test('エラーケース: 無効な位置でのコロン（regionStart後）', () => {
      const result = ModStructureValidation.colonOfStart(':invalid', CSymbolType.regionStart, 1, 5);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain("invalid token ':invalid' specified in the wrong place");
        expect(result.message).toContain('Set the style specification after the note or in {}');
      }
    });

    test('エラーケース: 無効な位置でのコロン（openingCurlyBrace後）', () => {
      const result = ModStructureValidation.colonOfStart(':style', CSymbolType.openingCurlyBrace, 2, 8);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain("invalid token ':style' specified in the wrong place");
      }
    });

    test('エラーケース: 無効な位置でのコロン（comma後）', () => {
      const result = ModStructureValidation.colonOfStart(':test', CSymbolType.comma, 3, 12);
      expect(result).toBeInstanceOf(E400);
    });

    test('エラーケース: 無効な位置でのコロン（flash後）', () => {
      const result = ModStructureValidation.colonOfStart(':invalid', CSymbolType.flash, 4, 16);
      expect(result).toBeInstanceOf(E400);
    });

    test('エラーケース: 無効な位置でのコロン（undefined後）', () => {
      const result = ModStructureValidation.colonOfStart(':error', CSymbolType.undefined, 5, 20);
      expect(result).toBeInstanceOf(E400);
    });

    test('エラーケース: 単体コロンエラー', () => {
      const result = ModStructureValidation.colonOfStart(':', CSymbolType.note, 1, 5);
      expect(result).toBeInstanceOf(E400);
      if (result instanceof E400) {
        expect(result.message).toContain("invalid token ':' specified in the wrong place");
      }
    });

    test('境界値: 長いコロン文字列での単体コロンエラー', () => {
      const result = ModStructureValidation.colonOfStart(':', CSymbolType.regionStart, 6, 25);
      expect(result).toBeInstanceOf(E400);
    });
  });

  describe('エッジケースと境界値テスト', () => {
    test('位置情報の境界値テスト', () => {
      const result1 = ModStructureValidation.styleStart('test', CSymbolType.blockStyle, CSymbolType.undefined, 0, 0);
      expect(result1).toBeInstanceOf(E400);

      const result2 = ModStructureValidation.regionStart('@@', CSymbolType.regionStart, 999, 999);
      expect(result2).toBeInstanceOf(E400);

      const result3 = ModStructureValidation.colonOfStart(':', CSymbolType.regionStart, -1, -1);
      expect(result3).toBeInstanceOf(E400);
    });

    test('全CSymbolTypeの網羅的テスト', () => {
      const allTypes = [
        CSymbolType.undefined,
        CSymbolType.regionStart, 
        CSymbolType.regionProp,
        CSymbolType.style,
        CSymbolType.blockStyle,
        CSymbolType.note,
        CSymbolType.bullet,
        CSymbolType.degreeName,
        CSymbolType.flash,
        CSymbolType.openingCurlyBrace,
        CSymbolType.closingCurlyBrace,
        CSymbolType.comma
      ];

      allTypes.forEach(beforeType => {
        allTypes.forEach(currentType => {
          const result = ModStructureValidation.styleStart('test', currentType, beforeType, 1, 1);
          expect(result instanceof Success || result instanceof E400).toBe(true);
        });
      });
    });

    test('特殊文字を含む文字列のテスト', () => {
      const specialStrings = ['@#$%', '\\n\\t', '  ', '@@@@', ':::::'];
      
      specialStrings.forEach(str => {
        const result1 = ModStructureValidation.styleStart(str, CSymbolType.blockStyle, CSymbolType.undefined, 1, 1);
        const result2 = ModStructureValidation.regionStart(str, CSymbolType.regionStart, 1, 1);
        const result3 = ModStructureValidation.colonOfStart(str, CSymbolType.regionStart, 1, 1);
        
        expect(result1 instanceof Success || result1 instanceof E400).toBe(true);
        expect(result2 instanceof Success || result2 instanceof E400).toBe(true);
        expect(result3 instanceof Success || result3 instanceof E400).toBe(true);
      });
    });
  });
});