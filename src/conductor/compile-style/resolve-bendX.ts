import { Bend, BendView } from "../interface/bend";
import { Mixes } from "../interface/conduct";
import { BendCurveX, ESInst, StyleBendX } from "../interface/style";
import { TabObj, Tick } from "../interface/tab";
import { UntilRange } from "../interface/utils.interface";
import { ErrorBase, IResult, SimpleResult, Success, simpleSuccess } from "../interface/utils.response.interface";
import * as XTickUtils from "../utils/x-tick-utils";
import * as Curves from "./utils.curves";

/**
 * ベンド範囲情報
 */
type RangeInfo = {
  /** 開始ティック */
  startTick: number,
  /** 終了ティック */
  stopTick: number
}

/**
 * 現在のベンド情報
 */
type CurrentInfo = {
  /** 指定のベンド音程 */
  specifiedPitch: number;
  /** untilの[0]の推移 */
  untilStep: number
}

/**
 * ベンドX解決処理を行うクラス
 */
export class ResolveBendX {

  /**
   * ベンドX情報を解決する
   * @param mixes ミックス情報
   * @returns 処理結果
   */
  static resolve(mixes: Mixes): SimpleResult {
    const { flatTOList } = mixes;

    // 各flatTOListの処理
    for (let ti = 0; ti < flatTOList.length; ti++) {
      const to = flatTOList[ti];
      const styleBendXList = to.styles.bd;
      if (styleBendXList && styleBendXList.length) {
        const existTab = to.tab.filter(f => f !== undefined).length > 0;
        // 対象フレットが無い。且つ、音続き（前の音のcontinue）がない適用の必要ないケース
        if (!to.continueX && !existTab) continue;

        // 適用
        const bendBank = mixes.bendBank;
        const resChoking = core(bendBank, to, styleBendXList);
        if (resChoking.fail()) return resChoking;
      }
    }

    return simpleSuccess();
  }
}

/**
 * ビュー用ベンドデータを生成する
 * @param bar バー情報
 * @param styleBendXList ベンドXスタイルリスト
 * @returns ベンドチャンネルリスト
 */
export function bdView (
  bar: Tick,
  styleBendXList: StyleBendX[]
) {
  const bendBank: Mixes['bendBank'] = {
    bendNormalList: [],
    bendChannelList: []
  }

  const to: TabObj = {
    tabObjId: -1,
    bar,
    styles: {
      inst: ESInst.normal
    }
  } as TabObj

  // 破壊的変更があるためstructuredClone必須
  core(bendBank, to, structuredClone(styleBendXList))

  return bendBank.bendChannelList;
}

/**
 * ベンド処理のコア処理
 * @param bendBank ベンドバンク
 * @param to 対象TabObj
 * @param styleBendXList ベンドXスタイルリスト
 * @returns 処理結果
 */
