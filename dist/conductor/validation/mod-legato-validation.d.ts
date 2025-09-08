import { TabObj } from '../interface/tab';
import { SimpleResult } from '../interface/utils.response.interface';

/**
 * レガート記法の妥当性を検証する
 * @param legTOLine - レガート対象のタブオブジェクト配列
 * @returns 検証結果
 */
export declare function valid(legTOLine: TabObj[]): SimpleResult;
