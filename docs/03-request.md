# リクエスト仕様

このドキュメントでは、conductor APIのリクエスト形式について詳しく説明します。

## メインメソッド

### Conductor.convertToObj

記譜シンタックスを解析し、MIDIデータや演奏情報を生成するメインメソッドです。

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

## パラメータ詳細

### hasStyleCompile

スタイルコンパイルを実行するかどうかを指定するブール値です。

- `true`: スタイルコンパイルを含む完全な処理を実行
- `false`: バリデーションのみを実行（高速）

**使用例:**
```typescript
// バリデーションのみ
const result = Conductor.convertToObj(false, false, syntax, [], new Map(), {});

// 完全な処理
const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
```

### hasMidiBuild

MIDIファイルを生成するかどうかを指定するブール値です。

- `true`: MIDIファイルを生成（`hasStyleCompile: true` が必要）
- `false`: MIDIファイルを生成しない

**注意:** `hasMidiBuild: true` を指定する場合、`hasStyleCompile` も `true` である必要があります。

### syntax

解析対象の記譜シンタックス文字列です。

**基本構文例:**
```
@@
140
1/4
|2
```

**詳細な構文例:**
```
@@
140
1/4
|2 :slide(toNext=4/8,50)
|4 :bend(0..1/8 cho 1)
|5 :strum(1/8,100)
```

### allowAnnotation

許可するアノテーションを定義する配列です。

```typescript
interface AllowAnnotation {
  name: string;  // アノテーション名
  dualIdRestrictions: number[];  // デュアルID制限
}
```

**使用例:**
```typescript
const allowAnnotations: AllowAnnotation[] = [
  { name: 'compose', dualIdRestrictions: [1, 2] },
  { name: '/compose', dualIdRestrictions: [1, 2] },
  { name: 'custom', dualIdRestrictions: [0, 1, 2, 3] }
];
```

### chordDic

コード辞書を格納するMapオブジェクトです。

```typescript
type ChordDicMap = Map<string, ChordProp>;
```

**ChordPropの構造:**
```typescript
interface ChordProp {
  symbol: string;  // コード記号
  intervals: string[];  // インターバル
  notes: IKey[];  // ノート
  tonic: IdAndSymbolSet;  // トニック
  bass: IdAndSymbolSet;  // ベース
  fingerings: FingeringCollection[];  // 運指
  createdAt: Date;  // 作成日時
  updatedAt: Date;  // 更新日時
}
```

**使用例:**
```typescript
const chordDic = new Map<string, ChordProp>();

// コードを追加
chordDic.set('C', {
  symbol: 'C',
  intervals: ['1', '3', '5'],
  notes: ['C', 'E', 'G'],
  tonic: { iKeyId: 0, sym: 'C' },
  bass: { iKeyId: 0, sym: 'C' },
  fingerings: [],
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### mapSeed

マッピング用シードを格納するオブジェクトです。

```typescript
type MapSeed = { [keys:string]: BoardForShiftSeed };
```

**BoardForShiftSeedの構造:**
```typescript
type BoardForShiftSeed = {
  tuningPitches: number[];  // チューニングの弦毎の差分
  boardFullArr: (IKey | undefined)[];  // 一列ボード
  iKeysWithKeyStart: IKey[];  // スケールキーから開始するIKey配列
  iKeysWithTuningStart: IKey[];  // チューニング最低音から開始するIKey配列
};
```

**使用例:**
```typescript
const mapSeed: MapSeed = {
  'EADGBE': {
    tuningPitches: [24, 19, 15, 10, 5, 0],
    boardFullArr: ['E', undefined, 'F#', 'G', undefined, 'A', undefined, 'B', 'C', undefined, 'D', undefined],
    iKeysWithKeyStart: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
    iKeysWithTuningStart: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#']
  }
};
```

## リクエスト例

### 基本的なリクエスト

```typescript
import { Conductor } from 'conductor';

// バリデーションのみ
const validationResult = Conductor.convertToObj(
  false,  // hasStyleCompile
  false,  // hasMidiBuild
  "@@ 140 1/4 { |2 }",  // syntax
  [],  // allowAnnotation
  new Map(),  // chordDic
  {}  // mapSeed
);

// 完全な処理（MIDI生成含む）
const fullResult = Conductor.convertToObj(
  true,  // hasStyleCompile
  true,  // hasMidiBuild
  "@@ 140 1/4 { |2 }",  // syntax
  [],  // allowAnnotation
  new Map(),  // chordDic
  {}  // mapSeed
);
```

### カスタムアノテーション付きリクエスト

```typescript
const allowAnnotations: AllowAnnotation[] = [
  { name: 'compose', dualIdRestrictions: [1, 2] },
  { name: '/compose', dualIdRestrictions: [1, 2] }
];

