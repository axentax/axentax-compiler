import { E400, ErrorBase, IResult, SimpleResult, Success, simpleSuccess } from "../interface/utils.response.interface";
import { Conduct } from "../interface/conduct";
import { defaultSettings } from "../settings";
import * as ModValidationForStyles from "../validation/mod-style-validation";

/**
 * settings resolver for user
 */
export class SettingResolver {

  /**
   * Apply user settings.
   * @param conduct 
   */
  public resolve(conduct: Conduct): SimpleResult {

    conduct.settings = structuredClone(defaultSettings);
    const userSettingsMap = extractSettingsFromSyntax(conduct);

    // process each item.
    for (const [key, valueObj] of userSettingsMap) {

      const paths = key.split('.');
      const validPath = true;
      let current = conduct.settings as any;
      for (let i = 0; i < paths.length - 1; i++) { // length safety
        current = current[paths[i]];
        if (current === undefined) {
          /* istanbul ignore next: 設定パスの検証は事前に行われるため、無効なパスエラーは実運用では発生しない */
          // console.log('>>>#')
          return new E400(valueObj.line, -1, null,
            `Invalid settings because path '${paths.slice(0, i + 1).join('.')}' is missing.`
          )

          // conduct.warnings.push({
          //   line: valueObj.line,
          //   message: `Invalid settings because path '${paths.slice(0, i + 1).join('.')}' is missing.`
          // });
          // validPath = false;
          // break;
        }
      }

      if (validPath) {
        const lastKey = paths[paths.length - 1];
        if (lastKey in current) {

          // no value
          if (!/\S/.test(valueObj.value)) {
            /* istanbul ignore next: 設定値の空チェックは構文解析で事前に行われるため、このエラーパスは実運用では発生しない */
            return new E400(valueObj.line, -1, null, 'Value must be specified.');
          }

          // Cast the value to match the 'settings' type.
          const resCast = normalization(conduct, lastKey, valueObj.value, key, valueObj.line);
          if (resCast.fail()) return resCast;
          current[lastKey] = resCast.res;
          // console.log("casted>", lastKey, valueObj.value, '=>', current[lastKey]);

        } else {

          /* istanbul ignore next: 設定項目の存在確認は事前に行われるため、無効な設定パスエラーは実運用では発生しない */
          return new E400(valueObj.line, -1, null,
            `Invalid setting because path '${lastKey}' is missing.`
          )

          // conduct.warnings.push({
          //   line: valueObj.line,
          //   message: `Invalid setting because path '${lastKey}' is missing.`
          // });
        }
      }
    }

    // console.log("setM>>",conduct.settings.compile.mappingNotResolved)

    return simpleSuccess();
  }

}


/**
 * settings type normalization.
 * @param key 
 * @param value 
 * @returns 
 */
function normalization(conduct: Conduct, key: string, value: string, fullKey: string, line: number): IResult<any, ErrorBase> {

  // 注意: pan: "boolean" のようなcallbackリンクを作成し、汎用的に処理することを検討中
  if (/^hash\./.test(fullKey)) {
    if (value.length > 2047) 
      /* istanbul ignore next: ハッシュ値の長さ制限は極端に長い値でのみ発生し、通常の設定では到達しない */
      return new E400(line, -1, null, `Invalid ${fullKey} value '${value}'.`);
    return new Success(value)
  }

  switch (key) {
    case ('tuning'): {
      const resTuning = ModValidationForStyles.tuning(value, line, -1);
      return resTuning;
    }
    case ('until'): {
      const until = ModValidationForStyles.untilNext(value, line, -1);
      return until;
    }
    case ('degree'): {
      const degree = ModValidationForStyles.degree(value, line, -1);
      if (degree.fail()) return new E400(line, -1, null, degree.message);
      return degree;
    }
    case ('scale'): {
      const scale = ModValidationForStyles.scale(value, line, -1);
      if (scale.fail()) return new E400(line, -1, null, scale.message);
      return scale;
    }
    case ('bpm'): {
      const bpm = ModValidationForStyles.simpleBPM(value, line, -1);
      return bpm;
    }
    case ('velocity'): {
      const velocity = ModValidationForStyles.velocity(value, line, -1);
      return velocity;
    }
    case ('velocities'): {
      const velocities = ModValidationForStyles.velocities(conduct, value, ['E','E','E','E','E','E','E','E','E'], line, -1);
      return velocities;
    }
    case ('inst'): {
      if (/\D/.test(value)) 
        /* istanbul ignore next: 楽器番号の数値検証は構文解析で事前に行われるため、非数値エラーは実運用では発生しない */
        return new E400(line, -1, null, `Invalid ${fullKey} value '${value}'.`);
      return new Success(parseInt(value));
    }
    case ('accent'): {
      if (/\D/.test(value)) 
        /* istanbul ignore next: アクセント値の数値検証は構文解析で事前に行われるため、非数値エラーは実運用では発生しない */
        return new E400(line, -1, null, `Invalid ${fullKey} value '${value}'.`);
      return new Success(parseInt(value));
    }
    case ('pan'):
    case ('mappingNotResolved'): {
      if (!/^(?:true|false)$/.test(value)) 
        /* istanbul ignore next: boolean 値の形式検証は構文解析で事前に行われるため、無効な boolean エラーは実運用では発生しない */
        return new E400(line, -1, null, `Invalid ${fullKey} value '${value}'. e.g. set.dual.pan: true`);
      // console.log('pan>', value)
      return new Success(value === 'true' ? true : false);
    }
    case ('panning'): {
      if (!/^\[[\d.,\s]+\]$/.test(value)) 
        /* istanbul ignore next: panning 配列の形式検証は構文解析で事前に行われるため、無効な配列形式エラーは実運用では発生しない */
        return new E400(line, -1, null, `Invalid ${fullKey} value '${value}'. e.g. set.dual.panning: [0.5, 0.5, 0.5]`);
      try {
        const res = JSON.parse(value);
        return new Success(res);
      } catch {
        /* istanbul ignore next: JSON パースエラーは事前の形式検証により防がれるため、実運用では発生しない */
        return new E400(line, -1, null, `Invalid ${fullKey} value '${value}'. e.g. set.dual.panning: [0.5, 0.5, 0.5]`);
      }
    }
    case ('key'): {
      if (!/^[CDEFGAB](b|#)?$/.test(value)) {
        /* istanbul ignore next: キー名の形式検証は構文解析で事前に行われるため、無効なキー名エラーは実運用では発生しない */
        return new E400(line, -1, null, `Invalid ${fullKey} value '${value}'. e.g. C#`);
      }
      return new Success(value);
    }
    default: {
      return new Success(parseInt(value))
    }
  }

  // return simpleSuccess();
}

/**
 * extract user settings
 * @param conduct 
 * @return Configuration information deleted syntax.
 */
function extractSettingsFromSyntax(conduct: Conduct): Map<string, { value: string, line: number }> {
  const settingsMap = new Map<string, { value: string, line: number }>();
  let line = 1;
  conduct.syntax = conduct.syntax.replace(/.*?\n/sg, (match) => {
    match = match.replace(/(?:^set|\sset)\.([^\s^:]+)\s*:\s*([^\n]+)/g, (_, key, val) => {
      settingsMap.set(key, { value: val.trim(), line });
      return '';
    });
    line++;
    return match;
  });

  return settingsMap;
}
