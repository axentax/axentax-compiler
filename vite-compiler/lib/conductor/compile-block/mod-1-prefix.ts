import { CSymbolType, CompileSymbols } from "../interface/compile";
import { E400, SimpleResult, simpleSuccess } from "../interface/utils.response.interface";

/**
 * ModPrefixクラス
 * 
 * 音楽記譜法のプレフィックス解析を行うクラス
 * アプローチ、ストローク、ストラム、コンティニューなどの演奏指示を解析する
 * シンボルのプレフィックス部分を解析し、適切なスタイル情報に変換する
 */
export class ModPrefix {

  /**
   * プレフィックス解決メソッド
   * 
   * シンボル配列の各要素に対してプレフィックス解析を実行する
   * デュアルブロック対応で、各ブロック内のシンボルを順次処理する
   * 
   * @param symbolsDualLists デュアルブロック対応のシンボル配列
   * @returns 処理結果（成功またはエラー）
   */
  static resolve(symbolsDualLists: CompileSymbols[][]): SimpleResult {

    for (let dualId = 0; dualId < symbolsDualLists.length; dualId++) {
      for (let si = 0; si < symbolsDualLists[dualId].length; si++) {

        const sym = symbolsDualLists[dualId][si];

        switch (sym.type) {
          case (CSymbolType.degreeName): {
            // 度数名の場合
            sym.decidedProp.noteStr = '%' + sym.token + (sym.styles.length ? ":" + sym.styles.join(':') : '');

            if (/^[/.>]/.test(sym.token)) {
              return new E400(sym.line, sym.linePos, sym.token,
                `Invalid degree chord symbol '${sym.token}'.. This prefix cannot be used in chord specifications.`);
            }

            const resPrefix = parsePrefixStyles(sym);
            /* istanbul ignore next */
            if (resPrefix.fail()) return resPrefix;
            break;
          }
          case (CSymbolType.note): {
            if (!/\|/.test(sym.token)) {
              // コードシンボルの場合
              sym.decidedProp.noteStr = sym.token + (sym.styles.length ? ":" + sym.styles.join(':') : '');

              if (/^(rn|R)[\^~=]*$/.test(sym.token)) {
                // ミュートノイズの処理
                const tailsMatches = sym.token.match(/([\^~=]+)$/);
                sym.token = 'r' + (tailsMatches ? tailsMatches[1] : '');
                sym.styles.push(`rn`);
                sym.linesOfStyle.push(sym.line);
                sym.linePosOfStyle.push(sym.linePos);
              }

              if (/^[/.>]/.test(sym.token)) {
                return new E400(sym.line, sym.linePos, sym.token,
                  `Invalid chord symbol '${sym.token}'.. This prefix cannot be used in chord specifications.`);
              }

              const resPrefix = parsePrefixStyles(sym);
              if (resPrefix.fail()) return resPrefix;

            } else {
              // タブ譜の場合
              sym.decidedProp.noteStr = sym.token + (sym.styles.length ? ":" + sym.styles.join(':') : '');

              const resPrefix = parsePrefixStyles(sym);
              if (resPrefix.fail()) return resPrefix;
            }

            break;
          }
          case (CSymbolType.bullet): {
            // バレット（分数コード）の場合
            sym.decidedProp.noteStr = sym.token + (sym.styles.length ? ":" + sym.styles.join(':') : '');
            const resPrefix = parsePrefixStyles(sym);
            /* istanbul ignore next */
            if (resPrefix.fail()) return resPrefix;
          }
        }
      }
    }

    return simpleSuccess();
  }
}

/**
 * プレフィックススタイル解析関数
 * 
 * シンボルのプレフィックス部分を解析し、適切なスタイル情報に変換する
 * アプローチ、ストローク、ストラム、コンティニューなどの演奏指示を処理する
 * 
 * @param sym 解析対象のシンボル
 * @returns 処理結果（成功またはエラー）
 */
