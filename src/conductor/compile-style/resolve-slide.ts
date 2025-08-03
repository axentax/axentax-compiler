import { Conduct, Marks, Mixes } from "../interface/conduct";
import { ESInst, StyleSlide } from "../interface/style";
import { TabObj } from "../interface/tab";
import { SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import * as XUtils from "../utils/x-utils";
import * as XTickUtils from "../utils/x-tick-utils";
import * as XUtilsObject from "./utils.object";


/**
 * 各弦のスライド情報
 */
type SlideInfo = {
  /** 開始点の開放弦フラグ */
  isOpenBowByStart: boolean,
  /** 着地点の開放弦フラグ */
  isOpenBowByLanding: boolean,
  /** 対象弦 */
  bowIndex: number,
  /** 開始フレット */
  startFret: number,
  /** 着地フレット */
  landingFret: number,
  /** スライド幅 */
  slideWidth: number,
  /** 移動方向 */
  direction: -1 | 0 | 1,
};

/**
 * スライド可能範囲
 */
type SlideableRange = {
  /** 開始可能ティック */
  startableTick: number,
  /** 停止可能ティック */
  stopableTick: number,
  /** 確定開始点 */
  startTick: number,
  /** 減衰から想定する音量減衰値 */
  attenuationVelocity: number,
}

/**
 * スライド解決処理を行うクラス
 */
export class ResolveSlide {

  /**
   * スライド情報を解決する
   * @param conduct 演奏情報
   * @param mixes ミックス情報
   * @returns 処理結果
   */
  static resolve(conduct: Conduct, mixes: Mixes): SimpleResult {
    const { flatTOList } = mixes;

    for (let ti = 0; ti < flatTOList.length; ti++) { // variable array length
      const to = flatTOList[ti];

      const slide = to.styles.slide;
      if (slide) {
        const res = core(conduct, mixes.flatTOList, mixes.marks, to, ti, slide);
        if (res.fail()) return res;
      }
    }

    return simpleSuccess();
  }
}

/**
 * スライドのビュー用データを生成する
 * @param conduct 演奏情報
 * @param marks マーク情報
 * @param to TabObj
 * @param slide スライドスタイル
 * @returns ビュー用データまたはnull
 */
export function toView(
  conduct: Conduct,
  marks: Marks,
  to: TabObj,
  slide: StyleSlide
) {
  const _to = structuredClone(to)
  _to.refActiveBows = _to.tab.map(_ => _to)
  const flatTOList = [_to]
  core(conduct, flatTOList, marks, _to, 0, structuredClone(slide))
  return flatTOList.length > 1 ? flatTOList : null;
}

/**
 * スライド処理のコア処理
 * @param conduct 演奏情報
 * @param flatTOList フラットTabObjリスト
 * @param marks マーク情報
 * @param to 対象TabObj
 * @param ti TabObjのインデックス
 * @param slide スライドスタイル
 * @returns 処理結果
 */
function core(
  conduct: Conduct,
  flatTOList: TabObj[],
  marks: Marks,
  to: TabObj,
  ti: number,
  slide: StyleSlide
): SimpleResult {

  // start and landing
  const startBows = to.styles.strum?._applied ? to.tab : to.activeBows;
  const landingBows = to.slideLandingTab ? to.slideLandingTab : [];

  // toのuntil未指定の場合で、且つcontinueXの場合、noteの先頭[0, 1]とする対応だが、一旦メモとする
  // if (!slide.startUntil) {
  //   if (to.continueX) {
  //     slide.startUntil = slide.arrow ? [0, 1] : [0, 1];
  //   } else {
  //     slide.startUntil = slide.arrow ? [6, 8] : [1, 2];
  //   }
  //   if (slide.type === 'to') slide.auto = true;
  // }

  // slide info
  const slideInfos = slide.type === 'to'
    ? createSlideInfo(startBows, landingBows, slide)
    : createSlideInfoForRelease(startBows, landingBows, slide);
  if (!slideInfos.length) {
    to.slideTrueType = 1;
    return simpleSuccess(); // 対象弦が無ければ処理無し
  }
  const maxWidth = Math.max(...slideInfos.map(m => m.slideWidth));

  // 中間note
  let slideTabObjList: TabObj[] = [];
  const slideTickInfo: SlideableRange = {} as SlideableRange;
  if (maxWidth > 1) {

    // スライド可能領域と開始位置の決定
    const resRange =  setStartTickWithCalcEditableArea(to, slideTickInfo, slideInfos, slide.startUntil);
    if (resRange.fail()) return resRange;

    // 移動tick幅を分配法則で作成
    const splittedWidth = buildSplitWidth(conduct, to, slide, slideTickInfo, slideInfos);

    // 開始点noteのtick縮尺
    slideInfos.forEach(info => {
      to.refActiveBows![info.bowIndex]!.bar.fretStopTicks[info.bowIndex] = slideTickInfo.startTick;
    });

    // 「次でフレット移動が発生する or 次に音がなく当該noteはcontinueではない」且つスライド対象外の弦で
    // "解放弦"以外の弦は => スライド開始時に音が切れるべきである。
    // 解放弦は( 0|2:to(continue) |7 )、このように切れないことを期待する
    // slideInfos.forEach(f => console.log(f.bowIndex))

    // 中間noteの作成
    slideTabObjList = createSlideNote(
      conduct, to, slideTickInfo, slideInfos, splittedWidth
    );

    // 中間noteの追加
    flatTOList.splice(ti + 1, 0, ...slideTabObjList);
    marks.fullNoteIndexWithTick.splice(ti + 1, 0, ...Array(slideTabObjList.length).fill(-1));
  }
  
  // 着地点の音量(continue対応)
  if (to.nextTabObj && slide.continue && !to.nextTabObj.isRest) {
    // console.log('next>', to.nextTabObj!.velocity)
    slideInfos.forEach(info => {
      to.nextTabObj!.velocity[info.bowIndex] = Math.max(
        conduct.settings.play.slide.velocity.landing,
        to.nextTabObj.velocity[info.bowIndex]! - (maxWidth * conduct.settings.play.slide.velocity.decrease)
      ) - slideTickInfo.attenuationVelocity;
    });
  }
  to.slideTrueType = 1;

  // console.dir(slideTabObjList, { depth: null});
  // flatTOList.forEach(to => console.log(to.velocity))
  return simpleSuccess();
}

/**
 * スライド中note作成
 * @param to 
 * @param tickInfo 
 * @param slideInfos 
 * @param splittedWidth 
 */
function createSlideNote(
  conduct: Conduct, to: TabObj, tickInfo: SlideableRange, slideInfos: SlideInfo[], splittedWidth: number[]
) {

  // 必要な設定のみを保持
  const settings = to.styles?.slide?.type === 'to'
    ? {
      min: conduct.settings.play.slide.velocity.min,
      max: conduct.settings.play.slide.velocity.max,
      decrease : conduct.settings.play.slide.velocity.decrease
    }
    : {
      min: conduct.settings.play.release.velocity.min,
      max: conduct.settings.play.release.velocity.max,
      decrease : conduct.settings.play.release.velocity.decrease
    }

  const resTabObjList: TabObj[] = [];

  // 複製tabObjのIDインクリメント用
  let resTabObjIDTail = 0.001;

  // スライドひとつ目のvelocityを当該noteから複製
  const velocity: (number | undefined)[] = new Array<number>(to.tab.length).fill(undefined as any);
  slideInfos.flat().forEach(info => {
    // 当該noteから複製
    velocity[info.bowIndex] = to.refActiveBows[info.bowIndex]!.velocity[info.bowIndex];
    // 最大音量制限
    if (velocity[info.bowIndex]! > settings.max) {
      velocity[info.bowIndex] = settings.max;
    }
  });

  // slide毎処理
  let currentTick = tickInfo.startTick;

  // スライド音量の減衰係数
  const attenuationVelocity = Math.max(5, 20 * XTickUtils.calculateTimeForTicks(to.bpm, currentTick - to.bar.startTick));
  tickInfo.attenuationVelocity = attenuationVelocity;

  // スライド分のレイヤー作成
  const zeroVelocity = false;
  for (let ti = 0; ti < splittedWidth.length; ti++) {
    const width = splittedWidth[ti];
    
    velocity.forEach((_, i) => {
      if (velocity[i] !== undefined) { 
        velocity[i] = Math.max(
          velocity[i]! - 5,
          settings.min
        ) - attenuationVelocity;
      }
    });

    // note作成
    const slideTabObj = XUtilsObject.emptyTabObj(
      to.regionIndex,
      XUtils.decimalizeAdd(to.tabObjId, resTabObjIDTail),
      XUtils.decimalizeAdd(to.regionNoteIndex, resTabObjIDTail),
      to.tab.length
    );
    slideTabObj.styles.inst = ESInst.normal;
    slideTabObj.noteStr = '#slide';
    slideTabObj.slideTrueType = 3;
    resTabObjIDTail = XUtils.decimalizeAdd(0.001, resTabObjIDTail);

    // 各infoのfretとtick設定
    slideInfos.forEach(info => {
      // 中間noteの必要な弦のみ対象
      if (info.slideWidth > 1) {
        slideTabObj.tab[info.bowIndex] = info.startFret + (1 + ti) * info.direction;
        slideTabObj.bar.fretStartTicks[info.bowIndex] = Math.floor(currentTick);
        slideTabObj.bar.fretStopTicks[info.bowIndex] = Math.floor(currentTick + width);
      }
    });

    slideTabObj.velocity = velocity.map((vs, i) => slideTabObj.tab[i] !== undefined ? vs : undefined);
    currentTick += width;
    resTabObjList.push(slideTabObj);
    
    if (zeroVelocity) break;
  }

  return resTabObjList;
}

/**
 * スライドTick配列作成
 * @param to 
 * @param slideableTicks 
 * @param slideInfos 
 * @param userUntil 
 */
function buildSplitWidth(
  conduct: Conduct, to: TabObj, slide: StyleSlide, tickInfo: SlideableRange, slideInfos: SlideInfo[]
) {
  // 注意: 特異点の判定が必要
  // 1. 開始位置強制変更がされた場合
  //    startUntilの位置が_especiallyTheLaterStartTickより前の場合
  // 2. startUtilの設定が 0/* のように分子にゼロが設定されている場合
  // 3. slow,fast,mid問わず、disArr[0]が、元々noteより大きい場合

  // infoの中で最も移動幅が大きいもの基準
  const maxWidth = Math.max(...slideInfos.map(info => info.slideWidth));

  // 最終返却値
  let disArr: number[] = [];

  // 中間noteの作成が必要な移動幅"2"以上対象にスライド幅配列を作成
  if (maxWidth > 1) {
    disArr = splitSlideWidth(tickInfo.startTick, tickInfo.stopableTick, maxWidth - 1, slide);
  } else {
    return []
  }

  // slide時のみ、開始タイミング自動補正
  if (slide.auto || slide.type === 'release') {
    // 演奏されるタイミングでのBPM
    const hereBPM = to.bpm;
    // 一番長いスライド滞在時間
    const maxMSec = XTickUtils.calculateTimeForTicks(hereBPM, Math.max(...disArr));
    // 閾値値より大きい場合修正
    if (maxMSec > conduct.settings.play.slide.realization.autoStartPointAdjustmentThresholdSec) {
      for (const bo of [2, 4, 6, 8, 12, 16, 23, 32, 64, 128, 256, 568, 1024]) {
        const start = to.bar.startTick! + ((to.bar.tick) / bo * (bo - 1));
        // let start = tickInfo.startableTick + ( (tabObj.bar.tick - tickInfo.startableTick) / bo * (bo - 1));
        const tmpDisArr = splitSlideWidth(start, tickInfo.stopableTick, maxWidth - 1, slide);
        const tmpMaxMSec = XTickUtils.calculateTimeForTicks(hereBPM, Math.max(...tmpDisArr));
        if (tmpMaxMSec < conduct.settings.play.slide.realization.autoStartPointAdjustmentThresholdSec) {
          disArr = tmpDisArr;
          tickInfo.startTick = start;
          break;
        }
      }
    }
  }

  return disArr;
}

/**
 * TabObjの全弦共通のtick変更可能領域の算出
 */
function setStartTickWithCalcEditableArea(
  to: TabObj, slideableTicks: SlideableRange, slideInfos: SlideInfo[], userUntil: number[]
): SimpleResult {
  // memo:
  // - 判定対象はスライド対象のみ
  // - stop位置検出においてrefが必要
  // - strokeで重複理由により鳴弦(フレット)を削除された場合、ここでNanが出るため、Nanチェック必要
  //     注意: 全ての鳴弦が削除された場合のエラー処理が必要

  // 現状の各弦の開始点で最も遅い開始のTickを抽出
  slideableTicks.startableTick = Math.max(
    ...slideInfos.map(info => {
      return to.refActiveBows![info.bowIndex]?.bar.fretStartTicks[info.bowIndex] as number
    }).filter(f => !isNaN(f))
  );
  // 現状の各弦の停止点で最も早い停止のTickを抽出
  // 但し、continueの影響でのnote自体のbar.stopTickを超えてはならない
  slideableTicks.stopableTick = Math.min(
    to.bar.stopTick, // continueの影響でstopTickを超えてしまわないための対応
    ...slideInfos.map(info => {
      return to.refActiveBows![info.bowIndex]?.bar.fretStopTicks[info.bowIndex] as number
    }).filter(f => !isNaN(f))
  );
  // strokeの影響で、最も遅い開始点より、最も早い停止点が存在する場合、不整合
  if (slideableTicks.stopableTick < slideableTicks.startableTick) {
    /* istanbul ignore next: タイミング不整合は stroke の影響で理論的には発生し得るが、実運用では音楽的に問題のない範囲で処理される */
    // %% 発生しない?? => 20241117 以下で発生したが、特に「音的に問題なさそうだった」のでコメントアウトした
    // @@ { C }
    // @@ {} >> { C }
    // @@ { ..2|5|||0:to |12|10|||~~ }
    // return new E400(slide.line, slide.linePos, slide.row || slide.rowString,
    //   `Slide processing is not possible because there is an earlier stop point than a later start point.`
    // );
  }

  // 開始点算出準備
  const originalStart = to.bar.startTick!;
  const userStartTick = originalStart + to.bar.tick / userUntil[1] * userUntil[0];

  // ユーザー設定開始点が、開始可能範囲より後方の場合 => ユーザ開始点を開始可能点に変更
  if (userStartTick < slideableTicks.startableTick) {
    slideableTicks.startTick = slideableTicks.startableTick;
  } else {
    slideableTicks.startTick = userStartTick
  }

  return simpleSuccess();
}

/**
 * スライド幅をinSpeedを考慮してフレット数分に分割
 */
function splitSlideWidth(startTick: number, stopTick: number, _viaWidth: number, slide: StyleSlide) {
  const fill = (stopTick - startTick) / _viaWidth;

  // 注意: 音を聞きながらisSpeedValueの適用を調整する必要あり
  const disTick = slide.inSpeedLevel; //DSettings.play.slide.widthOfSlide.distributionTick;

  const disArr: number[] = new Array<number>(_viaWidth).fill(fill);
  if (slide.inSpeed && slide.inSpeed !== 'mid') {
    for (let di = 0; di < disArr.length - 1; di++) {
      // 分配値を引いてもマイナスになる場合があるため分配値を調整
      let _disTick = disTick;
      if (disArr[di] - disTick < 0) {
        // 値がマイナスになる極端なケースの防御的処理だが、通常の音楽的設定ではこの条件は満たされない
        _disTick = disArr[di] / 2;
      }
      // 分配値を引いて、他のフレットに分配する
      disArr[di] -= _disTick;
      const s = di + 1;
      const w = disArr.length - di - 1;
      for (let dii = s; dii < disArr.length; dii++) {
        disArr[dii] += _disTick / w;
      }
    }
    // スロースタートの場合は配列リバース
    if (slide.inSpeed === 'slow') disArr.reverse();
  }

  return disArr;
}

/**
 * スライド対象弦と移動量の算出
 */
function createSlideInfo(
  start: (number | undefined)[],
  landing: (number | undefined)[],
  slide: StyleSlide
): SlideInfo[] {

  // memo:
  // - 開始点と着地点が双方とも存在する弦が対象
  // - 移動量が合わない弦がある場合 => 移動量が最も多い弦の移動完了まで、landingFret-1で鳴音のまま待機
  // - 移動方向が合わない弦 => 気にしない。+-が変わるだけ
  // - 移動量が無い場合 => 何もしないだけ
  // - 開始点が無い => 呼び元でreturn
  // - 着地点が無い => release扱い 開始点によってhiかlow適当に決める
  // - 解放弦 => 解放弦フラグ

  const slideInfos: SlideInfo[] = [];

  // 開始着地セットが存在しない場合のフラグ
  let existMachBow = 0;

  // 開始点基準で slideInfo 一旦作成
  for (let bi = 0; bi < start.length; bi++) {
    const info: SlideInfo = {} as SlideInfo;
    // 開始点があれば追加
    // console.log("=", start[bi], landing[bi])
    if (start[bi] !== undefined && start[bi] !== landing[bi]) {
      // 開始点
      info.bowIndex = bi;
      info.startFret = start[bi]!;
      info.isOpenBowByStart = !info.startFret;
      // 着地点
      if (landing[bi] !== undefined) {
        info.landingFret = landing[bi]!;
        info.isOpenBowByLanding = !info.landingFret;
        // 移動量
        info.slideWidth = info.landingFret - info.startFret;
        // 移動方向
        info.direction = info.slideWidth === 0 ? 0 : info.slideWidth < 0 ? -1 : 1;
        info.slideWidth = Math.abs(info.slideWidth);
        // 開始着地セットが存在することを記録
        existMachBow++;
      }
      // 追加
      slideInfos.push(info);
    }
  }
  /* istanbul ignore next: 開始点が存在しない場合の防御的処理だが、スライド指定があれば通常は開始点も存在する */
  if (!slideInfos.length) return []; // 開始点無し

  // 開始+着地セットが存在する場合、着地点のあるもののみ返却
  if (existMachBow) {
    // 着地点の無いもの削除
    const res = slideInfos.filter(info => info.landingFret !== undefined);
    const exclusionOneStepCase = slideInfos.filter(info => info.slideWidth > 1);
    // スライド幅の合わないものは、各弦のうち最小のスライド幅に合わせ進行方向に事前に進める
    const minWidth = Math.max(...exclusionOneStepCase.map(info => info.slideWidth));
    res.forEach(info => {
      const diff = info.slideWidth - minWidth;
      if (diff && info.slideWidth > 1) {
        info.slideWidth = minWidth;
        info.startFret += diff * info.direction;
        /* istanbul ignore next: フレット位置の下限制限は極端なスライド幅でのみ発生し、通常の演奏では到達しない */
        if (info.startFret < 1) info.startFret = 1;
        /* istanbul ignore next: フレット位置の上限制限は極端なスライド幅でのみ発生し、通常の演奏では到達しない */
        if (info.startFret > 24) info.startFret = 24;
      }
    });
    return res;
  }

  // 開始+着地セットが存在しない場合、全弦スライド対象とし着地点を推測する
  else {
    // 着地フレットリスト
    const landingFretCollection: number[] = landing.filter(l => l !== undefined) as number[];
    /* istanbul ignore next: 着地フレットが存在しない場合の防御的処理だが、スライド指定時は通常着地点も指定される */
    if (!landingFretCollection.length) return [];
    // 開始点が存在する弦において着地フレットからup/downどちらのケースが多いか確認
    const upCase: number[] = [];
    const downCase: number[] = [];
    slideInfos.forEach(info => landingFretCollection.forEach(lf => {
      const directionWidth = lf - info.startFret;
      if (directionWidth > 0) {
        upCase.push(directionWidth);
      } else if (directionWidth < 0) {
        downCase.push(directionWidth);
      }
    }));
    // 移動量検出不可の場合
    /* istanbul ignore next: スライド方向が検出できない場合の防御的処理だが、適切なスライド指定があれば通常は方向も決定される */
    if (!upCase.length && !downCase.length) return [];
    // 移動量と方向確定
    // ケースの多い側優先。同じ場合downCase優先(up側はタッピングの可能性が現実奏法的に高い)
    const direction = upCase.length > downCase.length ? 1 : -1;
    // 移動量の最大のもの選択
    const width = Math.abs(direction > 0 ? Math.max(...upCase) : Math.min(...downCase));
    // continue無効
    slide.continue = undefined;
    // slideInfoに移動情報追加し、着地点が正常なもののみ添削し返却
    return slideInfos.map(info => {
      info.landingFret = info.startFret + (width * direction);
      info.direction = direction;
      info.slideWidth = width;
      return info;
    }).filter(info => {
      return info.landingFret >= 0 && info.landingFret < 24;
    });
  }
}

/**
 * release用のスライド対象弦と移動量の算出
 */
function createSlideInfoForRelease(
  start: (number | undefined)[],
  landing: (number | undefined)[],
  slide: StyleSlide
): SlideInfo[] {

  // memo:
  // - 開始点が解放弦の場合対象外
  // - 着地点は0以下にしない
  const slideInfos: SlideInfo[] = [];

  // 着地点推測1: 未来弦一致（!slide.arrowを確認することで、hi/low指定がある場合に対応）
  if (slide.releaseWidth === undefined && !slide.arrow) {
    // 弦一致があれば、最初に見つかった弦基準(但し移動幅3以上のもの)
    for (let bi = 0; bi < start.length; bi++) {
      if (landing[bi] !== undefined && start[bi] !== undefined && Math.abs(start[bi]! - landing[bi]!) > 3) {
        slide.releaseWidth = start[bi]! - landing[bi]!;
        slide.arrow = slide.releaseWidth > 0 ? 1 : -1;
        slide.releaseWidth = Math.abs(slide.releaseWidth);
        break;
      }
    }
  }

  // 着地点推測2: 弦不一致
  if (slide.releaseWidth === undefined && !slide.arrow) {
    // search max pattern
    const hiStart = Math.max(...start.filter(f => !!f) as any);
    const lowLanding = Math.min(...landing.filter(f => !!f) as any);
    const lowStart = Math.min(...start.filter(f => !!f) as any);
    const hiLanding = Math.max(...landing.filter(f => !!f) as any);
    if (Math.abs(hiStart - lowLanding) > Math.abs(lowStart - hiLanding)) {
      slide.releaseWidth = hiStart - lowLanding;
      slide.arrow = slide.releaseWidth > 0 ? 1 : -1;
      slide.releaseWidth = Math.abs(slide.releaseWidth);
    } else {
      slide.releaseWidth = hiLanding - lowStart;
      slide.arrow = slide.releaseWidth > 0 ? 1 : -1;
      slide.releaseWidth = Math.abs(slide.releaseWidth);      
    }
  }

  // 着地点推測3: 全不一致
  if (slide.releaseWidth === undefined && !slide.arrow) {
    slide.releaseWidth = 5;
    slide.arrow = -1;
  }

  for (let bi = 0; bi < start.length; bi++) {
    const info: SlideInfo = {} as SlideInfo;
    // 開始点があれば追加
    if (start[bi] !== undefined) {
      // 開始点が解放弦の場合対象外
      /* istanbul ignore next: 解放弦からのリリーススライドは音楽的に不自然なため、通常は指定されない */
      if (info.startFret === 0) continue;
      // 開始点
      info.bowIndex = bi;
      info.startFret = start[bi]!;
      // 着地点
      info.landingFret = info.startFret + ((slide.releaseWidth || 9) * slide.arrow!);
      // 着地点は0以下にしない。
      /* istanbul ignore next: 着地フレットが負になる極端なリリース幅の場合の防御的処理だが、通常の音楽的設定では発生しない */
      if (info.landingFret < 0) info.landingFret = 0;
      // 移動量
      info.slideWidth = info.landingFret - info.startFret;
      // 移動方向
      info.direction = slide.arrow! as any;
      info.slideWidth = Math.abs(info.slideWidth);
      // 移動幅があるもののみ
      if (info.startFret !== info.landingFret) {
        slideInfos.push(info);
      }
    }
  }
  return slideInfos;
}
