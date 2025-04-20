import { Conduct } from "../interface/conduct";
import { SimpleResult } from "../interface/utils.response.interface";
export declare class ModTick_dual {
    /**
     * ノート毎のtick決定と付随処理
     */
    static resolve(conduct: Conduct, dualId: number): SimpleResult;
}
