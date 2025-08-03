import { ChordProp } from "./dic-chord";
import { MapOpt, Styles } from "./style";
import { Bar, ExtensionViewProp } from "./tab";
import { NumberOrUfd } from "./utils.interface";

/**
 * コンパイルシンボルのタイプ
 */
export enum CSymbolType {
  /** unused */
  undefined = 'undefined',
  /** e.g. "@compose(...)" */
  flash = 'flush',
  /** e.g. |2 */
  note = 'note',
  /** e.g. 5/7-9-10-r-10 */
  bullet = 'bullet',
  /** e.g. %4/1b */
  degreeName = 'degree',
  /** e.g. :styleName */
  style = 'style',
  /** e.g. }:styleName(..) */
  blockStyle = 'blockStyle',
  /** e.g. @@ */
  regionStart = 'regionStart',
  /** e.g. 1/4 140 after @@ */
  regionProp = 'regionProp',
  /** e.g. , */
  comma = 'comma',
  /** e.g. { */
  openingCurlyBrace = 'openingCurlyBrace',
  /** e.g. } */
  closingCurlyBrace = 'closingCurlyBrace',
}

/**
 * コンパイルシンボル
 */
export type CompileSymbols = {
  /** {} Hierarchy depth */
  curlyLevel: number;
  /** Type */
  type: CSymbolType;
  /** line number */
  line: number;
  /** line position */
  linePos: number;
  /** type with type of child symbols */
  typesStyle: CSymbolType[];
  /** last line number */
  endLine: number,
  /** last position */
  endPos: number,
  /** syntax */
  token: string;
  /** syntax of child symbols */
  styles: string[];
  /** line number of child symbols */
  linesOfStyle: number[];
  /** line position of child symbols */
  linePosOfStyle: number[];
  /** end of measure (naked comma) */
  endOfMeasure?: true;
  /** decided property for notes */
  decidedProp: DecidedProp;
  /** "Dual"が同期すべき"RegionIndex" */
  regionRegionForDualConnection: number,

  /** LocationInfoの参照 */
  locationInfoRefStackUpList?: number[],

  prefixLength?: number,
}

/**
 * 決定済みプロパティ
 */
export interface DecidedProp {
  /** ノート文字列 */
  noteStr: string;
  /** 拡張ビュープロパティ */
  extensionViewProp?: ExtensionViewProp;
  /** リスト */
  list: string;
  /** ティック */
  tick: Bar;
  /** スタイル */
  styles: Styles;
  /** フィンガリング */
  fingering: NumberOrUfd[];
  /** 真のタブ */
  trueTab?: NumberOrUfd[];
  /** mappedのshift結果 */
  shifted?: { shift: number, options: MapOpt[] }[];
  /** コード辞書参照 */
  chordDicRef: ChordProp;
  /** アルペジオフラグ */
  isArpeggio?: true;
  /** バレットグループ番号 */
  isBullet?: number;
}
