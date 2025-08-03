# シーケンス図・クラス図 ドキュメント

このディレクトリには、mitoolの設計書として以下の図表が含まれています。

## 修正履歴

**2024年最新版**: 実際のコードベースに基づいて、存在しないクラスやメソッドを修正しました。

### 主要な修正点

1. **クラス図の修正**
   - 存在しないクラスを削除し、実際に存在するクラスのみで構成
   - メソッドの戻り値型を実際のコードベースに合わせて修正
   - インターフェース名を実際のコードベースに合わせて修正

2. **データ構造の修正**
   - `Conduct`クラスのプロパティを実際のコードベースに合わせて修正
   - `Mixes`クラスのプロパティ名を修正（`regions` → `regionList`）
   - エラーハンドリングクラスを実際のコードベースに合わせて修正

3. **型定義の修正**
   - `SimpleResult<T>` → `IResult<T, ErrorBase>` に変更
   - `NumberOrUfd`の型定義を修正（`number | "ufd"` → `number | undefined`）
   - スタイル関連のインターフェース名を修正（`SlideStyle` → `StyleSlide`など）

## ファイル構成

### クラス図

- **class-001-main-compilation.puml**: メインコンパイル処理のクラス図
- **class-002-style-processing.puml**: スタイル処理のクラス図
- **class-003-data-structures.puml**: データ構造のクラス図
- **class-004-esinst-real-usage.puml**: ESInst使用パターンのクラス図

### シーケンス図

#### メインコンパイル処理 (100番台)
- **100-01-main-compilation.puml**: メインコンパイル処理の流れ
- **100-02-syntax-parsing.puml**: 構文解析処理
- **100-03-block-compilation.puml**: ブロックコンパイル処理
- **100-04-midi-generation.puml**: MIDI生成処理

#### スタイル処理 (200番台)
- **200-01-style-compilation.puml**: スタイルコンパイル処理
- **200-02-resolve-slide.puml**: スライド解決処理
- **200-03-resolve-approach.puml**: アプローチ解決処理
- **200-04-resolve-bendX.puml**: ベンド解決処理
- **200-05-resolve-legato.puml**: レガート解決処理
- **200-06-resolve-stroke.puml**: ストローク解決処理
- **200-07-resolve-strum.puml**: ストラム解決処理
- **200-08-resolve-staccato.puml**: スタッカート解決処理

#### エラーハンドリング (300番台)
- **300-01-error-handling.puml**: エラーハンドリング処理

#### ESInst処理 (400番台)
- **400-01-esinst-processing.puml**: ESInst処理
- **400-02-esinst-step-processing.puml**: ESInstステップ処理
- **400-03-esinst-strum-processing.puml**: ESInstストラム処理

#### グループ処理 (500番台)
- **500-01-group-processing.puml**: グループ処理
- **500-02-group-mapped-resolution.puml**: グループマップ解決処理
- **500-03-group-bpm-turn.puml**: グループBPM回転処理

#### 構文解析 (150番台)
- **150-01-modsyntax-parsing.puml**: 構文解析処理
- **150-02-modsyntax-commit-process.puml**: 構文コミット処理

## 実際に存在するクラス一覧

### メインクラス
- `Conductor`: メインエントリポイント
- `BlockCompiler`: ブロックコンパイル処理
- `CompileStyle`: スタイルコンパイル処理
- `MidiBuilder`: MIDI生成処理
- `SettingResolver`: 設定解決処理

### スタイル解決クラス
- `ResolveBPM`: BPM解決処理
- `ResolveClicks`: クリック解決処理
- `ResolveSlide`: スライド解決処理
- `ResolveApproach`: アプローチ解決処理
- `ResolveBendX`: ベンド解決処理
- `ResolveLegato`: レガート解決処理
- `ResolveStroke`: ストローク解決処理
- `ResolveStrum`: ストラム解決処理
- `ResolveStaccato`: スタッカート解決処理
- `ResolveDelay`: ディレイ解決処理
- `ResolveMuteNoise`: ミュートノイズ解決処理

### 構文解析クラス
- `ModSyntax`: 構文解析処理
- `ModPrefix`: プレフィックス処理
- `ModStyle`: スタイル処理
- `ModNote`: ノート処理
- `ModFlash_dual`: フラッシュ処理
- `ModTick_dual`: ティック処理

### 展開処理クラス
- `UnfoldMapped`: マップ展開処理
- `UnfoldStepped`: ステップ展開処理
- `MappedGroup`: マップグループ処理
- `ModBullet`: バレット処理

### 辞書・ユーティリティクラス
- `ModChord`: コード辞書処理
- `ChordToFingering`: コード→フィンガリング変換
- `ModGuitarTimGM6mb`: ギターMIDI処理

### エラーハンドリングクラス
- `ErrorBase`: エラーベースクラス
- `Success<T>`: 成功結果クラス
- `E400`, `E401`, `E403`, `E404`, `E405`, `E409`, `E418`, `E422`, `E429`, `E500`: 各種エラークラス

## 実際に存在するインターフェース一覧

### コアデータ構造
- `Conduct`: 中央データストア
- `Mixes`: チャンネル別データ
- `Region`: リージョン情報
- `TabObj`: タブオブジェクト
- `Settings`: 設定情報

### スタイル関連
- `Styles`: スタイル情報
- `StyleSlide`: スライドスタイル
- `StyleApproach`: アプローチスタイル
- `StyleLegato`: レガートスタイル
- `StyleStroke`: ストロークスタイル
- `StyleStrum`: ストラムスタイル
- `StyleStaccato`: スタッカートスタイル
- `StyleDelay`: ディレイスタイル
- `StyleBendX`: ベンドスタイル

### タイミング・BPM関連
- `Tick`: ティック情報
- `BPMPos`: BPM位置情報
- `ClickPoint`: クリックポイント情報

### 楽器・音響関連
- `Bow`: 弦情報
- `BendInfo`: ベンド情報
- `ChordProp`: コード情報

### エラー・結果関連
- `ConvertToObj`: 変換結果オブジェクト
- `AllowAnnotation`: 許可アノテーション
- `Flash`: フラッシュ情報

## 使用方法

これらの図表は、PlantUMLを使用して生成されています。以下のコマンドで画像を生成できます：

```bash
plantuml *.puml
```

## 注意事項

- この設計書は実際のコードベースに基づいて作成されています
- 存在しないクラスやメソッドは削除され、実際に実装されているもののみが含まれています
- 型定義やインターフェース名は実際のコードベースに合わせて修正されています 