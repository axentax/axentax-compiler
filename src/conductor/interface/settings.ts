import { StyleScaleX, DegreeObj } from "./style";
import { IKey, UntilNext, UserIKey } from "./utils.interface";

/**
 * 設定インターフェース
 * 
 * 音楽記譜法のコンパイル処理で使用される設定情報を定義する
 * 楽曲設定、スタイル設定、コンパイル設定、演奏設定などを含む
 * 
 * このインターフェースは、音楽記譜法のコンパイル処理において、
 * ユーザーの設定やシステムの動作を制御するための包括的な設定を提供する
 */
export interface Settings {
  /** アプリケーションバージョン */
  ver: string,
  /** 厳密モードフラグ：エラー処理の厳しさを制御 */
  strict: boolean,
  /** 楽曲設定 */
  song: {
    /** 楽曲の調（nullの場合は自動判定） */
    key: UserIKey
  }
  /** スタイル設定：演奏スタイルに影響する設定 */
  style: {
    /** 調性設定：長調・短調などの調性情報 */
    degree: DegreeObj,
    /** スケール設定：使用する音階の情報 */
    scale: StyleScaleX,
    /** チューニング設定：各弦の音程（6弦から1弦の順序） */
    tuning: IKey[],
    /** 拍子記号：[分子, 分母]の形式 */
    until: UntilNext,
    /** テンポ：BPM（1分間の拍数） */
    bpm: number,
  }
  /** コンパイル設定 */
  compile: {
    /** マッピング解決フラグ：フィンガリングの自動最適化を有効にするかどうか */
    mappingResolved: boolean
  },
  /** ダウンチューニング：半音単位でのチューニング下げ（未実装） */
  downTuning: number,
  /** ハッシュ情報 */
  hash: {
    /** 作曲ハッシュ：作曲データの識別用 */
    compose: string
  },
  /** dual設定：複数チャンネル同時演奏の設定 */
  dual: {
    /** パンニング有効化フラグ */
    pan: boolean,
    /** 各チャンネルのパンニング位置（0=左、0.5=中央、1=右） */
    panning: number[],
    /** dualの場合で、block演奏長をはみ出したnoteを強制的に削除するフラグ（未実装） */
    // forceDeleteOverNote: boolean
  },
  /** クリック音設定：メトロノーム音の設定 */
  click: {
    /** クリック音の拍子：[分子, 分母]の形式 */
    until: UntilNext,
    /** クリック音の楽器番号（MIDI楽器番号） */
    inst: number,
    /** クリック音の音量（0-127） */
    velocity: number,
    /** アクセント音の音量（0-127） */
    accent: number
  },
  /** 演奏設定：実際の演奏に影響する詳細設定 */
  play: {
    /** 各弦のデフォルト音量（6弦から1弦、0-127） */
    velocities: number[],
    // {
    //   /** デフォルトのベロシティ */
    //   defaultBowsVelocity: number[];
    // };
    /** 連続奏可能な1音の秒数設定 */
    possibleMSEC: {
      /** 連続フルピッキングが可能な1音の秒数 */
      fullPicking: number;
      /** h/p混入ピッキング/トリル/タッピング左手が可能な1音の秒数、※弦移動無し */
      trill: number;
      /** スウィープが可能な1音の秒数、※弦移動のみ */
      sweep: number;
    };
    /** ストラム（コード奏法）設定 */
    strum: {
      /** デフォルトのストラム幅（ミリ秒） */
      defaultStrumWidthMSec: number;
      /** ストラム音量（0-127） */
      velocity: number;
    };
    /** アプローチ（スライドアプローチ）設定 */
    approach: {
      /** スライド幅設定 */
      widthOfSlide: {
        /** スライド範囲を分割する前の基本tick */
        baseTick: number;
        /** スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める */
        maxSplitTick: number;
      };
      /** 音量設定 */
      velocity: {
        /** スライド開始する最大音量 */
        max: number;
        /** 1フレット毎の音量減少値（フレットというより時間基準） */
        decrease: number;
        /** スライド連続で減少する音量の最低音量 */
        min: number;
        /** 着地音量 */
        minLanding: number;
      };
    };
    /** スライド設定 */
    slide: {
      /** スライド幅設定 */
      widthOfSlide: {
        /** スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める */
        maxSplitTick: number;
        /** 分配値 */
        distributionTick: number;
        /** until未指定の場合のデフォルト値（未使用） */
        // defaultStartUntil: number[];
      };
      /** 音量設定 */
      velocity: {
        /** スライド開始する最大音量 */
        max: number;
        /** 1フレット毎の音量減少値 */
        decrease: number;
        /** スライド連続で減少する音量の最低音量 */
        min: number;
        /** 着地音量 */
        landing: number;
      };
      /** 実現設定 */
      realization: {
        /** 着地点に解放弦が含まれている、且つ開始フレットに4フレット以下がない場合、スライド終了位置を3フレットに変更 */
        realizationLandingPointOpenBows: boolean;
        /** スライド中のフレット滞在時間が大きい場合、自然な滞在時間に自動で調整する（開始タイミングが移行するためリズムがずれる可能性がある） */
        autoStartPointAdjustmentThresholdSec: number;
      };
    };
    /** リリース（スライドリリース）設定 */
    release: {
      /** スライド幅設定 */
      widthOfSlide: {
        /** スライド範囲の分割結果で一つのフレットのtickがこれを上回る場合、この値に留める */
        maxSplitTick: number;
        /** 分配値 */
        distributionTick: number;
      };
      /** 音量設定 */
      velocity: {
        /** スライド開始する最大音量 */
        max: number;
        /** 1フレット毎の音量減少値 */
        decrease: number;
        /** スライド連続で減少する音量の最低音量 */
        min: number;
        // Optional, since 'landing' is commented out in the JSON
        /** 着地音量 */
        landing: number;
      };
    };
  };

}
