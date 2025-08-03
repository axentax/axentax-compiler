import { Mixes } from "../interface/conduct";
import { SimpleResult, simpleSuccess } from "../interface/utils.response.interface";


export class ResolveStaccato {

  /**
   * スタッカート処理を解決する
   * @param mixes ミックス情報
   * @returns 処理結果
   */
  static resolve(mixes: Mixes): SimpleResult {
    const { flatTOList } = mixes;

    const flatTOListLength = flatTOList.length;
    for (let ti = 0; ti < flatTOListLength; ti++) {
      const to = flatTOList[ti];
      const staccato = to.styles.staccato;

      if (
        staccato
        && !to.styles.slide
      ) {
        const staccatoTick = ((to.bar.stopTick - to.bar.startTick) / staccato.cutUntil[1]) * staccato.cutUntil[0];

        to.bar.fretStopTicks = to.bar.fretStopTicks.map((fst) => {
          const res = fst ? to.bar.startTick + staccatoTick : fst;
          return res;
        });
      }
    }

    return simpleSuccess();
  }

}
