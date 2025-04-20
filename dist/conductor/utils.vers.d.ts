import { IKey } from "./interface/utils.interface";
export declare const colon_length = 1;
export declare const percent_length = 1;
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
