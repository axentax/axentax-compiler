import { ErrorBase, IResult, SimpleResult } from "../interface/utils.response.interface";
import { Conduct } from "../interface/conduct";
/**
 * settings resolver for user
 */
export declare class SettingResolver {
    /**
     * Apply user settings.
     * @param conduct
     */
    resolve(conduct: Conduct): SimpleResult;
}
/**
 * settings type normalization.
 * @param key
 * @param value
 * @returns
 */
export declare function normalization(conduct: Conduct, key: string, value: string, fullKey: string, line: number): IResult<any, ErrorBase>;
