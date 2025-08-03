import { CompileSymbols } from "../interface/compile";
import { Conduct } from "../interface/conduct";
import { E404, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import * as ModValidationForFlash from "../validation/mod-flash-validation";

/**
 * ModFlash_dualクラス
 * 
 * フラッシュ（@記号）による注釈解析を行うクラス
 * クリック、オフセット、カスタム注釈などの処理を担当する
 * デュアルブロック対応で、各ブロックでの注釈制限も管理する
 */
export class ModFlash_dual {

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
  static resolve(
    conduct: Conduct,
    dualId: number,
    regionIndex: number,
    fullNoteIndex: number,
    blockNoteIndex: number,
    sym: CompileSymbols
  ): SimpleResult {
    const token = sym.token;
    const line = sym.line;
    const pos = sym.linePos;

    if (token === ('@/click')) {
      // クリック注釈の処理
      const resClick = ModValidationForFlash.click(conduct, dualId, regionIndex, fullNoteIndex, token, line, pos);
      if (resClick.fail()) return resClick;  

    } else if (token.startsWith('@click(')) {
      // パラメータ付きクリック注釈の処理
      if (dualId !== 0) {
        // click指定はbase blockでのみ可能
        return new E404(line, pos, token,
          `Unknown annotation token '${token.replace(/\(.*?$/, '')}'. Click specification is only possible in base blocks.`);
      }
      const resClick = ModValidationForFlash.click(conduct, dualId, regionIndex, fullNoteIndex, token, line, pos);
      if (resClick.fail()) return resClick;

    } else if (token === ('@click')) {
      // 単純なクリック注釈の処理
      if (dualId !== 0) {
        // click指定はbase blockでのみ可能
        return new E404(line, pos, token,
          `Unknown annotation token '${token.replace(/\(.*?$/, '')}'. Click specification is only possible in base blocks.`);
      }
      const resClick = ModValidationForFlash.click(conduct, dualId, regionIndex, fullNoteIndex, token, line, pos);
      if (resClick.fail()) return resClick;

    } else if (token.startsWith('@offset')) {
      // オフセット注釈の処理
      const resOffset = ModValidationForFlash.offset(conduct, dualId, regionIndex, blockNoteIndex, token, line, pos);
      if (resOffset.fail()) return resOffset;

    } else if (token === '@@') {
      // リージョン開始マークのエラー処理
      return new E404(line, pos, token,
        `The start mark @@ of a region must start outside the {} brackets.`)

    } else {

      // 許可された注釈のチェック
      for (let ai = 0; ai < conduct.allowAnnotations.length; ai++) {

        const aa = conduct.allowAnnotations[ai];
        const allowName = /^@/.test(aa.name) ? aa.name : '@' + aa.name;

        if (token === allowName || token.startsWith(allowName + '(')) { //if (token.startsWith(allowName)) {

          if (aa.dualIdRestrictions.length && !aa.dualIdRestrictions.includes(dualId)) {
            return new E404(line, pos, token,
              `Invalid annotation token '${token.replace(/\(.*?$/, '')}'. Click specification is only possible in index ${aa.dualIdRestrictions} blocks.`);
          }

          const resAllowAnnotation = ModValidationForFlash.allowAnnotation(conduct, dualId, regionIndex, fullNoteIndex, blockNoteIndex, allowName, token, line, pos);
          if (resAllowAnnotation.fail()) return resAllowAnnotation;

          return simpleSuccess();
        }

      }

      return new E404(line, pos, token,
        `Unknown annotation token '${token.replace(/\(.*?$/, '')}'.`)
    }

    return simpleSuccess();
  }
}
