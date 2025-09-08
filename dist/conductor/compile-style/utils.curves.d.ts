import { Bend } from '../interface/bend';

/**
 * ベンド値をMIDI範囲に正規化する
 * @param bendValue - ベンド値
 * @returns 正規化された値
 */
export declare function normalizeBandVal(bendValue: number): number;
/**
 * 正弦波ベンドカーブを生成する
 * @param resultArrayContainer - 結果を格納する配列
 * @param startTick - 開始ティック
 * @param endTick - 終了ティック
 * @param startBend - 開始ベンド値
 * @param landingBend - 終了ベンド値
 * @param arc - false: 片面, true: 両面
 * @returns ベンドデータ配列
 */
export declare function makeHrefBend(resultArrayContainer: Bend[], startTick: number, endTick: number, startBend: number, landingBend: number, arc?: boolean): Bend[];
/**
 * アステロイド曲線ベンドを生成する
 * @param resultArrayContainer - 結果を格納する配列
 * @param startTick - 開始ティック
 * @param endTick - 終了ティック
 * @param startBend - 開始ベンド値
 * @param landingBend - 終了ベンド値
 * @param arc - false: 片面, true: 両面
 * @returns ベンドデータ配列
 */
export declare function makeHrefBendAst(resultArrayContainer: Bend[], startTick: number, endTick: number, startBend: number, landingBend: number, arc?: boolean): void;
