import { IKey } from './interface/utils.interface';

export declare const colon_length = 1;
export declare const percent_length = 1;
/**
 * オブジェクト配列を数値配列に変換
 * @param obj 変換対象の配列
 * @returns 変換された文字列または数値配列
 */
export declare function easyX(obj: any[] | undefined): "" | (number | "")[];
export declare const Base12Sym: {
    [key in IKey]: IKey[];
};
/** 14~88までのオクターブとキー番号(キー0はC) */
export declare const tuningPitch100: {
    id: number;
    oct: number;
    keyNum: number;
    keySym: IKey;
}[];
