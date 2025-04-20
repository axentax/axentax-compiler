# タスク完了チェックリスト

## コード変更後の必須チェック

### 1. 静的解析
```bash
# TypeScript型チェック
npx tsc --noEmit

# ESLintチェック
npm run lint
```

### 2. テスト実行
```bash
# 基本テスト
npm test

# カバレッジチェック（推奨）
npm run test:coverage
```

### 3. ビルド確認
```bash
# フルビルド確認
npm run build
```

## リリース前チェック

### 1. 統合テスト
```bash
# 統合テスト実行
npm test tests/integration-syntax-all.test.ts
```

### 2. 手動テスト
- Expressサーバー起動確認
- MIDI生成確認
- ブラウザビルド確認

### 3. バージョン管理
- package.json バージョン更新
- CHANGELOG.md 更新（ある場合）

## 注意事項
- テストが失敗した場合は修正が必須
- ESLintエラーは解決が必須
- TypeScriptエラーは解決が必須
- ビルドエラーが発生した場合は原因調査が必要