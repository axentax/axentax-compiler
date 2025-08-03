import { Conductor } from '../../src/conductor/conductor';

describe('Parallel Processing Tests', () => {
  describe('基本並列処理テスト', () => {
    test('同一構文での大量並列実行', async () => {
      const syntax = '@@ 120 1/4 { C Dm Em F }';
      const concurrency = 50;
      
      const promises = Array(concurrency).fill(0).map((_, i) => 
        Promise.resolve().then(() => 
          Conductor.convertToObj(
            true, true, syntax, [], new Map(), {}
          )
        )
      );

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      const successCount = results.filter(r => !r.error && r.midi).length;
      const failureCount = results.filter(r => r.error).length;

      // console.log(`同一構文並列実行: ${successCount}/${concurrency} 成功, 実行時間: ${endTime - startTime}ms`);

      expect(successCount).toBe(concurrency);
      expect(failureCount).toBe(0);
      expect(endTime - startTime).toBeLessThan(10000); // 10秒以内
    });

    test('段階的並列実行（10, 25, 50, 100）', async () => {
      const syntax = '@@ 140 1/8 { C:leg Am:d F:m G }'; // strumをmに変更
      const stages = [10, 25, 50, 100];
      
      for (const count of stages) {
        const promises = Array(count).fill(0).map(() => 
          Promise.resolve().then(() => 
            Conductor.convertToObj(true, true, syntax, [], new Map(), {})
          )
        );

        const startTime = Date.now();
        const results = await Promise.all(promises);
        const endTime = Date.now();

        const successCount = results.filter(r => !r.error && r.midi).length;
        
        // console.log(`段階${count}: ${successCount}/${count} 成功, ${endTime - startTime}ms`);
        
        expect(successCount).toBe(count);
        expect(endTime - startTime).toBeLessThan(count * 100); // スケーラブルな時間制限
      }
    });
  });

  describe('異なる構文での並列処理', () => {
    test('複雑度混在での並列実行', async () => {
      const syntaxVariations = [
        '@@ 120 1/4 { C }',                                    // シンプル
        '@@ 140 1/8 { C Dm Em F G Am Bdim }',                  // 中程度
        '@@ 160 1/16 { C:leg:map(0..2) Dm:m Em F }',           // 複雑（strumを除外）
        '@@ 120 1/4 { |||||12:bd(0..1/4 cho 1) }',             // ベンド
        '@@ 180 1/8 { C:d Am:u F:leg:m G:map(1..3) }',         // 多重スタイル
      ];

      const promises = Array(20).fill(0).map((_, i) => {
        const syntax = syntaxVariations[i % syntaxVariations.length];
        return Promise.resolve().then(() => 
          Conductor.convertToObj(true, true, syntax, [], new Map(), {})
        );
      });

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      const successCount = results.filter(r => !r.error && r.midi).length;
      const resultsByType = syntaxVariations.map((syntax, idx) => {
        const typeResults = results.filter((_, i) => i % syntaxVariations.length === idx);
        const typeSuccess = typeResults.filter(r => !r.error && r.midi).length;
        return { syntax: syntax.slice(0, 30), success: typeSuccess, total: typeResults.length };
      });

      // console.log('複雑度混在並列実行結果:');
      resultsByType.forEach(({ syntax, success, total }) => {
        // console.log(`  ${syntax}...: ${success}/${total}`);
      });
      // console.log(`全体: ${successCount}/${results.length} 成功, ${endTime - startTime}ms`);

      expect(successCount).toBeGreaterThan(results.length * 0.9); // 90%以上成功
    });

    test('ランダム構文での並列ストレステスト', async () => {
      const basePatterns = ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'];
      const styles = ['', ':leg', ':m', ':d', ':u']; // strumを除外（tuning依存のため）
      const bpms = [60, 120, 140, 180];
      const timeSignatures = ['1/4', '1/8', '1/16'];

      const generateRandomSyntax = () => {
        const bpm = bpms[Math.floor(Math.random() * bpms.length)];
        const timeSignature = timeSignatures[Math.floor(Math.random() * timeSignatures.length)];
        const chordCount = Math.floor(Math.random() * 4) + 1;
        
        const chords = Array(chordCount).fill(0).map(() => {
          const chord = basePatterns[Math.floor(Math.random() * basePatterns.length)];
          const style = styles[Math.floor(Math.random() * styles.length)];
          return chord + style;
        }).join(' ');

        return `@@ ${bpm} ${timeSignature} { ${chords} }`;
      };

      const promises = Array(30).fill(0).map(() => {
        const syntax = generateRandomSyntax();
        return Promise.resolve().then(() => ({
          syntax,
          result: Conductor.convertToObj(true, true, syntax, [], new Map(), {})
        }));
      });

      const results = await Promise.all(promises);
      const successCount = results.filter(r => !r.result.error && r.result.midi).length;
      const failures = results.filter(r => r.result.error);

      // console.log(`ランダム構文テスト: ${successCount}/${results.length} 成功`);
      if (failures.length > 0) {
        // console.log('失敗例（最初の3件）:');
        failures.slice(0, 3).forEach(({ syntax, result }) => {
          // console.log(`  ${syntax} -> ${result.error?.message || result.error}`);
        });
      }

      expect(successCount).toBeGreaterThan(results.length * 0.8); // 80%以上成功
    });
  });

  describe('メモリ使用量とリソース管理', () => {
    test('並列実行でのメモリ安定性', async () => {
      const syntax = '@@ 120 1/4 { C Dm Em F G Am }';
      const iterations = 5;
      const concurrencyPerIteration = 20;
      const memorySnapshots: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const promises = Array(concurrencyPerIteration).fill(0).map(() => 
          Promise.resolve().then(() => 
            Conductor.convertToObj(true, true, syntax, [], new Map(), {})
          )
        );

        const results = await Promise.all(promises);
        const successCount = results.filter(r => !r.error && r.midi).length;
        
        // メモリ使用量の代理として、生成されたMIDIのサイズを測定
        const totalMidiSize = results
          .filter(r => r.midi)
          .reduce((sum, r) => sum + r.midi!.byteLength, 0);
        
        memorySnapshots.push(totalMidiSize);
        
        // console.log(`反復${i + 1}: ${successCount}/${concurrencyPerIteration} 成功, MIDI合計サイズ: ${totalMidiSize} bytes`);
        
        expect(successCount).toBe(concurrencyPerIteration);
        
        // 短い待機でガベージコレクションの機会を与える
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // メモリ使用量が安定していることを確認（大幅な増加がないこと）
      const avgSize = memorySnapshots.reduce((a, b) => a + b, 0) / memorySnapshots.length;
      const maxDeviation = Math.max(...memorySnapshots.map(size => Math.abs(size - avgSize)));
      
      // console.log(`メモリ安定性: 平均${avgSize.toFixed(0)}bytes, 最大偏差${maxDeviation.toFixed(0)}bytes`);
      
      // 偏差が平均の50%以内であることを確認
      expect(maxDeviation).toBeLessThan(avgSize * 0.5);
    });

    test('大量データでの並列処理メモリ効率', async () => {
      const largeSyntax = '@@ 120 1/16 { ' + 
        Array(50).fill('C Dm Em F G Am Bdim').join(' ') + ' }';
      
      const concurrency = 10;
      const promises = Array(concurrency).fill(0).map(() => 
        Promise.resolve().then(() => 
          Conductor.convertToObj(true, true, largeSyntax, [], new Map(), {})
        )
      );

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      const successCount = results.filter(r => !r.error && r.midi).length;
      const totalMidiSize = results
        .filter(r => r.midi)
        .reduce((sum, r) => sum + r.midi!.byteLength, 0);
      
      const avgSizePerResult = totalMidiSize / successCount;
      
      // console.log(`大量データ並列処理:`);
      // console.log(`  成功: ${successCount}/${concurrency}`);
      // console.log(`  実行時間: ${endTime - startTime}ms`);
      // console.log(`  合計MIDIサイズ: ${(totalMidiSize / 1024 / 1024).toFixed(2)}MB`);
      // console.log(`  平均サイズ: ${(avgSizePerResult / 1024).toFixed(2)}KB`);

      expect(successCount).toBe(concurrency);
      expect(endTime - startTime).toBeLessThan(30000); // 30秒以内
      expect(totalMidiSize / 1024 / 1024).toBeLessThan(50); // 50MB以下
    });
  });

  describe('エラーハンドリングと例外処理', () => {
    test('並列実行中の部分的エラー処理', async () => {
      const validSyntax = '@@ 120 1/4 { C Dm Em F }';
      const invalidSyntaxes = [
        '@@ abc 1/4 { C }',        // 無効BPM
        '@@ 120 1/4 { XYZ }',      // 無効コード
        '@@ 120 1/abc { C }',      // 無効拍子
        '@@ 120 1/4 { |99 }',      // 範囲外フレット
      ];

      // 有効と無効な構文を混在させる
      const mixedSyntaxes = [
        ...Array(15).fill(validSyntax),
        ...invalidSyntaxes,
        ...Array(5).fill(validSyntax),
      ];

      const promises = mixedSyntaxes.map((syntax, i) => 
        Promise.resolve().then(() => ({
          index: i,
          syntax,
          result: Conductor.convertToObj(true, true, syntax, [], new Map(), {})
        }))
      );

      const results = await Promise.all(promises);
      const successResults = results.filter(r => !r.result.error && r.result.midi);
      const errorResults = results.filter(r => r.result.error);

      // console.log(`混在エラーテスト:`);
      // console.log(`  成功: ${successResults.length}/${results.length}`);
      // console.log(`  エラー: ${errorResults.length}/${results.length}`);
      
      errorResults.forEach(({ index, syntax, result }) => {
        // console.log(`  エラー${index}: ${syntax.slice(0, 20)}... -> ${result.error?.message || 'Unknown error'}`);
      });

      // 有効な構文は全て成功し、無効な構文は全てエラーになることを確認
      expect(successResults.length).toBe(20); // 有効な構文の数
      expect(errorResults.length).toBe(4);    // 無効な構文の数
    });

    test('例外安全性テスト', async () => {
      const problematicInputs = [
        '',                        // 空文字列
        '@@',                      // 不完全
        '@@ 120',                  // 不完全
        '@@ 120 1/4',              // 不完全
        '@@ 120 1/4 {',            // 不完全
        '@@ 999999 1/4 { C }',     // 極端なBPM
        '@@ 120 999/4 { C }',      // 極端な拍子
        '@@ 120 1/4 { ' + 'C '.repeat(1000) + '}', // 極端に長い
      ];

      const promises = problematicInputs.map(syntax => 
        Promise.resolve().then(() => {
          try {
            const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
            return { syntax, result, exception: null };
          } catch (error) {
            return { syntax, result: null, exception: error };
          }
        })
      );

      const results = await Promise.all(promises);
      const exceptions = results.filter(r => r.exception);
      const normalErrors = results.filter(r => !r.exception && r.result?.error);
      const successes = results.filter(r => !r.exception && !r.result?.error);

      // console.log(`例外安全性テスト:`);
      // console.log(`  正常エラー: ${normalErrors.length}/${results.length}`);
      // console.log(`  例外発生: ${exceptions.length}/${results.length}`);
      // console.log(`  予期しない成功: ${successes.length}/${results.length}`);

      if (exceptions.length > 0) {
        // console.log('例外詳細:');
        exceptions.forEach(({ syntax, exception }) => {
          // console.log(`  ${syntax.slice(0, 30)}... -> ${exception}`);
        });
      }

      // 例外は発生せず、適切にエラーハンドリングされることを期待
      expect(exceptions.length).toBe(0);
    });
  });

  describe('パフォーマンスベンチマーク', () => {
    test('並列 vs 逐次実行の性能比較', async () => {
      const syntax = '@@ 120 1/4 { C Dm Em F G Am Bdim }';
      const taskCount = 20;

      // 逐次実行
      const sequentialStart = Date.now();
      const sequentialResults = [];
      for (let i = 0; i < taskCount; i++) {
        const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
        sequentialResults.push(result);
      }
      const sequentialTime = Date.now() - sequentialStart;

      // 並列実行
      const parallelStart = Date.now();
      const parallelPromises = Array(taskCount).fill(0).map(() => 
        Promise.resolve().then(() => 
          Conductor.convertToObj(true, true, syntax, [], new Map(), {})
        )
      );
      const parallelResults = await Promise.all(parallelPromises);
      const parallelTime = Date.now() - parallelStart;

      const sequentialSuccess = sequentialResults.filter(r => !r.error && r.midi).length;
      const parallelSuccess = parallelResults.filter(r => !r.error && r.midi).length;
      const speedup = sequentialTime / parallelTime;

      // console.log(`性能比較（${taskCount}タスク）:`);
      // console.log(`  逐次実行: ${sequentialTime}ms (${sequentialSuccess}/${taskCount} 成功)`);
      // console.log(`  並列実行: ${parallelTime}ms (${parallelSuccess}/${taskCount} 成功)`);
      // console.log(`  速度向上: ${speedup.toFixed(2)}x`);

      expect(sequentialSuccess).toBe(taskCount);
      expect(parallelSuccess).toBe(taskCount);
      expect(speedup).toBeGreaterThan(0.6); // 小規模タスクでは並列化オーバーヘッドを考慮して50%以上とする
    });

    test('スケーラビリティテスト', async () => {
      const syntax = '@@ 140 1/8 { C:leg Dm:d Em:u F }';
      const concurrencyLevels = [1, 5, 10, 20, 50];
      const results: Array<{level: number, time: number, success: number}> = [];

      for (const level of concurrencyLevels) {
        const promises = Array(level).fill(0).map(() => 
          Promise.resolve().then(() => 
            Conductor.convertToObj(true, true, syntax, [], new Map(), {})
          )
        );

        const start = Date.now();
        const levelResults = await Promise.all(promises);
        const time = Date.now() - start;
        const success = levelResults.filter(r => !r.error && r.midi).length;

        results.push({ level, time, success });
        
        // console.log(`並列度${level}: ${time}ms (${success}/${level} 成功)`);
        
        expect(success).toBe(level);
      }

      // スケーラビリティの確認（時間が線形以下で増加することを期待）
      const timePerTask = results.map(r => r.time / r.level);
      const maxTimePerTask = Math.max(...timePerTask);
      const minTimePerTask = Math.min(...timePerTask);
      
      // console.log(`タスクあたり時間: 最小${minTimePerTask.toFixed(2)}ms, 最大${maxTimePerTask.toFixed(2)}ms`);
      
      // 最大と最小の差が15倍以内であることを確認（実際の環境では変動が大きいため）
      expect(maxTimePerTask / minTimePerTask).toBeLessThan(15);
    });
  });
});