import { Conduct } from "../interface/conduct";
import { SimpleResult } from "../interface/utils.response.interface";
export declare class ResolveBPM {
    static resolve(conduct: Conduct): SimpleResult;
    /**
     *
     * @param conduct
     * @returns
     */
    static mathBPMTime(conduct: Conduct): SimpleResult;
}
