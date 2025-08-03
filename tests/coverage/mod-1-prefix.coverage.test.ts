import { Conductor } from '../../src/conductor/conductor';

describe('mod-1-prefix Coverage - 予測的エラーケース手法', () => {
  
  describe('ModPrefix.resolve - プレフィックス解析の完全カバレッジ', () => {
    
    test('成功ケース: 基本的なコード記号', () => {
      const syntax = '@@ 120 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 基本的なタブ譜', () => {
      const syntax = '@@ 120 1/4 { 0|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 基本的なデグリー記号', () => {
      const syntax = '@@ 120 1/4 { %1 %2 %3 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 無効なバレット記号', () => {
      const syntax = '@@ 120 1/4 { 0|2-3-0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid tab token");
    });
  });

  describe('ミュートノイズ（rn）処理のテスト', () => {
    test('成功ケース: rnミュートノイズ', () => {
      const syntax = '@@ 120 1/4 { rn }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: Rミュートノイズ', () => {
      const syntax = '@@ 120 1/4 { R }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: rnにテール記号付き', () => {
      const syntax = '@@ 120 1/4 { rn^ rn~ rn= }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: Rにテール記号付き', () => {
      const syntax = '@@ 120 1/4 { R^ R~ R= }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('アプローチ（>>）処理のエラーケース', () => {
    test('成功ケース: 基本的なアプローチ', () => {
      const syntax = '@@ 120 1/4 { 0|2|2>>2|3|3 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: アプローチにフレット指定', () => {
      const syntax = '@@ 120 1/4 { 2|3!200>>4|5 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: レストでのアプローチ指定', () => {
      const syntax = '@@ 120 1/4 { r>>C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("The rest 'r' cannot be specified for the approach");
    });

    test('エラーケース: レストを含むタブでのアプローチ', () => {
      const syntax = '@@ 120 1/4 { 0|r|2>>2|3|3 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("The rest 'r' cannot be specified for the approach");
    });

    test('エラーケース: 無効なアプローチプレフィックス（単独>）', () => {
      const syntax = '@@ 120 1/4 { >C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
      expect(result.error?.message).toContain("This prefix cannot be used in chord specifications");
    });

    test('エラーケース: 無効なアプローチプレフィックス（>>のみ）', () => {
      const syntax = '@@ 120 1/4 { >>C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
    });
  });

  describe('コンティニュー（..）処理のテスト', () => {
    test('エラーケース: コンティニュープレフィックスエラー', () => {
      const syntax = '@@ 120 1/4 { ..C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
    });

    test('エラーケース: プレフィックス付きコンティニューエラー', () => {
      const syntax = '@@ 120 1/4 { /..C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
    });

    test('成功ケース: ストロークとコンティニューの組み合わせ', () => {
      const syntax = '@@ 120 1/4 { \'..C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 3つのドット（無効なコンティニュー）', () => {
      const syntax = '@@ 120 1/4 { ...C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
      expect(result.error?.message).toContain("This prefix cannot be used in chord specifications");
    });

    test('エラーケース: 単独ドット', () => {
      const syntax = '@@ 120 1/4 { .C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
    });
  });

  describe('ストラム（/）処理のテスト', () => {
    test('エラーケース: ストラムプレフィックスエラー', () => {
      const syntax = '@@ 120 1/4 { /C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
    });

    test('成功ケース: タブ譜でのストラム', () => {
      const syntax = '@@ 120 1/4 { /0|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜でのストローク + ストラム', () => {
      const syntax = '@@ 120 1/4 { \'/0|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜での複数ストローク + ストラム', () => {
      const syntax = '@@ 120 1/4 { \'\'/0|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('ストローク（\'）処理のテスト', () => {
    test('成功ケース: 基本的なストローク', () => {
      const syntax = '@@ 120 1/4 { \'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 複数ストローク（2つ）', () => {
      const syntax = '@@ 120 1/4 { \'\'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 複数ストローク（最大8つ）', () => {
      const syntax = '@@ 120 1/4 { \'\'\'\'\'\'\'\'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: アップストローク（!）', () => {
      const syntax = '@@ 120 1/4 { !C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: アップストロークと複数ストローク', () => {
      const syntax = '@@ 120 1/4 { !\'\'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: ストローク数上限超過（9つ）', () => {
      const syntax = '@@ 120 1/4 { \'\'\'\'\'\'\'\'\'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("The prefix >>'<< that specifies stroke cannot exceed 8");
    });

    test('エラーケース: ストローク数上限超過（10個以上）', () => {
      const syntax = '@@ 120 1/4 { \'\'\'\'\'\'\'\'\'\'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("The prefix >>'<< that specifies stroke cannot exceed 8");
    });
  });

  describe('無効なプレフィックスエラーケース', () => {
    test('エラーケース: 無効なコード記号プレフィックス（/で始まる）', () => {
      const syntax = '@@ 120 1/4 { /invalid }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
      expect(result.error?.message).toContain("This prefix cannot be used in chord specifications");
    });

    test('エラーケース: 無効なコード記号プレフィックス（.で始まる）', () => {
      const syntax = '@@ 120 1/4 { .invalid }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
    });

    test('エラーケース: 無効なコード記号プレフィックス（>で始まる）', () => {
      const syntax = '@@ 120 1/4 { >invalid }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
    });

    test('エラーケース: 無効なデグリー記号プレフィックス（/で始まる）', () => {
      const syntax = '@@ 120 1/4 { %/1 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid degree chord symbol");
      expect(result.error?.message).toContain("This prefix cannot be used in chord specifications");
    });

    test('エラーケース: 無効なデグリー記号プレフィックス（.で始まる）', () => {
      const syntax = '@@ 120 1/4 { %.1 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid degree chord symbol");
    });

    test('エラーケース: 無効なデグリー記号プレフィックス（>で始まる）', () => {
      const syntax = '@@ 120 1/4 { %>1 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid degree chord symbol");
    });

    test('エラーケース: 無効なトークンプレフィックス（!単独）', () => {
      const syntax = '@@ 120 1/4 { !invalid }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord name");
    });
  });

  describe('複合プレフィックスの組み合わせテスト', () => {
    test('成功ケース: タブ譜でのストローク + コンティニュー', () => {
      const syntax = '@@ 120 1/4 { \'..|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: アップストローク + ストラムエラー', () => {
      const syntax = '@@ 120 1/4 { !/C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid token prefix");
    });

    test('成功ケース: タブ譜での複合ストローク + コンティニュー', () => {
      const syntax = '@@ 120 1/4 { \'\'..|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜でのアプローチ + ストローク', () => {
      const syntax = '@@ 120 1/4 { \'0|2|2>>2|3|3 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜でのコンティニュー + ストラム', () => {
      const syntax = '@@ 120 1/4 { /..|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('バレット記号でのプレフィックステスト', () => {
    test('エラーケース: バレットでのストロークエラー', () => {
      const syntax = '@@ 120 1/4 { \'0|2-3-0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid tab token");
    });

    test('エラーケース: バレットでのストラムエラー', () => {
      const syntax = '@@ 120 1/4 { /0|2-3-0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid tab token");
    });

    test('エラーケース: バレットでのコンティニューエラー', () => {
      const syntax = '@@ 120 1/4 { ..0|2-3-0|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid tab token");
    });
  });

  describe('エッジケースと境界値テスト', () => {
    test('境界値: ストローク1個', () => {
      const syntax = '@@ 120 1/4 { \'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: ストローク8個（上限）', () => {
      const syntax = '@@ 120 1/4 { \'\'\'\'\'\'\'\'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エッジケース: 空のトークンでのプレフィックス', () => {
      const syntax = '@@ 120 1/4 { \'/.. }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 空のトークンはエラーになる可能性が高い
      expect(result.error !== null || result instanceof Error).toBeTruthy();
    });

    test('エッジケース: プレフィックスのみでノート部分なし', () => {
      const syntax = '@@ 120 1/4 { \'\' }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // プレフィックスのみはエラーになる可能性が高い
      expect(result.error !== null || result instanceof Error).toBeTruthy();
    });
  });

  describe('デュアルブロックでのプレフィックステスト', () => {
    test('エラーケース: デュアルブロックでの異なるプレフィックスエラー', () => {
      const syntax = '@@ { \'C } >> { /D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
    });

    test('成功ケース: デュアルブロックでの複合プレフィックス', () => {
      const syntax = '@@ { \'/..C } >> { \'\'D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: デュアルブロックでのアプローチ', () => {
      const syntax = '@@ { 0|2|2>>2|3|3 } >> { \'C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('タブ譜でのプレフィックス成功テスト', () => {
    test('成功ケース: タブ譜でのコンティニュー', () => {
      const syntax = '@@ 120 1/4 { ..|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜でのプレフィックス付きコンティニュー', () => {
      const syntax = '@@ 120 1/4 { /..|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜でのアップストローク', () => {
      const syntax = '@@ 120 1/4 { !|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: タブ譜でのアップストローク + ストローク', () => {
      const syntax = '@@ 120 1/4 { !\'|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('エラーメッセージの特定カバレッジテスト', () => {
    test('エラーケース: 無効なトークンプレフィックス（ドット単独）', () => {
      const syntax = '@@ 120 1/4 { .invalid }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord symbol");
      expect(result.error?.message).toContain("This prefix cannot be used in chord specifications");
    });

    test('エラーケース: 無効なトークンプレフィックス（>単独）', () => {
      const syntax = '@@ 120 1/4 { >|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid approach prefix");
      expect(result.error?.message).toContain("||||2|2>>||||5|5");
    });

    test('エラーケース: 無効なトークンプレフィックス（!単独）', () => {
      const syntax = '@@ 120 1/4 { !|2|2|1|0|invalid }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid tab token");
    });

    test('成功ケース: タブ譜での3ドットコンティニューエラー', () => {
      const syntax = '@@ 120 1/4 { ...|2|2|1|0|0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid continue prefix");
      expect(result.error?.message).toContain("Continue dots are only valid for 2 connections");
    });
  });
});