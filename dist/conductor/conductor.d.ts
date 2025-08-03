import { ErrorBase, IResult } from "./interface/utils.response.interface";
import { Conduct } from "./interface/conduct";
import { ChordDicMap } from "./interface/dic-chord";
import { MapSeed } from "./interface/dic-map-seed";
/**
 * 許可されたアノテーション設定
 *
 * 特定のアノテーション（@compose、@clickなど）を有効化する際の設定を定義する
 * dualId制限により、どのdualチャンネルでアノテーションが使用可能かを制御する
 *
 * アノテーション機能：
 * - @compose: 作曲支援機能の有効化
 * - @click: クリック音の生成
 * - その他、将来的に追加予定の機能
 */
export interface AllowAnnotation {
    /** アノテーション名（例: "compose", "click"など） */
    name: string;
    /** このアノテーションが使用可能なdualIdの制限リスト */
    dualIdRestrictions: number[];
}
/**
 * コンパイル結果の統一インターフェース
 *
 * フロントエンド向けの統一されたレスポンス形式を定義する
 * エラー情報、レスポンスデータ、MIDIデータ、パフォーマンス情報などを含む
 *
 * このインターフェースにより、フロントエンド側で一貫した形式で
 * コンパイル結果を処理できるようになる
 */
export interface ConvertToObj {
    /** リクエストID（0: バリデーションのみ, 1: フルコンパイル） */
    id: number;
    /** エラー情報（成功時はnull） */
    error: null | {
        /** エラーメッセージ */
        message: string;
        /** エラー発生行番号 */
        line: number;
        /** エラー発生位置 */
        linePos: number;
        /** エラーの原因となったトークン */
        token: string | null;
    };
    /** コンパイル成功時のレスポンスデータ */
    response: null | Conduct;
    /** MIDI出力データ（MIDIビルド有効時のみ） */
    midi?: ArrayBuffer;
    /** MIDIリクエストフラグ */
    midiRequest?: true;
    /** コンパイル時間（ミリ秒） */
    compileMsec?: number;
}
/**
 * 音楽記譜法のコンパイラークラス
 *
 * このクラスは独自の音楽記譜法をパースし、実行可能な音楽データ（タブ譜、MIDI等）に変換する
 * メインエントリポイントとして convert() と convertToObj() メソッドを提供する
 *
 * 処理の流れ：
 * 1. 記譜法テキストの構文解析
 * 2. ブロック構造への変換
 * 3. スタイル処理（エフェクト、タイミング調整）
 * 4. MIDI生成（オプション）
 *
 * 特徴：
 * - 複数のdualチャンネル対応（メロディー、伴奏、ベースライン等の分離）
 * - リアルタイムコンパイル対応
 * - エラーハンドリングとパフォーマンス計測
 * - メモリ最適化機能
 */
export declare class Conductor {
    /**
     * 音楽記譜法をコンパイルして内部データ構造に変換
     *
     * 記譜法テキストを受け取り、構文解析からスタイル処理まで実行して
     * 実行可能な音楽データ構造（Conduct）を生成する
     *
     * 処理内容：
     * - 記譜法テキストの前処理（コメント除去、設定解析）
     * - 構文解析（文字単位でのパース）
     * - ブロック構造への変換
     * - スタイル処理（エフェクト、タイミング調整）
     * - 3つのdualチャンネル用データ構造の初期化
     *
     * @param syntax 解析対象の記譜法テキスト
     * @param allowAnnotations 許可するアノテーションのリスト（@compose、@clickなど）
     * @param chordDic コード辞書（コード名からタブ譜への変換テーブル）
     * @param mapSeed フィンガリングマッピングシード値（同じコードでも異なる押さえ方を生成）
     * @param isValidOnly true の場合、構文チェックのみでスタイル処理をスキップ
     * @returns コンパイル結果（成功時：Conduct、失敗時：ErrorBase）
     */
    static convert(syntax: string, allowAnnotations: AllowAnnotation[], chordDic: ChordDicMap, mapSeed: MapSeed, isValidOnly: boolean): IResult<Conduct, ErrorBase>;
    /**
     * 音楽記譜法をコンパイルしてオブジェクト形式で結果を返す
     *
     * convert() のラッパーメソッドで、フロントエンド向けの使いやすい形式でレスポンスを提供
     * エラーハンドリング、パフォーマンス計測、メモリ最適化なども含む
     *
     * 処理内容：
     * - コンパイル時間の計測
     * - エラー情報の統一形式への変換
     * - メモリ使用量削減のための不要参照削除
     * - MIDIデータの生成（オプション）
     *
     * @param hasStyleCompile スタイル処理を実行するかどうか
     * @param hasMidiBuild MIDI出力を生成するかどうか
     * @param syntax 解析対象の記譜法テキスト
     * @param allowAnnotation 許可するアノテーションのリスト
     * @param chordDic コード辞書
     * @param mapSeed フィンガリングマッピングシード値
     * @returns 統一されたコンパイル結果オブジェクト
     */
    static convertToObj(hasStyleCompile: boolean, hasMidiBuild: boolean, syntax: string, allowAnnotation: AllowAnnotation[], chordDic: ChordDicMap, mapSeed: MapSeed): ConvertToObj;
}
