# Integration Tests: Syntax All Regions

このディレクトリには、`syntax-all.ts`の全313個のregionを5個ずつグループ化した統合テストが含まれています。これらのテストは、Conductorの動作の正確性を包括的に検証し、リグレッションを防ぐために設計されています。

## テストの概要

- **総regionグループ数**: 63個（5個ずつ、最後のグループは3個）
- **総region数**: 313個
- **各グループに適用される設定**:
  ```
  set.click.inst: 42
  set.style.until: 1/4
  set.dual.pan: true
  set.dual.panning: [0.5, 0, 1]
  set.style.scale: E minor
  set.song.key: E
  ```

## ディレクトリ構造

```
tests/integration/
├── README.md                 # このファイル
├── request/                  # リクエストファイル (63個)
│   ├── syntax-group-01.txt
│   ├── syntax-group-02.txt
│   └── ... (syntax-group-63.txt まで)
├── expect/                   # 期待値ファイル (63個)
│   ├── syntax-group-01.json
│   ├── syntax-group-02.json
│   └── ... (syntax-group-63.json まで)
└── x-original-data/
    └── syntax-all.ts         # 元のデータファイル
```

## テストの実行方法

### 全てのテストを実行
```bash
npm test tests/integration-syntax-all.test.ts
```

### 特定のグループのみ実行
```bash
# Group 01のみ
npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group 01"

# Group 01-05を実行
npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group 0[1-5]"

# Group 10-19を実行
npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group 1[0-9]"
```

## テストが検証する内容

各テストは以下を検証します：

1. **基本的な動作検証**：
   - ConvertToObjが正常に動作すること
   - 結果オブジェクトが定義されていること
   - IDが設定されていること

2. **エラー処理検証**：
   - エラーがある場合とない場合の適切な処理
   - エラーメッセージの整合性

3. **期待値の比較**：
   - `result.response.mixesList.flatTOList`の内容
   - `styles`キーは除外される
   - 循環参照は適切に処理される

## 期待値ファイルの形式

```json
{
  "hasError": false,
  "error": null,
  "expectation": {
    "mixesList": [
      {
        "flatTOList": [
          {
            "noteStr": "C",
            "syntaxLocation": { ... },
            "tabObjId": 0,
            "regionIndex": 0,
            "regionNoteIndex": 0,
            "note": "C",
            "tab": [null, 1, 0, 2, 3, null],
            "velocity": [null, null, null, null, null, null],
            // ... (stylesは除外)
          }
        ]
      }
    ]
  }
}
```

## 期待値の更新

期待値ファイルがプレースホルダー（`_note`キーを含む）の場合、テスト実行時に自動的に実際の結果で更新されます。

手動で期待値を更新したい場合は、対応するJSONファイルを削除してからテストを実行してください。

## ファイル生成・管理ツール

統合テストの生成と管理には専用のスクリプトを使用します：

### 生成スクリプト
- `scripts/integration-test-tools/generate-integration-tests.js` - リクエストファイルの生成
- `scripts/integration-test-tools/generate-expected-results.js` - 期待値ファイルのプレースホルダー生成

### 使用方法
```bash
# 初回セットアップ
node scripts/integration-test-tools/generate-integration-tests.js
node scripts/integration-test-tools/generate-expected-results.js
npm test tests/integration-syntax-all.test.ts

# syntax-all.ts更新後の再生成
rm -rf tests/integration/request/* tests/integration/expect/*
node scripts/integration-test-tools/generate-integration-tests.js
node scripts/integration-test-tools/generate-expected-results.js
npm test tests/integration-syntax-all.test.ts
```

詳細は `scripts/integration-test-tools/README.md` を参照してください。

## パフォーマンス情報

- **全63テストの実行時間**: 約10-12秒
- **個別テスト実行時間**: 10ms-1000ms (region数とコンパイル複雑さに依存)
- **最も時間のかかるテスト**: Group 25, Group 58 (複雑なstyleを含む)
- **最も軽いテスト**: Group 33, Group 52 (シンプルなsyntax)

### パフォーマンス最適化のヒント

特定のグループのみテストしたい場合：
```bash
# 軽いテストのみ実行
npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group (33|52|24)"

# 重いテストを除外
npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group (?!25|58)"
```

## トラブルシューティング

### よくある問題と解決方法

1. **期待値の不一致**
   ```bash
   # 特定のグループの期待値を再生成
   rm tests/integration/expect/syntax-group-XX.json
   npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group XX"
   ```

2. **全ての期待値をリセット**
   ```bash
   rm tests/integration/expect/*.json
   node scripts/integration-test-tools/generate-expected-results.js
   npm test tests/integration-syntax-all.test.ts
   ```

3. **テストの断続的失敗**
   - Node.jsのバージョンを確認（推奨: v18以上）
   - 依存関係を再インストール: `npm clean-install`

### デバッグ方法

個別のテストをデバッグする場合：
```bash
# 特定のグループを詳細ログ付きで実行
npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group 01" --verbose

# カバレッジ情報付きで実行
npm run test:coverage tests/integration-syntax-all.test.ts
```

## 継続的インテグレーション

### CI/CDでの使用

```yaml
# GitHub Actions example
- name: Run Integration Tests
  run: |
    npm test tests/integration-syntax-all.test.ts
    
# より高速な実行（軽いテストのみ）
- name: Run Quick Integration Tests  
  run: |
    npm test tests/integration-syntax-all.test.ts -- --testNamePattern="Group (0[1-9]|1[0-2])"
```

### 品質ゲート

以下の基準を満たすことを推奨：
- 全63テストのパス率: 100%
- 実行時間: 15秒以内
- メモリ使用量: 512MB以内

## テストケースの分類

### エラーケース含有グループ
- Group 01: Unknown annotation error
- Group 07-10: Various syntax errors
- Group 15-20: Complex validation errors

### 正常ケース
- Group 03, 04: Basic chord progressions
- Group 33, 52: Simple syntax patterns
- Group 40-45: Standard style applications

### 重い処理ケース
- Group 25: Complex style mapping
- Group 58: Advanced bend operations
- Group 22-23: Large region processing

## 注意事項とベストプラクティス

### 重要な制約
- **stylesキー除外**: 循環参照を含むため、期待値から除外されています
- **エラーケース**: 意図的に含まれており、正常な動作です
- **設定統一**: 全テストで同一設定が適用されることを前提としています

### 開発時の推奨事項
1. **局所的テスト**: 変更範囲に関連するグループのみ実行
2. **段階的実行**: まず軽いテストで基本動作を確認
3. **定期的な全実行**: リリース前には必ず全63テストを実行

### メンテナンス
- 月次: 実行時間とメモリ使用量の監視
- 四半期: syntax-all.tsの内容レビューと更新
- 年次: テスト戦略とグループ分けの見直し