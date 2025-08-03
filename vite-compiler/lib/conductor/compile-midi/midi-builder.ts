import { Midi, Track } from '@tonejs/midi';
import { ErrorBase, IResult, Success } from '../interface/utils.response.interface';
import { BuildMidiRequest } from '../interface/midi';
import { BPMPos } from '../interface/bpm';
import { ClickPoint } from '../interface/click';
import { ModGuitarTimGM6mb } from './mod-guitar-TimGM6mb';

/**
 * ビルド結果オブジェクトインターフェース
 * 
 * MIDIビルド処理の結果を格納する
 * エラー情報とMIDIオブジェクトのいずれかを含む
 */
export interface BuildToObj {
  /** エラー情報（成功時はnull） */
  error: null | ErrorBase,
  /** MIDIオブジェクト（失敗時はnull） */
  response: null | Midi
}

/**
 * MidiBuilderクラス
 * 
 * MIDIファイルの構築を行うクラス
 * ビルドリクエスト、BPM情報、クリック情報からMIDIファイルを生成する
 * ギター用のMIDIトラック作成とクリックトラックの生成を担当する
 */
export class MidiBuilder {

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
  static build(
    bmrList: BuildMidiRequest[],
    bpmList: BPMPos[],
    clickList: ClickPoint[]
  ): IResult<Midi, ErrorBase> {
    const midi = new Midi();

    // クリックトラックの構築
    if (clickList.length) buildClick(clickList, midi);

    // ストラムをMIDI用オブジェクトに変換
    for (let bmi = 0; bmi < bmrList.length; bmi++) {
      const bmr = bmrList[bmi];
      const trackStartIndex = (bmi * 4);
      ModGuitarTimGM6mb.create(trackStartIndex, midi, bmr);
    }

    // BPM設定
    bpmList.forEach(b => {
      midi.header.tempos.push({ bpm: b.bpm, ticks: b.tick});
    });

    // 不要トラック削除
    const newTracks: Track[] = [];
    for (let ti = 0; ti < midi.tracks.length; ti++) {
      const track = midi.tracks[ti];
      if (track.notes.length) {
        newTracks.push(track)
      }
    }
    midi.tracks = newTracks;

    return new Success(midi);
  }
}

/**
 * クリックビルド関数
 * 
 * クリックポイント配列からMIDIクリックトラックを生成する
 * チャンネル9（ドラムチャンネル）にクリック音を配置する
 * 
 * @param clickList クリックポイント配列
 * @param midi MIDIオブジェクト
 */
function buildClick(clickList: ClickPoint[], midi: Midi) {
  const track = midi.addTrack();
  track.channel = 9;
  track.instrument = { number: 115 } as any;

  clickList.forEach(cp => {
    track.addNote({
      durationTicks: 2,
      midi: cp.inst,
      velocity: cp.velocity,
      ticks: cp.startTick
    });
  });
}
