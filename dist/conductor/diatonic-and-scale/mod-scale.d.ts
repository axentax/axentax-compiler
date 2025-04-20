import { ScaleEvolverValue } from "../interface/scale";
export declare enum ScaleName {
    major = 0,
    minor = 1,
    dorian = 2,
    diminish = 3,
    halfDiminish = 4,
    pentatonic = 5,
    harmonicMinor = 6,
    melodicMinor = 7,
    chromatic = 8
}
/**
 * スケール名配列
 */
export declare const ScaleNameKeys: string[];
export declare const ScaleList: {
    [key in ScaleName]: ScaleEvolverValue;
};
