import { CSymbolType, CompileSymbols } from "../../interface/compile";
import { Mixes } from "../../interface/conduct";
import { ESInst, Styles } from "../../interface/style";
import { IKey } from "../../interface/utils.interface";
import { E400, SimpleResult, simpleSuccess } from "../../interface/utils.response.interface";

/**
 * ModBulletクラス
 * 
 * タブ譜形式の記譜（例：2/4-5-7）を個別のノートシンボルに展開する
 * フレット指定、演奏指示、一部スタイル情報の継承も処理する
 */
export class ModBullet {

  /**
   * バレット適用メソッド
   * 
   * シンボル配列内のバレットシンボルを展開し、個別のノートシンボルに変換する
   * デュアルブロック対応で、各ブロック内のバレットを順次処理する
   * 
   * @param mixes ミックスオブジェクト
   * @param symbolsDualLists デュアルブロック対応のシンボル配列
   * @returns 処理結果（成功またはエラー）
   */
  static apply(mixes: Mixes, symbolsDualLists: CompileSymbols[][]): SimpleResult {

    // ここで di 受け取っているのは、新規に作成した CompileSymbols[] を参照に丸ごと代入するため
    const dualId = mixes.dualId;
    const resolvedSymbolsList: CompileSymbols[] = [];
    const bulletGroup = { num: 1 };

    for (let si = 0; si < symbolsDualLists[dualId].length; si++) {
      const symbols = symbolsDualLists[dualId][si];

      if (symbols.type === CSymbolType.bullet) {

        const resBullet = disassembleBullet(
          mixes,
          mixes.regionList[symbols.regionRegionForDualConnection].tuning,
          resolvedSymbolsList,
          symbols,
          bulletGroup
        );

        if (resBullet.fail()) return resBullet;

        bulletGroup.num++;

      } else {
        resolvedSymbolsList.push(symbols);
      }
    }

    symbolsDualLists[dualId] = resolvedSymbolsList;

    return simpleSuccess();
  }

}

/**
 * バレット分解関数
 * 
 * バレットシンボルを個別のノートシンボルに分解する
 * 弦番号、フレット指定、演奏指示、スタイル情報を解析して展開する
 * 
 * @param mixes ミックスオブジェクト
 * @param tuning チューニング配列
 * @param resolvedSymbolsList 解決済みシンボル配列
 * @param sym 分解対象のバレットシンボル
 * @param bulletGroup バレットグループ情報
 * @returns 処理結果（成功またはエラー）
 */
