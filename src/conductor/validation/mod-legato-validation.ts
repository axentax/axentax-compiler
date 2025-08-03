import { TabObj } from "../interface/tab";
import { E400, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";


/**
 * レガート記法の妥当性を検証する
 * @param legTOLine - レガート対象のタブオブジェクト配列
 * @returns 検証結果
 */
export function valid(legTOLine: TabObj[]): SimpleResult {

  // ブロック(region)の違いでエラーにしている
  const regionIndex = legTOLine[0].regionIndex;

  for (let li = 1; li < legTOLine.length; li++) {
    const to = legTOLine[li];
    if (regionIndex !== to.regionIndex) {
      // region跨ぎ
      return new E400(to.syntaxLocation.line, to.syntaxLocation.linePos, null,
        `Invalid legato place '${to.noteStr}'. Legato cannot be applied across regions.`
      )
    }
  }

  return simpleSuccess();
}