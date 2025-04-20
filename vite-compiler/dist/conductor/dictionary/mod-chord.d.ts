import { ErrorBase, IResult } from '../interface/utils.response.interface';
import { ChordDicMap, ChordProp } from '../interface/dic-chord';
import { IKey } from '../interface/utils.interface';
import { ExpandFingeringOptions } from '../chord-to-fingering/chord-to-fingering';

/**
 * ModChordクラス
 *
 * ギターコードのフィンガリング辞書生成・検索・キャッシュ・エラー処理などを担うユーティリティクラス。
 * コード名やタブ譜指定から、最適なフィンガリングや音名配列を自動生成し、キャッシュする。
 *
 * - create(): コード辞書の自動生成・キャッシュ・エラー処理のメインメソッド
 * - search(), inversion(), resolveToTab(), resolveFromTab() などは未使用・未実装（将来拡張用）
 *
 * 注意: tab指定やUI即時変更対応、tab検索の正規化などは将来的な拡張予定
 */
export declare class ModChord {
    /**
     * コード辞書の自動生成・キャッシュ・エラー処理
     *
     * コード名やタブ譜指定から、最適なフィンガリングや音名配列を自動生成し、キャッシュする。
     * 既にキャッシュ済みの場合はキャッシュを返す。
     * 休符（'r'）の場合は特別なChordPropを返す。
     * フィンガリングが見つからない場合はエラーを返す。
     *
     * @param chordSet コード辞書マップ
     * @param tuning チューニング配列
     * @param line 行番号（エラー用）
     * @param linePos 行内位置（エラー用）
     * @param chordSym コードシンボル（例：C、Am7、|2|3||-1| など）
     * @param options フィンガリング展開オプション
     * @returns IResult<ChordProp, ErrorBase>（成功時はChordProp、失敗時はエラー情報）
     */
    static create(chordSet: ChordDicMap, tuning: IKey[], line: number, linePos: number, chordSym: string, options: ExpandFingeringOptions): IResult<ChordProp, ErrorBase>;
}
