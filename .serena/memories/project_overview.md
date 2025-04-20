# Axentax Compiler プロジェクト概要

## 目的
ギターフィンガリングを文字で表現し、少ない記述でスケール展開しながらループ演奏を可能にするTypeScriptコンパイラ。MIDIデータとしてダウンロード可能。

## 主要機能
- ギターフィンガリングの文字表現
- ビブラート・アーム奏法対応
- MIDIデータ生成
- スケール展開とループ演奏
- 複数ギター同時演奏（3ブロックまで）
- 変速チューニング対応（最大9弦）

## エントリーポイント
- メイン: `src/index.ts` (Expressサーバー + デモ)
- ライブラリ: `src/conductor/conductor.ts` (コア機能)
- 公開API: `Conductor.convertToObj()` メソッド

## Playground
https://axentax.github.io/axentax-playground/

## バージョン
1.0.1