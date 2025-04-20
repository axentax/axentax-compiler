import { IKey, NumberOrUfd } from "../interface/utils.interface";
/** options受諾用 */
export interface ExpandFingeringOptions {
    /** 難易度閾値 - default: 3 */
    difficulty?: number;
    /** コードルート音の最大フレット */
    maxSearchRootFret?: number;
    /** ルートの次の完全5度不要 */
    notRequiredPerfectFifth?: boolean | null;
    /** 解放弦を広い範囲で使用する */
    wideUseOpenString?: boolean | null;
    /** 結果並べ替え */
    sortByPosition?: 'high' | 'low' | null;
    /** フォームとして成り立つフレット幅 */
    searchFretWidth?: number;
    /** テンションは可能な限り高音源を使用する */
    useHighestTensionPossible?: boolean | null;
    /** 必須弦 */
    requiredStrings?: number[] | null;
}
/** 最終系 */
export interface FingeringCollection {
    positionScore: number;
    score: number;
    tab: NumberOrUfd[];
    notes: (IKey | undefined)[];
    sym: string;
    memo?: string;
}
export interface FingeringCollectionObj {
    fingerings: FingeringCollection[];
    notes: IKey[];
    tonic: IKey;
    intervals: string[];
    tensionNotes: string[];
}
/**
 * ChordToFingering
 */
export declare class ChordToFingering {
    /**
     * core search
     * @param chordSym
     * @param tuning
     * @param options
     */
    static search(chordSym: string, tuning: IKey[], options?: ExpandFingeringOptions): FingeringCollectionObj | null;
}
