import { IKey, NumberOrUfd } from "../interface/utils.interface";
/**
 * フィンガリング展開オプションインターフェース
 *
 * コードからフィンガリングを生成する際の設定オプションを定義する
 * 難易度、検索範囲、並び順などの制御パラメータを含む
 */
export interface ExpandFingeringOptions {
    /** 難易度閾値（デフォルト: 3） */
    difficulty?: number;
    /** コードルート音の最大フレット */
    maxSearchRootFret?: number;
    /** ルートの次の完全5度不要フラグ */
    notRequiredPerfectFifth?: boolean | null;
    /** 解放弦を広い範囲で使用するフラグ */
    wideUseOpenString?: boolean | null;
    /** 結果並べ替え（high: 高音域優先、low: 低音域優先） */
    sortByPosition?: 'high' | 'low' | null;
    /** フォームとして成り立つフレット幅 */
    searchFretWidth?: number;
    /** テンションは可能な限り高音源を使用するフラグ */
    useHighestTensionPossible?: boolean | null;
    /** 必須弦（弦番号配列） */
    requiredStrings?: number[] | null;
}
/**
 * フィンガリングコレクションインターフェース
 *
 * 個別のフィンガリング情報を表現する
 * スコア、タブ譜、音名、メモなどを含む
 */
export interface FingeringCollection {
    /** ポジションスコア（位置による評価点） */
    positionScore: number;
    /** 総合スコア（難易度・実用性の評価点） */
    score: number;
    /** タブ譜（フレット配列） */
    tab: NumberOrUfd[];
    /** 音名配列 */
    notes: (IKey | undefined)[];
    /** コードシンボル */
    sym: string;
}
/**
 * フィンガリングコレクションオブジェクトインターフェース
 *
 * コードに対する全フィンガリング情報を表現する
 * フィンガリング配列、音名、ルート音、インターバルなどを含む
 */
export interface FingeringCollectionObj {
    /** フィンガリング配列 */
    fingerings: FingeringCollection[];
    /** 音名配列 */
    notes: IKey[];
    /** ルート音 */
    tonic: IKey;
    /** インターバル配列 */
    intervals: string[];
    /** テンションノート配列 */
    tensionNotes: string[];
}
/**
 * ChordToFingeringクラス
 *
 * コード名からギターのフィンガリングを自動生成するユーティリティクラス
 * tonal.jsライブラリを使用してコード解析を行い、最適なフィンガリングを探索する
 */
export declare class ChordToFingering {
    /**
     * コア検索メソッド
     *
     * コード名から最適なフィンガリングを探索・生成する
     * 分数コード、テンションノート、完全5度の処理も含む
     *
     * @param chordSym コードシンボル（例：C、Am7、D/F#など）
     * @param tuning チューニング配列
     * @param options フィンガリング展開オプション
     * @returns FingeringCollectionObj | null（成功時はフィンガリング情報、失敗時はnull）
     */
    static search(chordSym: string, tuning: IKey[], options?: ExpandFingeringOptions): FingeringCollectionObj | null;
}
