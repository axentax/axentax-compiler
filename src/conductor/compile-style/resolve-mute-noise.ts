import { Mixes } from "../interface/conduct";
import { SimpleResult, simpleSuccess } from "../interface/utils.response.interface";


export class ResolveMuteNoise {

  /**
   * ミュートノイズ処理を解決する
   * @param mixes ミックス情報
   * @returns 処理結果
   */
  static resolve(mixes: Mixes): SimpleResult {
    const { flatTOList } = mixes;

    const flatTabObjListLength = flatTOList.length;
    for (let ti = 0; ti < flatTabObjListLength; ti++) {
      const to = flatTOList[ti];

      if (to.isRest && to.styles.restNoise) {
        const tab = Array(to.tab.length).fill(undefined);

        if (ti === 0) {
          to.tab = tab.map(_ => 0)
        } else {
          to.tab = structuredClone(flatTOList[ti].prevTabObj.activeBows);
        }

        to.tab.forEach((ts, bow) => {
          if (ts !== undefined) {
            to.bar.fretStartTicks[bow] = to.bar.startTick;
            to.bar.fretStopTicks[bow] = to.bar.startTick! + 1;
          }
        });
      }
    }
    return simpleSuccess();
  }
}