function parsePrefixStyles(sym: CompileSymbols): SimpleResult {

  const trueToken = sym.token;
  // console.log('sym>', sym.token)

  // アプローチ（>>）の処理
  if (/^([./!']+)?([|\dr]+(!\d+)?>>)/.test(sym.token)) {
    // アプローチ
    const matchedApproach = sym.token.match(/^([./!']+)?([|\dr]+)(!\d+)?>>/);
    /* istanbul ignore next */
    if (matchedApproach) {

      // console.log('matchedApproach>', matchedApproach)

      if (/r/.test(matchedApproach[2])) {
        return new E400(sym.line, sym.linePos, sym.token,
          `The rest 'r' cannot be specified for the approach.`
        )
      }

      sym.styles.push(`approach(${matchedApproach[2] + (matchedApproach[3] ? matchedApproach[3] : '')})`);
      sym.linesOfStyle.push(sym.line);
      sym.linePosOfStyle.push(sym.linePos + (matchedApproach[1] ? matchedApproach[1].length : 0));

      sym.token = sym.token.replace(/^([./!']+)?[|\dr]+(!\d+)?>>/, '$1')
    }
  }
  
  // コンティニュー（..）の処理
  if (/^([/!']+)?\.\./.test(sym.token)) {
    // コンティニュー
    sym.styles.push('continue');
    sym.linesOfStyle.push(sym.line);
    sym.linePosOfStyle.push(sym.linePos);

    sym.token = sym.token.replace(/^([/!']+)?\.\./, '$1')
  }

  // ストラム（/）の処理
  if (/^'*?\//.test(sym.token)) {
    // ストラム
    sym.styles.push('strum');
    sym.linesOfStyle.push(sym.line);
    sym.linePosOfStyle.push(sym.linePos);

    sym.token = sym.token.replace(/^('*?)\//, '$1');
  }

  // ストローク（'）の処理
  if (/^!?('+)/.test(sym.token) || /^!('+)?/.test(sym.token)) {
    // ストローク
    const strokeMatched = sym.token.match(/^(!)?('*)/);
    /* istanbul ignore next */
    if (strokeMatched) {
      const order = strokeMatched[2].split('').length;
      if (order > 8) {
        return new E400(sym.line, sym.linePos, sym.token,
          `The prefix >>'<< that specifies stroke cannot exceed 8.`
        )
      }
      const level = [16, 12, 8, 6, 4, 3, 2, 1][order - 1];
      sym.styles.push(`stroke(${level ? '1/' + level : ''}${strokeMatched[1] ? '.up' : ''})`);
      sym.linesOfStyle.push(sym.line);
      sym.linePosOfStyle.push(sym.linePos);

      sym.token = sym.token.replace(/^!?'*/, '');
    }
  }

  // エラーケースの処理
  if (/^[.!/>]/.test(sym.token)) {
    // エラーケース
    if (/>/.test(sym.token)) {
      return new E400(sym.line, sym.linePos, sym.token,
        `Invalid approach prefix ${trueToken}.`
        + "\ne.g. ||||2|2>>||||5|5 or ||||2|2!200>>||||5|5 etc.."
      )
    }

    if (/\.\.\./.test(trueToken) || /\./.test(sym.token)) {
      return new E400(sym.line, sym.linePos, sym.token,
        `Invalid continue prefix '${trueToken}'. Continue dots are only valid for 2 connections.`
        + '\ne.g. ..|3|2|3|2');
    }

    return new E400(sym.line, sym.linePos, trueToken,
      `Invalid token prefix '${trueToken}'.`
      + "\ne.g. ..C or ''C or ..''|||2|2| or /|||2|2| or ||||2|2>>||||5|5 or ||||2|2!200>>||||5|5 etc.."
    )
  }

  sym.prefixLength = trueToken.length - sym.token.length;

  return simpleSuccess();
}
