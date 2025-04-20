import { IKey } from "../interface/utils.interface";
/**
 * XMidiNoteUtils
 */
/**
 * tuningから各弦の開始midiノート番号を取得
 * case normal tuning E|A|D|G|B|E is [ 40, 45, 50, 55, 59, 64 ]
 */
export declare function tuningToStringPitch(tuning: IKey[]): number[];
