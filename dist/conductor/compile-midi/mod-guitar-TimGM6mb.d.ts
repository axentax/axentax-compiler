import { Midi } from '@tonejs/midi';
import { BuildMidiRequest } from '../interface/midi';

/**
 * ModGuitarTimGM6mbクラス
 *
 * ギター用MIDIトラック作成クラス
 * TimGM6mbサウンドフォント用のギターMIDIトラックを生成する
 * 通常音、ミュート音、ベンド音を別トラックで管理する
 */
export declare class ModGuitarTimGM6mb {
    /**
     * ギターMIDI作成メソッド
     *
     * ビルドリクエストからギター用MIDIトラックを生成する
     * 各弦のフレット情報、演奏指示、ベンド情報をMIDIノートに変換する
     *
     * @param trackStartIndex トラック開始インデックス
     * @param midi MIDIオブジェクト
     * @param bmr ビルドMIDIリクエスト
     */
    static create(trackStartIndex: number, midi: Midi, bmr: BuildMidiRequest): void;
}
