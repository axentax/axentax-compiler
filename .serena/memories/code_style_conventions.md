# コードスタイル・規約

## TypeScript設定
- **ターゲット**: ES2020
- **モジュール**: CommonJS (Node.js用)
- **strict**: true (厳密な型チェック)
- **declaration**: true (型定義生成)

## ESLint設定
- ESLint推奨ルール
- TypeScript推奨ルール
- 主要カスタムルール:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-unused-vars`: warn (アンダースコア変数は無視)

## ファイル命名規則
- **インターフェース**: `interface/` ディレクトリ内
- **モジュール**: `mod-` プレフィックス
- **ユーティリティ**: `x-` プレフィックス
- **テスト**: `.test.ts` サフィックス

## ディレクトリ構造
- 機能別ディレクトリ分割
- `interface/` で型定義を分離
- `utils/` でユーティリティを集約

## コメント規約
- JSDoc形式でインターフェース・クラスを文書化
- 日本語コメント可
- Istanbul ignore directives使用可

## インポート規約
- 相対パス使用
- 外部ライブラリを先に記述
- アルファベット順整理