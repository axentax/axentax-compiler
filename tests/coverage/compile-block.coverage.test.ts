import { Conductor } from '../../src/conductor/conductor';

describe('Compile Block Coverage', () => {
  describe('基本的なブロック作成', () => {
    test('単一ブロックの作成', () => {
      const syntax = '@@ 120 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('複数ブロックの作成', () => {
      const syntax = '@@ 120 1/4 { C } >> 1/8 { Dm }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('名前付きブロックの作成（無効な構文のテスト）', () => {
      const syntax = '@verse@ 120 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid region prefix");
    });
  });

  describe('ブロックプロパティの解析', () => {
    test('BPMプロパティの設定', () => {
      const syntax = '@@ 140 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('拍子記号プロパティの設定', () => {
      const syntax = '@@ 120 3/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('チューニングプロパティの設定', () => {
      const syntax = '@@ 120 1/4 E|A|D|G|B|E { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('複数プロパティの組み合わせ', () => {
      const syntax = '@@ 150 2/4 E|A|D|G|B|E { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('異なる順序でのプロパティ設定', () => {
      const syntax = '@@ E|A|D|G|B|E 140 3/8 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });

  describe('エラーケース', () => {
    test('重複するブロック名のエラー（無効構文）', () => {
      const syntax = '@verse@ 120 1/4 { C } @verse@ 140 1/8 { Dm }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid region prefix");
    });

    test('無効なブロックプロパティ', () => {
      const syntax = '@@ 120 invalid_prop { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('ブロックが存在しない場合のエラー', () => {
      const syntax = '{ C }'; // @@がない
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid token");
    });

    test('無効なBPM値', () => {
      const syntax = '@@ abc 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Block Property");
    });

    test('無効な拍子記号', () => {
      const syntax = '@@ 120 invalid/time { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Block Property");
    });

    test('無効なチューニング', () => {
      const syntax = '@@ 120 1/4 X|Y|Z { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      // チューニングエラーメッセージを確認
    });
  });

  describe('無効なデュアルチャンネル構文', () => {
    test('無効なデュアルチャンネル構文のテスト', () => {
      const syntax = '@@ 120 1/4 { C } -@@ { Dm }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid syntax");
    });
  });

  describe('特殊ケース', () => {
    test('BPMが未設定の2番目以降のブロック', () => {
      const syntax = '@@ 120 1/4 { C } @@ 1/8 { Dm }'; // 2番目のブロックでBPM省略
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('チューニングが未設定のブロック', () => {
      const syntax = '@@ 120 1/4 { C }'; // デフォルトチューニング使用
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('拍子記号が未設定のブロック', () => {
      const syntax = '@@ 120 { C }'; // デフォルト拍子使用
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('@@（自動名前生成）を使ったブロック', () => {
      const syntax = '@@ 120 1/4 { C } @@ 140 1/8 { Dm }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('複雑な組み合わせ', () => {
      const syntax = `
        @@ 120 1/4 E|A|D|G|B|E { C Dm }
        @@ 140 2/4 { Em F }
        @@ 3/8 { G Am }
      `;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });

  describe('境界値テスト', () => {
    test('最小BPM', () => {
      const syntax = '@@ 1 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('最大BPM', () => {
      const syntax = '@@ 999 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('様々な拍子記号', () => {
      const timeSignatures = ['1/1', '2/2', '3/4', '4/4', '5/8', '6/8', '7/8', '9/8', '12/8'];
      
      timeSignatures.forEach(timeSignature => {
        const syntax = `@@ 120 ${timeSignature} { C }`;
        const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
        
        expect(result.error).toBeNull();
        expect(result.id).toBeDefined();
      });
    });

    test('異なるチューニング', () => {
      const tunings = [
        'E|A|D|G|B|E',      // 標準
        'D|A|D|G|B|E',      // ドロップD
        'E|A|D|G|B|D',      // ドロップBb
        'D|G|C|F|A|D',      // 全音下げ
        'C|F|Bb|Eb|G|C',    // 2音下げ
      ];
      
      tunings.forEach(tuning => {
        const syntax = `@@ 120 1/4 ${tuning} { C }`;
        const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
        
        expect(result.error).toBeNull();
        expect(result.id).toBeDefined();
      });
    });
  });

  describe('compile-block.ts特有のケース', () => {
    test('実際にブロックが1つもない場合', () => {
      // empty syntaxで実際にAt least one 'region' declaration is requiredを発生させる
      const syntax = '';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('無効なBPM値のエラー処理', () => {
      const syntax = '@@ 0 1/4 { C }'; // BPMが範囲外
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('無効な拍子記号のエラー処理', () => {
      const syntax = '@@ 120 0/0 { C }'; // 拍子記号が無効
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
    });

    test('プロパティの順序が異なる場合', () => {
      const syntax = '@@ 1/4 120 E|A|D|G|B|E { C }'; // 順序が異なる
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('チューニングを先頭に置いた場合', () => {
      const syntax = '@@ E|A|D|G|B|E 120 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('BPMのみ設定', () => {
      const syntax = '@@ 150 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('チューニングのみ設定', () => {
      const syntax = '@@ E|A|D|G|B|E { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('拍子記号のみ設定', () => {
      const syntax = '@@ 5/8 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('7弦ギターのチューニング', () => {
      const syntax = '@@ 120 1/4 B|E|A|D|G|B|E { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('4弦ベースのチューニング（エラーケース）', () => {
      const syntax = '@@ 120 1/4 E|A|D|G { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid tuning");
    });

    test('デュアルブロックでのBPM指定エラー', () => {
      const syntax = '@@ { E } >> 111 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("BPM cannot be specified for dual block");
    });
  });

  describe('複雑なネストパターン', () => {
    test('大量のブロック', () => {
      const blocks = Array(10).fill(0).map((_, i) => `@@ ${120 + i * 10} 1/4 { C }`).join(' ');
      const result = Conductor.convertToObj(true, true, blocks, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });

    test('複雑なブロック構造', () => {
      const syntax = `
        @@ 120 1/4 { C }
        @@ 140 1/8 { Em }  
        @@ 160 1/16 { G }
        @@ 2/4 { F }
      `;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
    });
  });
});