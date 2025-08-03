import { CompileSymbols, CSymbolType } from "../../interface/compile";
import { Conduct } from "../../interface/conduct";
import { BoardForShiftSeed, MapSeed } from "../../interface/dic-map-seed";
import { MapExpand, MapOpt, Styles } from "../../interface/style";
import { IKey, NumberOrUfd } from "../../interface/utils.interface";
import { SimpleResult, simpleSuccess } from "../../interface/utils.response.interface";
import * as XArrayUtils from "../../utils/x-array-utils";
import * as XMidiNoteUtils  from "../../utils/x-midi-note-utils";
import * as XScaleUtils from "../../utils/x-scale-utils";
import { SysSettings } from "../../x-var";
import * as XMappedUtils from "./utils-mapped";

type SymCollect = {
  index: number,
  sym: CompileSymbols
};

type TmpX = {
  /* 全体指板作成(ノートナンバー0開始) */
  board: number[][];
  /** 臨時音を追加した指定スケール */
  extendScaleFullArr: (IKey | undefined)[];
  /** 有効音のみのindexを値に持った配列 */
  activeInIndexes: NumberOrUfd[];
  originList: {
    /** fingeringの各音のキー名 e.g. ['A#', 'E'] ※12|13||||の場合 */
    originKeyArr: IKey[];
    /** fingeringの各音のノートナンバー（但し、チューニング最低音を0とした場合の数値） [18, 12] ※12|13||||の場合 */
    originNoteNumArr: number[];
    /** フレット [12, 13] */
    originFretArr: number[];
    /** 弦index */
    originStringArr: number[];
  }[];
  seed: BoardForShiftSeed;
};

export class MappedGroup {

