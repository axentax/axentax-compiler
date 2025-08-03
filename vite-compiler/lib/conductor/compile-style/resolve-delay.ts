import { Mixes } from "../interface/conduct";
import { SimpleResult, simpleSuccess } from "../interface/utils.response.interface";


export class ResolveDelay {

  /**
   * ディレイ処理を解決する
   * @param mixes ミックス情報
   * @returns 処理結果
   */
  static resolve(mixes: Mixes): SimpleResult {
    const { flatTOList } = mixes;

    const flatTOListLength = flatTOList.length;
    for (let ti = 0; ti < flatTOListLength; ti++) {
      const to = flatTOList[ti];
      const delay = to.styles.delay;

      if (delay) {
        const delayTick = ((to.bar.stopTick - to.bar.startTick) / delay.startUntil[1]) * delay.startUntil[0];
        
        to.bar.fretStartTicks = to.bar.fretStartTicks.map((fst) => {
          const res = fst ? to.bar.startTick + delayTick : fst;
          return res;
        });
      }
    }

    return simpleSuccess();
  }
}
