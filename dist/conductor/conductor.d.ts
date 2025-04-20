import { ErrorBase, IResult } from "./interface/utils.response.interface";
import { Conduct } from "./interface/conduct";
import { ChordDicMap } from "./interface/dic-chord";
import { MapSeed } from "./interface/dic-map-seed";
export interface AllowAnnotation {
    name: string;
    dualIdRestrictions: number[];
}
export interface ConvertToObj {
    id: number;
    error: null | {
        message: string;
        line: number;
        linePos: number;
        token: string | null;
    };
    response: null | Conduct;
    midi?: ArrayBuffer;
    midiRequest?: true;
    compileMsec?: number;
}
/**
 * conductor
 */
export declare class Conductor {
    /**
     * convert
     * @param syntax
     * @param chordDic
     * @param mapSeed
     * @returns [ErrorObject, SuccessObject]
     */
    static convert(syntax: string, allowAnnotations: AllowAnnotation[], chordDic: ChordDicMap, mapSeed: MapSeed, isValidOnly: boolean): IResult<Conduct, ErrorBase>;
    /**
     * AxentaxからMIDIデータやコンパイル後などの情報を作成する外部公開となるメインメソッド
     *
     * @param hasStyleCompile スタイルを適用するか
     * @param hasMidiBuild MIDIデータを作成するか
     * @param syntax axentax文字列
     * @param allowAnnotation 許可するアノテーション
     * @param chordDic コード・データ・キャッシュ用オブジェクト 初期値: Map<string, ChordProp> または Map<any, any>
     * @param mapSeed マップ・データ・キャッシュ用オブジェクト 初期値: {}
     * @returns MIDIデータやコンパイル後などの情報
     */
    static convertToObj(hasStyleCompile: boolean, hasMidiBuild: boolean, syntax: string, allowAnnotation: AllowAnnotation[], chordDic: ChordDicMap, mapSeed: MapSeed): ConvertToObj;
}