  static resolve(seedObj: MapSeed, conduct: Conduct, dualId: number, group: number, symbolsList: CompileSymbols[]): SimpleResult {
    const mixes = conduct.mixesList[dualId];
    const { regionList } = mixes;

    const originSymList: SymCollect[] = [];

    // group範囲を検索
    let startedIndex: number | null = null;
    for (let si = 0; si < symbolsList.length; si++) {
      const sym = symbolsList[si];
      const mapped = sym.decidedProp?.styles.mapped;
      const gps = mapped?.filter(mp => mp.group === group).length;

      // group指定のmapを検知
      if (gps) {
        if (startedIndex === null) startedIndex = si;
        
        originSymList.push({
          index: si,
          sym: structuredClone( sym ) // ! add clone
        });
      } else if (startedIndex !== null && sym.type === CSymbolType.note) {
        // 終了
        break;
      }
    }

    if (!originSymList.length) return simpleSuccess();

    // 対応範囲ごとの分離（実際のsym入れ替えはindexが合わなくなるため後方から実施する）
    // index連番毎に分割（コールバックにする理由は特にない）
    const groupConsecutive = (arr: SymCollect[]): SymCollect[][] => {
      let beforeScaleStr: string = conduct.settings.style.scale.key + '_' + conduct.settings.style.scale.scale;
      return arr.reduce((groups: SymCollect[][], current: SymCollect) => {

        const scale = current.sym.decidedProp.styles.scaleX || conduct.settings.style.scale;
        const currScale = scale.key + '_' + scale.scale;

        if (groups.length === 0 || current.index !== groups[groups.length - 1][groups[groups.length - 1].length - 1].index + 1) {
          // インデックスが飛んだ場合は分離
          groups.push([current]);
        } else {
          // 前とスケールが異なる場合は分離
          if (beforeScaleStr !== currScale) {
            groups.push([current]);
          } else {
            // スケール継続
            groups[groups.length - 1].push(current);
          }
        }
        beforeScaleStr = currScale;
        return groups;
      }, []);
    }
    const symCollector = groupConsecutive(originSymList);

    // 0: 初期化
    const tuning = regionList[originSymList[0].sym.regionRegionForDualConnection].tuning;
    const tuningPitches = XMidiNoteUtils.tuningToStringPitch(tuning);

    // 1: 臨時音追加スケール等情報作成
    const tmpXList: TmpX[] = symCollector.map((scr) => {
      // seed取得
      const scale = scr[0].sym.decidedProp.styles.scaleX || conduct.settings.style.scale;
      const seed = XMappedUtils.createSeed(seedObj, tuning, scale);
      // 1-2: 元音解析
      const extendKeys: IKey[] = [];
      const originList = scr.map(sc => {
        const res = XScaleUtils.getMidiNoteFromFingering(sc.sym.decidedProp.fingering, tuningPitches);
        extendKeys.push(...res.originKeyArr)
        return res;
      });

      // 1-3: 臨時音を指定スケールに追加
      const extendScaleFullArr = XScaleUtils.addExtendKeyIntoScale(seed.boardFullArr, seed.iKeysWithTuningStart, extendKeys);
      // 1-4: inIndexの省略shift用配列作成 [shift先検索用]
      const { activeInIndexes } = XScaleUtils.createActiveNoteOnlyList(extendScaleFullArr);
      // 1-5: 指板作成(ノートナンバー0開始)
      const board = seed.tuningPitches.map(df => {
        const start = df - seed.tuningPitches[seed.tuningPitches.length - 1];
        return XArrayUtils.createNumberBetweenArray(start, start + SysSettings.maxTopFret);
      });
      return {
        board,
        extendScaleFullArr,
        activeInIndexes,
        originList,
        seed
      }
    });

    // スタイル準備
    const map = originSymList[0].sym.decidedProp.styles.mapped;
    const styleMapped = map?.find(mp => mp.group === group);
    if (styleMapped === undefined) throw 'System Error';

    // "複数音弾き(コード)は弦フレットまで確定"、"単音弾きはシフト済みnoteNumberのみ確定"までを実施
    // 同じmap内だが、ここではスケール毎に、[1,1(shifted)] [2,2(shifted)] のような並びで戻ってくる
    const buildedShiftByScale = tmpXList.map((tmpX, i) => {
      return buildShift(tmpX, styleMapped.style, symCollector[i])
    });

    // 2: 配列の並び正規化
    const flatShifted = styleMapped.style.flatMap((_, si) => { // シフト数分ループ
      // 区分数分ループ
      return buildedShiftByScale.flatMap(div => {
        return div[si].map(note => {          
          return note;
        })
      })
    });

    let _s2 = 0;

    // 3: 決定していないfingeringを生成し、symを複製。
    // - 区分内で決定しているフレットの一番左側のフレットを基準にする
    // - singleもそうだが、いきなりshift(shift:0がない状態)で単音のみの場合は、参考箇所ないな
    let symOrderNum = 0;
    const addSymList = flatShifted.map((fs, i) => {
      // origin長さでクリア
      if ((i) % originSymList.length === 0) {
        // console.log('---');
        symOrderNum = 0;
      }

      // 未決定のfingering作成（暫定処理: mod-4-notes の段階なので暫定でもfingering指定しておきたい）
      const noteNum = fs.noteNum;
      if (noteNum !== undefined) { // ノート番号があれば弾く場所未決定
        // no open string
        const optionNoOpenString = fs.mapOpt.includes(MapOpt.nos);
        // 弦一旦決定
        let stringIndex = tmpXList[0].board.findIndex(bo => bo.includes(noteNum));
        // nosであり、その弦でのフレットが解放弦だった場合、且つ最低限ではない。
        if (optionNoOpenString && tmpXList[0].board.length - 1 !== stringIndex && tmpXList[0].board[stringIndex].indexOf(noteNum) === 0) {
          // 開放弦を除外して再度検索
          const _stringIndex = tmpXList[0].board.findIndex((bo, i) => {
            return bo.includes(noteNum) && stringIndex !== i
          });
          if (_stringIndex >= 0) {
            stringIndex = _stringIndex;
          }
        }
        // 新しいfingering objに決定弦のフレットを指定
        const newFingering = new Array<number | undefined>(tuning.length).fill(undefined as any);
        newFingering[stringIndex] = tmpXList[0].board[stringIndex].indexOf(noteNum);
        flatShifted[i].fingering = newFingering;
      }

      // symを複製
      // 必要なものだけ複製し、共用できるものは参照のままにする。
      const ss2 = new Date().getTime();
      const addSym = conduct.notStyleCompile
        ? copySimpleCompileSymbols(originSymList[symOrderNum].sym)
        : copyCompileSymbols(originSymList[symOrderNum].sym);
      _s2 += (new Date().getTime() - ss2) / 1000;
      // シフト前
      addSym.decidedProp.trueTab = originSymList[symOrderNum].sym.decidedProp.trueTab
      // シフト後
      addSym.decidedProp.fingering = flatShifted[i].fingering!;
      // shift結果
      if (!addSym.decidedProp.shifted) { addSym.decidedProp.shifted = [] }
      addSym.decidedProp.shifted.push({ shift: fs.shift, options: fs.mapOpt });

      // 20241008追加
      addSym.decidedProp.styles.mapped?.forEach(f => {
        if (f.group === group) f.group = -2
      })

      // for next
      symOrderNum++;
      return addSym;
    });

    // 4: 元のsymを削除
    // その他symの影響ないよう末端から削除
    // # reverseは破壊的
    structuredClone(symCollector).reverse().forEach(sc => {
      symbolsList.splice(sc[0].index, sc.length);
    });

    // 6: symbolsListに複製を追加(末端からと思ったが区分毎だと直列にならないため開始位置から一気に入れて良い)
    symbolsList.splice(symCollector[0][0].index, 0, ...addSymList)

    return simpleSuccess();
  }

}

