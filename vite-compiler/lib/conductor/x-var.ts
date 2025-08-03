import { IKey } from "./interface/utils.interface";

/**
 * システム設定
 */
export const SysSettings = {
  /** デュアル結合子 */
  dualJoiner: '>>',
  /** デュアル長 */
  dualLength: 3,
  /** 四分音符あたりのtick数 */
  basicTick: 480,
  /** 四分音符あたりのtick数 * 4 */
  PPS: 480 * 4,
  /** 開始オフセット */
  startTick: 480,
  /** 変動的なBPMの設定で、計算式を間引く間隔 */
  bpmTransitionSpan: 2,
  /** 最大UntilNext0 */
  maxUntilNext0: 128,
  /** 最大UntilNext1 */
  maxUntilNext1: 128,
  /** 最小BPM */
  minBPM: 1,
  /** 最大BPM */
  maxBPM: 1000,
  /** 最大トップフレット */
  maxTopFret: 24,
  /** 最大弦数 */
  maxBows: 9,
  /** アプローチ最大パーセント */
  maxApproachPercent: 500,
  /** 最大ストラム幅ミリ秒 */
  maxStrumWidthMSec: 100,
  /** 最大サフィックス拡張長 */
  maxSuffixExtensionLength: 16,
  /** ベンド分離tick */
  bendSeparateTick: 10,
  /** ベンド最大固定Until分母 */
  bendMaxFixedUntilDenom: 128,
  /** 最大マップステップ順序 */
  maxMappedStepOrder: 1000,
}

/**
 * グローバル変数
 */
export const globalVars = {
  /** キー名配列 */
  iKey: [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ] as IKey[],
  /** 32キー素材 */
  iKey32material: [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ],

};

