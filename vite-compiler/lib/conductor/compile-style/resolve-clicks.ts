import { Conduct } from "../interface/conduct";
import * as XTickUtils from "../utils/x-tick-utils";

/**
 * クリック処理の状態を表す型
 */
type StatusHere = {
  /** 次のクリックまでの範囲 */
  untilRange: number;
  /** 開始ティック */
  startTick: number;
  /** 終了ティック */
  endTick: number;
}

/**
 * クリック解決処理を行うクラス
 */
export class ResolveClicks {

  /**
   * クリック情報を解決する
   * @param conduct 演奏情報
   */
  static resolve(conduct: Conduct) {
    const clickList = conduct.flash.click;
    let status: StatusHere | undefined = undefined;


    const fullNoteIndexWithTick = conduct.mixesList[0].marks.fullNoteIndexWithTick;

    for (const click of clickList) {
      if (click.start) {
        // クリック開始
        if (status === undefined) {
          // 新しいクリック領域の開始
          status = {
            untilRange: XTickUtils.untilNextToTick(click.start.until),
            startTick: fullNoteIndexWithTick[click.start.fullNoteIndex],
            endTick: -1,
          }

        } else {
          // 既存のクリック領域を終了し、新しい領域を開始
          const endTick = fullNoteIndexWithTick[click.start.fullNoteIndex] - 1;
          /* istanbul ignore next: 複数のクリック開始が連続する場合の処理だが、通常の運用では単一のクリック領域が設定される */
          addClicks(conduct, { ...status, ...{ endTick } });

          status = {
            untilRange: XTickUtils.untilNextToTick(click.start.until),
            startTick: fullNoteIndexWithTick[click.start.fullNoteIndex],
            endTick: -1
          }
        }

      } else {
        // クリック停止
        // クリック領域を終了
        if (status) {
          const endTick = fullNoteIndexWithTick[click.stop!.noteIndex] - 1;
          addClicks(conduct, { ...status, ...{ endTick } });
          status = undefined;          
        }
        /* istanbul ignore else: status が undefined の状態で stop が来る場合の防御的処理だが、通常はペア構造が保証される */
      }

    }
    // 残りの処理
    if (status) {
      const endTick = fullNoteIndexWithTick[fullNoteIndexWithTick.length - 1] - 1;
      /* istanbul ignore next: 未完了のクリック処理の終了処理だが、通常は適切に stop が指定される */
      addClicks(conduct, { ...status, ...{ endTick } });
    }
  }
}

/**
 * クリック音を追加する
 * @param conduct 演奏情報
 * @param status クリック状態情報
 */
function addClicks(conduct: Conduct, status: StatusHere) {
  let currentTick = status.startTick;
  let accentCnt = 1;
  const accent = conduct.settings.click.accent;
  const maxAccent = conduct.settings.click.until[1];
  const velocityMin = conduct.settings.click.velocity / 100;
  let velocityMax = conduct.settings.click.velocity / 100 + 0.3;
  if (velocityMax > 1) velocityMax = 1;
  const inst = conduct.settings.click.inst;

  while(currentTick < status.endTick) {
    conduct.clickPointList.push({
      startTick: currentTick,
      inst: inst,
      velocity: accentCnt === accent ? velocityMax : velocityMin,
    })
    currentTick += status.untilRange;

    if (++accentCnt > maxAccent) accentCnt = 1;
  }
}
