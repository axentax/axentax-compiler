import { SimpleResult } from '../interface/utils.response.interface';
import { CompileSymbols } from '../interface/compile';
import { Conduct } from '../interface/conduct';

/**
 * ブロックコンパイラークラス
 *
 * パースされたシンボルをブロック構造に変換し、
 * プレフィックス、スタイル、ノートの各段階処理を管理する
 *
 * 処理の流れ：
 * 1. ブロックオブジェクトの初期化
 * 2. プレフィックススタイルの解決
 * 3. スタイルの初期化
 * 4. ノートの初期化
 *
 * このクラスは、記譜法の構文解析結果を実行可能な音楽データ構造に
 * 変換する中心的な役割を担う
 */
export declare class BlockCompiler {
    /**
     * シンボルリストをブロック構造にコンパイル
     *
     * 記譜法のシンボルリストを受け取り、実行可能なブロック構造に変換する
     * 各段階でエラーが発生した場合は即座に処理を中断してエラーを返す
     *
     * 処理内容：
     * - ブロックオブジェクトの初期化（リージョン作成）
     * - プレフィックススタイルの解決（@sob、beforeStopなど）
     * - スタイルの初期化（演奏表現の設定）
     * - ノートの初期化（実際の音符データの作成）
     *
     * @param conduct Conductオブジェクト
     * @param symbolsDualLists パース済みシンボルのリスト（dualチャンネル別）
     * @returns コンパイル結果
     */
    static compile(conduct: Conduct, symbolsDualLists: CompileSymbols[][]): SimpleResult;
}
