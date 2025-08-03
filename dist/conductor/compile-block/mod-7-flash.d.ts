import { CompileSymbols } from "../interface/compile";
import { Conduct } from "../interface/conduct";
import { SimpleResult } from "../interface/utils.response.interface";
/**
 * ModFlash_dualクラス
 *
 * フラッシュ（@記号）による注釈解析を行うクラス
 * クリック、オフセット、カスタム注釈などの処理を担当する
 * デュアルブロック対応で、各ブロックでの注釈制限も管理する
 */
export declare class ModFlash_dual {
    /**
     * フラッシュ解決メソッド
     *
     * @記号で始まる注釈トークンを解析し、適切な処理を実行する
     * クリック、オフセット、カスタム注釈などの種類を判定して処理を分岐する
     *
     * @param conduct コンダクターオブジェクト
     * @param dualId デュアルブロックID
     * @param regionIndex リージョンインデックス
     * @param fullNoteIndex 全ノートインデックス
     * @param blockNoteIndex ブロック内ノートインデックス
     * @param sym 解析対象のシンボル
     * @returns 処理結果（成功またはエラー）
     */
    static resolve(conduct: Conduct, dualId: number, regionIndex: number, fullNoteIndex: number, blockNoteIndex: number, sym: CompileSymbols): SimpleResult;
}
