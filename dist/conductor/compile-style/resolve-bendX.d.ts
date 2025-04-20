import { Mixes } from "../interface/conduct";
import { StyleBendX } from "../interface/style";
import { Tick } from "../interface/tab";
import { SimpleResult } from "../interface/utils.response.interface";
/**
 * Bend new
 */
export declare class ResolveBendX {
    static resolve(mixes: Mixes): SimpleResult;
}
/**
 * for view
 * @param mixes
 * @param to
 * @param styleBendXList
 * @returns
 */
export declare function bdView(bar: Tick, styleBendXList: StyleBendX[]): import("../interface/bend").BendMidiSetter[];
