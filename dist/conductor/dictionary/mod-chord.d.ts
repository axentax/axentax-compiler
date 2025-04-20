import { ErrorBase, IResult } from '../interface/utils.response.interface';
import { ChordDicMap, ChordProp } from "../interface/dic-chord";
import { IKey } from "../interface/utils.interface";
import { ExpandFingeringOptions } from '../chord-to-fingering/chord-to-fingering';
export declare class ModChord {
    /**
     * 未使用
     * @param conduct
     * @param tuning
     * @param chordSym
     * @returns
     */
    /**
     * Automatically cached chord dictionary.
     * @param conduct
     * @param tuning Required items
     * @param chordSym can be a tab string e.g. |2|3||-1| # 但し、辞書作成は別途実装必要
     * @param tab Items that are always required when tab is specified
     * @returns
     */
    static create(chordSet: ChordDicMap, tuning: IKey[], line: number, linePos: number, chordSym: string, options: ExpandFingeringOptions): IResult<ChordProp, ErrorBase>;
}
