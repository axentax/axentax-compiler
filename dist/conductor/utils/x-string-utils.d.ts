/** 抽出されたトークンと位置情報の型定義 */
type ExtractedTokenWithLineAndPos = {
    line: number;
    pos: number;
    token: string;
};
/** 抽出されたキー・バリュートークンと位置情報の型定義 */
/**
 * 文字列操作ユーティリティ
 *
 * 記譜法の文字列解析に関するユーティリティ関数を提供する
 * トークン分割、位置情報の追跡、括弧処理などの機能を含む
 *
 * このモジュールは、音楽記譜法の構文解析において、
 * 文字列の分割、位置情報の管理、エラー位置の特定などに使用される
 */
/**
 * 改行も区切り文字として使用して値を分割する
 *
 * 改行以外の文字は継続文字として認識される
 * 括弧のネストレベルを考慮して、適切な位置でトークンを分割する
 *
 * 処理の特徴：
 * - 括弧の外では改行でトークンを分割
 * - 括弧内では改行もトークンの一部として扱う
 * - 空白文字の適切な処理
 * - 位置情報の正確な追跡
 *
 * 用途：
 * - 記譜法の構文解析
 * - 設定ファイルの解析
 * - エラー位置の特定
 *
 * @param startLine 開始行番号
 * @param startPos 開始位置
 * @param totalToken 分割対象の文字列
 * @param otherDelimiters 追加の区切り文字配列
 * @returns 分割されたトークンと位置情報の配列
 *
 * @example
 * splitValuesEvenOnLineBrakes(1, 1, "key1:value1\nkey2:value2", [':'])
 * // [
 * //   { token: "key1", line: 1, pos: 1 },
 * //   { token: "value1", line: 1, pos: 6 },
 * //   { token: "key2", line: 2, pos: 1 },
 * //   { token: "value2", line: 2, pos: 6 }
 * // ]
 */
export declare function splitValuesEvenOnLineBrakes(startLine: number, startPos: number, totalToken: string, otherDelimiters?: string[]): ExtractedTokenWithLineAndPos[];
/**
 * 括弧内のトークンの実際の位置を解決する
 *
 * 括弧で囲まれたトークンの実際の開始位置（空白や括弧を除いた位置）を計算する
 *
 * 処理内容：
 * - 改行で分割された文字列を処理
 * - 各行で最初の非空白・非括弧文字の位置を特定
 * - 正確な行番号と位置を計算
 *
 * 用途：
 * - エラー位置の正確な特定
 * - 括弧内トークンの位置情報の正規化
 *
 * @param accum 蓄積された文字列
 * @param line 基準行番号
 * @param pos 基準位置
 * @returns 解決された位置情報
 *
 * @example
 * resolveLocationOfRoundBracket("  (  value  )", 1, 5)
 * // { line: 1, pos: 8 } (valueの開始位置)
 */
export declare function resolveLocationOfRoundBracket(accum: string, line: number, pos: number): {
    line: number;
    pos: number;
};
/**
 * 括弧を考慮してトークンを空白と改行で分割し、位置情報を抽出
 * @param startLine 開始行番号
 * @param startPos 開始位置
 * @param totalToken 分割対象の文字列
 * @returns 分割されたトークンと位置情報の配列
 */
export declare function splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(startLine: number, startPos: number, totalToken: string): ExtractedTokenWithLineAndPos[];
/**
 * 文字列または数値に接頭辞を追加する
 * 引数`a`が`null`または`undefined`の場合、空文字列を返す
 * @param a 接頭辞を追加する文字列または数値
 * @param b 追加する接頭辞
 * @returns 接頭辞が追加された文字列、または空文字列
 */
export declare function addPre(a: string | number | undefined, b: string): string;
export {};
/**
 * 括弧で囲まれたキー・バリューペアを分割して位置情報を抽出する
 *
 * 記譜法の設定構文（key:value形式）を解析し、キーとバリューの位置情報を含めて分割する
 * 括弧のネストや改行を適切に処理する
 *
 * 処理の特徴：
 * - キーとバリューの両方の位置情報を保持
 * - 括弧のネストレベルを考慮した分割
 * - エラー検出と適切なエラーレスポンス
 * - 空白文字の適切な処理
 *
 * 用途：
 * - 記譜法の設定構文解析
 * - キー・バリューペアの位置情報管理
 * - 構文エラーの詳細な位置特定
 *
 * @param startLine 開始行番号
 * @param startPos 開始位置
 * @param totalToken 分割対象の文字列
 * @returns キー・バリューペアと位置情報の配列
 *
 * @example
 * splitBracketedKeyValueTokenWithExtractLineAndPos(1, 1, "key1:value1\nkey2:(value2)")
 * // [
 * //   {
 * //     key: { token: "key1", line: 1, pos: 1 },
 * //     val: { token: "value1", line: 1, pos: 6 }
 * //   },
 * //   {
 * //     key: { token: "key2", line: 2, pos: 1 },
 * //     val: { token: "(value2)", line: 2, pos: 6 }
 * //   }
 * // ]
 */
