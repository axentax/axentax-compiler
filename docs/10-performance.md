# パフォーマンス最適化のヒント

## 概要

conductor APIのパフォーマンスを最適化するためのヒントとベストプラクティスを紹介します。

## パフォーマンスの基本

### 処理時間の目安

| 構文の規模 | 行数 | 処理時間 | メモリ使用量 |
|------------|------|----------|--------------|
| 小規模 | 10-50行 | 50-200ms | 数百KB |
| 中規模 | 50-200行 | 200-500ms | 数MB |
| 大規模 | 200行以上 | 500ms以上 | 数十MB |

### ボトルネックの特定

```typescript
// パフォーマンス測定
const startTime = Date.now();

const result = Conductor.convertToObj(
  hasStyleCompile,
  hasMidiBuild,
  syntax,
  allowAnnotation,
  chordDic,
  mapSeed
);

const endTime = Date.now();
console.log(`処理時間: ${endTime - startTime}ms`);
console.log(`コンパイル時間: ${result.compileMsec}ms`);
```

## 最適化テクニック

### 1. MIDI生成の最適化

#### 不要なMIDI生成を避ける
```typescript
// パフォーマンス重視の場合
const result = Conductor.convertToObj(
  true,   // スタイル解決は必要
  false,  // MIDI生成をスキップ
  syntax,
  allowAnnotation,
  chordDic,
  mapSeed
);
```

#### 段階的なMIDI生成
```typescript
// 1. まず構文チェックのみ
const checkResult = Conductor.convertToObj(
  false,  // スタイル解決をスキップ
  false,  // MIDI生成をスキップ
  syntax,
  allowAnnotation,
  chordDic,
  mapSeed
);

if (checkResult.error) {
  console.error('構文エラー:', checkResult.error.message);
  return;
}

// 2. 必要に応じてMIDI生成
const midiResult = Conductor.convertToObj(
  true,   // スタイル解決を実行
  true,   // MIDI生成を実行
  syntax,
  allowAnnotation,
  chordDic,
  mapSeed
);
```

### 2. 構文の最適化

#### 効率的な構文設計
```typescript
// 非効率な例
const inefficientSyntax = `set.song.key: C
set.style.until: 1/4

@@ {
  C:map(0..99)  // 100回の繰り返し
  Dm:map(0..99)
  Em:map(0..99)
  F:map(0..99)
}`;

// 効率的な例
const efficientSyntax = `set.song.key: C
set.style.until: 1/4

@@ {
  {
    C Dm Em F
  }:map(0..24)  // グループ化して25回の繰り返し
}`;
```

#### マッピングの最適化
```typescript
// 非効率なマッピング
const badMapping = `C:map(0..999):1/16`;  // 1000回の細かい繰り返し

// 効率的なマッピング
const goodMapping = `C:map(0..9):1/4`;     // 10回の適度な繰り返し
```

### 3. メモリ使用量の最適化

#### 大きなオブジェクトの管理
```typescript
// メモリリークを防ぐ
function processLargeSyntax(syntax: string) {
  const result = Conductor.convertToObj(/* パラメータ */);
  
  // 処理後に大きなオブジェクトをクリア
  if (result.conduct) {
    // 必要な情報のみを抽出
    const essentialData = {
      totalTicks: result.conduct.res.totalTicks,
      noteCount: result.conduct.res.mixesList[0]?.flatTOList.length || 0
    };
    
    // 大きなオブジェクトを解放
    result.conduct = null;
    result.midi = null;
    
    return essentialData;
  }
  
  return null;
}
```

#### ガベージコレクションの活用
```typescript
// 定期的なガベージコレクション
function processMultipleSyntax(syntaxList: string[]) {
  const results = [];
  
  for (let i = 0; i < syntaxList.length; i++) {
    const result = Conductor.convertToObj(/* パラメータ */);
    results.push(result);
    
    // 一定間隔でガベージコレクションを実行
    if (i % 10 === 0) {
      if (global.gc) {
        global.gc();
      }
    }
  }
  
  return results;
}
```

### 4. 並列処理の活用

#### Worker Threadsの使用
```typescript
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

// メインスレッド
if (isMainThread) {
  function processWithWorker(syntax: string): Promise<ConvertToObj> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { syntax }
      });
      
      worker.on('message', resolve);
      worker.on('error', reject);
    });
  }
  
  // 使用例
  const result = await processWithWorker(syntax);
}

// Workerスレッド
else {
  const { Conductor } = require('conductor');
  const result = Conductor.convertToObj(
    true,
    true,
    workerData.syntax,
    [
      { name: 'compose', dualIdRestrictions: [1, 2] },
      { name: '/compose', dualIdRestrictions: [1, 2] }
    ],
    new Map(),
    {}
  );
  
  parentPort?.postMessage(result);
}
```

