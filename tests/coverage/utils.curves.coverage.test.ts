import { Conductor } from '../../src/conductor/conductor';

describe('Utils.curves Coverage - 予測的エラーケース手法', () => {
  
  describe('ベンド処理の完全カバレッジ', () => {
    
    test('成功ケース: 基本的なベンド処理', () => {
      const syntax = '@@ 120 1/4 { C:bd(1) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜でのベンド処理', () => {
      const syntax = '@@ 120 1/4 { 2|3:bd(1)|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: レガートとベンドの組み合わせ', () => {
      const syntax = '@@ 120 1/4 { C:bd(1):leg D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: ストロークとベンドの組み合わせ', () => {
      const syntax = '@@ 120 1/4 { C:bd(1):stroke D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最小ベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.001) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最大ベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(2) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 負のベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(-3) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Pitch can be set from -2 to 2");
    });

    test('エラーケース: 範囲外のベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(5) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Pitch can be set from -2 to 2");
    });

    test('成功ケース: ベンドと他のスタイルの組み合わせ', () => {
      const syntax = '@@ 120 1/4 { 2|3|3|2|0|0:bd(1):leg }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: ベンドと他のスタイルの組み合わせ2', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.5):leg D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: ゼロベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(0) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 小数点ベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.123) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 無効なベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(abc) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Wrong way to bend property");
    });

    test('成功ケース: デュアルブロックでのベンド', () => {
      const syntax = '@@ { C:bd(1) D } >> { E:bd(0.5) F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 空のベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd() D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 高精度ベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.12345) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 境界線ベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(1.999) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 文字列混入ベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.1x) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Wrong way to bend property");
    });

    test('成功ケース: タブ譜でのベンド', () => {
      const syntax = '@@ 120 1/4 { 0|2:bd(0.5)|2|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: デグリー記号でのベンド', () => {
      const syntax = '@@ 120 1/4 { %1:bd(0.5) %2 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('ベンド処理の内部ロジックテスト', () => {
    test('成功ケース: ベンド補間処理', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.5) D:bd(1) E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 段階的ベンド変化', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.5) D:bd(1) E:bd(1.5) F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 極小ベンド変化', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.001) D:bd(0.002) E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('パフォーマンステスト: 大量ベンド処理', () => {
      const largeBendSyntax = Array(100).fill('C:bd(1)').join(' ');
      const syntax = `@@ 120 1/4 { ${largeBendSyntax} }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('メモリテスト: ベンド情報の蓄積', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.5) D:bd(1) E:bd(1.5) F:bd(2) G:bd(-1) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 非線形ベンド処理', () => {
      const syntax = '@@ 120 1/4 { C:bd(1) D:bd(0.5) E:bd(2) F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: ゼロからのベンド開始', () => {
      const syntax = '@@ 120 1/4 { C D:bd(1) E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: ベンド終了処理', () => {
      const syntax = '@@ 120 1/4 { C:bd(1) D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 単一ノートでのベンド', () => {
      const syntax = '@@ 120 1/4 { C:bd(1) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: ベンド重複処理', () => {
      const syntax = '@@ 120 1/4 { C:bd(1):bd(0.5) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('特殊なベンドパターンテスト', () => {
    test('成功ケース: 対称ベンドパターン', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.5) D:bd(2) E:bd(0.5) F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 階段状ベンドパターン', () => {
      const syntax = '@@ 120 1/4 { C:bd(0.5) C:bd(0.5) D:bd(1) D:bd(1) E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 逆方向ベンドパターン', () => {
      const syntax = '@@ 120 1/4 { C:bd(2) D:bd(0.5) E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最大精度ベンド', () => {
      const syntax = '@@ 120 1/4 { C:bd(1.999999) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 範囲外の大きなベンド値', () => {
      const syntax = '@@ 120 1/4 { C:bd(10) D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Pitch can be set from -2 to 2");
    });
  });
});