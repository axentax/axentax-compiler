#!/usr/bin/env npx ts-node
// Usage: npx ts-node .claude/syntax-test.ts
// Edit singleTest to debug specific syntax

import { Conductor } from '../src/conductor/conductor';

const singleTest = {
  syntax: `set.song.key: C
set.style.until: 1/4
set.click.inst: 42

@@ 100 1/1 {
  C  F  G  C  Am  Dm  G7  C
}

@@ 100 1/8 {
  |||0||  |||2||  |||4||  |||5||
  |||4||  |||2||  |||0||  |||2||
  |||0||  |||0||  |||2||  |||4||
  |||5||  |||4||  |||2||  r
}
`
};

function test(syntax: string) {
  const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
  if (result.error) {
    console.log(`ERROR: ${result.error.message} (${result.error.line}:${result.error.linePos})`);
  } else {
    console.log('OK');
  }
}

if (require.main === module) {
  test(singleTest.syntax);
}