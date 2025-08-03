// // 配列で使用する 0:normal, 1:mute, 2:harmonics
// export interface BendViewObj {
//   bendStartTick: number,
//   bendStopTick: number,
//   row: string[], // UI用, groupの場合、複数noteが絡む
//   inst: ESInst | undefined,
//   bends: Bend[] // 1間隔のベンド情報リスト（group:-1ならnote一つ分、group>0なら複数note分）
// }

/*
  ビュー用データ構造
  [
    {
      view: [
        { tick, row, line, linePos }, ..
      ]
      bend: [] // 範囲内のmidi用と同じもの
    }
  ]
*/

/**
 * ベンドビューインターフェース
 * 
 * ベンド（音程変化）のビュー表示用データを表現する
 * ビュー情報とベンド情報の配列を含む
 */
export interface BendView {
  /** ビュー情報配列 */
  view: ViewInfo[],
  /** ベンド情報配列（MIDI用と同じ構造） */
  bend: Bend[][]
}

/**
 * ビュー情報インターフェース
 * 
 * ベンドのビュー表示に必要な情報を表現する
 * タイミング情報と位置情報を含む
 */
export interface ViewInfo {
  /** 開始tick */
  startTick: number,
  /** 停止tick */
  stopTick: number,
  /** 行文字列 */
  row: string,
  /** 行番号 */
  line: number,
  /** 行内位置 */
  linePos: number
}

/**
 * ベンドインターフェース
 * 
 * 個別のベンド情報を表現する
 * タイミングとピッチ（音程変化量）を含む
 */
export interface Bend {
  /** tick（タイミング） */
  tick: number,
  /** ピッチ（音程変化量） */
  pitch: number,
}

/**
 * ベンドMIDI設定インターフェース
 * 
 * MIDI出力用のベンド情報を表現する
 * ベンド配列、ミュート有無、タブオブジェクトIDを含む
 */
export interface BendMidiSetter {
  /** ベンド配列 */
  bend: Bend[],
  /** ミュート有無フラグ */
  hasMute: boolean,
  /** タブオブジェクトID */
  tabObjId: number;
}
