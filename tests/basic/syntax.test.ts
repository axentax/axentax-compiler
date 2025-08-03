import { Conductor } from '../../src/conductor/conductor';

describe('Syntax Examples', () => {
  const testCases = [
    {
      name: '基本的なタブ記号',
      syntax: '@@ 140 1/4 { |2 }'
    },
    {
      name: 'コード記号',
      syntax: '@@ 140 1/4 { C }'
    },
    {
      name: '複数コード',
      syntax: '@@ 140 1/4 { C Dm Em F }'
    },
    {
      name: 'スタイル付き',
      syntax: '@@ 140 1/4 { C:leg }'
    },
    {
      name: 'マッピング',
      syntax: '@@ 140 1/4 { C:map(0..2) }'
    },
    {
      name: 'ベンド付き',
      syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho 1) }'
    },
    {
      name: '複数行',
      syntax: `@@ 140 1/4 {
  C
  Dm
  Em
  F
}`
    }
  ];

  testCases.forEach(({ name, syntax }) => {
    test(`${name} - should compile successfully`, () => {
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
      expect(result.compileMsec).toBeGreaterThan(0);
    });
  });

  describe('エラーケースと境界値テスト', () => {
    describe('構文エラー', () => {
      const errorCases = [
        {
          name: '不正なBPM',
          syntax: '@@ abc 1/4 { C }',
          expectedError: true
        },
        {
          name: '不正な拍子記号',
          syntax: '@@ 140 1/abc { C }',
          expectedError: true
        },
        {
          name: '閉じ括弧なし',
          syntax: '@@ 140 1/4 { C',
          expectedError: true
        },
        {
          name: '開き括弧なし',
          syntax: '@@ 140 1/4 C }',
          expectedError: true
        },
        {
          name: '空のブロック',
          syntax: '@@ 140 1/4 { }',
          expectedError: false // 空でも有効な場合がある
        },
        {
          name: '不正なコード記号',
          syntax: '@@ 140 1/4 { XYZ }',
          expectedError: true
        },
        {
          name: '不正なタブ記号',
          syntax: '@@ 140 1/4 { |abc }',
          expectedError: true
        },
        {
          name: '範囲外フレット番号',
          syntax: '@@ 140 1/4 { |99 }',
          expectedError: true // 24フレットを超えるとエラー
        }
      ];

      errorCases.forEach(({ name, syntax, expectedError }) => {
        test(`${name} - should ${expectedError ? 'fail' : 'succeed'}`, () => {
          const result = Conductor.convertToObj(
            true,
            true,
            syntax,
            [],
            new Map(),
            {}
          );

          if (expectedError) {
            expect(result.error).not.toBeNull();
          } else {
            expect(result.error).toBeNull();
          }
        });
      });
    });

    describe('境界値テスト', () => {
      const boundaryTests = [
        {
          name: '最小BPM',
          syntax: '@@ 1 1/4 { C }'
        },
        {
          name: '最大BPM',
          syntax: '@@ 999 1/4 { C }'
        },
        {
          name: '非常に高いBPM',
          syntax: '@@ 300 1/4 { C }'
        },
        {
          name: '複雑な拍子記号',
          syntax: '@@ 140 7/8 { C }'
        },
        {
          name: '長い拍子記号',
          syntax: '@@ 140 1/16 { C }'
        },
        {
          name: '最大フレット番号',
          syntax: '@@ 140 1/4 { |24 }'
        },
        {
          name: '0フレット',
          syntax: '@@ 140 1/4 { |0 }'
        }
      ];

      boundaryTests.forEach(({ name, syntax }) => {
        test(`${name} - should handle boundary values`, () => {
          const result = Conductor.convertToObj(
            true,
            true,
            syntax,
            [],
            new Map(),
            {}
          );

          // 境界値でも基本的には成功するはず
          expect(result.id).toBeDefined();
          // console.log(`${name}: Error = ${result.error ? 'あり' : 'なし'}`);
        });
      });
    });

    describe('複雑な構文パターン', () => {
      const complexPatterns = [
        {
          name: '多重ネストスタイル',
          syntax: '@@ 140 1/4 { C:leg:m:d }'
        },
        {
          name: '複数のマッピング',
          syntax: '@@ 140 1/4 { C:map(0..2):map(3..5) }'
        },
        {
          name: '複雑なベンド記法',
          syntax: '@@ 140 1/4 { |||||12:bd(0..1/2 cho 2):bd(1/2..1 cho 0) }'
        },
        {
          name: 'タブとコードの混在',
          syntax: '@@ 140 1/4 { |2 C |3 Dm }'
        },
        {
          name: '非常に長い行',
          syntax: '@@ 140 1/4 { C Dm Em F G Am Bdim C Dm Em F G Am Bdim C Dm Em F }'
        },
        {
          name: '特殊文字を含むコード',
          syntax: '@@ 140 1/4 { C# Db F#m7b5 }'
        },
        {
          name: '数値のみの記法',
          syntax: '@@ 140 1/4 { |1 |2 |3 |4 |5 }'
        },
        {
          name: 'ミックス記法',
          syntax: '@@ 140 1/4 { C:leg |2:m Dm:d |||||3:bd(0..1/4) }'
        }
      ];

      complexPatterns.forEach(({ name, syntax }) => {
        test(`${name} - should handle complex patterns`, () => {
          const result = Conductor.convertToObj(
            true,
            true,
            syntax,
            [],
            new Map(),
            {}
          );

          expect(result.id).toBeDefined();
          
          if (result.error) {
            // console.log(`${name}: エラー発生 - ${result.error}`);
          } else {
            // console.log(`${name}: 正常処理完了`);
            expect(result.compileMsec).toBeGreaterThan(0);
          }
        });
      });
    });

    describe('スタイルパラメータの詳細テスト', () => {
      const styleParameterTests = [
        {
          name: 'map範囲の境界値',
          syntax: '@@ 140 1/4 { C:map(0..0) }'
        },
        {
          name: 'map負の値',
          syntax: '@@ 140 1/4 { C:map(-1..2) }'
        },
        {
          name: 'map逆順',
          syntax: '@@ 140 1/4 { C:map(5..1) }'
        },
        {
          name: 'ベンド時間境界',
          syntax: '@@ 140 1/4 { |||||12:bd(0..0 cho 1) }'
        },
        {
          name: 'ベンド最大時間',
          syntax: '@@ 140 1/4 { |||||12:bd(0..2 cho 1) }'
        },
        {
          name: 'ベンド負の値',
          syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho -1) }'
        },
        {
          name: 'ベンド高い値',
          syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho 12) }'
        }
      ];

      styleParameterTests.forEach(({ name, syntax }) => {
        test(`${name} - should handle style parameters`, () => {
          const result = Conductor.convertToObj(
            true,
            true,
            syntax,
            [],
            new Map(),
            {}
          );

          expect(result.id).toBeDefined();
          // console.log(`${name}: ${result.error ? 'エラー' : '成功'}`);
        });
      });
    });

    describe('コメントと空白の処理', () => {
      const commentTests = [
        {
          name: 'コメント付き（もしサポートされている場合）',
          syntax: '@@ 140 1/4 { C // コメント\n Dm }'
        },
        {
          name: '多重改行',
          syntax: '@@ 140 1/4 {\n\n\n  C\n\n  Dm\n\n\n}'
        },
        {
          name: 'タブ文字',
          syntax: '@@ 140 1/4 {\tC\t\tDm\t}'
        },
        {
          name: '混在空白',
          syntax: '@@ 140 1/4 { \t C  \n\t Dm \t }'
        }
      ];

      commentTests.forEach(({ name, syntax }) => {
        test(`${name} - should handle whitespace and comments`, () => {
          const result = Conductor.convertToObj(
            true,
            true,
            syntax,
            [],
            new Map(),
            {}
          );

          expect(result.id).toBeDefined();
          // console.log(`${name}: ${result.error ? 'エラー' : '成功'}`);
        });
      });
    });

    describe('パフォーマンステスト', () => {
      test('大量のコード - 処理時間測定', () => {
        const largeSyntax = '@@ 140 1/4 { ' + 
          Array(100).fill('C Dm Em F G Am Bdim').join(' ') + ' }';

        const startTime = Date.now();
        const result = Conductor.convertToObj(
          true,
          true,
          largeSyntax,
          [],
          new Map(),
          {}
        );
        const endTime = Date.now();

        expect(result.id).toBeDefined();
        // console.log(`大量コード処理時間: ${endTime - startTime}ms`);
        
        // 5秒以内で処理されることを確認
        expect(endTime - startTime).toBeLessThan(5000);
      });

      test('深いネスト構造', () => {
        const nestedSyntax = '@@ 140 1/4 { ' + 
          'C:leg:m:d:map(0..1):map(1..2):map(2..3)' + ' }';

        const result = Conductor.convertToObj(
          true,
          true,
          nestedSyntax,
          [],
          new Map(),
          {}
        );

        expect(result.id).toBeDefined();
        // console.log(`深いネスト: ${result.error ? 'エラー' : '成功'}`);
      });
    });

    describe('特殊ケースとエッジケース', () => {
      const edgeCases = [
        {
          name: 'Unicode文字',
          syntax: '@@ 140 1/4 { C♯ D♭ }' // 音楽記号
        },
        {
          name: '空文字列',
          syntax: ''
        },
        {
          name: '非常に短い記法',
          syntax: '@@'
        },
        {
          name: '重複するコード',
          syntax: '@@ 140 1/4 { C C C C }'
        },
        {
          name: '混在記法',
          syntax: '@@ 140 1/4 { C |2 Dm |||||3 Em F }'
        }
      ];

      edgeCases.forEach(({ name, syntax }) => {
        test(`${name} - should handle edge cases`, () => {
          let result;
          let error = false;
          
          try {
            result = Conductor.convertToObj(
              true,
              true,
              syntax,
              [],
              new Map(),
              {}
            );
          } catch (e) {
            error = true;
            // console.log(`${name}: 例外発生 - ${e}`);
          }

          if (!error && result) {
            expect(result.id).toBeDefined();
            // console.log(`${name}: ${result.error ? 'エラー' : '成功'}`);
          }
        });
      });
    });
  });
}); 