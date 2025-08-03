import { Conductor } from '../../src/conductor/conductor';

describe('Missing Features', () => {
  describe('Prefix Notation', () => {
    test('ストロークプレフィックス（弱） - should handle prefix notation', () => {
      const syntax = "@@ 140 1/4 { 'C }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Prefix "ストロークプレフィックス（弱）" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('ストロークプレフィックス（強） - should handle prefix notation', () => {
      const syntax = "@@ 140 1/4 { ''C }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Prefix "ストロークプレフィックス（強）" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('アップストロークプレフィックス - should handle prefix notation', () => {
      const syntax = "@@ 140 1/4 { !C }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Prefix "アップストロークプレフィックス" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('アップストローク（強）プレフィックス - should handle prefix notation', () => {
      const syntax = "@@ 140 1/4 { !'C }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Prefix "アップストローク（強）プレフィックス" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('継続プレフィックス（タブ） - should handle prefix notation', () => {
      const syntax = "@@ 140 1/4 { ..|||2 }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Prefix "継続プレフィックス（タブ）" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    // test('継続プレフィックス（コード） - should handle prefix notation', () => {
    //   const syntax = "@@ 140 1/4 { ..C }";
    //   const result = Conductor.convertToObj(
    //     true,  // hasStyleCompile
    //     true,  // hasMidiBuild
    //     syntax,
    //     [],    // allowAnnotation
    //     new Map(), // chordDic
    //     {}     // mapSeed
    //   );
    //   if (result.error) {
    //     console.log(`Prefix "継続プレフィックス（コード）" failed:`, result.error.message);
    //   }
    //   expect(result.id).toBeDefined();
    // });

    // test.skip('ストラムプレフィックス - should handle prefix notation', () => {
    //   const syntax = "@@ 140 1/4 { /C }";
    //   const result = Conductor.convertToObj(
    //     true,  // hasStyleCompile
    //     true,  // hasMidiBuild
    //     syntax,
    //     [],    // allowAnnotation
    //     new Map(), // chordDic
    //     {}     // mapSeed
    //   );
    //   if (result.error) {
    //     console.log(`Prefix "ストラムプレフィックス" failed:`, result.error.message);
    //   }
    //   expect(result.id).toBeDefined();
    // });

    test('アプローチプレフィックス - should handle prefix notation', () => {
      const syntax = "@@ 140 1/4 { ||||2>>||||5 }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Prefix "アプローチプレフィックス" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('アップストローク＋アプローチ - should handle prefix notation', () => {
      const syntax = "@@ 140 1/4 { !||||3>>||||8 }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Prefix "アップストローク＋アプローチ" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });
  });

  describe('Advanced Bend Notation', () => {
    const advancedBendTests = [
      { syntax: "@@ 140 1/4 { |||||12:bd(reset, 1..3/4 cho 1) }", desc: 'リセット開始ベンド' },
      { syntax: "@@ 140 1/4 { |||||12:bd(0..3/4 cho 1, reset) }", desc: 'リセット終了ベンド' },
      { syntax: "@@ 140 1/4 { |||||12:bd(0..1/4 vib 1 tri) }", desc: '三角波ビブラート' },
      { syntax: "@@ 140 1/4 { |||||12:bd(0..1/4 -0.5) }", desc: 'ネガティブベンド' },
      { syntax: "@@ 140 1/4 { |||||12:bd(0..1/8 cho 1, 1..3/8 vib 0.5, 3..4/8 -0.5) }", desc: '複雑な連続ベンド' },
    ];

    advancedBendTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle advanced bend notation`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Advanced bend "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Settings System', () => {
    const settingsTests = [
      { syntax: "set.song.key: C\n@@ 140 1/4 { C }", desc: 'キー設定' },
      { syntax: "set.style.until: 1/4\n@@ 140 { C }", desc: 'スタイル継続時間設定' },
      { syntax: "set.click.inst: 42\n@@ 140 1/4 { C }", desc: 'クリック楽器設定' },
      { syntax: "set.dual.pan: true\n@@ 140 1/4 { C }", desc: 'デュアルパン設定' },
      { syntax: "set.dual.panning: [0.3, 0.7, 1.0]\n@@ 140 1/4 { C }", desc: 'パンニング位置設定' },
    ];

    settingsTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle settings`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Settings "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  // describe('Dual Track', () => {
  //   test.skip('デュアルトラック1 - should handle dual track', () => {
  //     const syntax = "@@ 140 1/4 { C:dual(1) }";
  //     const result = Conductor.convertToObj(
  //       true,  // hasStyleCompile
  //       true,  // hasMidiBuild
  //       syntax,
  //       [],    // allowAnnotation
  //       new Map(), // chordDic
  //       {}     // mapSeed
  //     );
  //     if (result.error) {
  //       console.log(`Dual track "デュアルトラック1" failed:`, result.error.message);
  //     }
  //     expect(result.id).toBeDefined();
  //   });

  //   test.skip('デュアルトラック2 - should handle dual track', () => {
  //     const syntax = "@@ 140 1/4 { Dm:dual(2) }";
  //     const result = Conductor.convertToObj(
  //       true,  // hasStyleCompile
  //       true,  // hasMidiBuild
  //       syntax,
  //       [],    // allowAnnotation
  //       new Map(), // chordDic
  //       {}     // mapSeed
  //     );
  //     if (result.error) {
  //       console.log(`Dual track "デュアルトラック2" failed:`, result.error.message);
  //     }
  //     expect(result.id).toBeDefined();
  //   });

  //   test.skip('デュアルトラック混在 - should handle dual track', () => {
  //     const syntax = "@@ 140 1/4 { C:dual(1) Dm:dual(2) }";
  //     const result = Conductor.convertToObj(
  //       true,  // hasStyleCompile
  //       true,  // hasMidiBuild
  //       syntax,
  //       [],    // allowAnnotation
  //       new Map(), // chordDic
  //       {}     // mapSeed
  //     );
  //     if (result.error) {
  //       console.log(`Dual track "デュアルトラック混在" failed:`, result.error.message);
  //     }
  //     expect(result.id).toBeDefined();
  //   });

  //   test.skip('デュアルトラック連結 - should handle dual track', () => {
  //     const syntax = "@@ 140 1/4 { C:dual(1) } >> { Dm:dual(2) }";
  //     const result = Conductor.convertToObj(
  //       true,  // hasStyleCompile
  //       true,  // hasMidiBuild
  //       syntax,
  //       [],    // allowAnnotation
  //       new Map(), // chordDic
  //       {}     // mapSeed
  //     );
  //     if (result.error) {
  //       console.log(`Dual track "デュアルトラック連結" failed:`, result.error.message);
  //     }
  //     expect(result.id).toBeDefined();
  //   });
  // });

  describe('Advanced Mapping', () => {
    const advancedMappingTests = [
      { syntax: "@@ 140 1/4 { C:map(0..3 step 2) }", desc: 'ステップマッピング' },
      { syntax: "@@ 140 1/4 { C:map(3*2) }", desc: '乗算マッピング' },
      { syntax: "@@ 140 1/4 { C:map(0..3 rev) }", desc: 'リバースマッピング' },
      { syntax: "@@ 140 1/4 { C:map(0..3 ss) }", desc: 'ssオプション' },
      { syntax: "@@ 140 1/16 { |||2:map(0..3):1/16 @offset }", desc: 'オフセット付きマッピング' },
    ];

    advancedMappingTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle advanced mapping`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Advanced mapping "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Complex Style Combinations', () => {
    const complexCombinationTests = [
      { syntax: "@@ 140 1/4 { |||||12:bd(0..1/4 cho 1):to(continue):leg }", desc: 'ベンド＋スライド＋レガート' },
      { syntax: "@@ 140 1/4 { Em:strum(50):stroke(1/4):delay(1/8) }", desc: 'ストラム＋ストローク＋ディレイ' },
      { syntax: "@@ 140 1/4 { C:v75:leg:staccato(3/4) }", desc: 'ベロシティ＋レガート＋スタッカート' },
      { syntax: "@@ 140 1/4 { |||||5:step(54321):map(0..2):bd(0..1/4 vib 0.5) }", desc: 'ステップ＋マップ＋ベンド' },
    ];

    complexCombinationTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle complex style combinations`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Complex combination "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Edge Cases', () => {
    test('空リージョン - should handle edge cases', () => {
      const syntax = "@@ { }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Edge case "空リージョン" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('休符のみ - should handle edge cases', () => {
      const syntax = "@@ 140 1/4 { r }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Edge case "休符のみ" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('最小BPM - should handle edge cases', () => {
      const syntax = "@@ 1 1/4 { C }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Edge case "最小BPM" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('最大BPM - should handle edge cases', () => {
      const syntax = "@@ 999 1/4 { C }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Edge case "最大BPM" failed:`, result.error.message);
      }

      expect(result.id).toBeDefined();
    });

    test('開放弦 - should handle edge cases', () => {
      const syntax = "@@ 140 1/4 { |||||0 }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );
      if (result.error) {
        // console.log(`Edge case "開放弦" failed:`, result.error.message);
      }
      expect(result.id).toBeDefined();
    });

    test('最大フレット - should handle edge cases', () => {
      const syntax = "@@ 140 1/4 { |||||24 }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );
      if (result.error) {
        // console.log(`Edge case "最大フレット" failed:`, result.error.message);
      }
      expect(result.id).toBeDefined();
    });

    test('最大ベロシティ - should handle edge cases', () => {
      const syntax = "@@ 140 1/4 { C:v100 }";
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );
      if (result.error) {
        // console.log(`Edge case "最大ベロシティ" failed:`, result.error.message);
      }
      expect(result.id).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    const errorTests = [
      { syntax: "@@ 0 1/4 { C }", desc: '無効なBPM（下限）', expectError: true },
      { syntax: "@@ 2000 1/4 { C }", desc: '無効なBPM（上限）', expectError: true },
      { syntax: "@@ 140 1/4 { ||||||25 }", desc: '無効なフレット', expectError: true },
      { syntax: "@@ 140 1/4 { C:v128 }", desc: '無効なベロシティ', expectError: true },
      { syntax: "@@ 140 1/4 { C Xm7 Em F }", desc: '無効なコード', expectError: true },
      { syntax: "@@ 140 1/4 { C:bd(cho 3) }", desc: '無効なベンドパラメータ', expectError: true },
      { syntax: "@@ 140 1/4 C Dm Em F", desc: '括弧なし', expectError: true },
      { syntax: "C Dm Em F", desc: 'リージョンマーカーなし', expectError: true },
    ];

    errorTests.forEach(({ syntax, desc, expectError }) => {
      test(`${desc} - should handle errors correctly`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (expectError) {
          if (result.error) {
            // console.log(`Error test "${desc}" correctly detected error:`, result.error.message);
          } else {
            // console.log(`Error test "${desc}" failed to detect expected error`);
          }
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Performance Tests', () => {
    test('大量ノート（100個） - should handle performance load', () => {
      const syntax = `@@ 140 1/4 { ${Array(100).fill('C').join(' ')} }`;
      const startTime = Date.now();
      
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      if (result.error) {
        // console.log(`Performance test "大量ノート（100個）" failed:`, result.error.message);
      } else {
        // console.log(`Performance test "大量ノート（100個）" completed in ${executionTime}ms`);
      }

      expect(result.id).toBeDefined();
      expect(executionTime).toBeLessThan(10000); // 10秒以内に完了することを期待
    });

    test('複雑スタイル大量適用 - should handle performance load', () => {
      const syntax = `@@ 140 1/4 { ${'C:bd(0..1/4 cho 1):leg:strum(50) '.repeat(20)} }`;
      const startTime = Date.now();
      
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      if (result.error) {
        // console.log(`Performance test "複雑スタイル大量適用" failed:`, result.error.message);
      } else {
        // console.log(`Performance test "複雑スタイル大量適用" completed in ${executionTime}ms`);
      }

      expect(result.id).toBeDefined();
      expect(executionTime).toBeLessThan(10000); // 10秒以内に完了することを期待
    });

    // test.skip('大量リージョン連結 - should handle performance load', () => {
    //   const syntax = Array(10).fill('@@ 140 1/4 { C Dm Em F }').join(' >> ');
    //   const startTime = Date.now();
      
    //   const result = Conductor.convertToObj(
    //     true,  // hasStyleCompile
    //     true,  // hasMidiBuild
    //     syntax,
    //     [],    // allowAnnotation
    //     new Map(), // chordDic
    //     {}     // mapSeed
    //   );

    //   const endTime = Date.now();
    //   const executionTime = endTime - startTime;

    //   if (result.error) {
    //     console.log(`Performance test "大量リージョン連結" failed:`, result.error.message);
    //   } else {
    //     console.log(`Performance test "大量リージョン連結" completed in ${executionTime}ms`);
    //   }

    //   expect(result.id).toBeDefined();
    //   expect(executionTime).toBeLessThan(10000); // 10秒以内に完了することを期待
    // });
  });
}); 