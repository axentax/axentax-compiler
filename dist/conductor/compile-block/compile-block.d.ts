import { SimpleResult } from "../interface/utils.response.interface";
import { CompileSymbols } from "../interface/compile";
import { Conduct } from "../interface/conduct";
export declare class BlockCompiler {
    static compile(conduct: Conduct, symbolsDualLists: CompileSymbols[][]): SimpleResult;
}
