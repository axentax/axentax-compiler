import * as tonal from "@tonaljs/chord";

import { Base12Sym } from "../utils.vers";
import { SysSettings } from "../x-var";
import * as XUtils from "../utils/x-utils";
import { IKey, NumberOrUfd } from "../interface/utils.interface";

/**
 * フィンガリング展開オプションインターフェース
 * 
 * コードからフィンガリングを生成する際の設定オプションを定義する
 * 難易度、検索範囲、並び順などの制御パラメータを含む
 */
export interface ExpandFingeringOptions {
  /** 難易度閾値（デフォルト: 3） */
  difficulty?: number;
  /** コードルート音の最大フレット */
  maxSearchRootFret?: number;
  /** ルートの次の完全5度不要フラグ */
  notRequiredPerfectFifth?: boolean | null,
  /** 解放弦を広い範囲で使用するフラグ */
  wideUseOpenString?: boolean | null;
  /** 結果並べ替え（high: 高音域優先、low: 低音域優先） */
  sortByPosition?: 'high' | 'low' | null;
  /** フォームとして成り立つフレット幅 */
  searchFretWidth?: number,
  /** テンションは可能な限り高音源を使用するフラグ */
  useHighestTensionPossible?: boolean | null;
  /** 必須弦（弦番号配列） */
  requiredStrings?: number[] | null,
}

/** ローカルオプション型（必須パラメータ化） */
type localOptions = Required<ExpandFingeringOptions>;

/**
 * フィンガリングコレクションインターフェース
 * 
 * 個別のフィンガリング情報を表現する
 * スコア、タブ譜、音名、メモなどを含む
 */
export interface FingeringCollection {
  /** ポジションスコア（位置による評価点） */
  positionScore: number,
  /** 総合スコア（難易度・実用性の評価点） */
  score: number,
  /** タブ譜（フレット配列） */
  tab: NumberOrUfd[],
  /** 音名配列 */
  notes: (IKey | undefined)[],
  /** コードシンボル */
  sym: string,
}

/**
 * フィンガリングコレクションオブジェクトインターフェース
 * 
 * コードに対する全フィンガリング情報を表現する
 * フィンガリング配列、音名、ルート音、インターバルなどを含む
 */
export interface FingeringCollectionObj {
  /** フィンガリング配列 */
  fingerings: FingeringCollection[],
  /** 音名配列 */
  notes: IKey[],
  /** ルート音 */
  tonic: IKey,
  /** インターバル配列 */
  intervals: string[],
  /** テンションノート配列 */
  tensionNotes: string[],
}

/** 基本ボードリスト型（弦ごとの音名配列） */
type BasicBoardList = (IKey | null)[][];
/** フレット位置型（音名、弦番号、フレット番号、メモ） */
type FretLocation = { key: IKey, string: number, fret: number, memo?: string }

/**
 * コードバッグ型
 * 
 * コード解析結果とオプションを格納する内部データ構造
 */
type ChordBag = {
  /** 音名配列 */
  notes: IKey[];
  /** ルート音 */
  tonic: IKey;
  /** インターバル配列 */
  intervals: string[];
  /** テンションノート配列 */
  tensionNotes: string[];
  /** 完全5度の音名 */
  perfectFifth: string | null,
  /** 基本ボードリスト */
  basicBoardList: BasicBoardList;
  /** フレット位置リスト */
  fretLocationList: FretLocation[][];
  /** オプション */
  options: localOptions;
}

/**
 * ChordToFingeringクラス
 * 
 * コード名からギターのフィンガリングを自動生成するユーティリティクラス
 * tonal.jsライブラリを使用してコード解析を行い、最適なフィンガリングを探索する
 */
export class ChordToFingering {

