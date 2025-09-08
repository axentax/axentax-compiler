import { Mixes } from '../interface/conduct';
import { StyleBendX } from '../interface/style';
import { Tick } from '../interface/tab';
import { SimpleResult } from '../interface/utils.response.interface';

/**
 * ベンドX解決処理を行うクラス
 */
export declare class ResolveBendX {
    /**
     * ベンドX情報を解決する
     * @param mixes ミックス情報
     * @returns 処理結果
     */
    static resolve(mixes: Mixes): SimpleResult;
}
/**
 * ビュー用ベンドデータを生成する
 * @param bar バー情報
 * @param styleBendXList ベンドXスタイルリスト
 * @returns ベンドチャンネルリスト
 */
export declare function bdView(bar: Tick, styleBendXList: StyleBendX[]): import('../interface/bend').BendMidiSetter[];
