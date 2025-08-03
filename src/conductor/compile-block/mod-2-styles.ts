import { E400, E404, ErrorBase, IResult, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import { CSymbolType, CompileSymbols } from "../interface/compile";
import { Conduct, Mixes } from "../interface/conduct";
import { ESInst, StyleObjectBank, Styles } from "../interface/style";
import * as ModValidationForStyles from "../validation/mod-style-validation";
import * as XUtils from "../utils/x-utils";
import { ModBullet } from "./unfold-bullet/bullet";
import * as ModValidationForSuffix from "../validation/mod-suffix-validation";
import { SysSettings } from "../x-var";
import { Bar } from "../interface/tab";


export class ModStyle {

  static resolve(conduct: Conduct, symbolsDualLists: CompileSymbols[][]): SimpleResult { // IResult<CompileSymbols[], ErrorBase> {

    // Distribute style to each note after resolving the style.
    const sob: StyleObjectBank = {};//defaultStyleSOB();

    // each mixes
    for (let dualId = 0; dualId < symbolsDualLists.length; dualId++) {

      // parse style syntax with build StyleObjectBank
      const resStyleSyntax = compileStyleSyntax(conduct, conduct.mixesList[dualId], symbolsDualLists[dualId], sob);
      if (resStyleSyntax.fail()) return resStyleSyntax;      

      // distribute style with in hierarchy
      const resDistributed = distributeStyleWithinHierarchy(conduct.mixesList[dualId], symbolsDualLists[dualId], sob);
      if (resDistributed.fail()) return resDistributed;

      // resolve bullet
      // bulletをここで処理するのは、決まった弦とフレットのsym配布のためで、システムによるfingering解決が必要ない為
      // また、note解決にはbulletの先行解決が必要。
      const resBullet = ModBullet.apply(conduct.mixesList[dualId], symbolsDualLists);
      if (resBullet.fail()) return resBullet;

      // resolve tick for each note
      const resTicked = resolveBaseTick(conduct.mixesList[dualId], symbolsDualLists[dualId]);
      if (resTicked.fail()) return resTicked;

    }

    conduct.styleObjectBank = sob;

    return simpleSuccess();
  }
}

/**
 * regulation style influence
 */
function resolveBaseTick(mixes: Mixes, symbolsList: CompileSymbols[]): SimpleResult {

  for (let si = 0; si < symbolsList.length; si++) {
    const sym = symbolsList[si];

    if (sym.type === CSymbolType.regionStart) {
      continue;
    }

    if (sym.type === CSymbolType.degreeName || sym.type === CSymbolType.note) {
      const _style = sym.decidedProp.styles;

      // tick.untilNext
      sym.decidedProp.tick = {
        untilNext: _style?.until
          ? structuredClone(_style.until)
          : structuredClone(mixes.regionList[sym.regionRegionForDualConnection].untilNext)
      } as Bar;

      // resolve suffix extension
      const resSuffix = ModValidationForSuffix.mathSuffixExtension(sym.decidedProp.tick.untilNext, sym.token, sym.line, sym.linePos);
      if (resSuffix.fail()) return resSuffix;
      if (resSuffix.res) {
        // remove suffix
        sym.token = sym.token.replace(/[\^~=]+$/, '');
      }

    }
  }

  return simpleSuccess();
}

/**
 * 指定されたシンボルリストとスタイルオブジェクトバンクに基づいて、階層構造内にスタイルを分配します。
 * このメソッドは、シンボルを逆順に処理し、音符と度数名にスタイルを適用します。
 * 階層構造とグループ化に基づきます。スタイルはスタイルオブジェクトバンクから取得され、
 * bpmやturnなどの特定のスタイルに指定されたグループ化ルールを考慮して適用されます。
 */
function distributeStyleWithinHierarchy(mixes: Mixes, symbolsList: CompileSymbols[], sob: StyleObjectBank): IResult<null, ErrorBase> {

  /** tmp Hierarchy Style Token Bank */
  type HSB = {
    row: string,
    line: number,
    linePos: number,
    /** style key of HierarchyBank */
    s: string,
    /** group index */
    g: number
  };
  const hsb: HSB[][] = [];

  let regionIndex = mixes.regionList.length - 1;
  let tuning = mixes.regionList[regionIndex].tuning;
  let groupId = 1;

  // 後処理を簡略化するためのgroupIdリスト。最終的にmixes.marks.styleMappedGroupListに保持する
  const styleMapGroupIdList: { [keys: string]: boolean } = {};

  // reverse loop
  for (let i = symbolsList.length - 1; i >= 0; i--) {
    const sym = symbolsList[i];
    switch (sym.type) {

      case (CSymbolType.closingCurlyBrace): {
        // In the case of a closing curly brace, always push an element into the array.
        const __hsb = sym.styles.map((m, i) => {
          const preStyleKey = XUtils.innerTrimerForStyleKey(m);
          return {
            row: sym.styles[i],
            line: sym.linesOfStyle[i],
            linePos: sym.linePosOfStyle[i],
            s: preStyleKey,
            g: (preStyleKey.startsWith('bpm(')
              || preStyleKey.startsWith('turn')
              || preStyleKey.startsWith('map('))
              ? groupId++
              : 0
          };
        });

        // blockStyleでのmapが重複する場合に、左から処理されてしまう不具合対応 20241009
        const gList = __hsb.map(m => m.g).filter(f => f > 0);
        __hsb.forEach(f => f.g = f.g > 0 ? gList.pop() as number : 0);

        // 追加
        hsb.push(__hsb);
        break;
      }
      case (CSymbolType.openingCurlyBrace): {
        // In the case of a opening curly brace, always pop an element into the array.
        hsb.pop();
        break;
      }
      case (CSymbolType.regionStart): {
        regionIndex--;
        if (regionIndex >= 0) tuning = mixes.regionList[regionIndex].tuning; // plan delete
        break;
      }
      case (CSymbolType.bullet):
      case (CSymbolType.degreeName):
      case (CSymbolType.note): {
        let currentNoteStyle = {} as Styles;
        tuning = mixes.regionList[sym.regionRegionForDualConnection].tuning;

        // ---
        // --- all brackets style loop
        // ---
        for (let hi = 0; hi < hsb.length; hi++) {
          const h = hsb[hi];

          // process each bracket in a reverse loop.
          for (let hi = h.length - 1; hi >= 0; hi--) {
            const rh = h[hi];

            let SOBHere: Styles = {} as Styles;
            if (rh.g > 0) {
              //
              // In the case of having a group, clone
              //
              SOBHere = structuredClone(sob[`${tuning.toString()}_${rh.s}`]);

              if (SOBHere?.bpm) {
                SOBHere.bpm.group = rh.g;

              } else if (SOBHere?.turn) {
                SOBHere.turn.group = rh.g;

              } else if (SOBHere?.mapped) {
                SOBHere.mapped[0].group = rh.g;
                styleMapGroupIdList[rh.g] = true;
              }

            } else {
              //
              // If a group is not required.
              //

              // stepは個々にプロパティを持たせるため、キーにlocation情報を付与する
              let stepKeyTail = '';
              if (/^step/.test(rh.s)) stepKeyTail = ':' + rh.line + ':' + rh.linePos;
              SOBHere = sob[`${tuning.toString()}_${rh.s}` + stepKeyTail];
            }

            // merge
            if (currentNoteStyle.mapped && SOBHere.mapped) {
              // map case
              SOBHere.mapped[0].row = rh.row;
              SOBHere.mapped[0].line = rh.line;
              SOBHere.mapped[0].linePos = rh.linePos;
              currentNoteStyle.mapped.unshift(SOBHere.mapped[0]);
              // ↑↑↑ currentNoteStyleに mappedの配列ないとエラーになる予定（bendではエラーになった）

              const sum = currentNoteStyle.mapped.reduce((accumulator, currentValue) => {
                return accumulator * currentValue.style.length
              }, 1);
              if (sum > SysSettings.maxMappedStepOrder) {
                const curr = currentNoteStyle.mapped[currentNoteStyle.mapped.length - 1];
                return new E400(curr.line, curr.linePos || -1, curr.row || null,
                  `Invalid mapped step order '${curr.row}'. The total number of nested map operations exceeds the limit of '${SysSettings.maxMappedStepOrder}'.`
                )
              }

            } else {
              // other case
              const styleKey = Object.keys(SOBHere)[0] as keyof Styles;
              if (
                typeof SOBHere[styleKey] === 'object'
                && !Array.isArray((SOBHere as any)[styleKey])
              ) {
                (SOBHere as any)[styleKey].row = rh.row;
                (SOBHere as any)[styleKey].line = rh.line;
                (SOBHere as any)[styleKey].linePos = rh.linePos;
              }
              currentNoteStyle = { ...currentNoteStyle, ...SOBHere };
            }
          }
        }

        // ---
        // --- own style
        // ---
        for (let mi = sym.styles.length - 1; mi >= 0; mi--) {
          
          // stepは個々にプロパティを持たせるため、キーにlocation情報を付与する
          let stepKeyTail = '';
          if (/^step/.test(sym.styles[mi])) stepKeyTail = ':' + sym.linesOfStyle[mi] + ':' + sym.linePosOfStyle[mi];
          const SOBHere = structuredClone(sob[`${tuning.toString()}_${XUtils.innerTrimerForStyleKey(sym.styles[mi])}` + stepKeyTail]);

          // merge
          if (SOBHere.mapped) {
            // map case
            SOBHere.mapped[0].row = sym.styles[mi];
            SOBHere.mapped[0].line = sym.linesOfStyle[mi];
            SOBHere.mapped[0].linePos = sym.linePosOfStyle[mi];

            // own styleでも、連なる場合、外側はgroup対応とする対応 20241009
            styleMapGroupIdList[groupId] = true;
            SOBHere.mapped[0].group = groupId++;

            if (!currentNoteStyle.mapped) {
              currentNoteStyle.mapped = [SOBHere.mapped[0]]
            } else {
              currentNoteStyle.mapped.unshift(SOBHere.mapped[0]);
            }

            // mapped limit check
            const sum = currentNoteStyle.mapped.reduce((accumulator, currentValue) => {
              return accumulator * currentValue.style.length
            }, 1);
            if (sum > SysSettings.maxMappedStepOrder) {
              const curr = currentNoteStyle.mapped[currentNoteStyle.mapped.length - 1];
              return new E400(curr.line, curr.linePos || -1, curr.row || null,
                `Invalid mapped step order '${curr.row}'. The total number of nested map operations exceeds the limit of '${SysSettings.maxMappedStepOrder}'.`
              )
            }

          } else {
            // other case
            const styleKey = Object.keys(SOBHere)[0] as keyof Styles;
            if (
              typeof (SOBHere as any)[styleKey] === 'object'
              && !Array.isArray((SOBHere as any)[styleKey])) {

              (SOBHere as any)[styleKey].row = sym.styles[mi];
              (SOBHere as any)[styleKey].line = sym.linesOfStyle[mi];
              (SOBHere as any)[styleKey].linePos = sym.linePosOfStyle[mi];
            }
            currentNoteStyle = { ...currentNoteStyle, ...SOBHere };

          }
        }

        // Add with unshift.
        sym.decidedProp.styles = currentNoteStyle;
      }
    }
  }

  // expect styleMapGroupList: [-1, 4, 3, 2, 1]
  mixes.marks.styleMappedGroupList = Object.keys(styleMapGroupIdList).map(key => parseInt(key)).reverse();

  return simpleSuccess();
}

/**
 * style analyze start point
 */
function compileStyleSyntax(conduct: Conduct, mixes: Mixes, symbolsLists: CompileSymbols[], sob: StyleObjectBank): SimpleResult {

  let tuning: string[] = [];
  for (const sym of symbolsLists) {
    
    if (sym.type === CSymbolType.regionStart) {
      continue;
    }

    // 「|」のみの場合、until:0/1 の長さのない休符とする
    if (sym.decidedProp && /^\|(:.+)?$/.test(sym.decidedProp.noteStr)) {
      sym.styles.push('0/1')
    }

    // judge
    if (sym.styles.length) {
      const len = sym.styles.length;
      for (let si = 0; si < len; si++) {

        tuning = mixes.regionList[sym.regionRegionForDualConnection].tuning;

        const styleStr = sym.styles[si];
        const shortStr = XUtils.innerTrimerForStyleKey(styleStr);

        // -- Correspondence that holds syntaxLocation for each sym of step --
        let stepKeyTail = '';
        if (/^step/.test(sym.styles[si])) stepKeyTail = ':' + sym.linesOfStyle[si] + ':' + sym.linePosOfStyle[si];
        const cacheKey = `${tuning.toString()}_${shortStr}` + stepKeyTail;

        if (!sob[cacheKey]) {

          switch (styleStr) {
            case ('n'): {
              sob[cacheKey] = { inst: ESInst.normal };
              break;
            }
            case ('m'): {
              sob[cacheKey] = { inst: ESInst.mute };
              break;
            }
            case ('M'): {
              sob[cacheKey] = { inst: ESInst.muteContinue };
              break;
            }
            case ('rn'): {
              sob[cacheKey] = { inst: ESInst.restNoise, restNoise: true };
              break;
            }
            case ('d'): {
              sob[cacheKey] = { inst: ESInst.brushing_d };
              break;
            }
            case ('D'): {
              sob[cacheKey] = { inst: ESInst.brushing_D };
              break;
            }
            case ('u'): {
              sob[cacheKey] = { inst: ESInst.brushing_u };
              break;
            }
            case ('U'): {
              sob[cacheKey] = { inst: ESInst.brushing_U };
              break;
            }
            case ('N'): {
              sob[cacheKey] = { inst: ESInst.normalUnContinueForStep };
              break;
            }
            case ('continue'): {
              sob[cacheKey] = { continue: true };
              break;
            }
            case ('leg'): {
              sob[cacheKey] = { legato: true };
              break;
            }
            // case ('/'): {
            //   sob[cacheKey] = { until: [0, 1] };
            //   break;
            // }
          }
          if (sob[cacheKey]) continue;

          // approach
          if (styleStr.startsWith('approach')) {
            const _approach = styleStr.replace(/^approach\(|\)$/g, '');
            const resApproach = ModValidationForStyles.approach(_approach, sym.linesOfStyle[si], sym.linePosOfStyle[si] + 9, tuning)
            if (resApproach.fail()) return resApproach;
            sob[cacheKey] = { approach: resApproach.res }
            continue;
          }

          // bend new!
          if (styleStr.startsWith('bd')) {
            const resBend = ModValidationForStyles.bendX(styleStr.replace(/^bd\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si]);
            if (resBend.fail()) return resBend;
            sob[cacheKey] = {
              bd: resBend.res
            }
            continue;
          }

          // bpm
          if (styleStr.startsWith('bpm')) {
            const _bpm = styleStr.replace(/^bpm\(|\)$/g, '');
            const resTransitionBPM = ModValidationForStyles.transitionBPM(_bpm, sym.type, sym.linesOfStyle[si], sym.linePosOfStyle[si] + 4);
            if (resTransitionBPM.fail()) return resTransitionBPM;
            sob[cacheKey] = {
              bpm: {
                style: resTransitionBPM.res,
                group: -1,
                groupEndTick: -1
              }
            }
            continue;
          }

          // delay
          if (styleStr.startsWith('delay')) {
            const resDelay = ModValidationForStyles.delay(shortStr.replace(/^delay\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 0);
            if (resDelay.fail()) return resDelay;
            sob[cacheKey] = { delay: resDelay.res };
            continue;
          }

          // key
          //if (styleStr.startsWith('key')) {
          if (styleStr.startsWith('%(')) {
            const resKeys = ModValidationForStyles.degree(styleStr.replace(/^(%)\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] - 2);
            if (resKeys.fail()) return resKeys;
            sob[cacheKey] = { degree: resKeys.res }
            continue;
          }

          if (styleStr.startsWith('degree(')) {
            const resKeys = ModValidationForStyles.degree(styleStr.replace(/^(degree)\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 3);
            if (resKeys.fail()) return resKeys;
            sob[cacheKey] = { degree: resKeys.res }
            continue;
          }

          // mapped
          if (styleStr.startsWith('map')) {
            const resMapped = ModValidationForStyles.mapped(styleStr.replace(/^map\(|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 4);
            if (resMapped.fail()) return resMapped;
            sob[cacheKey] = {
              mapped: [{
                style: resMapped.res,
                group: -1,
                row: styleStr,
                line: sym.linesOfStyle[si],
                linePos: sym.linePosOfStyle[si]
              }] as any
            };
            continue;
          }

          // positions
          if (styleStr.startsWith('pos')) {
            const resPositions = ModValidationForStyles.positions(
              tuning, styleStr.replace(/^pos\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si]);
            if (resPositions.fail()) return resPositions;
            if (Object.keys(resPositions.res).length) sob[cacheKey] = { pos: resPositions.res }
            continue;
          }

          // scale
          if (/^scale\(.*?\)$/.test(styleStr)) {
            const resScale = ModValidationForStyles.scale(styleStr.replace(/^scale\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 6);
            if (resScale.fail()) return resScale;
            sob[cacheKey] = { scaleX: resScale.res };
            continue;
          }

          // slide continue
          if (/^to&($|\(.+?\))$/.test(styleStr)) {
            const resSlide = ModValidationForStyles.slide(styleStr.replace(/^to&\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 6, true);
            if (resSlide.fail()) return resSlide;
            sob[cacheKey] = { slide: resSlide.res };
            continue;
          }

          // slide
          if (/^to($|\(.+?\))$/.test(styleStr) ) { // styleStr.startsWith('to')) {
            const resSlide = ModValidationForStyles.slide(styleStr.replace(/^to\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 5);
            if (resSlide.fail()) return resSlide;
            sob[cacheKey] = { slide: resSlide.res };
            continue;
          }

          // staccato
          if (styleStr.startsWith('staccato')) {
            const resStaccato = ModValidationForStyles.staccato(shortStr.replace(/^staccato\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 9);
            if (resStaccato.fail()) return resStaccato;
            sob[cacheKey] = { staccato: resStaccato.res };
            continue;
          }

          // step
          if (styleStr.startsWith('step')) {

            if (sym.type === CSymbolType.bullet) {
              return new E400(sym.linesOfStyle[si], sym.linePosOfStyle[si], sym.token,
                `Invalid style '${styleStr}'. Cannot specify a step in bullet format.`
              )
            }

            const resStep = ModValidationForStyles.step(
              tuning, styleStr, sym.linePosOfStyle[si] + 1, styleStr.replace(/^step\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 5);
            if (resStep.fail()) return resStep;
            sob[cacheKey] = { step: resStep.res };
            continue;
          }

          // stroke
          if (styleStr.startsWith('stroke')) {
            const resStroke = ModValidationForStyles.stroke(shortStr.replace(/^stroke\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 4);
            if (resStroke.fail()) return resStroke;
            sob[cacheKey] = { stroke: resStroke.res };
            continue;
          }

          // strum
          if (styleStr.startsWith('strum')) {
            const resStrum = ModValidationForStyles.strum(conduct, shortStr.replace(/^strum\(?|\)$/g, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 6);
            if (resStrum.fail()) return resStrum;
            sob[cacheKey] = { strum: resStrum.res };
            continue;
          }

          // turn
          if (styleStr.startsWith('turn(') || styleStr === 'turn') {
              sob[cacheKey] = { turn: { props: styleStr.replace(/^turn\(?|\)$/g, '') , group: -1 } };
            continue;
          }

          // velocities
          if (styleStr.startsWith('v(')) {
            const resVelocities = ModValidationForStyles.velocities(
              conduct, styleStr.replace(/v\(|\)$/g, ''), tuning, sym.linesOfStyle[si], sym.linePosOfStyle[si] + 2);
            if (resVelocities.fail()) return resVelocities;
            sob[cacheKey] = { velocityPerBows: resVelocities.res };
            continue;
          }

          // until next
          if (/^\d+\/\d+$/.test(styleStr)) {
            const resUn = ModValidationForStyles.untilNext(styleStr, sym.linesOfStyle[si], sym.linePosOfStyle[si]);
            if (resUn.fail()) return resUn;
            sob[cacheKey] = { until: resUn.res };
            continue;
          }

          // // until next 0
          // if (styleStr === '/') {
          //   sob[cacheKey] = { until: [0, 1] };
          //   continue;
          // }

          // velocity
          if (/^v\d+$/.test(styleStr)) {
            const resVelocity = ModValidationForStyles.velocity(styleStr.replace(/^v/, ''), sym.linesOfStyle[si], sym.linePosOfStyle[si] + 1);
            if (resVelocity.fail()) return resVelocity;
            sob[cacheKey] = { velocity: resVelocity.res };
            continue;
          }

          return new E404(sym.linesOfStyle[si], sym.linePosOfStyle[si], styleStr,
            `Unknown style '${styleStr.replace(/\(.+$/, '')}'`);
        }
      }
    }

  }

  return simpleSuccess();
}