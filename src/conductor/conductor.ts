import { ErrorBase, IResult, Success } from "./interface/utils.response.interface";
import { Conduct } from "./interface/conduct";
import { Settings } from "./interface/settings";
import { BlockCompiler } from "./compile-block/compile-block";
import { SettingResolver } from "./setting-resolve/setting-resolver";
import { ChordDicMap } from "./interface/dic-chord";
import { ModSyntax } from "./compile-block/mod-0-syntax";
import { CompileStyle } from "./compile-style/compile-style";
import { MapSeed } from "./interface/dic-map-seed";
import { Midi } from "@tonejs/midi";
import { MidiBuilder } from "./compile-midi/midi-builder";

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
  name: string,
  /** このアノテーションが使用可能なdualIdの制限リスト */
  dualIdRestrictions: number[],
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
  id: number,
  /** エラー情報（成功時はnull） */
  error: null | {
    /** エラーメッセージ */
    message: string,
    /** エラー発生行番号 */
    line: number,
    /** エラー発生位置 */
    linePos: number,
    /** エラーの原因となったトークン */
    token: string | null
  },
  /** コンパイル成功時のレスポンスデータ */
  response: null | Conduct,
  /** MIDI出力データ（MIDIビルド有効時のみ） */
  midi?: ArrayBuffer,
  /** MIDIリクエストフラグ */
  midiRequest?: true,
  /** コンパイル時間（ミリ秒） */
  compileMsec?: number,
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
export class Conductor {

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
  static convert(
    syntax: string,
    allowAnnotations: AllowAnnotation[],
    chordDic: ChordDicMap,
    mapSeed: MapSeed,
    isValidOnly: boolean
  ) {

    // 最終的な戻り値となるConductオブジェクトを初期化
    const conduct: Conduct = {
      syntax: syntax + '\n',
      settings: {} as Settings,
      regionLength: 0,
      bpmPosList: [],
      clickPointList: [],
      flash: {
        click: [],
        offset: {},
        other: []
      },
      dic: {
        chord: chordDic,
        mapSeed: mapSeed
      },
      // 3つのdualId（0, 1, 2）に対応するmixesListを初期化
      // dual機能：同一楽曲を異なる設定で同時演奏する機能
      // 例：メロディー、伴奏、ベースラインを別々のチャンネルで演奏
      mixesList: [0, 1, 2].map(dualId => {
        return {
          dualId,
          regionList: [], // 楽曲の区間リスト（小節単位の分割情報）
          flatTOList: [], // フラット化されたタブオブジェクトリスト（演奏順序）
          bendBank: {
            bendChannelList: [], // チャンネル用ベンド設定
            bendNormalList: [], // 通常ベンド設定
          },
          marks: {
            styleMappedGroupList: [], // スタイルマッピングされたグループ
            fullNoteIndexWithTick: [], // ティック値付きノートインデックス
            bendGroupNumberList: [], // ベンドグループ番号リスト
            usedBendRange: [] // 使用されたベンド範囲
          },
          view: {
            bend: [] // ビュー用ベンド情報
          }
        }
      }),
      warnings: [],
      extensionInfo: {
        stepInfoList: [] // ステップ情報リスト
      },
      locationInfoList: [], // 位置情報リスト
      braceLocationInfoList: [], // 中括弧位置情報リスト
      styleObjectBank: {}, // スタイルオブジェクトバンク
      allowAnnotations
    }

    // バリデーションのみの場合、スタイルコンパイルをスキップ
    if (isValidOnly) {
      conduct.notStyleCompile = true;
    }

    return core(conduct);
  }

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
  public static convertToObj(
    hasStyleCompile: boolean,
    hasMidiBuild: boolean,
    syntax: string,
    allowAnnotation: AllowAnnotation[],
    chordDic: ChordDicMap,
    mapSeed: MapSeed
  ): ConvertToObj {

    const startTime = new Date().getTime();
    const converted = this.convert(syntax, allowAnnotation, chordDic, mapSeed, !hasStyleCompile);

    // NOTE: ここから返しているidはsrc/workers/compile-worker.tsで上書きされるため実際は不要

    if (converted.fail()) {
      const res: ConvertToObj = {
        id: hasStyleCompile ? 1 : 0,
        error: {
          message: converted.message,
          line: converted.line,
          linePos: converted.linePos,
          token: converted.token
        },
        response: null
      };
      if (hasStyleCompile) res.midiRequest = true;

      return res;

    } else {

      // メモリ使用量削減のため、ビューで不要な参照を削除
      converted.res.dic = null as any;
      converted.res.mixesList.forEach(ml => {
        ml.flatTOList.forEach(to => {
          // 循環参照になりうるプロパティを削除
          to.prevTabObj = undefined as any;
          to.nextTabObj = undefined as any;
          to.refActiveBows = undefined as any;
          to.refMovedSlideTarget = undefined as any;
        })
      });

      if (!hasStyleCompile) {
        // バリデーションのみの場合、不要なデータを削除してレスポンスサイズを削減
        converted.res.syntax = '';


        return {
          id: 0,
          error: null,
          response: converted.res,
          compileMsec: (new Date().getTime() - startTime)
        };

      } else {
        // スタイルコンパイル有効時、MIDI生成も実行
        const midi = hasMidiBuild ? toMidi(converted.res) : null as any;

        /* istanbul ignore if: MIDI構築失敗は極端な例外状況で、通常運用では発生しない */
        if (midi && midi.fail()) {
          return {
            id: 1,
            error: midi,
            response: null,
            midiRequest: true
          }
        }

        return {
          id: 1,
          error: null,
          response: converted.res,
          midi: midi ? midi.res.toArray().buffer : null,
          midiRequest: true,
          compileMsec: (new Date().getTime() - startTime)
        };
      }
    }
  }
}

