/**
 * XArrayUtils
 */
/**
 * 配列にpushする。配列がない場合は作成する
 * @param object オブジェクト
 * @param arrName object内にある配列オブジェクト
 * @param val 挿入値
 */
export declare function orPush<T, V>(object: T, arrName: keyof T, val: V): void;
/**
 * 特定範囲のnumberの配列作成
 * @param start
 * @param end
 * @returns
 */
export declare function createNumberBetweenArray(start: number, end: number): number[];
/**
 * 指定indexが、指定配列範囲の超過を折り返しで解決したindexでの指定配列の値を取得
 * @param numberArray
 * @param index
 * @returns
 */
export declare function getReboundIndexValue<T>(numberArray: T[], index: number): T;
/**
 * [未使用]指定indexが、指定配列範囲の超過を折り返しで解決したindexを取得
 * ※値を返すものではないので注意
 * @param numberArray
 * @param index
 * @returns
 */
export declare function getReboundResolvedIndex<T>(numberArray: T[], index: number): number;
/**
 * 配列arrのn番目のvのインデックスを返す
 * 0番目はないため、nには最低1を指定
 * @param arr
 * @param n
 * @returns n番目のvのインデックス
 */
export declare function findNthOneIndex<T>(arr: T[], n: number, v: T): number;
/**
 * 配列を、指定インデックスから始まるようにシフトする
 * @param array 配列
 * @param target 指定インデックス
 * @returns
 */
export declare function shiftArrayAsIndex<T>(array: T[], index: number): T[];
/**
 * 配列を、指定の値から始まるようにシフトする
 * @param array 配列
 * @param target 対象値
 * @returns
 */
export declare function shiftArray<T>(array: T[], target: T): T[];