  /**
   * コア検索メソッド
   * 
   * コード名から最適なフィンガリングを探索・生成する
   * 分数コード、テンションノート、完全5度の処理も含む
   * 
   * @param chordSym コードシンボル（例：C、Am7、D/F#など）
   * @param tuning チューニング配列
   * @param options フィンガリング展開オプション
   * @returns FingeringCollectionObj | null（成功時はフィンガリング情報、失敗時はnull）
   */
  static search(chordSym: string, tuning: IKey[], options: ExpandFingeringOptions = {}): FingeringCollectionObj | null {

    chordSym = chordSym.replace(/mmaj/, 'mMaj');

    // オプションの補完
    if (!options.difficulty) options.difficulty = 3;
    if (!options.maxSearchRootFret) options.maxSearchRootFret = 12;
    if (!options.searchFretWidth) options.searchFretWidth = 4;
    if (options.requiredStrings) {
      options.requiredStrings = options.requiredStrings.map(m => {
        return m - 1 // システムインデックスに変更
      }).sort();
    }

    // 分数コードの場合の処理
    let denominator: string | null = null;
    if (/\//.test(chordSym)) {
      [chordSym, denominator] = chordSym.split('/')
    }

    // tonal.jsでコード解析
    const resChord = tonal.get(chordSym);
    if (!resChord.notes.length) {
      return null;
    }
    /* istanbul ignore next */
    if (!resChord.tonic) throw 'nothing tonic';

    // 分数コードの場合のルート音変更
    if (denominator) {
      resChord.notes.unshift(denominator);
      resChord.tonic = denominator;
    }

    const notes = resChord.notes.map(m => XUtils.resolveNonRegularKey3str(m))

    // テンションノートの抽出
    const tensions: string[] = [];
    resChord.intervals.forEach((f, i) => {
      if (/9|13|11/.test(f)) {
        tensions.push(notes[i]);
      }
    });

    // 完全5度のノート抽出
    let perfectFifth = null;
    resChord.intervals.forEach((f, i) => {
      if (f === '5P') perfectFifth = resChord.notes[i];
    });

    const chordBag = {
      notes: notes,
      tonic: XUtils.resolveNonRegularKey3str(resChord.tonic),
      intervals: resChord.intervals,
      tensionNotes: tensions,
      perfectFifth,
      options
    } as ChordBag;

    // 指板の配列作成（弦数/フレット最大）
    createBasicBoard(tuning, chordBag);

    // 探索メイン
    const fingeringCollectionObj = searchAll(tuning, chordBag);

    // console.log("fingerings>>", fingeringCollectionObj.fingerings[0].sym, fingeringCollectionObj.fingerings[0].notes);
    // fingeringCollectionObj.fingerings.forEach(f => console.log("fingerings>>", f));
    // structuredClone(fingeringCollectionObj.fingerings).reverse().forEach(f => console.log("rev.fin>>", f.sym, f.score, f.memo));

    // 返却
    return fingeringCollectionObj;
  }
}

/**
 * 基本ボード作成関数
 * 
 * チューニングに基づいて指板の基本配列を作成する
 * 各弦の各フレット位置に、コード構成音があるかどうかを判定して格納する
 * 
 * @param tuning チューニング配列
 * @param cb コードバッグ
 */
function createBasicBoard(tuning: IKey[], cb: ChordBag): void {
  const res: BasicBoardList = [];
  for (let ti = tuning.length - 1; ti >= 0; ti--) {
    const base = Base12Sym[tuning[ti]];
    const row: (IKey | null)[] = [];
    for (let fi = 0; fi <= SysSettings.maxTopFret; fi++) {
      const fretNum = fi % base.length;
      row.push(cb.notes.includes(base[fretNum]) ? base[fretNum] : null)
    }
    res.push(row)
  }
  cb.basicBoardList = res;
}

/**
 * 全探索関数
 * 
 * 指定された範囲内で全ての可能なフィンガリングを探索する
 * 開始は最低音弦、終了は{開始弦 - (tuning弦数 - 必須音数)}
 * 
 * @param tuning チューニング配列
 * @param cb コードバッグ
 * @returns フィンガリングコレクションオブジェクト
 */
