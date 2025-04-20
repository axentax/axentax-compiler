import { Warning } from "./utils.response.interface";
import { Region } from "./region";
import { Settings } from "./settings";
import { ChordDicMap } from "./dic-chord";
import { Flash } from "./flash";
import { BPMPos } from "./bpm";
import { StyleMapGroupList, StyleObjectBank } from "./style";
import { ClickPoint } from "./click";
import { TabObj } from "./tab";
import { BendMidiSetter } from "./bend";
import { MapSeed } from "./dic-map-seed";
import { StepInfo } from "../compile-view/view-model-builder";
import { CSymbolType } from "./compile";
import { AllowAnnotation } from "../conductor";
export interface Marks {
    /** mapping group info */
    styleMappedGroupList: StyleMapGroupList[];
    /** tick記録 ## そのnote位置でのtick値を確認するための変数 ※resolve-clickで使用中 */
    fullNoteIndexWithTick: number[];
    /** bend group info */
    bendGroupNumberList: number[];
    /** used band range */
    usedBendRange: {
        start: number;
        end: number;
    }[];
}
export interface Mixes {
    dualId: number;
    /** block list */
    regionList: Region[];
    flatTOList: TabObj[];
    bendBank: {
        bendNormalList: BendMidiSetter[];
        bendChannelList: BendMidiSetter[];
    };
    marks: Marks;
}
/**
 * conductor who oversees the whole.
 */
export interface Conduct {
    /** precision: Backing is true, false when building solo, and only tab is specified for note. */
    /** user or composer input syntax */
    syntax: string;
    /** settings */
    settings: Settings;
    /** block list length */
    regionLength: number;
    /** tabObjにもBPMがあるが、こちらはmidiに渡す用のもの */
    bpmPosList: BPMPos[];
    /**  */
    clickPointList: ClickPoint[];
    /** flash: annotation symbol bank */
    flash: Flash;
    /** warring message object list */
    warnings: Warning[];
    /** for dual */
    mixesList: Mixes[];
    dic: {
        /** chord dictionary */
        chord: ChordDicMap;
        /** tuningをキーにして、指板マップを作成する */
        /** mappedで使用する */
        mapSeed: MapSeed;
    };
    /** バリデーションのみの場合 */
    notStyleCompile?: true;
    /** midiが不要の場合 */
    notMidiCompile?: true;
    extensionInfo: {
        stepInfoList: StepInfo[];
    };
    /** viewでカーソル位置からsymbolを判別するためのリスト */
    locationInfoList: LocationInfo[];
    /** viewでカーソル位置から1{}囲いの階層での適用styleを判別するためのリスト */
    braceLocationInfoList: BraceLocationInfo[];
    /** styleコンテキスト蓄積 ※使用時は基本クローン作成 */
    styleObjectBank: StyleObjectBank;
    /** 許可するその他のアノテーション */
    allowAnnotations: AllowAnnotation[];
}
/**
 * viewで使用する位置情報
 *
 * 検知した場合にやりたいこと
 *   regionStart - block情報（基本regionPropと同じ）
 *   regionProp - 右記それぞれ -> bpm詳細, until詳細, チューニング
 *   note - [TabObjにリンク] tab/chord/styleアイコン 表示
 *   degree - [TabObjにリンク] noteと同等
 *   bullet - [TabObjにリンク:location再検索] パースしたbulletからのTabObj全てにリンク - 表示はnoteと同等
 *   blockStyle - リンクなし、情報は conduct.styleObjectBank[cacheKey] で取る
 *   flash - 使い方表示のみ
 *
 * // LocationInfo
 * 0 [ 10, 1 ] [ 10, 3 ] [ '@@' ]
 * 1 [ 10, 4 ] [ 10, 7 ] [ '140' ]
 * 2 [ 10, 8 ] [ 10, 11 ] [ '1/4' ]
 * 3 [ 12, 5 ] [ 12, 12 ] [ '4/20-24' ]
 * 4 [ 12, 13 ] [ 12, 14 ] [ 'D' ]
 * 5 [ 12, 14 ] [ 12, 23 ] [ 'step(12)' ]
 * 6 [ 12, 24 ] [ 12, 26 ] [ '1' ]
 * 7 [ 13, 4 ] [ 13, 14 ] [ 'map(1, 2)' ]
 * 8 [ 13, 14 ] [ 13, 16 ] [ 'd' ]

 * // TabObj
 * [ 'to.location', '||20', [ 3 ] ] 例: ここでbulletの場合 [ 3 ] が2つ(mapの結果で4つだが)あるので、全てリスト化してさらに位置情報とマッチするもの抜粋してviewに反映する
 * [ 'to.location', '||24', [ 3 ] ]
 * [ 'to.location', 'D', [ 4, 5 ] ] 例: LocationInfo[4]と[5]はこれを見てnote情報を得る。styleは
 * [ 'to.location', 'D', undefined ]
 * [ 'to.location', 'C', [ 6 ] ]
 * [ 'to.location', '||20', [ 3 ] ]
 * [ 'to.location', '||24', [ 3 ] ]
 * [ 'to.location', 'D', [ 4, 5 ] ]
 * [ 'to.location', 'D', undefined ]
 * [ 'to.location', 'C', [ 6 ] ]
 *
 *
 * tabObjIndexesには TabObjのインデックス設定
 *
 *
 */
export interface LocationInfo {
    line: number;
    linePos: number;
    endLine: number;
    endPos: number;
    type: CSymbolType;
    regionId: number;
    dualId: number;
    /**
     * TabObj作成時()に設定 ※配列として使うのはbulletだけ 配列(複数設定)の場合、view内では再検索する
     * ↓ 多分必要ない
     */
    tabObjIndexes: number[];
    sym: string;
}
/**
 * {}囲いの階層情報
 */
export interface BraceLocationInfo {
    id: number;
    regionId: number;
    dualId: number;
    upperBlock: number[];
    line: number;
    linePos: number;
    /** styleの宣言末端までを{}の範囲内として適用するline */
    endLine: number;
    /** styleの宣言末端までを{}の範囲内として適用するpos */
    endPos: number;
    /** styleの宣言末端までを{}の範囲内とするため、実際の{}括弧自体の終了を一応保持する（20240914では未使用） */
    trueBraceEndLine: number;
    /** styleの宣言末端までを{}の範囲内とするため、実際の{}括弧自体の終了を一応保持する（20240914では未使用） */
    trueBraceEndPos: number;
    styles: string[];
    linesOfStyle: number[];
    linePosOfStyle: number[];
}