/**
 * Apply shift to each scale section
 * 
 * "コード"や"シフト無し単音"の場合シフト後のフィンガリングを決定
 * "シフトあり単音"はシフト後のノート番号
 * を作成
 * 
 * @param tmpX 
 * @param hereMaps 
 * @param symCollectList 
 * @returns 
 */
function buildShift(tmpX: TmpX, hereMaps: MapExpand[], symCollectList: SymCollect[]) {

  // 音数xシフト数の結果配列
  type ShiftedFullNote = {
    /** 単音の場合は最初にここにセット。後からフィンガリング決める */
    noteNum?: number,
    /** 複数音の場合はここにセット(単音でシフトがない場合もここ) */
    fingering?: NumberOrUfd[],
    /** シフト記録用 */
    shift: number,
    /** mappedOptions */
    mapOpt: MapOpt[]
  }
  const shiftedListByScale: ShiftedFullNote[][] = [];

  // shift毎に処理
  hereMaps.forEach(map => {

    const shifted: ShiftedFullNote[] = [];

    // option: stayString
    const optionStayOpenString = map.options.includes(MapOpt.sos);
    const optionStayString = map.options.includes(MapOpt.ss);
    const optionRev = map.options.includes(MapOpt.rev);

    tmpX.originList.forEach((ol, i) => {

      // 単音フィンガリングの場合（且つ、stay string ではない）
      if (
        !symCollectList[i].sym.decidedProp.extensionViewProp?.stepInfoId
        && !optionStayString
        && ol.originFretArr.length === 1
      ) {

        // open stay stringで解放弦 # 単音なので[0] ol.originFretArr[0]
        if (optionStayOpenString && ol.originFretArr[0] === 0) {
          shifted.push({ noteNum: undefined, fingering: structuredClone(symCollectList[i].sym.decidedProp.fingering), shift: map.shift, mapOpt: map.options })
        }
        // 単音処理
        else if (map.shift === 0) {
          // shift無し
          shifted.push({ noteNum: undefined, fingering: structuredClone(symCollectList[i].sym.decidedProp.fingering), shift: map.shift, mapOpt: map.options })
        }
        // shiftあり
        else {
          const shiftedNoteIndex = XArrayUtils.getReboundResolvedIndex(
            tmpX.activeInIndexes,
            tmpX.activeInIndexes.indexOf(ol.originNoteNumArr[0]) + map.shift
          );
          shifted.push({ noteNum: tmpX.activeInIndexes[shiftedNoteIndex], fingering: undefined, shift: map.shift, mapOpt: map.options });
        }

      } else {

        // 複数音処理
        if (map.shift === 0) {
          // shift無し
          shifted.push({ noteNum: undefined, fingering: structuredClone(symCollectList[i].sym.decidedProp.fingering), shift: map.shift, mapOpt: map.options })

        } else {
          // shiftあり
          const everyStringShiftedFrets = getEveryStringShiftedFrets(tmpX, i, map);
          const fingering = structuredClone(structuredClone(symCollectList[i].sym.decidedProp.fingering));
          everyStringShiftedFrets.forEach((fret, ii) => {
            // stay open string で解放弦の場合は移動しない
            if (!(optionStayOpenString && tmpX.originList[i].originFretArr[ii] === 0)) {
              fingering[tmpX.originList[i].originStringArr[ii]] = fret;
            }
          })
          shifted.push({ noteNum: undefined, fingering, shift: map.shift, mapOpt: map.options });
        }
      }
    });

    // rev について
    // - 現状のスタイルは元のままで音程のみrevするのも面白いが
    // - 付割がrevされないと、それはそれでつまらない

    shiftedListByScale.push(optionRev ? shifted.reverse() : shifted);
  });
  
  // シフト済み配列を返却
  return shiftedListByScale;
}

