/**
 * Integration Test Generator - Request Files
 * 
 * This script generates request files for integration tests by splitting
 * the syntax-all.ts file into groups of 5 regions each.
 * 
 * Usage: node scripts/integration-test-tools/generate-integration-tests.js
 * 
 * Output: 63 request files in tests/integration/request/
 */

const fs = require('fs');
const path = require('path');

// syntax-all.tsの内容を読み取り
const syntaxAllPath = path.join(__dirname, '../../tests/integration/x-original-data/syntax-all.ts');
const syntaxAllContent = fs.readFileSync(syntaxAllPath, 'utf8');

// exportの部分を除去してコンテンツを取得
const syntaxContent = syntaxAllContent.replace(/^export const syntaxAll = `/, '').replace(/`$/, '');

// regionの境界を見つける
const lines = syntaxContent.split('\n');
const regionStarts = [];

lines.forEach((line, index) => {
  if (line.trim().startsWith('@@')) {
    regionStarts.push(index);
  }
});

// console.log(`Found ${regionStarts.length} regions`);

// 設定部分を抽出（最初の@@より前）
const settingsEnd = regionStarts[0];
const settingsLines = lines.slice(0, settingsEnd);
const settings = settingsLines.join('\n').trim();

// regionを5個ずつグループに分ける
const regionsPerGroup = 5;
const groups = [];

for (let i = 0; i < regionStarts.length; i += regionsPerGroup) {
  const groupRegionStarts = regionStarts.slice(i, i + regionsPerGroup);
  const startLine = groupRegionStarts[0];
  const endLine = i + regionsPerGroup < regionStarts.length ? 
    regionStarts[i + regionsPerGroup] : 
    lines.length;
  
  const regionLines = lines.slice(startLine, endLine);
  const regionContent = regionLines.join('\n').trim();
  
  groups.push({
    groupIndex: Math.floor(i / regionsPerGroup) + 1,
    regions: groupRegionStarts.length,
    content: settings + '\n\n' + regionContent
  });
}

// console.log(`Created ${groups.length} groups`);

// requestディレクトリの作成
const requestDir = path.join(__dirname, '../../tests/integration/request');
const expectDir = path.join(__dirname, '../../tests/integration/expect');

if (!fs.existsSync(requestDir)) {
  fs.mkdirSync(requestDir, { recursive: true });
}
if (!fs.existsSync(expectDir)) {
  fs.mkdirSync(expectDir, { recursive: true });
}

// 各グループのリクエストファイルを生成
groups.forEach(group => {
  const filename = `syntax-group-${group.groupIndex.toString().padStart(2, '0')}.txt`;
  const filePath = path.join(requestDir, filename);
  fs.writeFileSync(filePath, group.content);
  // console.log(`Created: ${filename} (${group.regions} regions`);
});

// console.log('Generation complete!');