function searchAll(tuning: IKey[], cb: ChordBag) {

  const fingeringCollection: FingeringCollection[] = [];

  const startStringIndex = tuning.length - 1;
  const endStringIndex = startStringIndex - (tuning.length - cb.notes.length)

  // 1フォームにおけるフレット検索幅
  const width = (
    cb.options.searchFretWidth < 4 || cb.options.searchFretWidth > 12
      ? 4
      : cb.options.searchFretWidth
  ) - 1;

  // 同フォーム重複チェック用
  const duplicates: { [keys: string]: boolean } = {};

  // 必須notesからtonicを除外したリスト
  const noteWithRootOmitted = cb.notes.filter(f => f !== cb.tonic);

  // 必須notesからtonicと完全5度を除外したリスト
  const noteWithRootAntFifthOmitted = noteWithRootOmitted.filter(f => f !== cb.perfectFifth);

  // CB: コードトーン全て満たすかチェック（ルート抜き）
  const checkRequiredChordToneSatisfied = (flKeys: FretLocation[]) => {
    const keys = Array.from(new Set(flKeys.map(m => m.key)));
    return noteWithRootOmitted.every(value => keys.includes(value));
  };

  // CB: コードトーン全て満たすかチェック（ルート&5度抜き）
  const checkRequiredChordToneSatisfiedWithNoFifth = (keys: IKey[]) => {
    const _keys = Array.from(new Set(keys));
    return noteWithRootAntFifthOmitted.every(value => _keys.includes(value));
  };

  // CB: 必須弦を全て満たすかチェック
  const checkRequiredStringSatisfied = (stringList: number[], requiredList: number[]) => {
    return requiredList.every(value => stringList.includes(value));
  };

  /**
   * step_4: difficulty
   * @param fretLocations 
   * @returns
   *   -1: 指定必須弦にマッチしない
   *   -2: テンションノートが高音ではない
   *   0以上 - 難易度
   */
  const scoreCheck2 = (
    fretLocations: FretLocation[], rootStringIndex: number, rootFretIndex: number
  ): [string, number] => {

    // let memo = 'memo';
    let score = 0;

    // bar(セーハ) - 解放弦が最初のみ(rootのみ)の場合、barとしては除外し、別の弦の最小フレットをBarとする
    let barFret = 0;
    // let openStringUnTargetBarFret = false;
    const _minFret = Math.min(...fretLocations.map(kl => kl.fret));
    // memo += `<_b${_minFret}>`
    if (rootFretIndex === 0) {
      if (_minFret > 0) {
        barFret = _minFret;
        // openStringUnTargetBarFret = true;
      }
    } else {
      barFret = _minFret;
    }

    // 完全5度削除(ルートの次のみ)
    if (cb.options.notRequiredPerfectFifth && rootFretIndex !== 0 // 設定 && ルートが解放弦ではない
      && fretLocations[fretLocations.length - 1].key === cb.perfectFifth // ルートの次が完全5度
      && fretLocations[fretLocations.length - 2].key !== cb.tonic // 完全5度の上がトニックノートでは無い
      && !cb.options.requiredStrings?.includes(fretLocations[fretLocations.length - 1].string) // 必須弦ではない
    ) {
      fretLocations[fretLocations.length - 1].fret = -1;
      fretLocations[fretLocations.length - 1].key = '_' as any;
    }

    // 必須弦指定
    if (cb.options.requiredStrings) {
      const stringList = [rootStringIndex, ...fretLocations.map(m => m.string)];
      const resRequired = checkRequiredStringSatisfied(stringList, cb.options.requiredStrings);
      if (!resRequired) {
        // memo += ':必須弦NoMatch';
        score -= 8;
        // return [-1, memo];
      }
    }

    // 高音にテンション指定
    if (cb.options.useHighestTensionPossible && cb.tensionNotes.length) {
      if (!cb.tensionNotes.includes(fretLocations[0].key)) {
        score -= 4;
      }
    }

    // 減点と難易度処理
    let difficulty = 0;
    const stackingKey: IKey[] = [];

    for (let si = fretLocations.length - 1; si >= 0; si--) {

      if (
        // ルートがBarではない場合、無条件で難易度上昇
        barFret !== rootFretIndex
        // or 解放弦以外で、フレットがBarでは無い場合、難易度上昇
        || (fretLocations[si].fret >= 0 && fretLocations[si].fret !== barFret)
      ) {
        difficulty++;
      }

      // 難易度規定数超過
      if (difficulty > cb.options.difficulty) {
        score -= 1;

        // ここ(以前)までで、5度以外の必須noteを満たしているか
        const isSatisfied = checkRequiredChordToneSatisfiedWithNoFifth(stackingKey);

        // ここ(含め)から、指定必須弦はあるか (siを含めsi以下)
        let isCommittedRequiredNotes = true;
        if (cb.options.requiredStrings) {
          // 指定必須弦は整っているか
          isCommittedRequiredNotes = !cb.options.requiredStrings.some(s => s <= si);
        }

        if (isSatisfied && fretLocations[si].fret !== barFret) {

          if (!isCommittedRequiredNotes) {
            score -= 2
          }

          // 簡易化テスト
          const _fretLocations = structuredClone(fretLocations);
          for (let ni = si; ni >= 0; ni--) _fretLocations.shift();
          const dKey = _fretLocations.map(m => `${m.string},${m.fret}`).join('+');
          // 重複コードがなければ簡易化
          if (!duplicates[dKey]) {
            duplicates[dKey] = true;
            for (let ni = si; ni >= 0; ni--) {
              fretLocations.shift();

            }
            // スコア超過時点で簡易化に成功
            score += 1;
            /* istanbul ignore next */
            return ['memo', score];
          }
        }
      }

      stackingKey.push(fretLocations[si].key);
    }

    return ['memo', score];
  }

  /**
   * スコアチェック関数（step_3）
   * 
   * フィンガリングの総合スコアを計算する
   * 難易度、必須弦の並び、弦数などを考慮してスコアを算出する
   * 
   * @param fretLocations フレット位置配列
   * @param rootStringIndex ルート弦インデックス
   * @param rootFretIndex ルートフレットインデックス
   * @returns [スコア, メモ]のタプル
   */
  const scoreCheck = (
    fretLocations: FretLocation[], rootStringIndex: number, rootFretIndex: number
  ): [number, string] => {

    // 難易度チェック
    const [memo, initialScore] = scoreCheck2(fretLocations, rootStringIndex, rootFretIndex);
    let score = initialScore;

    // 必須弦と並びが異なる場合減点
    if (cb.options.requiredStrings) {
      if (!arraysAreEqual([...fretLocations.map(m => m.string), rootStringIndex], cb.options.requiredStrings)) {
        score -= 2;
      }
    }

    // 弦が3本以下減点
    if (fretLocations.length < 3) {
      /* istanbul ignore next */
      score -= 3;
    }

    return [score, memo];
  }

  /**
   * フォーム検索関数（step_2）
   * 
   * 指定された範囲内でフィンガリングフォームを探索する
   * 各弦の各フレット位置でコード構成音を探し、組み合わせを生成する
   * 
   * @param searchFretIndex 検索開始フレットインデックス
   * @param rootStringIndex ルート弦インデックス
   * @param rootFretIndex ルートフレットインデックス
   */
  const searchForm = (searchFretIndex: number, rootStringIndex: number, rootFretIndex: number) => {

    const existParallelKeysList: FretLocation[][] = [];

    // 弦毎処理の処理弦数（7弦以上の場合、6本まで対象にする）
    const startString = 0;

    // 弦毎に処理
    for (let bi = startString; bi < rootStringIndex; bi++) {
      const existParallelKeys: FretLocation[] = [];

      // フレット毎に処理
      const end = searchFretIndex + width;
      for (let fi = searchFretIndex; fi <= end; fi++) {
        const key = cb.basicBoardList[bi][fi];
        if (key) {
          existParallelKeys.push({ key, string: bi, fret: fi });
        }
      }
      existParallelKeysList.push(existParallelKeys)
    }

    const allCombine = findAllCombinationsFretLocation(existParallelKeysList);
    const allParallel = allCombine.filter(
      set => {
        const dKey = set.map(m => `${m.string},${m.fret}`).join('+');
        if (duplicates[dKey] || !checkRequiredChordToneSatisfied(set)) {
          return false
        } else {
          duplicates[dKey] = true;
          return true
        }
      }
    );

    // 開発ビュー処理
    allParallel.forEach(fl => {
      // スコアチェック
      const [score, memo] = scoreCheck(fl, rootStringIndex, rootFretIndex);

      // 返却用オブジェクト作成
      const tab = new Array<NumberOrUfd>(tuning.length).fill(undefined);
      tab[rootStringIndex] = rootFretIndex;
      const notes = new Array<IKey | undefined>(tuning.length).fill(undefined);
      notes[rootStringIndex] = cb.tonic;
      fl.forEach(f => {
        if (f.fret >= 0) {
          tab[f.string] = f.fret
          notes[f.string] = f.key
        }
      })

      const chordInfo = {
        positionScore: Math.round((tab.reduce((acc, cur) => (acc || 0) + (cur || 0), 0) || 0) / fl.length),
        score: score,
        tab,
        notes,
        sym: tab.map(m => m !== undefined ? m : '').reverse().join('|'),
        memo
      }
      fingeringCollection.push(chordInfo);
    });

  }

  // ---
  // step_1: 検索対象の抽出
  // ---
  // 弦毎に処理
  for (let rootBi = startStringIndex; rootBi >= endStringIndex; rootBi--) {

    // フレット探索
    const end = Math.min(17, SysSettings.maxTopFret); // 最大 17フレットのルートまで見る
    for (let rootFi = 0; rootFi <= end; rootFi++) {
      const fretKey = cb.basicBoardList[rootBi][rootFi];
      if (!fretKey || fretKey !== cb.tonic) continue;
      // ルート音が見つかった場合

      // 探索範囲の最小開始フレット
      const searchMinStartFret = rootFi - width < 0
        ? 0
        : rootFi - width;
      // 探索範囲の最大開始フレット（オプションによってルートが解放弦の場合は全域見る）
      const searchMaxStartFret = rootFi === 0 && cb.options.wideUseOpenString ? cb.options.maxSearchRootFret : rootFi;

      // 各検索範囲毎
      for (let leftLimitSi = searchMinStartFret; leftLimitSi <= searchMaxStartFret; leftLimitSi++) {
        searchForm(leftLimitSi, rootBi, rootFi);
      }

    }

  }

  // 結果の並び替え
  if (cb.options.sortByPosition) {
    if (cb.options.sortByPosition === 'low') {
      fingeringCollection.sort((a, b) => a.positionScore - b.positionScore)
    } else {
      fingeringCollection.sort((a, b) => b.positionScore - a.positionScore)
    }
  }
  fingeringCollection.sort((a, b) => b.score - a.score)

  const fingeringCollectionObj: FingeringCollectionObj = {
    fingerings: fingeringCollection,
    notes: cb.notes,
    tonic: cb.tonic,
    intervals: cb.intervals,
    tensionNotes: cb.tensionNotes
  }

  return fingeringCollectionObj;
}