function core(bendBank: Mixes['bendBank'], to: TabObj, styleBendXList: StyleBendX[]): SimpleResult {

  const currentInfo: CurrentInfo = {
    specifiedPitch: 0,
    untilStep: 0
  };
  const bendView: BendView = {
    view: [],
    bend: []
  };
  let hasNormalIntoBend = false;

  // ミュート有無
  const hasMute = to.styles.inst === undefined || to.styles.inst === ESInst.normal ? false : true;

  // 解決処理
  for (let bi = 0; bi < styleBendXList.length; bi++) {
    const styleBend = styleBendXList[bi];

    const resChoking = makeBend(currentInfo, to, styleBend, bendView);
    if (resChoking.fail()) return resChoking;

    currentInfo.untilStep = styleBend.untilRange[0];
    if (resChoking.res.length) {
      // MIDI用
      bendBank.bendChannelList.push({ bend: resChoking.res, hasMute, tabObjId: to.tabObjId });
      // ビュー用
      bendView.bend.push(resChoking.res);
      // チョーキングダウンする時はアーミングしか考えられないので
      // 上記結果で、pitchが0以下のものはnormal側のチャンネルにも全て追加する
      // 但し、continueXの場合のみ
      if (to.continueX) {
        const lessThan0Bend: Bend[] = [];
        resChoking.res.forEach((bd, i) => {
          if (bd.pitch <= 0) {
            if (resChoking.res.length - 1 > i && resChoking.res[i + 1].pitch > 0) {
              // 途中でpitchが+になるケース
              // 0ピッタリで終わらないので、normal側の最終tickは0に変更する
              lessThan0Bend.push({ tick: bd.tick, pitch: 0 });
            } else {
              // 通常音推移（レガートではない場合のみ）
              if (!to.styles.legato) {
                hasNormalIntoBend = true;
                lessThan0Bend.push(bd)
              }
            }
          }
        });
        if (lessThan0Bend.length) {
          // 多重配列なので本追加
          bendBank.bendNormalList.push({ bend: lessThan0Bend, hasMute, tabObjId: to.tabObjId });
        }
      }
    }
  }

  // ノートの最後でnormal側は0に戻す
  if (hasNormalIntoBend) {
    // continueXで伸びることを想定しfretTickを確認
    const lastTick = Math.max(...to.bar.fretStopTicks.map(f => f !== undefined ? f : -1));
    if (lastTick >= 0) {
      bendBank.bendNormalList.push({ bend: [{ tick: lastTick, pitch: 0 }], hasMute, tabObjId: to.tabObjId });
    }
  }


  return simpleSuccess();
}

/**
 * ベンドを作成する
 * @param currentInfo 現在のベンド情報
 * @param to 対象TabObj
 * @param bend ベンドXスタイル
 * @param bendView ベンドビュー
 * @returns ベンド配列
 */
function makeBend(currentInfo: CurrentInfo, to: TabObj, bend: StyleBendX, bendView: BendView): IResult<Bend[], ErrorBase> {

  if (bend.method === undefined) {
    return choking(currentInfo, to, bend, bendView);
  
  } else {
    const defaultVibPitch = 0.3;
    if (bend.pitch === undefined) {
      if (currentInfo.specifiedPitch === 0) {
        bend.pitch = defaultVibPitch;
      } else if (currentInfo.specifiedPitch > 0) {
        bend.pitch = currentInfo.specifiedPitch - defaultVibPitch;
      } else {
        bend.pitch = currentInfo.specifiedPitch + defaultVibPitch;
      }
    }
    return vibrate(currentInfo, to, bend, bendView);
  }
}

/**
 * チョーキング処理
 * @param currentInfo 現在のベンド情報
 * @param to 対象TabObj
 * @param bend ベンドXスタイル
 * @param bendView ベンドビュー
 * @returns ベンド配列
 */
function choking(currentInfo: CurrentInfo, to: TabObj, bend: StyleBendX, bendView: BendView): IResult<Bend[], ErrorBase> {
  const bendRes: Bend[] = [];

  // 適用範囲の検出
  const ranges = getBendRangeWithStaticRangeForChoking(to, bend.untilRange);
  if (ranges.fail()) return ranges;

  // 適用範囲がある場合のみ処理
  if (ranges.res !== undefined) {

    // ベンド処理
    if (ranges.res.startTick === ranges.res.stopTick) {
      // 1点
      bendRes.push({ tick: ranges.res.startTick - 1, pitch: Curves.normalizeBandVal(currentInfo.specifiedPitch) });
      bendRes.push({ tick: ranges.res.startTick, pitch: Curves.normalizeBandVal(bend.pitch) });
    } else {
      // 曲線適用
      bend.curve !== BendCurveX.ast
        ? Curves.makeHrefBend(bendRes, ranges.res.startTick, ranges.res.stopTick, currentInfo.specifiedPitch, bend.pitch)
        : Curves.makeHrefBendAst(bendRes, ranges.res.startTick, ranges.res.stopTick, currentInfo.specifiedPitch, bend.pitch);
    }

    bendView.view.push({
      startTick: ranges.res.startTick,
      stopTick: ranges.res.stopTick,
      row: bend.row,
      line: bend.line,
      linePos: bend.linePos
    });

  }
  currentInfo.specifiedPitch = bend.pitch;

  return new Success(bendRes);
}

