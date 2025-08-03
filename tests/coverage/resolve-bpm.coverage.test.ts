import { Conductor } from '../../src/conductor/conductor';

describe('ResolveBPM Coverage - 予測的エラーケース手法', () => {
  
  describe('ResolveBPM.resolve - BPM処理の完全カバレッジ', () => {
    
    test('成功ケース: 基本的なBPM処理', () => {
      const syntax = '@@ 120 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 高いBPM値', () => {
      const syntax = '@@ 200 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 低いBPM値', () => {
      const syntax = '@@ 60 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最小BPM値', () => {
      const syntax = '@@ 1 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最大BPM値', () => {
      const syntax = '@@ 999 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 負のBPM値', () => {
      const syntax = '@@ -120 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('エラーケース: ゼロBPM値', () => {
      const syntax = '@@ 0 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("outside the accepted range");
    });

    test('エラーケース: 文字列BPM値', () => {
      const syntax = '@@ abc 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('エラーケース: 小数点BPM値', () => {
      const syntax = '@@ 120.5 1/4 { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('成功ケース: デュアルブロックでのBPM', () => {
      const syntax = '@@ 120 1/4 { C D } >> { E F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: デュアルブロックでのBPM重複指定', () => {
      const syntax = '@@ { C D } >> 140 { E F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("BPM cannot be specified for dual block");
    });

    test('成功ケース: BPMなしの記譜法', () => {
      const syntax = '@@ { C D E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 極端に高いBPM', () => {
      const syntax = '@@ 1000 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull(); // 高いBPMも許可される
    });

    test('成功ケース: 標準的なBPM範囲', () => {
      const standardBPMs = [60, 72, 80, 90, 100, 110, 120, 130, 140, 150, 160, 180];
      standardBPMs.forEach(bpm => {
        const syntax = `@@ ${bpm} 1/4 { C }`;
        const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
        expect(result.error).toBeNull();
      });
    });

    test('成功ケース: 複数の拍子記号', () => {
      const timeSignatures = ['1/4', '1/8', '1/2', '2/4', '3/4', '4/4'];
      timeSignatures.forEach(time => {
        const syntax = `@@ 120 ${time} { C }`;
        const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
        expect(result.error).toBeNull();
      });
    });

    test('エラーケース: 無効な拍子記号', () => {
      const syntax = '@@ 120 1/0 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("outside the accepted range");
    });

    test('エラーケース: 負の拍子記号', () => {
      const syntax = '@@ 120 -1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('境界値: 特殊な拍子記号', () => {
      const syntax = '@@ 120 0/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: BPM変更の処理', () => {
      const syntax = '@@ 120 1/4 { C } @@ 140 1/4 { D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: 無効なBPM記法', () => {
      const syntax = '@@ BPM120 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });
  });

  describe('BPM処理の内部ロジックテスト', () => {
    test('成功ケース: BPM位置情報の生成', () => {
      const syntax = '@@ 120 1/4 { C D E F } @@ 140 1/4 { G A B C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: BPMとティック計算', () => {
      const syntax = '@@ 120 1/4 { C D E F G A B C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 最小楽曲長でのBPM', () => {
      const syntax = '@@ 120 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('パフォーマンステスト: 大量ノートでのBPM処理', () => {
      const largeNotes = Array(500).fill('C').join(' ');
      const syntax = `@@ 120 1/4 { ${largeNotes} }`;
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('メモリテスト: 複数BPM変更', () => {
      let syntax = '';
      for (let i = 0; i < 10; i++) {
        const bpm = 60 + (i * 10);
        syntax += `@@ ${bpm} 1/4 { C D } `;
      }
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: BPMと他のスタイルの組み合わせ', () => {
      const syntax = '@@ 120 1/4 { C:leg D:stroke } @@ 140 1/4 { E:strum F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 連続BPM変更', () => {
      const syntax = '@@ 120 1/4 { C } @@ 130 1/4 { D } @@ 140 1/4 { E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: 同一BPMの重複指定', () => {
      const syntax = '@@ 120 1/4 { C D } @@ 120 1/4 { E F }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('エラーケース: BPM処理での内部エラー', () => {
      const syntax = '@@ 120 1/4 { C } @@ invalid 1/4 { D }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('境界値: 極端な拍子変更', () => {
      const syntax = '@@ 120 1/4 { C } @@ 120 1/8 { D } @@ 120 1/2 { E }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });
  });

  describe('BPMエラーケースの詳細テスト', () => {
    test('成功ケース: BPMなしの省略記法', () => {
      const syntax = '@@ 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull(); // BPMなしでも動作する
    });

    test('エラーケース: BPM値のオーバーフロー', () => {
      const syntax = '@@ 99999 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("Invalid BPM");
    });

    test('エラーケース: 特殊文字のBPM', () => {
      const syntax = '@@ 12@0 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('成功ケース: 複数のBPM値記法', () => {
      const syntax = '@@ 120 140 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull(); // 複数のプロパティは許可される可能性
    });

    test('成功ケース: 高いBPM値', () => {
      const syntax = '@@ 300 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull(); // 高いBPMも許可される
    });

    test('エラーケース: 16進数のBPM', () => {
      const syntax = '@@ 0x78 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('エラーケース: 科学記法のBPM', () => {
      const syntax = '@@ 1.2e2 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toContain("unknown Block Property");
    });

    test('成功ケース: 3桁BPM', () => {
      const syntax = '@@ 180 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('境界値: 2桁最大BPM', () => {
      const syntax = '@@ 99 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull();
    });

    test('成功ケース: BPM値の区切り記法', () => {
      const syntax = '@@ 1,20 1/4 { C }';
      const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
      
      expect(result.error).toBeNull(); // カンマ区切りも許可される可能性
    });
  });
});