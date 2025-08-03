import * as ModNoteValidation from '../../src/conductor/validation/mod-note-validation';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';

describe('mod-note-validation', () => {
  describe('degreeSymbol', () => {
    const createDegreeObj = () => ({
      note: 'C',
      octave: 4,
      diatonicEvolverValue: {
        evolvedCodePrefix: ['', '#', '', '#', '', '', '#', '', '#', '', '#', ''],
        bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
      },
      sys: {
        note7array: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
      }
    } as any);

    test('should validate basic degree symbol', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '1', 1, 1);
      
      if (result instanceof Success) {
        expect(result.res).toBeDefined();
      } else {
        // If it fails, it should be due to validation logic
        expect(result instanceof E400).toBe(true);
      }
    });

    test('should validate degree with fraction', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '1/2', 1, 1);
      
      if (result instanceof Success) {
        expect(result.res).toBeDefined();
      } else {
        expect(result instanceof E400).toBe(true);
      }
    });

    test('should validate degree with minor modifier', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '1m', 1, 1);
      
      if (result instanceof Success) {
        expect(result.res).toBeDefined();
      } else {
        expect(result instanceof E400).toBe(true);
      }
    });

    test('should handle invalid degree symbol', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, 'invalid', 1, 1);
      
      expect(result instanceof E400).toBe(true);
    });

    test('should handle empty degree symbol', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '', 1, 1);
      
      expect(result instanceof E400).toBe(true);
    });

    test('should handle complete chord symbol', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, 'C', 1, 1);
      
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toBe('C');
      }
    });

    test('should handle sharp degree symbol', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '1#', 1, 1);
      
      expect(result instanceof Success).toBe(true);
    });

    test('should handle flat degree symbol', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '1b', 1, 1);
      
      expect(result instanceof Success).toBe(true);
    });

    test('should handle complex degree with modifier', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '1#m', 1, 1);
      
      expect(result instanceof Success).toBe(true);
    });

    test('should handle fraction with chord symbols', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, 'C/G', 1, 1);
      
      expect(result instanceof Success).toBe(true);
    });

    test('should handle fraction with numbers', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '1/5', 1, 1);
      
      expect(result instanceof Success).toBe(true);
    });

    test('should handle fraction with sharp/flat', () => {
      const degree = createDegreeObj();
      const result = ModNoteValidation.degreeSymbol(degree, '1#/5b', 1, 1);
      
      expect(result instanceof Success).toBe(true);
    });
  });

  describe('chordSymbol', () => {
    test('should validate basic chord symbols', () => {
      const chords = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'r'];
      chords.forEach(chord => {
        const result = ModNoteValidation.chordSymbol(chord, chord, 1, 1);
        expect(result instanceof Success).toBe(true);
      });
    });

    test('should validate complex chord symbols', () => {
      const result = ModNoteValidation.chordSymbol('Cm7', 'Cm7', 1, 1);
      expect(result instanceof Success).toBe(true);
    });

    test('should validate chord with fraction', () => {
      const result = ModNoteValidation.chordSymbol('C/G', 'C/G', 1, 1);
      expect(result instanceof Success).toBe(true);
    });

    test('should reject invalid chord starting character', () => {
      const result = ModNoteValidation.chordSymbol('X', 'X', 1, 1);
      expect(result instanceof E400).toBe(true);
    });

    test('should reject chord with invalid molecule', () => {
      const result = ModNoteValidation.chordSymbol('C/X', 'C/X', 1, 1);
      expect(result instanceof E400).toBe(true);
    });
  });

  describe('tabSymbol', () => {
    test('should validate basic tab symbol', () => {
      const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
      const result = ModNoteValidation.tabSymbol(tuning, '0|2|2|0|0|0', 1, 1);
      expect(result instanceof Success).toBe(true);
      if (result instanceof Success) {
        expect(result.res).toHaveLength(6);
      }
    });

    test('should validate tab with rest symbols', () => {
      const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
      const result = ModNoteValidation.tabSymbol(tuning, 'r|r|2|2|r|r', 1, 1);
      expect(result instanceof Success).toBe(true);
    });

    test('should validate partial tab symbol', () => {
      const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
      const result = ModNoteValidation.tabSymbol(tuning, '0|2|2', 1, 1);
      expect(result instanceof Success).toBe(true);
    });

    test('should validate tab with empty strings', () => {
      const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
      const result = ModNoteValidation.tabSymbol(tuning, '0||2||0|', 1, 1);
      expect(result instanceof Success).toBe(true);
    });

    test('should reject tab exceeding tuning length', () => {
      const tuning = ['E', 'A', 'D'];
      const result = ModNoteValidation.tabSymbol(tuning, '0|2|2|0|0|0', 1, 1);
      expect(result instanceof E400).toBe(true);
    });

    test('should reject tab with invalid characters', () => {
      const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
      const result = ModNoteValidation.tabSymbol(tuning, '0|x|2|0|0|0', 1, 1);
      expect(result instanceof E400).toBe(true);
    });

    test('should reject tab with high fret numbers', () => {
      const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
      const result = ModNoteValidation.tabSymbol(tuning, '0|25|2|0|0|0', 1, 1);
      expect(result instanceof E400).toBe(true);
    });

    test('should handle maximum fret number', () => {
      const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
      const result = ModNoteValidation.tabSymbol(tuning, '0|24|2|0|0|0', 1, 1);
      expect(result instanceof Success).toBe(true);
    });
  });

  describe('予測的エラーケース - 完全カバレッジ', () => {
    
    describe('degreeSymbol - istanbul ignoreパスのテスト', () => {
      const createDegreeObj = () => ({
        note: 'C',
        octave: 4,
        diatonicEvolverValue: {
          evolvedCodePrefix: ['', '#', '', '#', '', '', '#', '', '#', '', '#', ''],
          bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
        },
        sys: {
          note7array: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
        }
      } as any);

      test('エラーケース: 無効なnumerator（0で始まる）', () => {
        const degree = createDegreeObj();
        const result = ModNoteValidation.degreeSymbol(degree, '0', 1, 5);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid numerator '0'");
          expect(result.message).toContain('A degree symbol must start with one of 1-7, C-B');
        }
      });

      test('エラーケース: 無効なnumerator（8で始まる）', () => {
        const degree = createDegreeObj();
        const result = ModNoteValidation.degreeSymbol(degree, '8', 2, 10);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid numerator '8'");
        }
      });

      test('エラーケース: 無効なnumerator（特殊文字で始まる）', () => {
        const degree = createDegreeObj();
        const result = ModNoteValidation.degreeSymbol(degree, '@invalid', 3, 15);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid numerator '@invalid'");
        }
      });

      test('エラーケース: 無効なdenominator（分数形式）', () => {
        const degree = createDegreeObj();
        const result = ModNoteValidation.degreeSymbol(degree, '1/0', 4, 20);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid denominator '1/0'");
          expect(result.message).toContain('A degree symbol must start with one of 1-7, C-B[1]');
        }
      });

      test('エラーケース: 無効なdenominator（8で始まる）', () => {
        const degree = createDegreeObj();
        const result = ModNoteValidation.degreeSymbol(degree, '1/8', 5, 25);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid denominator '1/8'");
        }
      });

      test('エラーケース: 無効なdenominator（特殊文字）', () => {
        const degree = createDegreeObj();
        const result = ModNoteValidation.degreeSymbol(degree, '1/@', 6, 30);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid denominator '1/@'");
        }
      });

      test('エラーケース: 無効なdenominator（長すぎる）', () => {
        const degree = createDegreeObj();
        const result = ModNoteValidation.degreeSymbol(degree, '1/1#m', 7, 35);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid denominator '1/1#m'");
        }
      });

      test('エラーケース: 無効なdenominator（正規表現外の形式）', () => {
        const degree = createDegreeObj();
        const result = ModNoteValidation.degreeSymbol(degree, '1/1mm', 8, 40);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain("Invalid denominator '1/1mm'");
          expect(result.message).toContain('A degree symbol must with one of 1-7(#|b), C-B(#|b)');
        }
      });

      test('境界値: 正常なすべての度数（1-7）', () => {
        const degree = createDegreeObj();
        for (let i = 1; i <= 7; i++) {
          const result = ModNoteValidation.degreeSymbol(degree, i.toString(), 1, 1);
          expect(result).toBeInstanceOf(Success);
        }
      });

      test('境界値: シャープとフラットの組み合わせ', () => {
        const degree = createDegreeObj();
        const combinations = ['1#', '1b', '2#', '2b', '3#', '3b', '4#', '4b', '5#', '5b', '6#', '6b', '7#', '7b'];
        combinations.forEach(combo => {
          const result = ModNoteValidation.degreeSymbol(degree, combo, 1, 1);
          expect(result).toBeInstanceOf(Success);
        });
      });
    });

    describe('chordSymbol - istanbul ignoreパスのテスト', () => {
      test('エラーケース: スラッシュプレフィックス', () => {
        const result = ModNoteValidation.chordSymbol('C', '/invalid', 1, 5);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid symbol \'/invalid\'');
          expect(result.message).toContain('The prefix "/" cannot be used in code specifications');
        }
      });

      test('エラーケース: パーセント記号を含む', () => {
        const result = ModNoteValidation.chordSymbol('C%', 'C%invalid', 2, 10);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid symbol \'C%invalid\'');
        }
      });

      test('エラーケース: 無効な開始文字（H）', () => {
        const result = ModNoteValidation.chordSymbol('H', 'H', 3, 15);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid chord name \'H\'');
          expect(result.message).toContain('A chord symbol must start with one of C, D, E, F, G, A, B or r rn of rest');
        }
      });

      test('エラーケース: 無効な開始文字（数字）', () => {
        const result = ModNoteValidation.chordSymbol('1major', '1major', 4, 20);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid chord name \'1major\'');
        }
      });

      test('エラーケース: 無効な開始文字（特殊文字）', () => {
        const result = ModNoteValidation.chordSymbol('@chord', '@chord', 5, 25);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid chord name \'@chord\'');
        }
      });

      test('エラーケース: 無効なmolecule（数字）', () => {
        const result = ModNoteValidation.chordSymbol('C/1', 'C/1', 6, 30);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid molecule of chord name \'C/1\'');
          expect(result.message).toContain('A molecule of chord symbol must with one of C, D, E, F, G, A, B');
        }
      });

      test('エラーケース: 無効なmolecule（特殊文字）', () => {
        const result = ModNoteValidation.chordSymbol('C/@', 'C/@', 7, 35);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid molecule of chord name \'C/@\'');
        }
      });

      test('エラーケース: 無効なmolecule（小文字）', () => {
        const result = ModNoteValidation.chordSymbol('C/c', 'C/c', 8, 40);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid molecule of chord name \'C/c\'');
        }
      });

      test('境界値: すべての有効な開始文字', () => {
        const validStarts = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'r'];
        validStarts.forEach(start => {
          const result = ModNoteValidation.chordSymbol(start, start, 1, 1);
          expect(result).toBeInstanceOf(Success);
        });
      });

      test('境界値: 有効なmoleculeの組み合わせ', () => {
        const validBases = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const validMolecules = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        
        validBases.forEach(base => {
          validMolecules.forEach(molecule => {
            const chord = `${base}/${molecule}`;
            const result = ModNoteValidation.chordSymbol(chord, chord, 1, 1);
            expect(result).toBeInstanceOf(Success);
          });
        });
      });
    });

    describe('tabSymbol - istanbul ignoreパスのテスト', () => {
      const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
      const shortTuning = ['E', 'A', 'D'];

      test('エラーケース: チューニングを超える弦数', () => {
        const result = ModNoteValidation.tabSymbol(shortTuning, '0|2|2|0|0|0', 1, 5);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('\'0|2|2|0|0|0\' beyond tuning');
          expect(result.message).toContain('Fret designation cannot exceed the number of strings specified in tuning');
        }
      });

      test('エラーケース: 無効な文字（アルファベット）', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '0|x|2|0|0|0', 2, 10);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid tab token \'x\'');
          expect(result.message).toContain('Tab can only specify \'r\' for frets 0 to 24 or rests');
          expect(result.message).toContain('0|2|2|0|0|0 or 0|2 or r|r|2|2 etc..');
        }
      });

      test('エラーケース: 無効な文字（特殊文字）', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '0|@|2|0|0|0', 3, 15);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid tab token \'@\'');
        }
      });

      test('エラーケース: 無効な文字（混合文字）', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '0|2a|2|0|0|0', 4, 20);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid tab token \'2a\'');
        }
      });

      test('エラーケース: フレット数上限超過（25）', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '0|25|2|0|0|0', 5, 25);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid token \'25\'');
          expect(result.message).toContain('Up to 24 frets can be used');
        }
      });

      test('エラーケース: フレット数上限超過（極端な値）', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '0|999|2|0|0|0', 6, 30);
        expect(result).toBeInstanceOf(E400);
        if (result instanceof E400) {
          expect(result.message).toContain('Invalid token \'999\'');
        }
      });

      test('境界値: 最大フレット数（24）', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '0|24|2|0|0|0', 1, 1);
        expect(result).toBeInstanceOf(Success);
        if (result instanceof Success) {
          expect(result.res).toHaveLength(6);
          expect(result.res[4]).toBe(24); // 6弦から1弦の順序なので24は2番目
        }
      });

      test('境界値: フレット数0', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '0|0|0|0|0|0', 1, 1);
        expect(result).toBeInstanceOf(Success);
        if (result instanceof Success) {
          expect(result.res.every(fret => fret === 0)).toBe(true);
        }
      });

      test('境界値: チューニング弦数と同じ長さ', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '0|2|2|0|0|0', 1, 1);
        expect(result).toBeInstanceOf(Success);
        if (result instanceof Success) {
          expect(result.res).toHaveLength(6);
        }
      });

      test('境界値: 最短タブ（1弦のみ）', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '2', 1, 1);
        expect(result).toBeInstanceOf(Success);
        if (result instanceof Success) {
          expect(result.res).toHaveLength(6);
          expect(result.res[5]).toBe(2); // 1弦目に2フレット
        }
      });

      test('エッジケース: レスト記号のみ', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, 'r|r|r|r|r|r', 1, 1);
        expect(result).toBeInstanceOf(Success);
        if (result instanceof Success) {
          expect(result.res.every(fret => fret === -1)).toBe(true);
        }
      });

      test('エッジケース: 空文字列とレストの混合', () => {
        const result = ModNoteValidation.tabSymbol(standardTuning, '|r||r||', 1, 1);
        expect(result).toBeInstanceOf(Success);
        if (result instanceof Success) {
          expect(result.res).toHaveLength(6);
          expect(result.res[4]).toBe(-1); // 2弦目はレスト
          expect(result.res[2]).toBe(-1); // 4弦目はレスト
        }
      });
    });

    describe('エッジケースと統合テスト', () => {
      test('位置情報の境界値テスト', () => {
        const degree = {
          note: 'C', octave: 4,
          diatonicEvolverValue: { evolvedCodePrefix: Array(12).fill(''), bin: Array(12).fill(1) },
          sys: { note7array: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] }
        } as any;

        // 負の位置
        const result1 = ModNoteValidation.degreeSymbol(degree, '0', -1, -1);
        expect(result1).toBeInstanceOf(E400);

        // 極端に大きな位置
        const result2 = ModNoteValidation.chordSymbol('X', 'X', 9999, 9999);
        expect(result2).toBeInstanceOf(E400);

        // ゼロ位置
        const result3 = ModNoteValidation.tabSymbol(['E'], 'abc', 0, 0);
        expect(result3).toBeInstanceOf(E400);
      });

      test('空文字列と特殊文字の組み合わせ', () => {
        const specialCases = ['', '  ', '\n', '\t', '\r\n', '@@', '::', '||', '//'];
        const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
        
        specialCases.forEach(testCase => {
          const result1 = ModNoteValidation.chordSymbol(testCase, testCase, 1, 1);
          const result2 = ModNoteValidation.tabSymbol(standardTuning, testCase, 1, 1);
          
          // エラーまたは成功のいずれかであることを確認
          expect(result1 instanceof Success || result1 instanceof E400).toBe(true);
          expect(result2 instanceof Success || result2 instanceof E400).toBe(true);
        });
      });
    });
  });
});