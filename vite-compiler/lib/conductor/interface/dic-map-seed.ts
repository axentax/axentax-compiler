import { IKey } from "./utils.interface";

/**
 * チューニングとスケールから作成する指板note情報
 */
export type BoardForShiftSeed = {
  /** チューニングの弦毎の差分 [ 24, 19, 15, 10, 5, 0 ] */
  tuningPitches: number[];
  /** 一列ボード ['E',undefined, 'F#', 'G' ..] */
  boardFullArr: (IKey | undefined)[];
  /** IKey 12 (スケールキーから開始) 'E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#' */
  iKeysWithKeyStart: IKey[],
  /** IKey 12 (チューニング最低音から開始) 'E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#' */
  iKeysWithTuningStart: IKey[]
};

/**
 * チューニングとスケールから作成する指板note情報
 */
export type MapSeed = { [keys:string]: BoardForShiftSeed };
