# Integration Test Tools

このディレクトリには、統合テストの生成と管理に使用するスクリプトが含まれています。

## スクリプト一覧

### 1. generate-integration-tests.js

**目的**: syntax-all.tsファイルを5個のregionずつグループ化してリクエストファイルを生成

**使用方法**:
```bash
node scripts/integration-test-tools/generate-integration-tests.js
```

**機能**:
- `tests/integration/x-original-data/syntax-all.ts`を読み取り
- 313個のregionを検出
- 5個ずつグループ化（最後のグループは3個）
- 各グループに指定された設定を適用
- 63個のリクエストファイル（.txt）を生成

**出力先**: `tests/integration/request/`

**生成されるファイル**:
- syntax-group-01.txt ～ syntax-group-63.txt

### 2. generate-expected-results.js

**目的**: 期待値ファイルのプレースホルダーを生成

**使用方法**:
```bash
node scripts/integration-test-tools/generate-expected-results.js
```

**機能**:
- リクエストファイル一覧を取得
- 各リクエストファイルに対応するプレースホルダー期待値ファイルを生成
- 実際の期待値はテスト実行時に自動生成される

**出力先**: `tests/integration/expect/`

**生成されるファイル**:
- syntax-group-01.json ～ syntax-group-63.json

## ワークフロー

### 初回セットアップ

1. **リクエストファイル生成**:
   ```bash
   node scripts/integration-test-tools/generate-integration-tests.js
   ```

2. **期待値プレースホルダー生成**:
   ```bash
   node scripts/integration-test-tools/generate-expected-results.js
   ```

3. **統合テスト実行**（期待値を生成）:
   ```bash
   npm test tests/integration-syntax-all.test.ts
   ```

### 再生成

syntax-all.tsが更新された場合:

1. 既存ファイルを削除:
   ```bash
   rm -rf tests/integration/request/*
   rm -rf tests/integration/expect/*
   ```

2. スクリプトを再実行:
   ```bash
   node scripts/integration-test-tools/generate-integration-tests.js
   node scripts/integration-test-tools/generate-expected-results.js
   npm test tests/integration-syntax-all.test.ts
   ```

### 特定の期待値を再生成

特定のグループの期待値を更新したい場合:

1. 対応するJSONファイルを削除:
   ```bash
   rm tests/integration/expect/syntax-group-01.json
   ```

2. 該当するテストを実行:
   ```bash
   npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group 01"
   ```

## 設定情報

すべてのリクエストファイルには以下の設定が適用されます:

```
set.click.inst: 42
set.style.until: 1/4
set.dual.pan: true
set.dual.panning: [0.5, 0, 1]
set.style.scale: E minor
set.song.key: E
```

## 技術的な詳細

### regionの検出方法

- 行の先頭が `@@` で始まる行をregionの開始として検出
- 次のregionの開始またはファイル終端までを1つのregionとして扱う

### 期待値の処理

- `styles`キーは循環参照を含むため除外される
- JSONシリアライゼーション時に循環参照を安全に処理
- エラーケースと成功ケースの両方に対応

### ファイル命名規則

- リクエストファイル: `syntax-group-XX.txt` (XXは01-63の連番)
- 期待値ファイル: `syntax-group-XX.json` (XXは01-63の連番)

## トラブルシューティング

### よくある問題

1. **パスエラー**: スクリプトはプロジェクトルートから相対パスで動作します
2. **権限エラー**: ディレクトリの書き込み権限を確認してください
3. **syntax-all.ts不存在**: `tests/integration/x-original-data/syntax-all.ts`が存在することを確認してください

### デバッグ

スクリプトの動作を確認したい場合は、コンソール出力を確認してください:

```bash
# リクエストファイル生成時の出力例
Found 313 regions
Created 63 groups
Created: syntax-group-01.txt (5 regions)
...
Generation complete!

# 期待値プレースホルダー生成時の出力例  
Found 63 request files
Created placeholder: syntax-group-01.json
...
Placeholder generation complete!
```