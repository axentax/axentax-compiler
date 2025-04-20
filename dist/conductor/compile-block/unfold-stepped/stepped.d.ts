import { CompileSymbols } from "../../interface/compile";
import { Conduct } from "../../interface/conduct";
import { SimpleResult } from "../../interface/utils.response.interface";
export declare class UnfoldStepped {
    /**
     * resolve step
     * - style add point
     */
    static apply(conduct: Conduct, dualId: number, symbolsList: CompileSymbols[]): SimpleResult;
}
