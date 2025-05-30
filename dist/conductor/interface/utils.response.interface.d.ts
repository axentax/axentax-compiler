export type IApiResult<T, S, E extends ErrorBase> = ApiSuccess<T, S> | E;
export declare class ApiSuccess<T, S> {
    readonly statusCode: number;
    readonly body: T;
    readonly system: S;
    constructor(statusCode: number, body: T, system?: S);
    fail: () => this is ErrorBase;
}
export type IResult<T, E extends ErrorBase> = Success<T> | E;
export type ISuccess<T> = Success<T>;
export declare class Success<T> {
    readonly res: T;
    constructor(result: T);
    fail: () => this is ErrorBase;
}
export type SimpleResult = IResult<null, ErrorBase>;
export declare const simpleSuccess: () => Success<null>;
export type Warning = {
    message: string;
    line: number;
    pos?: number;
};
export declare abstract class ErrorBase extends Error {
    readonly statusCode: number;
    readonly message: string;
    readonly line: number;
    readonly linePos: number;
    readonly token: string | null;
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
export declare class QE400 extends E400 {
}
export declare class QE401 extends E401 {
}
export declare class QE403 extends E403 {
}
export declare class QE404 extends E404 {
}
export declare class QE409 extends E409 {
}
export declare class QE429 extends E429 {
}
export declare class QE500 extends E500 {
}
