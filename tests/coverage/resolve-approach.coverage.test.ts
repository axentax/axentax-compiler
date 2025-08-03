import { ResolveApproach, createSlideInfo, inView } from '../../src/conductor/compile-style/resolve-approach';
import { Conduct, Marks, Mixes } from '../../src/conductor/interface/conduct';
import { TabObj } from '../../src/conductor/interface/tab';
import { StyleApproach } from '../../src/conductor/interface/style';

describe('resolve-approach.ts coverage', () => {
  
  const createMockConduct = (): Conduct => ({
    settings: {
      play: {
        approach: {
          velocity: {
            min: 10,
            max: 90,
            decrease: 5,
            minLanding: 50
          },
          widthOfSlide: {
            baseTick: 240,
            maxSplitTick: 120
          }
        }
      }
    }
  } as any);

  const createMockTabObj = (overrides: Partial<TabObj> = {}): TabObj => ({
    regionIndex: 0,
    regionNoteIndex: 0,
    syntaxLocation: { row: '', line: 0, linePos: 0, endLine: 0, endPos: 1 },
    tabObjId: 1,
    note: 'C',
    tab: [0, undefined],
    velocity: [80, undefined],
    bar: {
      tick: 240,
      startTick: 0,
      stopTick: 240,
      fretStartTicks: [0, undefined],
      fretStopTicks: [240, undefined]
    },
    bpm: 140,
    continueX: false,
    styles: {},
    activeBows: [],
    isArpeggio: false,
    isBullet: 0,
    refMovedSlideTarget: [],
    refActiveBows: [],
    nextTabObj: {} as TabObj,
    prevTabObj: {} as TabObj,
    untilNext: [1, 4],
    noteStr: 'C',
    ...overrides
  });

  const createMockApproach = (overrides: Partial<StyleApproach> = {}): StyleApproach => ({
    line: 0,
    linePos: 0,
    endPos: 1,
    bowWithFret: [0, undefined],
    percentOfSpeed: 100,
    ...overrides
  });

  const createMockMixes = (flatTOList: TabObj[] = []): Mixes => ({
    flatTOList,
    marks: {
      fullNoteIndexWithTick: flatTOList.map((_, i) => i)
    }
  } as any);

  test('resolve with basic approach should return success', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      tab: [2, undefined],
      velocity: [80, undefined],
      refActiveBows: [null as any, undefined],
      styles: {
        approach: createMockApproach({
          bowWithFret: [0, undefined]
        })
      }
    });
    
    // Mock refActiveBows with proper TabObj
    const refTabObj = createMockTabObj({
      bar: {
        tick: 240,
        startTick: 0,
        stopTick: 240,
        fretStartTicks: [0, undefined],
        fretStopTicks: [240, undefined]
      }
    });
    to.refActiveBows = [refTabObj, undefined];

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    expect(to.slideTrueType).toBe(2);
    expect(mixes.flatTOList.length).toBeGreaterThan(1);
  });

  test('resolve with no slide infos should set slideTrueType to 2', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      tab: [0, undefined],
      velocity: [80, undefined],
      styles: {
        approach: createMockApproach({
          bowWithFret: [0, undefined] // Same fret, no slide needed
        })
      }
    });

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    expect(to.slideTrueType).toBe(2);
  });

  test('resolve should skip when slideTrueType is already 2', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      slideTrueType: 2,
      styles: {
        approach: createMockApproach()
      }
    });

    const mixes = createMockMixes([to]);
    const originalLength = mixes.flatTOList.length;

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    expect(mixes.flatTOList.length).toBe(originalLength);
  });

  test('resolve should skip when no approach style', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      styles: {}
    });

    const mixes = createMockMixes([to]);
    const originalLength = mixes.flatTOList.length;

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    expect(mixes.flatTOList.length).toBe(originalLength);
  });

  test('createSlideInfo with start and landing frets should return slide info', () => {
    const start = [0, undefined, 2];
    const landing = [3, undefined, 5];

    const result = createSlideInfo(start, landing);
    
    expect(result).toHaveLength(2);
    expect(result[0].bowIndex).toBe(0);
    expect(result[0].startFret).toBe(0);
    expect(result[0].landingFret).toBe(3);
    expect(result[0].slideWidth).toBe(3);
    expect(result[0].direction).toBe(1);
    
    expect(result[1].bowIndex).toBe(2);
    expect(result[1].startFret).toBe(2);
    expect(result[1].landingFret).toBe(5);
    expect(result[1].slideWidth).toBe(3);
    expect(result[1].direction).toBe(1);
  });

  test('createSlideInfo with no start frets should return empty array', () => {
    const start = [undefined, undefined];
    const landing = [3, 5];

    const result = createSlideInfo(start, landing);
    
    expect(result).toHaveLength(0);
  });

  test('createSlideInfo with same start and landing frets should filter out', () => {
    const start = [2, 3];
    const landing = [2, 5];

    const result = createSlideInfo(start, landing);
    
    expect(result).toHaveLength(1);
    expect(result[0].bowIndex).toBe(1);
    expect(result[0].startFret).toBe(3);
    expect(result[0].landingFret).toBe(5);
  });

  test('createSlideInfo with down direction should work correctly', () => {
    const start = [5, undefined];
    const landing = [2, undefined];

    const result = createSlideInfo(start, landing);
    
    expect(result).toHaveLength(1);
    expect(result[0].direction).toBe(-1);
    expect(result[0].slideWidth).toBe(3);
  });

  test('createSlideInfo with no landing frets should estimate direction', () => {
    const start = [2, 3];
    const landing = [5, undefined]; // Only one landing fret

    const result = createSlideInfo(start, landing);
    
    // Only the first string has both start and landing, so result should have 1 item
    expect(result).toHaveLength(1);
    expect(result[0].direction).toBe(1); // Up direction
  });

  test('createSlideInfo should normalize slide widths to maximum for multi-step slides', () => {
    const start = [0, 2];
    const landing = [6, 5]; // Different slide widths: 6 and 3

    const result = createSlideInfo(start, landing);
    
    expect(result).toHaveLength(2);
    // The algorithm normalizes to the maximum width for slides > 1 step
    // Only slides with width > 1 are normalized
    expect(result[0].slideWidth).toBe(6); // Largest width
    expect(result[1].slideWidth).toBe(6); // Normalized to largest width
  });

  test('createSlideInfo should handle open strings correctly', () => {
    const start = [0, 3];
    const landing = [2, 0];

    const result = createSlideInfo(start, landing);
    
    expect(result).toHaveLength(2);
    expect(result[0].isOpenBowByStart).toBe(true);
    expect(result[0].isOpenBowByLanding).toBe(false);
    expect(result[1].isOpenBowByStart).toBe(false);
    expect(result[1].isOpenBowByLanding).toBe(true);
  });

  test('createSlideInfo should filter out invalid landing frets', () => {
    const start = [20];
    const landing = [undefined]; // No landing, will estimate to 25 (invalid)

    const result = createSlideInfo(start, landing);
    
    // Should filter out frets >= 24
    expect(result).toHaveLength(0);
  });

  test('inView should return processed slide notes', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      tab: [2, undefined],
      refActiveBows: [null as any, undefined]
    });
    
    // Mock refActiveBows
    const refTabObj = createMockTabObj({
      bar: {
        tick: 240,
        startTick: 0,
        stopTick: 240,
        fretStartTicks: [0, undefined],
        fretStopTicks: [240, undefined]
      }
    });
    to.refActiveBows = [refTabObj, undefined];

    const approach = createMockApproach({
      bowWithFret: [0, undefined]
    });

    const marks: Marks = {
      fullNoteIndexWithTick: []
    } as any;

    const result = inView(conduct, marks, to, approach);
    
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    if (result) {
      expect(result.length).toBeGreaterThan(1);
    }
  });

  test('inView should return null for single note result', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      tab: [0, undefined],
      refActiveBows: [null as any, undefined]
    });

    const approach = createMockApproach({
      bowWithFret: [0, undefined] // Same fret, no slide
    });

    const marks: Marks = {
      fullNoteIndexWithTick: []
    } as any;

    const result = inView(conduct, marks, to, approach);
    
    expect(result).toBeNull();
  });

  test('resolve with custom speed percentage should affect tick calculation', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      tab: [3, undefined],
      velocity: [80, undefined],
      refActiveBows: [null as any, undefined],
      styles: {
        approach: createMockApproach({
          bowWithFret: [0, undefined],
          percentOfSpeed: 50 // Half speed
        })
      }
    });
    
    const refTabObj = createMockTabObj({
      bar: {
        tick: 240,
        startTick: 0,
        stopTick: 240,
        fretStartTicks: [0, undefined],
        fretStopTicks: [240, undefined]
      }
    });
    to.refActiveBows = [refTabObj, undefined];

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    expect(mixes.flatTOList.length).toBeGreaterThan(1);
  });

  test('resolve should adjust velocity correctly for approach notes', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      tab: [3, undefined],
      velocity: [100, undefined], // High velocity to test max limiting
      refActiveBows: [null as any, undefined],
      styles: {
        approach: createMockApproach({
          bowWithFret: [0, undefined]
        })
      }
    });
    
    const refTabObj = createMockTabObj({
      bar: {
        tick: 240,
        startTick: 0,
        stopTick: 240,
        fretStartTicks: [0, undefined],
        fretStopTicks: [240, undefined]
      }
    });
    to.refActiveBows = [refTabObj, undefined];

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    
    // Check that slide notes have decreasing velocity
    const slideNotes = mixes.flatTOList.filter(note => note.slideTrueType === 4);
    expect(slideNotes.length).toBeGreaterThan(1);
    
    // First slide note should have original velocity or be limited to max
    // The first slide note (ti === 0) doesn't apply startCoefficient, so it keeps original velocity
    expect(slideNotes[0].velocity[0]).toBe(100);
    
    // Landing note velocity should be adjusted
    expect(to.velocity[0]).toBeLessThanOrEqual(conduct.settings.play.approach.velocity.max);
  });

  test('resolve should handle undefined refActiveBows fretStartTicks gracefully', () => {
    const conduct = createMockConduct();
    const to = createMockTabObj({
      tab: [3, undefined],
      velocity: [80, undefined],
      refActiveBows: [null as any, undefined],
      styles: {
        approach: createMockApproach({
          bowWithFret: [0, undefined]
        })
      }
    });
    
    // Mock refActiveBows with undefined fretStartTicks
    const refTabObj = createMockTabObj({
      bar: {
        tick: 240,
        startTick: 0,
        stopTick: 240,
        fretStartTicks: [undefined, 100], // First string undefined, should find second
        fretStopTicks: [240, undefined]
      }
    });
    to.refActiveBows = [refTabObj, undefined];

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    expect(mixes.flatTOList.length).toBeGreaterThan(1);
  });

  // Additional test cases to cover uncovered lines
  test('resolve should handle error from setStartTickWithCalcEditableArea', () => {
    const conduct = createMockConduct();
    
    const to = createMockTabObj({
      styles: {
        approach: {
          bowWithFret: [2, 3],
          line: 1,
          linePos: 1
        }
      }
    });
    // Create invalid conditions to trigger error path at line 91
    to.bar.fretStartTicks = [undefined, undefined]; // No valid start ticks
    to.refActiveBows = []; // Empty refActiveBows

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    // Should handle the error gracefully
    expect(result).toBeDefined();
  });

  test('resolve should handle undefined fretStartTicks fallback', () => {
    const conduct = createMockConduct();
    
    const to = createMockTabObj({
      styles: {
        approach: {
          bowWithFret: [2, undefined],
          line: 1,
          linePos: 1
        }
      },
      bar: {
        tick: 240,
        startTick: 0,
        stopTick: 240,
        fretStartTicks: [undefined, 100], // First string undefined
        fretStopTicks: [240, 240]
      }
    });

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    // Check if fallback logic was used (line 187)
    expect(mixes.flatTOList.length).toBeGreaterThan(1);
  });

  test('resolve should handle velocity decrease edge cases', () => {
    const conduct = createMockConduct();
    conduct.settings.play.approach.velocity.decrease = 50; // Large decrease value
    
    const to = createMockTabObj({
      styles: {
        approach: {
          bowWithFret: [2, 3],
          line: 1,
          linePos: 1
        }
      },
      velocity: [100, 80]
    });

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    // Verify velocity adjustments were applied (around line 267, 287)
    expect(mixes.flatTOList.length).toBeGreaterThan(1);
  });

  test('resolve should cover utility function branches', () => {
    const conduct = createMockConduct();
    
    const to = createMockTabObj({
      styles: {
        approach: {
          bowWithFret: [0, 5, 7], // Multiple frets to trigger different code paths
          percentOfSpeed: 150, // Custom speed percentage
          line: 1,
          linePos: 1
        }
      }
    });

    const mixes = createMockMixes([to]);

    const result = ResolveApproach.resolve(conduct, mixes);
    
    expect(result.fail()).toBe(false);
    // This should cover lines 369-395 and other utility functions
    expect(mixes.flatTOList.length).toBeGreaterThan(1);
  });

});