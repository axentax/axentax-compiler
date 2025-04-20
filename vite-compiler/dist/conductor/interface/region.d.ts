import { IKey, UntilNext } from './utils.interface';

/**
 * リージョン情報
 */
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
    /** 開始位置 */
    start: {
        line: number;
        linePos: number;
    };
    /** 終了位置 */
    end: {
        line: number;
        linePos: number;
    };
    /** デュアルID */
    dualId: number;
    /** 音自体のトータルtick */
    usedTotalTick: number;
    /** offset幅 */
    offsetTickWidth: number;
    /** フラッシュオフセット位置 */
    flashOffsetLocation?: {
        /** 行番号 */
        line: number;
        /** 行内位置 */
        linePos: number;
        /** トークン */
        token: string;
    };
    /** 非アクティブフラグ */
    deactive?: boolean;
}
