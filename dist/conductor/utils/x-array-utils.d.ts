/**
 * 配列操作ユーティリティ
 *
 * 配列の操作に関する共通的なユーティリティ関数を提供する
 * 配列の初期化、範囲生成、インデックス操作、シフト操作などの機能を含む
 *
 * このモジュールは、音楽記譜法のコンパイル処理において、
 * 音符配列、コード配列、タイミング配列などの操作に使用される
 */
/**
 * 配列にpushする。配列がない場合は作成する
 *
 * オブジェクト内の指定されたプロパティが配列でない場合、新しい配列を作成して値を追加する
 * 既に配列が存在する場合は、その配列に値を追加する
 *
 * 用途：
 * - 動的に配列プロパティを初期化する必要がある場合
 * - オブジェクトの構造が事前に確定していない場合の安全な配列操作
 *
 * @param object 対象オブジェクト
 * @param arrName オブジェクト内の配列プロパティ名
 * @param val 追加する値
 */
export declare function orPush<T, V>(object: T, arrName: keyof T, val: V): void;
/**
 * 特定範囲のnumberの配列作成
 *
 * 開始値から終了値までの連続した数値の配列を生成する
 * 開始値と終了値の両方を含む（閉区間）
 *
 * 用途：
 * - フレット番号の範囲生成（例：1-12フレット）
 * - 弦番号の範囲生成（例：1-6弦）
 * - 小節番号の範囲生成
 *
 * @param start 開始値（含む）
 * @param end 終了値（含む）
 * @returns 連続した数値の配列
 *
 * @example
 * createNumberBetweenArray(1, 5) // [1, 2, 3, 4, 5]
 * createNumberBetweenArray(0, 3) // [0, 1, 2, 3]
 */
export declare function createNumberBetweenArray(start: number, end: number): number[];
/**
 * 指定indexが、指定配列範囲の超過を折り返しで解決したindexでの指定配列の値を取得
 *
 * 配列のインデックスが範囲を超えた場合、配列の両端で折り返して値を取得する
 * 例：[1,2,3]でインデックス4を指定すると、インデックス1の値（2）を返す
 *
 * 用途：
 * - 循環的な音楽パターンの処理
 * - スケール音の循環参照
 * - コード進行の循環処理
 *
 * @param numberArray 対象配列
 * @param index 取得したいインデックス（負の値も可）
 * @returns 折り返し処理後のインデックスに対応する値
 *
 * @example
 * const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
 * getReboundIndexValue(scale, 7)  // 'D' (インデックス1の値)
 * getReboundIndexValue(scale, -1) // 'B' (インデックス6の値)
 */
export declare function getReboundIndexValue<T>(numberArray: T[], index: number): T;
/**
 * [未使用]指定indexが、指定配列範囲の超過を折り返しで解決したindexを取得
 *
 * 配列のインデックスが範囲を超えた場合、配列の両端で折り返してインデックスを取得する
 * getReboundIndexValueと異なり、値ではなくインデックスを返す
 *
 * ※値を返すものではないので注意
 *
 * 用途：
 * - 循環的なインデックス計算が必要な場合
 * - 配列の境界を超えたインデックスを安全に処理する場合
 *
 * @param numberArray 対象配列
 * @param index 解決したいインデックス（負の値も可）
 * @returns 折り返し処理後のインデックス
 *
 * @example
 * const arr = ['A', 'B', 'C'];
 * getReboundResolvedIndex(arr, 4)  // 1
 * getReboundResolvedIndex(arr, -1) // 2
 */
export declare function getReboundResolvedIndex<T>(numberArray: T[], index: number): number;
/**
 * 配列arrのn番目のvのインデックスを返す
 *
 * 配列内で指定された値がn回目に出現する位置のインデックスを取得する
 * 0番目はないため、nには最低1を指定する必要がある
 *
 * 用途：
 * - 同じ値が複数回出現する配列での位置特定
 * - 音楽記譜法での同じ音符の複数回出現の処理
 * - コード進行での同じコードの複数回出現の処理
 *
 * @param arr 検索対象の配列
 * @param n 何番目の出現を探すか（1以上）
 * @param v 検索する値
 * @returns n番目のvのインデックス（見つからない場合は-1）
 *
 * @example
 * const notes = ['C', 'D', 'C', 'E', 'C'];
 * findNthOneIndex(notes, 1, 'C') // 0 (1番目のC)
 * findNthOneIndex(notes, 2, 'C') // 2 (2番目のC)
 * findNthOneIndex(notes, 3, 'C') // 4 (3番目のC)
 * findNthOneIndex(notes, 4, 'C') // -1 (4番目のCは存在しない)
 */
export declare function findNthOneIndex<T>(arr: T[], n: number, v: T): number;
/**
 * 配列を、指定インデックスから始まるようにシフトする
 *
 * 指定されたインデックスを先頭として、配列を再構成する
 * 元の配列の順序は保持されるが、開始位置が変更される
 *
 * 用途：
 * - 音楽スケールの開始音変更
 * - コード進行の開始位置変更
 * - 循環的なパターンの開始位置調整
 *
 * @param array 対象配列
 * @param index 新しい開始位置のインデックス
 * @returns シフトされた配列
 *
 * @example
 * const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
 * shiftArrayAsIndex(scale, 2) // ['E', 'F', 'G', 'A', 'B', 'C', 'D']
 */
export declare function shiftArrayAsIndex<T>(array: T[], index: number): T[];
/**
 * 配列を、指定の値から始まるようにシフトする
 *
 * 指定された値を配列の先頭として、配列を再構成する
 * 指定された値が配列内に存在しない場合、元の配列がそのまま返される
 *
 * 用途：
 * - 音楽スケールの開始音変更（音名指定）
 * - コード進行の開始コード変更
 * - 調性変更時のスケール再構成
 *
 * @param array 対象配列
 * @param target 新しい開始位置の値
 * @returns シフトされた配列
 *
 * @example
 * const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
 * shiftArray(scale, 'G') // ['G', 'A', 'B', 'C', 'D', 'E', 'F']
 * shiftArray(scale, 'X') // ['C', 'D', 'E', 'F', 'G', 'A', 'B'] (Xは存在しないため元の配列)
 */
export declare function shiftArray<T>(array: T[], target: T): T[];
