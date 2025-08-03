export type IApiResult<T, S, E extends ErrorBase> = ApiSuccess<T, S> | E

/* istanbul ignore file */

/**
 * APIの成功結果を表すクラス
 * @template T レスポンスボディの型
 * @template S システム情報の型
 */
export class ApiSuccess<T, S> {
  readonly statusCode: number
  readonly body: T
  readonly system: S
  
  /**
   * APIの成功結果を作成
   * @param statusCode ステータスコード
   * @param body レスポンスボディ
   * @param system システム情報
   */
  constructor(statusCode: number, body: T, system?: S) {
    this.statusCode = statusCode
    this.body = body
    this.system = system as S
  }
  fail = (): this is ErrorBase => false
}

export type IResult<T, E extends ErrorBase> = Success<T> | E;
export type ISuccess<T> = Success<T>;

/**
 * 成功結果を表すクラス
 * @template T 結果の型
 */
export class Success<T> {
  readonly res: T;
  
  /**
   * 成功結果を作成
   * @param result 結果
   */
  constructor(result: T) {
    this.res = result;
  }
  fail = (): this is ErrorBase => false;
}

export type SimpleResult = IResult<null, ErrorBase>;
const singletonSimpleSuccess = new Success(null);

/**
 * シンプルな成功結果を返す
 * @returns null値の成功結果
 */
export const simpleSuccess = () => singletonSimpleSuccess;

/**
 * 警告を表す型
 */
export type Warning = {
  /** 警告メッセージ */
  message: string;
  /** 行番号 */
  line: number;
  /** 位置（オプション） */
  pos?: number,
};

/**
 * エラーの基底クラス
 */
export abstract class ErrorBase extends Error {
  readonly statusCode!: number;
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
  constructor(line: number, linePos: number, token: string | null, message: string) {
    super(message);
    this.message = message;
    this.line = line;
    this.linePos = linePos;
    this.token = token;
  }
  fail = (): this is ErrorBase => true;
}

export class E400 extends ErrorBase {
  readonly type = 'E400'
  readonly statusCode = 400
}

export class E401 extends ErrorBase {
  readonly type = 'E401'
  readonly statusCode = 401
}

export class E403 extends ErrorBase {
  readonly type = 'E403'
  readonly statusCode = 403
}

export class E404 extends ErrorBase {
  readonly type = 'E404'
  readonly statusCode = 404
}

export class E405 extends ErrorBase {
  readonly type = 'E405'
  readonly statusCode = 405
}

export class E409 extends ErrorBase {
  readonly type = 'E409'
  readonly statusCode = 409
}

export class E418 extends ErrorBase {
  readonly type = 'E418'
  readonly statusCode = 418
}

export class E422 extends ErrorBase {
  readonly type = 'E422'
  readonly statusCode = 422
}

export class E429 extends ErrorBase {
  readonly type = 'E429'
  readonly statusCode = 429
}

export class E500 extends ErrorBase {
  readonly type = 'E500'
  readonly statusCode = 500
}

// export class QE400 extends E400 {}

// export class QE401 extends E401 {}

// export class QE403 extends E403 {}

// export class QE404 extends E404 {}

// export class QE409 extends E409 {}

// export class QE429 extends E429 {}

// export class QE500 extends E500 {}