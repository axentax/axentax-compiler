import { IKey } from "../interface/utils.interface";
/**
 * 汎用ユーティリティ
 *
 * 数値計算、文字列処理、音名変換などの汎用的なユーティリティ関数を提供する
 * 精度の高い数値計算や音楽理論に基づく音名変換機能を含む
 *
 * このモジュールは、音楽記譜法のコンパイル処理において、
 * 高精度な数値計算、音名の正規化、文字列処理などに使用される
 */
/**
 * 小数の誤差を回避して足し算する
 *
 * JavaScriptの浮動小数点演算の誤差を回避するため、Decimal.jsライブラリを使用
 * 音楽のタイミング計算など、精度が重要な場面で使用される
 *
 * 用途：
 * - 音符の長さ計算
 * - タイミング調整
 * - 拍子記号の計算
 *
 * @param a 1つ目の数値
 * @param b 2つ目の数値
 * @returns 正確な加算結果
 *
 * @example
 * decimalizeAdd(0.1, 0.2) // 0.3 (JavaScriptの通常の演算では0.30000000000000004になる)
 */
export declare function decimalizeAdd(a: number, b: number): number;
/**
 * 小数の誤差を回避して掛け算する
 *
 * JavaScriptの浮動小数点演算の誤差を回避するため、Decimal.jsライブラリを使用
 * 音楽のタイミング計算など、精度が重要な場面で使用される
 *
 * 用途：
 * - 音符の長さ計算
 * - タイミング調整
 * - 拍子記号の計算
 *
 * @param a 1つ目の数値
 * @param b 2つ目の数値
 * @returns 正確な乗算結果
 *
 * @example
 * decimalizeMul(0.1, 0.2) // 0.02 (正確な乗算結果)
 */
export declare function decimalizeMul(a: number, b: number): number;
/**
 * 小数の誤差を回避して割り算する
 *
 * JavaScriptの浮動小数点演算の誤差を回避するため、Decimal.jsライブラリを使用
 * 音楽のタイミング計算など、精度が重要な場面で使用される
 *
 * 用途：
 * - 音符の長さ計算
 * - タイミング調整
 * - 拍子記号の計算
 *
 * @param a 被除数
 * @param b 除数
 * @returns 正確な除算結果
 *
 * @example
 * decimalizeDiv(1, 3) // 0.3333333333333333 (正確な除算結果)
 */
export declare function decimalizeDiv(a: number, b: number): number;
/**
 * 小数の誤差を回避して引き算する
 *
 * JavaScriptの浮動小数点演算の誤差を回避するため、Decimal.jsライブラリを使用
 * 音楽のタイミング計算など、精度が重要な場面で使用される
 *
 * 用途：
 * - 音符の長さ計算
 * - タイミング調整
 * - 拍子記号の計算
 *
 * @param a 被減数
 * @param b 減数
 * @returns 正確な減算結果
 *
 * @example
 * decimalizeSub(1, 0.9) // 0.1 (正確な減算結果)
 */
export declare function decimalizeSub(a: number, b: number): number;
/**
 * スタイルキー用の内部トリマー
 *
 * 記譜法のスタイル指定部分の空白文字を整理する
 * 括弧の前後の空白、カンマの前後の空白、連続する空白を適切に処理する
 *
 * 処理内容：
 * - 閉じ括弧前の空白を除去
 * - 開き括弧後の空白を除去
 * - カンマの前後の空白を除去
 * - 連続する空白を単一の空白に統一
 *
 * 例：token(  A   C  ) => token(A C)
 *
 * @param token 処理対象のトークン文字列
 * @returns 整理されたトークン文字列
 *
 * @example
 * innerTrimerForStyleKey("token(  A   C  )") // "token(A C)"
 * innerTrimerForStyleKey("style(  bend  ,  slide  )") // "style(bend,slide)"
 */
export declare function innerTrimerForStyleKey(token: string): string;
/**
 * 非標準音名を標準音名に変換する（2文字版）
 *
 * 音楽理論で使用される非標準的な音名（フラット記号付き）を標準的な音名（シャープ記号付き）に変換する
 * 例：Cb → B、Db → C#、Eb → D# など
 *
 * 変換ルール：
 * - フラット記号（b）をシャープ記号（#）に変換
 * - 音楽理論に基づく等価音への変換
 *
 * @param token 変換対象の音名
 * @returns 標準的な音名
 *
 * @example
 * resolveNonRegularKey2str('Cb') // 'B'
 * resolveNonRegularKey2str('Db') // 'C#'
 * resolveNonRegularKey2str('Bb') // 'A#'
 */
export declare function resolveNonRegularKey2str(token: string): IKey;
/**
 * 非標準音名を標準音名に変換する（3文字版）
 *
 * 音楽理論で使用される非標準的な音名（ダブルシャープ、ダブルフラット、シャープフラット）を標準的な音名に変換する
 * 例：Cb# → C、C## → D、Cbb → Bb など
 *
 * 変換ルール：
 * - シャープフラット（b#、#b）は元の音名に戻す
 * - ダブルシャープ（##）は次の音名に変換
 * - ダブルフラット（bb）は前の音名に変換
 *
 * @param token 変換対象の音名
 * @returns 標準的な音名
 *
 * @example
 * resolveNonRegularKey3str('Cb#') // 'C'
 * resolveNonRegularKey3str('C##') // 'D'
 * resolveNonRegularKey3str('Cbb') // 'Bb'
 */
export declare function resolveNonRegularKey3str(token: string): IKey;
/**
 * 次の音名を検索する
 *
 * 12音階で指定された音名の次の音名を取得する
 * 例：C → C#、B → C（オクターブを超える場合は最初に戻る）
 *
 * 用途：
 * - ダブルシャープの処理
 * - 音程計算
 * - スケール生成
 *
 * @param sym 基準となる音名
 * @returns 次の音名
 *
 * @example
 * searchNextKey('C') // 'C#'
 * searchNextKey('B') // 'C'
 * searchNextKey('C#') // 'D'
 */
export declare function searchNextKey(sym: IKey): IKey;
/**
 * 前の音名を検索する
 *
 * 12音階で指定された音名の前の音名を取得する
 * 例：C → B、C# → C（オクターブを下る場合は最後に戻る）
 *
 * 用途：
 * - ダブルフラットの処理
 * - 音程計算
 * - スケール生成
 *
 * @param sym 基準となる音名
 * @param shift 戻る音程数（デフォルト：1）
 * @returns 前の音名
 *
 * @example
 * searchPrevKey('C') // 'B'
 * searchPrevKey('C', 2) // 'Bb'
 * searchPrevKey('C#') // 'C'
 */
export declare function searchPrevKey(sym: IKey, shift?: number): IKey;
