import { SysSettings } from "../x-var";
import { Mixes } from "../interface/conduct";
import { ESInst } from "../interface/style";
import { TabObj } from "../interface/tab";
import { NumberOrUfd } from "../interface/utils.interface";
import { SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import * as XTickUtils from "../utils/x-tick-utils";


export class ResolveStroke {

  static resolve(mixes: Mixes): SimpleResult {

    const { flatTOList } = mixes;

    // 各regionListを処理
    let tuningLen = 0;

    // ストローク方向の切替
    let down = true;

    // 直前のタブオブジェクトの停止ティック
    let justBeforeTick = 0;

    let beforeTabObj: TabObj = undefined as any;

    // 各タブオブジェクトを処理
    const toLen = flatTOList.length;
    for (let ti = 0; ti < toLen; ti++) {
      const to = flatTOList[ti];

      // 設定
      const stroke = to.styles.stroke;
      const inst = to.styles.inst;

      let strokeVal = stroke?.until;
      if (to.regionNoteIndex === 0) {
        // 空regionでバグるため、直取得に変更
        tuningLen = mixes.regionList[to.regionIndex].tuning.length;
      }

      // 適用
      const activeBowLength = to.tab.filter(f => f === 0 || f).length;
      if (activeBowLength > 1 && !stroke?.off && !to.styles.legato) {
        // console.log('stroke-to>', to.style.stroke)

        // Addressing Specification "slide.continue"
        let slideTargetStrings: NumberOrUfd[] = [];

        // console.log("to.to.prevTabObj>>", to.prevTabObj);

        if (ti !== 0 && to.prevTabObj?.styles?.slide?.continue) {
          const startBows = to.prevTabObj.activeBows || [];
          const landingBows = to.tab;
          slideTargetStrings = startBows.map((f, i) => {
            const landing = landingBows[i];
            return f !== undefined && f > -1 && landing !== undefined && landing > -1 ? i : undefined
          }).filter(f => f !== undefined);
        }

        // current location tick
        const currentTick = to.bar.fretStartTicks.find(t => t) as number;

        // difference from previous tick
        const diffFromPrev = currentTick - justBeforeTick;

        if (!to.isArpeggio && !to.isBullet && to.styles?.approach) {
          // approach
          down = true;
          strokeVal = [1, 98] as [number, number]; // 128

        } else if (currentTick !== SysSettings.startTick && diffFromPrev / to.bpm < 2.4) {
          // automatic adjustment # 速いケース
          const x = 36 + Math.round(64 - (diffFromPrev / 5));
          strokeVal = strokeVal ? strokeVal : [1, x < 16 ? 16 : x] as [number, number];
          down = down ? false : true;

        } else {
          down = true;
          strokeVal = strokeVal ? strokeVal : [1, 48] as [number, number]; // 36
        }

        if (inst === ESInst.brushing_u || inst === ESInst.brushing_U) {
          down = false;
        } else {
          down = true;
        }

        // shift amount for one string
        const shiftRangeTick = XTickUtils.untilNextToTick(strokeVal);
        const strokeOneSpan = Math.round((shiftRangeTick - slideTargetStrings.length) / activeBowLength)

        // 移動難易度の高い場合の、前コード一律の停止位置
        const positionFullStopTick = currentTick - (strokeOneSpan * (activeBowLength - 1));

        // shift before plan
        const shiftAllPriorPlans: number[] = [];

        // 適用数カウント
        let applyCnt = 0;

        // upストローク指定
        down = to.styles?.stroke?.up === true ? false : to.styles?.stroke?.up === false ? true : down;

        // 前のフィンガリングとのフレットが異なる弦数
        let numOfDiffString = 0;
        if (ti !== 0) {
          numOfDiffString = beforeTabObj.activeBows.reduce<number>((acc, cur, i) => {
            return (
              cur !== to.tab[i])
              && to.tab[i] !== undefined ? acc + 1 : acc;
          }, 0);
        }

        // 弦ごとにループ
        for (let stringIndex = 0; stringIndex < tuningLen; stringIndex++) {

          // down,upストロークにより順序変更
          const bow = down ? stringIndex : tuningLen - stringIndex - 1;

          // フレット指定があればtick変更
          if (to.bar.fretStartTicks[bow] !== undefined) {
            // slide.continue対象ではない弦のみstroke実施
            if (!slideTargetStrings.includes(bow)) {
              // shift current note
              to.bar.fretStartTicks[bow]! -= strokeOneSpan * applyCnt;

              if ((to.bar.fretStartTicks[bow] as number) < 0) {
                // 頭で '''''''2|2|2|2|2|2 だとエラーだが、unStyleCompileではここにこない
                to.bar.fretStartTicks[bow] = 0; // テスト中
                // return new E404(stroke?.line || to.syntaxLocation.line, stroke?.linePos || to.syntaxLocation.endPos || -1, stroke?.row || to.noteStr || null,
                //   `The Invalid stroke '${stroke?.row || to.noteStr}'. The stoke shift width is too large and exceeds the range of the song.`);
              }
            }
            applyCnt++

            // shift plan for before note 
            shiftAllPriorPlans.push(to.bar.fretStartTicks[bow]!)

          } else {
            shiftAllPriorPlans.push(positionFullStopTick)
          }
        }

        justBeforeTick = currentTick;

        // 前までのnote(activeBows)に存在するが、手前未処理の弦に対する処理
        // apply shiftBeforePlans or positionFullStopTick
        if (ti !== 0) {
          if ((numOfDiffString > 2 || to.regionNoteIndex === 0) && !slideTargetStrings.length) {
            for (let bni = 0; bni < beforeTabObj.refActiveBows.length; bni++) {
              if (!to.continueX || to.tab[bni] !== undefined) {
                // console.log('stroke>', bni,  to.noteStr, positionFullStopTick)
                shiftOrRemoveAllPriorTargetIncludedInTick(flatTOList, ti, positionFullStopTick, bni);
              }
            }
          } else {
            for (let bni = 0; bni < beforeTabObj.refActiveBows.length; bni++) {
              const bow = down ? bni : tuningLen - bni - 1;
              if (!to.continueX || to.tab[bow] !== undefined) {
                shiftOrRemoveAllPriorTargetIncludedInTick(flatTOList, ti, shiftAllPriorPlans[bni]!, bow);
              }
            }

          }
        }

      }

      beforeTabObj = to;
    }

    return simpleSuccess();
  }
}

/**
 * 前の音符を再帰的に「削除」または「停止位置のシフト」して適用
 */
function shiftOrRemoveAllPriorTargetIncludedInTick(flatTabObjList: TabObj[], startIndex: number, landingTick: number, targetStringIndex: number) {
  const tol = flatTabObjList;

  for (let ti = startIndex - 1; ti >= 0; ti--) {

    const hisStartTick = tol[ti].bar.fretStartTicks[targetStringIndex];
    const hisStopTick = tol[ti].bar.fretStopTicks[targetStringIndex];

    // remove target
    if (hisStartTick && hisStartTick >= landingTick) {
      // 削除: 手前(直前だけではない)音の開始位置が、対照着地開始位置より後(tickが大きい)
      tol[ti].bar.fretStartTicks[targetStringIndex] = undefined;
      tol[ti].bar.fretStopTicks[targetStringIndex] = undefined;
      tol[ti].tab[targetStringIndex] = undefined;

      continue;
    }

    // shift target
    if (hisStopTick && hisStopTick >= landingTick) {
      // 削除: 手前(直前だけではない)音の終了位置が、対照着地開始位置より後(tickが大きい)
      tol[ti].bar.fretStopTicks[targetStringIndex] = landingTick;
      break;
    }
  }
}
