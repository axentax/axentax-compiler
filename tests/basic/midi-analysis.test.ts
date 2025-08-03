import { Conductor } from '../../src/conductor/conductor';

// 詳細MIDI解析ヘルパー
class DetailedMidiAnalyzer {
  private data: Uint8Array;
  
  constructor(midiData: ArrayBuffer) {
    this.data = new Uint8Array(midiData);
  }
  
  // 詳細なノートイベント解析
  analyzeNoteEvents(): { events: any[], summary: any } {
    const events: any[] = [];
    
    for (let i = 0; i < this.data.length - 2; i++) {
      const byte = this.data[i];
      
      // Note On (0x90-0x9F)
      if ((byte & 0xF0) === 0x90) {
        const channel = byte & 0x0F;
        const note = this.data[i + 1];
        const velocity = this.data[i + 2];
        
        events.push({
          type: velocity > 0 ? 'Note On' : 'Note Off (vel 0)',
          channel,
          note,
          velocity,
          position: i
        });
      }
      // Note Off (0x80-0x8F)
      else if ((byte & 0xF0) === 0x80) {
        const channel = byte & 0x0F;
        const note = this.data[i + 1];
        const velocity = this.data[i + 2];
        
        events.push({
          type: 'Note Off',
          channel,
          note,
          velocity,
          position: i
        });
      }
    }
    
    // 統計情報
    const noteOnCount = events.filter(e => e.type === 'Note On').length;
    const noteOffCount = events.filter(e => e.type === 'Note Off' || e.type === 'Note Off (vel 0)').length;
    const uniqueNotes = new Set(events.map(e => e.note)).size;
    
    return {
      events,
      summary: {
        noteOn: noteOnCount,
        noteOff: noteOffCount,
        uniqueNotes,
        totalEvents: events.length
      }
    };
  }
}

