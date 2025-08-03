import { UntilNext } from "../interface/utils.interface";
import { SysSettings } from "../x-var";
import * as XMathUtils from "./x-math-utils";

/**
 * タイミング計算ユーティリティ
 * 
 * BPM、ティック、時間の相互変換に関するユーティリティ関数を提供する
 * 音楽のタイミング計算や拍子記号の処理に使用される
 * 
 * このモジュールは、音楽記譜法のコンパイル処理において、
 * 音符の長さ計算、タイミング調整、拍子記号の処理などに使用される
 */

/**
 * BPMとティックから鳴音のミリ秒を算出
 * 
 * 指定されたBPMとティック数から、実際の音の長さ（ミリ秒）を計算する
 * 音楽理論に基づく正確な時間計算を行う
 * 
 * 計算式：
 * ミリ秒 = (60000 / BPM) / TicksPerBeat × tick
 * 
 * 用途：
 * - 音符の実際の演奏時間の計算
 * - MIDI生成時のタイミング調整
 * - 演奏表現のタイミング制御
 * 
 * @param bpm テンポ（BPM、1分間の拍数）
 * @param tick ティック数（最小時間単位）
 * @returns ミリ秒
 * 
 * @example
 * getSoundLength(120, 480) // 1000 (1秒)
 * getSoundLength(60, 480)  // 2000 (2秒)
 */
export function getSoundLength(bpm: number, tick: number) {
  // (60000 / BPM) / TicksPerBeat
  return ((60000 / bpm) / SysSettings.PPS) * tick;
}

/**
 * BPMとティックから鳴音の秒を算出
 * 
 * 指定されたBPMとティック数から、実際の音の長さ（秒）を計算する
 * getSoundLengthと同様の計算だが、結果を秒単位で返す
 * 
 * 計算式：
 * 秒 = (60 / BPM) / TicksPerBeat × ticks
 * 
 * 用途：
 * - 音符の長さの秒単位での計算
 * - 演奏時間の予測
 * - タイミング調整の基準値計算
 * 
 * @param bpm テンポ（BPM、1分間の拍数）
 * @param ticks ティック数（最小時間単位）
 * @returns 秒
 * 
 * @example
 * calculateTimeForTicks(120, 480) // 1.0 (1秒)
 * calculateTimeForTicks(60, 480)  // 2.0 (2秒)
 */
export function calculateTimeForTicks(bpm: number, ticks: number): number {
  const secondsPerTick = (60 / bpm) * (1 / SysSettings.PPS);
  return ticks * secondsPerTick;
}

/**
 * 指定位置の指定秒数のティック幅を取得（試験中）
 * 
 * 指定された時間（ミリ秒）をティック数に変換する
 * 逆算処理で、時間からティック数を求める
 * 
 * 計算式：
 * ティック数 = (BPM × PPS / 60) × (ミリ秒 / 1000)
 * 
 * 用途：
 * - 時間指定からティック数への変換
 * - 演奏表現のタイミング制御
 * - エフェクトのタイミング調整
 * 
 * @param bpm テンポ（BPM、1分間の拍数）
 * @param milliseconds ミリ秒
 * @returns ティック数
 * 
 * @example
 * getTicksByTime(120, 1000) // 480 (1秒分のティック数)
 * getTicksByTime(60, 1000)  // 240 (1秒分のティック数)
 */
export function getTicksByTime(bpm: number, milliseconds: number): number {

  const ppq = SysSettings.PPS;

  // 1分あたりのティック数を計算
  const ticksPerMinute = ppq * bpm;

  // 1秒あたりのティック数を計算
  const ticksPerSecond = ticksPerMinute / 60;

  // 指定されたミリ秒あたりのティック数を計算
  const ticksForMilliseconds = ticksPerSecond * (milliseconds / 1000);

  return ticksForMilliseconds;
}

/**
 * untilNextをティック数に変換
 * 
 * 拍子記号（分子/分母）をティック数に変換する
 * 音楽理論に基づいて、拍子記号から実際のティック数を計算する
 * 
 * 計算式：
 * ティック数 = (PPS / 分母) × 分子
 * 
 * 用途：
 * - 拍子記号から音符の長さへの変換
 * - 小節の長さ計算
 * - リズムパターンの時間計算
 * 
 * @param untilNext 拍子記号 [分子, 分母]
 * @returns ティック数
 * 
 * @example
 * untilNextToTick([1, 4]) // 480 (4分音符)
 * untilNextToTick([1, 2]) // 960 (2分音符)
 * untilNextToTick([3, 4]) // 1440 (付点2分音符)
 */
export function untilNextToTick(untilNext: UntilNext): number {
  return (SysSettings.PPS / untilNext[1]) * untilNext[0];
  // const step1 = XUtils.decimalizeDiv(SysSettings.PPS, untilNext[1]);
  // console.log('SysSettings.PPS', SysSettings.PPS)
  // console.log('untilNext[1]', untilNext[1])
  // const step2 = XUtils.decimalizeMul(step1, untilNext[0]);
  // return step2;
}

/** 
 * 分数を約分する
 * 
 * 拍子記号の分数を最大公約数で約分して、最も簡単な形にする
 * 例：[4, 8] → [1, 2]、[6, 4] → [3, 2]
 * 
 * 用途：
 * - 拍子記号の正規化
 * - 分数の簡略化
 * - 計算精度の向上
 * 
 * @param until 約分対象の分数 [分子, 分母]
 * @returns 約分された分数 [分子, 分母]
 * 
 * @example
 * reduceUntilNextArrByGCD([4, 8]) // [1, 2]
 * reduceUntilNextArrByGCD([6, 4]) // [3, 2]
 * reduceUntilNextArrByGCD([3, 6]) // [1, 2]
 */
export function reduceUntilNextArrByGCD(until: [number, number]): [number, number] {
  const gcd = XMathUtils.greatestCommonDivisor(until[0], until[1]);
  const untilNext: [number, number] = [until[0] / gcd, until[1] / gcd]
  return untilNext;
}
