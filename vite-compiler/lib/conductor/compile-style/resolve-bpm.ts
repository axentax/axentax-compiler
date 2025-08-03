import { SysSettings } from "../x-var";
import { Region } from "../interface/region";
import { BPMPos } from "../interface/bpm";
import { Conduct } from "../interface/conduct";
import { StyleBPM } from "../interface/style";
import { E422, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";


/**
 * BPM解決処理を行うクラス
 */
export class ResolveBPM {

  /**
   * BPMを解決する
   * @param conduct コンダクト
   * @returns 処理結果
   */
  static resolve(conduct: Conduct): SimpleResult {
    const { regionList, flatTOList } = conduct.mixesList[0];
    const { bpmPosList } = conduct;


    // 開始BPM
    bpmPosList.push({
      tick: 0,
      bpm: conduct.settings.style.bpm,
      timeMS: -1
    });

    // 処理済みのtabObjを保存
    const processedGroups: number[] = [];

    // beforeBPMが設定されていない遷移ケースで使用
    let currentBPM = -1;

    // 初期化
    let region: Region = {} as Region;

    // 各regionListを処理
    const flatTOListLength = flatTOList.length;
    for (let ti = 0; ti < flatTOListLength; ti++) {

      const to = flatTOList[ti];

      // ブロックbpmが設定されていない場合、現在のBPMが継承されるため、ここでは設定しない
      if (to.regionNoteIndex === 0) {
        
        // 空regionでバグるため、インクリメントから直取得に変更
        const regionIndex2 = to.regionIndex
        region = regionList[regionIndex2];

        if (region.bpm !== -1) {
          currentBPM = region.bpm;
          bpmPosList.push({ tick: region.startLayerTick, bpm: region.bpm, timeMS: -1 });
        }
      }

      const bpm = to.styles.bpm;

      // 新しいBPMグループを検索
      if (bpm && !processedGroups.includes(bpm.group)) {

        if (bpm.group === -1 || bpm.style.type === 1) {
          // ローカル設定 例: C:bpm(140)
          setLocallyBPM(bpmPosList, bpm.style, to.bar.startTick, to.bar.stopTick);
          currentBPM = bpm.style.afterBPM || bpm.style.beforeBPM as number;

        } else {
          // 遷移設定 例: { .. }:bpm(100..+50)
          processedGroups.push(bpm.group)
          const res = setTransitionBPM(bpmPosList, currentBPM, bpm.style, to.bar.startTick, bpm.groupEndTick);
          if (res.fail()) return res;
          currentBPM = bpm.style.afterBPM || bpm.style.beforeBPM as number;
        }
      }
    }

    // BPMを配布
    if (bpmPosList.length === 1) {
      // 共通BPMの場合
      for (let dualId = 0; dualId < conduct.mixesList.length; dualId++) {
        const tOList = conduct.mixesList[dualId].flatTOList;
        const flatTOListLength = tOList.length;
        for (let ti = 0; ti < flatTOListLength; ti++) {
          tOList[ti].bpm = bpmPosList[0].bpm;
        }
      }

    } else {
      // 変動BPMの場合

      for (let dualId = 0; dualId < conduct.mixesList.length; dualId++) {
        const tOList = conduct.mixesList[dualId].flatTOList;

        let currBPMIndex = 0;

        const flatTOListLength = tOList.length;
        for (let ti = 0; ti < flatTOListLength; ti++) {
          const to = tOList[ti];
          const bpmPosListLength = bpmPosList.length;
          // 範囲内でBPMを検索
          for (let cbi = currBPMIndex; cbi < bpmPosListLength; cbi++) {
            // bpmPosListの終端
            if (cbi === bpmPosListLength - 1) {
              to.bpm = bpmPosList[cbi].bpm;
              break;
            }
            // 見つかった場合
            if (bpmPosList[cbi].tick <= to.bar.startTick && bpmPosList[cbi + 1].tick > to.bar.startTick) {
              to.bpm = bpmPosList[cbi].bpm;
              currBPMIndex = cbi;
              break;
            }
          }
        }

      }
    }

    // 曲全体の時間把握のため末端のBPM設定（view用）
    let lastTick = 0;
    conduct.mixesList.forEach((mixes) => {
      if (mixes.flatTOList.length) {

        const stopTick = mixes.flatTOList[mixes.flatTOList.length - 1].bar.stopTick;
        if (stopTick !== undefined && lastTick < stopTick) lastTick = stopTick;
      }
    });
    if (lastTick > 0) {
      const lastBPM = bpmPosList[bpmPosList.length - 1].bpm;
      bpmPosList.push({ tick: lastTick, bpm: lastBPM, timeMS: -1 });
    }

    return simpleSuccess();
  }

  /**
   * BPMの時間を計算する
   * @param conduct コンダクト
   * @returns 処理結果
   */
  static mathBPMTime(conduct: Conduct): SimpleResult {
    const tpq = 480;

    const { bpmPosList } = conduct;

    let currentTimeMS = 0;
    let currentTick = 0;
  
    for (let i = 0; i < bpmPosList.length; i++) {
      const entry = bpmPosList[i];
      if (i > 0) {
        const ticksSinceLast = entry.tick - currentTick;
        const msPerTick = 60000 / (bpmPosList[i - 1].bpm * tpq);
        currentTimeMS += ticksSinceLast * msPerTick;
      }
      bpmPosList[i].timeMS = currentTimeMS;
      currentTick = entry.tick;
    }

    return simpleSuccess();
  }
}

/**
 * グローバルBPMを設定
 * @param bpmPosList BPMポジションリスト
 * @param baseBPM ベースBPM
 * @param bpm スタイルBPM
 * @param startTick 開始tick
 * @param stopTick 終了tick
 * @returns 処理結果
 */
function setTransitionBPM(bpmPosList: BPMPos[], baseBPM: number, bpm: StyleBPM, startTick: number, stopTick: number): SimpleResult {
  let startBPM = -1;
  let endBPM = -1;

  // 開始BPM
  if (!bpm.beforeBPM) {
    startBPM = baseBPM
  } else if (bpm.beforeSign) {
    startBPM = baseBPM + (bpm.beforeBPM * bpm.beforeSign)
    if (startBPM < SysSettings.minBPM || startBPM > SysSettings.maxBPM) {
      return new E422(bpm.line, bpm.linePos, bpm.row || null,
        `Invalid BPM value '${bpm.row}'. bpm transitioned to an invalid value '${startBPM}'.`
      )
    }
  } else {
    startBPM = bpm.beforeBPM
  }

  // 終了BPM
  if (!bpm.afterBPM) {
    return new E422(bpm.line, bpm.linePos, bpm.row || null,
        `Invalid BPM value '${bpm.row}'. SystemError.'.`);
  } else if (bpm.afterSign) {
    endBPM = startBPM + (bpm.afterBPM * bpm.afterSign);
    if (endBPM < SysSettings.minBPM || endBPM > SysSettings.maxBPM) {
      return new E422(bpm.line, bpm.linePos, bpm.row || null,
        `Invalid BPM value '${bpm.row}'. bpm transitioned to an invalid value '${endBPM}'.`
      )
    }
  } else {
    endBPM = bpm.afterBPM;
  }

  // BPM対象範囲を削除
  removeBPMTargetRange(bpmPosList, startTick, stopTick);

  // 遷移プロパティを設定
  const tickRange = stopTick - startTick;
  const bpmRange = endBPM - startBPM;
  const absBPMRange = Math.abs(bpmRange) / SysSettings.bpmTransitionSpan;
  const oneStepTick = tickRange / absBPMRange;
  const oneStepBpm = bpmRange / absBPMRange;

  // 遷移BPMを設定
  let currentTick = startTick;
  let currentBPM = startBPM;

  // BPMを段階的に適用
  for (let i = 0; i <= absBPMRange; i++) {
    bpmPosList.push({ tick: Math.floor(currentTick), bpm: currentBPM, timeMS: -1 });
    currentTick += oneStepTick;
    currentBPM += oneStepBpm;
    if (stopTick - 1 <= currentTick) break;
  }
  bpmPosList.push({ tick: Math.floor(stopTick - 1), bpm: endBPM, timeMS: -1 });

  return simpleSuccess();
}

/**
 * ローカルBPMを設定
 * @param bpmPosList BPMポジションリスト
 * @param bpm スタイルBPM
 * @param startTick 開始tick
 * @param stopTick 終了tick
 */
function setLocallyBPM(bpmPosList: BPMPos[], bpm: StyleBPM, startTick: number, stopTick: number) {
  if (!bpm.beforeBPM || bpm.type !== 1) {
    return new E422(-1, -1, null, `BPM SystemError.`);
  }
  removeBPMTargetRange(bpmPosList, startTick, stopTick);
  bpmPosList.push({ tick: Math.floor(startTick), bpm: bpm.beforeBPM, timeMS: -1 });
  bpmPosList.push({ tick: Math.floor(stopTick - 1), bpm: bpm.beforeBPM, timeMS: -1 });
}

/**
 * 対象範囲を削除
 * @param bpmPosList BPMポジションリスト
 * @param startTick 開始tick
 * @param stopTick 終了tick
 */
function removeBPMTargetRange(bpmPosList: BPMPos[], startTick: number, stopTick: number) {
  for (let i = 0; i < bpmPosList.length; i++) {
    if (startTick <= bpmPosList[i].tick && stopTick >= bpmPosList[i].tick) {
      bpmPosList.splice(i, 1);
      i--;
    }
  }
}
