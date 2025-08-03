import { SysSettings } from "../x-var";
import { UntilNext } from "../interface/utils.interface";
import { E400, ErrorBase, IResult, Success } from "../interface/utils.response.interface";
import * as XTickUtils from "../utils/x-tick-utils";


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
export function mathSuffixExtension(untilNext: UntilNext, token: string, line: number, linePos: number): IResult<boolean, ErrorBase> {
  let isApply = false;

  const matched = token.match(/[\^=~]+$/);
  if (matched) {
    if (matched[0].length > SysSettings.maxSuffixExtensionLength) {
      return new E400(line, linePos, token,
        `Invalid suffix extension token '${token}'. Up to ${SysSettings.maxSuffixExtensionLength} suffix extensions can be used.`)
    }
    // 3倍拡張（=）
    const third = matched[0].match(/=/g);
    if (third) {
      untilNext[1] = untilNext[1] * (third.length * 3);
    }
    // 2倍拡張（~）
    const double = matched[0].match(/~/g);
    if (double) untilNext[0] = untilNext[0] * (double.length + 1);
    // 半分拡張（^）
    const half = matched[0].match(/\^/g);
    if (half) untilNext[1] = untilNext[1] * (half.length * 2);

    [untilNext[0], untilNext[1]] = XTickUtils.reduceUntilNextArrByGCD(untilNext)

    isApply = true;
  }

  return new Success(isApply);
}
