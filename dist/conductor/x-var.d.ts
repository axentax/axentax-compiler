import { IKey } from "./interface/utils.interface";
export declare const SysSettings: {
    /** dual joiner */
    dualJoiner: string;
    /** dual length */
    dualLength: number;
    /** ticks per quarter note */
    basicTick: number;
    /** ticks per quarter note * 4 */
    PPS: number;
    /** start offset */
    startTick: number;
    /** 変動的なBPMの設定で、計算式を間引く間隔 */
    bpmTransitionSpan: number;
    maxUntilNext0: number;
    maxUntilNext1: number;
    minBPM: number;
    maxBPM: number;
    maxTopFret: number;
    maxBows: number;
    /** approach max percent */
    maxApproachPercent: number;
    /** default strum width msec */
    /**  */
    maxStrumWidthMSec: number;
    /** */
    maxSuffixExtensionLength: number;
    /** */
    bendSeparateTick: number;
    /** */
    bendMaxFixedUntilDenom: number;
    /** */
    maxMappedStepOrder: number;
};
export declare const globalVars: {
    iKey: IKey[];
    iKey32material: string[];
};
