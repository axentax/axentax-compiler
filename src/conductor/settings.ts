import { app_version } from "./version";
import { ScaleList, ScaleName } from "./diatonic-and-scale/mod-scale";
import { Settings } from "./interface/settings";
import { IKey, bin12, Scale, shiftMax7, Tonality, key } from "./interface/utils.interface";

/**
 * システム基本設定
 * 
 * 音楽理論に基づく基本的な調性設定を定義する
 * 調号、スケール、調性などの音楽理論的な基本情報を含む
 * 
 * この設定は、コード進行の理論的根拠やスケール判定の基準として使用される
 * 音楽理論に基づいて、どの音が調に含まれるか、どのコードが使用可能かを決定する
 */
export const sysBaseSettings = {
  /** 調性オブジェクト：調号、スケール、調性などの基本情報 */
  tonalObj: {
    tonic: 'C' as IKey, // 主音（調の基準音）
    scale: Scale.normal, // スケールタイプ
    tonal: Tonality.major, // 調性（長調/短調）
    tonalShift: shiftMax7[1], // 調性シフト値
    modalShift: shiftMax7[1], // モードシフト値
    name: 'C major', // 調名
    /** ダイアトニック進化値：コード進行の理論的根拠 */
    diatonicEvolverValue: {
      evolvedCodePrefix: ['', 'm', 'm', '', '', 'm', 'dim'], // 各音度のコードタイプ（C major scale: C, Dm, Em, F, G, Am, Bdim）
      bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1] as bin12 // 12音階の使用可能音（1=使用可能、0=使用不可）
    },
    /** システム設定 */
    sys: {
      shiftedKeyArray: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], // 12音階配列
      note7array: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] // 7音階配列
    }
  },
  /** スタイルスケール設定：演奏スタイルに影響するスケール情報 */
  styleScaleX: {
    key: key.C, // キー
    scale: ScaleName.major, // スケール名
    bin: ScaleList[ScaleName.major].bin // スケールの2進数表現
  }
};

/**
 * デフォルト設定
 * 
 * アプリケーション全体で使用されるデフォルト設定を定義する
 * ユーザーが明示的に設定を変更しない場合に使用される値
 * 
 * この設定は、音楽記譜法のコンパイル時に基準となる値として使用される
 * 各設定項目は、実際の演奏やMIDI生成に直接影響する
 */
export const defaultSettings: Settings = {
  ver: app_version, // アプリケーションバージョン
  strict: false, // 厳密モード（エラー処理の厳しさ）
  /** 楽曲設定 */
  song: {
    key: null // 楽曲の調（nullの場合は自動判定）
  },
  /** スタイル設定：演奏スタイルに影響する設定 */
  style: {
    degree: structuredClone(sysBaseSettings.tonalObj), // 調性設定のコピー
    scale: structuredClone(sysBaseSettings.styleScaleX), // スケール設定のコピー
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'], // ギターのチューニング（6弦から1弦、標準チューニング）
    until: [4, 4], // 拍子記号（分子/分母、4/4拍子）
    bpm: 120, // テンポ（BPM、1分間の拍数）
  },
  /** コンパイル設定 */
  compile: {
    mappingResolved: true, // マッピング解決の有効化（フィンガリングの自動最適化）
  },
  downTuning: 0, // ダウンチューニング（半音単位）
  hash: {
    compose: '0000000000000000000000000000000000000000000000000000000000000000', // 作曲ハッシュ
  },
  /** dual設定：複数チャンネル同時演奏の設定 */
  dual: {
    pan: true, // パンニング有効化
    panning: [0.5, 0, 1], // 各チャンネルのパンニング位置（0=左、0.5=中央、1=右）
    // forceDeleteOverNote: true // 重複ノート強制削除（未実装）
  },
  /** クリック音設定 */
  click: {
    until: [1, 4], // クリック音の拍子（1/4拍子）
    inst: 42, // クリック音の楽器番号（42=クラベス）
    velocity: 60, // クリック音の音量（0-127）
    accent: 0, // アクセント音の音量（0-127）
  },
  /** 演奏設定：実際の演奏に影響する詳細設定 */
  play: {
    /** 各弦のデフォルト音量（6弦から1弦） */
    velocities: [70,70,70,70,75,82,82,75,65], // 弦別音量設定（0-127）
    /** 連続奏可能な1音の秒数設定（未使用） */
    possibleMSEC: {
      fullPicking: 0.020, // 連続フルピッキング（20ミリ秒）
      trill: 0.015, // h/p混入ピッキング/トリル/タッピング左手（弦移動無し、15ミリ秒）
      sweep: 0.012, // スウィープ（弦移動のみ、12ミリ秒）
    },
    /** ストラム（コード奏法）設定 */
    strum: {
      defaultStrumWidthMSec: 30, // デフォルトストラム幅（ミリ秒）
      velocity: 55 // ストラム音量（0-127）
    },
    /** アプローチ（スライドアプローチ）設定 */
    approach: {
      widthOfSlide: {
        baseTick: 100, // スライド範囲を分割する前の基本tick
        maxSplitTick: 24 // スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める
      },
      velocity: {
        max: 65, // スライド開始する最大音量
        decrease: 10, // 1フレット毎の音量減少値（フレットというより時間基準）
        min: 45, // スライド連続で減少する音量の最低音量
        minLanding: 66, // 着地音量
      }
    },
    /** スライド設定 */
    slide: {
      widthOfSlide: {
        maxSplitTick: 48, // スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める
        distributionTick: 25 // 分配値
      },
      velocity: {
        max: 75, // スライド開始する最大音量
        decrease: 10, // 1フレット毎の音量減少値
        min: 35, // スライド連続で減少する音量の最低音量
        landing: 65, // 着地音量
      },
      realization: {
        /** 着地点に解放弦が含まれている、且つ開始フレットに4フレット以下がない場合、スライド終了位置を3フレットに変更 */
        realizationLandingPointOpenBows: true,
        /**
         * スライド中のフレット滞在時間が大きい場合、自然な滞在時間に自動調整を適用可否の閾値
         * 開始タイミングが移行するためリズムがずれる可能性がある
         */
        autoStartPointAdjustmentThresholdSec: 0.02,
      }
    },
    /** リリース（スライドリリース）設定 */
    release: {
      widthOfSlide: {
        maxSplitTick: 48, // スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める
        distributionTick: 25 // 分配値
      },
      velocity: {
        max: 55, // スライド開始する最大音量
        decrease: 8, // 1フレット毎の音量減少値
        min: 0, // スライド連続で減少する音量の最低音量
        landing: 50, // 着地音量
      }
    }
  }
}