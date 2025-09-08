import { ParsedStep } from '../interface/style';
import { NumberOrUfd } from '../interface/utils.interface';

/**
 * ステップ情報を表すインターフェース
 */
export interface StepInfo {
    /** 全てのタブ情報 */
    tabAll: NumberOrUfd[];
    /** パースされたステップリスト */
    parsedStepList: ParsedStep[];
}