/** 複数弦のシフトを実施しフレット配列を返却 */
function getEveryStringShiftedFrets(
  tmpX: TmpX, ri: number, hereMap: MapExpand
) {
  const min = tmpX.seed.tuningPitches[tmpX.seed.tuningPitches.length - 1];

  return tmpX.originList[ri].originStringArr.map((sti, i) => {
    const start = tmpX.seed.tuningPitches[sti] - min;
    const end = start + SysSettings.maxTopFret;
    const rangeArr = XArrayUtils.createNumberBetweenArray(start, end);
    // inIndex配列
    const activeInIndexesByString = rangeArr.map(nn => {
      return tmpX.extendScaleFullArr[nn] !== undefined ? nn : undefined
    }).filter(f => f !== undefined);
    // シフトしたインデックス取得 #各弦0から始まる配列のインデックス
    const shiftedNoteIndexInRange = XArrayUtils.getReboundResolvedIndex(
      activeInIndexesByString,
      activeInIndexesByString.indexOf(tmpX.originList[ri].originNoteNumArr[i]) + hereMap.shift
    );
    // {rangeArr:未省略配列}.indexOf( {activeInIndexesByString:省略配列}[シフト済みインデックス] )
    return rangeArr.indexOf(activeInIndexesByString[shiftedNoteIndexInRange] as number)
  });
}

/**
 * CompileSymbolsを簡易的に複製する。
 * structuredCloneを使用すると、想定以上に処理速度が落ちるための対策である。
 * 
 * - stylesは参照で良い
 * - fingeringはディープコピー
 * - trueTabはディープコピー
 * - shiftedはディープコピー
 * 
 * @param sym 
 * @returns 
 */
