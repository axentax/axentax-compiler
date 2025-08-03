# エンドポイント/メソッド

## メインAPI

### `Conductor.convertToObj`

#### 概要
記譜シンタックスを解析し、MIDIデータ・演奏情報を生成するメインAPIです。

#### シグネチャ
```typescript
static convertToObj(
  hasStyleCompile: boolean,
  hasMidiBuild: boolean,
  syntax: string,
  allowAnnotation: AllowAnnotation[],
  chordDic: ChordDicMap,
  mapSeed: MapSeed
): ConvertToObj
```

#### パラメータ詳細

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|------------|----|------|------------|------|
| `hasStyleCompile` | `boolean` | ○ | - | スタイル解決を行うか |
| `hasMidiBuild` | `boolean` | ○ | - | MIDIデータを生成するか |
| `syntax` | `string` | ○ | - | 独自記譜シンタックス |
| `allowAnnotation` | `AllowAnnotation[]` | ○ | - | 許可するアノテーションのリスト |
| `chordDic` | `ChordDicMap` | ○ | - | コード辞書 |
| `mapSeed` | `MapSeed` | ○ | - | マッピング用シード |

#### 戻り値
- 型: `ConvertToObj`
- 詳細: [レスポンス仕様](./response.md)を参照

#### 使用例
```typescript
import { Conductor } from 'conductor';

// 基本的な使用例
const result = Conductor.convertToObj(
  true,  // hasStyleCompile
  true,  // hasMidiBuild
  "set.song.key: C\n@@ { C Dm Em F }",  // 記譜シンタックス
  [],    // allowAnnotation
  new Map(), // chordDic
  {}     // mapSeed
);

if (result.error) {
  console.error('エラー:', result.error.message);
} else {
  console.log('成功:', result.response);
  if (result.midi) {
    // MIDIファイルの処理
    const blob = new Blob([result.midi], { type: 'audio/midi' });
  }
}
```

## 補助API

### `Conductor.convert`

#### 概要
内部処理用のAPIで、`convertToObj`の前段階として使用されます。

#### シグネチャ
```typescript
static convert(
  syntax: string,
  allowAnnotations: AllowAnnotation[],
  chordDic: ChordDicMap,
  mapSeed: MapSeed,
  isValidOnly: boolean
): IResult<Conduct, ErrorBase>
```

#### パラメータ詳細

| パラメータ | 型 | 必須 | 説明 |
|------------|----|------|------|
| `syntax` | `string` | ○ | 独自記譜シンタックス |
| `allowAnnotations` | `AllowAnnotation[]` | ○ | 許可するアノテーションのリスト |
| `chordDic` | `ChordDicMap` | ○ | コード辞書 |
| `mapSeed` | `MapSeed` | ○ | マッピング用シード |
| `isValidOnly` | `boolean` | ○ | バリデーションのみ実行するか |

#### 戻り値
- 型: `IResult<Conduct, ErrorBase>`
- 成功時: `Success<Conduct>`
- 失敗時: `ErrorBase`

## エラーハンドリング

### エラー型
```typescript
interface ErrorBase {
  message: string;      // エラーメッセージ
  line: number;         // エラー行番号
  linePos: number;      // エラー位置
  token: string | null; // エラートークン
}
```

### エラー例
```typescript
// 構文エラー
{
  message: "Invalid token 'xxx'",
  line: 5,
  linePos: 10,
  token: "xxx"
}

// バリデーションエラー
{
  message: "BPM value must be between 1 and 999",
  line: 3,
  linePos: 8,
  token: "2000"
}
```

## パフォーマンス

### 処理時間
- **小規模なsyntax** (10-50行): 50-200ms
- **中規模なsyntax** (50-200行): 200-500ms
- **大規模なsyntax** (200行以上): 500ms以上

### メモリ使用量
- **MIDI生成あり**: 数MB程度
- **MIDI生成なし**: 数百KB程度

## 制限事項

### 構文制限
- 最大行数: 制限なし（メモリ依存）
- 最大文字数: 制限なし（メモリ依存）
- ネスト深さ: 実質的な制限なし

### 音楽制限
- BPM範囲: 1-999
- フレット範囲: 0-24
- 弦数: 6弦（標準チューニング）
- デュアルトラック数: 3 