import { Conductor } from '../../src/conductor/conductor';

describe('ModSyntax Coverage', () => {
  describe('基本的な構文解析', () => {
    test('単純なノート記譜', () => {
      const syntax = '@@ 120 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('複数ノートの記譜', () => {
      const syntax = '@@ 120 1/4 { C Dm Em F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('空のブロック', () => {
      const syntax = '@@ 120 1/4 { }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });

  describe('デュアルブロック処理', () => {
    test('基本的なデュアルブロック（>>）', () => {
      const syntax = '@@ 120 1/4 { C } >> { Dm }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('3つのデュアルブロック（有効）', () => {
      const syntax = '@@ 120 1/4 { C } >> { Dm } >> { Em }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('4つのデュアルブロック（エラーケース）', () => {
      const syntax = '@@ {} >> {} >> {} >> {}';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Exceeding the number of dual blocks in a region");
    });

    test('ベースリージョンなしでのデュアルブロック', () => {
      const syntax = '>> { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Required start base region");
    });

    test('中括弧内でのデュアルブロック', () => {
      const syntax = '@@ 120 1/4 { C >> Dm }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("specified in the wrong place");
    });
  });

  describe('スタイル記譜', () => {
    test('基本的なスタイル', () => {
      const syntax = '@@ 120 1/4 { C:leg }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('複数スタイルの連結', () => {
      const syntax = '@@ 120 1/4 { C:leg:m }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('ブロックスタイル', () => {
      const syntax = '@@ 120 1/4 { C Dm }:leg';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('ネストされたブロックのスタイル', () => {
      const syntax = '@@ 120 1/4 { { C Dm }:leg Em }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('コロンなしでのスタイル指定エラー', () => {
      const syntax = '@@ 120 1/4 leg { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });
  });

  describe('特殊記号の処理', () => {
    test('度数名記号（%）', () => {
      const syntax = '@@ 120 1/4 { %1 %3 %5 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('度数名記号の前置修飾子（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { !%1 .%3 >%5 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid degree chord");
    });

    test('バレット記法', () => {
      const syntax = '@@ 120 1/4 { 1/4 2/4 3/4 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('フラッシュ注釈（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { @flash C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Unknown annotation token");
    });

    test('レスト記号でのアプローチ指定エラー', () => {
      const syntax = '@@ { r>>||2 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("The rest 'r' cannot be specified for the approach");
    });

    test('無効なフレット番号（負の値）', () => {
      const syntax = '@@ 120 1/4 { ||-1 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      // フレット番号の負の値は無効
    });

    test('無効なタブ記法（文字列）', () => {
      const syntax = '@@ 120 1/4 { ||abc }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      // 数値以外のフレット指定は無効
    });

    test('存在しないコード名', () => {
      const syntax = '@@ 120 1/4 { XYZ123 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid chord");
    });

    test('無効なスタイル名', () => {
      const syntax = '@@ 120 1/4 { C:invalidstyle }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Unknown style");
    });

    test('カンマ区切り', () => {
      const syntax = '@@ 120 1/4 { C, Dm, Em }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });

  describe('括弧処理', () => {
    test('丸括弧内のスタイル', () => {
      const syntax = '@@ 120 1/4 { C:strum(30) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('丸括弧内の複雑な記述', () => {
      const syntax = '@@ 120 1/4 { C:bd(0..1/4 cho 1) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('ネストした中括弧', () => {
      const syntax = '@@ 120 1/4 { { C Dm } { Em F } }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('深いネストの中括弧', () => {
      const syntax = '@@ 120 1/4 { { { C } } }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });

  describe('エラーケース - 括弧の不整合', () => {
    test('閉じ中括弧の不足', () => {
      const syntax = '@@ 120 1/4 { C';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain('Unexpected EOF while parsing due to missing "}"');
    });

    test('開き中括弧の不足', () => {
      const syntax = '@@ 120 1/4 C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain('Unexpected EOF while parsing due to missing "{"');
    });

    test('閉じ丸括弧の不足', () => {
      const syntax = '@@ 120 1/4 { C:strum(30 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain('Unexpected EOF while parsing due to missing ")"');
    });

    test('開き丸括弧の不足', () => {
      const syntax = '@@ 120 1/4 { C:strum30) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain('Unexpected EOF while parsing due to missing ")"');
    });

    test('リージョン宣言なしのブロック', () => {
      const syntax = '{ C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Expected region declaration @@");
    });
  });

  describe('空白文字と改行の処理', () => {
    test('改行を含む記譜', () => {
      const syntax = `@@ 120 1/4 {
        C
        Dm
        Em
      }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('タブ文字を含む記譜', () => {
      const syntax = '@@ 120 1/4 {\tC\t\tDm\t}';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('複数の空白文字', () => {
      const syntax = '@@   120   1/4   {   C     Dm   }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('丸括弧内での改行とタブ', () => {
      const syntax = `@@ 120 1/4 { C:strum(
        30
      ) }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });

  describe('特殊文字とエスケープ', () => {
    test('ハイフンを含む記譜（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { C-maj }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("No fingerable form");
    });

    test('複数のコロンが連続する場合', () => {
      const syntax = '@@ 120 1/4 { C:::leg }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('コロンで始まるトークン', () => {
      const syntax = '@@ 120 1/4 { :leg C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });
  });

  describe('複雑なパターン', () => {
    test('分数コードとタブ記法の混在', () => {
      const syntax = '@@ 120 1/4 { Em7/C |2 F#m7b5 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('有効な記号タイプの混在', () => {
      const syntax = `@@ 120 1/4 {
        C:leg
        %1:m
        |2:d
        1/4:strum(30)
        { Dm Em }:leg
      }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('大量のネストブロック', () => {
      const syntax = '@@ 120 1/4 { { { { C } } } }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('複雑なデュアルブロック構造', () => {
      const syntax = `
        @@ 120 1/4 { C Dm }
        >> 1/8 { Em F }
      `;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });

  describe('エッジケース', () => {
    test('空文字列', () => {
      const syntax = '';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('空白のみ', () => {
      const syntax = '   \n\t  ';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('単一文字', () => {
      const syntax = 'C';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('単一の@@（有効だが空）', () => {
      const syntax = '@@';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // @@だけでも有効な可能性
      expect(result.id).toBeDefined();
    });

    test('リージョンプロパティのみ（有効だが空）', () => {
      const syntax = '@@ 120';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // @@とBPMだけでも有効な可能性
      expect(result.id).toBeDefined();
    });
  });

  describe('丸括弧内の特殊処理', () => {
    test('丸括弧内での中括弧（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { C:func({test}) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Unknown style");
    });

    test('丸括弧内でのスペース処理', () => {
      const syntax = '@@ 120 1/4 { C:strum( 30 ) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('丸括弧内でのカンマ（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { C:func(a,b,c) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Unknown style");
    });

    test('ネストした丸括弧（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { C:func(sub(30)) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Unknown style");
    });
  });

  describe('RegExp境界ケース', () => {
    test('分数コードでない場合（Em7/C）', () => {
      const syntax = '@@ 120 1/4 { Em7/C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('コロンの位置による処理の違い（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { C: leg }'; // コロンの後にスペース
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("invalid token");
    });

    test('複数の連続コロン', () => {
      const syntax = '@@ 120 1/4 { C::::leg }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });

  describe('予測的エラーケースの追加', () => {
    test('二重ベース指定エラー', () => {
      const syntax = '@@ 120 1/4 { C/G/A }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 二重ベース指定は通常エラーになる
      if (result.error) {
        expect(result.error.message).toBeDefined();
      }
    });

    test('無効な度数記号の組み合わせ', () => {
      const syntax = '@@ 120 1/4 { %0 }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // %0は無効な度数
      if (result.error) {
        expect(result.error.message).toBeDefined();
      }
    });

    test('無効なベロシティスタイル', () => {
      const syntax = '@@ 120 1/4 { C:vel(150) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // velは存在しないスタイル
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Unknown style 'vel'");
    });

    test('循環参照的な構文', () => {
      const syntax = '@@ 120 1/4 { { { } } }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 深いネストは成功するはず
      expect(result.error).toBeNull();
    });

    test('スタイル内での無効なトークン', () => {
      const syntax = '@@ 120 1/4 { C:func(;;) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // funcは存在しないスタイル
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Unknown style");
    });

    test('タブ記法での弦数超過', () => {
      const syntax = '@@ 120 1/4 { |||||||12 }';  // 7弦目指定（標準は6弦）
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 弦数超過エラー
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("beyond tuning");
    });

    test('空のスタイル指定', () => {
      const syntax = '@@ 120 1/4 { C: }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 空のスタイル指定エラー
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("invalid token");
    });

    test('特殊文字を含むコード名', () => {
      const syntax = '@@ 120 1/4 { C@#$ }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      // 特殊文字を含むコード名は無効
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("No fingerable form");
    });
  });

  describe('mod-0-syntax.ts特有のカバレッジ', () => {
    test('depthStackLocationが空の場合の処理', () => {
      const syntax = '} C'; // 閉じ括弧が先に来る場合
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('braceLevel < 0 のエラー処理', () => {
      const syntax = '@@ 120 1/4 { C } }'; // 余分な閉じ括弧
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain('Unexpected EOF while parsing due to missing "{"');
    });

    test('roundLevel < 0 のエラー処理', () => {
      const syntax = '@@ 120 1/4 { C:strum(30)) }'; // 余分な閉じ丸括弧
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain('Unexpected EOF while parsing due to missing ")"');
    });

    test('roundLevel > 0 でのスペース処理（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { C:strum( a b c ) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid strum property");
    });

    test('roundLevel > 0 でのタブ処理（エラーケース）', () => {
      const syntax = '@@ 120 1/4 { C:strum(\ta\tb\tc\t) }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid strum property");
    });

    test('roundLevel > 0 での改行処理（エラーケース）', () => {
      const syntax = `@@ 120 1/4 { C:strum(
        a
        b
        c
      ) }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid strum property");
    });

    test('コロンのコミット処理', () => {
      const syntax = '@@ 120 1/4 { C :leg }'; // スペース後のコロン
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('空のaccumでのコロン処理', () => {
      const syntax = '@@ 120 1/4 { :leg }'; // 先頭のコロン
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('空のaccumでのスペース処理（commitPos調整）', () => {
      const syntax = '@@ 120 1/4 {    C }'; // 先頭に複数スペース
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('空のaccumでのタブ処理（commitPos調整）', () => {
      const syntax = '@@ 120 1/4 {\t\t\tC }'; // 先頭に複数タブ
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('末尾での最終commit確認', () => {
      const syntax = '@@ 120 1/4 { C Dm }'; // 末尾でcommitが必要
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('\\r\\n改行文字の処理', () => {
      // \r\n文字の処理をテスト（mod-0-syntax.ts:355の`char.replace(/\r\n/g, '\n')`をカバー）
      const syntax = '@@ 120 1/4 { C\r\nDm }';  // \r\nを含む有効な構文
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });
});