import { Midi } from '@tonejs/midi';
import { ErrorBase, IResult } from '../interface/utils.response.interface';
import { BuildMidiRequest } from '../interface/midi';
import { BPMPos } from '../interface/bpm';
import { ClickPoint } from '../interface/click';
/**
 * ビルド結果オブジェクトインターフェース
 *
 * MIDIビルド処理の結果を格納する
 * エラー情報とMIDIオブジェクトのいずれかを含む
 */
export interface BuildToObj {
    /** エラー情報（成功時はnull） */
    error: null | ErrorBase;
    /** MIDIオブジェクト（失敗時はnull） */
    response: null | Midi;
}
/**
 * MidiBuilderクラス
 *
 * MIDIファイルの構築を行うクラス
 * ビルドリクエスト、BPM情報、クリック情報からMIDIファイルを生成する
 * ギター用のMIDIトラック作成とクリックトラックの生成を担当する
 */
export declare class MidiBuilder {
    /**
     * MIDIビルドメソッド
     *
     * ビルドリクエスト、BPM情報、クリック情報からMIDIファイルを構築する
     * クリックトラック、ギタートラック、BPM情報を順次処理する
     *
     * @param bmrList ビルドMIDIリクエスト配列
     * @param bpmList BPM位置情報配列
     * @param clickList クリックポイント配列
     * @returns MIDIオブジェクトまたはエラー
     */
    static build(bmrList: BuildMidiRequest[], bpmList: BPMPos[], clickList: ClickPoint[]): IResult<Midi, ErrorBase>;
}
