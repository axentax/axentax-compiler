import { StyleScaleX } from '../interface/style';
import { bin12, IKey, NumberOrUfd } from '../interface/utils.interface';

/**
 * スケール操作ユーティリティ
 *
 * 音楽スケールの操作に関するユーティリティ関数を提供する
 * スケールの変換、フィンガリング解析、ボード作成などの機能を含む
 *
 * このモジュールは、音楽記譜法のコンパイル処理において、
 * スケール判定、フィンガリング最適化、フレットボード解析などに使用される
 */
/**
 * [未使用]スケールの0|1をsymに変換した配列を作成
 *
 * 2進数表現のスケール（bin12）を音名の配列に変換する
 * 1の位置に対応する音名を設定し、0の位置はundefinedとする
 *
 * 用途：
 * - スケールの2進数表現から音名配列への変換
 * - スケール判定のための音名比較
 * - フレットボードでのスケール音の可視化
 *
 * @param key スケールの開始音
 * @param bin 2進数表現のスケール（12音階の使用可能音を表す）
 * @returns 音名の配列（使用可能音のみ音名、使用不可音はundefined）
 *
 * @example
 * bitScaleToSymScale('C', [1,0,1,0,1,1,0,1,0,1,0,1])
 * // ['C', undefined, 'D', undefined, 'E', 'F', undefined, 'G', undefined, 'A', undefined, 'B']
 */
export declare function bitScaleToSymScale(key: IKey, bin: bin12): (IKey | undefined)[];
/**
 * スケールの0|1をsymに変換した配列を作成（臨時音を追加）
 *
 * 2進数表現のスケールに臨時音を追加して音名の配列を作成する
 * スケールに含まれない音でも、addKeysに指定された音は有効とする
 *
 * 用途：
 * - スケールに臨時音を追加した拡張スケールの作成
 * - ブルーノートやクロマチックアプローチの処理
 * - より豊かな音色表現のためのスケール拡張
 *
 * @param key スケールの開始音
 * @param bin 2進数表現のスケール
 * @param addKeys 追加する臨時音の配列
 * @returns 音名の配列（スケール音+臨時音）
 *
 * @example
 * createExtensionBin('C', [1,0,1,0,1,1,0,1,0,1,0,1], ['C#', 'F#'])
 * // ['C', 'C#', 'D', undefined, 'E', 'F', 'F#', 'G', undefined, 'A', undefined, 'B']
 */
export declare function createExtensionBin(key: IKey, bin: bin12, addKeys: IKey[]): (IKey | undefined)[];
/**
 * フィンガリングからキーsymと、ノートナンバー(0開始)を取得
 *
 * ギターのフィンガリング（押さえ方）から音名、ノート番号、フレット、弦番号を解析する
 * チューニング設定を考慮して、実際の音程を計算する
 *
 * 処理内容：
 * - 各弦のフレット番号からMIDIノート番号を計算
 * - チューニング設定を考慮した音程の算出
 * - ミュート弦（-1）や無音弦（undefined）の除外
 * - 音名、ノート番号、フレット、弦番号の抽出
 *
 * @param fingering フィンガリング配列（各弦のフレット番号、-1はミュート、undefinedは無音）
 * @param tuningPitches チューニング設定のMIDIノート番号配列
 * @returns 解析結果オブジェクト
 *
 * @example
 * getMidiNoteFromFingering([12, 13, undefined, undefined, undefined, undefined], [40, 45, 50, 55, 59, 64])
 * // {
 * //   originKeyArr: ['A#', 'E'],      // 音名
 * //   originNoteNumArr: [18, 12],     // ノート番号（0開始）
 * //   originFretArr: [12, 13],        // フレット番号
 * //   originStringArr: [0, 1]         // 弦番号
 * // }
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
 *
 * スケールの一列ボードから有効音（undefined以外）のみを抽出する
 * 有効音のインデックスと音名の両方を取得できる
 *
 * 用途：
 * - スケール内の有効音のみを抽出
 * - フィンガリング解析での有効音の特定
 * - フレットボードでの有効音の可視化
 *
 * @param boardFullArr スケールの一列ボード e.g. ['E',undefined,'F#','G', ..]
 * @returns 有効音のインデックスと音名の配列
 *
 * @example
 * createActiveNoteOnlyList(['E', undefined, 'F#', 'G', undefined, 'A'])
 * // {
 * //   activeInIndexes: [0, 2, 3, 5],  // 有効音のインデックス
 * //   activeInKeys: ['E', 'F#', 'G', 'A']  // 有効音の音名
 * // }
 */
