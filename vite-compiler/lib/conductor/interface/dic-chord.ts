import { FingeringCollection } from "../chord-to-fingering/chord-to-fingering";
import { IKey } from "./utils.interface";

export type IdAndSymbolSet = {
  iKeyId: number;
  sym: IKey
}

export type IdAndSymbolArraySet = {
  iKeyId: number[],
  sym: IKey[]
}

export type Fingerings = {
  positionString: string,
  barre: null | boolean;
  positions: { stringIndex: number; fret: number; note: string; }[];
  difficulty: number;
};

/**
 * 回転なしの未加工状態のコード
 */
export interface ChordProp {
  symbol: string;
  intervals: string[];
  notes: IKey[];
  // optionalNotes: IKey[];
  // requiredNotes: IKey[];
  // requiredIntervals: IKey[],
  // bin: bin12,
  tonic: IdAndSymbolSet;
  bass: IdAndSymbolSet;
  // form: (number | undefined)[]
  fingerings: FingeringCollection[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 辞書のマップ
 */
export type ChordDicMap = Map<string, ChordProp>;
