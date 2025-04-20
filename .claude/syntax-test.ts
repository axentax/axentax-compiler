#!/usr/bin/env npx ts-node
// Usage: npx ts-node .claude/syntax-test.ts
// Edit singleTest to debug specific syntax

import { Conductor } from '../src/conductor/conductor';

const singleTest = {
  syntax: '@@ 140 1/4 { C D }'
};

function test(syntax: string) {
  const result = Conductor.convertToObj(true, false, syntax, [], new Map(), {});
  if (result.error) {
    console.log(`ERROR: ${result.error.message} (${result.error.line}:${result.error.linePos})`);
  } else {
    console.log('OK');
  }
}

if (require.main === module) {
  test(singleTest.syntax);
}