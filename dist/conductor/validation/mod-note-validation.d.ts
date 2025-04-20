import { DegreeObj } from "../interface/style";
import { NumberOrUfd } from "../interface/utils.interface";
import { ErrorBase, IResult } from "../interface/utils.response.interface";
/**
 * Validation for notes.
 */
/**
 * %1, %1/2, %1m/2
 * '%' has been removed in advance
 */
export declare function degreeSymbol(degree: DegreeObj, token: string, line: number, linePos: number): IResult<string, ErrorBase>;
/**
 * e.g. C, D, E, F, G, A, B
 */
export declare function chordSymbol(token: string, noteStr: string, line: number, linePos: number): IResult<null, ErrorBase>;
/**
 * e.g. r|2|2|2
 */
export declare function tabSymbol(tuning: string[], token: string, line: number, linePos: number): IResult<NumberOrUfd[], ErrorBase>;
