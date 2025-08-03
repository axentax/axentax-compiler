import { Region } from "../interface/region";
import { Conduct, Mixes } from "../interface/conduct";
import { ESInst, StyleStrum } from "../interface/style";
import { TabObj } from "../interface/tab";
import { SimpleResult, simpleSuccess, Success } from "../interface/utils.response.interface";
import * as XUtils from "../utils/x-utils";
import * as XUtilsObject from "./utils.object";
import * as XTickUtils from "../utils/x-tick-utils";


/**
 * ストラムエフェクトの解決クラス
 */
export class ResolveStrum {

  /**
   * ストラムエフェクトを解決する
   * @param conduct - コンダクトオブジェクト
   * @param mixes - ミックスオブジェクト
   * @returns 処理結果
   */
  static resolve(conduct: Conduct, mixes: Mixes): SimpleResult {
    const { flatTOList, regionList } = mixes;

    let region: Region = {} as Region;

    for (let ti = 0; ti < flatTOList.length; ti++) { // variable array length
      const to = flatTOList[ti];

      if (to.regionNoteIndex === 0) {
        region = regionList[to.regionIndex];
      }
      const strum = to.styles.strum;
      if (strum) {
        const addedNumber = core(conduct, mixes, region, to, ti, strum);
        ti += addedNumber.res;
      }
    }
  
    return simpleSuccess();
  }
}

/**
 * ストラムエフェクトのコア処理
 * @param conduct - コンダクトオブジェクト
 * @param mixes - ミックスオブジェクト
 * @param block - リージョンオブジェクト
 * @param to - TabObj
 * @param ti - インデックス
 * @param strum - ストラムスタイル
 * @returns 処理結果
 */
function core(conduct: Conduct, mixes: Mixes, block: Region, to: TabObj, ti: number, strum: StyleStrum): Success<number> {
  const { flatTOList, marks } = mixes;
  const { settings } = conduct;

  // ストラムデータ
  const strumBeanList: {
    bowsIndex: number,
    thisStrumStartTick: number
  }[] = [];

  // ストラム対象弦
  for (let bi = block.tuning.length - 1; bi >= 0; bi--) {
    if (!isNaN(to.tab[bi] as any)) break; // 一つ検出されたら終了。実音は不要
    strumBeanList.unshift({ bowsIndex: bi, thisStrumStartTick: -1 });
  }
  if (!strumBeanList.length || strumBeanList.length === block.tuning.length) {
    // エラーにせず何もしない
    return new Success(0);
  }

  // ストラム幅を割り当て
  const hereBPM = to.bpm;
  const targetTickWidth = Math.floor(XTickUtils.getTicksByTime(hereBPM, strum.strumWidthMSec));

  // 遅延処理
  let delayTick: number | undefined;
  if (strum.startUntil[0] > 0) {
    delayTick = ((to.bar.stopTick! - to.bar.startTick!) / strum.startUntil[1]) * strum.startUntil[0];
    to.bar.fretStartTicks = to.bar.fretStartTicks.map((fst) => { // , bi
      const res = fst ? to.bar.startTick + delayTick! : fst;
      return res;
    });

  }

  // 作業幅を分割して停止位置を割り当てる
  let strumStop = -1;
  to.bar.fretStartTicks.forEach(fst => { if (fst) { strumStop = Math.max(strumStop, fst) } })
  const strumStart = strumStop - targetTickWidth;
  const splitWidth = targetTickWidth / strumBeanList.length;
  for (let i = 0; i < strumBeanList.length; i++) {
    strumBeanList[strumBeanList.length - 1 - i].thisStrumStartTick = Math.round(strumStart + (splitWidth * i));
    if (strumBeanList[strumBeanList.length - 1 - i].thisStrumStartTick < 0) {
      // エラーにせず何もしない
      return new Success(0);
    }
  }

  // ストラムTabObjを作成
  const strumTabObj = XUtilsObject.emptyTabObj(
    to.regionIndex,
    XUtils.decimalizeAdd(to.tabObjId, 0.1),
    XUtils.decimalizeAdd(to.regionNoteIndex, 0.1),
    block.tuning.length
  );
  // 一つのTabObjにパック
  strumBeanList.forEach((bean) => {
    strumTabObj.tab[bean.bowsIndex] = 0
    strumTabObj.bar.fretStartTicks[bean.bowsIndex] = bean.thisStrumStartTick;
    strumTabObj.bar.fretStopTicks[bean.bowsIndex] = bean.thisStrumStartTick + 1;
  });
  // ベロシティ設定
  const bowArr = strumBeanList.map(m => m.bowsIndex);
  strumTabObj.velocity = Array(block.tuning.length).fill(
    settings.play.strum.velocity)
    .map((v, i) => bowArr.includes(i) ? v + i * 2 : undefined);

  strumTabObj.styles.inst = ESInst.normal; // 一旦 normalで運用
  strumTabObj.styles.stroke = { off: true } as any;
  strumTabObj.noteStr = '#strum';

  // ストラム適用フラグ
  to.styles!.strum!._applied = true;

  // 後続追加
  flatTOList.splice(ti + 1, 0, strumTabObj);
  marks.fullNoteIndexWithTick.splice(ti + 1, 0, -1);

  // 前のTabObjをカット
  const cutPoint = strumBeanList[strumBeanList.length - 1].thisStrumStartTick;
  for (let si = 0; si < 9; si++) {
    for (let tti = ti - 1; tti >= 0; tti--) {
      const targetTO = flatTOList[tti];
      if (targetTO.tab.length - 1 < si || targetTO.bar.fretStartTicks === undefined) continue;
      // 除去ケース
      if (targetTO.bar.fretStartTicks[si]! > cutPoint) {
        targetTO.tab[si] = undefined;
        targetTO.bar.fretStartTicks[si] = undefined;
        targetTO.bar.fretStopTicks[si] = undefined;
      }
      // シフトケース
      if ( targetTO.bar.fretStartTicks[si]! < cutPoint && targetTO.bar.fretStopTicks[si]! > cutPoint) {
        targetTO.bar.fretStopTicks[si] = cutPoint;
        break;
      }
    }
  }
  return new Success(1);
}
