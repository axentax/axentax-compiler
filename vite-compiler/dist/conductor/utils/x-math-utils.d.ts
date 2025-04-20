/**
 * 数学計算ユーティリティ
 *
 * 数学的な計算に関する共通的なユーティリティ関数を提供する
 * 最大公約数、最小公倍数などの基本的な数学関数を含む
 *
 * このモジュールは、音楽記譜法のコンパイル処理において、
 * 拍子記号の約分、タイミング計算、音符の長さ計算などに使用される
 */
/**
 * 最大公約数（Greatest Common Divisor）を計算する
 *
 * ユークリッドの互除法を使用して2つの数の最大公約数を求める
 * 音楽理論での拍子記号の約分や、タイミング計算で使用される
 *
 * 用途：
 * - 拍子記号の約分（例：6/8 → 3/4）
 * - 音符の長さの正規化
 * - タイミング計算での共通単位の算出
 * - 複数の音符の同期タイミング計算
 *
 * @param a 1つ目の数
 * @param b 2つ目の数
 * @returns 最大公約数
 *
 * @example
 * greatestCommonDivisor(12, 18) // 6
 * greatestCommonDivisor(8, 12)  // 4
 * greatestCommonDivisor(5, 7)   // 1 (互いに素)
 */
export declare function greatestCommonDivisor(a: number, b: number): number;
