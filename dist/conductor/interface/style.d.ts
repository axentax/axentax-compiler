import { ScaleName } from "../diatonic-and-scale/mod-scale";
import { DiatonicEvolverValue } from "./diatonic";
import { IShiftMax7, Scale, Tonality, NumberOrUfd, IKey, UntilNext, SyntaxLocation, UntilRange, bin12 } from "./utils.interface";
export type StyleObjectBank = {
    [keys: string]: Styles;
};
export declare enum ESInst {
    normal = "normal",
    mute = "mute",
    muteContinue = "muteContinue",
    rest = "rest",// no use?
    restNoise = "restNoise",
    brushing_d = "brushing_d",
    brushing_D = "brushing_D",
    brushing_u = "brushing_u",
    brushing_U = "brushing_U",
    strum = "strum",// strum, # under consideration
    normalUnContinueForStep = "normalUnContinueForStep"
}
/**
 * styles
 * - style add point
 *
 * -----
 * mapped処理以降はstylesのオブジェクトを直接変更するのは禁止
 * ※mappedで参照コピーしたもの同士で影響し合ってしまうため
 *
 * どうしても変更が必要な場合は、mappedの中のコピー処理（copyCompileSymbols）で、
 * 変更するスタイルだけを、手動でディープコピーする処理を追加する（現状は無し）
 * -----
 */
export interface Styles {
    approach?: StyleApproach;
    bd?: StyleBendX[];
    bpm?: {
        style: StyleBPM;
        /** group -1 is single. resolve with 'mod-style.distributeStyleWithinHierarchy' */
        group: number;
        /** group end tick. resolve with 'layer-compiler.resolveStyleGroup' */
        groupEndTick: number;
    };
    continue?: true;
    delay?: StyleDelay;
    inst?: ESInst;
    degree?: DegreeObj;
    legato?: StyleLegato;
    mapped?: StyleMapped[];
    pos?: StylePositions;
    restNoise?: true;
    scaleX?: StyleScaleX;
    slide?: StyleSlide;
    staccato?: StyleStaccato;
    step?: StyleStep;
    stroke?: StyleStroke;
    strum?: StyleStrum;
    turn?: {
        props: string;
        /** group -1 is single */
        group: number;
        /** group final mark */
        groupFinal?: true;
    };
    until?: UntilNext;
    velocity?: number;
    velocityPerBows?: NumberOrUfd[];
}
export type StyleKeys = keyof Styles;
/**
 * e.g. slide: approach=(|2||4,50),toNext=(|s||s||,4/8,50,40-20)
 * 開始音の音程がはっきりするような少しでも開始音が長いケースは、ユーザーはtoNextで指定する
 */
export interface StyleApproach extends SyntaxLocation {
    /** slide start tab */
    bowWithFret: NumberOrUfd[];
    /** speed */
    percentOfSpeed?: number;
}
/**
 * StyleBendX
 * e.g.
 *   until設定
 *    2..4/4
 *    ..4/4  => 0~4
 *    4../4  => 4~末端
 *    ..     => 先頭から末端
 *
 *   cho
 *     bd(0..1/4 cho 1) # 先頭基準チョーキング
 *     bd(1..0/4 cho 1) # 終端基準チョーキング
 *     bd(2../4 cho 1) # 指定位置から末端までにかけてチョーキング
 *     bd(0..2/4 cho 1, 2..end/4 cho 1) # 指定位置から末端までにかけてarchチョーキング
 *   vib
 *     bd(2..4/4 vib 1) # 基本ビブラート
 *     bd(2..0/4 vib 1) # 終端基準ビブラート
 *     bd(2../4 vib 1) # 指定位置から末端までにかけてビブラート
 *     bd(2..4 vib 1 c5 ast) # astroid曲線で、1/5 周期でビブラート
 *   tpl
 *     bd(2..end tpl_hi2) # 指定位置に対してテンプレートベンドを適用
 *     ※テンプレート使用時は他指定不可
 */
