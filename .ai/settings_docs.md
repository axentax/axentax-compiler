# SettingResolver

`SettingResolver` は、Axentaxコンパイラにおいて、構文内の `set.` 接頭辞で始まる設定文字列を解析し、プログラムで利用可能なオブジェクト形式に変換する役割を担います。

## 処理の流れ

1.  **設定の抽出**: `conduct.syntax` から `set.` で始まる全ての行を正規表現で抽出します。
2.  **解析と格納**: 抽出した各設定をキー (`.` 区切り) と値に分割します。`conduct.settings` オブジェクト（`src/conductor/settings.ts` の `defaultSettings` で初期化済み）の対応するパスに値を格納します。
3.  **正規化 (Normalization)**: `normalization` 関数により、キーに応じて値のバリデーションと型変換を行います。例えば、`bpm` は数値に、`pan` は真偽値に、`tuning` は専用のバリデーション関数で検証されます。
4.  **エラー処理**: 無効な設定パス、不正な値、バリデーションエラーが発生した場合は、エラーオブジェクトを返します。

## 設定適用のシーケンス図

```plantuml
@startuml SettingResolver Sequence

title SettingResolver - 設定適用シーケンス

participant "Caller" as Caller
participant "SettingResolver" as Resolver
participant "extractSettingsFromSyntax()" as Extractor
participant "normalization()" as Normalizer
participant "ModValidation" as Validator
participant "Conduct" as Conduct

Caller -> Resolver: resolve(conduct)
activate Resolver

Resolver -> Conduct: conduct.settings = structuredClone(defaultSettings)
Resolver -> Extractor: extractSettingsFromSyntax(conduct)
activate Extractor
Extractor -> Extractor: 正規表現で "set." を検索・抽出
Extractor --> Resolver: Map<key, {value, line}>
deactivate Extractor

loop userSettingsMap の各設定
    Resolver -> Resolver: キーを '.' で分割 (e.g., "click.inst")
    Resolver -> Conduct: settings オブジェクトのパスを辿る

    Resolver -> Normalizer: normalization(conduct, key, value, fullKey, line)
    activate Normalizer

    alt if fullKey starts with "hash."
        Normalizer -> Normalizer: 文字列長を検証
        Normalizer --> Resolver: IResult<string>
    else
        alt switch (key)
            case "tuning"
                Normalizer -> Validator: ModValidation.tuning(value)
                activate Validator
                Validator --> Normalizer: IResult<string[]>
                deactivate Validator
                Normalizer --> Resolver: IResult<string[]>
            case "until"
                Normalizer -> Validator: ModValidation.untilNext(value)
                activate Validator
                Validator --> Normalizer: IResult<[number, number]>
                deactivate Validator
                Normalizer --> Resolver: IResult<[number, number]>
            case "degree"
                Normalizer -> Validator: ModValidation.degree(value)
                activate Validator
                Validator --> Normalizer: IResult<string>
                deactivate Validator
                Normalizer --> Resolver: IResult<string>
            case "scale"
                Normalizer -> Validator: ModValidation.scale(value)
                activate Validator
                Validator --> Normalizer: IResult<string>
                deactivate Validator
                Normalizer --> Resolver: IResult<string>
            case "bpm"
                Normalizer -> Validator: ModValidation.simpleBPM(value)
                activate Validator
                Validator --> Normalizer: IResult<number>
                deactivate Validator
                Normalizer --> Resolver: IResult<number>
            case "velocity"
                Normalizer -> Validator: ModValidation.velocity(value)
                activate Validator
                Validator --> Normalizer: IResult<number>
                deactivate Validator
                Normalizer --> Resolver: IResult<number>
            case "velocities"
                Normalizer -> Validator: ModValidation.velocities(value)
                activate Validator
                Validator --> Normalizer: IResult<number[]>
                deactivate Validator
                Normalizer --> Resolver: IResult<number[]>
            case "inst" or "accent"
                Normalizer -> Normalizer: 数値か検証し parseInt()
                Normalizer --> Resolver: IResult<number>
            case "pan" or "mappingNotResolved"
                Normalizer -> Normalizer: "true"/"false" を boolean に変換
                Normalizer --> Resolver: IResult<boolean>
            case "panning"
                Normalizer -> Normalizer: JSON.parse() で配列に変換
                Normalizer --> Resolver: IResult<number[]>
            case "key"
                Normalizer -> Normalizer: 正規表現でキー名を検証
                Normalizer --> Resolver: IResult<string>
            case default
                Normalizer -> Normalizer: parseInt(value)
                Normalizer --> Resolver: IResult<number>
        end
    end

    deactivate Normalizer

    alt normalization 成功
        Resolver -> Conduct: conduct.settings[...][key] = result
    else normalization 失敗
        Resolver --> Caller: E400 (エラー)
        deactivate Resolver
        return
    end
end

Resolver --> Caller: simpleSuccess()
deactivate Resolver

@enduml
```

