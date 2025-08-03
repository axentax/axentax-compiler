import { IKey } from "./interface/utils.interface";

export const colon_length = 1;
export const percent_length = 1;

/**
 * オブジェクト配列を数値配列に変換
 * @param obj 変換対象の配列
 * @returns 変換された文字列または数値配列
 */
export function easyX(obj: any[] | undefined) {
  if (obj === undefined) return '';
  return obj.map(m => m === undefined ? '' : Math.floor(m))
}

export const Base12Sym: { [key in IKey]: IKey[] } = {
  'E': [ 'E',  'F',  'F#', 'G', 'G#', 'A',  'A#', 'B', 'C',  'C#', 'D',  'D#' ],
  'F': [ 'F',  'F#', 'G',  'G#', 'A', 'A#',  'B',  'C', 'C#', 'D',  'D#', 'E' ],
  'F#': [ 'F#', 'G',  'G#', 'A', 'A#', 'B',  'C',  'C#', 'D',  'D#', 'E',  'F' ],
  'G': [ 'G',  'G#', 'A',  'A#', 'B', 'C',  'C#', 'D', 'D#', 'E',  'F',  'F#' ],
  'G#': [ 'G#', 'A',  'A#', 'B', 'C', 'C#', 'D', 'D#', 'E',  'F',  'F#', 'G' ],
  'A': [ 'A',  'A#', 'B',  'C', 'C#', 'D', 'D#', 'E',  'F',  'F#', 'G',  'G#' ],
  'A#': [ 'A#', 'B',  'C',  'C#', 'D', 'D#', 'E',  'F',  'F#', 'G',  'G#', 'A' ],
  'B': [ 'B',  'C',  'C#', 'D', 'D#', 'E',  'F',  'F#', 'G',  'G#', 'A',  'A#' ],
  'C': [ 'C',  'C#', 'D',  'D#', 'E', 'F',  'F#', 'G', 'G#', 'A',  'A#', 'B' ],
  'C#': [ 'C#', 'D',  'D#', 'E', 'F', 'F#', 'G',  'G#', 'A',  'A#', 'B',  'C' ],
  'D': [ 'D',  'D#', 'E',  'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',  'C',  'C#' ],
  'D#': [ 'D#', 'E',  'F',  'F#', 'G', 'G#', 'A', 'A#', 'B',  'C',  'C#', 'D' ]
};

