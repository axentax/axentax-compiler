// import {
//   findGuitarChord, // plan to replace     "chord-fingering": "^1.0.2",
//   // findPositions
// } from 'chord-fingering';
// import { Chord as tonal } from "tonal";
import { E404, ErrorBase, IResult, Success } from '../interface/utils.response.interface';
import { ChordDicMap, ChordProp } from "../interface/dic-chord";
import { IKey } from "../interface/utils.interface";
import { globalVars } from "../x-var";
import * as XUtils from "../utils/x-utils";
import { ChordToFingering, ExpandFingeringOptions } from '../chord-to-fingering/chord-to-fingering';


/**
 * ModChordクラス
 * 
 * ギターコードのフィンガリング辞書生成・検索・キャッシュ・エラー処理などを担うユーティリティクラス。
 * コード名やタブ譜指定から、最適なフィンガリングや音名配列を自動生成し、キャッシュする。
 * 
 * - create(): コード辞書の自動生成・キャッシュ・エラー処理のメインメソッド
 * - search(), inversion(), resolveToTab(), resolveFromTab() などは未使用・未実装（将来拡張用）
 * 
 * 注意: tab指定やUI即時変更対応、tab検索の正規化などは将来的な拡張予定
 */
export class ModChord {

  /**
   * コード辞書の自動生成・キャッシュ・エラー処理
   * 
   * コード名やタブ譜指定から、最適なフィンガリングや音名配列を自動生成し、キャッシュする。
   * 既にキャッシュ済みの場合はキャッシュを返す。
   * 休符（'r'）の場合は特別なChordPropを返す。
   * フィンガリングが見つからない場合はエラーを返す。
   * 
   * @param chordSet コード辞書マップ
   * @param tuning チューニング配列
   * @param line 行番号（エラー用）
   * @param linePos 行内位置（エラー用）
   * @param chordSym コードシンボル（例：C、Am7、|2|3||-1| など）
   * @param options フィンガリング展開オプション
   * @returns IResult<ChordProp, ErrorBase>（成功時はChordProp、失敗時はエラー情報）
   */
  static create(
    chordSet: ChordDicMap,
    tuning: IKey[],
    line: number,
    linePos: number,
    chordSym: string,
    options: ExpandFingeringOptions
  ): IResult<ChordProp, ErrorBase> {
    const searchKey = `${tuning.join('')}:${chordSym}:${JSON.stringify(options)}`;

    const cache = chordSet.get(searchKey);
    if (cache) {
      return new Success(cache);
    }

    /* istanbul ignore next: 現状分岐するケースが見当たらない */
    if (chordSym === 'r') {
      // 休符の場合の特別処理
      return new Success({
        symbol: 'r',
        intervals: [],
        notes: [] as IKey[],
        // optionalNotes: [] as IKey[],
        // requiredNotes: [] as IKey[],
        tonic: {
          iKeyId: 0,
          sym: '' as any
        },
        bass: {
          iKeyId: 0,
          sym: '' as any
        },
        fingerings: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

    }
 
    const guitarChordProps = ChordToFingering.search(chordSym, tuning, options)

    if (!guitarChordProps) {
      return new E404(line, linePos, chordSym, `'${chordSym}' No fingerable form was found for this code symbol.`)
    }
    /* istanbul ignore next: mystery */
    if (!guitarChordProps.fingerings) {
      return new E404(line, linePos, chordSym, `Not found fingering of '${chordSym}'. Tuning and chord may not match.`)
    }
    /* istanbul ignore next */
    if (!guitarChordProps.fingerings.length) {
      // not found e.g A13b5 <- fixed
      return new E404(line, linePos, chordSym, `'${chordSym}'" No fingerable form was found for this code structure.`)
    }

    const chordProp: ChordProp = {
      symbol: chordSym,
      intervals: guitarChordProps.intervals,
      notes: guitarChordProps.notes.map(m => XUtils.resolveNonRegularKey3str(m)) as IKey[],
      // optionalNotes: guitarChordProps.optionalNotes as IKey[],
      // requiredNotes: guitarChordProps.requiredNotes as IKey[],
      tonic: {
        iKeyId: globalVars.iKey.indexOf(guitarChordProps.tonic as IKey),
        sym: guitarChordProps.tonic as IKey
      },
      bass: {
        iKeyId: globalVars.iKey.indexOf(guitarChordProps.tonic as IKey),
        sym: guitarChordProps.tonic as IKey
      },
      fingerings: guitarChordProps.fingerings, // It is necessary to normalize "##" and "bb" when using
      createdAt: new Date(),
      updatedAt: new Date()
    };

    chordSet.set(searchKey, chordProp);

    // console.dir("fingering>0>", guitarChordProps.fingerings[0], {depth:null})
    // console.dir(['chordProp', chordProp], { depth:null })
    return new Success(chordProp);
  }

  // /**
  //  * 
  //  * @param chordProp 
  //  * @param pos 
  //  */
  // static inversion(chordProp: ChordProp, pos?: StylePositions) {

  //   // ここで頑張っても、期待通りの高音源コードの作成は難しい

  //   // 以下メモとして残す
  //   // console.log(chordProp.requiredNotes)
  //   // const chordName = tonal.detect(['E', 'G#', 'B']);
  //   // // AがAMで取得する場合ある
  //   // if ((chordName[0] || '').match(/^([CDEFGAB](#|b)?)M$/)) {
  //   //   chordName[0] = (chordName[0] || '').replace(/^([CDEFGAB](#|b)?)M$/, '$1');
  //   // }
  //   // console.dir(findGuitarChord(chordName[0]), { depth: null })
  //   // console.log(chordName)

  // }

  // /**
  //  * resolve to Tab
  //  * @param conduct 
  //  * @param line 
  //  * @param linePos 
  //  * @param tuning 
  //  * @param chordSym 
  //  * @param pos 
  //  * @returns 
  //  */
  // static resolveToTab(
  //   conduct: Conduct,
  //   line: number,
  //   linePos: number,
  //   tuning: string[],
  //   chordSym: string,
  //   chordProp: ChordProp,
  //   pos: StylePositions
  // ): IResult<null, ErrorBase> {


  //   return new Success(null);
  // }

  // /**
  //  * 
  //  * @param conduct 
  //  * @param line 
  //  * @param linePos 
  //  * @param tuning 
  //  * @param tabSym 
  //  * @returns 
  //  */
  // static resolveFromTab(
  //   conduct: Conduct,
  //   line: number,
  //   linePos: number,
  //   tuning: string[],
  //   tabSym: fret[],
  //   // chordProp: ChordProp,
  //   // pos: StylePositions
  // ): IResult<ChordProp, ErrorBase> {

  //   // searchKey作成


  //   // 保存
  //   // conduct.dic.chord.set(searchKey, chordProp);

  //   return new Success({} as ChordProp);
  // }


}
