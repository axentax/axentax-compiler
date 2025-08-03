import { Mixes } from "../interface/conduct";
import { TabObj } from "../interface/tab";
import { NumberOrUfd } from "../interface/utils.interface";
import { ErrorBase, IResult, SimpleResult, simpleSuccess, Success } from "../interface/utils.response.interface";
import * as XTickUtils from "../utils/x-tick-utils";
import * as ModValidationForLegato from "../validation/mod-legato-validation";
import * as XUtilsObject from "./utils.object";


/**
 * レガート解決処理を行うクラス
 */
export class ResolveLegato {

  /**
   * レガートスタイルを解決する
   * @param mixes ミックス情報
   * @returns 処理結果
   */
  static resolve(mixes: Mixes): SimpleResult {
    const { flatTOList } = mixes;

    let activeLegato = false;
    let startTOIndex = -1;
    let legTOLine: TabObj[] = [];

    // each flatTOList
    for (let ti = 0; ti < flatTOList.length; ti++) {
      const to = flatTOList[ti];
      const legato = to.styles.legato;

      if (legato && to.regionNoteIndex !== 0) {
        // レガート検知
        if (!activeLegato) {
          // 開始音
          legTOLine.push(to.prevTabObj);
          startTOIndex = ti - 1; // prevTabObjのindex
          activeLegato = true;
        }
        // レガート音
        legTOLine.push(to);
      } else {
        // レガート非検知
        // 適用
        if (activeLegato) {
          const resApply = apply(mixes, legTOLine, startTOIndex);
          if (resApply.fail()) return resApply;
          legTOLine = [];
        }
        activeLegato = false;
      }
    }
    // 最終適用
    if (activeLegato) {
      const resApply = apply(mixes, legTOLine, startTOIndex);
      if (resApply.fail()) return resApply;
    }

    return simpleSuccess();
  }
}

/**
 * レガートを適用する
 * @param mixes ミックス情報
 * @param legTOLine レガート対象のTabObjリスト
 * @param startTOIndex 開始TabObjのインデックス
 * @returns 処理結果
 */
function apply(mixes: Mixes, legTOLine: TabObj[], startTOIndex: number): SimpleResult {

  // 初期バリデーション
  const resValid = ModValidationForLegato.valid(legTOLine);
  if (resValid.fail()) return resValid;

  // 開始音とlegato弦の分離（velocity対応であっても必要な処理）
  const newStartTOIndex = separateStartNote(mixes, legTOLine, startTOIndex);
  if (newStartTOIndex.fail()) return newStartTOIndex;
  if (newStartTOIndex.res === -1) {
    velocityAdjust(mixes, legTOLine, startTOIndex);
    return simpleSuccess();
  }

  // legatoによる音程変化量の解析
  const resShiftWidth = analyzeShiftWidth(legTOLine);
  if (resShiftWidth.fail()) return resShiftWidth;
  if (resShiftWidth.res === undefined) {
    velocityAdjust(mixes, legTOLine, newStartTOIndex.res);
  }

  return simpleSuccess();
}

/**
 * ベロシティ調整処理
 * レガートの要件に合わないため（MIDIでのベンド可能範囲超過等）
 * @param mixes ミックス情報
 * @param legTOLine レガート対象のTabObjリスト
 * @param startTOIndex 開始TabObjのインデックス
 */
function velocityAdjust(mixes: Mixes, legTOLine: TabObj[], startTOIndex: number) {
  const { flatTOList } = mixes;
  const startTo = flatTOList[startTOIndex];
  
  const MIN_LEGATO_VELOCITY = 55;
  const DAMPING_COEFFICIENT = 700;

  const attenuationVelocity = Math.round(
    DAMPING_COEFFICIENT * XTickUtils.calculateTimeForTicks(startTo.bpm, startTo.bar.tick));
  for (let li = 1; li < legTOLine.length; li++) {
    legTOLine[li].velocity = legTOLine[li].velocity.map(
      v => v !== undefined ? Math.max(MIN_LEGATO_VELOCITY, v - attenuationVelocity) : undefined
    );
  }
}

