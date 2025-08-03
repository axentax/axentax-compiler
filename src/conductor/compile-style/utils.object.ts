import { TabObj } from "../interface/tab";


/**
 * 空のTabObjを作成する
 * @param regionIndex - リージョンインデックス
 * @param tabObjId - TabObjのID
 * @param blockNoteIndex - ブロックノートインデックス
 * @param tuningLen - チューニングの長さ
 * @returns 空のTabObj
 */
export function emptyTabObj(
    regionIndex: number,
    tabObjId: number,
    blockNoteIndex: number,
    tuningLen: number): TabObj {
    return {
      noteStr: '',
      syntaxLocation: undefined as any,
      tabObjId: tabObjId,
      regionIndex: regionIndex,
      regionNoteIndex: blockNoteIndex,
      note: '',
      tab: Array(tuningLen).fill(undefined as any),
      velocity: Array(tuningLen).fill(undefined as any),
      continueX: false,
      styles: {},
      bar: {
        tick: undefined as any,
        fretStartTicks: Array(tuningLen).fill(undefined as any),
        fretStopTicks: Array(tuningLen).fill(undefined as any),
        startTick: undefined as any,
        stopTick: undefined as any
      },
      bpm: -1,
      isArpeggio: false,
      isBullet: 0,
      refMovedSlideTarget: undefined as any,
      activeBows: Array(tuningLen).fill(undefined as any),
      refActiveBows: Array(tuningLen).fill(undefined as any),
      slideLandingTab: undefined as any,
      prevTabObj: undefined as any,
      nextTabObj: undefined as any,

      untilNext: undefined as any,
    };
  }
