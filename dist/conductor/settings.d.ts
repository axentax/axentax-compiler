import { ScaleName } from "./diatonic-and-scale/mod-scale";
import { Settings } from "./interface/settings";
import { IKey, bin12, Scale, Tonality } from "./interface/utils.interface";
export declare const sysBaseSettings: {
    tonalObj: {
        tonic: IKey;
        scale: Scale;
        tonal: Tonality;
        tonalShift: import("./interface/utils.interface").IShiftMax7;
        modalShift: import("./interface/utils.interface").IShiftMax7;
        name: string;
        diatonicEvolverValue: {
            evolvedCodePrefix: string[];
            bin: bin12;
        };
        sys: {
            shiftedKeyArray: string[];
            note7array: string[];
        };
    };
    styleScaleX: {
        key: IKey;
        scale: ScaleName;
        bin: bin12;
    };
};
export declare const defaultSettings: Settings;