/**
 * レガートによる音程変化量の解析
 * 
 * - 移動量から各ノート位置のピッチを決定する
 * - 移動量が異なる場合、ベロシティ対応に変更する布石
 * 
 * @param legTOLine レガート対象のTabObjリスト
 * @returns ベロシティ対応の場合 undefined、それ以外は成功結果
 */
function analyzeShiftWidth(legTOLine: TabObj[]): IResult<any | undefined, ErrorBase> {

  // 指定弦の変化をチェック
  let currentBinStr = "";
  for (let li = 0; li < legTOLine.length; li++) {
    // 指定弦の変化
    if (li === 0) {
      // 指定弦の変化でエラー準備
      currentBinStr = JSON.stringify(legTOLine[0].tab.map(t => t !== undefined ? 1 : 0));
    } else if (currentBinStr !== JSON.stringify(legTOLine[li].tab.map(t => t !== undefined ? 1 : 0))) {
      // 指定弦の変化でエラー
      return new Success(undefined);
    }
  }

  // シフト量の違い
  const baseShiftLine: number[] = []; // シフト量判定用基準
  let shiftSampleStringIndex = -1; // シフト量確認サンプル弦インデックス
  for (let bi = 0; bi < legTOLine[0].tab.length; bi++) {
    if (!baseShiftLine.length) {
      shiftSampleStringIndex = bi;
      for (let li = 1; li < legTOLine.length; li++) {
        const a = legTOLine[li - 1].tab[bi];
        const b = legTOLine[li].tab[bi];
        if (a !== undefined && b !== undefined) {
          baseShiftLine.push(a - b);
        }
      }

    } else {
      for (let li = 1; li < legTOLine.length; li++) {
        const a = legTOLine[li - 1].tab[bi];
        const b = legTOLine[li].tab[bi];
        if (a !== undefined && b !== undefined) {
          if (baseShiftLine[li - 1] !== a - b) {
            return new Success(undefined);
          }
        }
      }
    }
  }

  // 最小フレットから最大フレットまでの量を算出
  const sampleArr: number[] = [];
  for (let li = 0; li < legTOLine.length; li++) {
    sampleArr.push(legTOLine[li].tab[shiftSampleStringIndex] as number);
  }
  const min = Math.min(...sampleArr);
  const max = Math.max(...sampleArr);
  if (max - min > 4) {
    // シフト幅が4フレット以上はベロシティ対応
    return new Success(undefined);
  }
  
  // シフト量を決定
  const shiftPlan = sampleArr.map(num => {
    if (num === max) {
      return 2;
    } else if (num === max - 1) {
      return 1;
    } else if (num === max - 2) {
      return 0;
    } else if (num === max - 3) {
      return -1;
    } else {
      return -2;
    }
  });
  
  // 最終ティック
  const lastTick = legTOLine[legTOLine.length - 1].bar.stopTick;

  // 開始音適用（shiftPlanが0以外の場合は to.tabShift に逆定位設定）
  if (shiftPlan[0] !== 0) {
    legTOLine[0].tabShift = -shiftPlan[0];
  }
  // 開始音適用（全て）
  legTOLine[0].styles.bd = [{
    untilRange: [0, 0, 16],
    pitch: shiftPlan[0],
    isLegato: true
  }] as any;
  legTOLine[0].bar.stopTick = lastTick;
  legTOLine[0].bar.fretStopTicks.forEach((_, i) => {
    if (legTOLine[0].bar.fretStopTicks[i] !== undefined) {
      legTOLine[0].bar.fretStopTicks[i] = lastTick;
    }
  });

  // レガート適用
  for (let li = 1; li < legTOLine.length; li++) {
    legTOLine[li].continueX = true;
    legTOLine[li].tab = Array(legTOLine[li].tab.length).fill(undefined as any);
    legTOLine[li].styles.bd = [{
      untilRange: [0, 0, 16],
      pitch: shiftPlan[li],
      isLegato: true
    }] as any;
  }
  // 末端のリセット
  legTOLine[legTOLine.length - 1].styles.bd?.push({
    untilRange: [-2, -2, 1],
    pitch: 0,
    isLegato: true
  } as any)

  return new Success("success")
}

