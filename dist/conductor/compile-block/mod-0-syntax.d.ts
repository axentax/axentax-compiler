import { CompileSymbols } from "../interface/compile";
import { Conduct } from "../interface/conduct";
import { ErrorBase, IResult } from "../interface/utils.response.interface";
export declare class ModSyntax {
    static as(conduct: Conduct): IResult<CompileSymbols[][], ErrorBase>;
}
