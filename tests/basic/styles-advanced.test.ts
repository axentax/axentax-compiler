import { Conductor } from '../../src/conductor/conductor';

describe('Bend and Vibrato Styles', () => {
  const bendStyles = [
    { syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho 1) }', desc: 'チョーキング' },
    { syntax: '@@ 140 1/4 { |||||12:bd(0..2/4 vib 0.5) }', desc: 'ビブラート' },
    { syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho 1, 2..4/4 vib 0.5) }', desc: '複数ベンド' },
  ];

  bendStyles.forEach(({ syntax, desc }) => {
    test(`${desc} - should compile successfully`, () => {
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
});

describe('Slide Styles', () => {
  const slideStyles = [
    { syntax: '@@ 140 1/4 { |||||12:to(continue) }', desc: 'スライドアップ' },
  ];

  slideStyles.forEach(({ syntax, desc }) => {
    test(`${desc} - should compile successfully`, () => {
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

  // Invalid slide syntax should produce errors
  test('Invalid slide syntax - should produce error', () => {
    const result = Conductor.convertToObj(
      true,
      true,
      '@@ 140 1/4 { |||||12:to(release) }',
      [],
      new Map(),
      {}
    );

    expect(result.error).not.toBeNull();
    if (result.error) {
      expect(result.error.message).toContain('invalid');
    }
  });
});

describe('Approach Styles', () => {
  const approachStyles = [
    { syntax: '@@ 140 1/4 { |||||12:approach(|2||4, 80) }', desc: 'アプローチ' },
  ];

  approachStyles.forEach(({ syntax, desc }) => {
    test(`${desc} - should compile successfully`, () => {
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
});

describe('Stroke and Strum Styles', () => {
  const strokeStyles = [
    { syntax: '@@ 140 1/4 { C:stroke(1/4.up) }', desc: 'ストローク' },
    { syntax: '@@ 140 1/4 { C:strum(50) }', desc: 'ストラム' },
  ];

  strokeStyles.forEach(({ syntax, desc }) => {
    test(`${desc} - should compile successfully`, () => {
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
});

describe('Other Styles', () => {
  const otherStyles = [
    { syntax: '@@ 140 1/4 { |||||5:step(54321) }', desc: 'ステップ' },
    { syntax: '@@ 140 1/4 { C:staccato(1/8) }', desc: 'スタッカート' },
    { syntax: '@@ 140 1/4 { C:delay(1/8) }', desc: 'ディレイ' },
    { syntax: '@@ 140 1/4 { C:v(100) }', desc: '音量制御' },
  ];

  otherStyles.forEach(({ syntax, desc }) => {
    test(`${desc} - should compile successfully`, () => {
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
});

describe('Complex Styles', () => {
  const complexStyles = [
    { syntax: '@@ 140 1/4 { C:leg:stroke(1/4.up) }', desc: '複合スタイル' },
  ];

  complexStyles.forEach(({ syntax, desc }) => {
    test(`${desc} - should compile successfully`, () => {
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
});

describe('Advanced Styles', () => {
  const advancedStyles = [
    { syntax: '@@ 140 1/4 { C:strum(50) }', desc: 'ストラム' },
    { syntax: '@@ 140 1/4 { C:stroke(1/4) }', desc: 'ストローク' },
    { syntax: '@@ 140 1/4 { C:delay(1/8) }', desc: 'ディレイ' },
    { syntax: '@@ 140 1/4 { C:staccato(3/4) }', desc: 'スタッカート' },
  ];

  advancedStyles.forEach(({ syntax, desc }) => {
    test(`${desc} - should compile successfully`, () => {
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
}); 