import { CompileSymbols } from "../interface/compile";
import { Conduct } from "../interface/conduct";
import { SimpleResult } from "../interface/utils.response.interface";
export declare class ModFlash_dual {
    static resolve(conduct: Conduct, dualId: number, regionIndex: number, fullNoteIndex: number, blockNoteIndex: number, sym: CompileSymbols): SimpleResult;
}
