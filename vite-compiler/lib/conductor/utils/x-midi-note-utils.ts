import { IKey } from "../interface/utils.interface";
import { Base12Sym } from "../utils.vers";

/**
 * MIDIノート操作ユーティリティ
 * 
 * MIDIノート番号と音楽記譜法の音名との変換に関するユーティリティ関数を提供する
 * チューニング設定からMIDIノート番号への変換機能を含む
 * 
 * このモジュールは、ギターのチューニング設定をMIDIノート番号に変換し、
 * 実際の演奏データの生成に必要な音高情報を提供する
 */

/**
 * チューニング設定から各弦の開始MIDIノート番号を取得
 * 
 * ギターのチューニング設定（例：EADGBE）をMIDIノート番号の配列に変換する
 * 各弦の開放弦のMIDIノート番号を計算して返す
 * 
 * 処理の流れ：
 * 1. 各弦の標準的な音名とMIDIノート番号のマッピングを定義
 * 2. 指定されたチューニングの各音名を12音階での位置に変換
 * 3. 基準音からの半音の差を計算してMIDIノート番号を算出
 * 4. 6弦から1弦の順序でMIDIノート番号の配列を返す
 * 
 * 例：通常のチューニング E|A|D|G|B|E の場合、[40, 45, 50, 55, 59, 64] を返す
 * （6弦から1弦の順序、MIDIノート番号は中央C=60を基準とする）
 * 
 * @param tuning チューニング設定の配列（6弦から1弦の順序）
 * @returns 各弦のMIDIノート番号の配列（6弦から1弦の順序）
 * 
 * @example
 * tuningToStringPitch(['E', 'A', 'D', 'G', 'B', 'E']) // [40, 45, 50, 55, 59, 64]
 * tuningToStringPitch(['D', 'G', 'C', 'F', 'A', 'D']) // [38, 43, 48, 53, 57, 62] (ドロップDチューニング)
 */
export function tuningToStringPitch(tuning: IKey[]) {

  // 基準となる音名とMIDIノート番号のマッピング
  // 各弦の標準的な音名とそのMIDIノート番号を定義
  // 6弦ギターから9弦ギターまで対応
  const pitches: { sym: IKey, note: number }[] = [
    { sym: 'E', note: 64 }, // 1弦E（高音弦）
    { sym: 'B', note: 59 }, // 2弦B
    { sym: 'G', note: 55 }, // 3弦G
    { sym: 'D', note: 50 }, // 4弦D
    { sym: 'A', note: 45 }, // 5弦A
    { sym: 'E', note: 40 }, // 6弦E（低音弦）
    { sym: 'B', note: 35 }, // 7弦B（7弦ギター用）
    { sym: 'F#', note: 30 }, // 8弦F#（8弦ギター用）
    { sym: 'C#', note: 25 }, // 9弦C#（9弦ギター用）
  ]

  const tuningPitch: number[] = [];
  for (let ti = 0; ti < tuning.length; ti++) {
    // 12音階での音名の位置を取得（C=0, C#=1, D=2, ...）
    const base = Base12Sym[tuning[ti]];
    // 弦番号（0ベース、6弦=0, 1弦=5）
    const bowName = tuning.length - ti - 1;
    // 基準音からの半音の差を計算
    const diff = base.indexOf(pitches[bowName].sym);
    // MIDIノート番号を計算（基準音 - 半音の差）
    const pitch = pitches[bowName].note - diff;
    // 配列の先頭に追加（6弦から1弦の順序を維持）
    tuningPitch.unshift(pitch);
  }

  // console.log('tuningPitch>', tuningPitch);
  return tuningPitch;
}
