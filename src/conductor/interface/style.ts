import { ScaleName } from "../diatonic-and-scale/mod-scale";
import { DiatonicEvolverValue } from "./diatonic";
import { IShiftMax7, Scale, Tonality, NumberOrUfd, IKey, UntilNext, SyntaxLocation, UntilRange, bin12 } from "./utils.interface";

/**
 * スタイルオブジェクトバンク型
 * 
 * スタイルオブジェクトをキャッシュするための辞書型
 * キーは文字列、値はStylesオブジェクト
 */
export type StyleObjectBank = {
  [keys: string]: Styles;
}

/**
 * 楽器音色列挙型
 * 
 * 演奏時に使用される楽器の音色を表現する
 * 通常音、ミュート音、休符音、ストラム音など様々な音色を含む
 */
export enum ESInst {
  normal = 'normal', // 通常音
  mute = 'mute', // ミュート音
  muteContinue = 'muteContinue', // 継続ミュート音
  rest = 'rest', // 休符音（未使用？）
  restNoise = 'restNoise', // 休符ノイズ
  brushing_d = 'brushing_d', // ダウンブラッシング
  brushing_D = 'brushing_D', // ダウンブラッシング（強）
  brushing_u = 'brushing_u', // アップブラッシング
  brushing_U = 'brushing_U', // アップブラッシング（強）
  strum = 'strum', // ストラム音（検討中）
  normalUnContinueForStep = 'normalUnContinueForStep' // ステップ用非継続通常音
}

/**
 * 演奏スタイルインターフェース
 * 
 * 音楽記譜法で指定される演奏技法や表現を表現する
 * ベンド、スライド、レガート、ストラムなどの演奏技法を含む
 * 
 * 注意事項：
 * - mapped処理以降はstylesのオブジェクトを直接変更するのは禁止
 * ※mappedで参照コピーしたもの同士で影響し合ってしまうため
 * 
 * どうしても変更が必要な場合は、mappedの中のコピー処理（copyCompileSymbols）で、
 * 変更するスタイルだけを、手動でディープコピーする処理を追加する（現状は無し）
 */
export interface Styles {
  /** アプローチ（スライドアプローチ） */
  approach?: StyleApproach;
  // bend?: StyleBendSet[];
  /** ベンド（音程変化） */
  bd?: StyleBendX[];
  /** BPM（テンポ変化） */
  bpm?: {
    style: StyleBPM;
    /** グループ番号（-1は単体、mod-style.distributeStyleWithinHierarchyで解決） */
    group: number;
    /** グループ終了tick（layer-compiler.resolveStyleGroupで解決） */
    groupEndTick: number;
  };
  // brushing?: StyleBrushing;
  /** 継続フラグ（前の音を残す） */
  continue?: true;
  /** ディレイ（音の遅延） */
  delay?: StyleDelay;
  /** 楽器音色 */
  inst?: ESInst;
  /** 調性（継承されない） */
  degree?: DegreeObj; // not inherited
  /** レガート（音の連結） */
  legato?: StyleLegato;
  /** マッピング（フィンガリング最適化） */
  mapped?: StyleMapped[];
  /** ポジション（押さえ方の指定） */
  // pos?: StylePositions;
  /** 休符ノイズ（instに統合予定） */
  restNoise?: true, // want to integrate it into inst..
  /** スケール拡張 */
  scaleX?: StyleScaleX;
  /** スライド（音程の滑らかな変化） */
  slide?: StyleSlide;
  /** スタッカート（音の分離） */
  staccato?: StyleStaccato;
  /** ステップ（アルペジオ） */
  step?: StyleStep;
  /** ストローク（ピッキングパターン） */
  stroke?: StyleStroke; 
  /** ストラム（コード奏法） */
  strum?: StyleStrum;
  /** ターン（装飾音） */
  turn?: {
    props: string,
    /** グループ番号（-1は単体） */
    group: number
    /** グループ最終マーク */
    groupFinal?: true;
  };
  /** 拍子記号 */
  until?: UntilNext,
  /** 音量 */
  velocity?: number;
  /** 弦別音量 */
  velocityPerBows?: NumberOrUfd[];
}

/** スタイルキー型 */
export type StyleKeys = keyof Styles;

/**
 * アプローチスタイルインターフェース
 * 
 * スライドアプローチ（音程への接近）を表現する
 * 例：slide: approach=(|2||4,50),toNext=(|s||s||,4/8,50,40-20)
 * 開始音の音程がはっきりするような少しでも開始音が長いケースは、ユーザーはtoNextで指定する
 */
export interface StyleApproach extends SyntaxLocation {
  /** スライド開始タブ（フレット配列） */
  bowWithFret: NumberOrUfd[],
  /** スピード（パーセンテージ） */
  percentOfSpeed?: number
}

