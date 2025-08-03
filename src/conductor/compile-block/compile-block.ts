import { E400, E500, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";
import { Region } from "../interface/region";
import { CSymbolType, CompileSymbols } from "../interface/compile";
import { Conduct } from "../interface/conduct";
import * as ModValidationForStyles from "../validation/mod-style-validation";
import { IKey, UntilNext } from "../interface/utils.interface";
import { ModPrefix } from "./mod-1-prefix";
import { ModStyle } from "./mod-2-styles";
import { ModNote } from "./mod-4-notes";


/**
 * 一時的なリージョンプロパティ
 * 
 * リージョン作成時に使用される基本設定を定義する
 * チューニング、拍子、BPMなどの基本情報を含む
 * 
 * この型は、記譜法から解析されたリージョンの基本設定を
 * 一時的に格納し、リージョンオブジェクトの作成時に使用される
 */
type TmpRegionProps = {
  /** チューニング設定（各弦の音程）：6弦から1弦の順序 */
  tuning: IKey[],
  /** 次の音までの間隔（拍子記号）：[分子, 分母]の形式 */
  untilNext: UntilNext,
  /** BPM（テンポ）：1分間の拍数 */
  bpm: number,
}

/**
 * ブロックコンパイラークラス
 * 
 * パースされたシンボルをブロック構造に変換し、
 * プレフィックス、スタイル、ノートの各段階処理を管理する
 * 
 * 処理の流れ：
 * 1. ブロックオブジェクトの初期化
 * 2. プレフィックススタイルの解決
 * 3. スタイルの初期化
 * 4. ノートの初期化
 * 
 * このクラスは、記譜法の構文解析結果を実行可能な音楽データ構造に
 * 変換する中心的な役割を担う
 */
export class BlockCompiler {

  /**
   * シンボルリストをブロック構造にコンパイル
   * 
   * 記譜法のシンボルリストを受け取り、実行可能なブロック構造に変換する
   * 各段階でエラーが発生した場合は即座に処理を中断してエラーを返す
   * 
   * 処理内容：
   * - ブロックオブジェクトの初期化（リージョン作成）
   * - プレフィックススタイルの解決（@sob、beforeStopなど）
   * - スタイルの初期化（演奏表現の設定）
   * - ノートの初期化（実際の音符データの作成）
   * 
   * @param conduct Conductオブジェクト
   * @param symbolsDualLists パース済みシンボルのリスト（dualチャンネル別）
   * @returns コンパイル結果
   */
  static compile(conduct: Conduct, symbolsDualLists: CompileSymbols[][]): SimpleResult {

    // 1. ブロックオブジェクトの初期化
    const resInitBrockList = initBlockObj(conduct, symbolsDualLists);
    if (resInitBrockList.fail()) return resInitBrockList;

    // 2. プレフィックススタイルの解決
    // prefixStyle, beforeStop, noteStr, @sobなどを処理
    const resPrefix = ModPrefix.resolve(symbolsDualLists);
    if (resPrefix.fail()) return resPrefix;

    // 3. スタイルの初期化
    const styles = ModStyle.resolve(conduct, symbolsDualLists);
    if (styles.fail()) return styles;

    // 4. ノートの初期化
    const notes_dual = ModNote.resolve(conduct, symbolsDualLists);
    if (notes_dual.fail()) return notes_dual;

    // if (0) {
    //   conduct.locationInfoList.forEach((f, i) => {
    //     console.log(i, [f.line, f.linePos], [f.endLine, f.endPos], [f.sym])
    //   })
    //   structuredClone(conduct).mixesList.forEach(ml => {
    //     ml.flatTOList.forEach(to => {
    //       to.prevTabObj = undefined as any;
    //       to.nextTabObj = undefined as any;
    //       to.refActiveBows = undefined as any;
    //       to.refMovedSlideTarget = undefined as any;
    //       // console.dir(['>>to', to], {depth:null});
    //       console.log(['to.location', to.note, to.locationIndexes])
    //     })
    //   })
    // }

    return simpleSuccess();
  }

}

/**
 * ブロックオブジェクトの初期化
 * 
 * 記譜法のシンボルリストからブロック（リージョン）オブジェクトを作成する
 * 各ブロックの基本設定（チューニング、BPM、拍子など）を解析して設定する
 * 
 * 処理内容：
 * - リージョン開始シンボル（@@）の検出
 * - リージョンプロパティの解析（チューニング、BPM、拍子）
 * - リージョン名の重複チェック
 * - 各dualチャンネル用のリージョン作成
 * 
 * @param conduct Conductオブジェクト
 * @param symbolsDualList パース済みシンボルのリスト（dualチャンネル別）
 * @returns 初期化結果
 */
function initBlockObj(conduct: Conduct, symbolsDualList: CompileSymbols[][]): SimpleResult {

  const nameDuplicateCheck: string[] = [];

  // 基本ブロックの初期化
  let id = 0;
  for (const symbols of symbolsDualList[0]) {

    // ブロック作成
    if (symbols.type === CSymbolType.regionStart) {

      // ブロックプロパティの読み取り
      const props = {} as TmpRegionProps;
      const resParseBlockStyles = parseRegionProps(props, symbols);
      if (resParseBlockStyles.fail()) return resParseBlockStyles;

      // ブロック名
      // const name = symbols.token === '@@' ? '@@' + Math.random() : symbols.token;
      const name = '@@' + Math.random();

      // 重複名チェック（未使用）
      // if (nameDuplicateCheck.includes(name)) {
      //   return new E400(symbols.line, symbols.linePos, name,
      //     `Block name '${name}' is already in use. The same block name cannot be declared at the same time.`);
      // }
      nameDuplicateCheck.push(name);

      // 基本ブロックオブジェクト
      const block: Region = {
        id,
        name,
        tuning: props.tuning ? props.tuning : conduct.settings.style.tuning,

        // 最初のブロック以外で、BPMが未設定の場合は前のブロックの状態を引き継ぐため -1 とする
        bpm: props.bpm
          ? props.bpm
          : id === 0
            ? conduct.settings.style.bpm
            : -1,

        untilNext: props.untilNext ? props.untilNext : conduct.settings.style.until,

        startLayerTick: -1,
        endLayerTick: -1,
        trueStartLayerTick: -1,
        trueEndLayerTick: -1,

        start: {} as any,
        end: {} as any,

        dualId: 0,

        usedTotalTick: 0,
        offsetTickWidth: 0,
      };

      // resolve board from tuning
      // ModFingerboard.setBoard(conduct, block.tuning);

      // block list
      conduct.mixesList[0].regionList.push(block)

      id++;
    }
  }

  // finish base block
  if (!conduct.mixesList[0].regionList.length) {
    return new E500(-1, -1, null, "At least one 'region' declaration is required.");
  }
  conduct.regionLength = conduct.mixesList[0].regionList.length;

  // dual block
  // let passiveId = -1;
  for (let dualInd = 1; dualInd < symbolsDualList.length; dualInd++) {
    let passiveId = -1;

    /** initialize dual block cb */
    const blockForDualCreate = (
      id: number,
      name: string,
      tuning: IKey[],
      untilNext: UntilNext
    ) => {
      conduct.mixesList[dualInd].regionList.push({
        id, name, tuning, bpm: -1, untilNext, startLayerTick: -1, endLayerTick: -1,
        trueStartLayerTick: -1,
        trueEndLayerTick: -1,
        start: undefined as any, // no use
        end: undefined as any, // no use
        dualId: dualInd,
        usedTotalTick: 0,
        offsetTickWidth: 0
      });
    };

    for (const symbols of symbolsDualList[dualInd]) {

      // create block
      if (symbols.type === CSymbolType.regionStart) {

        // reading block property
        const props = {} as TmpRegionProps;
        const resParseBlockStyles = parseRegionProps(props, symbols, true);
        if (resParseBlockStyles.fail()) return resParseBlockStyles;

        // block name
        // const name = symbols.token === '@@' ? '@@' + Math.random() : symbols.token;
        const name = '@@' + Math.random();
        // 重複名チェック（未使用）
        // if (nameDuplicateCheck.includes(name) && name !== SysSettings.dualJoiner) {
        //   return new E400(symbols.line, symbols.linePos, name,
        //     `-Block name '${name}' is already in use. The same block name cannot be declared at the same time.`);
        // }
        nameDuplicateCheck.push(name);

        // dual individual settings
        if (passiveId + 1 !== symbols.regionRegionForDualConnection) {
          for (let dualBlockId = passiveId + 1; dualBlockId < symbols.regionRegionForDualConnection; dualBlockId++) {
            blockForDualCreate(
              dualBlockId,
              `clone.${dualInd}.${dualBlockId}`,
              conduct.settings.style.tuning,
              undefined as any
            );
          }
        }

        blockForDualCreate(
          symbols.regionRegionForDualConnection,
          `dual.${dualInd}.${symbols.regionRegionForDualConnection}`,
          props.tuning ? props.tuning : conduct.settings.style.tuning,
          props.untilNext ? props.untilNext : conduct.settings.style.until,
        );

        passiveId = symbols.regionRegionForDualConnection;
      }
    }

    // remaining blocks
    for (let dualBlockId = passiveId + 1; dualBlockId < id; dualBlockId++) {
      blockForDualCreate(
        dualBlockId,
        `clone.${dualInd}.${dualBlockId}`,
        conduct.settings.style.tuning,
        [0, 0]);
    }
  }

  return simpleSuccess();
}

/**
 * parse block style
 * @param styles 
 */
function parseRegionProps(props: TmpRegionProps, symbols: CompileSymbols, isDual = false): SimpleResult {

  let si = 0;
  for (const prop of symbols.styles) {

    // 4/4
    if (/^\d+\/\d+$/.test(prop)) {
      const resUn = ModValidationForStyles.untilNext(prop, symbols.linesOfStyle[si], symbols.linePosOfStyle[si]);
      if (resUn.fail()) return resUn;
      props.untilNext = resUn.res as UntilNext;
    }

    // 140
    else if (/^\d+$/.test(prop)) {
      if (isDual) {
        return new E400(symbols.linesOfStyle[si], symbols.linePosOfStyle[si], prop,
          `Invalid Region Prop. BPM cannot be specified for dual block.`);
      }
      // bpm
      const resBPM = ModValidationForStyles.simpleBPM(prop, symbols.linesOfStyle[si], symbols.linePosOfStyle[si]);
      if (resBPM.fail()) return resBPM;
      props.bpm = resBPM.res;
    }

    // E|A|D|G|B|E
    else if (/\|/.test(prop)) {
      // tuning
      const tu = ModValidationForStyles.tuning(prop, symbols.linesOfStyle[si], symbols.linePosOfStyle[si]);
      if (tu.fail()) return tu;
      props.tuning = tu.res;
    }

    // unknown
    else {
      // error
      return new E400(symbols.linesOfStyle[si], symbols.linePosOfStyle[si], prop,
        `unknown Block Property '${prop}'.`);
    }

    si++;
  }

  return simpleSuccess();
}
