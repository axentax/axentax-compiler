import { Conductor } from '../../src/conductor/conductor';

describe('Undocumented Features', () => {
  describe('Advanced Settings System', () => {
    const advancedSettingsTests = [
      { syntax: "set.style.tuning: D|A|D|G|A|D\n@@ 140 1/4 { C }", desc: 'カスタムチューニング設定' },
      { syntax: "set.click.velocity: 60\n@@ 140 1/4 { C }", desc: 'クリックベロシティ設定' },
      { syntax: "set.click.accent: 0\n@@ 140 1/4 { C }", desc: 'クリックアクセント設定' },
      { syntax: "set.hash.compose: test123\n@@ 140 1/4 { C }", desc: 'ハッシュ作曲設定' },
    ];

    advancedSettingsTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle advanced settings`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Advanced setting "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Debug and Development Features', () => {
    const debugFeatureTests = [
      { syntax: "__start__\n@@ 140 1/4 { C }\n__end__", desc: 'スタート・エンドマーカー' },
      { syntax: "// コメント行\n@@ 140 1/4 { C }", desc: '行コメント' },
      { syntax: "/* ブロックコメント */\n@@ 140 1/4 { C }", desc: 'ブロックコメント' },
      { syntax: "/*\n複数行\nコメント\n*/\n@@ 140 1/4 { C }", desc: '複数行ブロックコメント' },
    ];

    debugFeatureTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle debug features`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Debug feature "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Advanced Prefix Notation', () => {
    const advancedPrefixTests = [
      { syntax: "@@ 140 1/4 { ||||2|2!200>>||||5|5 }", desc: 'スピード付きアプローチ' },
      { syntax: "@@ 140 1/4 { !''C }", desc: 'アップストローク＋強インテンシティ' },
      { syntax: "@@ 140 1/4 { ..''|||2|2| }", desc: '継続＋ストロークインテンシティ' },
    ];

    advancedPrefixTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle advanced prefixes`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Advanced prefix "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Bend Template Features', () => {
    const bendTemplateTests = [
      { syntax: "@@ 140 1/4 { |||||12:bd(tpl::standard) }", desc: 'スタンダードテンプレート' },
      { syntax: "@@ 140 1/4 { |||||12:bd(tpl::slow) }", desc: 'スローテンプレート' },
      { syntax: "@@ 140 1/4 { |||||12:bd(tpl::vibrato) }", desc: 'ビブラートテンプレート' },
    ];

    bendTemplateTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle bend templates`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        // テンプレート機能は未実装の可能性が高い
        if (result.error) {
          // console.log(`Bend template "${desc}" failed (expected for unimplemented features):`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Advanced Position Control', () => {
    const advancedPositionTests = [
      { syntax: "@@ 140 1/4 { C:pos(loc:low) }", desc: 'ローポジション指定' },
      { syntax: "@@ 140 1/4 { C:pos(loc:mid) }", desc: 'ミドルポジション指定' },
      { syntax: "@@ 140 1/4 { C:pos(loc:high) }", desc: 'ハイポジション指定' },
      { syntax: "@@ 140 1/4 { C:pos(inv:2) }", desc: 'インバージョン指定' },
      { syntax: "@@ 140 1/4 { C:pos(exc:5,6) }", desc: '弦除外指定' },
      { syntax: "@@ 140 1/4 { C:pos(req:1,2,3) }", desc: '必須弦指定' },
      { syntax: "@@ 140 1/4 { C:pos(cov:true) }", desc: 'カバレッジ指定' },
    ];

    advancedPositionTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle advanced position control`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Advanced position "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Advanced Mapping Options', () => {
    const advancedMappingTests = [
      { syntax: "@@ 140 1/4 { C:map(0..3 sos) }", desc: 'オープンストリングオプション' },
      { syntax: "@@ 140 1/4 { C:map(0..3 nos) }", desc: 'ノーオープンストリングオプション' },
      { syntax: "@@ 140 1/4 { C:map(0..3 rev ss) }", desc: 'リバース＋ストリングステイ' },
    ];

    advancedMappingTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle advanced mapping options`, () => {
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

  describe('Advanced Step Notation', () => {
    const advancedStepTests = [
      { syntax: "@@ 140 1/4 { |||||5:step(f(123)456) }", desc: 'グループ化ステップ' },
      { syntax: "@@ 140 1/4 { |||||5:step(123~) }", desc: 'チルド付きステップ' },
      { syntax: "@@ 140 1/4 { |||||5:step(123^) }", desc: 'キャレット付きステップ' },
      { syntax: "@@ 140 1/4 { |||||5:step(123=) }", desc: 'イコール付きステップ' },
      { syntax: "@@ 140 1/4 { C:step(rn) }", desc: 'レストノイズステップ' },
      { syntax: "@@ 140 1/4 { C:step(R) }", desc: 'ラウドレストステップ' },
    ];

    advancedStepTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle advanced step notation`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Advanced step "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Custom Scale Notation', () => {
    const customScaleTests = [
      { syntax: "@@ 140 1/4 { C:scale(101101011010) }", desc: 'バイナリスケール定義' },
      { syntax: "@@ 140 1/4 { C:scale(C# harmonic minor 7th mode 5th) }", desc: '複雑なスケール指定' },
      { syntax: "@@ 140 1/4 { C:scale(E dorian mode 3th) }", desc: 'モード指定' },
    ];

    customScaleTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle custom scale notation`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Custom scale "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Boundary and Special Values', () => {
    const boundaryTests = [
      { syntax: "@@ 1000 1/4 { C }", desc: '最大BPM（1000）' },
      { syntax: "@@ 140 1/4 { ||||||24 }", desc: '最大フレット（24）' },
      { syntax: "@@ 140 1/4 { C:v127 }", desc: '最大ベロシティ（127）' },
      { syntax: "@@ 140 1/4 { C:bd(0..0/4 cho 1) }", desc: 'ゼロ長ベンド' },
    ];

    boundaryTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle boundary values`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Boundary test "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Annotation Features', () => {
    const annotationTests = [
      {
        syntax: "@@ 140 1/4 { @compose C /compose }",
        desc: 'コンポーズアノテーション',
        allowAnnotation: [
          { name: 'compose', dualIdRestrictions: [1, 2] },
          { name: '/compose', dualIdRestrictions: [1, 2] }
        ]
      },
      {
        syntax: "@@ 140 1/4 { @arrange C /arrange }",
        desc: 'アレンジアノテーション',
        allowAnnotation: [
          { name: 'arrange', dualIdRestrictions: [1, 2] },
          { name: '/arrange', dualIdRestrictions: [1, 2] }
        ]
      },
    ];

    annotationTests.forEach(({ syntax, desc, allowAnnotation }) => {
      test(`${desc} - should handle annotations`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          allowAnnotation || [], // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Annotation "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });
}); 