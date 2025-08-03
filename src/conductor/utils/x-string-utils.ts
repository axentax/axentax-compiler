// import { E400, ErrorBase, IResult, Success } from "../interface/utils.response.interface";

/** 抽出されたトークンと位置情報の型定義 */
type ExtractedTokenWithLineAndPos = {
  line: number, // 行番号
  pos: number, // 行内位置
  token: string // トークン文字列
}

/** 抽出されたキー・バリュートークンと位置情報の型定義 */
// type ExtractedKeyValueTokenWithLineAndPos = {
//   key: {
//     token: string; // キートークン
//     line: number; // キーの行番号
//     pos: number; // キーの行内位置
//   },
//   val: {
//     token: string; // バリュートークン
//     line: number; // バリューの行番号
//     pos: number; // バリューの行内位置
//   }
// }

/**
 * 文字列操作ユーティリティ
 * 
 * 記譜法の文字列解析に関するユーティリティ関数を提供する
 * トークン分割、位置情報の追跡、括弧処理などの機能を含む
 * 
 * このモジュールは、音楽記譜法の構文解析において、
 * 文字列の分割、位置情報の管理、エラー位置の特定などに使用される
 */


/**
 * 改行も区切り文字として使用して値を分割する
 * 
 * 改行以外の文字は継続文字として認識される
 * 括弧のネストレベルを考慮して、適切な位置でトークンを分割する
 * 
 * 処理の特徴：
 * - 括弧の外では改行でトークンを分割
 * - 括弧内では改行もトークンの一部として扱う
 * - 空白文字の適切な処理
 * - 位置情報の正確な追跡
 * 
 * 用途：
 * - 記譜法の構文解析
 * - 設定ファイルの解析
 * - エラー位置の特定
 * 
 * @param startLine 開始行番号
 * @param startPos 開始位置
 * @param totalToken 分割対象の文字列
 * @param otherDelimiters 追加の区切り文字配列
 * @returns 分割されたトークンと位置情報の配列
 * 
 * @example
 * splitValuesEvenOnLineBrakes(1, 1, "key1:value1\nkey2:value2", [':'])
 * // [
 * //   { token: "key1", line: 1, pos: 1 },
 * //   { token: "value1", line: 1, pos: 6 },
 * //   { token: "key2", line: 2, pos: 1 },
 * //   { token: "value2", line: 2, pos: 6 }
 * // ]
 */
export function splitValuesEvenOnLineBrakes(
  startLine: number,
  startPos: number,
  totalToken: string,
  otherDelimiters: string[] = []
): ExtractedTokenWithLineAndPos[] {
  const ext = [] as ExtractedTokenWithLineAndPos[];

  let accum = ''; // 蓄積中のトークン
  let trueLine = startLine; // 実際の行番号
  let truePos = startPos; // 実際の位置
  let commitLine = startLine; // コミット時の行番号
  let commitPos = startPos; // コミット時の位置
  let roundLevel = 0; // 括弧のネストレベル

  for (const char of totalToken) {
    if (char === '\n') {
      trueLine++;
      truePos = 1;

      if (!roundLevel) {
        // 括弧の外では改行でトークンを分割
        if (/\S/.test(accum)) {
          ext.push({ token: accum.trim(), line: commitLine, pos: commitPos });
        }
        commitLine = trueLine;
        commitPos = truePos;
        accum = '';

      } else {
        // 括弧内では改行もトークンの一部として扱う
        accum += char;
      }

    } else if (otherDelimiters.includes(char)) {

      if (!roundLevel) {
        // 括弧の外では区切り文字でトークンを分割
        if (/\S/.test(accum)) {
          ext.push({ token: accum.trim(), line: commitLine, pos: commitPos });
        }
        commitLine = trueLine;
        commitPos = truePos + (startLine === commitLine ? 1 : 0);
        accum = '';

      } /* istanbul ignore else */ else {
          // 括弧内では区切り文字もトークンの一部として扱う  
          /* istanbul ignore next */
          accum += char;
        }
      

    } else if (char === '(') {
      roundLevel++; // 開き括弧でネストレベルを増加

    } else if (char === ')') {
      roundLevel--; // 閉じ括弧でネストレベルを減少

    } else if (/\s/.test(char)) {
      // 空白文字の処理
      if (!/\S/.test(accum)) {
        commitPos++; // トークン開始前の空白は位置を進める
      } else {
        accum += char; // トークン内の空白は保持
      }
    } else {
      accum += char; // 通常文字は蓄積
    }

    truePos++;
  }

  // 最後のトークンを処理
  if (/\S/.test(accum)) {
    ext.push({ token: accum.trim(), line: commitLine, pos: commitPos });
  }

  return ext;
}

