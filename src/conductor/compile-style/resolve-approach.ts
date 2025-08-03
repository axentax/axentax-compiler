import { Conduct, Marks, Mixes } from "../interface/conduct";
import { ESInst, StyleApproach } from "../interface/style";
import { TabObj } from "../interface/tab";
import { SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import * as XUtils from "../utils/x-utils";
import * as XUtilsObject from "./utils.object";


/** 弦毎のスライド情報 */
type SlideInfo = {
  /** 開始点解放弦フラグ */
  isOpenBowByStart: boolean,
  /** 着地点解放弦フラグ */
  isOpenBowByLanding: boolean,
  /** 対象弦 */
  bowIndex: number,
  /** 開始フレット */
  startFret: number,
  /** スライド終了フレット(着地点含む) */
  landingFret: number,
  /** 移動幅 */
  slideWidth: number,
  /** 移動方向 */
  direction: -1 | 0 | 1,
};

/** スライド可能領域 */
type SlideableRange = {
  startableTick: number,
  stopableTick: number,
  /** 確定した開始点 */
  startTick: number,
}

export class ResolveApproach {

  static resolve(conduct: Conduct, mixes: Mixes): SimpleResult {
    const { flatTOList } = mixes;

    for (let ti = 0; ti < flatTOList.length; ti++) { // variable array length
      const to = flatTOList[ti];

      const slide = to.styles.approach;
      if (slide && to.slideTrueType !== 2) {
        const res = core(conduct, mixes.flatTOList, mixes.marks, to, ti, slide);
        if (res.fail()) return res;
      }
    }

    return simpleSuccess();
  }
}

export function inView(
  conduct: Conduct,
  marks: Marks,
  to: TabObj,
  slide: StyleApproach,
  toList?: TabObj[]
) {
  const _to = structuredClone(to)
  _to.refActiveBows = _to.tab.map(_ => _to)

  const flatTOList = toList || [_to];

  core(conduct, flatTOList, marks, _to, 0, structuredClone(slide))
  return flatTOList.length > 1 ? flatTOList : null;
}

/**
 * core
 */
function core(conduct: Conduct, flatTOList: TabObj[], marks: Marks, to: TabObj, ti: number, cSlide: StyleApproach): SimpleResult {
  const startBows = cSlide.bowWithFret;
  const landingBows = to.tab;

  // slideInfo生成(対象弦と移動量等々)
  const slideInfos = createSlideInfo(startBows, landingBows);
  if (!slideInfos.length) {
    to.slideTrueType = 2;
    return simpleSuccess(); // 対象弦が無ければ処理無し
  }
  const maxWidth = Math.max(...slideInfos.map(m => m.slideWidth));

  // スライド可能領域と開始位置の決定
  const slideTickInfo: SlideableRange = {} as SlideableRange;

  const resRange = setStartTickWithCalcEditableArea(to, slideTickInfo, slideInfos, [0, 1]);

  if (resRange.fail()) {
    return resRange;
  }

  // スライド幅
  const { baseTick, maxSplitTick } = getBaseTick(conduct, slideTickInfo, cSlide.percentOfSpeed || 0)

  // 各種パラメータ
  let splitTick = baseTick / maxWidth;
  if (splitTick > maxSplitTick) splitTick = maxSplitTick;

  // スライドnote作成
  const { slideTabObjList, landingVelocity } = createSlideNote(
    conduct, to, slideTickInfo, slideInfos, splitTick, maxWidth
  );

  // 追加
  flatTOList.splice(ti, 0, ...slideTabObjList);
  marks.fullNoteIndexWithTick.splice(ti, 0, ...Array(slideTabObjList.length).fill(-1))

  // 着地点note(既存note)のvelocity
  to.velocity = landingVelocity;
  to.slideTrueType = 2;

  // 着地点note(既存note)のtick縮尺
  slideInfos.forEach(info => {
    if (to.bar.fretStartTicks[info.bowIndex] !== undefined) {
      // tabObj.bar.fretStartTicks[info.bowIndex]! += splitTick * maxWidth;
      // tabObj.bar.fretStartTicks[info.bowIndex]! = tabObj.bar.startTick! + splitTick * maxWidth;
      to.bar.fretStartTicks[info.bowIndex]! = to.bar.fretStartTicks[info.bowIndex]! + splitTick * maxWidth;
    }
  });

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
  conduct: Conduct, to: TabObj, tickInfo: SlideableRange, slideInfos: SlideInfo[], splitTick: number, width: number
) {

  const settings = {
    min: conduct.settings.play.approach.velocity.min,
    max: conduct.settings.play.approach.velocity.max,
    decrease: conduct.settings.play.approach.velocity.decrease,
    minLanding: conduct.settings.play.approach.velocity.minLanding
  }

  const slideTabObjList: TabObj[] = [];

  // 複製tabObjのIDインクリメント用
  let resTabObjIDTail = -0.001;

  // velocity bean
  const decreaseVelocity = conduct.settings.play.approach.velocity.decrease;
  const minVelocity = conduct.settings.play.approach.velocity.min;
  let startCoefficient = 0; // slideTabObjに適用して、decreaseVelocityを加算する

  const slideTargetBows = slideInfos.map(m => m.bowIndex);

  // slide毎処理
  let currentTick = tickInfo.startTick;
  // slide分のlayer作成
  for (let ti = 0; ti < width; ti++) {
    // create slide tabObj
    const slideTabObj = XUtilsObject.emptyTabObj(
      to.regionIndex,
      XUtils.decimalizeAdd(to.tabObjId, resTabObjIDTail),
      XUtils.decimalizeAdd(to.regionNoteIndex, resTabObjIDTail),
      to.tab.length
    )
    slideTabObj.velocity = to.velocity.map((m, bi) => slideTargetBows.includes(bi) ? m : undefined);
    slideTabObj.styles.inst = ESInst.normal;
    slideTabObj.noteStr = '#approach';
    slideTabObj.slideTrueType = 4;
    resTabObjIDTail = XUtils.decimalizeAdd(-0.001, resTabObjIDTail);

    // 各infoのfretとtick設定
    slideInfos.forEach(info => {
      // 中間noteの必要な弦のみ対象(approachの場合ここでの開始noteは必須)
      if (info.slideWidth > 1 || ti === 0) {
        if (ti === 0) {
          slideTabObj.tab[info.bowIndex] = info.startFret + ti * info.direction;
          // console.log("0>>>", info.bowIndex, info.startFret , ti , info.direction, to.bar.fretStartTicks);
          // bug: 着地音の弦番号を見ているが、開始音が"別弦のみ"なのでundefinedが入ってしまっている
          //       対策: undefinedの場合、全弦からtickを探す
          // → そもそも、着地点のない開始指定は全く意味がないのでエラーにしたい。
          //   → 使用ケースがないか一旦確認中。例: 2|||>>||||5|
          slideTabObj.bar.fretStartTicks[info.bowIndex] = to.bar.fretStartTicks[info.bowIndex] !== undefined
            ? to.bar.fretStartTicks[info.bowIndex]
            // 暫定対策: undefinedの場合、全弦からtickを探す
            : to.bar.fretStartTicks.find(f => f !== undefined);
        } else {
          slideTabObj.tab[info.bowIndex] = info.startFret + ti * info.direction;
          slideTabObj.bar.fretStartTicks[info.bowIndex] = Math.floor(currentTick);
        }
        slideTabObj.bar.fretStopTicks[info.bowIndex] = Math.floor(currentTick + splitTick);
      }
      // console.dir(["slideTabObj>", slideTabObj.bar, slideTabObj.tab], {depth:null});

      // velocity 係数
      if (startCoefficient) {
        if (slideTabObj.velocity[info.bowIndex]! > conduct.settings.play.approach.velocity.max) {
          slideTabObj.velocity[info.bowIndex] = conduct.settings.play.approach.velocity.max;
        }
        const v = slideTabObj.velocity[info.bowIndex]!;
        const resVel = v - (v * (startCoefficient / 100));
        slideTabObj.velocity[info.bowIndex] = resVel > minVelocity ? resVel : minVelocity;
      }
    });
    currentTick += splitTick;
    startCoefficient += decreaseVelocity;

    slideTabObjList.push(slideTabObj);
  }

  const landingVelocity = structuredClone(to.velocity);
  slideInfos.forEach(info => {
    if (landingVelocity[info.bowIndex]! > conduct.settings.play.approach.velocity.max) {
      landingVelocity[info.bowIndex] = conduct.settings.play.approach.velocity.max;
    }
    const v = landingVelocity[info.bowIndex]!;
    const resVel = v - (v * (startCoefficient / 100));
    landingVelocity[info.bowIndex] = resVel > settings.minLanding ? resVel : settings.minLanding;
  });

  return { slideTabObjList, landingVelocity };
}

/**
 * TabObjの全弦共通のtick変更可能領域の算出
 * @param to 
 * @param slideableTicks 
 * @param slideInfos 
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
  slideableTicks.stopableTick = Math.min(
    ...slideInfos.map(info => {
      return to.refActiveBows![info.bowIndex]?.bar.fretStopTicks[info.bowIndex] as number
    }).filter(f => !isNaN(f))
  );
  // strokeの影響で、最も遅い開始点より、最も早い停止点が存在する場合、不整合
  // if (slideableTicks.stopableTick < slideableTicks.startableTick) {
  //   // %% 発生しない??
  //   // 202411 発生していないので、とりあえずコメントアウト
  //   return new E400(slide.line, slide.linePos, slide.row || null,
  //     `Slide processing is not possible because there is an earlier stop point than a later start point.`
  //   );
  // }

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
 * スライド幅
 */
function getBaseTick(conduct: Conduct, slideTickInfo: SlideableRange, speed: number) {
  let baseTick = conduct.settings.play.approach.widthOfSlide.baseTick;
  let maxSplitTick = conduct.settings.play.approach.widthOfSlide.maxSplitTick;
  if (speed) {
    const sp = speed / 100;
    baseTick *= sp;
    maxSplitTick *= sp;
  }
  if (slideTickInfo.stopableTick - slideTickInfo.startableTick < baseTick) {
    baseTick = slideTickInfo.stopableTick - slideTickInfo.startableTick;
  }
  return { baseTick, maxSplitTick };
}

/**
 * スライド対象弦と移動量の算出
 */
export function createSlideInfo(
  start: (number | undefined)[],
  landing: (number | undefined)[],
  // cSlide: StyleSlide
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
        if (info.startFret < 1) info.startFret = 1;
        if (info.startFret > 24) info.startFret = 24;
      }
    });
    return res;
  }

  // 開始+着地セットが存在しない場合、全弦スライド対象とし着地点を推測する
  else {
    // 着地フレットリスト
    const landingFretCollection: number[] = landing.filter(l => l !== undefined) as number[];
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
    if (!upCase.length && !downCase.length) return [];
    // 移動量と方向確定
    // ケースの多い側優先。同じ場合downCase優先(up側はタッピングの可能性が現実奏法的に高い)
    const direction = upCase.length > downCase.length ? 1 : -1;
    // 移動量の最大のもの選択
    const width = Math.abs(direction > 0 ? Math.max(...upCase) : Math.min(...downCase));
    // continue無効
    // cSlide.continue = undefined;
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
