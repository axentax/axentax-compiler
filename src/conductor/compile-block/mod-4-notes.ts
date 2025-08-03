import { ModChord } from "../dictionary/mod-chord";
import { Region } from "../interface/region";
import { CSymbolType, CompileSymbols } from "../interface/compile";
import { Conduct } from "../interface/conduct";
import { E400, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import { ESInst } from "../interface/style";
import * as ModValidationForNotes from "../validation/mod-note-validation";
import { UnfoldMapped } from "./unfold-mapped/mapped";
import { SysSettings } from "../x-var";
import { TabObj, Tick } from "../interface/tab";
import { ModFlash_dual } from "./mod-7-flash";
import { ModTick_dual } from "./mod-8-tick";
import { UnfoldStepped } from "./unfold-stepped/stepped";
import { ExpandFingeringOptions } from "../chord-to-fingering/chord-to-fingering";
import * as XTickUtils from "../utils/x-tick-utils";

type Count = {
  tabObjId: number;
  tickAcrossBlock: number;
  fullNoteIndex: number;
  blockNoteIndex: number;
  noteTotalTickInRegion: number;
}

export class ModNote {

  static resolve(conduct: Conduct, symbolsDualLists: CompileSymbols[][]): SimpleResult {

    // ループステップ 1
    for (let dualId = 0; dualId < symbolsDualLists.length; dualId++) {
      const symbolsList = symbolsDualLists[dualId];

      // フィンガリング解決
      const resCore = resolveChordWithFingering(conduct, dualId, symbolsDualLists);
      if (resCore.fail()) return resCore;

      // ステップ解決（フィンガリング解決後に実行）
      const newSymbolsList = UnfoldStepped.apply(conduct, dualId, symbolsList);
      if (newSymbolsList.fail()) return newSymbolsList;

      // マップ解決（MIDIデータ作成時のみ）
      if (!conduct.notStyleCompile || conduct.settings.compile.mappingResolved) { // !conduct.isSimpleValidOnly && 
        const resMap = UnfoldMapped.apply(conduct, dualId, symbolsList);
        if (resMap.fail()) return resMap;
      }
    }

    // フラッシュクリック展開にはnoteIndexが必要（step, map解決後）

    // regionのtickは未決定の段階

    // ループステップ 2
    // --
    for (let dualId = 0; dualId < SysSettings.dualLength; dualId++) {
      const symbolsList = symbolsDualLists[dualId];
      // if (1) {
      const res = evolveFlatTOList_v2(conduct, dualId, symbolsList);
      if (res.fail()) return res;
      // } else {
      //   const res = evolveFlatTOList_v1(conduct, dualId, symbolsList);
      //   if (res.fail()) return res;
      // }
    }

    // --
    // -- loop step 3
    // --
    // if (1) { // evolveFlatTOList_v2の場合のみ
    const resOffsetResolver = regionTickResolver(conduct);
    if (resOffsetResolver.fail()) return resOffsetResolver;
    // }

    // conduct.mixesList.forEach((mixes, dualId) => {
    //   console.log('#-----, dualId', dualId)
    //   mixes.regionList.forEach((rg, rgi) => {
    //     console.log('rgi', rgi, [rg.startLayerTick, rg.endLayerTick, `(trueEnd: ${rg.trueEndLayerTick})`], "used:", rg.usedTotalTick, "offset:", rg.offsetTickWidth, 'deactive', rg.deactive)
    //   })
    // });

    // --
    // -- loop step 4
    // --
    for (let dualId = 0; dualId < SysSettings.dualLength; dualId++) {
      // -----
      // ノート毎のtick決定と付随処理
      // -----
      const resTick = ModTick_dual.resolve(conduct, dualId);
      if (resTick.fail()) return resTick;

      // -----
      // 現状 BPMとturnのgroup解決と、fillNoteIndexWithTickの作成処理
      // -----
      resolveForEachTabObj(conduct, dualId);
    }

    // conduct.mixesList.forEach((mixes, dualId) => {
    //   console.log('#-----, dualId', dualId)
    //   mixes.flatTOList.forEach(to => {
    //     console.log(easyX(to.tab), to.bar.tick, to.bar.startTick, to.bar.stopTick)
    //   })
    // });

    return simpleSuccess();
  }
}

/**
 * 各region の tick をindex毎の最大長の regionに揃える
 * @param conduct 
 * @returns 
 */
function regionTickResolver(conduct: Conduct): SimpleResult {
  const regionListLength = conduct.mixesList[0].regionList.length; // regionList.lengthはdual共通

  // "region"から順に処理
  for (let ri = 0; ri < regionListLength; ri++) {
    // まだ startTickも 決定していない..が、逐次 設定するため。決定しているものとして処理していく

    // 1. @offset適用
    for (let dualId = 0; dualId < SysSettings.dualLength; dualId++) {
      const region = conduct.mixesList[dualId].regionList[ri];

      // composeのSolo開始位置把握に使用する
      region.trueStartLayerTick = region.startLayerTick;

      // offsetの適用
      if (region.offsetTickWidth) {
        // 適用する
        region.startLayerTick -= region.offsetTickWidth;
        region.endLayerTick -= region.offsetTickWidth;

        if (region.startLayerTick < 0) {
          if (region.flashOffsetLocation) {
            return new E400(region.flashOffsetLocation.line, region.flashOffsetLocation.linePos, region.flashOffsetLocation.token,
              `${region.flashOffsetLocation.token} exceeds previous limit. Create a region with only rests at the start.`);
          } else {
            /* istanbul ignore next */
            throw 'system error over offset'
          }
        }
      }
    }

    // [2]一番大きいendTick
    const maxEndTick = Math.max(...conduct.mixesList.map(m => m.regionList[ri].endLayerTick))

    if (regionListLength - 1 !== ri) {

      // view用
      conduct.mixesList[0].regionList[ri].endLayerTick = maxEndTick;

      // 全てのdualに適用
      for (let dualId = 0; dualId < SysSettings.dualLength; dualId++) {

        // 次のregionに対しての後方シフト処理
        const nextRegion = conduct.mixesList[dualId].regionList[ri + 1];

        // ↓dual:0 で startLayerTick = -1 すると動作しなくなる
        // if (nextRegion.startLayerTick === nextRegion.endLayerTick) {
        //   // データの可読性の為
        //   nextRegion.startLayerTick = -1;
        //   nextRegion.endLayerTick = -1;
        // }
        
        if (
          nextRegion.startLayerTick === -1
          || nextRegion.startLayerTick == nextRegion.endLayerTick
          // || nextRegion.usedTotalTick === nextRegion.offsetTickWidth // mod-8-tick側で検知させる
        ) {
          nextRegion.deactive = true;// ここでnoteがないことを明示。下のifを無くして、dualもregionの切れ目で音を切れるようにする。region跨ぎcontinue関連対応
          // console.log('set deactive, dual', dualId, 'region', ri, nextRegion.startLayerTick, nextRegion.endLayerTick)
        }

        // if (nextRegion.startLayerTick !== -1) { // このifを無くして、dualもregionの切れ目で音を切れるようにする。region跨ぎcontinue関連対応
        // [3]次のregionの位置を開始位置を[2]に、終了位置は開始位置の移動分スライド
        const ownDiff = maxEndTick - nextRegion.startLayerTick;
        nextRegion.startLayerTick = maxEndTick;
        nextRegion.endLayerTick += ownDiff;
      }
    }


  }

  // conduct.mixesList.forEach((mixes, dualId) => {
  //   // console.log('dual', dualId, 'regionList', mixes.regionList)
  //   mixes.regionList.forEach(rg => console.log(dualId, rg.id, rg.deactive))
  // })

  return simpleSuccess();
}

/**
 * TabObjを作成し、regionのtickを暫定決定する
 */
function evolveFlatTOList_v2(conduct: Conduct, dualId: number, symbolsList: CompileSymbols[]): SimpleResult {
  let hasNextContinueX = false;
  let hasBeforeSlideContinue = false;

  const count: Count = {
    tabObjId: 0,
    tickAcrossBlock: SysSettings.startTick, // dual:0 のみが使用する開始位置
    fullNoteIndex: 0,
    blockNoteIndex: 0,
    noteTotalTickInRegion: 0
  };

  const mixes = conduct.mixesList[dualId];

  // let lastSetEndLayerTick = SysSettings.startTick; $$

  for (let si = 0; si < symbolsList.length; si++) {
    const sym = symbolsList[si];

    // ===
    // start region
    // ===
    if (sym.type === CSymbolType.regionStart) { // dualId:1以上は、noteが無い場合、symも無い

      if (dualId === 0) {
        if (mixes.regionList[sym.regionRegionForDualConnection].startLayerTick === -1) {
          mixes.regionList[sym.regionRegionForDualConnection].startLayerTick = count.tickAcrossBlock;
          // mixes.regionList[sym.regionRegionForDualConnection].trueStartLayerTick = count.tickAcrossBlock;
        }
      }
      else {
        // dualId > 0 の場合は、regionの開始位置を baseBlock からコビー
        count.tickAcrossBlock = conduct.mixesList[0].regionList[sym.regionRegionForDualConnection].startLayerTick; //mixes.regionList[0].startLayerTick

        // $$
        // %% dualId != 0 の場合、始まりがregion1とは限らない
        // %% dualId != 0 の場合、ブロックが飛んだり、空ブロックがあっても count.tickAcrossBlock は飛ぶ
        // mixes.regionList[sym.regionIndexForDual].startLayerTick = mixes.regionList[0].startLayerTick;
        // mixes.regionList[sym.regionIndexForDual].trueStartLayerTick = mixes.regionList[0].trueStartLayerTick;
        mixes.regionList[sym.regionRegionForDualConnection].startLayerTick = count.tickAcrossBlock;
        // mixes.regionList[sym.regionRegionForDualConnection].trueStartLayerTick = count.tickAcrossBlock;
      }

      // 20240912 上記から外だし
      mixes.regionList[sym.regionRegionForDualConnection].start = {
        line: sym.line,
        linePos: sym.linePos
      };

      // dualId:1 にも "noteがあれば" CSymbolType.regionStart があるので辛うじて更新される
      // 但し、dualId:1の場合で、noteが無いのに、何か>>以外のflash指定していればバグるかも
      // → 現状、blockNoteIndexを使用しているのは clickだけだが
      //   flashは今後も blockNoteIndex 頼りになる可能性高いので対応しておきたい。
      count.blockNoteIndex = 0;

      continue;
    }

    // ---
    // @offset resolve
    // ---
    if (sym.type === CSymbolType.flash) {

      // console.log('sym.token', sym.token)
      if (sym.token === '@offset') {
        
        // @offsetの出現段階で@offset値を記録
        //
        // ↓↓↓↓↓↓↓↓↓↓ 手前のregionで処理がない場合、-1 からの差分を入れてしまっている
        //
        // const diff = count.tickAcrossBlock - lastSetEndLayerTick;
        // const diff = lastSetEndLayerTick - mixes.regionList[sym.regionRegionForDualConnection].startLayerTick;
        
        const diff = count.noteTotalTickInRegion;
        mixes.regionList[sym.regionRegionForDualConnection].offsetTickWidth = diff;
        mixes.regionList[sym.regionRegionForDualConnection].flashOffsetLocation = {
          line: sym.line,
          linePos: sym.linePos,
          token: sym.token
        }
        // // offsetの過剰適用
        // if (mixes.regionList[sym.regionIndexForDual].startLayerTick < 0) {
        //   return new E400(sym.line, sym.linePos, sym.token,
        //     `${sym.token} exceeds previous limit. Create a region with only rests at the start.`
        //   )
        // }

      } else {

        // ↓ そもそもここでflash適用しているから問題なのかも
        // ↓ Click[]とsettingsとregionIndexを使用
        const resBlancher = ModFlash_dual.resolve(
          conduct,
          dualId,
          sym.regionRegionForDualConnection,
          count.fullNoteIndex,
          count.blockNoteIndex,
          sym);
        if (resBlancher.fail()) return resBlancher;

      }

    }
    
    // ---
    // TabObj作成
    // barは、"""tabObj.bar.tick（note自体の長さ）のみ代入"""
    // ---
    else if (sym.decidedProp) {
      // continueX
      // console.log('sym>>', sym)
      const continueX = hasNextContinueX || sym.decidedProp.styles.strum ? false : {
        [ESInst.normal]: sym.decidedProp.styles.continue ? true : false,
        [ESInst.mute]: false,
        [ESInst.muteContinue]: true,
        [ESInst.rest]: false,
        [ESInst.restNoise]: false,
        [ESInst.brushing_d]: false,
        [ESInst.brushing_D]: false,
        [ESInst.brushing_u]: false,
        [ESInst.brushing_U]: false,
        [ESInst.strum]: false,
        [ESInst.normalUnContinueForStep]: false,
        [undefined as any]: sym.decidedProp.styles.continue ? true : false // degree & chordSym
      }[sym.decidedProp.styles.inst as ESInst]

      // In case of release, the next note will be "continueX".
      // Measures to prevent the slide position from shifting to the second half
      hasNextContinueX = sym.decidedProp.styles.slide?.type !== 'release' ? false : true;

      // stroke is not possible after slide.continue
      // # This adjustment is limited to cases where both styles are specified.
      if (hasBeforeSlideContinue && sym.decidedProp.styles.stroke) sym.decidedProp.styles.stroke = undefined;
      hasBeforeSlideContinue = sym.decidedProp.styles.slide?.continue ? true : false;

      // create tabObjList
      // ↓ ## flatTabObjとsettingsを使用
      // memo: countオブジェクトを渡して、createAndAddTabObjで""" count.tickAcrossBlock += bar.tick; """ されている
      //       但し、tabObj.barが決定しているのは、createAndAddTabObjでは tabObj.bar.tick（note自体の長さ）のみ
      createAndAddTabObj(conduct, dualId, conduct.mixesList[dualId].regionList[sym.regionRegionForDualConnection], sym, continueX, count);
    }

    // ---
    // # region終了
    // ---
    if (sym.type === CSymbolType.closingCurlyBrace && sym.curlyLevel === 1) {

      // if (11111 || dualId === 0) { // $$
      // if (count.noteTotalTickInRegion) {

        // 
        mixes.regionList[sym.regionRegionForDualConnection].endLayerTick = count.tickAcrossBlock;
        // mixes.regionList[sym.regionRegionForDualConnection].trueEndLayerTick = count.tickAcrossBlock;
        // lastSetEndLayerTick = count.tickAcrossBlock; $$

        mixes.regionList[sym.regionRegionForDualConnection].usedTotalTick = count.noteTotalTickInRegion;
      // }

      count.noteTotalTickInRegion = 0;

      // ---
      // --- dual0 の幅を超えてしまう場合の対応 ---
      // ---
      // if (0 && dualId > 0) {
        
      //   const baseRegion = conduct.mixesList[0].regionList[sym.regionRegionForDualConnection];
      //   const ownRegion = mixes.regionList[sym.regionRegionForDualConnection];

      //   // baseブロックよりnoteのトータルTickが大きくなった場合（比較するのはregion自体の大きさではない）
      //   let overTick = ownRegion.usedTotalTick - baseRegion.usedTotalTick;

      //   // dual1で同じシフト済みである場合の対応
      //   // 将来dualが増えた場合、これだとバグるので早めに対応必要（現状dualLengthは3）
      //   if (dualId === 2) {
      //     const dual1Region = conduct.mixesList[1].regionList[sym.regionRegionForDualConnection];
      //     if (baseRegion.usedTotalTick < dual1Region.usedTotalTick) {
      //       overTick= ownRegion.usedTotalTick - dual1Region.usedTotalTick;
      //     }
      //   } 

      //   // ↓ dual1,2両方超えた場合、2回シフトされてしまう
      //   if (overTick > 0) {
      //     // console.log('over>>', overTick);
      //     // ---
      //     // """自身の"""、"""以降のregion"""はここでは、まだ未設定
      //     //（開始終了tickが -1 でregionオブジェクトの存在自体はある）
      //     // ---

      //     // baseBlockと比較して、""" region幅が延びた分 """
      //     // """ 自分より若いdual全てに対し """
      //     // """ 当該regionインデックス以降のregionの位置を全てスライド """"

      //     // 自身以外
      //     for (let dId = 0; dId < dualId; dId++) {
      //       if (conduct.mixesList[0].regionList[sym.regionRegionForDualConnection].endLayerTick !== -1) {
      //       conduct.mixesList[0].regionList[sym.regionRegionForDualConnection].endLayerTick += overTick;
      //       conduct.mixesList[0].regionList[sym.regionRegionForDualConnection].trueEndLayerTick += overTick;
      //       }
      //     }

      //     // 自身以外
      //     if (conduct.mixesList[0].regionList.length - 1 > sym.regionRegionForDualConnection) {
      //       for (let dId = 0; dId < dualId; dId++) {
      //         for (let ri = sym.regionRegionForDualConnection + 1; ri < conduct.mixesList[0].regionList.length; ri++) {
      //           if (conduct.mixesList[dId].regionList[ri].startLayerTick !== -1) {
      //             conduct.mixesList[dId].regionList[ri].startLayerTick += overTick;
      //             conduct.mixesList[dId].regionList[ri].trueStartLayerTick += overTick;
      //           }
      //           if (conduct.mixesList[dId].regionList[ri].endLayerTick !== -1) {
      //             conduct.mixesList[dId].regionList[ri].endLayerTick += overTick;
      //             conduct.mixesList[dId].regionList[ri].trueEndLayerTick += overTick;
      //           }
      //         }
      //       }
      //     }
      //   }

      // }

      // 20240912 region内の全てのdualの終点から、dual毎の終点に変更
      conduct.mixesList[dualId].regionList[sym.regionRegionForDualConnection].end = {
        line: sym.endLine, //sym.line,
        linePos: sym.endPos // sym.linePos
      };

    }
  }

  // dualId > 0 の場合（ベースブロックでは無い場合）、base block から 始点終点コピー
  // ブロック自体の始点終点は、dualIdに基本的(@offset考えない場合)には関係ないため

  // $$
  // if (dualId > 0) {
  //   conduct.mixesList[0].regionList.forEach((bb, bi) => {
  //     mixes.regionList[bi].startLayerTick = bb.trueStartLayerTick;
  //     mixes.regionList[bi].endLayerTick = bb.trueEndLayerTick;
  //   })
  // }

  // console.log('>>$---evolveFlatTOList, dualId:', dualId)
  // mixes.regionList.forEach((rg, rgi) => {
  //   console.log('rgi', rgi, {
  //     tick: [rg.startLayerTick, rg.endLayerTick]
  //   })
  // })

  return simpleSuccess();
}

// /**
//  * 
//  */
// function evolveFlatTOList_v1(conduct: Conduct, dualId: number, symbolsList: CompileSymbols[]): SimpleResult {
//   let hasNextContinueX = false;
//   let hasBeforeSlideContinue = false;

//   const count: Count = {
//     tabObjId: 0,
//     tickAcrossBlock: SysSettings.startTick,
//     fullNoteIndex: 0,
//     blockNoteIndex: 0,

//     noteTotalTickInRegion: 0
//   };

//   const mixes = conduct.mixesList[dualId];

//   let lastSetEndLayerTick = SysSettings.startTick;

//   // each block
//   // let block: Block = {} as Block;
//   for (let si = 0; si < symbolsList.length; si++) {
//     const sym = symbolsList[si];

//     if (sym.type === CSymbolType.regionStart) { // dualId:1以上は、noteが無い場合、symも無い

//       if (dualId === 0) {
//         mixes.regionList[sym.regionRegionForDualConnection].startLayerTick = count.tickAcrossBlock;
//         // mixes.regionList[sym.regionRegionForDualConnection].trueStartLayerTick = count.tickAcrossBlock;
//       }

//       // 20240912 上記から外だし
//       mixes.regionList[sym.regionRegionForDualConnection].start = {
//         line: sym.line,
//         linePos: sym.linePos
//       };

//       // dualId:1 にも "noteがあれば" CSymbolType.regionStart があるので辛うじて更新される
//       // 但し、dualId:1の場合で、noteが無いのに、何か>>以外のflash指定していればバグるかも
//       // → 現状、blockNoteIndexを使用しているのは clickだけだが
//       //   flashは今後も blockNoteIndex 頼りになる可能性高いので対応しておきたい。
//       count.blockNoteIndex = 0;

//       continue;
//     }

//     //
//     // @offset resolver
//     //
//     if (sym.type === CSymbolType.flash) {

//       // console.log('sym.token', sym.token)
//       if ((sym.token === '@offset') && dualId === 0) {
//         const diff = count.tickAcrossBlock - lastSetEndLayerTick;
//         count.tickAcrossBlock = lastSetEndLayerTick;
//         mixes.regionList[sym.regionRegionForDualConnection].startLayerTick -= diff;

//         // offsetの過剰適用
//         if (mixes.regionList[sym.regionRegionForDualConnection].startLayerTick < 0) {
//           return new E400(sym.line,sym.linePos, sym.token,
//             `${sym.token} exceeds previous limit. Create a region with only rests at the start.`
//           )
//         }

//       } else {

//         // ↓ そもそもここでflash適用しているから問題なのかも
//         // ↓ Click[]とsettingsとregionIndexを使用
//         const resBlancher = ModFlash_dual.resolve(
//           conduct,
//           dualId,
//           sym.regionRegionForDualConnection,
//           count.fullNoteIndex,
//           count.blockNoteIndex,
//           sym);
//         if (resBlancher.fail()) return resBlancher;

//       }

//     } else if (sym.decidedProp) {
//       // continueX
//       // console.log('sym>>', sym)
//       const continueX = hasNextContinueX || sym.decidedProp.styles.strum ? false : {
//         [ESInst.normal]: sym.decidedProp.styles.continue ? true : false,
//         [ESInst.mute]: false,
//         [ESInst.muteContinue]: true,
//         [ESInst.rest]: false,
//         [ESInst.restNoise]: false,
//         [ESInst.brushing_d]: false,
//         [ESInst.brushing_D]: false,
//         [ESInst.brushing_u]: false,
//         [ESInst.brushing_U]: false,
//         [ESInst.normalUnContinueForStep]: false,
//         [undefined as any]: sym.decidedProp.styles.continue ? true : false // degree & chordSym
//       }[sym.decidedProp.styles.inst as ESInst]

//       // In case of release, the next note will be "continueX".
//       // Measures to prevent the slide position from shifting to the second half
//       hasNextContinueX = sym.decidedProp.styles.slide?.type !== 'release' ? false : true;

//       // stroke is not possible after slide.continue
//       // # This adjustment is limited to cases where both styles are specified.
//       if (hasBeforeSlideContinue && sym.decidedProp.styles.stroke) sym.decidedProp.styles.stroke = undefined;
//       hasBeforeSlideContinue = sym.decidedProp.styles.slide?.continue ? true : false;

//       // create tabObjList
//       // ↓ ## flatTabObjとsettingsを使用
//       // memo: countオブジェクトを渡して、createAndAddTabObjで""" count.tickAcrossBlock += bar.tick; """ されている
//       createAndAddTabObj(conduct, dualId, conduct.mixesList[dualId].regionList[sym.regionRegionForDualConnection], sym, continueX, count);
//     }

//     // set block end tick
//     if (sym.type === CSymbolType.closingCurlyBrace && sym.curlyLevel === 1) {

//       if (dualId === 0) {
//         mixes.regionList[sym.regionRegionForDualConnection].endLayerTick = count.tickAcrossBlock;
//         // mixes.regionList[sym.regionRegionForDualConnection].trueEndLayerTick = count.tickAcrossBlock;
//         lastSetEndLayerTick = count.tickAcrossBlock;
//       }

//       // 20240912 region内の全てのdualの終点から、dual毎の終点に変更
//       conduct.mixesList[dualId].regionList[sym.regionRegionForDualConnection].end = {
//         line: sym.endLine, //sym.line,
//         linePos: sym.endPos // sym.linePos
//       };

//     }
//   }

//   // dualId > 0 の場合（ベースブロックでは無い場合）、base block から 始点終点コピー
//   // ブロック自体の始点終点は、dualIdに基本的(@offset考えない場合)には関係ないため
//   // if (dualId > 0) {
//   //   conduct.mixesList[0].regionList.forEach((bb, bi) => {
//   //     mixes.regionList[bi].startLayerTick = bb.trueStartLayerTick;
//   //     mixes.regionList[bi].endLayerTick = bb.trueEndLayerTick;
//   //   })
//   // }

//   return simpleSuccess();
// }

/**
 * resolve style group
 * bpm, turn のグループ解決 && conduct.mixesList[dualId].marks.fullNoteIndexWithTick の解決
 * 
 * 20241013:memo
 *   ここでは、tabObj.bar.startTick は既に持っているっぽい
 */
function resolveForEachTabObj(conduct: Conduct, dualId: number) {
  const { flatTOList } = conduct.mixesList[dualId];

  const foundGroups: { [keys: number]: boolean } = {};
  const groupStopTick: { [keys: number]: number } = {};

  // last stopTick
  const fillNoteIndexWithTick: number[] = [flatTOList.length ? flatTOList[flatTOList.length - 1].bar.stopTick : SysSettings.startTick];
  // let lastTick = flatTOList.length ? flatTOList[flatTOList.length - 1] : SysSettings.startTick;

  // each

  // reverse loop of tabObjs
  for (let oi = flatTOList.length - 1; oi >= 0; oi--) {
    const tabObj = flatTOList[oi];

    // conduct.marks.noteIndexWithTick
    fillNoteIndexWithTick.unshift(tabObj.bar.startTick);

    // Set "final" mark to the first group found

    // bpm is required resolve here
    if (tabObj.styles.bpm && tabObj.styles.bpm.group > 0) {
      if (!foundGroups[tabObj.styles.bpm.group]) {
        foundGroups[tabObj.styles.bpm.group] = true;
        // 20241116 stopではなくstartつまりnoteの頭に変えてみる
        // groupStopTick[tabObj.styles.bpm.group] = tabObj.bar.stopTick;
        groupStopTick[tabObj.styles.bpm.group] = tabObj.bar.startTick;
      }
      tabObj.styles.bpm.groupEndTick = groupStopTick[tabObj.styles.bpm.group];
    }
    // under consideration
    // if (tabObj.style.bend) {
    //   //   if (!foundGroups[tabObj.style.bend.group]) {
    //   //     foundGroups[tabObj.style.bend.group] = true;
    //   //     groupStopTick[tabObj.style.bend.group] = tabObj.bar.stopTick;
    //   //   }
    //   //   tabObj.style.bend.groupEndTick = groupStopTick[tabObj.style.bend.group];
    //   tabObj.style.bend.forEach(bend => {
    //     if (bend.group > 0 && !foundGroups[bend.group]) {
    //       foundGroups[bend.group] = true;
    //       bend.groupFinal = true;
    //     }
    //   })
    // }
    // under consideration
    if (tabObj.styles.turn && tabObj.styles.turn.group > 0 && !foundGroups[tabObj.styles.turn.group]) {
      foundGroups[tabObj.styles.turn.group] = true;
      tabObj.styles.turn.groupFinal = true;
    }
  }

  // console.log("noteIndexWithTick>>", noteIndexWithTick)
  conduct.mixesList[dualId].marks.fullNoteIndexWithTick = fillNoteIndexWithTick;
}

/**
 * create tab object
 */
function createAndAddTabObj(conduct: Conduct, dualId: number, region: Region, sym: CompileSymbols, continueX: boolean, count: Count) {

  const settings = conduct.settings;
  const tuning = region.tuning;
  // const length = block.notes.list.length;

  // velocities
  const velocities = settings.play.velocities.slice(0, tuning.length);

  const velocityCoefficient = sym.decidedProp.styles.velocity; // note.style[ni].velocity;
  if (velocityCoefficient) {
    velocities.forEach((_, i) => velocities[i] *= velocityCoefficient / 100);
  }
  const velocityPerBows = sym.decidedProp.styles.velocityPerBows; // note.style[ni].velocityPerBows;
  if (velocityPerBows) {
    velocities.forEach((_, i) => {
      if (velocityPerBows[i] !== undefined) {
        velocities[i] *= velocityPerBows[i]! / 100;
      }
    });
  }

  // tick
  const bar: Tick = {
    tick: XTickUtils.untilNextToTick(sym.decidedProp.tick.untilNext),
    fretStartTicks: Array(tuning.length).fill(undefined),
    fretStopTicks: Array(tuning.length).fill(undefined),
    startTick: undefined as any,
    stopTick: undefined as any
  };

  // push to tabObj
  const tabObj: TabObj = {
    noteStr: sym.decidedProp.noteStr,
    extendInfo: sym.decidedProp.extensionViewProp,
    syntaxLocation: {
      row: '',
      line: sym.line,
      linePos: sym.linePos,
      endLine: sym.endLine,
      endPos: sym.endPos
    },
    tabObjId: count.tabObjId++,
    regionIndex: sym.regionRegionForDualConnection,
    regionNoteIndex: count.blockNoteIndex,
    note: sym.decidedProp.list,
    tab: sym.decidedProp.fingering,
    trueTab: sym.decidedProp.trueTab,
    shifted: sym.decidedProp.shifted,
    velocity: velocities.map((vs, i) => sym.decidedProp.fingering[i] !== undefined ? vs : undefined),
    continueX,
    styles: sym.decidedProp.styles,
    bar: bar,
    bpm: -1,
    isArpeggio: sym.decidedProp.isArpeggio ? true : false,
    isBullet: sym.decidedProp.isBullet || 0,
    refMovedSlideTarget: [],
    activeBows: [],
    refActiveBows: [],
    slideLandingTab: [],
    prevTabObj: undefined as any,
    nextTabObj: undefined as any,
    // endPitchMaintained: 0
    // mappedShift: sym.decidedProp.mappedShift

    locationIndexes: sym.locationInfoRefStackUpList,

    untilNext: sym.decidedProp.tick.untilNext,
  };

  // isRest
  if (sym.decidedProp.styles.inst === ESInst.rest || sym.decidedProp.styles.inst === ESInst.restNoise) {
    tabObj.isRest = true;
  }

  // push
  conduct.mixesList[dualId].flatTOList.push(tabObj);

  // count
  count.fullNoteIndex++;
  count.blockNoteIndex++;

  // progress tick
  count.tickAcrossBlock += bar.tick;
  count.noteTotalTickInRegion += bar.tick;
}

/**
 * sym.decidedProp final resolution
 */
function resolveChordWithFingering(conduct: Conduct, dualId: number, symbolsDualLists: CompileSymbols[][]): SimpleResult {

  // ここでは、fingeringを解決し、コードディクショナリを作成しているだけ。mixes以外でconductに入れるのはdicのみ。
  // あとは sym.decidedProp の一部を完成させている。
  // なので処理単純。=> dualなループは外でもつ

  const mixes = conduct.mixesList[dualId];
  const symbolsDualListsLength = symbolsDualLists[dualId].length;
  for (let si = 0; si < symbolsDualListsLength; si++) {

    const sym = symbolsDualLists[dualId][si];

    switch (sym.type) {

      case (CSymbolType.degreeName): {
        const tuning = mixes.regionList[sym.regionRegionForDualConnection].tuning;

        // hierarchy resolved
        const degree = sym.decidedProp.styles.degree || conduct.settings.style.degree;

        const resDegree = ModValidationForNotes.degreeSymbol(degree, sym.token, sym.line, sym.linePos);
        if (resDegree.fail()) return resDegree;

        {

          const options: ExpandFingeringOptions = {
            sortByPosition: 'low',
            // notRequiredPerfectFifth: true,
            // wideUseOpenString: true,
            useHighestTensionPossible: true
          };
          if (sym.decidedProp.styles.step?.parsedStep) {
            options.requiredStrings = [...sym.decidedProp.styles.step?.parsedStep.reduce<Set<number>>((acc, item) => {
              if (item.stringIndexes) item.stringIndexes.forEach(index => acc.add(index + 1));
              return acc;
            }, new Set())];
          }

          // search chord
          const dic = ModChord.create(conduct.dic.chord, tuning, sym.line, sym.linePos, resDegree.res, options);
          if (dic.fail()) return dic;
          sym.decidedProp.chordDicRef = dic.res;
          sym.decidedProp.list = dic.res.symbol;

          sym.decidedProp.fingering = dic.res.fingerings[0].tab
          sym.decidedProp.trueTab = dic.res.fingerings[0].tab
        }

        // console.log("# degree sym.token:", sym.token, sym.decidedProp.fingering);
        break;
      }

      case (CSymbolType.note): {
        const tuning = mixes.regionList[sym.regionRegionForDualConnection].tuning;

        if (!/\|/.test(sym.token)) {
          // chord symbol case
          const validChordSymbol = ModValidationForNotes.chordSymbol(sym.token, sym.decidedProp.noteStr, sym.line, sym.linePos);
          if (validChordSymbol.fail()) return validChordSymbol;

          if (sym.token === 'r') {
            // rest case
            sym.decidedProp.fingering = Array(tuning.length).fill(undefined);
            sym.decidedProp.list = sym.token;
            if (sym.decidedProp.styles.inst !== ESInst.restNoise) {
              sym.decidedProp.styles.inst = ESInst.rest;
            }

          } else {

            const options: ExpandFingeringOptions = {
              sortByPosition: 'low',
              useHighestTensionPossible: true
            };
            if (sym.decidedProp.styles.step?.parsedStep) {
              options.requiredStrings = [...sym.decidedProp.styles.step?.parsedStep.reduce<Set<number>>((acc, item) => {
                if (item.stringIndexes) item.stringIndexes.forEach(index => acc.add(index + 1));
                return acc;
              }, new Set())];
            }

            // chord search
            const dic = ModChord.create(conduct.dic.chord, tuning, sym.line, sym.linePos, sym.token, options);
            if (dic.fail()) return dic;
            sym.decidedProp.chordDicRef = dic.res;
            sym.decidedProp.list = dic.res.symbol;

            sym.decidedProp.fingering = dic.res.fingerings[0].tab
            sym.decidedProp.trueTab = dic.res.fingerings[0].tab
          }
          // console.log("# note sym.token:", sym.token, sym.decidedProp.fingering);

        } else {
          sym.decidedProp.list = sym.token;

          // tab symbol case
          const validTabSymbol = ModValidationForNotes.tabSymbol(tuning, sym.token, sym.line, sym.linePos + (sym.prefixLength || 0));
          if (validTabSymbol.fail()) return validTabSymbol;
          sym.decidedProp.fingering = validTabSymbol.res;
          sym.decidedProp.trueTab = validTabSymbol.res;
        }
        break;
      }
      default: {
        continue;
      }
    }
    // console.log("sym.token>>", sym.decidedProp.fingering)
  }

  return simpleSuccess();
}
