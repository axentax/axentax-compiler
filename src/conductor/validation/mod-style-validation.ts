import { E400, E405, ErrorBase, IResult, Success } from "../interface/utils.response.interface";
import { SysSettings, globalVars } from "../x-var";
import { IKey, IShiftMax7, NumberOrUfd, UntilNext, bin12, key, Scale, Tonality } from "../interface/utils.interface";
import { BendCurveX, BendMethodX, ESInst, MapExpand, MapOpt, MapOptKeys, ParsedStep, StyleApproach, StyleBPM, StyleBendX, StyleDelay, StyleScaleX, StyleSlide, StyleStaccato, StyleStep, StyleStroke, StyleStrum, DegreeObj } from "../interface/style";
import * as XUtils from "../utils/x-utils";
import { cloneDiatonicEvolver } from "../diatonic-and-scale/mod-diatonic";
import { CSymbolType } from "../interface/compile";
import { ScaleList, ScaleNameKeys } from "../diatonic-and-scale/mod-scale";
import * as XMidiNoteUtils  from "../utils/x-midi-note-utils";
import * as XArrayUtils from "../utils/x-array-utils";
import * as XStrUtils from "../utils/x-string-utils";
import { Conduct } from "../interface/conduct";

/**
 * アプローチ奏法の検証と解析
 * @param token - 処理対象トークン
 * @param line - 行番号
 * @param linePos - 行内位置
 * @param tuning - チューニング設定
 * @returns 解析結果
 */
export function approach(token: string, line: number, linePos: number, tuning: string[]): IResult<StyleApproach, ErrorBase> {
  const approach = {} as StyleApproach;

  let tab = '';

  // パーセント設定
  if (/!/.test(token)) {
    const splitted = token.split('!');
    const percent = parseInt(splitted[1]);
    if (percent < 1 || percent > SysSettings.maxApproachPercent) {
      return new E400(line, linePos, token,
        `Invalid shift order '${percent}'. Approach speed must be an integer with a value between 1 and ${SysSettings.maxApproachPercent}.`);
    }
    approach.percentOfSpeed = percent;
    tab = splitted[0];
  } else {
    tab = token;
  }

  // タブ譜設定
  const _tab = tab.split('|');
  const bowWithFret = tuning.map((_, i) => {
    const fret = parseInt(_tab[tuning.length - 1 - i]);
    if (fret > SysSettings.maxTopFret) {
      return -2;
    }
    return isNaN(fret) ? undefined : fret;
  });
  if (_tab.length > tuning.length) {
    return new E400(line, linePos, token,
      `Invalid velocity value '${tab}'. `
      + '\nYou cannot specify more than the number of strings. Please set the number of strings using "set.turning".');
  }
  if (bowWithFret.includes(-2)) {
    return new E400(line, linePos, token,
      `Invalid token '${tab}'. Up to ${SysSettings.maxTopFret} frets can be used`);
  }
  approach.bowWithFret = bowWithFret as NumberOrUfd[];

  return new Success(approach);
}

/**
 * ベンドエフェクトの検証と解析
 * @param bendStr - ベンド設定文字列
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 解析結果
 */
