import { UntilNext } from "../interface/utils.interface";
/**
 * BPMとTickの鳴音のミリ秒を算出
 * @param bpm
 * @param tick
 * @returns ミリ秒
 */
export declare function getSoundLength(bpm: number, tick: number): number;
export declare function calculateTimeForTicks(bpm: number, ticks: number): number;
/**
 * 指定位置の指定秒数のtick幅を取得 -- 試験中 --
 * @param bpm
 * @param milliseconds
 * @returns
 */
export declare function getTicksByTime(bpm: number, milliseconds: number): number;
/**
 * untilNext to tick
 */
export declare function untilNextToTick(untilNext: UntilNext): number;
/**
 * simplify a fraction
 */
export declare function reduceUntilNextArrByGCD(until: [number, number]): [number, number];
