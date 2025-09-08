import { DiatonicEvolverValue } from '../interface/diatonic';

/**
 * ダイアトニック進行テンプレートのクローン関数
 *
 * 指定したスケール名のテンプレートをディープコピーして返す
 * structuredCloneを利用
 * @param scaleName スケール名
 * @returns DiatonicEvolverValueのクローン
 */
export declare const cloneDiatonicEvolver: (scaleName: string) => DiatonicEvolverValue;
