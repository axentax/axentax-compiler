# マイグレーションガイド

## 概要

conductor APIのバージョンアップ時の移行ガイドです。新しいバージョンへの移行方法と変更点を説明します。

## バージョン履歴

### v1.0.0 → v1.1.0

#### 新機能
- デュアルトラック機能の追加
- パンニング機能の追加
- 新しいスタイル（アプローチ、ミュート）の追加

#### 破壊的変更
- `TabObj`インターフェースに`activeBows`プロパティが追加
- `Settings`インターフェースに`dual`プロパティが追加

#### 移行手順
```typescript
// 旧バージョン
interface TabObj {
  tabObjId: string;
  tab: number[];
  velocity: number[];
  duration: number[];
  startTick: number;
  endTick: number;
  styles: StyleInfo | null;
  isRest: boolean;
}

// 新バージョン
interface TabObj {
  tabObjId: string;
  tab: number[];
  velocity: number[];
  duration: number[];
  startTick: number;
  endTick: number;
  styles: StyleInfo | null;
  isRest: boolean;
  activeBows: number[];  // 追加
}
```

### v1.1.0 → v1.2.0

#### 新機能
- カスタムコード辞書機能の強化
- マッピング機能の拡張
- パフォーマンス改善

#### 非推奨機能
- `oldStyle`パラメータが非推奨になりました
- 代わりに`newStyle`パラメータを使用してください

#### 移行手順
```typescript
// 非推奨
const syntax = `set.oldStyle: true`;

// 推奨
const syntax = `set.newStyle: true`;
```

## 一般的な移行手順

### 1. 依存関係の更新

```bash
# package.jsonの更新
npm update conductor

# または特定バージョンへの更新
npm install conductor@latest
```

### 2. 型定義の確認

```typescript
// 新しい型定義をインポート
import { 
  ConvertToObj, 
  Conduct, 
  TabObj,
  // 新しい型があれば追加
} from 'conductor';
```

### 3. コードの更新

#### 破壊的変更への対応
```typescript
// 旧バージョン
const result = Conductor.convertToObj(
  hasStyleCompile,
  hasMidiBuild,
  syntax,
  allowAnnotation,
  chordDic,
  mapSeed
);

// 新バージョン（パラメータ順序が変更された場合）
const result = Conductor.convertToObj(
  hasStyleCompile,
  hasMidiBuild,
  syntax,
  allowAnnotation,
  chordDic,
  mapSeed,
  // 新しいパラメータがあれば追加
);
```

#### 非推奨機能の置き換え
```typescript
// 非推奨の構文
const oldSyntax = `set.oldFeature: value`;

// 新しい構文
const newSyntax = `set.newFeature: value`;
```

### 4. テストの実行

```typescript
// 既存のテストケースを実行
npm test

// 新しい機能のテストを追加
describe('New Feature Tests', () => {
  it('should work with new feature', () => {
    const result = Conductor.convertToObj(/* パラメータ */);
    expect(result.conduct).toBeDefined();
    // 新しい機能のテスト
  });
});
```

## 特定の移行シナリオ

### デュアルトラック機能の移行

#### 旧バージョン
```typescript
const syntax = `set.song.key: C
set.style.until: 1/4

@@ {
  C Dm Em F
}`;
```

#### 新バージョン
```typescript
const syntax = `set.song.key: C
set.style.until: 1/4
set.dual.pan: true
set.dual.panning: [0.3, 0.7, 1.0]

@@ {
  C:dual(1)
  Dm:dual(2)
  Em:dual(1)
  F:dual(2)
}`;
```

### カスタムコード辞書の移行

#### 旧バージョン
```typescript
const chordDic = new Map([
  ['CustomChord', {
    name: 'CustomChord',
    strings: [0, 2, 2, 1, 0, 0]
  }]
]);
```

#### 新バージョン
```typescript
const chordDic = new Map([
  ['CustomChord', {
    name: 'CustomChord',
    strings: [0, 2, 2, 1, 0, 0],
    root: 'C',        // 追加
    type: 'major'     // 追加
  }]
]);
```

## 移行時の注意点

### 1. 後方互換性

- 基本的な機能は後方互換性を保っています
- 新しい機能はオプショナルです
- 破壊的変更がある場合は事前にアナウンスされます

### 2. パフォーマンス

- 新しいバージョンではパフォーマンスが改善される場合があります
- 大きなsyntaxファイルでは処理時間が変わる可能性があります

### 3. エラーハンドリング

- 新しいエラー型が追加される場合があります
- エラーメッセージの形式が変更される場合があります

### 4. 型安全性

- TypeScriptの型定義が強化される場合があります
- 新しい型ガードが追加される場合があります

## 移行チェックリスト

### 事前準備
- [ ] 現在のバージョンを確認
- [ ] 変更ログを確認
- [ ] 破壊的変更の有無を確認
- [ ] テスト環境を準備

### 移行実行
- [ ] 依存関係を更新
- [ ] 型定義を確認
- [ ] コードを更新
- [ ] テストを実行
- [ ] エラーを修正

### 移行後
- [ ] 機能テストを実行
- [ ] パフォーマンステストを実行
- [ ] ドキュメントを更新
- [ ] チームに変更点を共有

## トラブルシューティング

### よくある問題

#### 1. 型エラーが発生する
```typescript
// 新しい型定義をインポート
import { NewType } from 'conductor';

// 型アサーションを使用
const result = response as NewType;
```

#### 2. 非推奨警告が出る
```typescript
// 警告を無視する場合
// @ts-ignore
const result = oldMethod();

// 新しい方法に置き換える
const result = newMethod();
```

#### 3. パフォーマンスが悪化した
```typescript
// パフォーマンス設定を調整
const result = Conductor.convertToObj(
  true,
  false,  // MIDI生成を無効化
  syntax,
  allowAnnotation,
  chordDic,
  mapSeed
);
```

### サポート

移行で問題が発生した場合は、以下の情報を含めて報告してください：

- 現在のバージョン
- 移行先バージョン
- エラーメッセージ
- 使用しているコード
- 期待される動作
- 実際の動作

## 将来の移行計画

### 予定されている変更

#### v1.3.0（予定）
- 循環参照問題の修正
- 新しい奏法の追加
- パフォーマンスの大幅改善

#### v2.0.0（予定）
- アーキテクチャの大幅な変更
- 新しいAPI設計
- プラグインシステムの導入

### 推奨事項

- 定期的にバージョンアップを行う
- 破壊的変更のアナウンスを確認する
- テストカバレッジを維持する
- ドキュメントを最新に保つ 