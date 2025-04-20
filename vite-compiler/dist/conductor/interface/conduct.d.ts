import { Warning } from './utils.response.interface';
import { Region } from './region';
import { Settings } from './settings';
import { ChordDicMap } from './dic-chord';
import { Flash } from './flash';
import { BPMPos } from './bpm';
import { StyleMapGroupList, StyleObjectBank } from './style';
import { ClickPoint } from './click';
import { TabObj } from './tab';
import { BendMidiSetter } from './bend';
import { MapSeed } from './dic-map-seed';
import { StepInfo } from '../compile-view/view-model-builder';
import { CSymbolType } from './compile';
import { AllowAnnotation } from '../conductor';

/**
 * マーク情報インターフェース
 *
 * コンパイル処理中に生成される各種マーク情報を管理する
 * スタイルマッピング、ティック記録、ベンド情報などを含む
 *
 * このインターフェースは、音楽記譜法のコンパイル処理において、
 * 演奏表現やスタイル適用の追跡に必要な情報を格納する
 */
export interface Marks {
    /** マッピンググループ情報：スタイルが適用されたグループのリスト */
    styleMappedGroupList: StyleMapGroupList[];
    /** ティック記録：そのノート位置でのティック値を確認するための変数（resolve-clickで使用中） */
    fullNoteIndexWithTick: number[];
    /** ベンドグループ情報：ベンドが適用されたグループの番号リスト */
    bendGroupNumberList: number[];
    /** 使用されたベンド範囲：ベンドの開始位置と終了位置のリスト */
    usedBendRange: {
        start: number;
        end: number;
    }[];
}
/**
 * ミックス情報インターフェース
 *
 * dual機能（複数チャンネル同時演奏）の各チャンネルの情報を管理する
 * リージョンリスト、タブオブジェクトリスト、ベンド情報などを含む
 *
 * dual機能により、同一楽曲を異なる設定で同時演奏できる
 * 例：メロディー、伴奏、ベースラインを別々のチャンネルで演奏
 */
export interface Mixes {
    dualId: number;
    /** ブロックリスト：楽曲の区間情報（小節単位の分割情報） */
    regionList: Region[];
    /** フラット化されたタブオブジェクトリスト（演奏順序）：実際の演奏順序に並べられたタブオブジェクト */
    flatTOList: TabObj[];
    /** ベンド情報バンク：ベンド（弦の曲げ）に関する設定情報 */
    bendBank: {
        bendNormalList: BendMidiSetter[];
        bendChannelList: BendMidiSetter[];
    };
    /** マーク情報：スタイル適用やベンド情報の追跡用 */
    marks: Marks;
}
/**
 * コンダクター（全体を統括するメインインターフェース）
 *
 * 音楽記譜法のコンパイル結果を格納するメインのデータ構造
 * 記譜法テキスト、設定、リージョン、スタイル情報などを含む
 *
 * このインターフェースは、音楽記譜法のコンパイル処理の結果を
 * 包括的に管理し、フロントエンドやMIDI生成に必要な情報を提供する
 */