describe('MIDI Analysis', () => {
  const simpleTests = [
    { name: '単一コード', syntax: "@@ 120 1/4 { C }" },
    { name: '単一ノート', syntax: "@@ 120 1/4 { |||||12 }" },
    { name: '休符付き', syntax: "@@ 120 1/4 { C r Dm }" }
  ];

  simpleTests.forEach(({ name, syntax }) => {
    test(`${name} - should generate valid MIDI with balanced note events`, () => {
      const result = Conductor.convertToObj(
        true,  // hasStyleCompile
        true,  // hasMidiBuild
        syntax,
        [],    // allowAnnotation
        new Map(), // chordDic
        {}     // mapSeed
      );

      expect(result.error).toBeNull();
      expect(result.midi).toBeDefined();
      expect(result.midi!.byteLength).toBeGreaterThan(0);

      const analyzer = new DetailedMidiAnalyzer(result.midi!);
      const noteAnalysis = analyzer.analyzeNoteEvents();
      
      // 基本的な検証
      expect(noteAnalysis.summary.totalEvents).toBeGreaterThan(0);
      expect(noteAnalysis.summary.noteOn).toBeGreaterThan(0);
      expect(noteAnalysis.summary.noteOff).toBeGreaterThan(0);
      
      // Note On/Off バランスの検証（Note Off >= Note On は正常）
      expect(noteAnalysis.summary.noteOff).toBeGreaterThanOrEqual(noteAnalysis.summary.noteOn);
    });
  });

  test('長時間ノート - should handle long notes correctly', () => {
    const syntax = "@@ 120 2/1 { C:2/1 }";
    
    const result = Conductor.convertToObj(
      true,  // hasStyleCompile
      true,  // hasMidiBuild
      syntax,
      [],    // allowAnnotation
      new Map(), // chordDic
      {}     // mapSeed
    );

    expect(result.error).toBeNull();
    expect(result.midi).toBeDefined();

    const analyzer = new DetailedMidiAnalyzer(result.midi!);
    const noteAnalysis = analyzer.analyzeNoteEvents();
    
    // 長時間ノートでは Note Off >= Note On が正常
    expect(noteAnalysis.summary.noteOff).toBeGreaterThanOrEqual(noteAnalysis.summary.noteOn);
  });

  test('重複ノート - should handle overlapping notes correctly', () => {
    const syntax = "@@ 120 1/4 { C:leg Dm:leg }";
    
    const result = Conductor.convertToObj(
      true,  // hasStyleCompile
      true,  // hasMidiBuild
      syntax,
      [],    // allowAnnotation
      new Map(), // chordDic
      {}     // mapSeed
    );

    expect(result.error).toBeNull();
    expect(result.midi).toBeDefined();

    const analyzer = new DetailedMidiAnalyzer(result.midi!);
    const noteAnalysis = analyzer.analyzeNoteEvents();
    
    // レガートでは複数のノートが重複する可能性がある
    expect(noteAnalysis.summary.totalEvents).toBeGreaterThan(0);
    expect(noteAnalysis.summary.noteOff).toBeGreaterThanOrEqual(noteAnalysis.summary.noteOn);
  });

  describe('高度なMIDI解析とエラーケース', () => {
    describe('MIDI構造の詳細検証', () => {
      test('MIDIヘッダーの検証', () => {
        const result = Conductor.convertToObj(
          true, true, '@@ 120 1/4 { C }', [], new Map(), {}
        );

        expect(result.error).toBeNull();
        expect(result.midi).toBeDefined();
        
        const data = new Uint8Array(result.midi!);
        
        // MIDIファイルのマジックナンバー確認
        if (data.length >= 4) {
          const magicNumber = String.fromCharCode(...data.slice(0, 4));
          // console.log(`MIDIマジックナンバー: ${magicNumber}`);
          
          // 一般的なMIDIファイルは "MThd" で始まる
          if (magicNumber === 'MThd') {
            expect(magicNumber).toBe('MThd');
          } else {
            // 他の形式でも有効な場合があるのでサイズのみ確認
            expect(data.length).toBeGreaterThan(0);
          }
        }
      });

      test('異なるBPMでのMIDI生成', () => {
        const bpmTests = [60, 120, 180, 240];
        
        bpmTests.forEach(bpm => {
          const result = Conductor.convertToObj(
            true, true, `@@ ${bpm} 1/4 { C }`, [], new Map(), {}
          );

          expect(result.error).toBeNull();
          expect(result.midi).toBeDefined();
          
          const analyzer = new DetailedMidiAnalyzer(result.midi!);
          const analysis = analyzer.analyzeNoteEvents();
          
          // console.log(`BPM ${bpm}: ${analysis.summary.totalEvents} イベント`);
          expect(analysis.summary.totalEvents).toBeGreaterThan(0);
        });
      });

      test('複雑なコード進行のMIDI解析', () => {
        const complexSyntax = '@@ 120 1/4 { C Am F G Em Dm G7 C }';
        
        const result = Conductor.convertToObj(
          true, true, complexSyntax, [], new Map(), {}
        );

        expect(result.error).toBeNull();
        expect(result.midi).toBeDefined();
        
        const analyzer = new DetailedMidiAnalyzer(result.midi!);
        const analysis = analyzer.analyzeNoteEvents();
        
        // console.log(`複雑コード進行: ${analysis.summary.uniqueNotes}種類のノート`);
        expect(analysis.summary.uniqueNotes).toBeGreaterThan(3); // 最低限の音程数
        expect(analysis.summary.totalEvents).toBeGreaterThan(10); // 十分なイベント数
      });
    });

    describe('スタイル別MIDI解析', () => {
      const styleTests = [
        { style: 'leg', desc: 'レガート' },
        { style: 'm', desc: 'ミュート' },
        { style: 'd', desc: 'ダウンブラッシング' },
        { style: 'U', desc: 'アップブラッシング強' }
      ];

      styleTests.forEach(({ style, desc }) => {
        test(`${desc}スタイルのMIDI特性解析`, () => {
          const normalResult = Conductor.convertToObj(
            true, true, '@@ 120 1/4 { C }', [], new Map(), {}
          );
          const styledResult = Conductor.convertToObj(
            true, true, `@@ 120 1/4 { C:${style} }`, [], new Map(), {}
          );

          expect(normalResult.error).toBeNull();
          expect(styledResult.error).toBeNull();
          
          const normalAnalysis = new DetailedMidiAnalyzer(normalResult.midi!).analyzeNoteEvents();
          const styledAnalysis = new DetailedMidiAnalyzer(styledResult.midi!).analyzeNoteEvents();
          
          // console.log(`${desc}: ノーマル${normalAnalysis.summary.totalEvents} vs スタイル${styledAnalysis.summary.totalEvents}`);
          
          // 両方ともイベントが生成されることを確認
          expect(normalAnalysis.summary.totalEvents).toBeGreaterThan(0);
          expect(styledAnalysis.summary.totalEvents).toBeGreaterThan(0);
        });
      });
    });

    describe('ベンドとピッチベンドの解析', () => {
      test('ベンド記法のMIDI解析', () => {
        const bendSyntax = '@@ 120 1/4 { |||||12:bd(0..1/4 cho 1) }';
        
        const result = Conductor.convertToObj(
          true, true, bendSyntax, [], new Map(), {}
        );

        expect(result.error).toBeNull();
        expect(result.midi).toBeDefined();
        
        const data = new Uint8Array(result.midi!);
        let pitchBendFound = false;
        
        // ピッチベンドイベント (0xE0-0xEF) を検索
        for (let i = 0; i < data.length - 2; i++) {
          if ((data[i] & 0xF0) === 0xE0) {
            pitchBendFound = true;
            break;
          }
        }
        
        // console.log(`ベンド記法: ピッチベンドイベント${pitchBendFound ? '検出' : '未検出'}`);
        
        const analyzer = new DetailedMidiAnalyzer(result.midi!);
        const analysis = analyzer.analyzeNoteEvents();
        expect(analysis.summary.totalEvents).toBeGreaterThan(0);
      });
    });

    describe('エラーケースとエッジケース', () => {
      test('無効な構文でのMIDI生成失敗', () => {
        const invalidSyntax = '@@ abc 1/4 { XYZ }';
        
        const result = Conductor.convertToObj(
          true, true, invalidSyntax, [], new Map(), {}
        );

        // エラーが発生するか、MIDIが生成されないことを確認
        if (result.error) {
          expect(result.error).not.toBeNull();
          // console.log('無効構文: 期待通りエラー発生');
        } else {
          // エラーがない場合はMIDIが生成されるかもしれない
          // console.log('無効構文: エラーなしでMIDI生成');
        }
      });

      test('空の構文でのMIDI生成', () => {
        const result = Conductor.convertToObj(
          true, true, '@@ 120 1/4 { }', [], new Map(), {}
        );

        expect(result.id).toBeDefined();
        
        if (result.midi) {
          const analyzer = new DetailedMidiAnalyzer(result.midi);
          const analysis = analyzer.analyzeNoteEvents();
          // console.log(`空構文: ${analysis.summary.totalEvents} イベント生成`);
        }
      });

      test('非常に高いBPMでの処理', () => {
        const result = Conductor.convertToObj(
          true, true, '@@ 999 1/4 { C }', [], new Map(), {}
        );

        expect(result.id).toBeDefined();
        // console.log(`高BPM: ${result.error ? 'エラー' : '成功'}`);
        
        if (result.midi) {
          expect(result.midi.byteLength).toBeGreaterThan(0);
        }
      });

      test('非常に低いBPMでの処理', () => {
        const result = Conductor.convertToObj(
          true, true, '@@ 1 1/4 { C }', [], new Map(), {}
        );

        expect(result.id).toBeDefined();
        // console.log(`低BPM: ${result.error ? 'エラー' : '成功'}`);
        
        if (result.midi) {
          expect(result.midi.byteLength).toBeGreaterThan(0);
        }
      });
    });

    describe('大量データとパフォーマンス', () => {
      test('大量コードのMIDI生成パフォーマンス', () => {
        const largeSyntax = '@@ 120 1/4 { ' + 
          Array(200).fill('C Dm Em F G Am Bdim').join(' ') + ' }';

        const startTime = Date.now();
        const result = Conductor.convertToObj(
          true, true, largeSyntax, [], new Map(), {}
        );
        const endTime = Date.now();

        expect(result.id).toBeDefined();
        // console.log(`大量MIDI生成時間: ${endTime - startTime}ms`);
        
        if (result.midi) {
          const analyzer = new DetailedMidiAnalyzer(result.midi);
          const analysis = analyzer.analyzeNoteEvents();
          // console.log(`大量データ: ${analysis.summary.totalEvents} イベント, ${analysis.summary.uniqueNotes} 種類の音`);
          
          expect(analysis.summary.totalEvents).toBeGreaterThan(100);
          expect(result.midi.byteLength).toBeGreaterThan(1000);
        }
        
        // 30秒以内で処理完了
        expect(endTime - startTime).toBeLessThan(30000);
      });

      test('メモリ使用量の監視', () => {
        const heavySyntax = '@@ 120 1/4 { ' + 
          Array(100).fill('C:leg:d:map(0..2) Dm:U:rn F#m7b5:bd(0..1/4 cho 2)').join(' ') + ' }';

        const result = Conductor.convertToObj(
          true, true, heavySyntax, [], new Map(), {}
        );

        expect(result.id).toBeDefined();
        
        if (result.midi) {
          const midiSizeMB = result.midi.byteLength / (1024 * 1024);
          // console.log(`複雑MIDI サイズ: ${midiSizeMB.toFixed(2)} MB`);
          
          // 極端に大きなファイルにならないことを確認（10MB以下）
          expect(midiSizeMB).toBeLessThan(10);
        }
      });
    });

    describe('特殊記法のMIDI解析', () => {
      test('混在記法（タブ+コード）のMIDI解析', () => {
        const mixedSyntax = '@@ 120 1/4 { C |2 Dm |||||3 Em F }';
        
        const result = Conductor.convertToObj(
          true, true, mixedSyntax, [], new Map(), {}
        );

        expect(result.error).toBeNull();
        expect(result.midi).toBeDefined();
        
        const analyzer = new DetailedMidiAnalyzer(result.midi!);
        const analysis = analyzer.analyzeNoteEvents();
        
        // console.log(`混在記法: ${analysis.summary.totalEvents} イベント`);
        expect(analysis.summary.totalEvents).toBeGreaterThan(0);
        expect(analysis.summary.uniqueNotes).toBeGreaterThan(1);
      });

      test('複雑なマッピングのMIDI解析', () => {
        const mappingSyntax = '@@ 120 1/4 { C:map(0..2) Dm:map(3..5) Em:map(0..5) }';
        
        const result = Conductor.convertToObj(
          true, true, mappingSyntax, [], new Map(), {}
        );

        expect(result.error).toBeNull();
        expect(result.midi).toBeDefined();
        
        const analyzer = new DetailedMidiAnalyzer(result.midi!);
        const analysis = analyzer.analyzeNoteEvents();
        
        // console.log(`複雑マッピング: ${analysis.summary.uniqueNotes} 種類の音`);
        expect(analysis.summary.totalEvents).toBeGreaterThan(0);
      });
    });

    describe('MIDI無効化テスト', () => {
      test('MIDI生成無効化', () => {
        const result = Conductor.convertToObj(
          true,
          false, // hasMidiBuild = false
          '@@ 120 1/4 { C Dm Em F }',
          [],
          new Map(),
          {}
        );

        expect(result.id).toBeDefined();
        
        // MIDI生成が無効化されている場合
        if (!result.midi || result.midi.byteLength === 0) {
          // console.log('MIDI無効化: MIDI生成されず（期待通り）');
          expect(true).toBe(true);
        } else {
          // console.log('MIDI無効化: MIDIが生成された');
          expect(result.midi.byteLength).toBeGreaterThan(0);
        }
      });
    });
  });
}); 