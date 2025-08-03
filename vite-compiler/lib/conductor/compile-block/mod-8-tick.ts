import { Conduct } from "../interface/conduct";
import { TabObj } from "../interface/tab";
import { SimpleResult, simpleSuccess } from "../interface/utils.response.interface";


export class ModTick_dual {

  /**
   * ノート毎のtick決定と付随処理
   */
  static resolve(conduct: Conduct, dualId: number): SimpleResult {
    const { regionLength } = conduct;
    const { regionList, flatTOList } = conduct.mixesList[dualId];

    const maxTuningLength = Math.max(...regionList.map(bl => bl.tuning.length));
    const flatTOListLength = flatTOList.length;

    let beforeContinueX = false;

    for (let bow = 0; bow < maxTuningLength; bow++) {

      // init
      let regionIndex = regionLength - 1;
      let region = regionList[regionIndex];
      let currentTick = region.startLayerTick + region.usedTotalTick;
      let currentLastTick = region.startLayerTick + region.usedTotalTick;

      // baseブロックの全体長で、dualBlockも算出しているから、末端からtick引いて行っても、480には到達しない
      //    これは、block毎に末尾設定してもそうなってしまう。
      //    => 暫定回避策として、dualブロックのnoteに関しては
      //       offsetがない場合も"adjustDualNoteTick"で調整する「たまたまの仕様」に依存させる
      for (let ti = flatTOListLength - 1; ti >= 0; ti--) {
        const to = flatTOList[ti];

        // startTick, stopTickはスタイルの影響を受けない不変の、note幅と位置を保持する変数で
        // これはview側で使用しているため
        // stopTickを変更した場合、最終的には元に戻すため、退避する。
        let evacuateStopTick: number | undefined = undefined;

        if (regionIndex !== to.regionIndex) {
          regionIndex = to.regionIndex;
          region = regionList[regionIndex];

          // 推移させるtickの開始地点を「region開始 + region内のトータルnote長」で設定する
          // ループ内で徐々に減少していく（逆ループのため）
          currentTick = region.startLayerTick + region.usedTotalTick;
          
          // @@ { r |||||12 } >> { C~~~~~ } のような場合で、短い方(|||||12)が、regionの末端まで伸びてしまう対応
          if (beforeContinueX === false) {
            currentLastTick = region.startLayerTick + region.usedTotalTick;
          }

          // @offsetの後にnoteがない場合
          else if (region.usedTotalTick === region.offsetTickWidth) {
            currentLastTick = region.trueStartLayerTick;
          }
          // 次の region にnoteがない場合
          else if (regionList[regionIndex + 1].deactive) {
            currentLastTick = region.startLayerTick + region.usedTotalTick;
          }
          // @@ { r 0| } >> { r~~~~~ } >> { r ||||12~ } // 0|は切れて、||||12 が伸びればOK の時対応
          else {
            evacuateStopTick = to.bar.stopTick;
            to.bar.stopTick = currentLastTick;
          }
        }

        if (bow < regionList[to.regionIndex].tuning.length) {
          currentTick -= to.bar.tick;

          // fret designation is found
          if (to.tab[bow] !== undefined && to.tab[bow] !== -1) {
            to.bar.fretStartTicks[bow] = currentTick;

            if (currentLastTick === -1) {
              // ||||12 |||3| @offset で |||3|が鳴らない暫定対応
              // 根本は currentLastTick が-1 であることが問題だったが解決ずみ
              to.bar.fretStopTicks[bow] = currentTick + to.bar.tick;
            } else {
              to.bar.fretStopTicks[bow] = currentLastTick; // これはcontinueの影響受ける必要がある
            }

          }

          // for rest
          to.bar.startTick = currentTick;
          if (to.bar.stopTick === undefined) {
            to.bar.stopTick = currentTick + to.bar.tick;
          }

          // 下記syntaxの例で、次regionのnoteにviewが切り替わらない不具合対応
          // @@ { C~~~:map(2,3) } @@ { ..|2 ..|3 }
          if (to.bar.stopTick - to.bar.startTick > to.bar.tick) {
            to.bar.stopTick = to.bar.startTick + to.bar.tick;
          }

          // stop position update
          if (to.tab[bow] !== undefined || to.continueX === false) {
            currentLastTick = currentTick;
          }

          if (evacuateStopTick) to.bar.stopTick = evacuateStopTick;

          beforeContinueX = to.continueX;

        }

      }

      // ---
      // これより以下、tickの修正無し 
      // ---

      // active status
      // ブロック跨ぎでも継続されている :: 20240505
      let currentActive: number | undefined = undefined;
      let currentActiveRef: TabObj | undefined = undefined;

      // landing searcher
      let currentSearcher: TabObj | undefined = undefined;
      // release flag
      let isRelease = false;
      // for nextTabObj
      let beforeTabObj: TabObj = {} as TabObj;

      // init
      let tuningLen = -1;

      // init activeBows etc..
      for (let ti = 0; ti < flatTOListLength; ti++) {
        const to = flatTOList[ti];

        if (to.regionNoteIndex === 0) {
          region = regionList[to.regionIndex];
          tuningLen = region.tuning.length;
        }

        // アクティブな弦のみ処理
        if (bow > regionList[to.regionIndex].tuning.length - 1) continue

        // set nextTabObj ※slide等のスタイルで使用
        beforeTabObj.nextTabObj = to;

        // 休符の場合
        if (to.isRest || to.tab[bow] === -1) {
          // for rest
          currentActive = undefined;
          currentActiveRef = undefined
        }
        // 休符では無い、且つ最初の鳴り音（flatTOListの最初）
        else if (ti === 0) {
          // index0の場合、鳴音ある場合のみtrue
          if (to.tab[bow] !== undefined && to.tab[bow] !== -1) {
            currentActive = to.tab[bow];
            currentActiveRef = to;
          }
        }
        // 上記以外全ての場合
        else {
          // continue指定が無い
          if (to.continueX === false) {
            // continueX:falseの場合、鳴音ある場合のみtrue
            if (to.tab[bow] !== undefined && to.tab[bow] !== -1) {
              currentActive = to.tab[bow]
              currentActiveRef = to;
            } else {
              currentActive = undefined;
              currentActiveRef = undefined;
            }
          }
          // continue指定がある
          else {
            // continueX:trueの場合、鳴音があれば追従でtrue
            // それ以外の場合は前のcurrentActiveの状態を維持
            if (to.tab[bow] !== undefined && to.tab[bow] !== -1) {
              currentActive = to.tab[bow];
              currentActiveRef = to;

            } else {
              // 前のcurrentActiveの状態を維持
              // → strumはゴーストピッキングするため、鳴音がない弦は引き継がない
              if (to.styles.strum) {
                currentActive = undefined;
                currentActiveRef = undefined;
              }
              // → delayは、delayの該当箇所で弦指定されていない弦は、continueしたいので検討中
            }
          }
        }

        // set active strings ※slide等のスタイルで使用
        to.activeBows[bow] = currentActive;
        // set activeBows ref 
        if (to.refActiveBows === undefined) {
          to.refActiveBows = Array(tuningLen).fill(undefined as any);
        }
        to.refActiveBows[bow] = currentActiveRef;

        // set landing tabObj ※slide等のスタイルで使用
        if (currentSearcher) {
          if (!to.isRest && to.tab.find(f => f !== undefined && f !== -1) !== undefined) {
            currentSearcher.slideLandingTab = to.tab;
            if (isRelease && currentSearcher.styles.slide) {
              // force change option to "release", because rest between
              currentSearcher.styles.slide.type = 'release';
            }
            currentSearcher = undefined;
          }
        }
        isRelease = true;

        // searching start landing tabObj ※slide指定がある場合の対応
        if (to.styles?.slide) {
          currentSearcher = to;
          isRelease = false;
        }

        to.prevTabObj = beforeTabObj;
        beforeTabObj = to;
      }
    }

    return simpleSuccess();
  }

}
