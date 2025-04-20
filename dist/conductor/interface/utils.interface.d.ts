export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};
export interface SyntaxLocation {
    row?: string;
    line: number;
    linePos: number;
    endLine?: number;
    endPos?: number;
}
export type UntilNext = [number, number];
export type UntilRange = [number, number, number];
export type NumberOrUfd = (number | undefined);
export type StringOrUdf = (string | undefined);
export type IKey = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";
export type UserIKey = null | "C" | "Cb" | "C#" | "D" | "Db" | "D#" | "E" | "Eb" | "E#" | "F" | "Fb" | "F#" | "G" | "Gb" | "G#" | "A" | "Ab" | "A#" | "B" | "Bb" | "B#";
export declare const key: Record<IKey, IKey>;
export type IKeyIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export declare enum Scale {
    'normal' = "",
    'harmonic' = "harmonic",
    'melodic' = "melodic"
}
export declare enum Tonality {
    'unknown' = "",
    'major' = "major",
    'minor' = "minor"
}
export type IShiftMax7 = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare const shiftMax7: Record<IShiftMax7, IShiftMax7>;
export type bt = 1;
export type bf = 0;
export type bin = bt | bf;
export type bin7 = [bin, bin, bin, bin, bin, bin, bin];
export type bin12 = [bin, bin, bin, bin, bin, bin, bin, bin, bin, bin, bin, bin];
export type Fret = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
