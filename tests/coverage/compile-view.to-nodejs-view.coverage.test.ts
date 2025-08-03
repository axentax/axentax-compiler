import { Conductor } from '../../src/conductor/conductor';
import { ToNodejsView } from '../../src/to-nodejs-view';

describe('Compile View', () => {
  describe('ToNodejsView', () => {
    test('should create view from conduct', () => {
      const syntax = "@@ 140 1/4 { C Dm Em F }";
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

      const view = ToNodejsView.createView(result.response!);
      
      expect(view).toBeDefined();
      expect(view.regions).toBeDefined();
      expect(view.noteList).toBeDefined();
      expect(view.syntax).toBeDefined();
      
      // リージョンの確認
      expect(view.regions.length).toBeGreaterThan(0);
      expect(view.regions[0]).toHaveProperty('id');
      expect(view.regions[0]).toHaveProperty('s');
      expect(view.regions[0]).toHaveProperty('e');
      
      // ノートリストの確認
      expect(view.noteList.length).toBeGreaterThan(0);
      if (view.noteList[0].length > 0) {
        const note = view.noteList[0][0];
        expect(note).toHaveProperty('t');
        expect(note).toHaveProperty('r');
        expect(note).toHaveProperty('sym');
        expect(note).toHaveProperty('tab');
        expect(note).toHaveProperty('st');
        expect(note).toHaveProperty('et');
        expect(note).toHaveProperty('sp');
        expect(note).toHaveProperty('ep');
      }
    });

    test('should handle empty conduct', () => {
      const syntax = "@@ 140 1/4 { }";
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

      const view = ToNodejsView.createView(result.response!);
      
      expect(view).toBeDefined();
      expect(view.regions).toBeDefined();
      expect(view.noteList).toBeDefined();
      expect(view.syntax).toBeDefined();
    });

    test('should handle multiple blocks in one region', () => {
      const syntax = "@@ 140 1/4 { C } >> 1/4 { Dm Em F }";
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

      const view = ToNodejsView.createView(result.response!);
      
      // デバッグ情報を出力
      // console.log('Regions:', view.regions.length);
      // console.log('NoteList length:', view.noteList.length);
      if (view.noteList[0]) {
        // console.log('NoteList[0] length:', view.noteList[0].length);
        // console.log('NoteList[0]:', JSON.stringify(view.noteList[0], null, 2));
      }
      if (view.noteList[1]) {
        // console.log('NoteList[1] length:', view.noteList[1].length);
        // console.log('NoteList[1]:', JSON.stringify(view.noteList[1], null, 2));
      }

      // 1つのリージョンに2つのブロックがある状態
      expect(view.regions.length).toBe(1);
      expect(view.noteList.length).toBeGreaterThanOrEqual(2);
      // 1つ目のブロックはCのみ
      expect(view.noteList[0].length).toBe(1);
      expect(view.noteList[0][0].sym).toBe("C");
      // 2つ目のブロックはDm, Em, F
      expect(view.noteList[1].length).toBe(3);
      expect(view.noteList[1][0].sym).toBe("Dm");
      expect(view.noteList[1][1].sym).toBe("Em");
      expect(view.noteList[1][2].sym).toBe("F");
    });

    test('should handle complex syntax with styles', () => {
      const syntax = "@@ 140 1/4 { C:leg Dm:strum(50) }";
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

      const view = ToNodejsView.createView(result.response!);
      
      expect(view).toBeDefined();
      expect(view.regions.length).toBeGreaterThan(0);
      expect(view.noteList.length).toBeGreaterThan(0);
    });

    test('should handle rest notes', () => {
      const syntax = "@@ 140 1/4 { C r Dm }";
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

      const view = ToNodejsView.createView(result.response!);
      
      expect(view).toBeDefined();
      expect(view.regions.length).toBeGreaterThan(0);
      expect(view.noteList.length).toBeGreaterThan(0);
    });

    test('should handle tab notation', () => {
      const syntax = "@@ 140 1/4 { |||||5 |||||7 |||||8 }";
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

      const view = ToNodejsView.createView(result.response!);
      
      expect(view).toBeDefined();
      expect(view.regions.length).toBeGreaterThan(0);
      expect(view.noteList.length).toBeGreaterThan(0);
    });
  });
}); 