# レスポンス仕様

このドキュメントでは、conductor APIのレスポンス形式について詳しく説明します。

## レスポンス形式

### ConvertToObj

APIの主要なレスポンス型です。すべてのAPI呼び出しはこの形式でレスポンスを返します。

```typescript
interface ConvertToObj {
  id: number,  // 0: バリデーションのみ, 1: スタイルコンパイル含む
  error: null | {
    message: string,
    line: number,
    linePos: number,
    token: string | null
  },
  response: null | Conduct,  // 成功時はConductオブジェクト
  midi?: ArrayBuffer,  // MIDIファイルのバイナリデータ
  midiRequest?: true,  // MIDI生成要求フラグ
  compileMsec?: number,  // コンパイル時間（ミリ秒）
}
```

## レスポンスフィールド詳細

### id

処理の種類を示す数値です。

- `0`: バリデーションのみの処理
- `1`: スタイルコンパイルを含む完全な処理

### error

エラーが発生した場合の情報です。成功時は `null` です。

```typescript
{
  message: string,    // エラーメッセージ
  line: number,       // エラーが発生した行番号
  linePos: number,    // エラーが発生した行内の位置
  token: string | null // エラーの原因となったトークン
}
```

### response

成功時の解析結果データです。エラー時は `null` です。

### midi

MIDIファイルのバイナリデータです。`hasMidiBuild: true` で呼び出した場合のみ含まれます。

### midiRequest

MIDI生成要求フラグです。`hasStyleCompile: true` で呼び出した場合に `true` が設定されます。

### compileMsec

コンパイルにかかった時間（ミリ秒）です。

## 成功レスポンスの詳細

### Conduct

記譜シンタックスの解析結果を格納する主要なオブジェクトです。

```typescript
interface Conduct {
  syntax: string;  // 入力シンタックス
  settings: Settings;  // 設定情報
  regionLength: number;  // ブロック数
  bpmPosList: BPMPos[];  // BPM位置情報
  clickPointList: ClickPoint[];  // クリックポイント
  flash: Flash;  // アノテーション記号バンク
  warnings: Warning[];  // 警告メッセージ
  mixesList: Mixes[];  // デュアルトラック用
  dic: {
    chord: ChordDicMap;  // コード辞書
    mapSeed: MapSeed;  // マッピング用シード
  };
  notStyleCompile?: true;  // バリデーションのみフラグ
  notMidiCompile?: true;  // MIDI不要フラグ
  extensionInfo: {
    stepInfoList: StepInfo[]
  };
  locationInfoList: LocationInfo[];  // 位置情報
  braceLocationInfoList: BraceLocationInfo[];  // 括弧位置情報
  styleObjectBank: StyleObjectBank;  // スタイルコンテキスト
  allowAnnotations: AllowAnnotation[];  // 許可アノテーション
}
```

### Mixes

デュアルトラック用のミックス情報です。

```typescript
interface Mixes {
  dualId: number,  // デュアルID
  regionList: Region[];  // ブロックリスト
  flatTOList: TabObj[];  // フラット化されたタブオブジェクトリスト
  bendBank: {
    bendNormalList: BendMidiSetter[];  // 通常ベンドリスト
    bendChannelList: BendMidiSetter[];  // チャンネルベンドリスト
  }
  marks: Marks;  // マーク情報
}
```

### TabObj

タブ譜の各ノート情報です。

```typescript
interface TabObj {
  noteStr: string;  // 表示用文字列
  extendInfo?: ExtensionViewProp;  // 拡張表示情報
  syntaxLocation: Required<SyntaxLocation>;  // 構文位置
  tabObjId: number;  // タブオブジェクトID
  regionIndex: number;  // リージョンインデックス
  regionNoteIndex: number;  // リージョン内ノートインデックス
  note: string;  // ノート名
  tab: NumberOrUfd[];  // 弦別フレット
  trueTab?: NumberOrUfd[];  // 本来のタブ
  shifted?: { shift: number, options: MapOpt[] }[];  // マッピング処理詳細
  tabShift?: number;  // legato用MIDIノート強制シフト
  velocity: NumberOrUfd[];  // 音量
  continueX: boolean;  // 前の音を残すか
  styles: Styles;  // 奏法
  bar: Tick;  // タイミング情報
  bpm: number;  // BPM
  isRest?: true;  // 休符フラグ
  isArpeggio: boolean;  // アルペジオフラグ
  isBullet: number;  // バレットグループ番号
  refMovedSlideTarget: (TabObj | undefined)[];  // スライド対象参照
  activeBows: NumberOrUfd[];  // 現時点の弦
  refActiveBows: (TabObj | undefined)[];  // 現時点の弦の参照
  slideLandingTab?: NumberOrUfd[];  // スライド着地点
  nextTabObj: TabObj;  // 次のタブオブジェクト
  prevTabObj: TabObj;  // 前のタブオブジェクト
  slideTrueType?: undefined | 0 | 1 | 2 | 3 | 4;  // スライドタイプ
  locationIndexes?: number[];  // 位置情報インデックス
  untilNext: UntilNext;  // 次の音までの情報
}
```