/**
 * ベンドスタイルインターフェース
 * 
 * ベンド（音程の変化）を表現する
 * 
 * until設定の例：
 * - 2..4/4：2/4から4/4まで
 * - ..4/4：0から4/4まで
 * - 4../4：4/4から末端まで
 * - ..：先頭から末端まで
 * 
 * cho（チョーキング）の例：
 * - bd(0..1/4 cho 1)：先頭基準チョーキング
 * - bd(1..0/4 cho 1)：終端基準チョーキング
 * - bd(2../4 cho 1)：指定位置から末端までにかけてチョーキング
 * - bd(0..2/4 cho 1, 2..end/4 cho 1)：指定位置から末端までにかけてarchチョーキング
 * 
 * vib（ビブラート）の例：
 * - bd(2..4/4 vib 1)：基本ビブラート
 * - bd(2..0/4 vib 1)：終端基準ビブラート
 * - bd(2../4 vib 1)：指定位置から末端までにかけてビブラート
 * - bd(2..4 vib 1 c5 ast)：astroid曲線で、1/5周期でビブラート
 * 
 * tpl（テンプレート）の例：
 * - bd(2..end tpl_hi2)：指定位置に対してテンプレートベンドを適用
 * ※テンプレート使用時は他指定不可
 */
export interface StyleBendX  extends Required<SyntaxLocation>  {
  /**
   * 稼働範囲
   * [開始、終端、分割]
   * 
   * 詳細：
   * - 終端未指定の場合 -1 を設定し、末端地頭検出
   * - reset設定の場合 [ -2, -2, 1 ] とする
   */
  untilRange: UntilRange; // 0..1/8 #適用範囲
  /** ベンド方法（vib、cho） */
  method: BendMethodX; // vib cho
  /** ピッチ（音程変化量） */
  pitch: number; // 1.25 #ピッチ
  /** ビブラートの周期（c2 c3 c4 c5、デフォルトは3） */
  cycle?: number; // c2 c3 c4 c5  #ビブラートの周期(デフォルトは3)
  /** ベンド曲線（"ast"でastroid, "tri"で直線トライアングル、通常は正弦波） */
  curve?: BendCurveX; // "ast"でastroid, "tri"で直線トライアングル（通常は正弦波）
  /** テンプレート名 */
  template?: string; //
  /** レガート対応フラグ */
  isLegato?: true // legatoの対応
}

/** ベンド方法列挙型 */
export enum BendMethodX { vib }
/** ベンド曲線列挙型 */
export enum BendCurveX { ast, tri }

/**
 * ベンドセットインターフェース（レガシー）
 * 
 * ベンドの集合を表現する（現在はStyleBendXに統合）
 * 
 * 例：
 * :bend(
 *   0..1/8 cho 1.25 fast |||||12  // 0/8から1/8で、正弦波(fast)でチョーキングを1.25音程上げる 弦は6弦のみ
 *   1..7/8 vib 1 1/4 force        // 1/8から7/8で、ビブラートを1/4周期で、1音幅ビブラート(1が未指定の場合は自動で0.25とか自然な感じ)、forceはnote幅全域に強制適用
 *   7..8/8 end                    // 前の音程から0まで下げる、endメソッド自体が未指定の場合、範囲最終で0に戻す
 * )
 */
export interface StyleBendSet extends SyntaxLocation {
  /** ベンドスタイルのリスト */
  styleBendList: StyleBend[];
  /** グループ番号（-1は単体） */
  group: number;
  /** グループ最終マーク */
  groupFinal?: true;
  // groupEndTick: number;
}

/**
 * ベンドスタイルインターフェース（レガシー）
 * 
 * 個別のベンドを表現する（現在はStyleBendXに統合）
 */
export interface StyleBend extends Required<SyntaxLocation>  {
  /** 対象タブ（フレット配列） */
  targetTab: NumberOrUfd[]; // |||||2
  /** 適用範囲 */
  untilRange: UntilRange; // 0..1/8 #適用範囲
  /** ベンド方法（vib、cho、end） */
  method: BendMethod; // vib cho end
  /** ピッチ（音程変化量） */
  pitch: number; // 1.25 #ピッチ
  /** ビブラートの周期 */
  cycle: UntilNext; // 1/4 #ビブラートの周期? ### ビブラート自体の大きさは pitchを使う
  /** 強制適用フラグ */
  force?: true; // force
  /** ベンド速度（fast、slow） */
  curveType: BendSpeed // fast, slow #正弦波かどうかの分岐用
}

/** ベンド方法列挙型（レガシー） */
export enum BendMethod { vib, cho, end }
/** ベンド速度列挙型（レガシー） */
export enum BendSpeed { fast, slow, auto }

