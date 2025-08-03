import { ConductTester } from '../../src/index-conduct';

describe('sample-syntax', () => {
  test('should compile sampleSyntax without errors and return expected response structure', () => {
    const result = ConductTester.call({
      isRequiredMidiFile: true,
      compose: true
    });

    // エラーがないことを確認
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    // ConvertToObj.midi と ConvertToObj.response が期待通りに返ってくることを確認
    if (result) {
      // conduct プロパティが存在することを確認
      expect(result.conduct).toBeDefined();
      expect(result.conduct.res).toBeDefined();

      // view プロパティが存在することを確認
      expect(result.view).toBeDefined();

      // conduct.res の主要プロパティが存在することを確認
      const conductRes = result.conduct.res;
      expect(conductRes.mixesList).toBeDefined();
      expect(Array.isArray(conductRes.mixesList)).toBe(true);
      expect(conductRes.mixesList.length).toBeGreaterThan(0);

      // settings が存在することを確認
      expect(conductRes.settings).toBeDefined();

      // bpmPosList が存在することを確認
      expect(conductRes.bpmPosList).toBeDefined();

      // clickPointList が存在することを確認
      expect(conductRes.clickPointList).toBeDefined();

      // view の主要プロパティが存在することを確認
      const view = result.view;
      expect(view.syntax).toBeDefined();
      expect(typeof view.syntax).toBe('string');
      expect(view.syntax.length).toBeGreaterThan(0);

      // MIDIファイルが生成されていることを確認（out2.mid）
      const fs = require('fs-extra');
      const midiPath = 'src/out/out2.mid';
      expect(fs.existsSync(midiPath)).toBe(true);
    }
  });

  test('should handle sampleSyntax compilation with compose option', () => {
    const result = ConductTester.call({
      isRequiredMidiFile: true,
      compose: true
    });

    expect(result).toBeDefined();
    if (result) {
      // compose オプションが有効な場合の処理が正常に動作することを確認
      expect(result.conduct.res.mixesList.length).toBeGreaterThanOrEqual(3); // dualId 0, 1, 2
    }
  });

  test('should handle sampleSyntax compilation without MIDI file generation', () => {
    const result = ConductTester.call({
      isRequiredMidiFile: false,
      compose: true
    });

    // MIDIファイル生成なしの場合は undefined が返る
    expect(result).toBeUndefined();
  });
}); 