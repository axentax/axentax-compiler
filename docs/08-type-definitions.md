# 型定義集

このドキュメントでは、conductorライブラリで使用される主要な型定義を説明します。

## 主要な型定義

### ConvertToObj

APIの主要なレスポンス型です。

```typescript
export interface ConvertToObj {
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

### Conduct

記譜シンタックスの解析結果を格納する主要な型です。

```typescript
export interface Conduct {
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

### TabObj

タブ譜の各ノート情報を格納する型です。

```typescript
export interface TabObj {
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

### Mixes

デュアルトラック用のミックス情報を格納する型です。

```typescript
export interface Mixes {
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

### Marks

マッピンググループやベンド情報を格納する型です。

```typescript
export interface Marks {
  styleMappedGroupList: StyleMapGroupList[];  // マッピンググループ情報
  fullNoteIndexWithTick: number[];  // ノート位置でのtick値
  bendGroupNumberList: number[];  // ベンドグループ情報
  usedBendRange: { start: number, end: number }[];  // 使用ベンド範囲
}
```

### Styles

奏法情報を格納する型です。

```typescript
export interface Styles {
  approach?: StyleApproach;  // アプローチ奏法
  bd?: StyleBendX[];  // ベンド奏法
  bpm?: {
    style: StyleBPM;
    group: number;
    groupEndTick: number;
  };
  continue?: true;  // 継続フラグ
  delay?: StyleDelay;  // ディレイ
  inst?: ESInst;  // 楽器タイプ
  degree?: DegreeObj;  // 度数情報
  legato?: StyleLegato;  // レガート
  mapped?: StyleMapped[];  // マッピング
  pos?: StylePositions;  // ポジション
  restNoise?: true;  // 休符ノイズ
  scaleX?: StyleScaleX;  // スケール
  slide?: StyleSlide;  // スライド
  staccato?: StyleStaccato;  // スタッカート
  step?: StyleStep;  // ステップ
  stroke?: StyleStroke;  // ストローク
  strum?: StyleStrum;  // ストラム
  turn?: {
    props: string,
    group: number
    groupFinal?: true;
  };
  until?: UntilNext;  // 次の音まで
  velocity?: number;  // 音量
  velocityPerBows?: NumberOrUfd[];  // 弦別音量
}
```

### Tick

タイミング情報を格納する型です。

```typescript
export interface Tick {
  tick: number;  // この音のみの長さ
  fretStartTicks: NumberOrUfd[];  // フレット別音声開始位置
  fretStopTicks: NumberOrUfd[];  // フレット別音声停止位置
  startTick: number;  // 開始tick
  stopTick: number;  // 停止tick
}
```

### ChordDicMap

コード辞書の型です。

```typescript
export type ChordDicMap = Map<string, ChordProp>;
```

### ChordProp

コードの基本情報を格納する型です。

```typescript
export interface ChordProp {
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

### MapSeed

マッピング用シードの型です。

```typescript
export type MapSeed = { [keys:string]: BoardForShiftSeed };
```

### BoardForShiftSeed

指板シフト用のシード情報を格納する型です。

```typescript
export type BoardForShiftSeed = {
  tuningPitches: number[];  // チューニングの弦毎の差分
  boardFullArr: (IKey | undefined)[];  // 一列ボード
  iKeysWithKeyStart: IKey[];  // スケールキーから開始するIKey配列
  iKeysWithTuningStart: IKey[];  // チューニング最低音から開始するIKey配列
};
```

### LocationInfo

構文位置情報を格納する型です。

```typescript
export interface LocationInfo {
  line: number;  // 行番号
  linePos: number;  // 行位置
  endLine: number;  // 終了行
  endPos: number;  // 終了位置
  type: CSymbolType;  // シンボルタイプ
  regionId: number;  // リージョンID
  dualId: number;  // デュアルID
  tabObjIndexes: number[];  // タブオブジェクトインデックス
  sym: string;  // シンボル
}
```

### CSymbolType

コンパイルシンボルのタイプを定義する列挙型です。

```typescript
export enum CSymbolType {
  undefined = 'undefined',
  flash = 'flush',  // 例: "@compose(...)"
  note = 'note',  // 例: |2
  bullet = 'bullet',  // 例: 5/7-9-10-r-10
  degreeName = 'degree',  // 例: %4/1b
  style = 'style',  // 例: :styleName
  blockStyle = 'blockStyle',  // 例: }:styleName(..)
  regionStart = 'regionStart',  // 例: @@
  regionProp = 'regionProp',  // 例: 1/4 140 after @@
  comma = 'comma',  // 例: ,
  openingCurlyBrace = 'openingCurlyBrace',  // 例: {
  closingCurlyBrace = 'closingCurlyBrace',  // 例: }
}
```

### 基本型

```typescript
export type NumberOrUfd = (number | undefined);  // 数値または未定義
export type StringOrUdf = (string | undefined);  // 文字列または未定義
export type UntilNext = [number, number];  // 次の音までの情報
export type UntilRange = [number, number, number];  // 範囲情報

export type IKey = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";
export type Fret = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
```

### Warning

警告情報を格納する型です。

```typescript
export type Warning = {
  message: string;  // 警告メッセージ
  line: number;  // 行番号
  pos?: number;  // 位置
};
```

### AllowAnnotation

許可するアノテーションを定義する型です。

```typescript
export interface AllowAnnotation {
  name: string;  // アノテーション名
  dualIdRestrictions: number[];  // デュアルID制限
}
```

## 型の使用例

### 基本的なAPI呼び出し

```typescript
import { Conductor } from 'conductor';

const result: ConvertToObj = Conductor.convertToObj(
  true,  // hasStyleCompile
  true,  // hasMidiBuild
  "@@ 140 1/4 { |2 }",  // syntax
  [],  // allowAnnotation
  new Map(),  // chordDic
  {}  // mapSeed
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

### レスポンスの型チェック

```typescript
function processResponse(result: ConvertToObj) {
  if (result.id === 0) {
    // バリデーションのみの結果
    console.log('バリデーション完了');
  } else if (result.id === 1) {
    // スタイルコンパイル含む結果
    console.log('コンパイル完了');
    if (result.midiRequest) {
      console.log('MIDI生成要求あり');
    }
  }
  
  if (result.compileMsec) {
    console.log(`コンパイル時間: ${result.compileMsec}ms`);
  }
}
```

これらの型定義を使用することで、TypeScriptの型安全性を活用した開発が可能になります。 