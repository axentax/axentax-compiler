import { CompileSymbols } from "../../interface/compile";
import { Conduct } from "../../interface/conduct";
import { MapSeed } from "../../interface/dic-map-seed";
import { SimpleResult } from "../../interface/utils.response.interface";
export declare class MappedGroup {
    static resolve(seedObj: MapSeed, conduct: Conduct, dualId: number, group: number, symbolsList: CompileSymbols[]): SimpleResult;
}
