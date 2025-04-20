import { UntilNext } from '../interface/utils.interface';
import { ErrorBase, IResult } from '../interface/utils.response.interface';

/**
 * サフィックス拡張の検証と適用
 */
/**
 * '~','^','='サフィックス拡張記号を適用する
 * @param untilNext - 次までの時間配列
 * @param token - 処理対象のトークン
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 適用結果
 */
export declare function mathSuffixExtension(untilNext: UntilNext, token: string, line: number, linePos: number): IResult<boolean, ErrorBase>;
