import { CompileSymbols } from "../../interface/compile";
import { Conduct } from "../../interface/conduct";
import { ESInst, Styles } from "../../interface/style";
import { SimpleResult, simpleSuccess } from "../../interface/utils.response.interface";
import * as ModValidationForSuffix from "../../validation/mod-suffix-validation";

/**
 * UnfoldSteppedクラス
 * 
 * ステップ展開処理を行うクラス
 * ステップスタイルが適用されたシンボルを複数の個別シンボルに展開する
 * アルペジオや分散和音などの演奏パターンを実現する
 */
export class UnfoldStepped {

  /**
   * ステップ解決メソッド
   * 
   * ステップスタイルが適用されたシンボルを展開し、個別のシンボルに変換する
   * 各ステップごとにフィンガリング、タイミング、スタイル情報を調整する
   * 
   * @param conduct コンダクターオブジェクト
   * @param dualId デュアルブロックID
   * @param symbolsList シンボル配列
   * @returns 処理結果（成功またはエラー）
   */
  static apply(conduct: Conduct, dualId: number, symbolsList: CompileSymbols[]): SimpleResult {

    const stepInfoList = conduct.extensionInfo.stepInfoList;

    for (let si = 0; si < symbolsList.length; si++) {
      const sym = symbolsList[si];
      const styles = sym.decidedProp?.styles;

      if (!styles?.step) {
        continue;
      }

      // stepに対するmapをgroup処理にする対応
      const mappedGroupList = conduct.mixesList[dualId].marks.styleMappedGroupList;
      const activeGroupIndex = mappedGroupList.findIndex(f => f > 0);
      let groupId = -1;
      if (mappedGroupList[activeGroupIndex] > 0) {
        groupId = mappedGroupList[activeGroupIndex] + 1;
        mappedGroupList.splice(activeGroupIndex, 0, groupId)
      } else {
        groupId = 1;
        mappedGroupList.splice(1, 0, groupId)
      }

      const parsedStepList = styles.step.parsedStep;
      const stepInfoId = stepInfoList.length;
      stepInfoList.push({ tabAll: sym.decidedProp.fingering, parsedStepList: parsedStepList });

      // 親スタイルキー
      const existsParentStyleKeys = Object.keys(sym.decidedProp.styles) as (keyof Styles)[];

      const newSymbolsLists: CompileSymbols[] = [];
      for (let pi = 0; pi < parsedStepList.length; pi++) {

        // 現在のステップ
        const currentParsedStep = parsedStepList[pi];

        // チェック => f指定は弦数全て指定するので、あるなし比較はできない
        // console.log(currentParsedStep.stringIndexes)
        // if (currentParsedStep.stringIndexes !== undefined) {
        //   const fLen = sym.decidedProp.fingering.length;
        //   for (let csi = 0; csi < currentParsedStep.stringIndexes?.length; csi++) {
        //     for (si = 0; si < fLen; si++) {
        //     }
        //   }
        // }

        // フィンガリング
        const currentFingering = sym.decidedProp.fingering.map((m, i) => {
          return currentParsedStep.stringIndexes?.includes(i) ? m : undefined;
        });

        // 現在のタイック
        const currentTick = structuredClone(sym.decidedProp.tick);
        // サフィックス拡張の解決
        if (currentParsedStep.suffix) {
          // サフィックスの削除
          const resSuffix = ModValidationForSuffix.mathSuffixExtension(currentTick.untilNext, currentParsedStep.suffix, sym.line, sym.linePos);
          if (resSuffix.fail()) return resSuffix;
        }

        // 現在のスタイル
        const currentStyle = {} as Styles;
        existsParentStyleKeys.forEach(sk => {

          if (sym.decidedProp.styles[sk] !== undefined) {
            switch (sk) {
              case ("bd"): {
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("bpm"): {
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("until"): {
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("degree"): {
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("mapped"): {
                currentStyle[sk] = structuredClone(sym.decidedProp.styles[sk]);

                // stepに対するmapをgroup処理にする対応
                const mapped = currentStyle[sk];
                mapped.forEach(mm =>  {
                  if (mm.group === -1) mm.group = groupId;
                  // console.log(mm)
                });

                break;
              }
              case ("scaleX"): {
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("staccato"): {
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("velocity"): {
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("velocityPerBows"): {
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("stroke"): { // 検討中
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
              case ("turn"): { //
                currentStyle[sk] = sym.decidedProp.styles[sk]; break
              }
            }

            if (pi === 0) {
              switch (sk) {
                case ("approach"): {
                  currentStyle[sk] = sym.decidedProp.styles[sk]; break
                }
                case ("continue"): {
                  currentStyle[sk] = sym.decidedProp.styles[sk]; break
                }
                case ("delay"): {
                  currentStyle[sk] = sym.decidedProp.styles[sk]; break
                }
                case ("strum"): {
                  currentStyle[sk] = sym.decidedProp.styles[sk]; break
                }
              }
            }

            if (pi === parsedStepList.length - 1) {
              switch (sk) {
                case ("slide"): {
                  currentStyle[sk] = sym.decidedProp.styles[sk]; break
                }
              }
            }
          }
        });

        // 演奏指示
        currentStyle.inst = currentParsedStep.inst !== undefined
          ? currentParsedStep.inst
          : sym.decidedProp.styles.inst !== undefined
            ? sym.decidedProp.styles.inst
            : ESInst.normal;

        // 最初以外のステップに対するstyles.continue
        if (pi !== 0 && (currentStyle.inst === ESInst.normal || currentStyle.inst === ESInst.muteContinue)) {
          currentStyle.continue = true;
        }

        const extensionViewProp = sym.decidedProp.extensionViewProp || {};
        extensionViewProp.stepInfoId = { id: stepInfoId, orderCount: pi };

        // 新しいシンボルの作成
        const newSymbols: CompileSymbols = {
          curlyLevel: sym.curlyLevel,
          type: sym.type,
          typesStyle: [],
          line: currentParsedStep.line, // sym.line,
          linePos: currentParsedStep.startPos, // sym.linePos,
          linesOfStyle: [],
          linePosOfStyle: [],
          endLine: currentParsedStep.line, // sym.endLine, // stepの単体symは改行しない
          endPos: currentParsedStep.endPos, // sym.endPos,
          token: sym.token,
          styles: [], // It is used at the compilation stage, so it is not used here.
          decidedProp: {
            noteStr: sym.decidedProp.noteStr, // + ' .. ' + currentParsedStep.stepSym,
            extensionViewProp,
            list: sym.decidedProp.list,
            tick: currentTick,
            styles: currentStyle,
            fingering: currentFingering,
            trueTab: sym.decidedProp.fingering,
            chordDicRef: sym.decidedProp.chordDicRef,
            isArpeggio: true
            // bulletにはstepは適用しない
          },
          regionRegionForDualConnection: sym.regionRegionForDualConnection
        };

        // Location情報追加（note自体の情報がわかればいいため）
        newSymbols.locationInfoRefStackUpList = sym.locationInfoRefStackUpList

        newSymbolsLists.push(newSymbols)
      }

      symbolsList.splice(si, 1, ...newSymbolsLists)
      si += newSymbolsLists.length - 1;
    }

    return simpleSuccess();
  }
}