#### バッチ処理
```typescript
// 複数のsyntaxをバッチ処理
async function processBatch(syntaxList: string[]) {
  const batchSize = 5; // 同時処理数
  const results = [];
  
  for (let i = 0; i < syntaxList.length; i += batchSize) {
    const batch = syntaxList.slice(i, i + batchSize);
    const batchPromises = batch.map(syntax => 
      Conductor.convertToObj(/* パラメータ */)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}
```

## プロファイリング

### パフォーマンス測定ツール

#### Node.jsのプロファイラー
```bash
# CPUプロファイリング
node --prof your-script.js

# メモリプロファイリング
node --inspect your-script.js
```

#### カスタムプロファイラー
```typescript
class PerformanceProfiler {
  private timers: Map<string, number> = new Map();
  private memoryUsage: Map<string, number> = new Map();
  
  startTimer(name: string) {
    this.timers.set(name, Date.now());
    this.memoryUsage.set(name, process.memoryUsage().heapUsed);
  }
  
  endTimer(name: string) {
    const startTime = this.timers.get(name);
    const startMemory = this.memoryUsage.get(name);
    
    if (startTime && startMemory) {
      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed;
      
      console.log(`${name}:`);
      console.log(`  時間: ${endTime - startTime}ms`);
      console.log(`  メモリ: ${(endMemory - startMemory) / 1024 / 1024}MB`);
      
      this.timers.delete(name);
      this.memoryUsage.delete(name);
    }
  }
}

// 使用例
const profiler = new PerformanceProfiler();

profiler.startTimer('conductor-processing');
const result = Conductor.convertToObj(/* パラメータ */);
profiler.endTimer('conductor-processing');
```

## ベンチマーク

### 標準ベンチマーク
```typescript
// 標準的なベンチマークテスト
const benchmarkSyntax = `set.song.key: C
set.style.until: 1/4

@@ {
  C Dm Em F
} >> {
  G Am Bdim C
}`;

function runBenchmark(iterations: number = 100) {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    
    Conductor.convertToObj(
      true,
      true,
      benchmarkSyntax,
      [
        { name: 'compose', dualIdRestrictions: [1, 2] },
        { name: '/compose', dualIdRestrictions: [1, 2] }
      ],
      new Map(),
      {}
    );
    
    const endTime = Date.now();
    times.push(endTime - startTime);
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  console.log(`平均時間: ${avgTime.toFixed(2)}ms`);
  console.log(`最小時間: ${minTime}ms`);
  console.log(`最大時間: ${maxTime}ms`);
}
```

## 最適化チェックリスト

### 構文レベル
- [ ] 不要なマッピングを削除
- [ ] 大きな繰り返しをグループ化
- [ ] 複雑なスタイルを簡素化
- [ ] 不要な設定を削除

### アプリケーションレベル
- [ ] MIDI生成を必要最小限に
- [ ] 段階的な処理を実装
- [ ] メモリリークを防止
- [ ] 並列処理を活用

### システムレベル
- [ ] Node.jsバージョンを最新に
- [ ] 十分なメモリを確保
- [ ] CPU使用率を監視
- [ ] ディスクI/Oを最小化

## トラブルシューティング

### パフォーマンス問題の診断

#### 1. 処理時間が長い
```typescript
// 段階的な診断
const step1 = Conductor.convertToObj(false, false, syntax, ...); // 構文チェックのみ
const step2 = Conductor.convertToObj(true, false, syntax, ...);  // スタイル解決まで
const step3 = Conductor.convertToObj(true, true, syntax, ...);   // 全処理
```

#### 2. メモリ使用量が多い
```typescript
// メモリ使用量の監視
const memBefore = process.memoryUsage();
const result = Conductor.convertToObj(/* パラメータ */);
const memAfter = process.memoryUsage();

console.log(`メモリ増加: ${(memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024}MB`);
```

#### 3. CPU使用率が高い
```typescript
// CPU使用率の監視
const startUsage = process.cpuUsage();
const result = Conductor.convertToObj(/* パラメータ */);
const endUsage = process.cpuUsage(startUsage);

console.log(`CPU使用時間: ${endUsage.user / 1000}ms (user), ${endUsage.system / 1000}ms (system)`);
```

## 推奨設定

### 本番環境
```typescript
// 本番環境での推奨設定
const productionConfig = {
  hasStyleCompile: true,    // 奏法は必要
  hasMidiBuild: true,       // MIDI生成も必要
  // その他の設定
};
```

### 開発環境
```typescript
// 開発環境での推奨設定
const developmentConfig = {
  hasStyleCompile: true,    // 開発中は奏法も確認
  hasMidiBuild: false,      // 開発中はMIDI生成をスキップ
  // その他の設定
};
```

### テスト環境
```typescript
// テスト環境での推奨設定
const testConfig = {
  hasStyleCompile: false,   // テスト中は奏法をスキップ
  hasMidiBuild: false,      // テスト中はMIDI生成をスキップ
  // その他の設定
};
``` 