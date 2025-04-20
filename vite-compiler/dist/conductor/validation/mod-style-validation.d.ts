import { ErrorBase, IResult } from '../interface/utils.response.interface';
import { IKey, NumberOrUfd, UntilNext } from '../interface/utils.interface';
import { MapExpand, StyleApproach, StyleBPM, StyleBendX, StyleDelay, StyleScaleX, StyleSlide, StyleStaccato, StyleStep, StyleStroke, StyleStrum, DegreeObj } from '../interface/style';
import { CSymbolType } from '../interface/compile';
import { Conduct } from '../interface/conduct';

/**
 * アプローチ奏法の検証と解析
 * @param token - 処理対象トークン
 * @param line - 行番号
 * @param linePos - 行内位置
 * @param tuning - チューニング設定
 * @returns 解析結果
 */
export declare function approach(token: string, line: number, linePos: number, tuning: string[]): IResult<StyleApproach, ErrorBase>;
/**
 * ベンドエフェクトの検証と解析
 * @param bendStr - ベンド設定文字列
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 解析結果
 */
export declare function bendX(bendStr: string, line: number, linePos: number): IResult<StyleBendX[], ErrorBase>;
/**
 * transition bpm
 * local: +30, -30
 * transition: 30..50, ..120, ..+30, ..-30
 */
export declare function transitionBPM(bpmStr: string, type: CSymbolType, line: number, linePos: number): IResult<StyleBPM, ErrorBase>;
/**
 * BPM
 */
export declare function simpleBPM(bpm: any, line: number, linePos: number): IResult<number, ErrorBase>;
/**
 * strum
 */
export declare function delay(delayStr: string, line: number, linePos: number): IResult<StyleDelay, ErrorBase>;
/**
 * degree(key and scale)
 * e.g. G# harmonic minor 5th
 */
export declare function degree(keyVal: string, line: number, linePos: number): IResult<DegreeObj, ErrorBase>;
/**
 * map
 */
export declare function mapped(mapStr: string, line: number, linePos: number): IResult<MapExpand[], ErrorBase>;
/**
 * tuning
 */
export declare function tuning(tuningStr: string, line: number, linePos: number): IResult<IKey[], ErrorBase>;
/**
 * until next
 */
export declare function untilNext(untilStr: string, line: number, linePos: number): IResult<UntilNext, ErrorBase>;
/**
 * staccato
 */
export declare function staccato(staccatoStr: string, line: number, linePos: number): IResult<StyleStaccato, ErrorBase>;
/**
 * stepped
 * @param tuning
 * @param stepStr
 * @param line
 * @param linePos
 */
export declare function createStepPlan(tuning: string[], stepStr: string, line: number, linePos: number): IResult<{
    sym: string;
    startLine: number;
    startPos: number;
    endPos: number;
}[], ErrorBase>;
/**
 * step
 */
export declare function step(tuning: string[], trueStr: string, truePos: number, stepStr: string, line: number, linePos: number): IResult<StyleStep, ErrorBase>;
/**
 * strum
 * /|||2 or :strum(10) ※数値はmsec指定
 */
export declare function strum(conduct: Conduct, strumStr: string, line: number, linePos: number): IResult<StyleStrum, ErrorBase>;
/**
 * pos(positions)
 */
/**
 * stroke
 */
export declare function stroke(token: string, line: number, linePos: number): IResult<StyleStroke, ErrorBase>;
/**
 * scale
 */
export declare function scale(scaleStr: string, line: number, linePos: number): IResult<StyleScaleX, ErrorBase>;
/**
 * slide
 */
export declare function slide(token: string, line: number, linePos: number, isContinue?: boolean): IResult<StyleSlide, ErrorBase>;
/**
 * velocities
 */
export declare function velocities(conduct: Conduct, token: string, tuning: string[], line: number, linePos: number): IResult<NumberOrUfd[], ErrorBase>;
/**
 * velocity
 */
export declare function velocity(velStr: string, line: number, linePos: number): IResult<number, ErrorBase>;
