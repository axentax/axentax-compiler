# conductor API仕様書

## 概要

`conductor`は、独自の音楽記譜シンタックス（ギター向け）を解析し、MIDIデータや演奏情報を生成するTypeScriptライブラリです。

## 目次

1. [概要](./01-overview.md)
2. [エンドポイント/メソッド](./02-endpoints.md)
3. [リクエスト仕様](./03-request.md)
4. [レスポンス仕様](./04-response.md)
5. [記譜シンタックス例](./05-syntax-examples.md)
6. [型定義集](./08-type-definitions.md)
7. [注意事項・FAQ](./12-faq.md)

## お知らせ

composeアノテーションは未実装なので未指定でOKです。

## クイックスタート

```typescript
import { Conductor } from 'conductor';

const result = Conductor.convertToObj(
  true,  // hasStyleCompile
  true,  // hasMidiBuild
  syntax,
  [
    { name: 'compose', dualIdRestrictions: [1, 2] },
    { name: '/compose', dualIdRestrictions: [1, 2] }
  ],
  new Map(), // chordDic
  {}         // mapSeed
);

if (result.error) {
  console.error('Error:', result.error.message);
} else {
  // MIDIファイルとして保存
  fs.writeFileSync('output.mid', Buffer.from(result.midi));
}
``` 

## ドキュメント一覧

- [概要](./01-overview.md) - conductorの概要と特徴
- [エンドポイント/メソッド](./02-endpoints.md) - APIメソッドの詳細
- [リクエスト仕様](./03-request.md) - リクエストパラメータの詳細
- [レスポンス仕様](./04-response.md) - レスポンス形式の詳細
- [記譜シンタックス例](./05-syntax-examples.md) - 記譜シンタックスの使用例
- [スタイル（奏法）解説](./06-styles.md) - 各種奏法スタイルの詳細解説
- [接頭辞（prefix）解説](./07-prefixes.md) - ノートやコードの直前に付ける演奏アクション指定
- [型定義集](./08-type-definitions.md) - TypeScript型定義の詳細
- [高度な使い方・応用例](./09-advanced.md) - 上級者向けの機能解説と応用例
- [パフォーマンス最適化](./10-performance.md) - パフォーマンス向上のヒント
- [マイグレーションガイド](./11-migration.md) - バージョン間の移行手順
- [FAQ](./12-faq.md) - よくある質問とトラブルシューティング
- [用語集](./13-glossary.md) - 用語の定義と説明
- [設計思想](./14-philosophy.md) - conductorの設計理念 