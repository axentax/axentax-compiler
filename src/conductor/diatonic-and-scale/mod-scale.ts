import { ScaleEvolverValue } from "../interface/scale";

/**
 * スケール名列挙型
 * 
 * 音楽理論で使用される代表的なスケール名を列挙する
 * メジャー、マイナー、ドリアン、ディミニッシュ、ペンタトニックなどを含む
 */
export enum ScaleName {
  major,
  minor,
  dorian,
  diminish,
  halfDiminish,
  pentatonic,
  harmonicMinor,
  melodicMinor,
  chromatic
}

/**
 * スケール名配列
 * 
 * ScaleName列挙型のキーのみを抽出した配列
 */
export const ScaleNameKeys = Object.keys(ScaleName).filter(
  (key) => isNaN(Number(key)) && !isNaN(ScaleName[key as keyof typeof ScaleName]));

/**
 * スケールリスト
 * 
 * 各スケール名に対応する12音階のビン配列を定義する
 * bin配列はスケール構成音を2進数で表現（1:使用音、0:非使用音）
 */
export const ScaleList: {
  [key in ScaleName]: ScaleEvolverValue
} = {
  [ScaleName.major]: {
    bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
  },
  [ScaleName.minor]: {
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
  },
  [ScaleName.dorian]: {
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0]
  },
  [ScaleName.diminish]: {
    bin: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1]
  },
  [ScaleName.halfDiminish]: {
    bin: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]
  },
  [ScaleName.pentatonic]: {
    bin: [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0]
  },
  [ScaleName.harmonicMinor]: {
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1]
  },
  [ScaleName.melodicMinor]: {
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1]
  },
  [ScaleName.chromatic]: {
    bin: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
}

