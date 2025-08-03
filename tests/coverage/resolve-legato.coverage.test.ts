import { Conductor } from '../../src/conductor/conductor';

describe('ResolveLegato Coverage - 予測的エラーケース手法', () => {
  
  describe('ResolveLegato.resolve - レガート処理の完全カバレッジ', () => {
    
    test('成功ケース: 基本的なレガート処理', () => {
      const syntax = '@@ 120 1/4 { C:leg D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜でのレガート', () => {
      const syntax = '@@ 120 1/4 { 0|2|2|0|0|0:leg 0|3|3|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 複数ノートでのレガート', () => {
      const syntax = '@@ 120 1/4 { C:leg D:leg E F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: デグリー記号でのレガート', () => {
      const syntax = '@@ 120 1/4 { %1:leg %2 %3 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: レガートチェーン処理', () => {
      const syntax = '@@ 120 1/4 { C:leg D:leg E:leg F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 単一ノートでのレガート', () => {
      const syntax = '@@ 120 1/4 { C:leg }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: レストでのレガート指定', () => {
      const syntax = '@@ 120 1/4 { r:leg C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull(); // レストでレガートは許可される
    });

    test('成功ケース: 複合スタイルでのレガート', () => {
      const syntax = '@@ 120 1/4 { C:leg:stroke D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: デュアルブロックでのレガート', () => {
      const syntax = '@@ { C:leg D } >> { E:leg F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 長いレガートチェーン', () => {
      const legatoChain = Array(10).fill('C:leg').join(' ') + ' D';
      const syntax = `@@ 120 1/4 { ${legatoChain} }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 異なるコードでのレガート', () => {
      const syntax = '@@ 120 1/4 { C:leg Dm:leg Em F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: フレット指定とレガート', () => {
      const syntax = '@@ 120 1/4 { 3|5|5|3|0|0:leg 5|7|7|5|3|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 無効なレガート記法', () => {
      const syntax = '@@ 120 1/4 { C:legato D }'; // "leg"ではなく"legato"
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Unknown style");
    });

    test('成功ケース: アルペジオとレガート', () => {
      const syntax = '@@ 120 1/4 { C/E:leg Dm/F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最小拍子でのレガート', () => {
      const syntax = '@@ 60 1/8 { C:leg D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最大拍子でのレガート', () => {
      const syntax = '@@ 200 1/2 { C:leg D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜コードでのレガート', () => {
      const syntax = '@@ 120 1/4 { 0|2|2|1|0|0:leg 0|3|3|2|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: プレフィックスとレガート', () => {
      const syntax = "@@ 120 1/4 { 'C:leg D }";
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('パフォーマンステスト: 大量レガート処理', () => {
      const largeLegatoSyntax = Array(100).fill('C:leg').join(' ') + ' D';
      const syntax = `@@ 120 1/4 { ${largeLegatoSyntax} }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: レガート処理での予期しないエラー', () => {
      const syntax = '@@ 120 1/4 { invalid:leg D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord name");
    });
  });

  describe('レガート状態管理テスト', () => {
    test('成功ケース: レガート状態の継続', () => {
      const syntax = '@@ 120 1/4 { C:leg D E F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: レガート状態のリセット構文エラー', () => {
      const syntax = '@@ 120 1/4 { C:leg D } { E F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Expected region declaration");
    });

    test('エラーケース: 複数ブロックでのレガート構文エラー', () => {
      const syntax = '@@ 120 1/4 { C:leg D } { E:leg F } { G }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Expected region declaration");
    });

    test('エラーケース: 空ブロック後のレガート構文エラー', () => {
      const syntax = '@@ 120 1/4 { } { C:leg D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Expected region declaration");
    });

    test('エラーケース: コンティニューとレガート構文エラー', () => {
      const syntax = '@@ 120 1/4 { C:leg ..D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("This prefix cannot be used in chord specifications");
    });
  });

  describe('レガート処理の内部ロジックテスト', () => {
    test('成功ケース: レガート接続情報の生成', () => {
      const syntax = '@@ 120 1/4 { 0|2|2|0|0|0:leg 0|3|3|0|0|0 0|5|5|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 異弦間でのレガート', () => {
      const syntax = '@@ 120 1/4 { 0|2|2|0|0|0:leg 3|0|0|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最高フレットでのレガート', () => {
      const syntax = '@@ 120 1/4 { 24|24|24|24|24|24:leg 22|22|22|22|22|22 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 開放弦でのレガート', () => {
      const syntax = '@@ 120 1/4 { 0|0|0|0|0|0:leg 0|2|2|0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('メモリテスト: レガート情報の蓄積', () => {
      const syntax = '@@ 120 1/4 { C:leg D:leg E:leg F:leg G:leg A:leg B C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });
});