/** 14~88までのオクターブとキー番号(キー0はC) */
export const tuningPitch100: {
  id: number, oct: number, keyNum: number, keySym: IKey
}[] = [
    { id: 0, oct: 0, keyNum: 0, keySym: 'C' },
    { id: 1, oct: 0, keyNum: 1, keySym: 'C#' },
    { id: 2, oct: 0, keyNum: 2, keySym: 'D' },
    { id: 3, oct: 0, keyNum: 3, keySym: 'D#' },
    { id: 4, oct: 0, keyNum: 4, keySym: 'E' },
    { id: 5, oct: 0, keyNum: 5, keySym: 'F' },
    { id: 6, oct: 0, keyNum: 6, keySym: 'F#' },
    { id: 7, oct: 0, keyNum: 7, keySym: 'G' },
    { id: 8, oct: 0, keyNum: 8, keySym: 'G#' },
    { id: 9, oct: 0, keyNum: 9, keySym: 'A' },
    { id: 10, oct: 0, keyNum: 10, keySym: 'A#' },
    { id: 11, oct: 0, keyNum: 11, keySym: 'B' },
    { id: 12, oct: 1, keyNum: 0, keySym: 'C' },
    { id: 13, oct: 1, keyNum: 1, keySym: 'C#' },

    { id: 14, oct: 1, keyNum: 2, keySym: 'D' },
    { id: 15, oct: 1, keyNum: 3, keySym: 'D#' },
    { id: 16, oct: 1, keyNum: 4, keySym: 'E' },
    { id: 17, oct: 1, keyNum: 5, keySym: 'F' },
    { id: 18, oct: 1, keyNum: 6, keySym: 'F#' },
    { id: 19, oct: 1, keyNum: 7, keySym: 'G' },
    { id: 20, oct: 1, keyNum: 8, keySym: 'G#' },
    { id: 21, oct: 1, keyNum: 9, keySym: 'A' },
    { id: 22, oct: 1, keyNum: 10, keySym: 'A#' },
    { id: 23, oct: 1, keyNum: 11, keySym: 'B' },

    { id: 24, oct: 2, keyNum: 0, keySym: 'C' },
    { id: 25, oct: 2, keyNum: 1, keySym: 'C#' },
    { id: 26, oct: 2, keyNum: 2, keySym: 'D' },
    { id: 27, oct: 2, keyNum: 3, keySym: 'D#' },
    { id: 28, oct: 2, keyNum: 4, keySym: 'E' },
    { id: 29, oct: 2, keyNum: 5, keySym: 'F' },
    { id: 30, oct: 2, keyNum: 6, keySym: 'F#' },
    { id: 31, oct: 2, keyNum: 7, keySym: 'G' },
    { id: 32, oct: 2, keyNum: 8, keySym: 'G#' },
    { id: 33, oct: 2, keyNum: 9, keySym: 'A' },
    { id: 34, oct: 2, keyNum: 10, keySym: 'A#' },
    { id: 35, oct: 2, keyNum: 11, keySym: 'B' },

    { id: 36, oct: 3, keyNum: 0, keySym: 'C' },
    { id: 37, oct: 3, keyNum: 1, keySym: 'C#' },
    { id: 38, oct: 3, keyNum: 2, keySym: 'D' },
    { id: 39, oct: 3, keyNum: 3, keySym: 'D#' },
    { id: 40, oct: 3, keyNum: 4, keySym: 'E' },
    { id: 41, oct: 3, keyNum: 5, keySym: 'F' },
    { id: 42, oct: 3, keyNum: 6, keySym: 'F#' },
    { id: 43, oct: 3, keyNum: 7, keySym: 'G' },
    { id: 44, oct: 3, keyNum: 8, keySym: 'G#' },
    { id: 45, oct: 3, keyNum: 9, keySym: 'A' },
    { id: 46, oct: 3, keyNum: 10, keySym: 'A#' },
    { id: 47, oct: 3, keyNum: 11, keySym: 'B' },

    { id: 48, oct: 4, keyNum: 0, keySym: 'C' },
    { id: 49, oct: 4, keyNum: 1, keySym: 'C#' },
    { id: 50, oct: 4, keyNum: 2, keySym: 'D' },
    { id: 51, oct: 4, keyNum: 3, keySym: 'D#' },
    { id: 52, oct: 4, keyNum: 4, keySym: 'E' },
    { id: 53, oct: 4, keyNum: 5, keySym: 'F' },
    { id: 54, oct: 4, keyNum: 6, keySym: 'F#' },
    { id: 55, oct: 4, keyNum: 7, keySym: 'G' },
    { id: 56, oct: 4, keyNum: 8, keySym: 'G#' },
    { id: 57, oct: 4, keyNum: 9, keySym: 'A' },
    { id: 58, oct: 4, keyNum: 10, keySym: 'A#' },
    { id: 59, oct: 4, keyNum: 11, keySym: 'B' },

    { id: 60, oct: 5, keyNum: 0, keySym: 'C' },
    { id: 61, oct: 5, keyNum: 1, keySym: 'C#' },
    { id: 62, oct: 5, keyNum: 2, keySym: 'D' },
    { id: 63, oct: 5, keyNum: 3, keySym: 'D#' },
    { id: 64, oct: 5, keyNum: 4, keySym: 'E' },
    { id: 65, oct: 5, keyNum: 5, keySym: 'F' },
    { id: 66, oct: 5, keyNum: 6, keySym: 'F#' },
    { id: 67, oct: 5, keyNum: 7, keySym: 'G' },
    { id: 68, oct: 5, keyNum: 8, keySym: 'G#' },
    { id: 69, oct: 5, keyNum: 9, keySym: 'A' },
    { id: 70, oct: 5, keyNum: 10, keySym: 'A#' },
    { id: 71, oct: 5, keyNum: 11, keySym: 'B' },

    { id: 72, oct: 6, keyNum: 0, keySym: 'C' },
    { id: 73, oct: 6, keyNum: 1, keySym: 'C#' },
    { id: 74, oct: 6, keyNum: 2, keySym: 'D' },
    { id: 75, oct: 6, keyNum: 3, keySym: 'D#' },
    { id: 76, oct: 6, keyNum: 4, keySym: 'E' },
    { id: 77, oct: 6, keyNum: 5, keySym: 'F' },
    { id: 78, oct: 6, keyNum: 6, keySym: 'F#' },
    { id: 79, oct: 6, keyNum: 7, keySym: 'G' },
    { id: 80, oct: 6, keyNum: 8, keySym: 'G#' },
    { id: 81, oct: 6, keyNum: 9, keySym: 'A' },
    { id: 82, oct: 6, keyNum: 10, keySym: 'A#' },
    { id: 83, oct: 6, keyNum: 11, keySym: 'B' },

    { id: 84, oct: 6, keyNum: 0, keySym: 'C' },
    { id: 85, oct: 6, keyNum: 1, keySym: 'C#' },
    { id: 86, oct: 6, keyNum: 2, keySym: 'D' },
    { id: 87, oct: 6, keyNum: 3, keySym: 'D#' },
    { id: 88, oct: 6, keyNum: 4, keySym: 'E' },
  ];
