import { ScaleName } from './diatonic-and-scale/mod-scale';
import { Settings } from './interface/settings';
import { IKey, bin12, Scale, Tonality } from './interface/utils.interface';

/**
 * システム基本設定
 *
 * 音楽理論に基づく基本的な調性設定を定義する
 * 調号、スケール、調性などの音楽理論的な基本情報を含む
 *
 * この設定は、コード進行の理論的根拠やスケール判定の基準として使用される
 * 音楽理論に基づいて、どの音が調に含まれるか、どのコードが使用可能かを決定する
 */
export declare const sysBaseSettings: {
    /** 調性オブジェクト：調号、スケール、調性などの基本情報 */
    tonalObj: {
        tonic: IKey;
        scale: Scale;
        tonal: Tonality;
        tonalShift: import('./interface/utils.interface').IShiftMax7;
        modalShift: import('./interface/utils.interface').IShiftMax7;
        name: string;
        /** ダイアトニック進化値：コード進行の理論的根拠 */
        diatonicEvolverValue: {
            evolvedCodePrefix: string[];
            bin: bin12;
        };
        /** システム設定 */
        sys: {
            shiftedKeyArray: string[];
            note7array: string[];
        };
    };
    /** スタイルスケール設定：演奏スタイルに影響するスケール情報 */
    styleScaleX: {
        key: IKey;
        scale: ScaleName;
        bin: bin12;
    };
};
/**
 * デフォルト設定
 *
 * アプリケーション全体で使用されるデフォルト設定を定義する
 * ユーザーが明示的に設定を変更しない場合に使用される値
 *
 * この設定は、音楽記譜法のコンパイル時に基準となる値として使用される
 * 各設定項目は、実際の演奏やMIDI生成に直接影響する
 */
export declare const defaultSettings: Settings;