export interface StyleBendX extends Required<SyntaxLocation> {
    /**
     * 稼働範囲
     * [開始、終端、分割]
     *
     * 詳細
     * - 終端未指定の場合 -1 を設定し、末端地頭検出
     * - reset設定の場合 [ -2, -2, 1 ] とする
     */
    untilRange: UntilRange;
    method: BendMethodX;
    pitch: number;
    cycle?: number;
    curve?: BendCurveX;
    template?: string;
    isLegato?: true;
}
export declare enum BendMethodX {
    vib = 0
}
export declare enum BendCurveX {
    ast = 0,
    tri = 1
}
/**
 * bend
 *
 * e.g.
 * :bend(
 *   0..1/8 cho 1.25 fast |||||12  // 0/8から1/8で、正弦波(fast)でチョーキングを1.25音程上げる 弦は6弦のみ
 *   1..7/8 vib 1 1/4 force        // 1/8から7/8で、ビブラートを1/4周期で、1音幅ビブラート(1が未指定の場合は自動で0.25とか自然な感じ)、forceはnote幅全域に強制適用
 *   7..8/8 end                    // 前の音程から0まで下げる、endメソッド自体が未指定の場合、範囲最終で0に戻す
 * )
 */
export interface StyleBendSet extends SyntaxLocation {
    styleBendList: StyleBend[];
    /** group -1 is single */
    group: number;
    /** group final mark */
    groupFinal?: true;
}
export interface StyleBend extends Required<SyntaxLocation> {
    targetTab: NumberOrUfd[];
    untilRange: UntilRange;
    method: BendMethod;
    pitch: number;
    cycle: UntilNext;
    force?: true;
    curveType: BendSpeed;
}
export declare enum BendMethod {
    vib = 0,
    cho = 1,
    end = 2
}
export declare enum BendSpeed {
    fast = 0,
    slow = 1,
    auto = 2
}
/**
 * BPM
 * e.g. +30, -30, 30..50, -30..50, ..120, ..+30, ..-30
 *
 * type:
 *  1: start only: +30, -30
 *  2: end only: ..+30, ..-30
 *  3: start and end: -30..+50
 */
export interface StyleBPM extends SyntaxLocation {
    /**
     *  type:
     *    1: start only(local type): +30, -30, 140
     *    2: end only(transition type): ..+30, ..-30
     *    3: start and end(transition type): -30..+50
     */
    type: 1 | 2 | 3;
    /** - or + */
    beforeSign: -1 | 1;
    /** start bpm integer */
    beforeBPM: number;
    /** - or + */
    afterSign?: -1 | 1;
    /** end bpm integer */
    afterBPM?: number;
}
export interface StyleDelay extends SyntaxLocation {
    startUntil: UntilNext;
}
/** map: group list */
export type StyleMapGroupList = number;
/** map: opt */
export declare enum MapOpt {
    /** reverse: 逆回し(イケテない逆回し) */
    rev = 0,
    /** stay string: 可能な限り弦移動しない */ ss = 1,
    /** stay open string: 解放弦のみshiftしない [[グループ指定時のみ]] */
    sos = 2,
    /** no open string: shift結果で解放弦できる限り使わない [[グループ指定時側ではまだ未実装・・というかどこで弾くか自体未実装]] */
    nos = 3
}
export declare const MapOptKeys: string[];
/**
 * map: expand
 *
 * e.g.
 * map(1 rev ss sos, 2..-2 rev ss sos)
 */
export interface MapExpand {
    location?: SyntaxLocation;
    shift: number;
    options: MapOpt[];
}
/**
 * mapped
 * e.g.
 *    map(1, 2:auto, 3:rev)
 *    map(1..3:trip)
 */
export interface StyleMapped extends SyntaxLocation {
    style: MapExpand[];
    group: number;
}
/**
 * pos(positions)
 * [保留](1)転回: inversion, inv, rot, I, R // 1,2,3,4,5 // default:1
 * [保留](3)度抜: omit, O                   // 1,5 // default:なし
 * [保留](5)弦指定補填: cover, cov, C          // error, warning, true, false // default: true
 * (2)位置: location, loc, L          // 1:low, 2:mid, 3:high, 4:higher // default:low
 * (4)弦抜: exclusion, exc, E         // 6, 5
 * (4)弦指定: use, U                  // full, f, 123, 654, 654321 // default:full, f
 * => C#m7:pos(loc:low, rot:1, exc:5, use:full, cover:false)
 * => C#m7:pos(L:low,I:2,E:5,U:654321,C:false) *
 */
