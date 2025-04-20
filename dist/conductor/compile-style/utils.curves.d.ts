import { Bend } from "../interface/bend";
export declare function normalizeBandVal(bendValue: number): number;
/**
   * 正弦波
   * @param startTick
   * @param endTick
   * @param startBend
   * @param landingBend
   * @param arc false: 片面, true: 両面
   * @returns
   */
export declare function makeHrefBend(resultArrayContainer: Bend[], startTick: number, endTick: number, startBend: number, landingBend: number, arc?: boolean): Bend[];
/**
 * アステロイド (曲線)
 * @param resultArrayContainer
 * @param startTick
 * @param endTick
 * @param startBend
 * @param landingBend
 * @param arc false: 片面, true: 両面
 * @returns
 */
export declare function makeHrefBendAst(resultArrayContainer: Bend[], startTick: number, endTick: number, startBend: number, landingBend: number, arc?: boolean): void;
