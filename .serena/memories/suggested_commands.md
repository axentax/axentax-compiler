# 推奨コマンド

## 開発コマンド
```bash
# 開発サーバー起動（ホットリロード）
npm run dev

# Expressサーバー起動
node dist/index.js
```

## テストコマンド
```bash
# 全テスト実行
npm test

# テスト監視モード
npm run test:watch

# カバレッジ付きテスト実行
npm run test:coverage
```

## ビルドコマンド
```bash
# フルビルド（Node.js + ブラウザ用）
npm run build

# クリーンアップ
npm run rm

# Viteビルドのみ
npm run vite-build
```

## 品質チェック
```bash
# ESLint実行
npm run lint

# TypeScriptコンパイルチェック
npx tsc --noEmit
```

## システムコマンド (macOS)
```bash
# ファイル一覧
ls -la

# ファイル検索
find . -name "*.ts" -type f

# パターン検索
grep -r "pattern" src/

# Git操作
git status
git add .
git commit -m "message"
```