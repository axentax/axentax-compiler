import { SimpleResult } from '../interface/utils.response.interface';
import { Conduct } from '../interface/conduct';

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
