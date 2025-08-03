import { CompileSymbols } from "../../interface/compile";
import { Conduct } from "../../interface/conduct";
import { SimpleResult } from "../../interface/utils.response.interface";
/**
 * UnfoldSteppedクラス
 *
 * ステップ展開処理を行うクラス
 * ステップスタイルが適用されたシンボルを複数の個別シンボルに展開する
 * アルペジオや分散和音などの演奏パターンを実現する
 */
export declare class UnfoldStepped {
    /**
     * ステップ解決メソッド
     *
     * ステップスタイルが適用されたシンボルを展開し、個別のシンボルに変換する
     * 各ステップごとにフィンガリング、タイミング、スタイル情報を調整する
     *
     * @param conduct コンダクターオブジェクト
     * @param dualId デュアルブロックID
     * @param symbolsList シンボル配列
     * @returns 処理結果（成功またはエラー）
     */
    static apply(conduct: Conduct, dualId: number, symbolsList: CompileSymbols[]): SimpleResult;
}
