import { ScaleEvolverValue } from '../interface/scale';

/**
 * スケール名列挙型
 *
 * 音楽理論で使用される代表的なスケール名を列挙する
 * メジャー、マイナー、ドリアン、ディミニッシュ、ペンタトニックなどを含む
 */
export declare enum ScaleName {
    major = 0,
    minor = 1,
    dorian = 2,
    diminish = 3,
    halfDiminish = 4,
    pentatonic = 5,
    harmonicMinor = 6,
    melodicMinor = 7,
    chromatic = 8
}
/**
 * スケール名配列
 *
 * ScaleName列挙型のキーのみを抽出した配列
 */
export declare const ScaleNameKeys: string[];
/**
 * スケールリスト
 *
 * 各スケール名に対応する12音階のビン配列を定義する
 * bin配列はスケール構成音を2進数で表現（1:使用音、0:非使用音）
 */
export declare const ScaleList: {
    [key in ScaleName]: ScaleEvolverValue;
};
