import { StyleScaleX, DegreeObj } from "./style";
import { IKey, UntilNext, UserIKey } from "./utils.interface";
export interface Settings {
    ver: string;
    strict: boolean;
    song: {
        key: UserIKey;
    };
    style: {
        degree: DegreeObj;
        scale: StyleScaleX;
        tuning: IKey[];
        until: UntilNext;
        bpm: number;
    };
    compile: {
        mappingResolved: boolean;
    };
    downTuning: number;
    hash: {
        compose: string;
    };
    dual: {
        pan: boolean;
        panning: number[];
    };
    click: {
        until: UntilNext;
        inst: number;
        velocity: number;
        accent: number;
    };
    /**  */
    play: {
        velocities: number[];
        possibleMSEC: {
            /** 連続フルピッキングが可能な1音の秒数 */
            fullPicking: number;
            /** h/p混入ピッキング/トリル/タッピング左手が可能な1音の秒数、※弦移動無し */
            trill: number;
            /** スウィープが可能な1音の秒数、※弦移動のみ */
            sweep: number;
        };
        strum: {
            /** デフォルトのストラム幅（ミリ秒） */
            defaultStrumWidthMSec: number;
            velocity: number;
        };
        approach: {
            widthOfSlide: {
                /** スライド範囲を分割する前の基本tick */
                baseTick: number;
                /** スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める */
                maxSplitTick: number;
            };
            velocity: {
                /** スライド開始する最大音量 */
                max: number;
                /** 1フレット毎の音量減少値 */
                decrease: number;
                /** スライド連続で減少する音量の最低音量 */
                min: number;
                /** 着地音量 */
                minLanding: number;
            };
        };
        slide: {
            widthOfSlide: {
                /** スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める */
                maxSplitTick: number;
                /** 分配値 */
                distributionTick: number;
            };
            velocity: {
                /** スライド開始する最大音量 */
                max: number;
                /** 1フレット毎の音量減少値 */
                decrease: number;
                /** スライド連続で減少する音量の最低音量 */
                min: number;
                /** 着地音量 */
                landing: number;
            };
            realization: {
                /** 着地点に解放弦が含まれている、且つ開始フレットに4フレット以下がない場合、スライド終了位置を3フレットに変更 */
                realizationLandingPointOpenBows: boolean;
                /** スライド中のフレット滞在時間が大きい場合、自然な滞在時間に自動で調整する */
                autoStartPointAdjustmentThresholdSec: number;
            };
        };
        release: {
            widthOfSlide: {
                /** スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める */
                maxSplitTick: number;
                /** 分配値 */
                distributionTick: number;
            };
            velocity: {
                /** スライド開始する最大音量 */
                max: number;
                /** 1フレット毎の音量減少値 */
                decrease: number;
                /** スライド連続で減少する音量の最低音量 */
                min: number;
                /** 着地音量 */
                landing: number;
            };
        };
    };
}
