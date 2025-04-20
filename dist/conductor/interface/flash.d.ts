import { SyntaxLocation, UntilNext } from "./utils.interface";
export interface OtherAnnotationData {
    name: string;
    dualId: number;
    regionId: number;
    fullNoteIndex: number;
    regionNoteIndex: number;
    location: {
        line: number;
        linePos: number;
    };
    dataStr: string;
}
export interface Flash {
    click: Click[];
    offset: Offset;
    other: OtherAnnotationData[];
}
export interface Offset {
    /** offset key is `${dualId}_{regionIndex}` */
    [keys: string]: {
        syntaxLocation: SyntaxLocation;
        blockNoteIndex: number;
    };
}
/** baseのblockにおいて、クリック音を設定する情報 */
export interface Click {
    start?: {
        regionIndex: number;
        fullNoteIndex: number;
        until: UntilNext;
        inst: number;
        velocity: number;
    };
    stop?: {
        regionIndex: number;
        noteIndex: number;
    };
}
