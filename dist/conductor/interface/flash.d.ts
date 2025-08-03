import { SyntaxLocation, UntilNext } from "./utils.interface";
/**
 * その他のアノテーションデータ
 */
export interface OtherAnnotationData {
    /** 名前 */
    name: string;
    /** デュアルID */
    dualId: number;
    /** リージョンID */
    regionId: number;
    /** 全体ノートインデックス */
    fullNoteIndex: number;
    /** リージョンノートインデックス */
    regionNoteIndex: number;
    /** 位置 */
    location: {
        /** 行番号 */
        line: number;
        /** 行内位置 */
        linePos: number;
    };
    /** データ文字列 */
    dataStr: string;
}
/**
 * フラッシュ情報
 */
export interface Flash {
    /** クリック情報 */
    click: Click[];
    /** オフセット情報 */
    offset: Offset;
    /** その他のアノテーション */
    other: OtherAnnotationData[];
}
/** dualなブロックにおいて、開始点を指定する値 */
export interface Offset {
    /** offset key is `${dualId}_{regionIndex}` */
    [keys: string]: {
        /** 構文位置 */
        syntaxLocation: SyntaxLocation;
        /** ブロックノートインデックス */
        blockNoteIndex: number;
    };
}
/**
 * ベースのブロックにおいて、クリック音を設定する情報
 */
export interface Click {
    /** 開始情報 */
    start?: {
        /** リージョンインデックス */
        regionIndex: number;
        /** 全体ノートインデックス */
        fullNoteIndex: number;
        /** until設定 */
        until: UntilNext;
        /** 楽器 */
        inst: number;
        /** ベロシティ */
        velocity: number;
    };
    /** 停止情報 */
    stop?: {
        /** リージョンインデックス */
        regionIndex: number;
        /** ノートインデックス */
        noteIndex: number;
    };
}
