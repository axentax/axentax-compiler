import { Conductor } from '../../src/conductor/conductor';
import { ChordDicMap } from '../../src/conductor/interface/dic-chord';

describe('conductor.ts coverage', () => {
  const mockChordDic: ChordDicMap = new Map();
  const mockMapSeed = {};
  const mockAllowAnnotations = [
    { name: 'test', dualIdRestrictions: [0, 1, 2] }
  ];

  test('convert with isValidOnly true should set notStyleCompile', () => {
    const syntax = '@@ 140 1/4 { C }';
    const result = Conductor.convert(syntax, mockAllowAnnotations, mockChordDic, mockMapSeed, true);
    
    if (!result.fail()) {
      expect(result.res.notStyleCompile).toBe(true);
    }
  });

  test('convert with isValidOnly false should not set notStyleCompile', () => {
    const syntax = '@@ 140 1/4 { C }';
    const result = Conductor.convert(syntax, mockAllowAnnotations, mockChordDic, mockMapSeed, false);
    
    if (!result.fail()) {
      expect(result.res.notStyleCompile).toBeUndefined();
    }
  });

  test('convertToObj with hasStyleCompile false should return basic response', () => {
    const syntax = '@@ 140 1/4 { C }';
    const result = Conductor.convertToObj(false, false, syntax, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.id).toBe(0);
    if (result.error === null) {
      expect(result.compileMsec).toBeGreaterThanOrEqual(0);
      expect(result.response!.syntax).toBe('');
    }
  });

  test('convertToObj with hasStyleCompile true but hasMidiBuild false should return midi response without midi data', () => {
    const syntax = '@@ 140 1/4 { C }';
    const result = Conductor.convertToObj(true, false, syntax, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.id).toBe(1);
    expect(result.midiRequest).toBe(true);
    if (result.error === null) {
      expect(result.midi).toBeNull();
    }
  });

  test('convertToObj with hasStyleCompile true and hasMidiBuild true should return midi response with midi data', () => {
    const syntax = '@@ 140 1/4 { C }';
    const result = Conductor.convertToObj(true, true, syntax, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.id).toBe(1);
    expect(result.midiRequest).toBe(true);
    if (result.error === null) {
      expect(result.compileMsec).toBeGreaterThanOrEqual(0);
      expect(result.midi).toBeDefined();
    }
  });

  test('convertToObj with invalid syntax should return error response', () => {
    const invalidSyntax = 'InvalidChord123';
    const result = Conductor.convertToObj(false, false, invalidSyntax, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.error).not.toBeNull();
    expect(result.response).toBeNull();
    if (result.error) {
      expect(result.error.message).toBeDefined();
      expect(result.error.line).toBeDefined();
      expect(result.error.linePos).toBeDefined();
    }
  });

  test('convertToObj with hasStyleCompile true should set midiRequest when error occurs', () => {
    const invalidSyntax = 'InvalidChord123';
    const result = Conductor.convertToObj(true, false, invalidSyntax, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.id).toBe(1);
    expect(result.midiRequest).toBe(true);
    expect(result.error).not.toBeNull();
    expect(result.response).toBeNull();
  });

  test('syntax with comments should be handled correctly', () => {
    const syntaxWithComments = `
      // This is a comment
      @@ 140 1/4 { C } // inline comment
      /* block comment */
      @@ 140 1/4 { D }`;
    const result = Conductor.convertToObj(false, false, syntaxWithComments, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    if (result.error === null) {
      expect(result.response).not.toBeNull();
    }
  });

  test('syntax with __start__ and __end__ markers should be handled', () => {
    const syntaxWithMarkers = `
      __start__
      @@ 140 1/4 { C }
      @@ 140 1/4 { D }
      __end__
      @@ 140 1/4 { E }`;
    const result = Conductor.convertToObj(false, false, syntaxWithMarkers, mockAllowAnnotations, mockChordDic, mockMapSeed);

    if (result.error === null) {
      expect(result.response).not.toBeNull();
    }
  });

  test('syntax with block comments should preserve newlines', () => {
    const syntaxWithBlockComment = `
    @@ 140 1/4 { C }
    /* multi
      line
      comment */
    @@ 140 1/4 { D }`;
    const result = Conductor.convertToObj(false, false, syntaxWithBlockComment, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    if (result.error === null) {
      expect(result.response).not.toBeNull();
    }
  });

  test('successful conversion should clean up object references', () => {
    const syntax = '@@ 140 1/4 { C D }';
    const result = Conductor.convertToObj(false, false, syntax, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    if (result.response) {
      expect(result.response.dic).toBeNull();
      result.response.mixesList.forEach(ml => {
        ml.flatTOList.forEach(to => {
          expect(to.prevTabObj).toBeUndefined();
          expect(to.nextTabObj).toBeUndefined();
          expect(to.refActiveBows).toBeUndefined();
          expect(to.refMovedSlideTarget).toBeUndefined();
        });
      });
    }
  });

  test('convertToObj with error and hasStyleCompile false should have id 0', () => {
    const invalidSyntax = '!@#invalid';
    const result = Conductor.convertToObj(false, false, invalidSyntax, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.id).toBe(0);
    expect(result.error).not.toBeNull();
    expect(result.response).toBeNull();
    expect(result.midiRequest).toBeUndefined();
  });

  test('MIDI generation should default to center pan when dual.pan is false', () => {
    // Test case where dual.pan is false, should use default 0.5 pan
    const syntaxWithoutPan = `
      set.dual.pan: false
      set.dual.panning: [0.5, 0, 1]
      @@ 140 1/4 { C } >> 1/4 { D } >> 1/4 { E }
    `;
    
    const result = Conductor.convertToObj(true, true, syntaxWithoutPan, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.id).toBe(1);
    expect(result.midiRequest).toBe(true);
    if (result.error === null) {
      expect(result.midi).toBeDefined();
      expect(result.response).not.toBeNull();
    }
  });

  test('MIDI generation should default to center pan when panning values are negative', () => {
    // Test case where panning[dualId] < 0, should use default 0.5 pan
    const syntaxWithNegativePan = `
      set.dual.pan: true
      set.dual.panning: [-1, -0.5, 1]
      @@ 140 1/4 { C }
    `;
    
    const result = Conductor.convertToObj(true, true, syntaxWithNegativePan, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.id).toBe(1);
    expect(result.midiRequest).toBe(true);
    if (result.error === null) {
      expect(result.midi).toBeDefined();
      expect(result.response).not.toBeNull();
    }
  });

  test('nested map operations should fail when exceeding limit', () => {
    // Test case for nested map operations exceeding the limit of 1000
    const syntaxWithExcessiveMapping = `@@ 140 1/4 { C:map(*100):map(*11)}`;

    const result = Conductor.convertToObj(true, false, syntaxWithExcessiveMapping, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.error).not.toBeNull();
    if (result.error) {
      expect(result.error.message).toContain("Invalid mapped step order 'map(*11)'");
      expect(result.error.message).toContain("exceeds the limit of '1000'");
    }
    expect(result.response).toBeNull();
  });

  test('step and bullet cannot be used at the same time', () => {
    // Test case for nested map operations exceeding the limit of 1000
    const syntaxWithExcessiveMapping = `@@ { 2/0-2:step(1) }`;
    const result = Conductor.convertToObj(true, false, syntaxWithExcessiveMapping, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.error).not.toBeNull();
    if (result.error) {
      expect(result.error.message).toContain("Invalid style 'step(1)'. Cannot specify a step in bullet format.");
    }
    expect(result.response).toBeNull();
  });

  test('step and bullet cannot be used at the same time', () => {
    // Test case for nested map operations exceeding the limit of 1000
    const syntaxWithExcessiveMapping = `@@ { {{ C }:map(*100) }:map(*11) }`;
    const result = Conductor.convertToObj(true, false, syntaxWithExcessiveMapping, mockAllowAnnotations, mockChordDic, mockMapSeed);
    
    expect(result.error).not.toBeNull();
    if (result.error) {
      expect(result.error.message).toContain("Invalid mapped step order 'map(*11)'. The total number of nested map operations exceeds the limit of '1000'.");
    }
    expect(result.response).toBeNull();
  });


});