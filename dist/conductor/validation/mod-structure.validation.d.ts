import { CSymbolType } from "../interface/compile";
import { SimpleResult } from "../interface/utils.response.interface";
/**
 *
 * @param accum
 * @param currentType
 * @param beforeType
 * @param commitLine
 * @param commitPos
 * @returns
 */
export declare function styleStart(accum: string, currentType: CSymbolType, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult;
/**
 *
 * @param accum
 * @param beforeType
 * @param commitLine
 * @param commitPos
 * @returns
 */
export declare function regionStart(accum: string, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult;
/**
 *
 * @param accum
 * @param beforeType
 * @param commitLine
 * @param commitPos
 * @returns
 */
export declare function colonOfStart(accum: string, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult;
