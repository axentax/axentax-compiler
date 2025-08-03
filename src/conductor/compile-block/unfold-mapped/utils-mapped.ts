import { BoardForShiftSeed, MapSeed } from "../../interface/dic-map-seed";
import { StyleScaleX } from "../../interface/style";
import { IKey } from "../../interface/utils.interface";
import * as XMidiNoteUtils  from "../../utils/x-midi-note-utils";
import * as XScaleUtils from "../../utils/x-scale-utils";

  /**
   * シード作成関数
   * 
   * チューニングとスケール情報からマップ展開用のシードを生成する
   * キャッシュ機能付きで、同じキーの場合は既存のシードを返す
   * 
   * @param seed シードオブジェクト（キャッシュ用）
   * @param tuning チューニング配列
   * @param scale スケール情報
   * @returns ボードシフト用シード
   */
  export function createSeed(seed: MapSeed, tuning: IKey[], scale: StyleScaleX): BoardForShiftSeed {

    // キー作成
    const seedKey = `${tuning.join()} ${scale.key}:${scale.bin.join('')}`;

    // マップシード作成
    if (!seed[seedKey]) {
      const tuningPitches = XMidiNoteUtils.tuningToStringPitch(tuning);

      const {
        boardFullArr, iKeysWithKeyStart, iKeysWithTuningStart
      } = XScaleUtils.createBoardFullLine(tuningPitches, scale, tuning[0]);

      seed[seedKey] = {
        tuningPitches, boardFullArr, iKeysWithKeyStart, iKeysWithTuningStart
      }
    }

    return seed[seedKey];
  }

