import { Mixes } from "../interface/conduct";
import { SimpleResult } from "../interface/utils.response.interface";
export declare class ResolveMuteNoise {
    /**
     * ミュートノイズ処理を解決する
     * @param mixes ミックス情報
     * @returns 処理結果
     */
    static resolve(mixes: Mixes): SimpleResult;
}
