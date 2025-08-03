# 高度な使い方・応用例

## 概要

conductor APIの高度な活用方法や応用例を紹介します。

---

## 1. カスタムコード辞書の活用

### 独自コードの追加
```typescript
const chordDic = new Map([
  ['Maj9', {
    name: 'Maj9',
    strings: [0, 2, 1, 1, 0, 0],
    root: 'C',
    type: 'maj9'
  }],
  ['Sus4', {
    name: 'Sus4',
    strings: [0, 0, 2, 2, 3, 0],
    root: 'D',
    type: 'sus4'
  }]
]);
```

---

## 2. mapSeedによるパターン制御

### 外部パターンの注入
```typescript
const mapSeed = {
  patternA: [1, 2, 3, 4],
  patternB: [5, 6, 7, 8]
};
```

---

## 3. 複数トラック（デュアル）活用

### パンニング・トラック分割
```typescript
const syntax = `set.dual.pan: true
set.dual.panning: [0.2, 0.8]
@@ {
  C:dual(1)
  G:dual(2)
}`;
```

---

## 4. 複雑な奏法の組み合わせ

### スライド＋ベンド＋レガート
```typescript
const syntax = `@@ {
  |||||7:to(continue):bd(0..1/4 cho 1):leg
  |||||9:to(release):bd(0..2/4 vib 0.5)
}`;
```

---

## 5. エラー・警告のカスタム処理

### 警告をログファイルに保存
```typescript
const result = Conductor.convertToObj(/* パラメータ */);

if (result.response?.warnings.length > 0) {
  console.warn('警告が発生しました:');
  result.response.warnings.forEach(warning => {
    console.warn(`- ${warning.message} (行: ${warning.line})`);
  });
  
  // 警告をログファイルに保存
  require('fs').writeFileSync('warnings.log', result.response.warnings.join('\n'));
}
```

---

## 6. MIDIデータの直接操作

### MIDIバイナリをファイル保存
```typescript
if (result.midi) {
  require('fs').writeFileSync('output.mid', Buffer.from(result.midi));
}
```

---

## 7. テスト自動化・CI連携

### Jestによる自動テスト例
```typescript
describe('Conductor API', () => {
  it('should generate MIDI for valid syntax', () => {
    const result = Conductor.convertToObj(/* パラメータ */);
    expect(result.midi).toBeDefined();
    expect(result.error).toBeNull();
  });
});
```

---

## 8. 外部サービス連携

### Web API経由でMIDIを返す例（Express）
```typescript
import express from 'express';
import { Conductor } from 'conductor';
const app = express();
app.use(express.json());

app.post('/api/midi', (req, res) => {
  const { syntax } = req.body;
  const result = Conductor.convertToObj(true, true, syntax, /* ... */);
  if (result.midi) {
    res.set('Content-Type', 'audio/midi');
    res.send(Buffer.from(result.midi));
  } else {
    res.status(400).json({ error: result.error });
  }
});

app.listen(3000);
```

---

## 9. 設定の動的生成

### ユーザー入力からsyntaxを動的生成
```typescript
function generateChordProgression(key: string, chords: string[]): string {
  return `set.song.key: ${key}\n@@ {\n  ${chords.join(' ')}\n}`;
}

const syntax = generateChordProgression('C', ['C', 'Dm', 'Em', 'F']);
const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
```

---

## 10. 複雑なバリデーション

### 独自バリデーションの追加
```typescript
function validateSyntax(syntax: string): string[] {
  const errors: string[] = [];
  // 独自の構文チェックロジック
  if (!syntax.includes('@@')) errors.push('リージョンがありません');
  // ...
  return errors;
}
``` 