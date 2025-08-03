import { Conductor } from '../../src/conductor/conductor';

describe('Basic Styles', () => {
  const basicStyles = [
    { syntax: '@@ 140 1/4 { C:n }', desc: 'ノーマル' },
    { syntax: '@@ 140 1/4 { C:m }', desc: 'ミュート' },
    { syntax: '@@ 140 1/4 { C:M }', desc: 'ミュート継続' },
    { syntax: '@@ 140 1/4 { C:rn }', desc: 'レストノイズ' },
    { syntax: '@@ 140 1/4 { C:leg }', desc: 'レガート' },
    { syntax: '@@ 140 1/4 { C:continue }', desc: '継続' },
  ];

  basicStyles.forEach(({ syntax, desc }) => {
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

describe('Brushing Styles', () => {
  const brushingStyles = [
    { syntax: '@@ 140 1/4 { C:d }', desc: 'ダウンブラッシング（弱）' },
    { syntax: '@@ 140 1/4 { C:D }', desc: 'ダウンブラッシング（強）' },
    { syntax: '@@ 140 1/4 { C:u }', desc: 'アップブラッシング（弱）' },
    { syntax: '@@ 140 1/4 { C:U }', desc: 'アップブラッシング（強）' },
  ];

  brushingStyles.forEach(({ syntax, desc }) => {
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

describe('スタイル組み合わせと高度なテスト', () => {
  describe('スタイル組み合わせテスト', () => {
    const combinationTests = [
      {
        syntax: '@@ 140 1/4 { C:leg:m }',
        desc: 'レガート + ミュート'
      },
      {
        syntax: '@@ 140 1/4 { C:d:leg }',
        desc: 'ダウンブラッシング + レガート'
      },
      {
        syntax: '@@ 140 1/4 { C:U:rn }',
        desc: 'アップブラッシング（強） + レストノイズ'
      },
      {
        syntax: '@@ 140 1/4 { C:m:continue }',
        desc: 'ミュート + 継続'
      },
      {
        syntax: '@@ 140 1/4 { C:D:M:leg }',
        desc: '多重スタイル（ダウン強 + ミュート継続 + レガート）'
      },
      {
        syntax: '@@ 140 1/4 { C:n:d:u }',
        desc: '矛盾する組み合わせ（ノーマル + ダウン + アップ）'
      }
    ];

    combinationTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle style combinations`, () => {
        const result = Conductor.convertToObj(
          true,
          true,
          syntax,
          [],
          new Map(),
          {}
        );

        expect(result.id).toBeDefined();
        // console.log(`${desc}: ${result.error ? 'エラー' : '成功'}`);
      });
    });
  });

  describe('マッピングスタイル詳細テスト', () => {
    const mappingTests = [
      {
        syntax: '@@ 140 1/4 { C:map(0..2) }',
        desc: '基本マッピング'
      },
      {
        syntax: '@@ 140 1/4 { C:map(0..5) }',
        desc: '全弦マッピング'
      },
      {
        syntax: '@@ 140 1/4 { C:map(3..3) }',
        desc: '単一弦マッピング'
      },
      {
        syntax: '@@ 140 1/4 { C:map(5..0) }',
        desc: '逆順マッピング'
      },
      {
        syntax: '@@ 140 1/4 { C:map(0..2):map(3..5) }',
        desc: '複数マッピング'
      },
      {
        syntax: '@@ 140 1/4 { C:map(-1..2) }',
        desc: '負の値を含むマッピング'
      },
      {
        syntax: '@@ 140 1/4 { C:map(0..10) }',
        desc: '範囲外マッピング'
      },
      {
        syntax: '@@ 140 1/4 { C:leg:map(0..2):d }',
        desc: 'マッピング + 他スタイル組み合わせ'
      }
    ];

    mappingTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle mapping styles`, () => {
        const result = Conductor.convertToObj(
          true,
          true,
          syntax,
          [],
          new Map(),
          {}
        );

        expect(result.id).toBeDefined();
        // console.log(`${desc}: ${result.error ? 'エラー' : '成功'}`);
      });
    });
  });

  describe('ベンドスタイル詳細テスト', () => {
    const bendTests = [
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho 1) }',
        desc: '基本ベンド'
      },
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..1/2 cho 2) }',
        desc: 'ハーフ時間ベンド'
      },
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..1 cho 0) }',
        desc: 'フル時間ベンド（cho 0）'
      },
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho -1) }',
        desc: '負のベンド値'
      },
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho 12) }',
        desc: '高いベンド値'
      },
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..0 cho 1) }',
        desc: '時間ゼロベンド'
      },
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..2 cho 1) }',
        desc: '長時間ベンド'
      },
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho 1):bd(1/4..1/2 cho 0) }',
        desc: '連続ベンド'
      },
      {
        syntax: '@@ 140 1/4 { |||||12:bd(0..1/4 cho 1):leg }',
        desc: 'ベンド + レガート'
      }
    ];

    bendTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle bend styles`, () => {
        const result = Conductor.convertToObj(
          true,
          true,
          syntax,
          [],
          new Map(),
          {}
        );

        expect(result.id).toBeDefined();
        // console.log(`${desc}: ${result.error ? 'エラー' : '成功'}`);
      });
    });
  });

  describe('タブ記号とスタイルの組み合わせ', () => {
    const tabStyleTests = [
      {
        syntax: '@@ 140 1/4 { |2:leg }',
        desc: 'タブ + レガート'
      },
      {
        syntax: '@@ 140 1/4 { |0:m }',
        desc: '開放弦 + ミュート'
      },
      {
        syntax: '@@ 140 1/4 { |||||3:d }',
        desc: '特定弦タブ + ダウンブラッシング'
      },
      {
        syntax: '@@ 140 1/4 { ||12:U:rn }',
        desc: '高フレット + 複数スタイル'
      },
      {
        syntax: '@@ 140 1/4 { |2:map(0..1) }',
        desc: 'タブ + マッピング（矛盾する可能性）'
      },
      {
        syntax: '@@ 140 1/4 { ||||5:continue }',
        desc: '特定弦 + 継続'
      }
    ];

    tabStyleTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle tab with styles`, () => {
        const result = Conductor.convertToObj(
          true,
          true,
          syntax,
          [],
          new Map(),
          {}
        );

        expect(result.id).toBeDefined();
        // console.log(`${desc}: ${result.error ? 'エラー' : '成功'}`);
      });
    });
  });

  describe('スタイルの境界値とエラーケース', () => {
    const boundaryStyleTests = [
      {
        syntax: '@@ 140 1/4 { C: }',
        desc: '空のスタイル',
        expectError: true
      },
      {
        syntax: '@@ 140 1/4 { C:xyz }',
        desc: '不正なスタイル名',
        expectError: true
      },
      {
        syntax: '@@ 140 1/4 { C:map() }',
        desc: '空のマッピングパラメータ',
        expectError: true
      },
      {
        syntax: '@@ 140 1/4 { C:map(abc..def) }',
        desc: '不正なマッピング値',
        expectError: true
      },
      {
        syntax: '@@ 140 1/4 { C:bd() }',
        desc: '空のベンドパラメータ',
        expectError: false // 実装によってはエラーにならない可能性
      },
      {
        syntax: '@@ 140 1/4 { C:bd(abc) }',
        desc: '不正なベンド構文',
        expectError: true
      },
      {
        syntax: '@@ 140 1/4 { C::::: }',
        desc: '過剰なコロン',
        expectError: true
      },
      {
        syntax: '@@ 140 1/4 { C:leg:leg:leg }',
        desc: '同一スタイルの重複',
        expectError: false // 重複は許可される可能性
      }
    ];

    boundaryStyleTests.forEach(({ syntax, desc, expectError }) => {
      test(`${desc} - should ${expectError ? 'fail' : 'succeed'}`, () => {
        const result = Conductor.convertToObj(
          true,
          true,
          syntax,
          [],
          new Map(),
          {}
        );

        if (expectError) {
          expect(result.error).not.toBeNull();
          // console.log(`${desc}: 期待通りエラー`);
        } else {
          expect(result.id).toBeDefined();
          // console.log(`${desc}: ${result.error ? 'エラー' : '成功'}`);
        }
      });
    });
  });

  describe('複雑なスタイルシーケンス', () => {
    const complexSequenceTests = [
      {
        syntax: '@@ 140 1/4 { C:leg Dm:d Em:U F:m }',
        desc: '連続する異なるスタイル'
      },
      {
        syntax: '@@ 140 1/4 { C:leg:map(0..2) Dm:d:rn Em:U:continue }',
        desc: '複雑なスタイル組み合わせシーケンス'
      },
      {
        syntax: '@@ 140 1/4 { |2:leg |||||3:bd(0..1/4 cho 1) C:map(3..5) }',
        desc: 'タブ・ベンド・コードの混在'
      },
      {
        syntax: '@@ 140 1/4 { C:n:n:n:n:n }',
        desc: '同一スタイルの大量重複'
      }
    ];

    complexSequenceTests.forEach(({ syntax, desc }) => {
      test(`${desc} - should handle complex sequences`, () => {
        const result = Conductor.convertToObj(
          true,
          true,
          syntax,
          [],
          new Map(),
          {}
        );

        expect(result.id).toBeDefined();
        // console.log(`${desc}: ${result.error ? 'エラー' : '成功'}`);
      });
    });
  });

  describe('スタイルの実用的テスト', () => {
    test('スタイル適用前後のMIDIデータ比較', () => {
      const normalResult = Conductor.convertToObj(
        true, true, '@@ 140 1/4 { C }', [], new Map(), {}
      );
      const styledResult = Conductor.convertToObj(
        true, true, '@@ 140 1/4 { C:leg }', [], new Map(), {}
      );

      expect(normalResult.error).toBeNull();
      expect(styledResult.error).toBeNull();
      
      // MIDIデータが生成され、異なることを確認
      expect(normalResult.midi).toBeDefined();
      expect(styledResult.midi).toBeDefined();
      
      const normalMidiSize = normalResult.midi?.byteLength || 0;
      const styledMidiSize = styledResult.midi?.byteLength || 0;
      
      // console.log(`MIDI サイズ比較: ノーマル=${normalMidiSize}, スタイル付き=${styledMidiSize}`);
      
      // スタイルによってMIDIデータが変化することを期待
      // （必ずしもサイズが変わるとは限らないので、生成されることのみ確認）
      expect(normalMidiSize).toBeGreaterThan(0);
      expect(styledMidiSize).toBeGreaterThan(0);
    });

    test('パフォーマンス - 大量スタイル処理', () => {
      const heavySyntax = '@@ 140 1/4 { ' + 
        Array(50).fill('C:leg:d:map(0..2) Dm:U:rn:continue').join(' ') + ' }';

      const startTime = Date.now();
      const result = Conductor.convertToObj(
        true, true, heavySyntax, [], new Map(), {}
      );
      const endTime = Date.now();

      expect(result.id).toBeDefined();
      // console.log(`大量スタイル処理時間: ${endTime - startTime}ms`);
      
      // 10秒以内で処理されることを確認
      expect(endTime - startTime).toBeLessThan(10000);
    });

    test('スタイル無効化テスト', () => {
      // hasStyleCompile を false にしてスタイルを無効化
      const result = Conductor.convertToObj(
        false, // hasStyleCompile = false
        true,
        '@@ 140 1/4 { C:leg:d:map(0..2) }',
        [],
        new Map(),
        {}
      );

      expect(result.id).toBeDefined();
      // console.log(`スタイル無効化: ${result.error ? 'エラー' : '成功'}`);
      
      // スタイルが無効化されても基本的な処理は成功するはず
      expect(result.error).toBeNull();
    });
  });
}); 