function disassembleBullet(
  mixes: Mixes, tuning: IKey[], resolvedSymbolsList: CompileSymbols[], sym: CompileSymbols, bulletGroup: { num: number }
): SimpleResult {

  // mapをgroup処理にする対応
  const mappedGroupList = mixes.marks.styleMappedGroupList;
  const activeGroupIndex = mappedGroupList.findIndex(f => f > 0);
  
  let groupId = -1;
  if (mappedGroupList[activeGroupIndex] > 0) {
    groupId = mappedGroupList[activeGroupIndex] + 1;
    mappedGroupList.splice(activeGroupIndex, 0, groupId)
  } else {
    groupId = 1;
    mappedGroupList.splice(1, 0, groupId)
  }

  // フレット指定なしが通ってしまう対応
  if (sym.decidedProp.noteStr.match(/\/$/)) {
    return new E400(sym.line, sym.linePos, sym.decidedProp.noteStr,
      `Not found fret token. ${sym.decidedProp.noteStr}` + '\ne.g. 6/1-2-3');
  }

  // prefixがつくと1が合わない対応
  const _sym = sym.decidedProp.noteStr.replace(/:.*?$/, '');
  const matched = _sym.match(/^(.*?)\d\/[^/]+$/);
  let prefixLength = 0;
  if (matched) {
    prefixLength = matched[1].length;
  }

  let continueStop = false;
  let currentPos = sym.linePos + prefixLength;
  const [bow, frets] = sym.token.split('/');

  // 弦番号の処理
  const stringTrueName = parseInt(bow);
  // エラーチェック
  if (stringTrueName < 1 || stringTrueName > tuning.length) {
    return new E400(sym.line, currentPos, stringTrueName.toString(),
      `Not Found strings '${stringTrueName}'. Only the tuning string can be specified.`);
  }
  const stringIndex = tuning.length - stringTrueName;
  currentPos += bow.length + 1;

  // 親スタイルキー
  const existsParentStyleKeys = Object.keys(sym.decidedProp.styles) as (keyof Styles)[];

  // 各フレットの処理
  const eachFrets = frets.replace(/-+$/, '').split('-');

  for (let fi = 0; fi < eachFrets.length; fi++) {
    const eachFret = eachFrets[fi];
    if (eachFret === '') { currentPos++; continue } // -- case

    // フレット分割とプロパティ検索
    const matched = eachFret.match(/^(\d+|r|R)([nmMDdUu])?([~^=]+)?$/);

    if (!matched) {
      return new E400(sym.line, currentPos, eachFret,
        `Invalid fret token option '${eachFret}'. Permitted frets include n,m,M,D,d,U,u,R,r, etc..`
        + '\ne.g. 2/4m-5-7-r-5-7');
    }
    const _note = matched[1];
    const _inst = _note === 'R' ? 'R' : matched[2];
    const _suffix = matched[3];

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
          case ("legato"): {
            currentStyle[sk] = sym.decidedProp.styles[sk]; break
          }
          case ("mapped"): {
            currentStyle[sk] = structuredClone(sym.decidedProp.styles[sk]);

            // mapをgroup処理にする対応
            const mapped = currentStyle[sk];
            mapped.forEach(mm => {
              if (mm.group === -1) mm.group = groupId;
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
          case ("turn"): {
            currentStyle[sk] = sym.decidedProp.styles[sk]; break
          }

        }

        if (fi === 0) {
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

        if (fi === eachFrets.length - 1) {
          switch (sk) {
            case ("slide"): {
              currentStyle[sk] = sym.decidedProp.styles[sk]; break
            }
          }
        }
      }
    });

    // 演奏指示のマッチング
    const inst = {
      'n': ESInst.normal,
      'm': ESInst.mute,
      'M': ESInst.muteContinue,
      // 'r': ESInst.rest,
      'R': ESInst.restNoise,
      'D': ESInst.brushing_D,
      'd': ESInst.brushing_d,
      'U': ESInst.brushing_U,
      'u': ESInst.brushing_u
    }[_inst] as ESInst;
    if (inst === ESInst.restNoise) currentStyle.restNoise = true;

    // 現在の演奏指示
    currentStyle.inst = inst !== undefined
      ? inst
      : sym.decidedProp.styles.inst !== undefined
        ? sym.decidedProp.styles.inst
        : ESInst.normal;

    // styles.continue # Continue until the corresponding inst appears
    if (fi !== 0 && sym.decidedProp.styles.continue
      && !continueStop
      && (currentStyle.inst === ESInst.normal || currentStyle.inst === ESInst.muteContinue)) {
      currentStyle.continue = true;
    } else if (fi !== 0) {
      continueStop = true;
    }

    // タブ譜生成
    const symToken = '|'.repeat(stringIndex)
      + (_note === 'R' ? 'r' : _note)
      + (stringIndex === 0 ? '|' : '')
      + (_suffix ? _suffix : '');

    const extensionViewProp = structuredClone(sym.decidedProp.extensionViewProp) || {};
    extensionViewProp.bullet = { row: eachFret, index: fi };

    // 新しいシンボルの作成
    const newSymbols: CompileSymbols = {
      curlyLevel: sym.curlyLevel,
      type: CSymbolType.note,
      typesStyle: [],
      line: sym.line,
      linePos: currentPos,
      linesOfStyle: [],
      linePosOfStyle: [],
      endLine: sym.line, // sym.endLine, // 20241114 viewのために調整
      endPos: currentPos + eachFret.length,
      token: symToken,
      styles: [], // It is used at the compilation stage, so it is not used here.
      decidedProp: {
        noteStr: sym.decidedProp.noteStr,
        extensionViewProp: extensionViewProp,
        list: undefined as any,
        tick: structuredClone(sym.decidedProp.tick),
        styles: currentStyle,
        fingering: undefined as any,
        chordDicRef: sym.decidedProp.chordDicRef,
        isBullet: bulletGroup.num
      },
      regionRegionForDualConnection: sym.regionRegionForDualConnection,
      locationInfoRefStackUpList: sym.locationInfoRefStackUpList
    };

    currentPos += eachFret.length + 1;

    resolvedSymbolsList.push(newSymbols);
  }

  return simpleSuccess();
}
