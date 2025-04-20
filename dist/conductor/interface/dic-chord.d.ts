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
 * Chord in the raw state without rotation
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
 * map of Dictionary
 */
export type ChordDicMap = Map<string, ChordProp>;
