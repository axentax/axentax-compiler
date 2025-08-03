import { Midi } from "@tonejs/midi";
import { BuildMidiRequest } from "../interface/midi";
import { ESInst } from "../interface/style";
import * as XMidiNoteUtils  from "../utils/x-midi-note-utils";

/**
 * XTracksList型
 * 
 * 複製シフトノート用のトラックリスト型
 * 各トラックのノート配列を格納する
 */
type XTracksList = XNote[][];

/**
 * XNote型
 * 
 * 拡張ノート情報型
 * MIDIノートの基本情報に停止時間を追加した型
 */
type XNote = {
  /** MIDIノート番号 */
  midi: number,
  /** ベロシティ（0-1） */
  velocity: number,
  /** 開始時間（ティック） */
  ticks: number,
  /** 停止時間（ティック） */
  stopTick: number,
  /** 継続時間（ティック） */
  durationTicks: number
}

/**
 * ModGuitarTimGM6mbクラス
 * 
 * ギター用MIDIトラック作成クラス
 * TimGM6mbサウンドフォント用のギターMIDIトラックを生成する
 * 通常音、ミュート音、ベンド音を別トラックで管理する
 */
export class ModGuitarTimGM6mb {

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
  static create(trackStartIndex: number, midi: Midi, bmr: BuildMidiRequest) {
    const { regionList, flatTOList, bend } = bmr;

    // console.dir(['bend>>', bend], {depth:null})

    // トラック作成
    const tracks = createTracks(trackStartIndex, midi, bmr);

    // 複製シフトノート用のxTrack
    const xTracks: XTracksList = tracks.map(_ => []);

    // 初期化
    let tuningPitch: number[] = [];
    const flatTabObjListLength = flatTOList.length;
    let currentRegionIndex = -1;

    // 各タブオブジェクトの処理
    for (let ti = 0; ti < flatTabObjListLength; ti++) {
      const to = flatTOList[ti];

      if (to.regionIndex !== currentRegionIndex) {
        tuningPitch = XMidiNoteUtils.tuningToStringPitch(regionList[to.regionIndex].tuning);
        currentRegionIndex = to.regionIndex;
        // console.log('tuningPitch>>', tuningPitch)
      }

      for (let bow = 0; bow < regionList[to.regionIndex].tuning.length; bow++) {

        // 無音の場合はスキップ
        const fret = to.tab[bow];
        if (fret === undefined || fret === -1) continue;

        // 必須プロパティ
        const startTick = to.bar.fretStartTicks[bow] as number;
        const stopTick = to.bar.fretStopTicks[bow] as number;
        const duration = stopTick! - startTick!;
        const velocity = (to.velocity[bow] as number) / 100;
        const styleInst = to.styles.inst || ESInst.normal;
        const styleBend = to.styles.bd !== undefined;

        // エラーチェック
        if (isNaN(startTick as number) || isNaN(stopTick as number)) {
          // console.dir(layer.tabObjList[to], { depth: null })
          // console.log(to.tabObjId, to.noteStr);
          throw "tick is Nan - startTick: " + startTick
          + ", stopTick: " + stopTick
          + ", fret: " + JSON.stringify(to.tab[bow])
          + ', noteStr: ' + to.noteStr
          + ', bar: ' + JSON.stringify(to.bar)
          ;
        }

        // 必須範囲外の場合はスキップ
        if (duration < 1) continue;

        // 音の追加
        const midiProp = resolveInstToTrackId(
          styleInst,
          styleBend // hasBend
        );
        const midiVelocity = midiProp.vel === 0
          ? velocity // 更新なしの場合
          : midiProp.vel < 0
            ? velocity + midiProp.vel // 調整の場合
            : midiProp.vel; // 上書きの場合
        const note = tuningPitch[bow] + fret;

        // console.log('>>', bow, fret, midiProp)
        // console.log("note>", note, midiVelocity, startTick, midiProp.duration, duration)
        // console.log(note, startTick, stopTick, duration, to.noteStr)

        const info = {
          midi: note + (to?.tabShift ? to.tabShift : 0),
          velocity: midiVelocity,
          ticks: startTick, // 整数じゃないとずれる
          durationTicks: midiProp.duration || duration // 整数じゃないと音がずれる
        }
        tracks[midiProp.midiInst].addNote(info);

        // xTmp
        xTracks[midiProp.midiInst].push({ ...info, ...{ stopTick } });
        // duplicatedNotesShifter(xTracks);
        // → 後調整でも参照なので適用される

      }
    }

    // ベンド処理
    bend.bendNormalList.forEach(b => b.bend.forEach(bb => {
      tracks[0].addPitchBend({
        ticks: bb.tick,
        value: bb.pitch
      });
      if (b.hasMute) tracks[1].addPitchBend({
        ticks: bb.tick,
        value: bb.pitch
      });
    }));

    bend.bendChannelList.forEach(b => b.bend.forEach(bb => {
      // console.log(bb)
      tracks[2].addPitchBend({
        ticks: bb.tick,
        value: bb.pitch
      });
      if (b.hasMute) tracks[3].addPitchBend({
        ticks: bb.tick,
        value: bb.pitch
      });
    }));

    // console.dir(['bend.bendNormalList>', bend.bendNormalList], {depth:null});
    // console.dir(['bend.bendChannelList>', bend.bendChannelList], {depth:null});

    // tracksの並びは以下となっている
    // 0: normal
    // 1: mute
    // 2: normalのbend
    // 3: muteのbend

    /*
      //   track.addCC({
      //     number: 7,
      //     ticks: dt.tick,
      //     value: dt.vel
      //   })
    */

  }
}

