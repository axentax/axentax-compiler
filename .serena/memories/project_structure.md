# プロジェクト構造

## ルートディレクトリ
```
axentax-compiler/
├── src/                     # メインソースコード
├── tests/                   # テストファイル
├── vite-compiler/           # ブラウザ向けビルド設定
├── dist/                    # ビルド出力 (Node.js用)
├── docs/                    # ドキュメント
└── .vscode/                 # VS Code設定
```

## src/ ディレクトリ構造
```
src/
├── index.ts                 # Expressサーバーエントリーポイント
├── conductor/               # コア機能
│   ├── conductor.ts         # メインAPI
│   ├── interface/           # TypeScript型定義
│   ├── compile-block/       # ブロックコンパイル機能
│   ├── compile-midi/        # MIDI生成
│   ├── compile-style/       # スタイル処理
│   ├── compile-view/        # ビュー生成
│   ├── chord-to-fingering/  # コード→フィンガリング変換
│   ├── diatonic-and-scale/  # スケール理論
│   ├── setting-resolve/     # 設定解決
│   ├── dictionary/          # 辞書データ
│   ├── utils/               # ユーティリティ
│   └── validation/          # バリデーション
└── assets/                  # 静的リソース
    ├── js/                  # JavaScript ライブラリ
    ├── tpl/                 # HTMLテンプレート
    └── sf/                  # SoundFont ファイル
```

## tests/ ディレクトリ構造
```
tests/
├── basic/                   # 基本機能テスト
├── integration/             # 統合テスト
│   ├── request/             # テスト用シンタックス
│   └── expect/              # 期待値データ
└── setup.ts                 # テスト設定
```