export interface StylePositions extends SyntaxLocation {
    /** inversion, inv, rot, I, R => 1, 2, 3 // undefined is full */
    inversion?: number;
    /** location, loc, L => 0:low(default), 1:mid, 2:high, 3:higher // undefined is low */
    location?: number;
    /** exclusion pull out, exc, E => 1, 5 // undefined is none */
    exclusion?: number[];
    /** use string => full or f(default), 123, 654, 654321 // undefined is full */
    useStrings?: number[];
    /** required strings */
    required?: number[];
    /** Correspondence for strings not found in useStrings => 0:true, 1:false, 2:warning, 3:error */
    cover: number;
}
/**
 * legato
 */
export type StyleLegato = boolean;
/**
 * scale
 * mappedで使用するスケール
 */
export interface StyleScaleX {
    key: IKey;
    scale: ScaleName;
    bin: bin12;
}
/**
 * slide
 * e.g. 2|2:to 2|2:to(1/2!hi.24!slow.50)
 */
export interface StyleSlide extends SyntaxLocation {
    rowString: string;
    type: 'to' | 'release';
    /** 始点のuntil指定 */
    startUntil: UntilNext;
    /** 開始スピード ※fastの場合徐々に遅くなり、slowの場合徐々に速くなる。デフォルトはmid(一定) */
    inSpeed?: 'fast' | 'slow' | 'mid';
    /** 開始スピードのレベル 0-100 デフォルト25 */
    inSpeedLevel: number;
    /** release方向 up:1, down:-1 */
    arrow?: number;
    /** releaseの移動距離 */
    releaseWidth: number;
    /** 次の音もスライドとするか ※システム的には音量下げるだけ track変えてクロスフェードするなら影響あり */
    continue?: true;
    /** slide時のみ、開始タイミング自動補正 */
    auto?: true;
}
/**
 * staccato
 *
 * 先頭から換算して"切る位置"を指定する
 */
export interface StyleStaccato extends SyntaxLocation {
    cutUntil: UntilNext;
}
/**
 * step
 * e.g. [ 'fn', '.', '6', '61', '6', '6' ]
 */
export interface StyleStep extends SyntaxLocation {
    parsedStep: ParsedStep[];
}
export interface ParsedStep {
    stepSym: string[];
    /** rest is undefined */
    stringIndexes: number[] | undefined;
    inst: ESInst;
    suffix: string;
    line: number;
    startPos: number;
    endPos: number;
}
/**
 * stroke
 */
export interface StyleStroke extends SyntaxLocation {
    until: UntilNext;
    up?: boolean;
    off?: true;
}
/**
 * strum
 * e.g.
 *   strum(1/16,0.5)
 */
export interface StyleStrum extends SyntaxLocation {
    /** 鳴音遅延幅 デフォルトは無し([0/1]) */
    startUntil: UntilNext;
    /** strum幅。ミリ秒で指定する。Tickを弦数で割るため、弦数は関係ない */
    strumWidthMSec: number;
    /** 適用済みフラグ(システム用) */
    _applied?: true;
}
/**
 * tonal obj
 * e.g
 *   :key(E major 7th mode 3th)
 *   :key(D melodic major mode 3th)
 */
export interface DegreeObj {
    tonic: IKey;
    /** normal or major, minor, unknown */
    scale: Scale;
    /** minor or major */
    tonal: Tonality;
    /** tonal shift e.g. minor 7th */
    tonalShift: IShiftMax7;
    /** modal shift e.g. mode 3th */
    modalShift: IShiftMax7;
    /** scale total name */
    name: string;
    /** diatonic structure */
    diatonicEvolverValue: DiatonicEvolverValue;
    sys: {
        shiftedKeyArray: string[];
        note7array: string[];
    };
}
export interface StyleTurn extends SyntaxLocation {
    name: string;
}
