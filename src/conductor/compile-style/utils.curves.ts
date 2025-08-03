import { Bend } from "../interface/bend";
import { SysSettings } from "../x-var";


/** MIDIのPitchBend範囲 -8191~8191 を20分割した数値 */
const DivisionsMIDIRange = 409.55;

/**
 * ベンド値をMIDI範囲に正規化する
 * @param bendValue - ベンド値
 * @returns 正規化された値
 */
export function normalizeBandVal(bendValue: number) {
  return DivisionsMIDIRange * (bendValue * 10);
}

/**
 * 数値を -8191 ~ 8191 の範囲に制限する
 * @param val - 入力値
 * @returns 制限された整数値
 */
function limiter(val: number) {
  if (val > 8191) return 8191;
  if (val < -8191) return -8191;
  return Math.floor(val);
}


/**
 * 正弦波ベンドカーブを生成する
 * @param resultArrayContainer - 結果を格納する配列
 * @param startTick - 開始ティック
 * @param endTick - 終了ティック
 * @param startBend - 開始ベンド値
 * @param landingBend - 終了ベンド値
 * @param arc - false: 片面, true: 両面
 * @returns ベンドデータ配列
 */
export function makeHrefBend(
  resultArrayContainer: Bend[],
  startTick: number,
  endTick: number,
  startBend: number,
  landingBend: number,
  arc = false
): Bend[] {

  // Tickは範囲差分を使用して、0からでの計算実施
  const TickBetweenVal = endTick - startTick;

  // ループ末値
  const loopEndValue = arc ? TickBetweenVal : TickBetweenVal / 2;

  // ループ末値が0の場合
  if (loopEndValue === 0) return [];

  // 開始点、着地点を MIDIのPitchBend範囲 -8191~8191 に変換
  const trueStartBend = normalizeBandVal(startBend);
  const trueLandingBend = normalizeBandVal(landingBend);

  // Bend値においても、範囲差分を使用して、0からでの計算実施
  const bendWidth = trueLandingBend - trueStartBend;

  for (let x = 0; x <= loopEndValue; x = x + SysSettings.bendSeparateTick) {

    // sin関数にπ/2の位相シフト加算
    const sinValue = Math.sin((x / TickBetweenVal) * 2 * Math.PI - Math.PI / 2);

    // sinValueを0からbendWidthの範囲にスケーリング
    const y = (sinValue + 1) / 2 * bendWidth;

    // bend
    const bend = trueStartBend + Math.ceil(y);

    // push
    resultArrayContainer.push({ pitch: limiter(bend), tick: startTick + (arc ? x : x * 2) })

  }
  return resultArrayContainer;
}

/**
 * アステロイド曲線ベンドを生成する
 * @param resultArrayContainer - 結果を格納する配列
 * @param startTick - 開始ティック
 * @param endTick - 終了ティック
 * @param startBend - 開始ベンド値
 * @param landingBend - 終了ベンド値
 * @param arc - false: 片面, true: 両面
 * @returns ベンドデータ配列
 */
export function makeHrefBendAst(
  resultArrayContainer: Bend[],
  startTick: number,
  endTick: number,
  startBend: number,
  landingBend: number,
  arc = false
) {

  if (arc) {
    const tickWidth = endTick - startTick;
    makeHrefBendAst(resultArrayContainer, startTick, startTick + tickWidth / 2 - 1, startBend, landingBend);
    makeHrefBendAst(resultArrayContainer, startTick + tickWidth / 2, endTick, landingBend, startBend);
    return
  }
  if (startBend < landingBend) {
    createBendByChokeUp(resultArrayContainer, startTick, endTick, startBend, landingBend);
  } else {
    createBendByChokeDown(resultArrayContainer, startTick, endTick, startBend, landingBend);
  }
}

/**
 * 下降アステロイド曲線を生成する
 * @param resultArrayContainer - 結果を格納する配列
 * @param startTick - 開始ティック
 * @param endTick - 終了ティック
 * @param startBend - 開始ベンド値 (-2 ~ +2)
 * @param landingBend - 終了ベンド値 (-2 ~ +2)
 * @returns ベンドデータ配列
 */
function createBendByChokeDown(
  resultArrayContainer: Bend[],
  startTick: number,
  endTick: number,
  startBend: number,
  landingBend: number
): Bend[] {

  const _startBend = landingBend;
  const _landingBend = startBend;

  // Tickは範囲差分を使用して、0からでの計算実施
  const TickBetweenVal = endTick - startTick;

  // 開始点、着地点を MIDIのPitchBend範囲 -8191~8191 に変換
  const trueStartBend = normalizeBandVal(_startBend);
  const trueLandingBend = Math.floor(normalizeBandVal(_landingBend));

  // Bend値においても、範囲差分を使用して、0からでの計算実施
  const bendBetweenVal = trueLandingBend - trueStartBend;

  // ループが0の場合
  if (bendBetweenVal === 0) return [];

  for (let tick = 0; tick <= TickBetweenVal; tick = tick + SysSettings.bendSeparateTick) {
    const revTick = TickBetweenVal - tick;
    const a = bendBetweenVal / (TickBetweenVal * TickBetweenVal);
    const bend = a * revTick * revTick;
    resultArrayContainer.push({ tick: tick + startTick, pitch: limiter(trueStartBend + bend) });
  }

  return resultArrayContainer;
}

/**
 * 上昇アステロイド曲線を生成する
 * @param resultArrayContainer - 結果を格納する配列
 * @param startTick - 開始ティック
 * @param endTick - 終了ティック
 * @param startBend - 開始ベンド値 (-2 ~ +2)
 * @param landingBend - 終了ベンド値 (-2 ~ +2)
 * @returns ベンドデータ配列
 */
function createBendByChokeUp(
  resultArrayContainer: Bend[],
  startTick: number,
  endTick: number,
  startBend: number,
  landingBend: number
): Bend[] {

  // Tickは範囲差分を使用して、0からでの計算実施
  const TickBetweenVal = endTick - startTick;

  // ループ末値が0の場合
  if (!TickBetweenVal) return [];

  // 開始点、着地点を MIDIのPitchBend範囲 -8191~8191 に変換
  const trueStartBend = normalizeBandVal(startBend);
  const trueLandingBend = normalizeBandVal(landingBend);

  // Bend値においても、範囲差分を使用して、0からでの計算実施
  const bendWidth = trueLandingBend - trueStartBend;

  for (let tick = 0; tick <= TickBetweenVal; tick = tick + SysSettings.bendSeparateTick) {
    const a = bendWidth / (TickBetweenVal * TickBetweenVal);
    const bend = a * tick * tick;
    resultArrayContainer.push({ tick: tick + startTick, pitch: limiter(trueStartBend + bend) });
  }
  return resultArrayContainer;
}
