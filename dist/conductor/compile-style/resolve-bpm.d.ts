import { Conduct } from "../interface/conduct";
import { SimpleResult } from "../interface/utils.response.interface";
/**
 * BPM解決処理を行うクラス
 */
export declare class ResolveBPM {
    /**
     * BPMを解決する
     * @param conduct コンダクト
     * @returns 処理結果
     */
    static resolve(conduct: Conduct): SimpleResult;
    /**
     * BPMの時間を計算する
     * @param conduct コンダクト
     * @returns 処理結果
     */
    static mathBPMTime(conduct: Conduct): SimpleResult;
}
