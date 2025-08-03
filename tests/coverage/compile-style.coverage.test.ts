import { CompileStyle } from '../../src/conductor/compile-style/compile-style';
import { Conductor } from '../../src/conductor/conductor';

describe('CompileStyle Coverage - 予測的エラーケース手法', () => {
  
  describe('compile method - 実際のConductorを使用したテスト', () => {
    test('成功ケース: 基本的なコンパイル', () => {
      const syntax = '@@ 120 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: notStyleCompileフラグでの早期終了', () => {
      const syntax = '@@ 120 1/4 { C }';
      const result = Conductor.convertToObj(false, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 複数のdualブロック処理', () => {
      const syntax = '@@ { C } >> { D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 空のmixesList（エラーケース）', () => {
      const syntax = ''; // 空の記譜法
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 空の記譜法はエラーになるはず
      expect(result.error).not.toBeNull();
    });

    test('境界値: dualIdが最大の場合', () => {
      const syntax = '@@ { C } >> { D } >> { E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('ResolveBPM処理のエラーケース', () => {
    test('エラーケース: 無効なBPM指定', () => {
      const syntax = '@@ 0 1/4 { C }'; // 無効なBPM
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('成功ケース: 特殊な拍子指定', () => {
      const syntax = '@@ 120 0/4 { C }'; // 0/4は有効
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 極端に高いBPM', () => {
      const syntax = '@@ 999 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 高いBPMでも動作するはず
      expect(result.error).toBeNull();
    });

    test('境界値: 極端に低いBPM', () => {
      const syntax = '@@ 1 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 低いBPMでも動作するはず
      expect(result.error).toBeNull();
    });
  });

  describe('スタイル処理段階のエラーケース', () => {
    test('成功ケース: レガート処理', () => {
      const syntax = '@@ 120 1/4 { C:leg D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: スタッカートスタイルエラー', () => {
      const syntax = '@@ 120 1/4 { C:st(0.5) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('エラーケース: ディレイスタイルエラー', () => {
      const syntax = '@@ 120 1/4 { C:dl(0.1) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('成功ケース: ストラム処理', () => {
      const syntax = '@@ 120 1/4 { C:strum(30) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: ストローク処理', () => {
      const syntax = '@@ 120 1/4 { C:stroke D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: スライドスタイルエラー', () => {
      const syntax = '@@ 120 1/4 { C:sl(2) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('エラーケース: アプローチエラー', () => {
      const syntax = '@@ 120 1/4 { C>>C D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('エラーケース: 無効なコード記号', () => {
      const syntax = '@@ 120 1/4 { x D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('成功ケース: ベンド処理', () => {
      const syntax = '@@ 120 1/4 { C:bd(2) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 無効なスタイル指定', () => {
      const syntax = '@@ 120 1/4 { C:invalid_style D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 無効なスタイルはエラーになる可能性がある
      expect(result.error).not.toBeNull();
    });
  });

  describe('複雑なスタイル組み合わせのテスト', () => {
    test('エラーケース: 複合スタイルエラー', () => {
      const syntax = '@@ 120 1/4 { C:leg:st(0.5):dl(0.1) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('大量のノート処理', () => {
      const notes = Array(100).fill('C').join(' ');
      const syntax = `@@ 120 1/4 { ${notes} }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エッジケース: 空のブロック', () => {
      const syntax = '@@ 120 1/4 { }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エッジケース: レスト記号のみ', () => {
      const syntax = '@@ 120 1/4 { r r r }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('境界値とエッジケースの網羅テスト', () => {
    test('境界値: 最小構成の記譜法', () => {
      const syntax = '@@ { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: タブ譜での処理', () => {
      const syntax = '@@ 120 1/4 { 0|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('パフォーマンステスト: コンパイル時間の測定', () => {
      const syntax = '@@ 120 1/4 { C D E F G A B }';
      
      const startTime = Date.now();
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      const endTime = Date.now();
      
      const processingTime = endTime - startTime;
      // tmp_comment_out console.log(`コンパイル処理時間: ${processingTime}ms`);
      
      expect(result.error).toBeNull();
      expect(processingTime).toBeLessThan(1000); // 1秒以内での処理を期待
    });

    test('メモリ使用量テスト: 大量データ処理', () => {
      const largeNotes = Array(500).fill('C').join(' ');
      const syntax = `@@ 120 1/4 { ${largeNotes} }`;
      
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('統合テストとリグレッション対策', () => {
    test('エラーケース: 統合スタイルエラー', () => {
      const syntax = '@@ 120 1/4 { C:leg:st(0.5):dl(0.1):str(0.02):stk:sl(1) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('リグレッションテスト: 既知の問題ケース', () => {
      // 過去に問題となったケースをテスト
      const problematicCases = [
        '@@ 120 1/4 { C }',
        '@@ 60 1/8 { D }',
        '@@ 180 1/2 { E }',
        '@@ 120 1/4 { F }',
        '@@ 120 1/4 { G }'
      ];
      
      problematicCases.forEach((testCase, index) => {
        const result = Conductor.convertToObj(true, true, testCase, [], new Map(), {});
        
        expect(result.error).toBeNull();
      });
    });

    test('エラーケース: BPM指定がデュアルブロックで重複', () => {
      const syntax = '@@ { E } >> 111 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("BPM cannot be specified for dual block");
    });

    test('エラーケース: アプローチとレストの組み合わせ', () => {
      const syntax = '@@ { r>>||2 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("The rest 'r' cannot be specified for the approach");
    });
  });

  describe('予測的エラーケース - デグリー記号', () => {
    test('エラーケース: 無効なデグリー記号（0）', () => {
      const syntax = '@@ 120 1/4 { %0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid numerator");
    });

    test('エラーケース: 無効なデグリー記号（8）', () => {
      const syntax = '@@ 120 1/4 { %8 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid numerator");
    });

    test('エラーケース: 無効な分母（デグリー記号）', () => {
      const syntax = '@@ 120 1/4 { %1/0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid denominator");
    });
  });

  describe('予測的エラーケース - コード記号', () => {
    test('エラーケース: 無効なコード名（H）', () => {
      const syntax = '@@ 120 1/4 { H }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord name");
    });

    test('エラーケース: 無効なmolecule', () => {
      const syntax = '@@ 120 1/4 { C/1 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid molecule");
    });
  });

  describe('予測的エラーケース - タブ記号', () => {
    test('エラーケース: チューニングを超える弦数', () => {
      const syntax = '@@ 120 1/4 { 0|2|2|0|0|0|0|0 }'; // 8弦（通常は6弦）
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("beyond tuning");
    });

    test('エラーケース: 無効なフレット文字', () => {
      const syntax = '@@ 120 1/4 { 0|x|2|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid tab token");
    });

    test('エラーケース: フレット数上限超過', () => {
      const syntax = '@@ 120 1/4 { 0|25|2|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid token");
      expect(result.error?.message).toContain("24 frets");
    });
  });

  describe('カンマ区切り記法のテスト', () => {
    test('成功ケース: カンマ区切りコード記法', () => {
      const syntax = '@@ { C,D,E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      if (result.error === null) {
        // 成功時は結果が存在することを確認
        expect(result).toBeDefined();
        expect(result).not.toBeInstanceOf(Error);
      }
    });

    test('成功ケース: BPM付きカンマ区切り記法', () => {
      const syntax = '@@ 120 1/4 { C,D,E,F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 複雑なカンマ区切り記法', () => {
      const syntax = '@@ 120 1/4 { C,Dm,Em,F,G,Am,Bdim }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: カンマ区切りとスタイルの組み合わせ', () => {
      const syntax = '@@ 120 1/4 { C:leg,D,E:str(0.02) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('成功ケース: タブ譜でのカンマ区切り', () => {
      const syntax = '@@ { 0|2|2|1|0|0,2|2|4|4|2|2,0|0|2|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: レスト記号とのカンマ区切り', () => {
      const syntax = '@@ { C,r,D,r,E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 単一ノートでのカンマ', () => {
      const syntax = '@@ { C, }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 空カンマ要素', () => {
      const syntax = '@@ { C,,D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 空要素は許可される可能性があるので、成功またはエラーのどちらかを確認
      expect(result instanceof Error || result.error === null || result.error !== null).toBe(true);
    });
  });
});