export declare function createActiveNoteOnlyList(boardFullArr: (IKey | undefined)[]): {
    activeInIndexes: number[];
    activeInKeys: IKey[];
};
/**
 * 臨時音をスケールに追加した新しいスケールを作成
 *
 * 既存のスケールに臨時音を追加して、拡張されたスケールを作成する
 * 元のスケールに含まれない音を追加することで、より豊かな音色を表現できる
 *
 * 用途：
 * - ブルーノートの追加
 * - クロマチックアプローチの処理
 * - スケールの拡張による表現力の向上
 *
 * @param boardFullArr 元スケールの一列ボード e.g. ['E',undefined,'F#','G', ..]
 * @param iKeysWithKeyStart 元スケールの12配列 e.g. ['E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#']
 * @param originKeyArr 新規IKeyの配列 e.g. ['E', 'A#']
 * @returns 拡張されたスケールの一列ボード
 *
 * @example
 * addExtendKeyIntoScale(
 *   ['E', undefined, 'F#', 'G', undefined, 'A'],
 *   ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
 *   ['A#', 'C#']
 * )
 * // ['E', undefined, 'F#', 'G', undefined, 'A', 'A#', undefined, 'C#', undefined, undefined, undefined]
 */
export declare function addExtendKeyIntoScale(boardFullArr: (IKey | undefined)[], iKeysWithTuningStart: IKey[], originKeyArr: IKey[]): (IKey | undefined)[];
/**
 * チューニングとスケールで、ボードフルライン作成
 *
 * ギターのチューニング設定とスケール情報から、フレットボード全体の音名配列を作成する
 * 最低音から最高音まで、スケールに基づいて音名を配置する
 *
 * 処理の流れ：
 * 1. スケールの2進数表現から音名配列を作成
 * 2. チューニングの最低音と最高音の範囲を計算
 * 3. スケールを12音階単位で繰り返してフレットボード全体を埋める
 * 4. チューニングの最低音から開始するように調整
 *
 * 用途：
 * - フレットボード全体のスケール音の可視化
 * - フィンガリング最適化のための音程情報提供
 * - スケール判定のための基準データ作成
 *
 * @param tuningPitches チューニング設定のMIDIノート番号配列
 * @param scale スケール設定
 * @param tuningMinKey チューニングの最低音
 * @returns ボード情報オブジェクト
 *
 * @example
 * createBoardFullLine([40, 45, 50, 55, 59, 64], {key: 'C', scale: 'major', bin: [1,0,1,0,1,1,0,1,0,1,0,1]}, 'E')
 * // {
 * //   boardFullArr: ['E', undefined, 'F#', 'G', undefined, 'A', undefined, 'B', 'C', undefined, 'D', undefined, ...],
 * //   iKeysWithKeyStart: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
 * //   iKeysWithTuningStart: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#']
 * // }
 */
export declare function createBoardFullLine(tuningPitches: number[], scale: StyleScaleX, tuningMinKey: IKey): {
    /** スケールの一列ボード e.g. ['E',undefined,'F#','G', ..] */
    boardFullArr: (IKey | undefined)[];
    /** IKey 12 (スケールキーから開始) e.g. ['E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#'] */
    iKeysWithKeyStart: IKey[];
    /** IKey 12 (チューニング最低音から開始) e.g. ['E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#'] */
    iKeysWithTuningStart: IKey[];
};
