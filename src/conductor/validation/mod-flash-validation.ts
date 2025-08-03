import { Conduct } from "../interface/conduct";
import { E400, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import * as ModValidationForStyles from "../validation/mod-style-validation";

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
export function allowAnnotation(
  conduct: Conduct,
  dualId: number,
  regionId: number,
  fullNoteIndex: number,
  regionNoteIndex: number,
  name: string,
  token: string,
  line: number,
  linePos: number
): SimpleResult {
  conduct.flash.other.push({
    name,
    dualId,
    regionId,
    fullNoteIndex,
    regionNoteIndex,
    location: {
      line, linePos
    },
    dataStr: token
  })
  return simpleSuccess();
}

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
export function offset(conduct: Conduct, dualId: number, regionIndex: number, blockNoteIndex: number, token: string, line: number, linePos: number): SimpleResult {

  if (dualId === 0) {
    return new E400(line, linePos, null,
      `@offset cannot be set for base block.`);
  }

  const offsetKey = `${dualId}_${regionIndex}`;
  if (conduct.flash.offset[offsetKey]) {
    return new E400(line, linePos, null,
      `@offset duplicate error. Only one @offset can be set in a block.`);
  }

  conduct.flash.offset[offsetKey] = {
    syntaxLocation: {
      row: token,
      line,
      linePos
    },
    blockNoteIndex
  }

  return simpleSuccess();
}

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
export function click(conduct: Conduct, dualId: number, regionIndex: number, fullNoteIndex: number, token: string, line: number, linePos: number): SimpleResult {

  if (dualId !== 0) {
    return new E400(line, linePos, null, `@click cannot be set on anything other than the base block.`);
  }

  const sym = token.replace(/^@click\(\s*|^@click|\s*\)/g, '');
  const settings = conduct.settings;

  if (sym === '@/click') {
    conduct.flash.click.push({ stop: { regionIndex: regionIndex, noteIndex: fullNoteIndex } });
    return simpleSuccess();

  } else if (sym === '') {
    conduct.flash.click.push({
      start: {
        regionIndex: regionIndex,
        fullNoteIndex: fullNoteIndex,
        until: conduct.mixesList[0].regionList[regionIndex].untilNext, // settings.click.until
        inst: settings.click.inst,
        velocity: settings.click.velocity
      }
    })
    return simpleSuccess();
  }

  const resUntil = ModValidationForStyles.untilNext(sym, line, linePos);
  if (resUntil.fail()) return resUntil;
  if (resUntil.res[0] < 1) {
    return new E400(line, -1, null, `Invalid click step value '${resUntil.res[0]}', The entered value is outside the accepted range.`);
  }

  conduct.flash.click.push({
    start: {
      regionIndex: regionIndex,
      fullNoteIndex: fullNoteIndex,
      until: resUntil.res,
      inst: settings.click.inst,
      velocity: settings.click.velocity
    }
  });
  return simpleSuccess();
}
