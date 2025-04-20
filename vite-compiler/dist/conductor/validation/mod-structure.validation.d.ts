import { CSymbolType } from '../interface/compile';
import { SimpleResult } from '../interface/utils.response.interface';

/**
 * スタイル開始の構造検証
 * @param accum - 累積文字列
 * @param currentType - 現在のシンボルタイプ
 * @param beforeType - 前のシンボルタイプ
 * @param commitLine - 行番号
 * @param commitPos - 行内位置
 * @returns 検証結果
 */
export declare function styleStart(accum: string, currentType: CSymbolType, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult;
/**
 * リージョン開始の構造検証
 * @param accum - 累積文字列
 * @param beforeType - 前のシンボルタイプ
 * @param commitLine - 行番号
 * @param commitPos - 行内位置
 * @returns 検証結果
 */
export declare function regionStart(accum: string, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult;
/**
 * コロン開始の構造検証
 * @param accum - 累積文字列
 * @param beforeType - 前のシンボルタイプ
 * @param commitLine - 行番号
 * @param commitPos - 行内位置
 * @returns 検証結果
 */
export declare function colonOfStart(accum: string, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult;