/**
 * コンパイルのコア処理
 * 
 * 記譜法の解析からスタイル処理まで、コンパイルの全工程を順次実行する
 * 各段階でエラーが発生した場合は即座に処理を中断してエラーを返す
 * 
 * 処理の流れ：
 * 1. コメント除去と前処理
 * 2. ユーザー設定の解析・適用
 * 3. 構文解析（文字単位でのパース）
 * 4. ブロック構造への変換
 * 5. スタイル処理（エフェクト、タイミング調整）
 * 
 * 各段階の詳細：
 * - 前処理：コメント除去、__start__マーカー処理
 * - 設定解析：BPM、調性、dual設定などの解析
 * - 構文解析：記譜法の文字列をトークンに分解
 * - ブロック変換：トークンを音楽的ブロック構造に変換
 * - スタイル処理：エフェクト、タイミング、表現の適用
 * 
 * @param conduct 初期化されたConductオブジェクト
 * @returns コンパイル結果（成功時：Conduct、失敗時：ErrorBase）
 */
function core(conduct: Conduct): IResult<Conduct, ErrorBase> {

  // 1. コメント文を構文から除去
  removeUnnecessaryInitials(conduct);

  // 2. ユーザー設定を解析・適用
  const srr = new SettingResolver().resolve(conduct);
  if (srr.fail()) return srr;
  removeBeforeStart(conduct);

  // 3. 構文解析：文字単位で記譜法をパース
  const symbolsDualLists = ModSyntax.as(conduct);
  if (symbolsDualLists.fail()) return symbolsDualLists;

  // 4. 構文をブロック構造に変換
  const bcc = BlockCompiler.compile(conduct, symbolsDualLists.res);
  if (bcc.fail()) return bcc;

  // 5. スタイル処理を実行（エフェクト、タイミング調整など）
  const resStyle = CompileStyle.compile(conduct);
  if (resStyle.fail()) return resStyle;
  return new Success(conduct);
}

/**
 * ConductオブジェクトからMIDIデータを生成
 * 
 * コンパイル済みのConductオブジェクトをMIDI形式に変換する
 * 各dualチャンネルのデータを個別のMIDIトラックとして生成し、
 * BPM変更情報やクリック音情報も含める
 * 
 * 生成されるMIDIの特徴：
 * - 3つのdualチャンネルを個別トラックとして分離
 * - 各チャンネルのパンニング設定を適用
 * - 音色設定：ナイロンギター（24）、ミュートギター（28）
 * - BPM変更情報の埋め込み
 * - クリック音トラックの生成
 * 
 * @param conduct コンパイル済みのConductオブジェクト
 * @returns MIDI生成結果（成功時：Midi、失敗時：ErrorBase）
 */
function toMidi(conduct: Conduct): IResult<Midi, ErrorBase> {
  const midi = MidiBuilder.build(
    // 各dualId（0, 1, 2）のデータをMIDI用に変換
    [0, 1, 2].map(dualId => {
      return {
        regionList: conduct.mixesList[dualId].regionList,
        flatTOList: conduct.mixesList[dualId].flatTOList,
        // パンニング設定：dual.panが有効かつ有効な値の場合のみ適用
        /* istanbul ignore next */
        pan: conduct.settings.dual.panning[dualId] >= 0 && conduct.settings.dual.pan
          ? conduct.settings.dual.panning[dualId]
          : 0.5, // デフォルトはセンター
        soundfontProp: { normal: 24, mute: 28 }, // 音色設定：24=ナイロンギター、28=ミュートギター
        bend: conduct.mixesList[dualId].bendBank
      }
    }),
    conduct.bpmPosList, // BPM変更情報
    conduct.clickPointList // クリック音情報
  );
  return midi;
}

/**
 * 記譜法からコメントと不要な初期部分を除去
 * 
 * 以下の処理を行う：
 * - 行コメント（//）の除去
 * - ブロックコメントの除去（改行は保持）
 * - __end__マーカー以降の除去
 * 
 * この処理により、構文解析時にコメントが干渉することを防ぐ
 * 改行を保持することで、エラー時の行番号表示を正確に保つ
 * 
 * @param conduct Conductオブジェクト（syntaxプロパティが変更される）
 */
function removeUnnecessaryInitials(conduct: Conduct) {
  conduct.syntax = conduct.syntax
    .replace(/\/\/.*$/gm, '') // 行コメント除去
    .replace(/\/\*([\s\S]*?)\*\//gm, (match) => match.replace(/[^\n]/g, ' ')) // ブロックコメント除去（改行保持）
    .replace(/__end__.*$/sg, ''); // __end__以降除去
}

/**
 * __start__より前の部分を除去
 * 
 * __start__マーカーより前の記述を空白に置換する（改行は保持）
 * これにより行番号を維持しながら不要な部分を無効化する
 * 
 * 用途：
 * - テスト用の記述を本番コンパイル時に無効化
 * - デバッグ用コードの分離
 * - 複数の記譜法を1つのファイルに含める場合の制御
 * 
 * @param conduct Conductオブジェクト（syntaxプロパティが変更される）
 */
function removeBeforeStart(conduct: Conduct) {
  conduct.syntax = conduct.syntax
    .replace(/^([\s\S]*?)__start__/sg, (match) => match.replace(/[^\n]/g, ' '));
}