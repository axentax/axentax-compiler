import { FingeringCollection } from "../chord-to-fingering/chord-to-fingering";
import { IKey } from "./utils.interface";
export type IdAndSymbolSet = {
    iKeyId: number;
    sym: IKey;
};
export type IdAndSymbolArraySet = {
    iKeyId: number[];
    sym: IKey[];
};
export type Fingerings = {
    positionString: string;
    barre: null | boolean;
    positions: {
        stringIndex: number;
        fret: number;
        note: string;
    }[];
    difficulty: number;
};
/**
 * 回転なしの未加工状態のコード
 */
export interface ChordProp {
    symbol: string;
    intervals: string[];
    notes: IKey[];
    tonic: IdAndSymbolSet;
    bass: IdAndSymbolSet;
    fingerings: FingeringCollection[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * 辞書のマップ
 */
export type ChordDicMap = Map<string, ChordProp>;