/**
 * 括弧内のトークンの実際の位置を解決する
 * 
 * 括弧で囲まれたトークンの実際の開始位置（空白や括弧を除いた位置）を計算する
 * 
 * 処理内容：
 * - 改行で分割された文字列を処理
 * - 各行で最初の非空白・非括弧文字の位置を特定
 * - 正確な行番号と位置を計算
 * 
 * 用途：
 * - エラー位置の正確な特定
 * - 括弧内トークンの位置情報の正規化
 * 
 * @param accum 蓄積された文字列
 * @param line 基準行番号
 * @param pos 基準位置
 * @returns 解決された位置情報
 * 
 * @example
 * resolveLocationOfRoundBracket("  (  value  )", 1, 5)
 * // { line: 1, pos: 8 } (valueの開始位置)
 */
export function resolveLocationOfRoundBracket(accum: string, line: number, pos: number) {
  const splittedAccum = accum.split('\n');
  for (let i = 0; i < splittedAccum.length; i++) {
    const firstIndex = splittedAccum[i].search(/[^\s(]/);
    if (firstIndex !== -1) {
      line += i;
      pos = firstIndex + (i === 0 ? pos : 1);
      break;
    }
  }
  return {
    line,
    pos
  };
}

/**
 * 括弧を考慮してトークンを空白と改行で分割し、位置情報を抽出
 * @param startLine 開始行番号
 * @param startPos 開始位置
 * @param totalToken 分割対象の文字列
 * @returns 分割されたトークンと位置情報の配列
 */
export function splitBracketedTokenSplitSpaceAndEnterWithExtractLineAndPos(startLine: number, startPos: number, totalToken: string): ExtractedTokenWithLineAndPos[] {
  const ext: ExtractedTokenWithLineAndPos[] = [];

  let accum = '';
  let currentPos = startPos;
  let currentLine = 0;
  let bracketLevel = 0;

  /** commit callback */
  const commit = () => {
    ext.push({
      token: accum,
      line: currentLine + startLine,
      pos: currentPos
    });
    currentPos += accum.length;
  }

  let i = 0;
  const len = totalToken.length;
  while (i < len) {
    const char = totalToken[i];
    switch (char) {
      case (' '): {
        if (!bracketLevel) {
          if (accum.length) {
            commit();
            accum = '';
          }
        } else {
          accum += char;
        }
        currentPos++;
        break;
      }
      case ('\n'): {
        /* istanbul ignore else */
        if (!bracketLevel) {
          if (accum.length) {
            commit();
            accum = '';
          }
          currentLine++;
          currentPos = 0;
        } /* istanbul ignore else */ else {
          /* istanbul ignore next */
          accum += char;
        }
        currentPos++;
        break;
      }
      case ('('): {
        bracketLevel++;
        accum += char;
        break;
      }
      case (')'): {
        bracketLevel--;
        accum += char;
        break;
      }
      default: {
        accum += char;
      }
    }
    i++;
  }
  if (accum.length) commit();

  return ext;
}

/**
 * 文字列または数値に接頭辞を追加する
 * 引数`a`が`null`または`undefined`の場合、空文字列を返す
 * @param a 接頭辞を追加する文字列または数値
 * @param b 追加する接頭辞
 * @returns 接頭辞が追加された文字列、または空文字列
 */
export function addPre(a: string | number | undefined, b: string) {
  return a ? `${a}${b}` : '';
}


/**
 * 括弧で囲まれたキー・バリューペアを分割して位置情報を抽出する
 * 
 * 記譜法の設定構文（key:value形式）を解析し、キーとバリューの位置情報を含めて分割する
 * 括弧のネストや改行を適切に処理する
 * 
 * 処理の特徴：
 * - キーとバリューの両方の位置情報を保持
 * - 括弧のネストレベルを考慮した分割
 * - エラー検出と適切なエラーレスポンス
 * - 空白文字の適切な処理
 * 
 * 用途：
 * - 記譜法の設定構文解析
 * - キー・バリューペアの位置情報管理
 * - 構文エラーの詳細な位置特定
 * 
 * @param startLine 開始行番号
 * @param startPos 開始位置
 * @param totalToken 分割対象の文字列
 * @returns キー・バリューペアと位置情報の配列
 * 
 * @example
 * splitBracketedKeyValueTokenWithExtractLineAndPos(1, 1, "key1:value1\nkey2:(value2)")
 * // [
 * //   {
 * //     key: { token: "key1", line: 1, pos: 1 },
 * //     val: { token: "value1", line: 1, pos: 6 }
 * //   },
 * //   {
 * //     key: { token: "key2", line: 2, pos: 1 },
 * //     val: { token: "(value2)", line: 2, pos: 6 }
 * //   }
 * // ]
 */
// export function splitBracketedKeyValueTokenWithExtractLineAndPos(
//   startLine: number,
//   startPos: number,
//   totalToken: string
// ): IResult<ExtractedKeyValueTokenWithLineAndPos[], ErrorBase> {

//   const extList: ExtractedKeyValueTokenWithLineAndPos[] = [];

//   if (!/\S/.test(totalToken)) {
//     return new Success(extList);
//   }

//   let accum = ''; // 蓄積中のトークン
//   let i = 0;
//   let trueLine = startLine; // 実際の行番号
//   let truePos = startPos; // 実際の位置
//   let commitLine = startLine; // コミット時の行番号
//   let commitPos = startPos; // コミット時の位置
//   let roundLevel = 0; // 括弧のネストレベル
//   let type = 0; // key:0, value:1
//   let ext: ExtractedKeyValueTokenWithLineAndPos = {} as ExtractedKeyValueTokenWithLineAndPos;
//   let errorDetect: ErrorBase | undefined = undefined; // エラーオブジェクト

//   /** コミットコールバック @param type @returns */
//   const commit = (type: number) => {
//     // 正規化処理
//     let _accum = accum;
//     if (/^\s*\(\s*/.test(accum)) {
//       // 括弧で囲まれた場合の位置解決
//       const res = resolveLocationOfRoundBracket(accum, commitLine, commitPos);
//       commitLine = res.line;
//       commitPos = res.pos;
//       _accum = accum.replace(/^\s*\(\s*(.+?)\s*\)\s*$/, '$1');
//     } else {
//       _accum = accum.replace(/^\s*(.+?)\s*$/, '$1')
//     }
//     // オブジェクト設定
//     if (type === 0) {
//       if (!/\S/.test(_accum)) {
//         /* istanbul ignore next: key が空の場合の防御的チェックだが、構文解析で事前に検証されるため実際には発生しない */
//         errorDetect = new E400(commitLine, commitPos, _accum, 'key required.');
//         return;
//       }
//       if (/\s/.test(_accum)) {
//         /* istanbul ignore next: key にスペースが含まれる場合の防御的チェックだが、token 分割処理で適切に処理されるため実運用では発生しない */
//         errorDetect = new E400(commitLine, commitPos, _accum, `Invalid token '${_accum.replace(/\s/, ' ')}'. key is separated.`);
//         return;
//       }
//       ext.key = {
//         token: _accum,
//         line: commitLine,
//         pos: commitPos
//       }
//     } else {
//       if (!/\S/.test(_accum)) {
//         /* istanbul ignore next: value が空の場合の防御的チェックだが、構文解析で事前に検証されるため実際には発生しない */
//         errorDetect = new E400(commitLine, commitPos, _accum, 'Value required.');
//         return;
//       }
//       if (!ext.key) {
//         /* istanbul ignore next: key なしでの value 設定の防御的チェックだが、key-value の順序は構文解析で保証されるため実運用では発生しない */
//         errorDetect = new E400(commitLine, commitPos, _accum, 'Required in key-value format.');
//         return;
//       }
//       ext.val = {
//         token: _accum,
//         line: commitLine,
//         pos: commitPos
//       }
//       extList.push(ext);
//       ext = {} as ExtractedKeyValueTokenWithLineAndPos;
//     }
//     commitPos = truePos;
//     commitLine = trueLine;
//     accum = '';
//   }

//   // easy supported ---
//   const _totalToken = totalToken.replace(/(\s*,\s*)+$/, '');
//   // easy supported ---/
//   const len = _totalToken.length;
//   while (i < len) {
//     const char = _totalToken[i];
//     switch (char) {
//       case ('\n'): {
//         if (!roundLevel) {
//           if (!/\S/.test(accum)) {
//             commitLine++;
//             commitPos = 1;
//           } else {
//             // easy support --- Commit without "," at line break.
//             commit(1);
//             type = 0;
//             // easy support ---/
//           }
//         }
//         truePos = 1;
//         trueLine++;
//         accum += char;
//         break;
//       }
//       case (':'): {
//         if (roundLevel) {
//           accum += char;
//         } else {
//           if (type === 1) {
//             /* istanbul ignore next: value の順序エラーは構文解析で事前に検証されるため、実運用では発生しない */
//             errorDetect = new E400(trueLine, truePos, accum, 'Wrong order of value.');
//             break;
//           }
//           commit(0);
//           type = 1;
//         }
//         break;
//       }
//       case (','): {
//         if (roundLevel) {
//           accum += char;
//         } else {
//           if (type === 0) {
//             /* istanbul ignore next: key の順序エラーは構文解析で事前に検証されるため、実運用では発生しない */
//             errorDetect = new E400(trueLine, truePos, accum, 'Wrong order of key.');
//             break;
//           }
//           commit(1);
//           type = 0;
//         }
//         break;
//       }
//       case ('('): {
//         roundLevel++;
//         accum += char;
//         break;
//       }
//       case (')'): {
//         roundLevel--;
//         accum += char;
//         break;
//       }
//       case (' '): {
//         if (!/\S/.test(accum)) {
//           commitPos++;
//         }
//         accum += char;
//         break;
//       }
//       default: {
//         accum += char;
//       }
//     }
//     truePos++;
//     i++;
//   }
//   if (/\S/.test(accum)) commit(1);

//   if (type === 0) {
//     if (/,\s+$/.test(totalToken)) {
//       /* istanbul ignore next: 末尾のカンマエラーは構文解析で事前に検出されるため、実運用では発生しない */
//       return new E400(startLine, startPos, totalToken, 'Syntax Error By Style. The final "," is not allowed.');
//     }
//   }
//   if (ext.key && !ext.val) {
//     /* istanbul ignore next: key に対応する value がない場合の防御的チェックだが、key-value のペア構造は構文解析で保証されるため実運用では発生しない */
//     return new E400(ext.key.line, ext.key.pos, ext.key.token, `value of '${ext.key.token}' not found.`);
//   }

//   if (errorDetect) return errorDetect;

//   return new Success(extList);
// }
