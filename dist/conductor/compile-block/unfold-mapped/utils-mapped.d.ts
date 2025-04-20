import { BoardForShiftSeed, MapSeed } from "../../interface/dic-map-seed";
import { StyleScaleX } from "../../interface/style";
import { IKey } from "../../interface/utils.interface";
/**
 * create seed
 * @param seed
 * @param tuning
 * @param scale
 */
export declare function createSeed(seed: MapSeed, tuning: IKey[], scale: StyleScaleX): BoardForShiftSeed;