/**
 * BPMスタイルインターフェース
 * 
 * テンポの変化を表現する
 * 例：+30, -30, 30..50, -30..50, ..120, ..+30, ..-30
 * 
 * type:
 *  1: start only: +30, -30
 *  2: end only: ..+30, ..-30
 *  3: start and end: -30..+50
 */
export interface StyleBPM extends SyntaxLocation {
  /**
   * タイプ：
   *  1: start only（ローカルタイプ）: +30, -30, 140
   *  2: end only（トランジションタイプ）: ..+30, ..-30
   *  3: start and end（トランジションタイプ）: -30..+50
   */
  type: 1 | 2 | 3,
  /** 開始符号（-1または1） */
  beforeSign: -1 | 1;
  /** 開始BPM（整数） */
  beforeBPM: number;
  /** 終了符号（-1または1） */
  afterSign?: -1 | 1;
  /** 終了BPM（整数） */
  afterBPM?: number;
}

/**
 * ディレイスタイルインターフェース
 * 
 * 音の遅延を表現する
 */
export interface StyleDelay extends SyntaxLocation {
  /** 開始拍子 */
  startUntil: UntilNext,
}

/** マップグループリスト型 */
export type StyleMapGroupList = number;

/** マップオプション列挙型 */
export enum MapOpt {
  /** reverse: 逆回し（イケテない逆回し） */
  rev,
  /** stay string: 可能な限り弦移動しない */ // ⇦ 可能な限りではなく常に弦移動しないのも欲しい
  ss,
  /** stay open string: 解放弦のみshiftしない（グループ指定時のみ） */
  sos,
  /** no open string: shift結果で解放弦できる限り使わない（グループ指定時側ではまだ未実装・・というかどこで弾くか自体未実装） */
  nos,
}
/** マップオプションキー配列：数値以外のキーのみを抽出 */
export const MapOptKeys = Object.keys(MapOpt).filter(
  (key) => isNaN(Number(key)) && !isNaN(MapOpt[key as keyof typeof MapOpt]));

/**
 * マップ拡張インターフェース
 * 
 * フィンガリング最適化のためのマッピング情報を表現する
 * 例：map(1 rev ss sos, 2..-2 rev ss sos)
 */
export interface MapExpand {
  /** 構文位置情報 */
  location?: SyntaxLocation;
  /** シフト値：スケール内で移動する想定なので12音階ではない。但し、スケール外音の増加で7音階を超える場合がある */
  shift: number; // スケール内で移動する想定なので 12音階ではない。但し、スケール外音の増加で7音階を超える場合がある
  /** マップオプション配列 */
  options: MapOpt[]
}

/**
 * マップスタイルインターフェース
 * 
 * フィンガリング最適化のスタイルを表現する
 * 例：
 * - map(1, 2:auto, 3:rev)
 * - map(1..3:trip)
 */
export interface StyleMapped extends SyntaxLocation {
  /** マップ拡張スタイル配列 */
  style: MapExpand[];
  /** グループ番号 */
  group: number;
  // groupFinal?: true;
}

/**
 * ポジションスタイルインターフェース
 * 
 * コードの押さえ方や弦の使用を指定する
 * 
 * 指定可能なオプション：
 * [保留](1)転回: inversion, inv, rot, I, R // 1,2,3,4,5 // default:1
 * [保留](3)度抜: omit, O                   // 1,5 // default:なし
 * [保留](5)弦指定補填: cover, cov, C          // error, warning, true, false // default: true
 * (2)位置: location, loc, L          // 1:low, 2:mid, 3:high, 4:higher // default:low
 * (4)弦抜: exclusion, exc, E         // 6, 5
 * (4)弦指定: use, U                  // full, f, 123, 654, 654321 // default:full, f
 * 
 * 例：
 * - C#m7:pos(loc:low, rot:1, exc:5, use:full, cover:false)
 * - C#m7:pos(L:low,I:2,E:5,U:654321,C:false)
 */
// export interface StylePositions extends SyntaxLocation {
//   /** 転回：inversion, inv, rot, I, R => 1, 2, 3（undefinedはfull） */
//   inversion?: number,
//   /** 位置：location, loc, L => 0:low(default), 1:mid, 2:high, 3:higher（undefinedはlow） */
//   location?: number;
//   /** 除外弦：exclusion pull out, exc, E => 1, 5（undefinedはnone） */
//   exclusion?: number[],

//   /** 使用弦：use string => full or f(default), 123, 654, 654321（undefinedはfull） */
//   useStrings?: number[],
//   /** 必須弦 */
//   required?: number[]

//   /** useStringsに含まれない弦の対応：0:true, 1:false, 2:warning, 3:error */
//   cover: number,
// }

/**
 * レガートスタイル型
 * 
 * 音の連結を表現する（trueでレガート有効）
 */
export type StyleLegato = boolean;

/**
 * スケール拡張インターフェース
 * 
 * mappedで使用するスケール情報を表現する
 */
