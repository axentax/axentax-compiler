import { Conduct, Marks, Mixes } from '../interface/conduct';
import { StyleSlide } from '../interface/style';
import { TabObj } from '../interface/tab';
import { SimpleResult } from '../interface/utils.response.interface';

/**
 * スライド解決処理を行うクラス
 */
export declare class ResolveSlide {
    /**
     * スライド情報を解決する
     * @param conduct 演奏情報
     * @param mixes ミックス情報
     * @returns 処理結果
     */
    static resolve(conduct: Conduct, mixes: Mixes): SimpleResult;
}
/**
 * スライドのビュー用データを生成する
 * @param conduct 演奏情報
 * @param marks マーク情報
 * @param to TabObj
 * @param slide スライドスタイル
 * @returns ビュー用データまたはnull
 */
export declare function toView(conduct: Conduct, marks: Marks, to: TabObj, slide: StyleSlide): TabObj[] | null;
