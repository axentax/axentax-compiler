import { Conductor } from '../../src/conductor/conductor';

describe('ResolveBendX Coverage - 予測的エラーケース手法', () => {
  
  describe('ResolveBendX.resolve - ベンド処理の完全カバレッジ', () => {
    
    test('成功ケース: 基本的なベンド処理', () => {
      const syntax = '@@ 120 1/4 { 0|2:bd(2)|2|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: フレットでのベンド', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(1)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 複数フレットでのベンド', () => {
      const syntax = '@@ 120 1/4 { 5|7:bd(2)|7|5|3|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: ベンド幅0', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(0)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 最大ベンド幅超過', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(4)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Pitch can be set from -2 to 2");
    });

    test('成功ケース: 負のベンド値', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(-1)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 無効なベンド指定文字列', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(abc)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Wrong way to bend property");
    });

    test('エラーケース: ベンド範囲超過', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(24)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Pitch can be set from -2 to 2");
    });

    test('成功ケース: レストでのベンド指定', () => {
      const syntax = '@@ 120 1/4 { r:bd(2) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull(); // レストでベンドは許可される
    });

    test('成功ケース: コードでのベンド処理', () => {
      const syntax = '@@ 120 1/4 { C:bd(1) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: デュアルブロックでのベンド', () => {
      const syntax = '@@ { 2|3:bd(2)|3|2|0|0 } >> { C:bd(1) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 無効なベンド括弧', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd[2]|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Wrong way to bend property");
    });

    test('境界値: 小数点ベンド値', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(0.5)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 空のベンド値', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd()|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 複合スタイルでのベンド', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(2):leg 3|5|5|3|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: チューニング外のベンド', () => {
      const syntax = '@@ 120 1/4 { 0|2|2|0|0|0|0|0:bd(2) }'; // 8弦でベンド
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("beyond tuning");
    });

    test('境界値: 最高フレットでのベンド', () => {
      const syntax = '@@ 120 1/4 { 24|24:bd(1)|24|24|24|24 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: ビブラート形式のベンド', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(1.5)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: ベンド処理での内部エラー', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(20)|3|2|0|0 }'; // 極端に大きなベンド値
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Pitch can be set from -2 to 2");
    });

    test('成功ケース: アップダウンベンド組み合わせ', () => {
      const syntax = '@@ 120 1/4 { 5|7:bd(2)|7|5:bd(1)|3|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: ゼロフレットでのベンド', () => {
      const syntax = '@@ 120 1/4 { 0|0:bd(1)|0|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('ベンドエラーケースの網羅テスト', () => {
    test('成功ケース: ベンド記号なしでbd指定', () => {
      const syntax = '@@ 120 1/4 { C:bd }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 複数のベンド値', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(2,3)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Pitch can be set from -2 to 2");
    });

    test('エラーケース: 文字列混入ベンド値', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(2x)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Wrong way to bend property");
    });

    test('成功ケース: 極小ベンド値', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(0.1)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 無限大ベンド値', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(999)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Pitch can be set from -2 to 2");
    });
  });

  describe('ベンド処理の内部処理テスト', () => {
    test('成功ケース: ベンドグループ処理', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(2)|3|2|0|0 3|5:bd(1)|5|3|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 同一フレットでの連続ベンド', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(1) 2|3:bd(2) 2|3:bd(1) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 異なる弦でのベンド', () => {
      const syntax = '@@ 120 1/4 { 0|2:bd(1)|2|0|0|0 0|0|2:bd(1)|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('パフォーマンステスト: 大量ベンド処理', () => {
      const largeBendSyntax = Array(50).fill('2|3:bd(1)|3|2|0|0').join(' ');
      const syntax = `@@ 120 1/4 { ${largeBendSyntax} }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('メモリテスト: ベンド情報の蓄積', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(1)|3|2|0|0 5|7:bd(2)|7|5|3|0 9|12:bd(1)|12|9|7|5 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });
});