import { IKey, UntilNext } from "./utils.interface";
export interface Region {
    /** id */
    id: number;
    /** ブロック名 */
    name: string;
    /** チューニング ※弦数もここで決定 但し全てのBlockで弦数は同数であること（layer処理に関わるため） */
    tuning: IKey[];
    /** ブロックのBPM */
    bpm: number;
    /** until next */
    untilNext: UntilNext;
    addedOffset?: true;
    /** layerの開始位置 */
    startLayerTick: number;
    /** layerの終了位置 */
    endLayerTick: number;
    /** layerの開始位置: offsetでバックシフトする前のtick */
    trueStartLayerTick: number;
    /** layerの終了位置: offsetでバックシフトする前のtick */
    trueEndLayerTick: number;
    start: {
        line: number;
        linePos: number;
    };
    end: {
        line: number;
        linePos: number;
    };
    dualId: number;
    /** 音自体のトータルtick */
    usedTotalTick: number;
    /** offset幅 */
    offsetTickWidth: number;
    flashOffsetLocation?: {
        line: number;
        linePos: number;
        token: string;
    };
    deactive?: boolean;
}
/** Blockの順番を保証したnameリスト */
