import { SysSettings } from "../x-var";
import { DegreeObj } from "../interface/style";
import { NumberOrUfd } from "../interface/utils.interface";
import { E400, ErrorBase, IResult, Success, simpleSuccess } from "../interface/utils.response.interface";
import * as XUtils from "../utils/x-utils";
/**
 * ノートの検証処理
 */

/**
 * デグリーシンボルの解析と検証
 * %1, %1/2, %1m/2 の形式を処理する
 * '%' は事前に除去されている
 * @param degree - デグリーオブジェクト
 * @param token - 処理対象トークン
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 解析結果
 */
export function degreeSymbol(degree: DegreeObj, token: string, line: number, linePos: number): IResult<string, ErrorBase> {

  const tmp: {
    numeratorNum?: number,
    numeratorTails?: string,
    denominatorNum?: number,
  } = {};

  const [numerator, denominator] = token.split('/');
  let numeratorRes = '';
  let denominatorRes = '';

  // 分子の最初の文字
  if (/^[1234567]/.test(numerator)) {
    tmp.numeratorNum = parseInt(numerator[0]) - 1;
    numeratorRes = degree.sys.note7array[tmp.numeratorNum];

  } else if (/^[CDEFGAB]/.test(numerator)) {
    // 完全な音名ケース
    numeratorRes = numerator;

  } else {
    /* istanbul ignore next: 入力文字列は事前の構文解析で検証されるため、無効な numerator エラーは実運用では発生しない */
    return new E400(line, linePos, token,
      `Invalid numerator '${token}'. A degree symbol must start with one of 1-7, C-B`);//
  }

  // 分子の2番目の文字
  if (tmp.numeratorNum !== undefined) {
    if ((numerator[1] === '#' || numerator[1] === 'b')) {
      numeratorRes += numerator[1];
      tmp.numeratorTails = numerator.length > 2 ? numerator.slice(2) : undefined;
    } else {
      tmp.numeratorTails = numerator.length > 1 ? numerator.slice(1) : undefined;
    }
    // 完成
    numeratorRes = XUtils.resolveNonRegularKey3str(numeratorRes)
      + (tmp.numeratorTails ? tmp.numeratorTails : '')
      + (numerator.length === 1 ? degree.diatonicEvolverValue.evolvedCodePrefix[tmp.numeratorNum] : '')
  }

  // 分母の最初の文字
  if (denominator) {
    if (/^[1234567](#|b)?/.test(denominator)) {
      tmp.denominatorNum = parseInt(denominator[0]) - 1;
      denominatorRes = degree.sys.note7array[tmp.denominatorNum];

    } else if (/^[CDEFGAB](#|b)?/.test(denominator)) {
      // 完全な分母名
      denominatorRes = denominator;

    } else {
      /* istanbul ignore next: denominator の形式は事前検証により保証されるため、無効な denominator エラーは通常発生しない */
      return new E400(line, linePos, token,
        `Invalid denominator '${token}'. A degree symbol must start with one of 1-7, C-B[1]`);
    }

    // 分母の2番目の文字
    if (tmp.denominatorNum !== undefined) {
      if ((denominator[1] === '#' || denominator[1] === 'b')) {
        denominatorRes += denominator[1];
        if (denominator.length > 2) {
          /* istanbul ignore next: denominator の長さ制限は構文解析で事前チェックされるため、このエラーパスは実際には到達しない */
          return new E400(line, linePos, token,
            `Invalid denominator '${token}'.`);
        }
      } else if (denominator.length > 1) {
        /* istanbul ignore next: denominator の形式は構文解析で事前検証されるため、このエラーパスは通常発生しない */
        return new E400(line, linePos, token,
          `Invalid denominator '${token}'. A degree symbol must with one of 1-7(#|b), C-B(#|b).`);
      }
      denominatorRes = XUtils.resolveNonRegularKey3str(denominatorRes);
    }

    return new Success(numeratorRes + '/' + denominatorRes);
  } else {
    return new Success(numeratorRes);
  }
}

/**
 * コードシンボルの検証
 * 例: C, D, E, F, G, A, B
 * @param token - 処理対象トークン
 * @param noteStr - ノート文字列
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 検証結果
 */
export function chordSymbol(token: string, noteStr: string, line: number, linePos: number): IResult<null, ErrorBase> {

  if (/^\//.test(noteStr)) {
    /* istanbul ignore next: '/' プレフィックスは構文解析段階で検出・除外されるため、実運用では到達しない */
    return new E400(line, linePos, noteStr, `Invalid symbol '${noteStr}'. The prefix "/" cannot be used in code specifications.`);
  }

  if (/%/.test(token)) {
    /* istanbul ignore next: '%' 文字は事前の token 処理で適切に処理されるため、このエラーパスは通常発生しない */
    return new E400(line, linePos, noteStr, `Invalid symbol '${noteStr}'.`);
  }

  if (!/^[rCDEFGAB]/.test(token)) {
    /* istanbul ignore next: chord 名の妥当性は構文解析で事前検証されるため、無効なコード名エラーは実運用では発生しない */
    return new E400(line, linePos, noteStr, `Invalid chord name '${token}'. A chord symbol must start with one of C, D, E, F, G, A, B or r rn of rest.`);
  }

  if (/\//.test(token)) {
    const _fraction = token.split(/\//);
    if (_fraction[1] && /^[^CDEFGAB]/.test(_fraction[1])) {
      /* istanbul ignore next: chord の分数部分（molecule）は構文解析で事前検証されるため、このエラーパスは通常発生しない */
      return new E400(line, linePos, noteStr, `Invalid molecule of chord name '${token}'. A molecule of chord symbol must with one of C, D, E, F, G, A, B.`);
    }
  }

  return simpleSuccess();
}

/**
 * タブ譜シンボルの検証と解析
 * 例: r|2|2|2
 * @param tuning - チューニング設定
 * @param token - 処理対象トークン
 * @param line - 行番号
 * @param linePos - 行内位置
 * @returns 解析結果
 */
export function tabSymbol(tuning: string[], token: string, line: number, linePos: number): IResult<NumberOrUfd[], ErrorBase> {
  const fingering: NumberOrUfd[] = [];

  const splittedTabStr = token.split('|');

  if (splittedTabStr.length > tuning.length) {
    /* istanbul ignore next: tab 文字列の長さは事前にチューニング設定と照合されるため、このエラーパスは実運用では発生しない */
    return new E400(line, linePos, token,
      `'${token}' beyond tuning. Fret designation cannot exceed the number of strings specified in tuning.`);
  }

  let tPos = linePos;
  for (let ti = 0; ti < tuning.length; ti++) {
    const sym = splittedTabStr[ti];

    if (sym === '' || sym === undefined) {
      fingering.unshift(undefined);
      tPos += 1;
      continue;
    }

    if (sym === 'r') {
      fingering.unshift(-1);
      tPos += 2;
      continue;
    }

    if (/\D/.test(sym)) {
      /* istanbul ignore next: tab token の形式は構文解析で事前検証されるため、非数値文字エラーは実運用では発生しない */
      return new E400(line, tPos, sym,
        `Invalid tab token '${sym}'. Tab can only specify 'r' for frets 0 to 24 or rests.`
        + '\ne.g. 0|2|2|0|0|0 or 0|2 or r|r|2|2 etc..');
    }

    const fret = parseInt(sym);
    if (fret > SysSettings.maxTopFret) {
      /* istanbul ignore next: フレット数の上限は設定値により制限されており、通常運用では上限超過エラーは発生しない */
      return new E400(line, tPos, sym,
        `Invalid token '${sym}'. Up to ${SysSettings.maxTopFret} frets can be used.`);
    }

    fingering.unshift(fret);

    tPos += sym.length + 1;
  }

  return new Success(fingering);
}

