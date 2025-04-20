import { Conduct, Marks, Mixes } from "../interface/conduct";
import { StyleApproach } from "../interface/style";
import { TabObj } from "../interface/tab";
import { SimpleResult } from "../interface/utils.response.interface";
/** 弦毎のスライド情報 */
type SlideInfo = {
    /** 開始点解放弦フラグ */
    isOpenBowByStart: boolean;
    /** 着地点解放弦フラグ */
    isOpenBowByLanding: boolean;
    /** 対象弦 */
    bowIndex: number;
    /** 開始フレット */
    startFret: number;
    /** スライド終了フレット(着地点含む) */
    landingFret: number;
    /** 移動幅 */
    slideWidth: number;
    /** 移動方向 */
    direction: -1 | 0 | 1;
};
export declare class ResolveApproach {
    static resolve(conduct: Conduct, mixes: Mixes): SimpleResult;
}
export declare function inView(conduct: Conduct, marks: Marks, to: TabObj, slide: StyleApproach, toList?: TabObj[]): TabObj[] | null;
/**
 * スライド対象弦と移動量の算出
 */
export declare function createSlideInfo(start: (number | undefined)[], landing: (number | undefined)[]): SlideInfo[];
export {};
