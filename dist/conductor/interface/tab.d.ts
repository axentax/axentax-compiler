import { MapOpt, Styles } from './style';
import { NumberOrUfd, SyntaxLocation, UntilNext } from './utils.interface';

/**
 * タブオブジェクトインターフェース
 *
 * ギターのタブ譜（タブラチュア）を表現するオブジェクトのインターフェース
 * 音符、フレット情報、演奏スタイル、タイミング情報などを含む
 *
 * このインターフェースは、音楽記譜法のコンパイル処理において、
 * 実際の演奏データを表現する中心的なデータ構造として使用される
 */
export interface TabObj {
    /** ビュー用の文字列表現 */
    noteStr: string;
    /** アプリビュー用の拡張情報 */
    extendInfo?: ExtensionViewProp;
    /** 構文位置情報：記譜法内での位置を特定するための情報 */
    syntaxLocation: Required<SyntaxLocation>;
    /** タブオブジェクトの一意識別子 */
    tabObjId: number;
    /** どのリージョンに所属しているか（20240518追加） */
    regionIndex: number;
    /**
     * リージョンを認識するため必要、note毎にカウントするが、region推移で0に戻しているリージョン内noteインデックス
     * fullNoteでカウントしてしまっている ==>> 修正済みだが、region毎にクリアされる。で間違いないか
     */
    regionNoteIndex: number;
    /** 音符名（C、D、Eなど） */
    note: string;
    /** 弦別フレット配列：各弦のフレット番号（特定の弦だけ停止する場合、対象弦に-1を設定） */
    tab: NumberOrUfd[];
    /** stepやmapで改変される前の本来のtab */
    trueTab?: NumberOrUfd[];
    /** mapped処理詳細：フィンガリング最適化の詳細情報 */
    shifted?: {
        shift: number;
        options: MapOpt[];
    }[];
    /** legato用のmidiノート強制シフト */
    tabShift?: number;
    /** 音量配列：各弦の音量（最大100、tonejsでは最大1）
     * ※設定で「高い弦にアクセント」「表拍の高い弦にアクセント」「解放弦にアクセント」「アクセントは強く/弱く」
     * を変更できるようにする
     * ※速いピッキングは音量が下がる アルペジオでのアクセントは基本は表が強い
     * 但し表とは限らず高い弦ほ強い場合がある。また歪ませるとあまり変わらない
     *
     * velocityがあるのにtabがないfretStartTickが無い場合
     * view側の、「slideToViewData」で取れなくなるので注意
     */
    velocity: NumberOrUfd[];
    /** 前の音を残すか切るか：regionからの指定される場合もある（trueだと切らない） */
    continueX: boolean;
    /** 演奏スタイル：ベンド、スライド、レガートなどの演奏技法 */
    styles: Styles;
    /** タイミング情報：音符の長さやタイミング */
    bar: Tick;
    /** BPM：テンポ情報 */
    bpm: number;
    /** 休符の場合、true */
    isRest?: true;
    /** アルペジオかどうか */
    isArpeggio: boolean;
    /** バレットフラグ：バレットグループ番号 */
    isBullet: number;
    /** style適用による移動済みのslide対象のtabObj参照 */
    refMovedSlideTarget: (TabObj | undefined)[];
    /** 現時点で鳴っている弦（この段階のbeforeStopは関係ない） */
    activeBows: NumberOrUfd[];
    /** 現時点で鳴っている弦のtabObj参照（弦毎に設定、当該note自身の参照も設定済み） */
    refActiveBows: (TabObj | undefined)[];
    /** スライドで使用される着地点参照値 */
    /** 次の音が休符でも、さらに先を見て最も近い有効なtabObjを探す */
    slideLandingTab?: NumberOrUfd[];
    /** 真の次のtabObj */
    nextTabObj: TabObj;
    /** 真の前のtabObj */
    prevTabObj: TabObj;
    /** スライド適用後の場合のタイプ
     * undefined & 0: なし
     * 1: slide済み元ノート（対象弦なしの場合の未処理時含む）
     * 2: approach済み元ノート（対象弦なしの場合の未処理時含む）
     * 3: slideのnote
     * 4: approachのnote
     */
    slideTrueType?: undefined | 0 | 1 | 2 | 3 | 4;
    /** 検討中 -> ExtensionViewPropに移動 */
    /** locationInfoのindex */
    locationIndexes?: number[];
    /** 次の音までの間隔（拍子記号） */
    untilNext: UntilNext;
}
/**
 * 拡張ビュープロパティインターフェース
 *
 * ビュー表示に必要な追加情報を格納する
 * ステップ情報、バレット情報などの拡張データを含む
 */
export interface ExtensionViewProp {
    /** ステップ情報ID：ステップ処理の識別情報 */
    stepInfoId?: {
        id: number;
        orderCount: number;
    };
    /** バレット情報：バレットの行とインデックス */
    bullet?: {
        row: string;
        index: number;
    };
}
/**
 * 小節インターフェース
 *
 * 音楽の小節を表現するインターフェース
 * タイミング情報と拍子情報を含む
 */
export interface Bar {
    /**
     * 単体のtick
     * layerの全体計算で使用するため重要値（currentTickForLayer, endLayerTick に関わる）
     *
     * step処理の場合、mod-arpeggioでも更新する検討中（）
     * → note.tick[ni].tick = note.tick[ni].tick * cStep.length;
     */
    tick: number;
    /** 拍子記号 */
    untilNext: UntilNext;
}
/**
 * タイミングインターフェース
 *
 * 音符のタイミング情報を表現するインターフェース
 * 音符の長さ、フレット別の開始・停止タイミングなどを含む
 */
export interface Tick {
    /** tick：この音のみの長さ */
    tick: number;
    /** フレット別の音声開始位置（tick）：初期値は undefined as any */
    fretStartTicks: NumberOrUfd[];
    /**
     * フレット別の音声停止位置（tick）：初期値は undefined as any
     * 弦別MIDIの処理に関わるため全弦同じ数値である必要がある?
     */
    fretStopTicks: NumberOrUfd[];
    /** 最初の設定後は不変：BPM設定などで使用。アルペジオ等適用前の開始Tick */
    startTick: number;
    /**
     * 最初の設定後は不変：BPM設定などで使用。アルペジオ等適用前の指定Tick
     * beforeStopが効いている場合、弾いていない弦も考慮し実際の音長より長い可能性がある
     */
    stopTick: number;
}
