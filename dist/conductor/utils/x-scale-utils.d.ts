import { StyleScaleX } from "../interface/style";
import { bin12, IKey, NumberOrUfd } from "../interface/utils.interface";
/**
 * XScaleUtils
 */
/**
 * [未使用]スケールの0|1をsymに変換した配列を作成
 */
export declare function bitScaleToSymScale(key: IKey, bin: bin12): (IKey | undefined)[];
/**
 * スケールの0|1をsymに変換した配列を作成（臨時音を追加）
 */
export declare function createExtensionBin(key: IKey, bin: bin12, addKeys: IKey[]): (IKey | undefined)[];
/**
 * fingeringからキーsymと、ノートナンバー(0開始)を取得
 */
export declare function getMidiNoteFromFingering(fingering: NumberOrUfd[], tuningPitches: number[]): {
    /** fingeringの各音のキー名 e.g. ['A#', 'E'] ※12|13||||の場合 */
    originKeyArr: IKey[];
    /** [現状未使用]fingeringの各音のノートナンバー（但し、チューニング最低音を0とした場合の数値） [18, 12] ※12|13||||の場合 */
    originNoteNumArr: number[];
    /** フレット [12, 13] */
    originFretArr: number[];
    /** 弦index */
    originStringArr: number[];
};
/**
 * 有効音のみのindexを値に持った配列
 * @param boardFullArr e.g. ['E',undefined,'F#','G', ..]
 * @returns {
 *   activeInIndexes: 0,  2,  3,  5,  7,  9, 10, 12, 14 のようなスケール有効音だけのリスト
 *   activeInKeys: 上記をキーにしたリスト
 * }
 */
export declare function createActiveNoteOnlyList(boardFullArr: (IKey | undefined)[]): {
    activeInIndexes: number[];
    activeInKeys: IKey[];
};
/**
 * 臨時音をスケールに追加した新しいスケールを作成
 * @param boardFullArr 元スケールの一列ボード e.g. ['E',undefined,'F#','G', ..]
 * @param iKeysWithKeyStart 元スケールの12配列 e.g. ['E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#']
 * @param originKeyArr 新規IKeyの配列 e.g. ['E', 'A#']
 */
export declare function addExtendKeyIntoScale(boardFullArr: (IKey | undefined)[], iKeysWithTuningStart: IKey[], originKeyArr: IKey[]): (IKey | undefined)[];
/**
 * tuningとscaleで、boardFullLine作成
 * @param tuning
 * @param scale
 * @return
 */
export declare function createBoardFullLine(tuningPitches: number[], scale: StyleScaleX, tuningMinKey: IKey): {
    /** スケールの一列ボード e.g. ['E',undefined,'F#','G', ..] */
    boardFullArr: (IKey | undefined)[];
    /** IKey 12 (スケールキーから開始) e.g. ['E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#'] */
    iKeysWithKeyStart: IKey[];
    /** IKey 12 (チューニング最低音から開始) e.g. ['E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#'] */
    iKeysWithTuningStart: IKey[];
};
