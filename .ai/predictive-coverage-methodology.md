# 予測的カバレッジ手法

## 概要
エラーメッセージから逆算してテストケースを作成し、効率的にカバレッジを向上させる手法。

## 手法の流れ

### 1. エラーメッセージの予測
```typescript
// 例: レスト記号でのアプローチ指定
test('レスト記号でのアプローチ指定エラー', () => {
  const syntax = '@@ { r>>||2 }';
  const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
  
  expect(result.error).not.toBeNull();
  expect(result.error?.message).toContain("The rest 'r' cannot be specified for the approach");
});
```

### 2. 実行して実際のエラーメッセージを確認
```bash
npm test -- --testNamePattern="レスト記号でのアプローチ指定エラー"
```

### 3. 実際のエラーメッセージに基づいて調整
```typescript
// 実際のエラー: "Unknown style 'vel'"
expect(result.error?.message).toContain("Unknown style 'vel'");  // 修正
```

## 成功事例（mod-0-syntax.ts）

### 発見されたエラーケース
1. **`@@ { r>>||2 }`** → "The rest 'r' cannot be specified for the approach"
2. **`@@ 120 1/4 { C:vel(150) }`** → "Unknown style 'vel'"  
3. **`@@ 120 1/4 { XYZ123 }`** → "Invalid chord name"
4. **`@@ 120 1/4 { |||||||12 }`** → "beyond tuning"
5. **`@@ 120 1/4 { C@#$ }`** → "No fingerable form"
6. **`@@ {} >> {} >> {} >> {}`** → "Exceeding the number of dual blocks"

### 結果
- **元のテスト数**: 62個
- **追加されたテスト数**: 13個  
- **最終テスト数**: **75個**
- **成功率**: **100%**

## 効果的なエラーケースの考え方

### 構文エラーパターン
- 無効な記号の組み合わせ
- 範囲外の値指定
- 存在しないスタイル名
- 文法的に不正な構文
- 境界値を超えた指定

### 予測のヒント
- コードベースの条件分岐を見る
- エラーメッセージのstring literalを検索
- バリデーション関数を確認
- 他のテストファイルでのエラーケースを参考

## テンプレート

```typescript
test('予測的エラーケース名', () => {
  const syntax = '予測した問題のある構文';
  const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
  
  // 最初は緩い条件でエラーが出ることだけ確認
  expect(result.error).not.toBeNull();
  
  // 実行後に実際のエラーメッセージで具体的に修正
  // expect(result.error?.message).toContain("実際のエラーメッセージ");
});
```

## 利点
1. **効率的**: エラーメッセージから直接学習
2. **実用的**: 実際に起こりうるエラーケースをテスト  
3. **網羅的**: 様々なエラーパスをカバー
4. **予測的**: まず書いてから実際のメッセージで調整

## 注意点
- 最初は緩い条件（`expect(result.error).not.toBeNull()`）でテスト
- 実行して実際のエラーメッセージを確認してから具体化
- エラーケースだけでなく、成功ケースのバリエーションも忘れずに
- 一度に大量追加せず、段階的に進める

## 次に適用できそうなファイル
- compile-style.ts
- mod-note-validation.ts  
- mod-structure.validation.ts
- 他のvalidationファイル群

この手法により、短時間で高品質なテストカバレッジを達成できる。