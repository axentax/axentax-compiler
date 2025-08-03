import { Conductor } from '../../src/conductor/conductor';

describe('Prefix Examples', () => {
  const testCases = [
    {
      name: "逆ストローク（up picking）",
      syntax: "@@ 140 1/4 { !|||2 }"
    },
    {
      name: "逆ストローク＋強度指定",
      syntax: "@@ 140 1/4 { !''|||3 }"
    },
    {
      name: "通常ストローク（down picking）＋強度指定",
      syntax: "@@ 140 1/4 { ''|||5 }"
    },
    {
      name: "音をつなげる（レガート）",
      syntax: "@@ 140 1/4 { ..|||2 }"
    },
    // {
    //   name: "音をつなげる＋コード",
    //   syntax: "@@ 140 1/4 { ..C }"
    // }, // 未実装機能
    {
      name: "逆ストローク＋スタイル併用",
      syntax: "@@ 140 1/4 { !|||2:leg }"
    },
    {
      name: "音をつなげる＋強度指定（強度は無効）",
      syntax: "@@ 140 1/4 { ..''|||2 }"
    },
    {
      name: "休符",
      syntax: "@@ 140 1/4 { r }"
    },
    {
      name: "ノイズ",
      syntax: "@@ 140 1/4 { R }"
    },
    // {
    //   name: "複雑なパターン",
    //   syntax: "@@ 140 1/4 { !''|||2 ..C ''|||3 }"
    // }, // 未実装機能
  ];

  testCases.forEach(({ name, syntax }) => {
    test(`${name} - should compile successfully`, () => {
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      if (result.error) {
        // console.log(`Test "${name}" failed:`, {
        //   message: result.error.message,
        //   line: result.error.line,
        //   linePos: result.error.linePos,
        //   token: result.error.token
        // });
        throw new Error(`Compilation failed: ${result.error.message}`);
      }

      expect(result.error).toBeNull();
      expect(result.id).toBeDefined();
      expect(result.compileMsec).toBeGreaterThanOrEqual(0);
      expect(result.midi).toBeDefined();
      expect(result.midi!.byteLength).toBeGreaterThan(0);
      expect(result.response).toBeDefined();
      
      // レスポンスの詳細検証
      const response = result.response!;
      expect(response.mixesList).toBeDefined();
      expect(response.mixesList.length).toBeGreaterThan(0);
      expect(response.warnings).toBeDefined();
      
      // ノート数の検証
      const noteCount = response.mixesList[0]?.flatTOList?.length || 0;
      expect(noteCount).toBeGreaterThanOrEqual(0);
    });
  });
}); 