const result = Conductor.convertToObj(
  true,
  true,
  "@@ 140 1/4 { @compose |2 /compose }",  // カスタムアノテーションを含むsyntax
  allowAnnotations,
  new Map(),
  {}
);
```

### コード辞書付きリクエスト

```typescript
// コード辞書の準備
const chordDic = new Map<string, ChordProp>();
chordDic.set('C', {
  symbol: 'C',
  intervals: ['1', '3', '5'],
  notes: ['C', 'E', 'G'],
  tonic: { iKeyId: 0, sym: 'C' },
  bass: { iKeyId: 0, sym: 'C' },
  fingerings: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

const result = Conductor.convertToObj(
  true,
  true,
  "@@ 140 1/4 { C }",  // コードを含むsyntax
  [],
  chordDic,
  {}
);
```

### マッピングシード付きリクエスト

```typescript
const mapSeed: MapSeed = {
  'EADGBE': {
    tuningPitches: [24, 19, 15, 10, 5, 0],
    boardFullArr: ['E', undefined, 'F#', 'G', undefined, 'A', undefined, 'B', 'C', undefined, 'D', undefined],
    iKeysWithKeyStart: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
    iKeysWithTuningStart: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#']
  }
};

const result = Conductor.convertToObj(
  true,
  true,
  "@@ 140 1/4 { |2:map(0..2) }",  // マッピングを含むsyntax
  [],
  new Map(),
  mapSeed
);
```

## パラメータの組み合わせ

### 処理モード

| hasStyleCompile | hasMidiBuild | 処理内容 | 用途 |
|----------------|--------------|----------|------|
| false | false | バリデーションのみ | 構文チェック、高速処理 |
| true | false | スタイルコンパイル | 演奏情報生成、MIDI不要 |
| true | true | 完全処理 | 演奏情報 + MIDI生成 |

### 推奨使用パターン

#### 1. 構文チェックのみ
```typescript
const result = Conductor.convertToObj(false, false, syntax, [], new Map(), {});
if (result.error) {
  console.error('構文エラー:', result.error.message);
}
```

#### 2. 演奏情報の取得
```typescript
const result = Conductor.convertToObj(true, false, syntax, [], new Map(), {});
if (result.response) {
  const tabObjects = result.response.mixesList[0]?.flatTOList || [];
  console.log(`ノート数: ${tabObjects.length}`);
}
```

#### 3. MIDIファイル生成
```typescript
const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
if (result.midi) {
  const blob = new Blob([result.midi], { type: 'audio/midi' });
  // MIDIファイルの処理
}
```

## エラーハンドリング

### パラメータ検証

```typescript
function validateParameters(
  hasStyleCompile: boolean,
  hasMidiBuild: boolean,
  syntax: string,
  allowAnnotation: AllowAnnotation[],
  chordDic: ChordDicMap,
  mapSeed: MapSeed
): string | null {
  // 構文チェック
  if (!syntax || syntax.trim().length === 0) {
    return 'syntaxは必須です';
  }
  
  // MIDI生成の依存関係チェック
  if (hasMidiBuild && !hasStyleCompile) {
    return 'MIDI生成にはスタイルコンパイルが必要です';
  }
  
  // アノテーション名の重複チェック
  const names = allowAnnotation.map(a => a.name);
  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    return 'アノテーション名に重複があります';
  }
  
  return null;
}
```

### 安全なAPI呼び出し

```typescript
function safeConvert(
  syntax: string,
  options: {
    hasStyleCompile?: boolean;
    hasMidiBuild?: boolean;
    allowAnnotation?: AllowAnnotation[];
    chordDic?: ChordDicMap;
    mapSeed?: MapSeed;
  } = {}
): ConvertToObj {
  const {
    hasStyleCompile = true,
    hasMidiBuild = true,
    allowAnnotation = [],
    chordDic = new Map(),
    mapSeed = {}
  } = options;
  
  // パラメータ検証
  const validationError = validateParameters(
    hasStyleCompile,
    hasMidiBuild,
    syntax,
    allowAnnotation,
    chordDic,
    mapSeed
  );
  
  if (validationError) {
    return {
      id: hasStyleCompile ? 1 : 0,
      error: {
        message: validationError,
        line: 0,
        linePos: 0,
        token: null
      },
      response: null
    };
  }
  
  // API呼び出し
  return Conductor.convertToObj(
    hasStyleCompile,
    hasMidiBuild,
    syntax,
    allowAnnotation,
    chordDic,
    mapSeed
  );
}
```

## パフォーマンス最適化

### 1. バリデーションのみの使用

大量のシンタックスをチェックする場合：

```typescript
const syntaxList = ['syntax1', 'syntax2', 'syntax3', ...];

for (const syntax of syntaxList) {
  const result = Conductor.convertToObj(false, false, syntax, [], new Map(), {});
  if (result.error) {
    console.error(`エラー: ${syntax} - ${result.error.message}`);
  }
}
```

### 2. コード辞書の再利用

```typescript
// 一度作成したコード辞書を再利用
const chordDic = createChordDictionary();

const results = syntaxList.map(syntax => 
  Conductor.convertToObj(true, true, syntax, [], chordDic, {})
);
```

### 3. アノテーションの最適化

```typescript
// 必要なアノテーションのみを指定
const minimalAnnotations: AllowAnnotation[] = [
  { name: 'compose', dualIdRestrictions: [1] }
];
```

## 注意事項

1. **パラメータの依存関係**: `hasMidiBuild: true` を指定する場合、`hasStyleCompile` も `true` である必要があります。

2. **メモリ使用量**: 大量のシンタックスやコード辞書を使用する場合、メモリ使用量が増加する可能性があります。

3. **アノテーション名**: アノテーション名は一意である必要があります。

4. **コード辞書**: コード辞書はMapオブジェクトである必要があります。

5. **マッピングシード**: マッピングシードは適切なチューニング情報を含む必要があります。

```typescript
// 基本的な使用例
const result = Conductor.convertToObj(
  true,  // hasStyleCompile
  true,  // hasMidiBuild
  "@@ 140 1/4 { |2 }",  // syntax
  [],    // allowAnnotation
  new Map(), // chordDic
  {}     // mapSeed
);

// コードを含むsyntax
const result2 = Conductor.convertToObj(
  true,
  true,
  "@@ 140 1/4 { C }",
  [],
  new Map(),
  {}
);

// マッピングを含むsyntax
const result3 = Conductor.convertToObj(
  true,
  true,
  "@@ 140 1/4 { C:map(0..2) }",
  [],
  new Map(),
  {}
); 