import { ResolveClicks } from "./resolve-clicks";
import { ResolveStroke } from "./resolve-stroke";
import { Conduct } from "../interface/conduct";
import { ResolveBPM } from "./resolve-bpm";
import { SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import { ResolveDelay } from "./resolve-delay";
import { ResolveStrum } from "./resolve-strum";
import { ResolveSlide } from "./resolve-slide";
import { ResolveApproach } from "./resolve-approach";
import { ResolveMuteNoise } from "./resolve-mute-noise";
import { ResolveStaccato } from "./resolve-staccato";
import { ResolveBendX } from "./resolve-bendX";
import { ResolveLegato } from "./resolve-legato";

/**
 * スタイルコンパイラークラス
 * 
 * 音楽的表現（エフェクト、アーティキュレーション等）を処理し、
 * 実際の演奏データに変換する。各種スタイル処理を順序立てて実行する。
 * 
 * 処理されるスタイル：
 * - レガート（音の連結）：音と音の間を滑らかに繋ぐ演奏技法
 * - スタッカート（音の分離）：音を短く切って演奏する技法
 * - スライド（音程の滑らかな変化）：フレット間を滑らかに移動する技法
 * - アプローチ（音程への接近）：目標音程に向かって滑らかに接近する技法
 * - ベンド（音程の変化）：弦を曲げて音程を変化させる技法
 * - ストラム（コード奏法）：複数の弦を同時に弾く技法
 * - ストローク（ピッキングパターン）：上下のピッキングパターン
 * - ディレイ（音の遅延）：音の遅延効果を実現
 * - ミュートノイズ（ミュート音）：弦をミュートした音を実現
 * 
 * このクラスは、記譜法で指定された音楽的表現を
 * 実際の演奏データ（MIDI、タブ譜）に変換する中心的な役割を担う
 */
export class CompileStyle {

  /**
   * スタイル処理のメインコンパイル処理
   * 
   * 記譜法で指定された音楽的表現を実際の演奏データに変換する
   * 各段階でエラーが発生した場合は即座に処理を中断してエラーを返す
   * 
   * 処理順序：
   * 1. BPM解析・時間計算：テンポ情報の解析と時間計算
   * 2. クリック音処理：メトロノーム音の生成
   * 3. 各dual毎のスタイル処理（レガート、スタッカート、スライド等）
   * 
   * スタイル処理の順序は、音楽理論と演奏技法に基づいて
   * 最適な演奏表現を実現するように設計されている
   * 
   * @param conduct 演奏情報オブジェクト
   * @returns コンパイル結果
   */
  static compile(conduct: Conduct): SimpleResult {

    // 1. BPM情報の作成・解析
    const resBPMcreate = ResolveBPM.resolve(conduct);
    if (resBPMcreate.fail()) return resBPMcreate;

    // バリデーションのみの場合はここで終了
    if (conduct.notStyleCompile) {
      return simpleSuccess();
    }

    // 2. BPM基準の時間計算
    const resBPMMathTime = ResolveBPM.mathBPMTime(conduct);
    if (resBPMMathTime.fail()) return resBPMMathTime;

    // 3. クリック音の処理
    ResolveClicks.resolve(conduct);

    // 4. 各dual毎のスタイル処理を実行
    for (let dualId = 0; dualId < conduct.mixesList.length; dualId++) {
      const mixes = conduct.mixesList[dualId];

      // レガート処理：音の連結を実現
      const resLegato = ResolveLegato.resolve(mixes);
      if (resLegato.fail()) return resLegato;

      // スタッカート処理：音の分離を実現
      const resStaccato = ResolveStaccato.resolve(mixes);
      if (resStaccato.fail()) return resStaccato;

      // ディレイ処理：音の遅延効果を実現
      const resDelay = ResolveDelay.resolve(mixes);
      if (resDelay.fail()) return resDelay;

      // ストラム処理：コード奏法を実現（IDに小数点以下0.1を追加）
      const resStrum = ResolveStrum.resolve(conduct, mixes);
      if (resStrum.fail()) return resStrum;

      // ストローク処理：ピッキングパターンを実現
      const resStroke = ResolveStroke.resolve(mixes);
      if (resStroke.fail()) return resStroke;

      // スライド処理：音程の滑らかな変化を実現（IDに小数点以下0.001を追加）
      const resSlide = ResolveSlide.resolve(conduct, mixes);
      if (resSlide.fail()) return resSlide;

      // アプローチ処理：音程への接近を実現（IDに小数点以下-0.001を追加）
      const resApproach = ResolveApproach.resolve(conduct, mixes);
      if (resApproach.fail()) return resApproach;

      // ミュートノイズ処理：ミュート音を実現
      const resMuteNoise = ResolveMuteNoise.resolve(mixes);
      if (resMuteNoise.fail()) return resMuteNoise;

      // ベンド処理：音程の変化を実現
      const resBend = ResolveBendX.resolve(mixes);
      if (resBend.fail()) return resBend;

    }

    return simpleSuccess();
  }

}
