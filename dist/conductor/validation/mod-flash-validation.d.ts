import { Conduct } from "../interface/conduct";
import { SimpleResult } from "../interface/utils.response.interface";
export declare function allowAnnotation(conduct: Conduct, dualId: number, regionId: number, fullNoteIndex: number, regionNoteIndex: number, name: string, token: string, line: number, linePos: number): SimpleResult;
/** offset */
export declare function offset(conduct: Conduct, dualId: number, regionIndex: number, blockNoteIndex: number, token: string, line: number, linePos: number): SimpleResult;
/** click */
export declare function click(conduct: Conduct, dualId: number, regionIndex: number, fullNoteIndex: number, token: string, line: number, linePos: number): SimpleResult;
