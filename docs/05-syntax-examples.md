# 記譜シンタックス例

## 概要

conductorで使用する独自の記譜シンタックスの例を紹介します。

## 基本構造

### 設定行
```
set.[カテゴリ].[項目]: [値]
```

### リージョンとブロック

- **リージョン**: `@@` で始まる単位。BPMや拍子などの設定を持つ。
- **ブロック**: `{ ... }` で囲まれたまとまり。1つのリージョン内に複数のブロックを `>>` で連結できる。
- **実装上の扱い**: `>>` で連結されたブロックは「同じリージョン内の別ブロック」として扱われ、`view.noteList` の各要素として分割される。

#### 例
```typescript
@@ 140 1/4 { C } >> 1/4 { Dm Em F }
```
- この場合、1つのリージョン内に2つのブロックが存在する。
- `view.regions.length === 1`
- `view.noteList[0]` は1つのノート（C）
- `view.noteList[1]` は3つのノート（Dm, Em, F）

#### noteList構造例
```js
view.noteList = [
  [ { sym: "C", ... } ],
  [ { sym: "Dm", ... }, { sym: "Em", ... }, { sym: "F", ... } ]
]
```

### 複数リージョンの構文

複数のリージョンを連結する場合、以下のルールに従います：

1. **最初のリージョンのみ** `@@` マーカーを使用
2. **BPMは最初のブロックのみ** 指定可能
3. **2番目以降のリージョン** は拍子のみ指定
4. **現在の実装では** `>>` による連結は同じリージョン内で処理される

#### 正しい例
```
@@ 140 1/4 { C Dm } >> 1/4 { Em F } >> 1/4 { G Am }
```

#### 間違った例
```
@@ 140 1/4 { C Dm } >> @@ 140 1/4 { Em F }  // @@は最初のみ
@@ 140 1/4 { C Dm } >> 140 1/4 { Em F }     // BPMは最初のみ
```

#### 詳細な構文
- 最初のリージョン: `@@ [BPM] [拍子] { [音楽要素] }`
- 2番目以降: `>> [拍子] { [音楽要素] }`
- 連結記号: `>>` (スペース区切り)

#### 注意事項
現在の実装では、`>>` による連結は別のリージョンを作成せず、同じリージョン内で時系列的に処理されます。これは、リージョンの概念が時間的な区切りではなく、構文上の区切りとして扱われているためです。

## 基本的な例

### 1. シンプルなコード進行
```typescript
const simpleProgression = `set.song.key: C
set.style.until: 1/4

@@ 120 1/4 {
  C
  Dm
  Em
  F
} >> 1/4 {
  G
  Am
  Bdim
  C
}`;
```

### 2. BPM指定付き
```typescript
const withBpm = `set.song.key: G
set.style.until: 1/4

@@ 120 1/4 {
  G
  Em
  C
  D
}`;
```

### 3. タブ譜
```typescript
const tabNotation = `set.song.key: A
set.style.until: 1/8

@@ 140 1/8 {
  |||||5
  |||||7
  |||||9
  |||||12
}`;
```

## 奏法の例

### 1. スライド
```typescript
const slideExample = `set.song.key: E
set.style.until: 1/4

@@ 140 1/4 {
  |||||12:to(continue) |||||15
  |||||7:to(release) |||||10
  |||||3:to(continue) |||||7:to(continue) |||||12
}`;
```

### 2. ベンド
```typescript
const bendExample = `set.song.key: A
set.style.until: 1/4

@@ 140 1/4 {
  |||||7:bd(0..1/4 cho 1)
  |||||9:bd(0..2/4 vib 0.5)
  |||||12:bd(0..1/2 cho 2)
}`;
```

### 3. レガート
```typescript
const legatoExample = `set.song.key: C
set.style.until: 1/8

@@ 140 1/8 {
  |||||5:leg
  |||||7:leg
  |||||9:leg
  |||||12:leg
}`;
```

### 4. ストローク
```typescript
const strokeExample = `set.song.key: G
set.style.until: 1/4

@@ 140 1/4 {
  G:stroke(1/4, down)
  C:stroke(1/4, up)
  D:stroke(1/2, down)
}`;
```

### 5. ストラム
```typescript
const strumExample = `set.song.key: E
set.style.until: 1/4

@@ 140 1/4 {
  Em:strum(30)
  Am:strum(50)
  D:strum(70)
  G:strum(100)
}`;
```

### 6. アプローチ
```typescript
const approachExample = `set.song.key: F
set.style.until: 1/8

@@ 140 1/8 {
  |||||12:approach(|2||4, 80)
  |||||15:approach(|3||5, 90)
  |||||17:approach(|1||3, 70)
}`;
```

## マッピング機能

### 1. 基本的なマッピング
```typescript
const basicMapping = `set.song.key: C
set.style.until: 1/4

@@ 140 1/4 {
  C:map(0..3)
  Dm:map(0..2)
  Em:map(0..1)
}`;
```

### 2. ステップマッピング
```typescript
const stepMapping = `set.song.key: A
set.style.until: 1/8

@@ 140 1/8 {
  |||||5:step(54321):map(0..3)
  |||||7:step(12345):map(0..2)
}`;
```

### 3. オフセット付きマッピング
```typescript
const offsetMapping = `set.song.key: G
set.style.until: 1/16

@@ 140 1/16 {
  |||2:map(0..3):1/16 @offset
  |||||12:map(0..2):1/8 @offset
}`;
```

## 複雑な例

### 1. 複数の奏法を組み合わせ
```typescript
const complexStyle = `set.click.inst: 42
set.style.until: 1/8
set.dual.pan: true
set.dual.panning: [0.3, 0.7, 1.0]
set.song.key: E