/**
 * 開始音の分離処理
 * 
 * 開始音がレガート以外の音が含まれる場合、レガート音を分離する
 * @param mixes ミックス情報
 * @param legTOLine レガート対象のTabObjリスト
 * @param startTOIndex 開始TabObjのインデックス
 * @returns 新しい開始インデックス
 */
function separateStartNote(mixes: Mixes, legTOLine: TabObj[], startTOIndex: number): IResult<number, ErrorBase> {
  const { flatTOList, marks } = mixes;

  // 開始音とレガート弦の分離
  // 開始音にあってレガート音にないもの検知し分離
  const ansStartNormalTab: NumberOrUfd[] = [];
  const ansStartLegatoTab: NumberOrUfd[] = [];
  const startTab = legTOLine[0].tab;
  const legatoTab = legTOLine[1].tab;
  // 全弦毎
  for (let bi = 0; bi < startTab.length; bi++) {
    const startFret = startTab[bi];
    const legatoFret = legatoTab[bi];
    // 開始音にフレットが存在する
    if (startFret !== undefined && startFret >= 0) {
      // 且つ、レガート音がある
      if (legatoFret !== undefined && legatoFret >= 0) {
        ansStartLegatoTab.push(startFret)
        ansStartNormalTab.push(undefined);
      } else {
        ansStartLegatoTab.push(undefined)
        ansStartNormalTab.push(startFret)
      }
    } else {
      // 開始音にフレットが存在しない

      // 且つ、レガート指定がある
      if (legatoFret !== undefined && legatoFret >= 0) {
        return new Success(-1);
      }
      ansStartNormalTab.push(undefined);
      ansStartLegatoTab.push(undefined);
    }
  }
  // レガート対象外のフレット指定がある場合、分離
  if (ansStartNormalTab.find(f => f !== undefined) !== undefined) {
    const lastTick = legTOLine[legTOLine.length - 1].bar.stopTick;

    // TabObjの複製
    const clonedTO = XUtilsObject.emptyTabObj(
      legTOLine[0].regionIndex,
      legTOLine[0].tabObjId,
      legTOLine[0].regionNoteIndex,
      legTOLine[0].tab.length
    )
    clonedTO.bar = structuredClone(legTOLine[0].bar);
    clonedTO.syntaxLocation = structuredClone(legTOLine[0].syntaxLocation);
    clonedTO.velocity = structuredClone(legTOLine[0].velocity);
    clonedTO.styles = legTOLine[0].styles;

    flatTOList[startTOIndex + 1].prevTabObj = flatTOList[startTOIndex]
    if (startTOIndex > 0) {
      flatTOList[startTOIndex].prevTabObj = flatTOList[startTOIndex - 1];
    }

    // リストに挿入
    flatTOList.splice(startTOIndex, 0, clonedTO);
    marks.fullNoteIndexWithTick.splice(startTOIndex, 0, marks.fullNoteIndexWithTick[startTOIndex]);

    // 手前追加分正規化
    flatTOList[startTOIndex].regionNoteIndex = -1;
    flatTOList[startTOIndex].tab = ansStartNormalTab;

    // 開始音のノーマル部分のみレガート最終まで音長を伸ばす（continueXがあれば）
    if (flatTOList[startTOIndex].continueX) {
      flatTOList[startTOIndex].bar.stopTick = lastTick;
      flatTOList[startTOIndex].bar.fretStopTicks.forEach((_, i) => {
        if (flatTOList[startTOIndex].bar.fretStopTicks[i] !== undefined) {
          flatTOList[startTOIndex].bar.fretStopTicks[i] = lastTick;
        }
      });
    }

    // レガート分
    flatTOList[startTOIndex + 1].tab = ansStartLegatoTab;
    flatTOList[startTOIndex + 1].tabObjId += 0.1
    flatTOList[startTOIndex + 1].styles.stroke = { off: true } as any
    // レガート配列の開始音リンク変更
    legTOLine[0] = flatTOList[startTOIndex + 1]
    // 追加分進行
    startTOIndex++;
  }

  return new Success(startTOIndex);
}
