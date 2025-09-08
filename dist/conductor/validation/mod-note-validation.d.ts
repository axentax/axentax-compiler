import { DegreeObj } from '../interface/style';
import { NumberOrUfd } from '../interface/utils.interface';
import { ErrorBase, IResult } from '../interface/utils.response.interface';

/**
 * ノートの検証処理
 */
/**
 * デグリーシンボルの解析と検証
 * %1, %1/2, %1m/2 の形式を処理する
 * '%' は事前に除去されている
 * @param degree - デグリーオブジェクト
 * @param token - 処理対象トークン
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 解析結果
 */
export declare function degreeSymbol(degree: DegreeObj, token: string, line: number, linePos: number): IResult<string, ErrorBase>;
/**
 * コードシンボルの検証
 * 例: C, D, E, F, G, A, B
 * @param token - 処理対象トークン
 * @param noteStr - ノート文字列
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 検証結果
 */
export declare function chordSymbol(token: string, noteStr: string, line: number, linePos: number): IResult<null, ErrorBase>;
/**
 * タブ譜シンボルの検証と解析
 * 例: r|2|2|2
 * @param tuning - チューニング設定
 * @param token - 処理対象トークン
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 解析結果
 */
export declare function tabSymbol(tuning: string[], token: string, line: number, linePos: number): IResult<NumberOrUfd[], ErrorBase>;
