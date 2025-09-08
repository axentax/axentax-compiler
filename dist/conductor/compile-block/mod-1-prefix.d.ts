import { CompileSymbols } from '../interface/compile';
import { SimpleResult } from '../interface/utils.response.interface';

/**
 * ModPrefixクラス
 *
 * 音楽記譜法のプレフィックス解析を行うクラス
 * アプローチ、ストローク、ストラム、コンティニューなどの演奏指示を解析する
 * シンボルのプレフィックス部分を解析し、適切なスタイル情報に変換する
 */
export declare class ModPrefix {
    /**
     * プレフィックス解決メソッド
     *
     * シンボル配列の各要素に対してプレフィックス解析を実行する
     * デュアルブロック対応で、各ブロック内のシンボルを順次処理する
     *
     * @param symbolsDualLists デュアルブロック対応のシンボル配列
     * @returns 処理結果（成功またはエラー）
     */
    static resolve(symbolsDualLists: CompileSymbols[][]): SimpleResult;
}