export interface StyleScaleX {
  /** 調（音名） */
  key: IKey,
  /** スケール名 */
  scale: ScaleName,
  /** 12音階の2進数表現 */
  bin: bin12
}

/**
 * スライドスタイルインターフェース
 * 
 * スライド（音程の滑らかな変化）を表現する
 * 例：2|2:to 2|2:to(1/2!hi.24!slow.50)
 */
export interface StyleSlide extends SyntaxLocation {
  /** 行文字列 */
  rowString: string;
  /** スライドタイプ（to: スライド、release: リリース） */
  type: 'to' | 'release',
  /** 始点のuntil指定 */
  startUntil: UntilNext,
  /** 開始スピード（fastの場合徐々に遅くなり、slowの場合徐々に速くなる。デフォルトはmid(一定)） */
  inSpeed?: 'fast' | 'slow' | 'mid',
  /** 開始スピードのレベル（0-100、デフォルト25） */
  inSpeedLevel: number,
  /** リリース方向（up:1, down:-1） */
  arrow?: number,
  /** リリースの移動距離 */
  releaseWidth: number,
  /** 次の音もスライドとするか（システム的には音量下げるだけ、track変えてクロスフェードするなら影響あり） */
  continue?: true,
  /** スライド時のみ、開始タイミング自動補正 */
  auto?: true
}

/**
 * スタッカートスタイルインターフェース
 * 
 * スタッカート（音の分離）を表現する
 * 先頭から換算して"切る位置"を指定する
 */
export interface StyleStaccato extends SyntaxLocation {
  /** 切断位置 */
  cutUntil: UntilNext,
}

/**
 * ステップスタイルインターフェース
 * 
 * ステップ（アルペジオ）を表現する
 * 例：[ 'fn', '.', '6', '61', '6', '6' ]
 */
export interface StyleStep extends SyntaxLocation {
  // list: string[];
  /** 解析済みステップ配列 */
  parsedStep: ParsedStep[];
}

/**
 * 解析済みステップインターフェース
 * 
 * ステップの解析結果を表現する
 */
export interface ParsedStep {
  /** ステップ記号配列 */
  stepSym: string[],
  /** 弦インデックス配列（休符はundefined） */
  stringIndexes: number[] | undefined,
  
  /** 楽器音色 */
  inst: ESInst,
  /** サフィックス */
  suffix: string,

  /** 行番号 */
  line: number,
  // startLine: number,
  /** 開始位置 */
  startPos: number,
  // endLine: number,
  /** 終了位置 */
  endPos: number
}

/**
 * ストロークスタイルインターフェース
 * 
 * ピッキングパターンを表現する
 */
export interface StyleStroke extends SyntaxLocation {
  /** 拍子記号 */
  until: UntilNext,
  /** アップストロークかどうか */
  up?: boolean,
  /** オフフラグ */
  off?: true
}

/**
 * ストラムスタイルインターフェース
 * 
 * ストラム（コード奏法）を表現する
 * 例：strum(1/16,0.5)
 */
export interface StyleStrum extends SyntaxLocation {
  /** 鳴音遅延幅（デフォルトは無し([0/1])） */
  startUntil: UntilNext,
  /** ストラム幅（ミリ秒で指定する。Tickを弦数で割るため、弦数は関係ない） */
  strumWidthMSec: number,
  /** 適用済みフラグ（システム用） */
  _applied?: true
}

/**
 * 調性オブジェクトインターフェース
 * 
 * 音楽の調性情報を表現する
 * 例：
 * - :key(E major 7th mode 3th)
 * - :key(D melodic major mode 3th)
 */
export interface DegreeObj { // extends SyntaxLocation
  /** 主音 */
  tonic: IKey;
  /** スケール（normal or major, minor, unknown） */
  scale: Scale;
  /** 調性（minor or major） */
  tonal: Tonality;
  /** 調性シフト（例：minor 7th） */
  tonalShift: IShiftMax7;
  /** モードシフト（例：mode 3th） */
  modalShift: IShiftMax7;
  /** スケール総合名 */
  name: string,
  /** 全音階構造 */
  diatonicEvolverValue: DiatonicEvolverValue,

  /** システム情報 */
  sys: {
    /** シフトされたキー配列 */
    shiftedKeyArray: string[];
    /** 7音階配列 */
    note7array: string[];
  }
}

/**
 * ターンスタイルインターフェース
 * 
 * 装飾音を表現する
 */
export interface StyleTurn extends SyntaxLocation {
  /** ターン名 */
  name: string
}

// 全音階列挙型（コメントアウト）
// export enum IDiatonic {
//   'major',
//   'major7',
//   'major6',
//   'minor',
//   'minor7',
//   'minor6',
//   'h.minor',
//   'h.minor7',
//   'm.minor',
//   'm.minor7',
//   'h.major',
//   'h.major7'
// }
