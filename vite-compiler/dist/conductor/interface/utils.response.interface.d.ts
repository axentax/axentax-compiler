export type IApiResult<T, S, E extends ErrorBase> = ApiSuccess<T, S> | E;
/**
 * APIの成功結果を表すクラス
 * @template T レスポンスボディの型
 * @template S システム情報の型
 */
export declare class ApiSuccess<T, S> {
    readonly statusCode: number;
    readonly body: T;
    readonly system: S;
    /**
     * APIの成功結果を作成
     * @param statusCode ステータスコード
     * @param body レスポンスボディ
     * @param system システム情報
     */
    constructor(statusCode: number, body: T, system?: S);
    fail: () => this is ErrorBase;
}
export type IResult<T, E extends ErrorBase> = Success<T> | E;
export type ISuccess<T> = Success<T>;
/**
 * 成功結果を表すクラス
 * @template T 結果の型
 */
export declare class Success<T> {
    readonly res: T;
    /**
     * 成功結果を作成
     * @param result 結果
     */
    constructor(result: T);
    fail: () => this is ErrorBase;
}
export type SimpleResult = IResult<null, ErrorBase>;
/**
 * シンプルな成功結果を返す
 * @returns null値の成功結果
 */
export declare const simpleSuccess: () => Success<null>;
/**
 * 警告を表す型
 */
export type Warning = {
    /** 警告メッセージ */
    message: string;
    /** 行番号 */
    line: number;
    /** 位置（オプション） */
    pos?: number;
};
/**
 * エラーの基底クラス
 */
export declare abstract class ErrorBase extends Error {
    readonly statusCode: number;
    readonly message: string;
    readonly line: number;
    readonly linePos: number;
    readonly token: string | null;
    /**
     * エラーを作成
     * @param line 行番号
     * @param linePos 行内位置
     * @param token トークン
     * @param message エラーメッセージ
     */
    constructor(line: number, linePos: number, token: string | null, message: string);
    fail: () => this is ErrorBase;
}
export declare class E400 extends ErrorBase {
    readonly type = "E400";
    readonly statusCode = 400;
}
export declare class E401 extends ErrorBase {
    readonly type = "E401";
    readonly statusCode = 401;
}
export declare class E403 extends ErrorBase {
    readonly type = "E403";
    readonly statusCode = 403;
}
export declare class E404 extends ErrorBase {
    readonly type = "E404";
    readonly statusCode = 404;
}
export declare class E405 extends ErrorBase {
    readonly type = "E405";
    readonly statusCode = 405;
}
export declare class E409 extends ErrorBase {
    readonly type = "E409";
    readonly statusCode = 409;
}
export declare class E418 extends ErrorBase {
    readonly type = "E418";
    readonly statusCode = 418;
}
export declare class E422 extends ErrorBase {
    readonly type = "E422";
    readonly statusCode = 422;
}
export declare class E429 extends ErrorBase {
    readonly type = "E429";
    readonly statusCode = 429;
}
export declare class E500 extends ErrorBase {
    readonly type = "E500";
    readonly statusCode = 500;
}
