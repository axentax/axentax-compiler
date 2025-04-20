import { ChordProp } from "./dic-chord";
import { MapOpt, Styles } from "./style";
import { Bar, ExtensionViewProp } from "./tab";
import { NumberOrUfd } from "./utils.interface";
/**
 * Type in CompileSymbols.
 */
export declare enum CSymbolType {
    /** unused */
    undefined = "undefined",
    /** e.g. "@compose(...)" */
    flash = "flush",
    /** e.g. |2 */
    note = "note",
    /** e.g. 5/7-9-10-r-10 */
    bullet = "bullet",
    /** e.g. %4/1b */
    degreeName = "degree",
    /** e.g. :styleName */
    style = "style",
    /** e.g. }:styleName(..) */
    blockStyle = "blockStyle",
    /** e.g. @@ */
    regionStart = "regionStart",
    /** e.g. 1/4 140 after @@ */
    regionProp = "regionProp",
    /** e.g. , */
    comma = "comma",
    /** e.g. { */
    openingCurlyBrace = "openingCurlyBrace",
    /** e.g. } */
    closingCurlyBrace = "closingCurlyBrace"
}
/**
 * Compile Symbols
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
    endLine: number;
    /** last position */
    endPos: number;
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
    /** "RegionIndex" that "Dual" should synchronize with. */
    regionRegionForDualConnection: number;
    /** LocationInfoの参照 ※添番の0が本体で、以降styleやregionProp, blockStyleなど設定 */
    locationInfoRefStackUpList?: number[];
    prefixLength?: number;
};
export interface DecidedProp {
    noteStr: string;
    /** view用のつもりだったが、多分未使用 */
    extensionViewProp?: ExtensionViewProp;
    list: string;
    tick: Bar;
    styles: Styles;
    fingering: NumberOrUfd[];
    trueTab?: NumberOrUfd[];
    /** mappedのshift結果。viewで使用する */
    shifted?: {
        shift: number;
        options: MapOpt[];
    }[];
    /** 辞書。使用しているか不明 */
    chordDicRef: ChordProp;
    isArpeggio?: true;
    isBullet?: number;
}
