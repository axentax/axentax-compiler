# 技術スタック

## 言語・フレームワーク
- **TypeScript** (5.5) - メイン言語
- **Node.js** - ランタイム
- **Express** - サーバーフレームワーク

## 主要依存関係
- `@tonejs/midi` (2.0.28) - MIDI生成
- `@tonaljs/chord` (5.0.0) - コード理論
- `decimal.js` (10.4.3) - 精密数値計算
- `fs-extra` (11.1.1) - ファイル操作

## 開発ツール
- **Jest** (30.0.2) - テストフレームワーク
- **ESLint** (7.8.1) - リンター
- **ts-node-dev** - 開発サーバー
- **Vite** - ブラウザ向けビルド（vite-compilerサブプロジェクト）

## ビルドシステム
- TypeScript コンパイラ (CommonJS)
- Vite (ESモジュール + UMD) - ブラウザ向け
- デュアル出力: Node.js用とブラウザ用