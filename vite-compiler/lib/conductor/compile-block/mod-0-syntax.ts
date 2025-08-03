import { SysSettings } from "../x-var";
import { CSymbolType, CompileSymbols } from "../interface/compile";
import { BraceLocationInfo, Conduct, LocationInfo } from "../interface/conduct";
import { E400, ErrorBase, IResult, Success } from "../interface/utils.response.interface";
import * as StructureValidationForCompile from "../validation/mod-structure.validation";

/**
 * ModSyntaxクラス
 * 
 * 音楽記譜法の構文解析を行うクラス
 * 文字列をトークン化し、シンボル配列に変換する
 * 括弧の階層管理、エラー検出、位置情報の記録を行う
 * 
 * 処理の流れ：
 * 1. 文字列の逐次読み取りとトークン蓄積
 * 2. 特殊文字（括弧、記号）の検出と処理
 * 3. 蓄積されたトークンのシンボルタイプ判定
 * 4. エラー検出と位置情報の記録
 * 5. デュアルブロック対応の処理
 */
export class ModSyntax {

  /**
   * 構文解析メソッド
   * 
   * 音楽記譜法の文字列を解析し、コンパイル用のシンボル配列を生成する
   * 括弧の対応、エラー検出、位置情報の記録を行う
   * 
   * 解析対象の記譜要素：
   * - リージョン開始（@@）：新しい音楽ブロックの開始
   * - スタイル指定（:記号）：演奏表現の指定
   * - ノート記譜：コード、度数名、タブ譜
   * - バレット記譜：分数形式のタブ譜
   * - フラッシュ注釈（@記号）：メタ情報の指定
   * - 括弧処理：階層構造の管理
   * 
   * @param conduct コンダクターオブジェクト
   * @returns シンボル配列の配列（デュアルブロック対応）またはエラー
   */
  static as(conduct: Conduct): IResult<CompileSymbols[][], ErrorBase> {
    let accum = ''; // 現在蓄積中の文字列
    let i = 0; // 文字列インデックス
    let trueLine = 1; // 実際の行番号
    let truePos = 2; // 実際の位置
    let commitLine = 1; // コミット時の行番号
    let commitPos = 2; // コミット時の位置
    let braceLevel = 0; // 中括弧{}の階層レベル
    let roundLevel = 0; // 丸括弧()の階層レベル
    let regionIndex = -1; // リージョンインデックス

    let dualId = 0; // 0:normalモード 1~:dualモード 
    let lastBraceZeroCloseDualId = 0; // 最後に中括弧レベル0で閉じたデュアルID

    let errorDetect: ErrorBase | undefined = undefined; // エラーオブジェクト
    const symbolsLists: CompileSymbols[][] = [[], [], []]; // 最終返却値（デュアルブロック対応）

    // depthStackLocationのID順序に従い最終的に本配列に複製
    // スタイルのシンボル情報を記録し、後にStyleObjectBankのキーとして使用
    const braceLocationInfoList: BraceLocationInfo[] = [];
    const depthStackLocation: { id: number, upperBlock: number[], line: number, linePos: number }[] = [];
    let depthStackId = 0;

    // 位置別note等情報
    const locationInfoList: LocationInfo[] = [];

    // 括弧位置情報
    const braceLocations: { line: number, pos: number }[] = [];
    const roundLocations: { line: number, pos: number }[] = [];

    /**
     * コミットコールバック関数
     * 
     * 蓄積された文字列をシンボルとして確定し、適切なタイプに分類する
     * エラー検出、位置情報記録、スタイル適用も行う
     * 
     * 処理内容：
     * - シンボルタイプの自動判定または明示指定
     * - エラーチェック（構文エラー、位置エラー等）
     * - 位置情報の記録
     * - スタイル情報の適用
     * - デュアルブロック対応の処理
     * 
     * @param type 明示的に指定するシンボルタイプ（省略時は自動判定）
     */
    const commit = (type: CSymbolType | undefined = undefined) => {
      const beforeType = symbolsLists[dualId]?.length
        ? symbolsLists[dualId][symbolsLists[dualId].length - 1].type
        : CSymbolType.undefined;

      let isDecidedPropInsert = false;

      // タイプによる分類
      if (type === undefined) {
        const firstStr = accum[0];

        if ([SysSettings.dualJoiner].includes(accum)) {
          // デュアルブロック結合記号の処理
          if (braceLevel > 0) {
            errorDetect = new E400(commitLine, commitPos, accum,
              `Invalid token '${accum}' specified in the wrong place. '${accum}' is set outside the region.`);
            return;
          }
          if (regionIndex < 0) {
            errorDetect = new E400(commitLine, commitPos, accum,
              `Invalid token '${accum}'. Required start base region.`);
            return;
          }
          dualId = lastBraceZeroCloseDualId + 1;
          if (dualId > 2) {
            errorDetect = new E400(commitLine, commitPos, accum,
              `Invalid syntax '${accum}'. Exceeding the number of dual blocks in a region.`);
            return;
          }

          // >> はflashではなくdual用の regionStart とする 20240516 21:02
          type = CSymbolType.regionStart;

        } else if (firstStr === ':') {
          // スタイル指定の処理
          const valid = StructureValidationForCompile.colonOfStart(accum, beforeType, commitLine, commitPos);
          if (valid.fail()) errorDetect = valid;

          accum = accum.replace(/^:+/, '');
          type = CSymbolType.style;

        } else if (braceLevel === 0) {
          // 中括弧レベル0における処理
          if (accum === '@@') {
            // リージョン開始記号の処理
            const valid = StructureValidationForCompile.regionStart(accum, beforeType, commitLine, commitPos);
            /* istanbul ignore next */
            if (valid.fail()) errorDetect = valid;

            regionIndex++;

            type = CSymbolType.regionStart;
          } else {
            type = CSymbolType.regionProp;
          }

        } else if (firstStr === '@') {
          // フラッシュ注釈の処理
          type = CSymbolType.flash;

        } else if (/%/.test(accum)) {
          // 度数名の処理
          type = CSymbolType.degreeName;
          accum = accum.replace(/^([!./>']+)?%/, '$1');
          // commitPos += percent_length;
          isDecidedPropInsert = true;

        } else if (/(?<!\w)\d+\//.test(accum)) { // Em7/C形式の分数コードとの誤認識を防ぐ
          // バレット（分数コード）の処理
          type = CSymbolType.bullet;
          isDecidedPropInsert = true;

        } else {
          // 通常のノート記譜の処理
          type = CSymbolType.note;
          isDecidedPropInsert = true;
        }
      }

      // タイプに基づいてシンボルを作成または追加
      if (type === CSymbolType.comma) {
        // カンマ記号：小節終了マーカーの設定
        symbolsLists[dualId][symbolsLists[dualId].length - 1].endOfMeasure = true;

      } else if (type === CSymbolType.regionProp || type === CSymbolType.style) {
        // リージョンプロパティまたはスタイル記譜の処理
        const valid = StructureValidationForCompile.styleStart(accum, type, beforeType, commitLine, commitPos);
        if (valid.fail()) {
          errorDetect = valid;
          return;
        }

        // 中括弧レベル0且つスタイル記譜の場合、最後に閉じられたブロックにスタイルを適用
        const addDualId = braceLevel === 0 && type === CSymbolType.style
          ? lastBraceZeroCloseDualId
          : dualId;

        // bugfix: regionに:無しでStyle付与できてしまう対応
        if (
          symbolsLists[addDualId][symbolsLists[addDualId].length - 1].type !== CSymbolType.regionStart
          && type === CSymbolType.regionProp
        ) {
          errorDetect = new E400(commitLine, commitPos, accum,
            `Invalid syntax '${accum}'. Style must start with ':'.`);
          return;
        }

        // スタイルを適用する対象
        const targetCSymbol = symbolsLists[addDualId][symbolsLists[addDualId].length - 1];

        // append any
        const _truePos = truePos - (/\)$/.test(accum) ? 0 : 1);

        // bulletの末端がviewで一つ目を表示してしまう対応（:をstyleに含めないように変更）
        const styleColonIncrement = (type === CSymbolType.style ? 1 : 0);

        // {}囲いの階層情報にスタイル記録
        if (targetCSymbol.type === CSymbolType.closingCurlyBrace) {
          braceLocationInfoList[braceLocationInfoList.length - 1].styles.push(accum);
          braceLocationInfoList[braceLocationInfoList.length - 1].linesOfStyle.push(commitLine);
          braceLocationInfoList[braceLocationInfoList.length - 1].linePosOfStyle.push(commitPos + styleColonIncrement);
          // スタイル宣言終了まで中括弧範囲内として扱う
          braceLocationInfoList[braceLocationInfoList.length - 1].endLine = trueLine;
          braceLocationInfoList[braceLocationInfoList.length - 1].endPos = _truePos;
        }

        // 位置情報の記録（スタイル記譜は全て保存）
        const locationInfo = {
          line: commitLine,
          linePos: commitPos + styleColonIncrement,
          endLine: trueLine,
          endPos: _truePos,
          type: type === CSymbolType.regionProp ? CSymbolType.regionProp
            : targetCSymbol.type === CSymbolType.note
              || targetCSymbol.type === CSymbolType.degreeName
              || targetCSymbol.type === CSymbolType.bullet
              ? CSymbolType.style
              : CSymbolType.blockStyle,
          regionId: regionIndex,
          dualId: addDualId,
          sym: accum,
          tabObjIndexes: [],
        };
        locationInfoList.push(locationInfo);

        // 対象シンボルへのスタイル情報追加
        targetCSymbol.typesStyle.push(type);
        targetCSymbol.styles.push(accum);
        targetCSymbol.linesOfStyle.push(commitLine);
        targetCSymbol.linePosOfStyle.push(commitPos + styleColonIncrement);
        targetCSymbol.endLine = trueLine;
        targetCSymbol.endPos = _truePos;

        // regionProp以外のみ設定（regionPropはTabObjとリンクしないため）
        if (targetCSymbol.locationInfoRefStackUpList) {
          targetCSymbol.locationInfoRefStackUpList.push(locationInfoList.length - 1)
        }

      } else {

        // 匿名ブロックまたは任意ブロックの生成
        if (
          braceLevel === 0
          && beforeType !== CSymbolType.regionStart
          && beforeType !== CSymbolType.regionProp
          && type === CSymbolType.openingCurlyBrace
        ) {

          //   line: commitLine,
          errorDetect = new E400(commitLine, commitPos, '{',
            `Invalid token '${accum}'. Expected region declaration @@.`
            + '\ne.g. @@ { C D E }');
          return;
        }

        // シンボルオブジェクトの生成
        const _truePos = truePos - (/\}$/.test(accum) ? 0 : 1)

        // 位置情報の記録
        let locationInfo: LocationInfo | undefined = undefined;
        if ([
          CSymbolType.regionStart,
          // CSymbolType.closingCurlyBrace, // blockStyleは個別単体で管理するので不要
          CSymbolType.note,
          CSymbolType.bullet,
          CSymbolType.degreeName,
          CSymbolType.flash,
        ].includes(type)) {
          locationInfo = {
            line: commitLine,
            linePos: commitPos,
            endLine: trueLine,
            endPos: _truePos,
            type,
            regionId: regionIndex,
            dualId,
            sym: accum,
            tabObjIndexes: [],
          };
          locationInfoList.push(locationInfo);

        } else if (type === CSymbolType.closingCurlyBrace) {

          if (!depthStackLocation.length) {
            // expect .. 'Unexpected EOF while parsing due to missing "{".'
            return
          }

          const depthStack = depthStackLocation[depthStackLocation.length - 1];
          braceLocationInfoList.push({
            id: depthStack.id,
            regionId: regionIndex,
            dualId,
            upperBlock: depthStack.upperBlock,
            line: depthStack.line,
            linePos: depthStack.linePos,
            endLine: trueLine,
            endPos: _truePos,
            trueBraceEndLine: trueLine,
            trueBraceEndPos: _truePos,
            styles: [],
            linesOfStyle: [],
            linePosOfStyle: []
          })
        }

        symbolsLists[dualId].push({
          curlyLevel: braceLevel,
          type,
          typesStyle: [],
          line: commitLine,
          linePos: commitPos,
          linesOfStyle: [],
          linePosOfStyle: [],
          endLine: trueLine,
          endPos: _truePos,
          token: accum,
          styles: [],
          decidedProp: isDecidedPropInsert
            ? {
              noteStr: undefined,
              list: undefined,
              tick: undefined,
              styles: undefined,
              fingering: undefined,
              beforeStop: undefined,
              chordDicRef: undefined
            } // placeholder value
            : undefined as any,
          regionRegionForDualConnection: regionIndex,
          locationInfoRefStackUpList: locationInfo ? [locationInfoList.length - 1] : undefined
        });
      }

      commitPos = truePos;
      commitLine = trueLine;
      type = undefined;
      accum = '';
    };

    // 文字列の逐次解析処理
    const len = conduct.syntax.length;
    while (i < len) {
      const char = conduct.syntax[i].replace(/\r\n/g, '\n');
      switch (char) {
        case ('{'): {
          braceLocations.push({ line: trueLine, pos: truePos - 1 });
          depthStackLocation.push({
            id: depthStackId,
            upperBlock: depthStackLocation.map(m => m.id).reverse(),
            line: commitLine,
            linePos: commitPos
          });
          depthStackId++;
          if (roundLevel === 0) {
            if (/\S/.test(accum)) {
              commit();
            }
            accum = '{';
            commit(CSymbolType.openingCurlyBrace);
          } else {
            accum += '{'
          }
          braceLevel++;
          break;
        }
        case ('}'): {
          if (roundLevel === 0) {
            if (/\S/.test(accum)) {
              commit();
            }
            accum = '}';
            commit(CSymbolType.closingCurlyBrace);
          } else {
            accum += '}'
          }
          depthStackLocation.pop();
          braceLevel--;
          if (braceLevel === 0) {
            // デバッグ用：最後に閉じられたデュアルID
            lastBraceZeroCloseDualId = dualId;
            dualId = 0;
          } else if (braceLevel < 0) {
            errorDetect = new E400(trueLine, truePos - 1, '}',
              `'Unexpected EOF while parsing due to missing "{".'`);
          }
          braceLocations.pop();
          break;
        }
        case ('('): {
          roundLocations.push({ line: trueLine, pos: truePos - 1 });
          accum += char;
          roundLevel++;
          break;
        }
        case (')'): {
          accum += char;
          roundLevel--;
          if (roundLevel === 0) {
            commit();
          } else if (roundLevel < 0) {
            errorDetect = new E400(trueLine, truePos - 1, ')',
              `'Unexpected EOF while parsing due to missing ")".'`);
          }
          roundLocations.pop();
          break;
        }
        case (':'): {
          if (!roundLevel) {
            if (/[^\s:]/.test(accum)) {
              commit();
              commitPos--;
            } else {
              commitPos = truePos - 1;
            }
          }
          accum += char;
          break;
        }
        case ('\n'): {
          if (roundLevel === 0) {
            if (/\S/.test(accum)) {
              commit();
            }
            commitLine++;
            commitPos = 1;
          } else {
            accum += char;
          }
          truePos = 1;
          trueLine++;
          break;
        }
        case (' '): {
          if (roundLevel === 0) {
            if (/\S/.test(accum)) {
              commit();
            } else {
              commitPos++;
            }
          } else {
            accum += char;
          }
          break;
        }
        case ('\t'): {
          if (roundLevel === 0) {
            if (/\S/.test(accum)) {
              commit();
            } else {
              commitPos++;
            }
          } else {
            accum += char;
          }
          break;
        }
        case (','): {
          if (roundLevel === 0) {
            if (/\S/.test(accum)) {
              commit();
            }
            accum = ',';
            commit(CSymbolType.comma);
          } else {
            accum += ',';
          }
          break;
        }
        case ('-'): {
          accum += char;
          break;
        }
        default: {
          accum += char;
        }
      }

      if (errorDetect) return errorDetect;
      truePos++;
      i++;
    }

    if (braceLevel) {
      const lastBraceLoc = braceLocations[braceLocations.length - 1];
      return new E400(lastBraceLoc.line, lastBraceLoc.pos, '{', 'x2 Unexpected EOF while parsing due to missing "}".');
    }

    if (roundLevel) {
      const lastRoundLoc = roundLocations[roundLocations.length - 1];
      return new E400(lastRoundLoc.line, lastRoundLoc.pos, '(', 'Unexpected EOF while parsing due to missing ")".');
    }

    conduct.locationInfoList = locationInfoList;

    // 中括弧階層情報の正規化（ID順ソート）
    braceLocationInfoList.sort((a, b) => a.id - b.id);
    conduct.braceLocationInfoList = braceLocationInfoList;

    return new Success(symbolsLists);
  }
}