function copySimpleCompileSymbols(sym: CompileSymbols): CompileSymbols {

  const addSym: CompileSymbols = {
    line: sym.line,
    linePos: sym.linePos,

    endLine: sym.endLine,
    endPos: sym.endPos,

    decidedProp: {
      noteStr: sym.decidedProp.noteStr,
      // extensionViewProp: sym.decidedProp.extensionViewProp,
      list: sym.decidedProp.list,
      tick: {
        tick: sym.decidedProp.tick.tick,
        untilNext: sym.decidedProp.tick.untilNext,
        // totalStartTick: sym.decidedProp.tick.totalStartTick
      }, // ディープコピー
      styles: {}, //structuredClone(sym.decidedProp.styles),
      // fingering: [...sym.decidedProp.fingering], // ディープコピー
      // trueTab: sym.decidedProp.trueTab ? [...sym.decidedProp.trueTab] : undefined, // ディープコピー
      // shifted: structuredClone(sym.decidedProp.shifted),
      shifted: sym.decidedProp.shifted?.map(m => {
        return {
          shift: m.shift,
          options: [...m.options]
        }
      }),
      // chordDicRef: sym.decidedProp.chordDicRef, // 参照で良い。書き換え無い
    },
    regionRegionForDualConnection: sym.regionRegionForDualConnection,
    locationInfoRefStackUpList: sym.locationInfoRefStackUpList
  } as CompileSymbols;

  if (sym.decidedProp.isArpeggio) {
    addSym.decidedProp.isArpeggio = true;
  }
  if (sym.decidedProp.isBullet) {
    addSym.decidedProp.isBullet = sym.decidedProp.isBullet;
  }

  const styles = {} as Styles;
  const org = sym.decidedProp.styles;
  Object.keys(org).forEach((key) => {
    // if (key === 'mapped') {
    //   styles[key as keyof Styles] = structuredClone(org[key as keyof Styles] as any);
    // } else {
    styles[key as keyof Styles] = org[key as keyof Styles] as any;
    // }
  })
  addSym.decidedProp.styles = styles;

  return addSym;
}

/**
 * CompileSymbolsを複製する。
 * structuredCloneを使用すると、想定以上に処理速度が落ちるための対策である。
 * 
 * - stylesは参照で良い
 * - fingeringはディープコピー
 * - trueTabはディープコピー
 * - shiftedはディープコピー
 * 
 * @param sym 
 * @returns 
 */
function copyCompileSymbols(sym: CompileSymbols): CompileSymbols {
  const addSym: CompileSymbols = {
    curlyLevel: sym.curlyLevel,
    type: sym.type,
    line: sym.line,
    linePos: sym.linePos,
    typesStyle: sym.typesStyle,
    endLine: sym.endLine,
    endPos: sym.endPos,
    token: sym.token,
    styles: sym.styles,
    linesOfStyle: sym.linePosOfStyle,
    linePosOfStyle: sym.linePosOfStyle,
    endOfMeasure: sym.endOfMeasure,
    decidedProp: {
      noteStr: sym.decidedProp.noteStr,
      extensionViewProp: sym.decidedProp.extensionViewProp,
      list: sym.decidedProp.list,
      tick: {
        tick: sym.decidedProp.tick.tick,
        untilNext: sym.decidedProp.tick.untilNext,
        // totalStartTick: sym.decidedProp.tick.totalStartTick
      }, // ディープコピー
      styles: {}, //structuredClone(sym.decidedProp.styles), // とりあえず参照で良い（ちょっとわからないので）
      fingering: [...sym.decidedProp.fingering], // ディープコピー
      trueTab: sym.decidedProp.trueTab ? [...sym.decidedProp.trueTab] : undefined, // ディープコピー
      // shifted: structuredClone(sym.decidedProp.shifted),
      shifted: sym.decidedProp.shifted?.map(m => {
        return {
          shift: m.shift,
          options: [...m.options]
        }
      }),
      chordDicRef: sym.decidedProp.chordDicRef, // 参照で良い。書き換え無い
    },
    regionRegionForDualConnection: sym.regionRegionForDualConnection,
    locationInfoRefStackUpList: sym.locationInfoRefStackUpList
  }
  if (sym.decidedProp.isArpeggio) {
    addSym.decidedProp.isArpeggio = true;
  }
  if (sym.decidedProp.isBullet) {
    addSym.decidedProp.isBullet = sym.decidedProp.isBullet;
  }

  const styles = {} as Styles;
  const org = sym.decidedProp.styles;
  Object.keys(org).forEach((key) => {
    // if (key === 'mapped') {
    //   styles[key as keyof Styles] = structuredClone(org[key as keyof Styles] as any);
    // } else {
    styles[key as keyof Styles] = org[key as keyof Styles] as any;
    // }
  })
  addSym.decidedProp.styles = styles;

  return addSym;
}