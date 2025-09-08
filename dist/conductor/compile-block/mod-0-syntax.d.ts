import { CompileSymbols } from '../interface/compile';
import { Conduct } from '../interface/conduct';
import { ErrorBase, IResult } from '../interface/utils.response.interface';

/**
 * ModSyntaxクラス
 *
 * 音楽記譜法の構文解析を行うクラス
 * 文字列をトークン化し、シンボル配列に変換する
 * 括弧の階層管理、エラー検出、位置情報の記録を行う
 *
 * 処理の流れ：
 * 1. 文字列の逐次読み取りとトークン蓄積
 * 2. 特殊文字（括弧、記号）の検出と処理
 * 3. 蓄積されたトークンのシンボルタイプ判定
 * 4. エラー検出と位置情報の記録
 * 5. デュアルブロック対応の処理
 */
export declare class ModSyntax {
    /**
     * 構文解析メソッド
     *
     * 音楽記譜法の文字列を解析し、コンパイル用のシンボル配列を生成する
     * 括弧の対応、エラー検出、位置情報の記録を行う
     *
     * 解析対象の記譜要素：
     * - リージョン開始（@@）：新しい音楽ブロックの開始
     * - スタイル指定（:記号）：演奏表現の指定
     * - ノート記譜：コード、度数名、タブ譜
     * - バレット記譜：分数形式のタブ譜
     * - フラッシュ注釈（@記号）：メタ情報の指定
     * - 括弧処理：階層構造の管理
     *
     * @param conduct コンダクターオブジェクト
     * @returns シンボル配列の配列（デュアルブロック対応）またはエラー
     */
    static as(conduct: Conduct): IResult<CompileSymbols[][], ErrorBase>;
}
