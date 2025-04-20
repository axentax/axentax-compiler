import { Mixes } from '../interface/conduct';
import { SimpleResult } from '../interface/utils.response.interface';

/**
 * レガート解決処理を行うクラス
 */
export declare class ResolveLegato {
    /**
     * レガートスタイルを解決する
     * @param mixes ミックス情報
     * @returns 処理結果
     */
    static resolve(mixes: Mixes): SimpleResult;
}