@@ 120 1/8 {
  Em:bd(0..2/4 vib 0.5)
  |||||12:to(continue) |||||15
  Am:step(54321)
} >> 1/8 {
  |||2:map(0..3):1/16 @offset
  D:strum(50)
} >> 1/8 {
  G:leg
  |||||12:approach(|2||4, 80)
  C:stroke(1/4, up)
}`;
```

### 2. デュアルトラック
```typescript
const dualTrack = `set.song.key: C
set.style.until: 1/4
set.dual.pan: true

@@ 140 1/4 {
  C:dual(1)
  Dm:dual(2)
  Em:dual(1)
  F:dual(2)
} >> 1/4 {
  G:dual(1)
  Am:dual(2)
  Bdim:dual(1)
  C:dual(2)
}`;
```

### 3. 休符を含む
```typescript
const withRests = `set.song.key: A
set.style.until: 1/4

@@ 140 1/4 {
  Am
  r
  Dm
  r
} >> 1/4 {
  G
  r
  C
  r
}`;
```

## エラー例

### 1. 構文エラー
```typescript
const syntaxError = `set.song.key: C
set.style.until: 1/4

@@ 140 1/4 {
  C
  Dm
  Em
  F
  xxx  // 無効なトークン
}`;
```

### 2. 範囲外の値
```typescript
const outOfRange = `set.song.key: C
set.style.until: 1/4

@@ 2000 1/4 {  // BPMが範囲外
  C
  Dm
  Em
  F
}`;
```

### 3. 無効なコード
```typescript
const invalidChord = `set.song.key: C
set.style.until: 1/4

@@ 140 1/4 {
  C
  Xm7  // 存在しないコード
  Em
  F
}`;
```

### 4. 複数リージョンの構文エラー
```typescript
const invalidMultipleRegions = `set.song.key: C
set.style.until: 1/4

@@ 140 1/4 { C } >> @@ 140 1/4 { Dm }  // @@は最初のみ
@@ 140 1/4 { C } >> 140 1/4 { Dm }     // BPMは最初のみ
`;
```

## 実用的な例

### 1. ブルース進行
```typescript
const bluesProgression = `set.song.key: A
set.style.until: 1/4

@@ 120 1/4 {
  A:bd(0..1/4 vib 0.3)
  A:bd(0..1/4 vib 0.3)
  A:bd(0..1/4 vib 0.3)
  A:bd(0..1/4 vib 0.3)
} >> 1/4 {
  D:bd(0..1/4 vib 0.3)
  D:bd(0..1/4 vib 0.3)
  A:bd(0..1/4 vib 0.3)
  A:bd(0..1/4 vib 0.3)
} >> 1/4 {
  E:bd(0..1/4 vib 0.3)
  D:bd(0..1/4 vib 0.3)
  A:bd(0..1/4 vib 0.3)
  E:bd(0..1/4 vib 0.3)
}`;
```

### 2. フィンガーピッキング
```typescript
const fingerpicking = `set.song.key: C
set.style.until: 1/8

@@ 140 1/8 {
  C:step(54321):map(0..3)
  Am:step(54321):map(0..3)
  F:step(54321):map(0..3)
  G:step(54321):map(0..3)
}`;
```

### 3. アルペジオ
```typescript
const arpeggio = `set.song.key: G
set.style.until: 1/16

@@ 140 1/16 {
  G:map(0..7):1/16
  Em:map(0..7):1/16
  C:map(0..7):1/16
  D:map(0..7):1/16
}`;
```

## テスト用の例

### 1. 最小限の例
```typescript
const minimal = `@@ 140 1/4 { C }`;
```

### 2. 設定のみ
```typescript
const settingsOnly = `set.song.key: C
set.style.until: 1/4`;
```

### 3. 空のリージョン
```typescript
const emptyRegion = `@@ 140 1/4 { }`;
```

## 注意事項

### 1. 構文ルール
- 設定行は`set.`で始まる
- リージョンは`@@`で始まる（最初のリージョンのみ）
- リージョン連結は`>>`を使用
- BPMは最初のリージョンのみ指定可能
- コメントは`//`で始まる

### 2. 値の範囲
- BPM: 1-999
- フレット: 0-24
- 弦: 1-6
- ベロシティ: 0-127

### 3. 制限事項
- ネスト深さに制限なし
- 行数に制限なし
- 文字数に制限なし（メモリ依存）

### 4. 複数リージョンの制限
- `@@`マーカーは最初のリージョンのみ使用
- BPM指定は最初のリージョンのみ有効
- 2番目以降のリージョンは拍子のみ指定

## :bd（ベンド）スタイルの複数指定

連続指定、カンマ区切り、複数行、reset指定、曲線指定など多様なパターンに対応しています。

### 例

- 連続指定
  ```
  @@ 140 1/4 { |||||12:bd(0..1/4 cho 1):bd(2..4/4 vib 0.5) }
  ```
- カンマ区切り
  ```
  @@ 140 1/4 { |||||12:bd(0..1/4 cho 1, 2..4/4 vib 0.5) }
  ```
- 複数行
  ```
  @@ 140 1/4 { |||||12:bd(
    0..1/4 cho 1
    2..4/4 vib 0.5
  ) }
  ```
- reset指定（先頭/末尾）
  ```
  @@ 140 1/4 { |||||12:bd(reset, 1..3/4 cho 1) }
  @@ 140 1/4 { |||||12:bd(0..3/4 cho 1, reset) }
  ```
- 曲線指定
  ```
  @@ 140 1/4 { |||||12:bd(0..1/4 vib 1 ast) }
  ``` 