/**
 * ビブラート処理
 * @param currentInfo 現在のベンド情報
 * @param to 対象TabObj
 * @param bend ベンドXスタイル
 * @param bendView ベンドビュー
 * @returns ベンド配列
 */
function vibrate(currentInfo: CurrentInfo, to: TabObj, bend: StyleBendX, bendView: BendView): IResult<Bend[], ErrorBase> {
  const bendRes: Bend[] = [];

  let transitionPitch = false;

  // 末端まで指定
  if (bend.untilRange[1] === -1) {
    // 全体のティック数を算出
    const oneStepByUserDenom = XTickUtils.untilNextToTick([1, bend.untilRange[2]]);
    const tailMoleculeNumber = to.bar.tick / oneStepByUserDenom;
    bend.untilRange[1] = tailMoleculeNumber;
  }

  // 推移数量分処理
  for (let i = bend.untilRange[0]; i < bend.untilRange[1]; i++) {

    // 適用範囲の検出
    const ranges = getBendRangeWithStaticRangeForVibrate(to, [i, i + 1, bend.untilRange[2]]);
    if (ranges.fail()) return ranges;

    // 適用範囲がある場合のみ処理
    if (ranges.res !== undefined) {
      // 曲線適用
      if (!transitionPitch) {
        // 上方向
        bend.curve !== BendCurveX.ast
          ? Curves.makeHrefBend(bendRes, ranges.res.startTick, ranges.res.stopTick, currentInfo.specifiedPitch, bend.pitch)
          : Curves.makeHrefBendAst(bendRes, ranges.res.startTick, ranges.res.stopTick, currentInfo.specifiedPitch, bend.pitch);
      } else {
        // 下方向
        bend.curve !== BendCurveX.ast
          ? Curves.makeHrefBend(bendRes, ranges.res.startTick, ranges.res.stopTick, bend.pitch, currentInfo.specifiedPitch)
          : Curves.makeHrefBendAst(bendRes, ranges.res.startTick, ranges.res.stopTick, bend.pitch, currentInfo.specifiedPitch);
      }
      bendView.view.push({
        startTick: ranges.res.startTick,
        stopTick: ranges.res.stopTick,
        row: bend.row,
        line: bend.line,
        linePos: bend.linePos
      });

      transitionPitch = transitionPitch ? false : true;
    }

  }
  currentInfo.specifiedPitch = transitionPitch ? bend.pitch : currentInfo.specifiedPitch;

  return new Success(bendRes);
}

/**
 * チョーキング用のベンド稼働可能範囲の検出
 * @param to 対象TabObj
 * @param untilRange 範囲指定
 * @returns 範囲情報
 */
