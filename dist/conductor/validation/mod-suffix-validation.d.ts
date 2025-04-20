import { UntilNext } from "../interface/utils.interface";
import { ErrorBase, IResult } from "../interface/utils.response.interface";
/**
 * validation for suffix
 */
/**
 * apply '~','^','='
 * @param untilNext
 * @param suffix
 * @returns isApply
 */
export declare function mathSuffixExtension(untilNext: UntilNext, token: string, line: number, linePos: number): IResult<boolean, ErrorBase>;
