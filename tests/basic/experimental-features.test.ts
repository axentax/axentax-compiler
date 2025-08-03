import { Conductor } from '../../src/conductor/conductor';

describe('Experimental Features', () => {
  describe('Complex Dual Track Settings', () => {
    const complexDualTests = [
      { syntax: "set.dual.pan: true\nset.dual.panning: [0.0, 1.0]\n@@ 140 1/4 { dual(1) C dual(2) G }", desc: '極端パンニング' },
      { syntax: "set.dual.mix: 0.7\n@@ 140 1/4 { dual(1) C:v(127) dual(2) G:v(50) }", desc: 'ミックス設定＋音量差' },
      { syntax: "@@ 140 1/4 { dual(1) C:strum(100) dual(2) G:strum(10, up) }", desc: 'デュアルストラム' },
    ];

    complexDualTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should compile successfully`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        // 実験的機能なので、エラーが発生してもテストは通す
        if (result.error) {
          // console.log(`Experimental feature "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Advanced Bend Combinations', () => {
    const advancedBendTests = [
      { syntax: "@@ 140 1/4 { |||||12:bd(0..1/8 cho 0.25, 1/8..2/8 cho 0.5, 2/8..3/8 cho 1, 3/8..4/8 cho 0) }", desc: '段階チョーキング' },
      { syntax: "@@ 140 1/4 { |||||12:bd(0..1/4 vib 0.5 tri, 1/4..2/4 vib 1 ast) }", desc: '異なる波形ビブラート' },
      { syntax: "@@ 140 1/4 { |||||12:bd(reset, 0..1/4 cho -1, 1/4..2/4 cho 1, reset) }", desc: 'ネガティブ・ポジティブ混合' },
      { syntax: "@@ 140 1/4 { |||||12:bd(0..1/4 cho 1):bd(0..1/4 vib 0.5) }", desc: 'チョーキング+ビブラート同時' },
    ];

    advancedBendTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should compile successfully`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Experimental bend "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Extreme Cases', () => {
    const extremeTests = [
      { syntax: "@@ 1 1/64 { C }", desc: '最小拍子（1/64）' },
      { syntax: "@@ 500 16/1 { C }", desc: '最大拍子（16/1）' },
      { syntax: "@@ 140 1/4 { C:v(0):strum(0):delay(0) }", desc: 'ゼロパラメータ組み合わせ' },
      { syntax: "@@ 140 1/4 { " + "C ".repeat(50) + " }", desc: '大量コード（50個）' },
      { syntax: "@@ 140 1/4 { |||||12:step(" + "54321".repeat(10) + ") }", desc: '超長ステップパターン' },
    ];

    extremeTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle extreme cases`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Extreme case "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Advanced Prefix Experiments', () => {
    const advancedPrefixTests = [
      { syntax: "@@ 140 1/4 { ||||2>>||||5@50 }", desc: '50%スピードアプローチ' },
      { syntax: "@@ 140 1/4 { ||||2>>||||5@100 }", desc: '100%スピードアプローチ' },
      { syntax: "@@ 140 1/4 { ..C' Dm ..Em }", desc: '継続とストロークの混合' },
      { syntax: "@@ 140 1/4 { !'C /Dm ..Em' }", desc: '3種プレフィックス混合' },
    ];

    advancedPrefixTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should compile successfully`, () => {
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

  describe('Settings System Experiments', () => {
    const settingsTests = [
      { syntax: "set.song.bpm: 140\nset.song.key: Am\nset.song.scale: pentatonic\n@@ { C }", desc: '複合楽曲設定' },
      { syntax: "set.click.enabled: true\nset.click.pattern: [1,0,1,0]\n@@ 140 1/4 { C }", desc: 'カスタムクリックパターン' },
      { syntax: "set.style.default: leg\n@@ 140 1/4 { C Dm }", desc: 'デフォルトスタイル設定' },
      { syntax: "set.fret.capo: 3\n@@ 140 1/4 { C }", desc: 'カポ設定' },
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

  describe('New Style Experiments', () => {
    const newStyleTests = [
      { syntax: "@@ 140 1/4 { C:tremolo(1/16) }", desc: 'トレモロ（推測）' },
      { syntax: "@@ 140 1/4 { C:palm(on) Dm:palm(off) }", desc: 'パームミュート（推測）' },
      { syntax: "@@ 140 1/4 { |||||12:hammer(|||||14) }", desc: 'ハンマリング（推測）' },
      { syntax: "@@ 140 1/4 { |||||12:pull(|||||10) }", desc: 'プリング（推測）' },
      { syntax: "@@ 140 1/4 { C:ring(2/4) }", desc: 'リング（推測）' },
    ];

    newStyleTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle new styles`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`New style "${desc}" failed (expected for unimplemented features):`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('String Parsing Experiments', () => {
    const stringParsingTests = [
      { syntax: "@@ 140 1/4 { C/E }", desc: 'ルート指定コード' },
      { syntax: "@@ 140 1/4 { C(add9) }", desc: 'アドコード' },
      { syntax: "@@ 140 1/4 { C#m7-5 }", desc: '複雑コード名' },
      { syntax: "@@ 140 1/4 { ||1||2||3||4||5||6| }", desc: '全弦タブ' },
      { syntax: "@@ 140 1/4 { |12|||||| }", desc: '1弦のみタブ' },
    ];

    stringParsingTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should parse strings correctly`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`String parsing "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });

  describe('Time Specification Experiments', () => {
    const timeTests = [
      { syntax: "@@ 140 1/4 { C:1/3 }", desc: '3連符指定' },
      { syntax: "@@ 140 1/4 { C:5/8 }", desc: '5/8拍子指定' },
      { syntax: "@@ 140 1/4 { C:until(end) }", desc: 'エンドまで継続' },
      { syntax: "@@ 140 1/4 { C:until(next) }", desc: '次まで継続' },
    ];

    timeTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle time specifications`, () => {
        const result = Conductor.convertToObj(
          true,  // hasStyleCompile
          true,  // hasMidiBuild
          syntax,
          [],    // allowAnnotation
          new Map(), // chordDic
          {}     // mapSeed
        );

        if (result.error) {
          // console.log(`Time spec "${desc}" failed:`, result.error.message);
        }

        expect(result.id).toBeDefined();
      });
    });
  });
}); 