import { MapOpt, Styles } from "./style";
import { NumberOrUfd, SyntaxLocation, UntilNext } from "./utils.interface";
export interface TabObj {
    /** for view string */
    noteStr: string;
    /** for App view */
    extendInfo?: ExtensionViewProp;
    /** location */
    syntaxLocation: Required<SyntaxLocation>;
    /** id */
    tabObjId: number;
    /** どのリージョンに所属しているか 20240518追加 */
    regionIndex: number;
    /**
     * regionを認識するため必要、note毎にカウントするが、region推移で0に戻しているリージョン内noteインデックス
     * fullNoteでカウントしてしまっている ==>> 修正済みだが、region毎にクリアされる。で間違いないか
     */
    regionNoteIndex: number;
    /**  */
    note: string;
    /** [make]弦別フレット ※特定の弦だけ停止する場合 fretの対象弦に -1 設定する */
    tab: NumberOrUfd[];
    /** stepやmapで改変される前の本来のtab */
    trueTab?: NumberOrUfd[];
    /** mapped処理詳細 */
    shifted?: {
        shift: number;
        options: MapOpt[];
    }[];
    /** legato用のmidiノート強制シフト */
    tabShift?: number;
    /** [make,arrange]音量 最大100(tonejsでは最大1)
     * ※設定で「高い弦にアクセント」「表拍の高い弦にアクセント」「解放弦にアクセント」「アクセントは強く/弱く」
     * を変更できるようにする
     * ※速いピッキングは音量が下がる アルペジオでのアクセントは基本は表が強い
     * 但し表とは限らず高い弦ほ強い場合がある。また歪ませるとあまり変わらない
     *
     * velocityがあるのにtabがないfretStartTickが無い場合
     * view側の、「slideToViewData」で取れなくなるので注意
     */
    velocity: NumberOrUfd[];
    /** [make]前の音を残すか切るか。regionからの指定される場合もある ※trueだと切らない */
    continueX: boolean;
    /** 奏法 */
    styles: Styles;
    /** tick */
    bar: Tick;
    /** bpm */
    bpm: number;
    /** 休符の場合、true */
    isRest?: true;
    /** is arpeggio */
    isArpeggio: boolean;
    /** bullet flag # bulletグループNo */
    isBullet: number;
    /** style適用による移動済みのslide対象のtabObj参照 */
    refMovedSlideTarget: (TabObj | undefined)[];
    /** 現時点でなっている弦 ※この段階のbeforeStopは関係ない */
    activeBows: NumberOrUfd[];
    /** 現時点でなっている弦のtabObj参照 ※弦毎に設定 ※当該note自身の参照も設定済み */
    refActiveBows: (TabObj | undefined)[];
    /** Landing point reference value used in slide. */
    /** Even if the next one is a rest, check further ahead and look for the nearest valid tabObj */
    slideLandingTab?: NumberOrUfd[];
    /** genuine next tabObj */
    nextTabObj: TabObj;
    prevTabObj: TabObj;
    /** スライド適用後の場合
     * undefined & 0:無し
     * 1: slide済み元ノート(対象弦なしの場合の未処理時含む)
     * 2: approach済み元ノート(対象弦なしの場合の未処理時含む)
     * 3: slideのnote
     * 4: approachのnote
     */
    slideTrueType?: undefined | 0 | 1 | 2 | 3 | 4;
    /** 検討中 -> ExtensionViewPropに移動 */
    locationIndexes?: number[];
    untilNext: UntilNext;
}
export interface ExtensionViewProp {
    stepInfoId?: {
        id: number;
        orderCount: number;
    };
    bullet?: {
        row: string;
        index: number;
    };
}
/** 付割 */
export interface Bar {
    /**
     * 単体のtick
     * layerの全体計算で使用するため重要値（currentTickForLayer, endLayerTick に関わる）
     *
     * step処理の場合、mod-arpeggioでも更新する検討中（）
     * → note.tick[ni].tick = note.tick[ni].tick * cStep.length;
     */
    tick: number;
    /** until */
    untilNext: UntilNext;
}
export interface Tick {
    /** tick ※この音のみの長さ */
    tick: number;
    /** フレット別の音声開始位置(tick) 初期値: undefined as any */
    fretStartTicks: NumberOrUfd[];
    /**
     * フレット別の音声停止位置(tick) 初期値: undefined as any
     * 弦別MIDIの処理に関わるため全弦同じ数値である必要がある?
     */
    fretStopTicks: NumberOrUfd[];
    /** 最初の設定後は不変 : BPM設定などで使用。アルペジオ等適用前の開始Tick */
    startTick: number;
    /**
     * 最初の設定後は不変 : BPM設定などで使用。アルペジオ等適用前の指定Tick
     * beforeStopが効いている場合、弾いていない弦も考慮し実際の音長より長い可能性がある
     */
    stopTick: number;
}