/**
 * 全ての組み合わせを算出する関数
 * 
 * 複数の配列から全ての可能な組み合わせを生成する
 * 例：[[1], [2a, 2b], [3]] => [[1, 2a, 3] , [1, 2b, 3]]
 * 
 * @param input 入力配列の配列
 * @returns 全ての組み合わせの配列
 */
function findAllCombinationsFretLocation(input: FretLocation[][]): FretLocation[][] {
  // console.log('----------\ninput', input);

  // 空の配列をフィルタリング
  const filteredInput = input.filter(group => group.length > 0);

  if (filteredInput.length === 0) {
    /* istanbul ignore next */
    return []; // 全ての配列が空の場合は早期リターン
  }

  /**
   * 組み合わせ生成の再帰関数
   * 
   * @param index 現在処理中の配列インデックス
   * @param path 現在までの組み合わせパス
   */
  const combine = (index: number, path: FretLocation[]): void => {
    if (index === filteredInput.length) {
      result.push([...path]);
      return;
    }
    filteredInput[index].forEach(item => combine(index + 1, [...path, item]));
  };

  const result: FretLocation[][] = [];
  combine(0, []);
  return result;
}

/**
 * 配列の等価性チェック関数
 * 
 * 2つの数値配列が完全に同じ要素を持っているかを判定する
 * 
 * @param arr1 比較対象配列1
 * @param arr2 比較対象配列2
 * @returns 配列が等しい場合はtrue、そうでなければfalse
 */
function arraysAreEqual(arr1: number[], arr2: number[]): boolean {
  // 配列の長さが異なる場合は即座にfalseを返す
  if (arr1.length !== arr2.length) {
    return false;
  }

  // 各要素を順に比較して、一致しない要素があればfalseを返す
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // 全ての要素が一致すればtrueを返す
  return true;
}
