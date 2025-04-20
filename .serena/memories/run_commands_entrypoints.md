# 実行コマンド・エントリーポイント

## メインエントリーポイント

### 開発サーバー
```bash
npm run dev
# → src/index.ts をホットリロードで実行
# → http://localhost:3000 でExpressサーバー起動
```

### プロダクション実行
```bash
npm run build  # ビルド
node dist/index.js  # 実行
```

## ライブラリ使用法

### Node.js環境
```typescript
import { Conductor } from 'axentax-compiler';

const compiled = Conductor.convertToObj(
  true,           // スタイル適用
  true,           // MIDI作成
  '@@ { C D E }', // Axentaxシンタックス
  [],             // 許可アノテーション
  new Map(),      // データキャッシュ
  {}              // マップオブジェクト
);

// MIDIデータ取得
const midi: ArrayBuffer = compiled.midi;
// コンパイル結果
const result = compiled.response;
// エラー情報
const error = compiled.error;
```

### ブラウザ環境
```bash
# ブラウザ向けビルド
npm run vite-build
# → vite-compiler/dist/conductor.js
# → vite-compiler/dist/conductor.umd.cjs
```

## テスト実行
```bash
# 全テスト
npm test

# 特定テスト
npm test tests/basic/syntax.test.ts

# カバレッジ
npm run test:coverage
```

## デモアクセス
```bash
npm run dev
# ブラウザで http://localhost:3000/2 にアクセス
```