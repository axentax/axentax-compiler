import { ErrorBase, IResult } from "../interface/utils.response.interface";
/** return type */
type ExtractedTokenWithLineAndPos = {
    line: number;
    pos: number;
    token: string;
};
/** return type */
type ExtractedKeyValueTokenWithLineAndPos = {
    key: {
        token: string;
        line: number;
        pos: number;
    };
    val: {
        token: string;
        line: number;
        pos: number;
    };
};
/**
 * XStrUtils
 */
/**
 * Line breaks are also used as delimiters.
 * (characters other than line breaks are recognized as continuation characters)
 */
export declare function splitValuesEvenOnLineBrakes(startLine: number, startPos: number, totalToken: string, otherDelimiters?: string[]): ExtractedTokenWithLineAndPos[];
/**
 *
 * @param accum
 * @param line
 * @param pos
 * @returns
 */
export declare function resolveLocationOfRoundBracket(accum: string, line: number, pos: number): {
    line: number;
    pos: number;
};
/**
 *
 * @param startLine
 * @param startPos
 * @param totalToken
 * @returns
 */
export declare function splitBracketedKeyValueTokenWithExtractLineAndPos(startLine: number, startPos: number, totalToken: string): IResult<ExtractedKeyValueTokenWithLineAndPos[], ErrorBase>;
/**
 * --- pos以外からは未使用 ---
 * @param startLine
 * @param startPos
 * @param totalToken
 * @returns
 */
export declare function splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(startLine: number, startPos: number, totalToken: string): ExtractedTokenWithLineAndPos[];
/**
 * Adds a prefix to a string or number.
 * If the argument `a` is `null` or `undefined`, this method returns an empty string.
 * Otherwise, it prepends `b` to the string representation of `a` and returns the result.
 *
 * @param a The string or number to which the prefix will be added, or `undefined`.
 * @param b The prefix to be added.
 * @return The resulting string with the prefix added, or an empty string if `a` is `null` or `undefined`.
 */
export declare function addPre(a: string | number | undefined, b: string): string;
export {};
/**
 * Adds a suffix to a string or number.
 * <p>
 * If the argument `a` is `null` or `undefined`, this method returns an empty string.
 * Otherwise, it appends `b` to the string representation of `a` and returns the result.
 *
 * @param a The string or number to which the suffix will be added, or `undefined`.
 * @param b The suffix to be added.
 * @return The resulting string with the suffix added, or an empty string if `a` is `null` or `undefined`.
 */