## 対応設定とデータ型

### 明示的に処理される設定

`normalization` 関数で個別の `case` を持ち、専用のバリデーション・変換処理が行われる設定です。

| キー (`key`) | データ型 | バリデーション / 変換処理 |
| :--- | :--- | :--- |
| `tuning` | `string[]` | `ModValidationForStyles.tuning` により、`E|A|D|G|B|E` のような形式か検証されます。 |
| `until` | `[number, number]` | `ModValidationForStyles.untilNext` により、`1/4` のような分数形式か検証され、数値配列に変換されます。 |
| `degree` | `string` | `ModValidationForStyles.degree` により、`C major` のようなスケール度名として有効か検証されます。 |
| `scale` | `string` | `ModValidationForStyles.scale` により、`major` や `minor` のようなスケール名として有効か検証されます。 |
| `bpm` | `number` | `ModValidationForStyles.simpleBPM` により、1〜1000の範囲の数値か検証されます。 |
| `velocity` | `number` | `ModValidationForStyles.velocity` により、0〜127の範囲の数値か検証されます。 |
| `velocities` | `number[]` | `ModValidationForStyles.velocities` により、カンマ区切りの数値リストとして検証されます。 |
| `inst` | `number` | 値が数値のみで構成されているか検証され、整数に変換されます。 |
| `accent` | `number` | 値が数値のみで構成されているか検証され、整数に変換されます。 |
| `pan` | `boolean` | `true` または `false` の文字列か検証され、真偽値に変換されます。 |
| `mappingNotResolved` | `boolean` | `true` または `false` の文字列か検証され、真偽値に変換されます。 |
| `panning` | `number[]` | `[0.5, 0.5]` のようなJSON配列形式か検証され、数値配列に変換されます。 |
| `key` | `string` | `C#` や `Bb` のような有効なキー名か正規表現で検証されます。 |
| `hash.*` | `string` | `hash.` で始まるキーの場合、値の長さが2047文字以内であるか検証されます。 |

### デフォルトで整数として処理される設定

上記以外のキーは、`normalization` 関数の `default` ケースで汎用的な整数変換処理 (`parseInt`) が適用されます。これには、`settings.ts` で定義されている以下の設定が含まれます。

- `downTuning`
- `click.velocity`
- `play.possibleMSEC.fullPicking`
- `play.possibleMSEC.trill`
- `play.possibleMSEC.sweep`
- `play.strum.defaultStrumWidthMSec`
- `play.strum.velocity`
- `play.approach.widthOfSlide.baseTick`
- `play.approach.widthOfSlide.maxSplitTick`
- `play.approach.velocity.max`
- `play.approach.velocity.decrease`
- `play.approach.velocity.min`
- `play.approach.velocity.minLanding`
- `play.slide.widthOfSlide.maxSplitTick`
- `play.slide.widthOfSlide.distributionTick`
- `play.slide.velocity.max`
- `play.slide.velocity.decrease`
- `play.slide.velocity.min`
- `play.slide.velocity.landing`
- `play.release.widthOfSlide.maxSplitTick`
- `play.release.widthOfSlide.distributionTick`
- `play.release.velocity.max`
- `play.release.velocity.decrease`
- `play.release.velocity.min`
- `play.release.velocity.landing`

### 注意点：未対応および潜在的な問題

`SettingResolver` の現在の実装には、以下の課題が存在します。

1.  **真偽値の誤パース**: `play.slide.realization.realizationLandingPointOpenBows` (boolean) のような設定は、`pan` と同じ真偽値処理の `case` に含まれていないため、`default` の `parseInt('true')` が実行され、結果が `NaN` となり意図通りに動作しません。
2.  **小数点の誤パース**: `play.possibleMSEC.*` や `play.slide.realization.autoStartPointAdjustmentThresholdSec` (float) のような小数点を含む設定も、`parseInt` で処理されるため、小数点以下が切り捨てられてしまいます。

これらの設定をユーザーが `set.` 構文で正しく上書きするためには、`SettingResolver` の `normalization` 関数に、これらのキーに対応する適切な型変換処理を追加する必要があります。

## 関連ファイル

*   **実装**: `src/conductor/setting-resolve/setting-resolver.ts`
*   **テスト**: `tests/coverage/setting-resolver.coverage.test.ts`
*   **デフォルト設定**: `src/conductor/settings.ts`
*   **バリデーション関数**: `src/conductor/validation/mod-style-validation.ts`