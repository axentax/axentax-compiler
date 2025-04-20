import { IKey } from './interface/utils.interface';

/**
 * システム設定
 */
export declare const SysSettings: {
    /** デュアル結合子 */
    dualJoiner: string;
    /** デュアル長 */
    dualLength: number;
    /** 四分音符あたりのtick数 */
    basicTick: number;
    /** 四分音符あたりのtick数 * 4 */
    PPS: number;
    /** 開始オフセット */
    startTick: number;
    /** 変動的なBPMの設定で、計算式を間引く間隔 */
    bpmTransitionSpan: number;
    /** 最大UntilNext0 */
    maxUntilNext0: number;
    /** 最大UntilNext1 */
    maxUntilNext1: number;
    /** 最小BPM */
    minBPM: number;
    /** 最大BPM */
    maxBPM: number;
    /** 最大トップフレット */
    maxTopFret: number;
    /** 最大弦数 */
    maxBows: number;
    /** アプローチ最大パーセント */
    maxApproachPercent: number;
    /** 最大ストラム幅ミリ秒 */
    maxStrumWidthMSec: number;
    /** 最大サフィックス拡張長 */
    maxSuffixExtensionLength: number;
    /** ベンド分離tick */
    bendSeparateTick: number;
    /** ベンド最大固定Until分母 */
    bendMaxFixedUntilDenom: number;
    /** 最大マップステップ順序 */
    maxMappedStepOrder: number;
};
/**
 * グローバル変数
 */
export declare const globalVars: {
    /** キー名配列 */
    iKey: IKey[];
    /** 32キー素材 */
    iKey32material: string[];
};
