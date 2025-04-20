import { IKey } from "../interface/utils.interface";
/**
 * XUtils
 */
/**
 * 小数の誤差を回避して足し算する
 * @param a
 * @param b
 * @returns
 */
export declare function decimalizeAdd(a: number, b: number): number;
/**
 * 小数の誤差を回避して掛け算する
 * @param a
 * @param b
 * @returns
 */
export declare function decimalizeMul(a: number, b: number): number;
/**
 * 小数の誤差を回避して割り算する
 * @param a
 * @param b
 * @returns
 */
export declare function decimalizeDiv(a: number, b: number): number;
/**
 * 小数の誤差を回避して引き算する
 * @param a
 * @param b
 * @returns
 */
export declare function decimalizeSub(a: number, b: number): number;
/**
 * e.g. token(  A   C  ) => token(A C)
 */
export declare function innerTrimerForStyleKey(token: string): string;
/**
 * Convert the key '*b' to '*#'
 * @param key
 * @returns
 */
export declare function resolveNonRegularKey2str(token: string): IKey;
/**
 * Convert the key. e.g. '*b#' to '*'
 * @param key
 * @returns
 */
export declare function resolveNonRegularKey3str(token: string): IKey;
/**
 * search next key
 * @param sym
 */
export declare function searchNextKey(sym: IKey): IKey;
/**
 * search prev key
 * @param sym
 */
export declare function searchPrevKey(sym: IKey, shift?: number): IKey;
