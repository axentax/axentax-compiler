# Axentax Compiler🔥

Compile Axentax syntax in JavaScript and generate MIDI output for guitar phrasing.

## 🪓Axentaxでできること

- ギターフィンガリングを文字で表現
- 少ない記述でスケール展開しながらループ演奏
- ビブラート・アーム奏法
- MIDIデータとしてダウンロード可能

> Playground ...Stage! 🎸🔥\
> Bring your ideas to life with interactive MIDI playback and expressive guitar fingering.\
> https://axentax.github.io/axentax-playground/

## Axentaxの導入

### 🪓Install

`npm i axentax-compiler`

### 🪓import

`import { Conductor } from 'axentax-compiler';`

### 🪓Request

``` Typescript
const compiled = Conductor.convertToObj(
  true, // スタイル（奏法）を適用するか（通常はtrue）
  true, // MIDIを作成するか（通常はtrue）
  '@@ { C D E }', // シンタックス
  [], // 許可するアノテーション文字列 ※未指定
  Map<any, any>, // データキャッシュ用オブジェクト。常時保持しているインスタンスを渡すことで処理速度向上
  {}  // マップ用オブジェクト。常時保持しているインスタンスを渡すことで処理速度向上
)
```

### 🪓Response

#### Midiデータ

```
const midi: ArrayBuffer | undefined = compiled.midi
```

#### Response.compiledData

```
compiled.response
```

※interface Conduct を参照

#### Response.error

```
compiled.error
```

## 🪓Axentaxで演奏

### 💥Quickstart

```axe
@@ {
  C ''B7b5 '''Em~
}
```

- コード指定を含むフィンガリングの指定は`@@ { }`の中に記述する
- `C`や`B7b5`、`0|2|2|0|0|0`のようにコード表記可能
- 先頭に'(シングルクォーテーション)を記載することで弦別にピッキング遅延させる（ストローク奏法）

このように簡単な記載で様々なギター演奏を再現できます。

## 🪓Axentaxの基本構文

### 💥基本構文: regionとblock

コード指定を含むフィンガリングの指定は`@@ { }`の中に記述します。

> この`{}`囲いのことを`block`と呼びます。

```axe
@@ {
  C
}
```

blockは入れ子にできます。

```
@@ {
  C
  {{{ D }}}
}

```

複数ギター同時演奏（３ブロックまで可能）

```axe
@@ {
  C
} >> {
  Am
} >> {
  Em
}
```

> @@ から始まるひとかたまりをregionと呼びます。\
> 上記コードは１つの`region`に、２つの`block`が記載されていることになります。


### 💥基本構文: ブロックプロップ

#### -- BPM指定 --

BPMを`@@`の次に記載（例では180bpm）

> `@@`の後に記載する項目を block propと呼びます。\
> BPMは１つ目のblockのみ指定可能です。
```
@@ 180 {
  C C C C
}
```

#### --- 付割指定 ---

block propに記載した`1/4`のような分数表記は音の長さとなります。

```
@@ 180 1/4 {
  C C C C
}
```

#### --- 変速チューニングと弦数の指定 ---

block propにチューニングを記載すると、そのblockは指定されたチューニングに従います。

```
@@ D|A|D|G|A|D {
  C D E
}
```

チューニングは block毎に設定する必要があります。

```
@@ D|A|D|G|A|D {
  // ここは DADGAD
} >> {
  // ここは EADGBE
} >> D|A|D|G|A|D {
  // ここは DADGAD
}
```

9弦まで指定できます。

```
@@ D|G|C|F|A#|D#|G#|C|F {
  0|0|0|0|0|0|0|0|0
}
```

- デフォルト6弦チューニング: `E|A|D|G|B|E`
- 最低音の9弦チューニング: `D|G|C|F|A#|D#|G#|C|F`
- 最高音の9弦チューニング: `C#|F#|B|E|A|D|G|B|E`
- チューニングより多い弦数のフィンガリングはできません。
  弦数を増やしたフィンガリングをする場合は、そのブロックで使いたい弦数のチューニングを実施してください。



### 💥基本構文: コード記法とフィンガリング記法

コードの表記はこれまで記載した通りです。\
※一部非対応のコード表記があります。

```
@@ {
  C Dm Em7 Fmaj7 Gdim
}
```

`|`を使ってフレット指定をすることができます。Tab譜面を横にしたような表現です。\
左が低音弦で右が高音源となります。

```
@@ {
  2|2|2|0|0|0
  5|2|2|5|0|0
}
```

記載以降フレット指定しない場合`|`は省略できますが
6弦だけ記載する場合も必ず１つは`|`の表記が必要です。

```
// 不正な記載
@@ {
  2 3 4 // `|`がないとエラーになる
}

// 正常な記載
@@ {
  2|
  |2
  ||2
  |||2
  ||||2
  |||||2
}
```

### 💥基本構文: 音長

音の長さを接尾辞で調整できます。

```
@@ {
  C~~~ // "~"をフィンガリングの末尾に記載（4倍の長さ）
  C^   // "^"をフィンガリングの末尾に記載（半分の長さ）
  C=   // "^"をフィンガリングの末尾に記載（3分の1の長さ）
}
```

以下の各行は同じ音長となります。

```
@@ {
  C
  C= C= C=
  C^ C^
}
```

複数の接尾辞をつけることができますが、付割の制御が難しくなる傾向にあります。\
※スタイルでも音長の調整ができます。詳しくは「スタイル構文」参照してください。

```
@@ {
  C== C== C== C~~
}
```

### 💥基本構文: 休符

`r`で休符を表現します

```
@@ {
  C r D r
}
```

休符の長さも接尾辞で調整できます

```
@@ {
  C r^ C r^
}
```
## 🔥Contact
**info [dt] axentax [at] gmail [dt] com**  
_Replace `[at]` with `@` and `[dt]` with `.` when sending email._

