import { Conduct } from "../interface/conduct";
import { SimpleResult } from "../interface/utils.response.interface";
/**
 * アノテーションを許可してFlashオブジェクトに記録する
 * @param conduct - コンダクトオブジェクト
 * @param dualId - デュアルID
 * @param regionId - リージョンID
 * @param fullNoteIndex - 全体ノートインデックス
 * @param regionNoteIndex - リージョン内ノートインデックス
 * @param name - アノテーション名
 * @param token - トークン文字列
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 処理結果
 */
export declare function allowAnnotation(conduct: Conduct, dualId: number, regionId: number, fullNoteIndex: number, regionNoteIndex: number, name: string, token: string, line: number, linePos: number): SimpleResult;
/**
 * オフセット設定を処理する
 * @param conduct - コンダクトオブジェクト
 * @param dualId - デュアルID
 * @param regionIndex - リージョンインデックス
 * @param blockNoteIndex - ブロックノートインデックス
 * @param token - トークン文字列
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 処理結果
 */
export declare function offset(conduct: Conduct, dualId: number, regionIndex: number, blockNoteIndex: number, token: string, line: number, linePos: number): SimpleResult;
/**
 * クリック音設定を処理する
 * @param conduct - コンダクトオブジェクト
 * @param dualId - デュアルID
 * @param regionIndex - リージョンインデックス
 * @param fullNoteIndex - 全体ノートインデックス
 * @param token - トークン文字列
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 処理結果
 */
export declare function click(conduct: Conduct, dualId: number, regionIndex: number, fullNoteIndex: number, token: string, line: number, linePos: number): SimpleResult;
