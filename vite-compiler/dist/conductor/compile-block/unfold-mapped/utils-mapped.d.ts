import { BoardForShiftSeed, MapSeed } from '../../interface/dic-map-seed';
import { StyleScaleX } from '../../interface/style';
import { IKey } from '../../interface/utils.interface';

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
export declare function createSeed(seed: MapSeed, tuning: IKey[], scale: StyleScaleX): BoardForShiftSeed;