export interface Conduct {
    /** 精度フラグ：バッキングはtrue、ソロ構築時はfalse、ノート指定時はタブのみ */
    /** ユーザーまたは作曲者入力の記譜法：元の記譜法テキスト */
    syntax: string;
    /** 設定情報：BPM、調性、チューニングなどの設定 */
    settings: Settings;
    /** ブロックリストの長さ：リージョンの総数 */
    regionLength: number;
    /** タブオブジェクトにもBPMがあるが、こちらはMIDIに渡す用のもの */
    bpmPosList: BPMPos[];
    /** クリックポイントリスト：クリック音の位置情報 */
    clickPointList: ClickPoint[];
    /** フラッシュ：アノテーションシンボルバンク（@compose、@clickなどのアノテーション情報） */
    flash: Flash;
    /** 警告メッセージオブジェクトリスト：コンパイル時の警告情報 */
    warnings: Warning[];
    /** dual用：各チャンネルのミックス情報（3つのチャンネル分） */
    mixesList: Mixes[];
    /** 辞書情報：コード辞書やマッピングシードなどの参照情報 */
    dic: {
        /** コード辞書：コード名からタブ譜への変換テーブル */
        chord: ChordDicMap;
        /** チューニングをキーにして、指板マップを作成する */
        /** マッピングで使用するシード値：同じコードでも異なる押さえ方を生成するための値 */
        mapSeed: MapSeed;
    };
    /** バリデーションのみの場合のフラグ：スタイル処理をスキップする場合に設定 */
    notStyleCompile?: true;
    /** MIDIが不要の場合のフラグ：MIDI生成をスキップする場合に設定 */
    notMidiCompile?: true;
    /** 拡張情報：将来的な機能拡張用の情報 */
    extensionInfo: {
        stepInfoList: StepInfo[];
    };
    /** ビューでカーソル位置からシンボルを判別するためのリスト：エディタでの位置検知用 */
    locationInfoList: LocationInfo[];
    /** ビューでカーソル位置から1{}囲いの階層での適用スタイルを判別するためのリスト：スタイル適用範囲の追跡用 */
    braceLocationInfoList: BraceLocationInfo[];
    /** スタイルコンテキスト蓄積（使用時は基本クローン作成）：スタイル情報のキャッシュ */
    styleObjectBank: StyleObjectBank;
    /** 許可するその他のアノテーション：@compose、@clickなどのアノテーション設定 */
    allowAnnotations: AllowAnnotation[];
}
/**
 * ビューで使用する位置情報インターフェース
 *
 * 記譜法の各要素の位置情報を管理し、ビューでのカーソル位置検知に使用される
 *
 * 検知した場合にやりたいこと：
 * - regionStart - ブロック情報（基本regionPropと同じ）
 * - regionProp - 右記それぞれ → BPM詳細、until詳細、チューニング
 * - note - [TabObjにリンク] タブ/コード/スタイルアイコン表示
 * - degree - [TabObjにリンク] ノートと同等
 * - bullet - [TabObjにリンク:location再検索] パースしたbulletからのTabObj全てにリンク - 表示はノートと同等
 * - blockStyle - リンクなし、情報は conduct.styleObjectBank[cacheKey] で取得
 * - flash - 使い方表示のみ
 *
 * LocationInfoの例：
 * 0 [ 10, 1 ] [ 10, 3 ] [ '@@' ]
 * 1 [ 10, 4 ] [ 10, 7 ] [ '140' ]
 * 2 [ 10, 8 ] [ 10, 11 ] [ '1/4' ]
 * 3 [ 12, 5 ] [ 12, 12 ] [ '4/20-24' ]
 * 4 [ 12, 13 ] [ 12, 14 ] [ 'D' ]
 * 5 [ 12, 14 ] [ 12, 23 ] [ 'step(12)' ]
 * 6 [ 12, 24 ] [ 12, 26 ] [ '1' ]
 * 7 [ 13, 4 ] [ 13, 14 ] [ 'map(1, 2)' ]
 * 8 [ 13, 14 ] [ 13, 16 ] [ 'd' ]
 *
 * TabObjの例：
 * [ 'to.location', '||20', [ 3 ] ] 例: ここでbulletの場合 [ 3 ] が2つ(mapの結果で4つだが)あるので、全てリスト化してさらに位置情報とマッチするもの抜粋してviewに反映する
 * [ 'to.location', '||24', [ 3 ] ]
 * [ 'to.location', 'D', [ 4, 5 ] ] 例: LocationInfo[4]と[5]はこれを見てnote情報を得る。styleは
 * [ 'to.location', 'D', undefined ]
 * [ 'to.location', 'C', [ 6 ] ]
 * [ 'to.location', '||20', [ 3 ] ]
 * [ 'to.location', '||24', [ 3 ] ]
 * [ 'to.location', 'D', [ 4, 5 ] ]
 * [ 'to.location', 'D', undefined ]
 * [ 'to.location', 'C', [ 6 ] ]
 *
 * tabObjIndexesには TabObjのインデックス設定
 */
export interface LocationInfo {
    line: number;
    linePos: number;
    endLine: number;
    endPos: number;
    type: CSymbolType;
    regionId: number;
    dualId: number;
    /**
     * TabObj作成時に設定（配列として使うのはbulletだけ）
     * 配列(複数設定)の場合、view内では再検索する
     */
    tabObjIndexes: number[];
    sym: string;
}
/**
 * {}囲いの階層情報インターフェース
 *
 * 中括弧で囲まれたスタイル適用範囲の情報を管理する
 * スタイルの適用範囲や階層構造を追跡するために使用される
 *
 * このインターフェースにより、記譜法内のスタイル適用範囲を
 * 正確に追跡し、ビューでの表示や編集操作を支援する
 */
export interface BraceLocationInfo {
    id: number;
    regionId: number;
    dualId: number;
    upperBlock: number[];
    line: number;
    linePos: number;
    /** スタイルの宣言末端までを{}の範囲内として適用する行 */
    endLine: number;
    /** スタイルの宣言末端までを{}の範囲内として適用する位置 */
    endPos: number;
    /** スタイルの宣言末端までを{}の範囲内とするため、実際の{}括弧自体の終了を一応保持する（20240914では未使用） */
    trueBraceEndLine: number;
    /** スタイルの宣言末端までを{}の範囲内とするため、実際の{}括弧自体の終了を一応保持する（20240914では未使用） */
    trueBraceEndPos: number;
    styles: string[];
    linesOfStyle: number[];
    linePosOfStyle: number[];
}
