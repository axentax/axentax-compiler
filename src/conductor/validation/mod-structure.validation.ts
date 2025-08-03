import { CSymbolType } from "../interface/compile";
import { E400, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";


/**
 * スタイル開始の構造検証
 * @param accum - 累積文字列
 * @param currentType - 現在のシンボルタイプ
 * @param beforeType - 前のシンボルタイプ
 * @param commitLine - 行番号
 * @param commitPos - 行内位置
 * @returns 検証結果
 */
export function styleStart(accum: string, currentType: CSymbolType, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult {
  if (beforeType === CSymbolType.undefined) {
    return currentType === CSymbolType.blockStyle
      /* istanbul ignore next: 通常運用では構文解析により適切な順序が保証されるため、この重複ブロック宣言エラーパスは到達困難 */
      ? new E400(commitLine, commitPos, accum,
        `Invalid region prefix "${accum}" specified in the wrong place. Duplicate block declaration.`
        + ` \nDefault properties of block are set after block name specification.\ne.g. @backing 1/4 140 { C Dm }`)
      /* istanbul ignore next: 無効な region prefix エラーは構文解析段階で検出されるため、実際には到達しない */
      : new E400(commitLine, commitPos, accum,
        `Invalid region prefix '${accum}'. Only '@@' can be used as the region prefix.`)
  }
  return simpleSuccess();
}

/**
 * リージョン開始の構造検証
 * @param accum - 累積文字列
 * @param beforeType - 前のシンボルタイプ
 * @param commitLine - 行番号
 * @param commitPos - 行内位置
 * @returns 検証結果
 */
export function regionStart(accum: string, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult {

  if (CSymbolType.regionStart === beforeType) {
    /* istanbul ignore next: 構文解析器により適切な region 順序が保証されるため、重複ブロック宣言エラーは実運用では発生しない */
    return new E400(commitLine, commitPos, accum,
      `invalid name '${accum}' specified in the wrong place. Duplicate block declaration.`);
  }
  return simpleSuccess();
}

/**
 * コロン開始の構造検証
 * @param accum - 累積文字列
 * @param beforeType - 前のシンボルタイプ
 * @param commitLine - 行番号
 * @param commitPos - 行内位置
 * @returns 検証結果
 */
export function colonOfStart(accum: string, beforeType: CSymbolType, commitLine: number, commitPos: number): SimpleResult {

  if (![
    CSymbolType.note,
    CSymbolType.bullet,
    CSymbolType.degreeName,
    CSymbolType.closingCurlyBrace
  ].includes(beforeType)) {
    /* istanbul ignore next: 構文解析時に適切な token 順序が検証されるため、スタイル指定の位置エラーは通常発生しない */
    return new E400(commitLine, commitPos, accum,
      `invalid token '${accum}' specified in the wrong place. Set the style specification after the note or in {}.`);
  }
  if (accum.length === 1) {
    /* istanbul ignore next: 単体コロン ':' のエラーは構文解析段階で適切に処理されるため、この条件は実際には到達しない */
    return new E400(commitLine, commitPos, accum,
      `invalid token ':' specified in the wrong place.`);
  }

  return simpleSuccess();
}

