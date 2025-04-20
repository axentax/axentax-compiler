import { CompileSymbols } from "../../interface/compile";
import { Conduct } from "../../interface/conduct";
import { SimpleResult } from "../../interface/utils.response.interface";
/**
 * Mapper
 */
export declare class UnfoldMapped {
    static apply(conduct: Conduct, dualId: number, symbolsList: CompileSymbols[]): SimpleResult;
}