function getBendRangeWithStaticRangeForChoking(to: TabObj, untilRange: UntilRange): IResult<RangeInfo | undefined, ErrorBase> {
  // const rangeInfo: RangeInfo = {} as RangeInfo;

  // 基本noteのtick範囲
  // const fullRange = to.bar.stopTick - to.bar.startTick;

  // ..
  const baseTick = XTickUtils.untilNextToTick([1, untilRange[2]]);

  // 指定範囲
  let userStartTick = to.bar.startTick + baseTick * untilRange[0];
  let userStopTick = -1;
  if (untilRange[1] === -1) {
    userStopTick = to.bar.stopTick;
  } else if (untilRange[1] === -2) { // 'reset'指定対応
    userStartTick = to.bar.stopTick;
    userStopTick = to.bar.stopTick;
  } else {
    userStopTick = to.bar.startTick + baseTick * untilRange[1];
  }

  // 稼働可能範囲
  let startAbleTick = Math.max(...to.bar.fretStartTicks.map(t => t !== undefined ? t : -1));
  const fretStopTicks = to.bar.fretStopTicks.filter(t => t !== undefined) as number[];
  let stopAbleTick = fretStopTicks.length
    ? Math.min(...to.bar.fretStopTicks.filter(t => t !== undefined) as any)
    : -1;

  // note自体にbend稼働可能範囲がない -> 整合しない指定としてエラーにする
  if (startAbleTick === -1 || stopAbleTick <= startAbleTick) {
    startAbleTick = to.bar.startTick;
    stopAbleTick = to.bar.stopTick;
  }

  // bend稼働範囲に全く入ってない -> 適用しないが currentInfo.specifiedPitch を設定し継続
  if (userStopTick < startAbleTick || userStartTick > stopAbleTick) {
    // ----- 一時コメントアウト（対応方法を別途検討）-----
    // conduct.warnings.push({
    //   line, pos: linePos,
    //   message: `bend稼働範囲に全く入ってない.`
    // });
    return new Success(undefined);
  }

  // 範囲調整
  if (userStopTick > stopAbleTick) {
    userStopTick = stopAbleTick;
    // ----- 一時コメントアウト（対応方法を別途検討）-----
    // conduct.warnings.push({
    //   line, pos: linePos,
    //   message: `bend終了地点が他のstyleに侵食されている.`
    // });
  }
  if (userStartTick < startAbleTick) {
    userStartTick = startAbleTick;
    // ----- 一時コメントアウト（対応方法を別途検討）-----
    // conduct.warnings.push({
    //   line, pos: linePos,
    //   message: `bend開始地点が他のstyleに侵食されている.`
    // });
  }

  // ---
  // --- 範囲調整した場合、適用範囲外の部分にもダミー配列無いと、グラフには現れない
  // --- グラフ側で対応するか（pitch維持範囲も然り）
  // ---
  return new Success({
    startTick: userStartTick,
    stopTick: userStopTick
  });
}

/**
 * ビブラート用のベンド稼働可能範囲の検出
 * @param to 対象TabObj
 * @param untilRange 範囲指定
 * @returns 範囲情報
 */
function getBendRangeWithStaticRangeForVibrate(to: TabObj, untilRange: UntilRange): IResult<RangeInfo | undefined, ErrorBase> {
  const baseTick = XTickUtils.untilNextToTick([1, untilRange[2]]);

  // 指定範囲
  let userStartTick = to.bar.startTick + baseTick * untilRange[0];
  let userStopTick = -1;
  if (untilRange[1] === -1) {
    userStopTick = to.bar.stopTick;
  } else {
    userStopTick = to.bar.startTick + baseTick * untilRange[1];
  }

  // 稼働可能範囲
  let startAbleTick = Math.max(...to.bar.fretStartTicks.map(t => t !== undefined ? t : -1));
  const fretStopTicks = to.bar.fretStopTicks.filter(t => t !== undefined) as number[];
  let stopAbleTick = fretStopTicks.length
    ? Math.min(...to.bar.fretStopTicks.filter(t => t !== undefined) as any)
    : -1;

  // note自体にbend稼働可能範囲がない
  if (startAbleTick === -1 || stopAbleTick <= startAbleTick) {
    startAbleTick = to.bar.startTick;
    stopAbleTick = to.bar.stopTick;
    // return new E400(line, linePos,
    //   `'${to.note}' is no range that can be bend.`);
    // return new Success(undefined);
  }

  // bend稼働範囲に全く入ってない
  if (userStopTick < startAbleTick || userStartTick > stopAbleTick) {
    return new Success(undefined);
  }

  // 範囲調整
  if (userStopTick > stopAbleTick) userStopTick = stopAbleTick;
  if (userStartTick < startAbleTick) userStartTick = startAbleTick;

  // console.log(untilRange, "user", userStartTick, userStopTick, "able", startAbleTick, stopAbleTick)
  return new Success({
    startTick: userStartTick,
    stopTick: userStopTick
  });
}
