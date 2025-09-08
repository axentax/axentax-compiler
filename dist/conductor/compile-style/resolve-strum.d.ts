import { Conduct, Mixes } from '../interface/conduct';
import { SimpleResult } from '../interface/utils.response.interface';

/**
 * ストラムエフェクトの解決クラス
 */
export declare class ResolveStrum {
    /**
     * ストラムエフェクトを解決する
     * @param conduct - コンダクトオブジェクト
     * @param mixes - ミックスオブジェクト
     * @returns 処理結果
     */
    static resolve(conduct: Conduct, mixes: Mixes): SimpleResult;
}