### Warning

警告情報です。

```typescript
interface Warning {
  message: string;  // 警告メッセージ
  line: number;  // 行番号
  pos?: number;  // 位置
}
```

## レスポンス例

### 成功例（バリデーションのみ）

```json
{
  "id": 0,
  "error": null,
  "response": {
    "syntax": "@@\n140\n1/4\n|2",
    "settings": {},
    "regionLength": 1,
    "bpmPosList": [],
    "clickPointList": [],
    "flash": {
      "click": [],
      "offset": {},
      "other": []
    },
    "warnings": [],
    "mixesList": [
      {
        "dualId": 0,
        "regionList": [],
        "flatTOList": [],
        "bendBank": {
          "bendNormalList": [],
          "bendChannelList": []
        },
        "marks": {
          "styleMappedGroupList": [],
          "fullNoteIndexWithTick": [],
          "bendGroupNumberList": [],
          "usedBendRange": []
        }
      }
    ],
    "dic": {
      "chord": {},
      "mapSeed": {}
    },
    "extensionInfo": {
      "stepInfoList": []
    },
    "locationInfoList": [],
    "braceLocationInfoList": [],
    "styleObjectBank": {},
    "allowAnnotations": []
  },
  "compileMsec": 15
}
```

### 成功例（スタイルコンパイル含む）

```json
{
  "id": 1,
  "error": null,
  "compileMsec": 45,
  "syntax": "@@ 140 1/4 { |2 }",
  "response": {
    "mixesList": [
      {
        "flatTOList": [
          {
            "stringIndex": 0,
            "fret": 2,
            "note": "D",
            "octave": 4,
            "midiNote": 62,
            "velocity": 100,
            "duration": 480,
            "startTick": 0
          }
        ]
      }
    ],
    "bpmPosList": [
      { "tick": 0, "bpm": 140 },
      { "tick": 480, "bpm": 140 },
      { "tick": 960, "bpm": 140 }
    ],
    "warnings": []
  },
  "midi": null
}
```

### エラー例

```json
{
  "id": 1,
  "error": {
    "message": "Invalid syntax at line 3",
    "line": 3,
    "linePos": 5,
    "token": "invalid"
  },
  "response": null,
  "midiRequest": true
}
```

## レスポンス処理のベストプラクティス

### 1. エラーハンドリング

```typescript
function handleResponse(result: ConvertToObj) {
  if (result.error) {
    console.error(`エラー: ${result.error.message} (行: ${result.error.line}, 位置: ${result.error.linePos})`);
    return;
  }
  
  // 成功時の処理
  console.log('処理成功');
}
```

### 2. 処理タイプの判定

```typescript
function processResult(result: ConvertToObj) {
  if (result.id === 0) {
    console.log('バリデーションのみの処理が完了しました');
  } else if (result.id === 1) {
    console.log('スタイルコンパイルを含む処理が完了しました');
    
    if (result.midiRequest) {
      console.log('MIDI生成要求が含まれています');
    }
  }
}
```

### 3. MIDIデータの処理

```typescript
function handleMidiData(result: ConvertToObj) {
  if (result.midi) {
    // MIDIファイルとして保存
    const blob = new Blob([result.midi], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    
    // ダウンロードリンクを作成
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.mid';
    a.click();
    
    URL.revokeObjectURL(url);
  }
}
```

### 4. パフォーマンス監視

```typescript
function monitorPerformance(result: ConvertToObj) {
  if (result.compileMsec) {
    console.log(`コンパイル時間: ${result.compileMsec}ms`);
    
    if (result.compileMsec > 1000) {
      console.warn('コンパイル時間が1秒を超えています');
    }
  }
}
```

## 注意事項

1. **レスポンスサイズ**: 複雑なシンタックスや大量のノートを含む場合、レスポンスサイズが大きくなる可能性があります。

2. **MIDIデータ**: `midi` フィールドは `ArrayBuffer` 形式で返されるため、適切な処理が必要です。

3. **循環参照**: `TabObj` の `nextTabObj` と `prevTabObj` は循環参照を含むため、JSON.stringify()でシリアライズする際は注意が必要です。

4. **メモリ使用量**: 大量のノートを処理する場合、メモリ使用量が増加する可能性があります。 