export function bendX(bendStr: string, line: number, linePos: number): IResult<StyleBendX[], ErrorBase> {
  const bendList: StyleBendX[] = [];
  const resSplittedShifts = XStrUtils.splitValuesEvenOnLineBrakes(line, linePos + 3, bendStr, [',']);

  let fixedUntilDenom = 0;
  let currentStep = -1;
  // 各トークンの処理
  let rowCnt = 0;
  for (const row of resSplittedShifts) {

    const bend: StyleBendX = {
      row: row.token,
      line: row.line,
      linePos: row.pos
    } as StyleBendX;

    let transitionPos = row.pos;
    let token = row.token;

    let isVibrate = false;

    const splittedRowLen = row.token.split(/\s+/).length;
    for (let ti = 0; ti < splittedRowLen; ti++) {
      const ext = token.match(/^((?:[^\s]+)(?:\s+|$))/);
      token = token.replace(/^[^\s]+\s+/, '');
      // istanbul ignore next
      const _str = ext ? ext[1] : '';
      let str = _str.trimEnd();

      // until
      if (/^(\d+)?\.\./.test(str)) {
        let untilMatched = str.match(/^(\d+)?\.\.(\d+)?(\/\d+)?$/);
        if (!untilMatched) {
          return new E400(row.line, transitionPos, str,
            `Invalid bend token '${str}'. e.g. 0..2/4`
          )
        }
        
        // 分母が省略された場合の処理
        if (!untilMatched[3] && fixedUntilDenom > 0) {
          // 既に分母が設定されている場合、省略された分母を補完
          str = str + '/' + fixedUntilDenom;
          untilMatched = str.match(/^(\d+)?\.\.(\d+)?(\/\d+)?$/);
        }

        /* istanbul ignore next: 後続処理のためのnullチェック */
        if (!untilMatched) {
          /* istanbul ignore next: 後続処理のためのnullチェック */
          return new E400(row.line, transitionPos, str,
            `Invalid bend token after processing '${str}'. e.g. 0..2/4`
          )
        }
        
        // 分母決定
        if (untilMatched && untilMatched[3]) {
          const _fixedUntilDenom = parseInt(untilMatched[3].replace(/\//, ''));
          if (fixedUntilDenom) {
            if (fixedUntilDenom !== _fixedUntilDenom) {
              return new E400(row.line, transitionPos, row.token,
                `Different denominators cannot be set. '/${_fixedUntilDenom}'`);
            }
          }
          fixedUntilDenom = parseInt(untilMatched[3].replace(/\//, ''));
          if (fixedUntilDenom > SysSettings.bendMaxFixedUntilDenom) {
            return new E400(row.line, transitionPos, row.token,
              `The division denominator for Bend is ${SysSettings.bendMaxFixedUntilDenom},`
              + ` but the setting value is ${fixedUntilDenom}.`);
          }
        }
        else /* istanbul ignore next */ if (fixedUntilDenom === 0) {
          fixedUntilDenom = 16;
        }
        // set
        bend.untilRange = [
          /^\d+$/.test(untilMatched[1]) ? parseInt(untilMatched[1]) : 0,
          /^\d+$/.test(untilMatched[2]) ? parseInt(untilMatched[2]) : -1,
          fixedUntilDenom,
        ];
      } else if (str === 'reset') {

        // fixedUntilDenomは決定せずにuntilのみ設定する
        if (rowCnt === 0) {
          bend.untilRange = [0, 0, 1];
          bend.pitch = 0;
        } else if (rowCnt === resSplittedShifts.length - 1) {
          bend.untilRange = [-2, -2, 1];
          bend.pitch = 0;
        } else {
          return new E400(row.line, transitionPos, row.token,
            `Bend 'reset' can only be specified at the beginning or end.`);
        }
      }

      // ピッチ設定
      else if (/^(-|\+)?(\d+)(\.\d+)?$/.test(str)) {
        const pitch = parseFloat(str);
        if (-2 > pitch || pitch > 2) {
          return new E400(row.line, transitionPos, row.token,
            `Invalid bend pitch '${pitch}'. Pitch can be set from -2 to 2.`);
        }
        bend.pitch = pitch;
      }

      // カーブ設定
      else if (/^(ast|tri)$/.test(str)) {
        bend.curve = str === 'tri' ? BendCurveX.tri : BendCurveX.ast;
      }

      else if (str === 'vib') {
        isVibrate = true;
        bend.method = BendMethodX.vib;
      }

      // テンプレート設定
      else if (/^tpl::/.test(str)) {
        return new E400(row.line, transitionPos, row.token,
          `Bend templates are not yet implemented. Template '${str}' is recognized but cannot be applied due to technical complexity in scaling templates to variable note lengths. This feature is planned for future implementation.`);
      }

      // その他設定
      else if (str === 'cho') {
        //
      }

      // エラーケース
      else {
        return new E400(row.line, transitionPos, row.token,
          `Wrong way to bend property '${str}'`);
      }

      transitionPos += _str.length;
    }

    /* istanbul ignore next: テンプレート機能は未実装のため到達不可能 */
    if (bend.template) {
      if (
        bend.untilRange || bend.curve || bend.cycle || bend.pitch
        || bendList.length > 0
      ) {
        return new E400(row.line, linePos, bendStr,
          `Bend templates cannot overlap with other settings.`)
      }
    } else {
      if (!bend.untilRange) {

        if (fixedUntilDenom === 0) {
          fixedUntilDenom = 8
        }

        bend.untilRange = bend.method === BendMethodX.vib ? [currentStep < 0 ? 0 : currentStep, -1, fixedUntilDenom] : [0, -1, fixedUntilDenom];
        // console.log(currentStep)

        // } else if (bend.untilRange[2] === 0) {
        //   bend.untilRange[2] = 8;
        // return new E400(line, linePos,
        //   `Required bend position. e.g. 2..4/16`)
      }
    }

    if (bend.method === undefined && bend.pitch === undefined) {
      bend.pitch = 1;
    }

    // 手前指定のuntil侵害
    if (rowCnt !== 0 && bend.untilRange[0] !== -2) {
      if (currentStep === -1) {
        return new E400(row.line, transitionPos, row.token,
          `The previous specification has already specified the end. '${row.token}'`);
      } else if (currentStep > bend.untilRange[0]) {
        // return new E400(row.line, transitionPos,
        //   `It violates the previous specification. '${row.token}'`);
        bend.untilRange[0] = currentStep;
      }
    }
    currentStep = bend.untilRange[1];

    // vib
    if (isVibrate) {
      // push vibrate
      // currentPitch = ModValidationForStyles.splitVibrate(bendList, bend, currentPitch)
      bendList.push(bend);
    } else {
      // push choking
      bendList.push(bend);
    }

    rowCnt++;
  }

  // console.log("bendList>", bendList)
  return new Success(bendList);
}

// /** 
//  * splitVibrate
//  */
// export function splitVibrate(bendList: StyleBendX[], bend: StyleBendX, currentPitch: number): number {
//   let rev = true;
//   for (let i = bend.untilRange[0]; i < bend.untilRange[1]; i++) {
//     console.log(":", i, '~', i + 1, 'pitch', rev ? bend.pitch : currentPitch)

//     const addBend: StyleBendX = {
//       untilRange: [i, i + 1, bend.untilRange[2]],
//       pitch: rev ? bend.pitch : currentPitch
//     } as StyleBendX

//     bendList.push(addBend);

//     rev = rev ? false : true;
//   }
//   return !rev ? bend.pitch : currentPitch;
// }

/**
 * transition bpm
 * local: +30, -30
 * transition: 30..50, ..120, ..+30, ..-30
 */
export function transitionBPM(bpmStr: string, type: CSymbolType, line: number, linePos: number): IResult<StyleBPM, ErrorBase> {
  let _bpmStr = bpmStr.trim();

  const bpm: StyleBPM = {
    line, linePos, row: _bpmStr
  } as StyleBPM;

  // number case
  if (!/\D/.test(_bpmStr)) {
    const resBPM = simpleBPM(bpmStr, line, linePos);
    /* istanbul ignore next */
    if (resBPM.fail()) return resBPM;
    bpm.type = 1;
    bpm.beforeBPM = resBPM.res;
    // console.log('bpm>', bpm);
    return new Success(bpm);
  }

  if (/^(-|\+)\d+$/.test(_bpmStr)) {
    return new E400(line, linePos, bpmStr,
      `Invalid bpm token '${bpmStr}'. If you use +- signs, start with '..'.`
      + '\ne.g. bpm(120..-10)');
  }

  // tail(after bpm)
  const tailMatched = _bpmStr.match(/\s*(\.\.)\s*?([+-])?(\d+)$/)
  if (tailMatched) {
    // istanbul ignore next
    bpm.type = tailMatched[1] ? 2 : 1;
    if (tailMatched[2]) bpm.afterSign = tailMatched[2] === '+' ? 1 : -1;
    bpm.afterBPM = parseInt(tailMatched[3]);
    _bpmStr = _bpmStr.replace(/\s*(\.\.)\s*?[+-]?\d+$/, '');
  }

  // head(before bpm)
  const headMatched = _bpmStr.match(/^(\+|-)?(\d+)$/);
  if (headMatched) {
    // console.log("head>", headMatched);
    bpm.type = 3;
    if (headMatched[1]) {
      bpm.beforeSign = headMatched[1] === '+' ? 1 : -1;
    }
    bpm.beforeBPM = parseInt(headMatched[2]);
    _bpmStr = _bpmStr.replace(/^(\+|-)?(\d+)$/, '');
  }

  if ((bpm.type === 2 || bpm.type === 3) && type !== CSymbolType.closingCurlyBrace) {
    return new E400(line, linePos, bpmStr,
      `Invalid set position transition bpm '${bpmStr}'. Transition BPM cannot be specified for a single note.`);
  }

  if (_bpmStr !== '') {
    return new E400(line, linePos, _bpmStr,
      `Invalid BPM format '${_bpmStr}'. e.g. bpm(100..200) or bpm(-20..+20) or bpm(140) etc..`);
  }

  // transitionの場合の数値超過バリデーション等は、推移によるのでlayer後のBPM処理時に確認する

  return new Success(bpm);
}

/**
 * BPM
 */
export function simpleBPM(bpm: any, line: number, linePos: number): IResult<number, ErrorBase> {

  bpm = bpm.trim();

  if (/[^\d]/.test(bpm)) {
    return new E400(line, -1, null, `Invalid BPM '${bpm}', The entered value is outside the accepted range of ${SysSettings.minBPM}-${SysSettings.maxBPM}. Please enter a value within this range.`);
  }

  const _bpm = parseInt(bpm);
  if (_bpm < SysSettings.minBPM || _bpm > SysSettings.maxBPM || isNaN(_bpm)) {
    return new E400(line, linePos, bpm,
      `Invalid BPM '${bpm}', The entered value is outside the accepted range of ${SysSettings.minBPM}-${SysSettings.maxBPM}. Please enter a value within this range.`);
  }
  return new Success(_bpm);
}

/**
 * strum
 */
export function delay(delayStr: string, line: number, linePos: number): IResult<StyleDelay, ErrorBase> {
  const delay = {} as StyleDelay;

  if (delayStr === '') {
    return new E400(line, linePos, delayStr, "'delay' properties need to be set.");
  }

  if (/^\d+\/\d+$/.test(delayStr)) {
    const resUn = untilNext(delayStr, line, linePos);
    if (resUn.fail()) return resUn;
    delay.startUntil = resUn.res;
  } else {
    return new E400(line, linePos, delayStr,
      `Invalid delay property '${delayStr}'.`);
  }

  if (delay.startUntil[0] === 0) {
    return new E400(line, linePos, delayStr,
      `Invalid delay property '${delayStr}'. Molecule cannot be specified as 0.`);
  }

  /* istanbul ignore next: 分子が分母より大きいケースはuntilNext関数で事前チェック済みのため到達不可能 */
  if (delay.startUntil[0] > delay.startUntil[1]) {
    return new E400(line, linePos, delayStr,
      `Invalid delay property '${delayStr}'. Make the numerator smaller than the denominator because it exceeds the range.`);
  }

  return new Success(delay);
}

/**
 * degree(key and scale)
 * e.g. G# harmonic minor 5th
 */
export function degree(keyVal: string, line: number, linePos: number): IResult<DegreeObj, ErrorBase> {
  const tonalObj = {} as DegreeObj;
  const splittedTokenList = XStrUtils.splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(
    line, linePos + 4, keyVal);

  let beforeToken = '';
  for (const splittedTokenObj of splittedTokenList) {

    const token = splittedTokenObj.token;
    const _line = splittedTokenObj.line;
    const _linePos = splittedTokenObj.pos;

    const _keyToken = token.match(/^([CDEFGAB](?:#|b)?)(m|M)?$/);
    if (_keyToken) {

      // istanbul ignore next: else として経由しない
      if (_keyToken[1]) {
        tonalObj.tonic = XUtils.resolveNonRegularKey2str(_keyToken[1]);
      }
      if (_keyToken[2] === 'm') {
        tonalObj.tonal = Tonality.minor
      } else if (_keyToken[2] === 'M') {
        tonalObj.tonal = Tonality.major
      }

    } else if (/^[CDEFGAB](#|b)?:[01]+$/.test(token)) {
      // is custom
      return new E405(line, linePos, token, `CustomScale Not Allowed. '${token}'`)
      // console.log('### scale is custom', token)

    } else if (/^\d+th$/.test(token)) {
      // is shift
      const shift = parseInt(token.replace(/th$/, ''));

      if (beforeToken === Tonality.major || beforeToken === Tonality.minor || beforeToken === Scale.harmonic || beforeToken === Scale.melodic) {
        // possibility of shift token of tonality
        if (shift !== 7 && shift !== 6) {
          return new E400(_line, _linePos, token,
            `Invalid shift order '${token}'. Set numerical values with 'th' for tonality to 6 or 7; however, note that some sequences are not supported.`
            + '\ne.g. minor 6th'
          );
        } else {
          // is scale color
          tonalObj.tonalShift = shift;
        }

      } else if (beforeToken === 'mode') {
        // possibility of shift token mode
        if (shift < 1 || shift > 7) {
          return new E400(_line, _linePos, token,
            `Invalid shift order '${token}'. Must be an integer with a value between 1 and 7.`);
        } else {
          // is modal shift
          tonalObj.modalShift = shift as IShiftMax7;
        }
      } else {
        // invalid shift location
        return new E400(_line, _linePos, token,
          `Invalid token '${token}'. Set numerical values with 'th' after 'major', 'minor', 'mode'.`
          + '\ne.g. harmonic minor 7th mode 5th');
      }

    } else {

      switch (token) {
        case ('mode'): {
          beforeToken = token;
          break;
        }
        case (Scale.harmonic): {
          tonalObj.scale = token;
          break;
        }
        case (Scale.melodic): {
          tonalObj.scale = token;
          break;
        }
        case (Tonality.major): {
          tonalObj.tonal = token;
          break;
        }
        case (Tonality.minor): {
          tonalObj.tonal = token;
          break;
        }
        default: {
          return new E400(_line, _linePos, token,
            `'${token}' is an invalid token that cannot be set as a key.`
            + '\ne.g. C# melodic minor 7th mode 3th');
        }
      }
    }

    beforeToken = token;
  }

  // order validation for scale
  if (tonalObj.scale && !tonalObj.tonal) {
    return new E400(line, linePos, tonalObj.scale,
      `Invalid order '${tonalObj.scale}. 'minor' or 'major' is required after '${tonalObj.scale}'.`
      + '\ne.g. harmonic minor 7th mode 5th');
  }

  // complement
  if (!tonalObj.tonic) tonalObj.tonic = key.C;
  if (!tonalObj.scale) tonalObj.scale = Scale.normal;
  if (!tonalObj.tonal) tonalObj.tonal = Tonality.major;
  // if (!tonalObj.tonalShift) tonalObj.modalShift = shiftMax7[1];
  // if (!tonalObj.modalShift) tonalObj.modalShift = shiftMax7[1];

  const joinedScale = `${tonalObj.scale} ${tonalObj.tonal} ${XStrUtils.addPre(tonalObj.tonalShift, 'th')}`.trim();
  const dRes = cloneDiatonicEvolver(joinedScale);
  if (!dRes) {
    return new E400(line, linePos, joinedScale,
      `Invalid scale combination '${joinedScale}'.`);
  }

  // apply mode shift
  if (tonalObj.modalShift) {
    dRes.evolvedCodePrefix = XArrayUtils.shiftArrayAsIndex(dRes.evolvedCodePrefix, tonalObj.modalShift - 1);
    dRes.bin = XArrayUtils.shiftArrayAsIndex(dRes.bin, XArrayUtils.findNthOneIndex(dRes.bin, tonalObj.modalShift, 1)) as bin12;
  }
  tonalObj.diatonicEvolverValue = dRes;

  // system property
  const shiftedKeyArray = XArrayUtils.shiftArray(globalVars.iKey, tonalObj.tonic);
  const note7array = shiftedKeyArray.map((m, i) => dRes.bin[i] === 1 ? m : null)
    .filter(f => f !== null) as string[];
  tonalObj.sys = { shiftedKeyArray, note7array };

  return new Success(tonalObj);
}

/**
 * map
 */
// export function mapped(checkNestingMapOverStep: number[][], mapStr: string, line: number, linePos: number): IResult<MapExpand[], ErrorBase> {
export function mapped(mapStr: string, line: number, linePos: number): IResult<MapExpand[], ErrorBase> {
  const mapped = [] as MapExpand[];

  if (!/\S/.test(mapStr)) {
    return new E400(line, linePos, 'map',
      `Invalid map syntax. Symbol must be specified for map.`
    )
  }

  // const isNOS = (mos: number[][], shift: number) => {
  //   mos[mos.length - 1].push(shift);

  //   let totalShift = 0;
  //   mos.forEach(ss => {
  //     ss.forEach(s => {
  //       // 注意: 親要素を掛ける必要がある
  //     })
  //   });
  //   console.log("mos>", mos)

  // }

  const resSplittedShifts = XStrUtils.splitValuesEvenOnLineBrakes(line, linePos, mapStr, [',']);
  // if (resSplittedShifts.fail()) return resSplittedShifts;

  // all mapper
  for (let si = 0; si < resSplittedShifts.length; si++) {
    const shifter = resSplittedShifts[si];
    // console.log("resSplittedShifts>", si, resSplittedShifts[si])

    const options: MapOpt[] = [];
    let shift = 0;

    // looper 1
    // e.g. 0..8 step 2
    const withStepper = shifter.token.match(/((?:-|\+)?\d+)\.\.((?:-|\+)?\d+)(?:\s*step\s*(\d+))?\s*/);
    if (withStepper) {
      // console.log('+++withS', withStepper)
      shifter.token = shifter.token.replace(withStepper[0], '');
    }

    // looper 2
    // e.g. 0 step 3 * 2
    const withStepper2 = shifter.token.match(/((?:-|\+)?\d+)\s*step\s*((?:-|\+)?\d+)\s*\*\s*((?:-|\+)?\d+)\s*/);
    if (withStepper2) {
      shifter.token = shifter.token.replace(withStepper2[0], '');
    }

    // looper 3
    // e.g. "3*2", "*4",
    const withStepper3 = shifter.token.match(/^(\d+)?\s*\*\s*(\d+)$/);
    if (withStepper3) {
      shifter.token = shifter.token.replace(withStepper3[0], '');
      // console.log("withStepper3", withStepper3)
    }

    // options or shift number
    if (shifter.token !== '') {
      const splitted = shifter.token.split(/\s+/);
      for (let pi = 0; pi < splitted.length; pi++) {
        const str = splitted[pi];
        if (MapOptKeys.includes(str)) {
          options.push(MapOpt[str as any] as any);
        }
        else if (/^(\+|-)?\d+$/.test(str)) {
          shift = parseInt(str);
        }
        else {
          return new E400(shifter.line, shifter.pos, mapStr,
            `Invalid Mapping token '${str}'.`
            + '\ne.g. 3 ss, -2..+2 rev etc..')
        }
      }
    }

    // settlement
    if (withStepper3) {
      const shift = withStepper3[1] === undefined ? 0 : parseInt(withStepper3[1]);
      const coef = parseInt(withStepper3[2]);

      if (coef > SysSettings.maxMappedStepOrder) {
        return new E400(shifter.line, shifter.pos, withStepper3[0],
          `Invalid map prop '${withStepper3[0]}'. The coefficient limit for this specification is ${SysSettings.maxMappedStepOrder}.`)
      }

      // isNOS(checkNestingMapOverStep, coef)
      for (let i = 0; i < coef; i++) {
        const mappedExpand = {
          shift,
          options,
          location: { row: shifter.token, line: shifter.line, linePos: shifter.pos }
        }
        mapped.push(mappedExpand)
      }

    } else if (withStepper2) {
      const start = parseInt(withStepper2[1]);
      const step = parseInt(withStepper2[2]);
      const coef = parseInt(withStepper2[3]);

      if (coef < 1) {
        return new E400(shifter.line, shifter.pos, withStepper2[0],
          `Invalid Mapping token '${withStepper2[0]}'. Coefficient cannot be less than or equal to zero.`
          + '\ne.g. map(1 step 2 * 3)')
      }

      if (coef > SysSettings.maxMappedStepOrder) {
        return new E400(shifter.line, shifter.pos, withStepper2[0],
          `Invalid map order '${withStepper2[0]}'. The coefficient limit for this specification is ${SysSettings.maxMappedStepOrder}.`)
      }

      // isNOS(checkNestingMapOverStep, coef)
      let curr = start;
      for (let i = 0; i < coef; i++) {
        const mappedExpand = {
          shift: curr,
          options,
          location: { row: shifter.token, line: shifter.line, linePos: shifter.pos }
        }
        curr += step;
        mapped.push(mappedExpand)
      }

    } else if (withStepper) {
      const start = parseInt(withStepper[1]);
      const end = parseInt(withStepper[2]);
      let step = withStepper[3] !== undefined && /^[1-9]/.test(withStepper[3]) ? parseInt(withStepper[3]) : 1;
      step = (start <= end) ? Math.abs(step) : -Math.abs(step);

      if (Math.abs(start - end) >= SysSettings.maxMappedStepOrder) {
        return new E400(shifter.line, shifter.pos, withStepper[0],
          `Invalid map order '${withStepper[0]}'. Step count range is up to ${SysSettings.maxMappedStepOrder}.`)
      }

      // let coef = 0;
      for (let i = start; (step > 0) ? (i <= end) : (i >= end); i += step) {
        // coef++;
        const mappedExpand = {
          shift: i,
          options,
          location: { row: shifter.token, line: shifter.line, linePos: shifter.pos }
        }
        mapped.push(mappedExpand)
      }
      // isNOS(checkNestingMapOverStep, coef)

    } else {
      const mappedExpand = {
        shift,
        options,
        location: { row: shifter.token, line: shifter.line, linePos: shifter.pos }
      }
      mapped.push(mappedExpand)
    }
  }

  // console.dir(mapped, { depth: null })
  return new Success(mapped);
}

/**
 * tuning
 */
export function tuning(tuningStr: string, line: number, linePos: number): IResult<IKey[], ErrorBase> {

  const tu = tuningStr.split('|');

  const err = tu.find(f => f === '' || !/^[CDEFGAB](#|b)?$/.test(f));
  if (err || err === '') {
    return new E400(line, linePos, tuningStr,
      `Invalid tuning '${err}', tuning supports only ${globalVars.iKey.map(m => `'${m}'`)}.`
      + (/^\||\|$/.test(tuningStr) ? "\nPlease set without '|' on both sides." : '')
      + '\ne.g. D|A|D|G|A|D or C#|A|D|G|B|E or C#|F#|B|E|A|D|G|B|E'
    );
  }
  if (tu.length < 6 || tu.length > SysSettings.maxBows) {
    return new E400(line, linePos, tuningStr,
      `Invalid tuning '${tu.join('|')}'. The number of strings that can be set ranges from 6 to ${SysSettings.maxBows}.`);
  }

  const resIKeyArr = tu.map(m => XUtils.resolveNonRegularKey3str(m));

  // 以下のように低音弦のピッチが高音弦のピッチより高くなる場合はエラーとする
  // A|G|B|E|A|D|G|B|E => tuningPitch>> [64, 59, 55, 50, 45, 40, 35, 19, 21]
  const tuningPitchArr = XMidiNoteUtils.tuningToStringPitch(resIKeyArr);
  // console.log('tu>>', resIKeyArr, tuningPitchArr)
  for (let i = 1; i < tuningPitchArr.length; i++) {
    if (tuningPitchArr[i] > tuningPitchArr[i - 1]) {
      return new E400(line, linePos, tuningStr,
        `Invalid tuning ${tuningStr}.`
        + '\nThe treble strings cannot be lower than the bass strings.'
        + '\ne.g. C#|F#|B|E|A|D|G|B|E');
    }
  }

  return new Success(resIKeyArr);
}

/**
 * until next
 */
export function untilNext(untilStr: string, line: number, linePos: number): IResult<UntilNext, ErrorBase> {

  if (!/^\d+\/\d+$/.test(untilStr)) {
    return new E400(line, linePos, untilStr,
      `Invalid token '${untilStr}'. specify A as a fraction. e.g. 1/4`);
  }

  const un = untilStr.split('/').map(m => parseInt(m.trim())) as UntilNext;

  if (un[0] > SysSettings.maxUntilNext0) {
    return new E400(line, linePos, untilStr,
      `Invalid token '${un.join('/')}', numerator value '${un[0]}' exceeds the allowed maximum of ${SysSettings.maxUntilNext0}.`);
  }
  if (un[1] > SysSettings.maxUntilNext1 || un[1] < 1) {
    return new E400(line, linePos, untilStr,
      `Invalid token '${un.join('/')}', The entered value is outside the accepted range of 1-${SysSettings.maxUntilNext1}. Please enter a value within this range.`);
  }
  return new Success(un);
}

/**
 * staccato
 */
export function staccato(staccatoStr: string, line: number, linePos: number): IResult<StyleStaccato, ErrorBase> {
  const staccato = {} as StyleStaccato;

  if (staccatoStr === '') {
    return new E400(line, linePos, staccatoStr, 'staccato requires property');
  }

  if (/^\d+\/\d+$/.test(staccatoStr)) {
    const resUn = untilNext(staccatoStr, line, linePos);
    if (resUn.fail()) return resUn;
    staccato.cutUntil = resUn.res;
  } else {
    return new E400(line, linePos, staccatoStr,
      `Invalid staccato property '${staccatoStr}'.`);
  }

  if (staccato.cutUntil[0] === 0) {
    return new E400(line, linePos, staccatoStr,
      `Invalid staccato property '${staccatoStr}'. Molecule cannot be specified as 0.`);
  }

  if (staccato.cutUntil[0] > staccato.cutUntil[1]) {
    return new E400(line, linePos, staccatoStr,
      `Invalid staccato property '${staccatoStr}'. Make the numerator smaller than the denominator because it exceeds the range.`);
  }

  return new Success(staccato);
}

/**
 * stepped
 * @param tuning 
 * @param stepStr 
 * @param line 
 * @param linePos 
 */
export function createStepPlan(tuning: string[], stepStr: string, line: number, linePos: number): IResult<{ sym: string, startLine: number, startPos: number, endPos: number }[], ErrorBase> {

  let commitLine = line;
  let commitPos = linePos - 1;
  let trueLine = line;
  let truePos = linePos - 1;

  const loc: { sym: string, startLine: number, startPos: number, endPos: number }[] = [];

  // list
  let roundInner = false;
  let stackUp = '';
  let dummyStackUp = '';
  for (const oneStr of stepStr) {

    if (oneStr === '\n') {

      if (!roundInner && stackUp !== '') {
        // コミット
        loc.push({ sym: stackUp, startLine: commitLine, startPos: commitPos, endPos: commitPos + dummyStackUp.trim().length })
        stackUp = '';
        dummyStackUp = '';
      }

      trueLine++;
      truePos = 0;
      continue;
    }

    truePos++;

    if (/\s/.test(oneStr)) {
      dummyStackUp += ' '
      continue;
    }

    if (!/[.MmnDdUuf123456789rRN~^=()]/.test(oneStr)) {
      return new E400(trueLine, truePos, oneStr,
        `Invalid step symbol '${oneStr}'. Only '.MmnDdUuf123456789rR' can be used with step.`);
    }

    if (/\d/.test(oneStr) && parseInt(oneStr) > tuning.length) {
      return new E400(trueLine, truePos, oneStr,
        `Invalid pos value '${oneStr}'. The string specification exceeds the number of strings specified in tuning ${tuning.length} strings.`);
    }

    // '('開始
    if (oneStr === '(') {

      if (roundInner) {
        return new E400(trueLine, truePos, oneStr,
          `Invalid pos value '${oneStr}'. Parentheses can only be one level deep.`);
      }

      if (stackUp !== '') {
        // コミット
        loc.push({ sym: stackUp, startLine: commitLine, startPos: commitPos, endPos: commitPos + dummyStackUp.trim().length }) // +1
        stackUp = '';
        dummyStackUp = '';
      }

      roundInner = true
      continue;
    }
    // ')'終了
    if (oneStr === ')') {
      if (stackUp === '') {
        return new E400(trueLine, truePos, oneStr,
          `Invalid step symbol '${oneStr}'. Parentheses must specify a symbol.`);
      }

      if (/^(~|=|\^|\.)/.test(stackUp) || !/^\d+/.test(stackUp)) {
        return new E400(trueLine, truePos, oneStr,
          `Invalid step symbol '${stackUp}'.. Instrument specification cannot be at the beginning.`);
      }

      roundInner = false;

      // commit
      loc.push({ sym: stackUp, startLine: commitLine, startPos: commitPos, endPos: commitPos + dummyStackUp.trim().length }) // +1
      stackUp = '';
      dummyStackUp = '';
      continue;
    }

    // 開始
    if (stackUp === '') {
      commitLine = trueLine;
      commitPos = truePos;
      stackUp += oneStr;
      dummyStackUp += oneStr;

    } else {
      // 追加

      if (roundInner) {
        // 括弧の場合
        stackUp += oneStr;
        dummyStackUp += oneStr;

      } else {
        // 括弧以外の場合

        // 追記
        if (/m|M|n|N|~|=|\^|\./.test(oneStr)) {

          // if (stackUp === '') {
          //   /* istanbul ignore next */
          //   return new E400(trueLine, truePos, oneStr,
          //     `Invalid step symbol '${oneStr}'. Instrument specification cannot be at the beginning.`);
          // }

          stackUp += oneStr;
          dummyStackUp += oneStr;

        } else {
          // コミット
          // stepPlan.list.push(stackUp)
          loc.push({ sym: stackUp, startLine: commitLine, startPos: commitPos, endPos: commitPos + dummyStackUp.trim().length }) // +1

          stackUp = oneStr;
          dummyStackUp = oneStr;
          commitLine = trueLine;
          commitPos = truePos;
        }
      }
    }
  }
  if (stackUp !== '') {
    // commit
    loc.push({ sym: stackUp, startLine: commitLine, startPos: commitPos, endPos: commitPos + dummyStackUp.trim().length }) // +1
  }

  // console.log(loc)
  return new Success(loc);
}


/**
 * step
 */
export function step(tuning: string[], trueStr: string, truePos: number, stepStr: string, line: number, linePos: number): IResult<StyleStep, ErrorBase> {

  if (!/\S/.test(stepStr)) {
    return new E400(line, truePos, trueStr,
      `Invalid step syntax. Symbol must be specified for step.`);
  }

  const resCreatePlan = createStepPlan(tuning, stepStr, line, linePos);
  if (resCreatePlan.fail()) return resCreatePlan;

  const stepPlan = {} as StyleStep;
  stepPlan.parsedStep = [];

  // parsedStep
  const accumStepStr: string[] = []
  const full = Array.from({ length: tuning.length }, (_, i) => i);
  for (let spi = 0; spi < resCreatePlan.res.length; spi++) {
    const sp = resCreatePlan.res[spi].sym;

    const parsedStep: ParsedStep = {
      line: resCreatePlan.res[spi].startLine,
      // startLine: resCreatePlan.res[spi].startLine,
      startPos: resCreatePlan.res[spi].startPos,
      // endLine: resCreatePlan.res[spi].endLine,
      endPos: resCreatePlan.res[spi].endPos
    } as ParsedStep;

    // strings
    const stringMatched = sp.match(/\d/g);
    if (/f|D|d|U|u/.test(sp)) {
      parsedStep.stringIndexes = full;
    } else if (/R|rn/.test(sp)) {
      parsedStep.stringIndexes = undefined;
      parsedStep.inst = ESInst.restNoise;
    } else if (/r/.test(sp)) {
      parsedStep.stringIndexes = undefined;
      parsedStep.inst = ESInst.rest;
    } else if (stringMatched) {
      parsedStep.stringIndexes
        = stringMatched.map(m => parseInt(m) - 1);
    } else {
      // throw "no strings"
      // console.dir(['resCreatePlan', resCreatePlan.res], {depth:null})
      // console.log('sp', sp)
      return new E400(line, linePos, stepStr,
        `Invalid step symbol '${stepStr}'. Specification violation.`);
    }
    // inst
    const instMatched = sp.replace(/rn/, '').match(/[nmMDdUuN]/g);
    if (instMatched) {
      if (instMatched.length > 1) {
        return new E400(line, linePos, stepStr,
          `Invalid step symbol '${instMatched.join('')}'. Multiple inst specifications cannot be specified for one string.`);
      }
      parsedStep.inst = {
        // 'r': ESInst.rest,
        // 'R': ESInst.restNoise,
        'n': ESInst.normal,
        'm': ESInst.mute,
        'M': ESInst.muteContinue,
        'D': ESInst.brushing_D,
        'd': ESInst.brushing_d,
        'U': ESInst.brushing_U,
        'u': ESInst.brushing_u,
        'N': ESInst.normalUnContinueForStep
      }[instMatched[0]] as ESInst;
    }
    // suffix
    const suffixMatched = sp.replace(/[fnmMDdUu]/g, '').replace(/\./g, '~').match(/[~^=]+/g);
    if (suffixMatched) {
      parsedStep.suffix = suffixMatched[0];
    }

    // stepStr
    accumStepStr.push(sp);
    parsedStep.stepSym = [...accumStepStr];

    stepPlan.parsedStep.push(parsedStep);
  }

  // console.dir(['stepPlan', stepPlan], { depth: null })
  return new Success(stepPlan);
}

/**
 * strum
 * /|||2 or :strum(10) ※数値はmsec指定
 */
export function strum(conduct: Conduct, strumStr: string, line: number, linePos: number): IResult<StyleStrum, ErrorBase> {
  const strum = {} as StyleStrum;

  if (strumStr !== '') {
    const splitted = strumStr.split(',');
    for (const val of splitted) {
      if (!/\D/.test(val)) {
        // strum sec
        const msec = parseInt(val);
        if (msec < 0 || msec > SysSettings.maxStrumWidthMSec) {
          return new E400(line, linePos, strumStr,
            `Invalid strum msec '${val}'. Strum must be between 0 and ${SysSettings.maxStrumWidthMSec}.`);
        }
        strum.strumWidthMSec = msec;

      } else if (/^\d+\/\d+$/.test(val)) {
        // strum until
        const resUn = untilNext(val, line, linePos);
        if (resUn.fail()) return resUn;
        strum.startUntil = resUn.res;
      } else {
        return new E400(line, linePos, strumStr,
          `Invalid strum property '${val}'.`);
      }
    }
  }

  if (strum.startUntil && strum.startUntil[0] === 0) {
    return new E400(line, linePos, strumStr,
      `Invalid strum property '${strumStr}'. Molecule cannot be specified as 0.`);
  }

  if (strum.startUntil && strum.startUntil[0] > strum.startUntil[1]) {
    return new E400(line, linePos, strumStr,
      `Invalid strum property '${strumStr}'. Make the numerator smaller than the denominator because it exceeds the range.`);
  }

  if (!strum.startUntil) strum.startUntil = [0, 1]
  if (!strum.strumWidthMSec) strum.strumWidthMSec = conduct.settings.play.strum.defaultStrumWidthMSec;
  return new Success(strum);
}

/**
 * pos(positions)
 */
// export function positions(tuning: string[], token: string, line: number, linePos: number): IResult<StylePositions, ErrorBase> {

//   const pos = {} as StylePositions;

//   const resPosKeyValue = XStrUtils.splitBracketedKeyValueTokenWithExtractLineAndPos(line, linePos + 4, token);
//   if (resPosKeyValue.fail()) return resPosKeyValue;

//   // console.log("resPosKeyValue.res>>", resPosKeyValue.res)

//   for (let i = 0; i < resPosKeyValue.res.length; i++) {
//     const set = resPosKeyValue.res[i];
//     // const key = set.key.token;
//     // const val = set.val.token;
//     // console.log("#", set.key.token, set.val.token)

//     /** - key - */
//     switch (set.key.token) {

//       case ('L'):
//       case ('loc'):
//       case ('location'): {
//         const extVal = {
//           low: 1, mid: 2, high: 3, higher: 4
//         }[set.val.token]
//         if (extVal === undefined) {
//           return new E400(set.val.line, set.val.pos, set.key.token,
//             `Invalid pos.${set.key.token} value '${set.val.token}'. Possible values are 'low', 'mid', 'high', or 'higher'.`);
//         }
//         pos.location = extVal;
//         break;
//       }

//       // case('R'):
//       // case('rot'):
//       case ('I'):
//       case ('inv'):
//       case ('inversion'): {
//         if (/[^12345]/.test(set.val.token)) {
//           return new E400(set.val.line, set.val.pos, set.val.token,
//             `>>>Invalid pos.${set.key.token} value '${set.val.token}'. ${set.key.token} must be between 1 and 5.`);
//         }
//         pos.inversion = parseInt(set.val.token);
//         break;
//       }

//       case ('E'):
//       case ('exc'):
//       case ('exclusion'): {
//         if (/^[\s\d,]+$/.test(set.val.token)) {
//           set.val.token = set.val.token.replace(/\s|,/g, '');
//           const vs = set.val.token.split('').map(m => {
//             const num = parseInt(m);
//             return tuning.length < num ? -1 : num;
//           });
//           /* istanbul ignore next: チューニング範囲外の弦指定は上位で事前チェック済みのため到達不可能 */
//           if (vs.includes(-1)) {
//             return new E400(set.val.line, set.val.pos, set.val.token, `strings '${set.val.token}' don't exist.`);
//           }
//           pos.exclusion = vs;
//           break;
//         }
//         return new E400(set.val.line, set.val.pos, set.val.token,
//           `Invalid pos.${set.key.token} value '${set.val.token}'. ${set.key.token} must be 1 or 5.`);
//       }

//       case ('U'):
//       case ('use'):
//       case ('useStrings'): {
//         // number case
//         if (/^[\s\d,]+$/.test(set.val.token)) {
//           set.val.token = set.val.token.replace(/\s|,/g, '');
//           if (set.val.token.length > tuning.length) {
//             return new E400(set.val.line, set.val.pos, set.val.token, 'over length: ' + set.val.token);
//           }
//           const vs = set.val.token.split('').map(m => {
//             const num = parseInt(m);
//             return tuning.length < num ? -1 : num;
//           });
//           /* istanbul ignore next: チューニング範囲外の弦指定は上位で事前チェック済みのため到達不可能 */
//           if (vs.includes(-1)) {
//             return new E400(set.val.line, set.val.pos, set.val.token, `strings ''${set.val.token}'' don't exist..`);
//           }
//           pos.useStrings = vs.sort();
//         }
//         // all strings case
//         else if (set.val.token === 'full' || set.val.token === 'f') {
//           pos.useStrings = tuning.map((_, i) => i + 1);
//         }
//         // error case
//         else {
//           return new E400(set.val.line, set.val.pos, set.val.token,
//             `Invalid pos.${set.key.token} value '${set.val.token}'.`);
//         }
//         break;
//       }

//       case ('R'):
//       case ('req'):
//       case ('required'): {
//         // number case
//         if (/^[\s\d,]+$/.test(set.val.token)) {
//           set.val.token = set.val.token.replace(/\s|,/g, '');
//           if (set.val.token.length > tuning.length) {
//             return new E400(set.val.line, set.val.pos, set.val.token, `strings '''${set.val.token}''' don't exist.`);
//           }
//           const vs = set.val.token.split('').map(m => {
//             const num = parseInt(m);
//             return tuning.length < num ? -1 : num;
//           });
//           /* istanbul ignore next: チューニング範囲外の弦指定は上位で事前チェック済みのため到達不可能 */
//           if (vs.includes(-1)) {
//             return new E400(set.val.line, set.val.pos, set.val.token, `strings ''''${set.val.token}'''' don't exist.`);
//           }
//           pos.required = vs.sort();
//         }
//         // all strings case
//         else if (set.val.token === 'full' || set.val.token === 'f') {
//           pos.required = tuning.map((_, i) => i + 1);
//         }
//         // error case
//         else {
//           return new E400(set.val.line, set.val.pos, set.val.token,
//             `Invalid pos.${set.key.token} value '${set.val.token}'.`);
//         }
//         break;
//       }

//       case ('C'):
//       case ('cov'):
//       case ('cover'): {
//         const extVal = {
//           true: 0, false: 1, error: 2, err: 2, warn: 3, warning: 3
//         }[set.val.token]
//         /* istanbul ignore next: 既知の値以外は上位で事前チェック済みのため到達不可能 */
//         if (extVal === undefined) {
//           return new E400(set.val.line, set.val.pos, set.val.token,
//             `Invalid pos.${set.key.token} value '${set.val.token}'. Possible values are 'true', 'false', 'warn', or 'error'.`);
//         }
//         pos.cover = extVal;
//         break;
//       }

//       default: {
//         return new E400(set.key.line, set.key.pos, set.key.token,
//           `Unknown pos key '${set.key.token}'.`);
//       }

//     }
//   }

//   if (!Object.keys(pos).length) {
//     return new E400(line, linePos, token, "'pos' properties need to be set.");
//   }

//   return new Success(pos);

// }

/**
 * stroke
 */
export function stroke(token: string, line: number, linePos: number): IResult<StyleStroke, ErrorBase> {
  const stroke = {} as StyleStroke;

  const resSplit = XStrUtils.splitValuesEvenOnLineBrakes(line, linePos + 3, token, ['!', ',', '.']);
  // if (resSplit.fail()) return resSplit;

  for (const prop of resSplit) {
    // start until
    if (/^\d+\/\d+$/.test(prop.token)) {
      const resUn = untilNext(prop.token, prop.line, prop.pos);
      if (resUn.fail()) return resUn;
      stroke.until = resUn.res;
    }

    else if (prop.token === 'off') {
      stroke.off = true;
    }

    else if (prop.token === 'up') {
      stroke.up = true;
    }

    else {
      // error
      return new E400(prop.line, prop.pos, prop.token,
        `The stroke property '${prop.token}' is invalid.`
        + '\ne.g. ## stroke(1/8) or stroke(1/8.up) or stroke(off) etc..');
    }
  }

  return new Success(stroke);
}

/**
 * scale
 */
export function scale(scaleStr: string, line: number, linePos: number): IResult<StyleScaleX, ErrorBase> {
  const scaleX = {} as StyleScaleX;

  const resSplittedShifts = XStrUtils.splitValuesEvenOnLineBrakes(line, linePos, scaleStr, [',', ' ']);

  for (let si = 0; si < resSplittedShifts.length; si++) {
    const splitted = resSplittedShifts[si];
    if (/^[CDEFGAB](#|b)?$/.test(splitted.token)) {
      scaleX.key = XUtils.resolveNonRegularKey3str(splitted.token) as IKey;

    } else if (ScaleNameKeys.includes(splitted.token)) {
      scaleX.scale = ScaleNameKeys.indexOf(splitted.token);
      scaleX.bin = ScaleList[scaleX.scale].bin;

    } else if (/^\d+$/.test(splitted.token)) {

      if (!/^[01]+$/.test(splitted.token)) {
        return new E400(splitted.line, splitted.pos, scaleStr,
          `Invalid scale token '${splitted.token}'. Customize scale to shape "1" and "0".`
          + '\ne.g. E 101101011010');
      }

      if (splitted.token.length !== 12) {
        return new E400(splitted.line, splitted.pos, scaleStr,
          `Invalid scale token '${splitted.token}'. Customize the scale to 12 digits.`
          + '\ne.g. E 101101011010');
      }

      scaleX.scale = splitted.token as any;
      scaleX.bin = splitted.token.split('').map(m => m === "1" ? 1 : 0) as bin12;

    } else {
      return new E400(splitted.line, splitted.pos, scaleStr,
        `Invalid scale token '${splitted.token}'.`
        + '\ne.g. E dorian');
    }
  }

  if (!scaleX.key) {
    return new E400(line, linePos, scaleStr,
      `Invalid scale token '${scaleStr}'. Scales need keys.`
      + '\ne.g. E minor');
  }

  if (scaleX.scale === undefined) {
    return new E400(line, linePos, scaleStr,
      `Invalid scale token '${scaleStr}'. Scales need scale name.`
      + '\ne.g. E minor');
  }

  // console.log(['scaleX', scaleX], { depth:null })
  return new Success(scaleX);
}

/**
 * slide
 */
export function slide(token: string, line: number, linePos: number, isContinue?: boolean): IResult<StyleSlide, ErrorBase> {
  const slide = {} as StyleSlide;

  const resSplit = XStrUtils.splitValuesEvenOnLineBrakes(line, linePos - 2, token, ['!', ',']);
  // if (resSplit.fail()) return resSplit;
  for (const prop of resSplit) {

    // start until
    if (/^\d+\/\d+$/.test(prop.token)) {
      const resUn = untilNext(prop.token, prop.line, prop.pos);
      if (resUn.fail()) return resUn;
      slide.startUntil = resUn.res;
      continue;
    }

    // speed
    const speed = prop.token.match(/^(fast|mid|slow)(?:\.?(\d+))?$/);
    if (speed) {
      slide.inSpeed = speed[1] as any;
      if (speed[2]) {
        slide.inSpeedLevel = parseInt(speed[2]);
      }
      continue;
    }

    // release
    const release = prop.token.match(/^(hi|low)(?:\.?(\d+))?$/);
    if (release) {
      slide.type = 'release';
      slide.arrow = release[1] === 'hi' ? 1 : -1;
      if (release[2]) slide.releaseWidth = parseInt(release[2]);
      continue;
    }

    // continue
    if (prop.token === 'continue') {
      slide.continue = true;
      continue;
    }

    // auto
    if (prop.token === 'auto') {
      slide.auto = true;
      continue;
    }

    // error
    return new E400(prop.line, prop.pos, prop.token,
      `The slide property '${prop.token}' is invalid because it is an unknown word.`);
  }

  // complement
  if (!slide.type) slide.type = 'to';

  // ----- toのuntil未指定の場合で、且つcontinueXの場合、noteの先頭[0, 1]とする対応だが、一旦メモとする
  //          適用する場合、以下をコメントアウトし、適用クラスで処理する
  if (!slide.startUntil) {
    // release || to
    slide.startUntil = slide.arrow ? [6, 8] : [1, 2];
    // If until is not specified, auto is forced *'to' only
    if (slide.type === 'to') slide.auto = true;
  }

  if (!slide.inSpeedLevel) slide.inSpeedLevel = 48;

  if (isContinue) {
    slide.continue = true;
  }

  // For release, continue is false
  if (slide.continue && slide.type === 'release') {
    slide.continue = undefined;
  }

  // console.log('slide>>', slide)
  return new Success(slide);
}

/**
 * velocities
 */
export function velocities(conduct: Conduct, token: string, tuning: string[], line: number, linePos: number): IResult<NumberOrUfd[], ErrorBase> {

  // const velocities = token.match(/^v\((.*?)\)$/s);
  // if (!velocities) {
  //   return new E400(line, linePos, token,
  //     `Invalid velocity value '${token}'. `
  //     + '\nYou cannot specify more than the number of strings. Please set the number of strings using "set.turning".'
  //     + '\ne.g. for 7 strings it is "set.turning: D|E|A|D|G|B|E"');
  // }

  // console.log('cc>>', conduct.settings.play.velocities)

  const _vs = token.split(/[|,]/).map((_m, i) => {
    const m = _m.trim();
    return m === '' ? conduct.settings.play.velocities[i] : /^\d+$/.test(m) ? parseInt(m) : NaN;
  }).reverse();

  if (_vs.some(s => s !== undefined && (s > 100 || s < 0 || isNaN(s)))) {
    return new E400(line, linePos, token,
      `Invalid velocities value '${token}'. Must be an integer with a value between 0 and 100.`);
  }
  if (_vs.length > tuning.length) {
    return new E400(line, linePos, token,
      `Invalid velocity value '${token}'. `
      + '\nYou cannot specify more than the number of strings. Please set the number of strings using "set.turning".'
      + '\ne.g. for 7 strings it is "set.turning: D|E|A|D|G|B|E"');
  }
  return new Success(_vs);
}

/**
 * velocity
 */
export function velocity(velStr: string, line: number, linePos: number): IResult<number, ErrorBase> {
  const val = parseInt(velStr.replace(/^\s/g, ''));

  if (val > 100 || !/^s*\d+\s*$/.test(velStr)) {
    return new E400(line, linePos, velStr, `Invalid velocity value '${velStr}'. Must be an integer with a value between 0 and 100.`);
  }
  return new Success(val || 1);
}