/**
 * 演奏指示をトラックIDに解決する関数
 * 
 * 演奏指示とベンド有無から適切なMIDIトラックIDとベロシティ調整値を決定する
 * 
 * @param inst 演奏指示
 * @param hasBend ベンド有無フラグ
 * @returns MIDIトラック情報（トラックID、ベロシティ調整、継続時間）
 */
function resolveInstToTrackId(inst: ESInst, hasBend = false): { midiInst: number, vel: number, duration?: number | undefined } {
  const midiInst = (inst === ESInst.normal || inst === ESInst.normalUnContinueForStep ? 0 : 1) + (hasBend ? 2 : 0);
  return {
    // -case: Adjust, +case: override, 0case: no update
    [ESInst.normal]: { midiInst, vel: 0 },
    [ESInst.mute]: { midiInst, vel: -0.3 }, // -0.24 // -0.2 // -0.45;
    [ESInst.muteContinue]: { midiInst, vel: -0.3 },
    [ESInst.rest]: { midiInst, vel: 0 },
    [ESInst.restNoise]: { midiInst, vel: 0.28, duration: 1 }, // 0.38
    [ESInst.brushing_d]: { midiInst, vel: -0.40, duration: 1 },
    [ESInst.brushing_D]: { midiInst, vel: -0.25, duration: 1 },
    [ESInst.brushing_u]: { midiInst, vel: -0.40, duration: 1 },
    [ESInst.brushing_U]: { midiInst, vel: -0.25, duration: 1 },
    [ESInst.strum]: { midiInst, vel: -0.25, duration: 1 },
    [ESInst.normalUnContinueForStep]: { midiInst, vel: 0 },
  }[inst];
}

/**
 * トラック作成関数
 * 
 * ギター用MIDIトラックを4つ作成する
 * 通常音、ミュート音、ベンド音用のトラックを生成する
 * 
 * @param trackStartIndex トラック開始インデックス
 * @param midi MIDIオブジェクト
 * @param bmr ビルドMIDIリクエスト
 * @returns 作成されたトラック配列
 */
function createTracks(trackStartIndex: number, midi: Midi, bmr: BuildMidiRequest) {
  // コールバック関数
  const createTrack = (midiInst: number, trackStartIndex: number, pan: number) => {
    const t = midi.addTrack();
    t.instrument = { number: midiInst } as any;
    t.channel = trackStartIndex > 7 ? trackStartIndex + 2 : trackStartIndex; // 8,9はリズム隊用
    // console.log('t.channel>', t.channel);
    t.addCC({ number: 10, value: pan, ticks: 0 });
    return t;
  };
  // トラック作成
  return [
    createTrack(bmr.soundfontProp.normal, trackStartIndex++, bmr.pan),
    createTrack(bmr.soundfontProp.mute, trackStartIndex++, bmr.pan),
    createTrack(bmr.soundfontProp.normal, trackStartIndex++, bmr.pan),
    createTrack(bmr.soundfontProp.mute, trackStartIndex, bmr.pan)
  ];
}
