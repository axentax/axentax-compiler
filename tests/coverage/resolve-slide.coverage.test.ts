import { ResolveSlide, toView } from '../../src/conductor/compile-style/resolve-slide';
import { Conduct, Marks, Mixes } from '../../src/conductor/interface/conduct';
import { TabObj } from '../../src/conductor/interface/tab';
import { StyleSlide } from '../../src/conductor/interface/style';
import { Success } from '../../src/conductor/interface/utils.response.interface';

describe('ResolveSlide', () => {
  const createMockConduct = (): Conduct => ({
    settings: {
      play: {
        slide: {
          velocity: {
            min: 10,
            max: 90,
            decrease: 5,
            landing: 50
          },
          realization: {
            autoStartPointAdjustmentThresholdSec: 0.5
          }
        },
        release: {
          velocity: {
            min: 10,
            max: 90,
            decrease: 5
          }
        }
      }
    }
  } as any);

  const createMockMixes = (): Mixes => ({
    flatTOList: [],
    marks: {
      fullNoteIndexWithTick: []
    }
  } as any);

  const createMockSlide = (type: 'to' | 'release', overrides: Partial<StyleSlide> = {}): StyleSlide => ({
    type,
    startUntil: [1, 2],
    rowString: '',
    inSpeedLevel: 100,
    releaseWidth: 0,
    line: 1,
    linePos: 1,
    continue: true,
    auto: false,
    inSpeed: 'mid',
    ...overrides
  } as any);

  const createMockTabObj = (hasSlide = false, slideOverrides: Partial<StyleSlide> = {}, tabObjOverrides: Partial<TabObj> = {}): TabObj => ({
    tabObjId: 1,
    regionNoteIndex: 1,
    regionIndex: 1,
    noteStr: 'test',
    styles: hasSlide ? {
      slide: createMockSlide('to', slideOverrides)
    } : {},
    tab: [2, 3, undefined, undefined, undefined, undefined],
    activeBows: [2, 3, undefined, undefined, undefined, undefined],
    slideLandingTab: [5, 7, undefined, undefined, undefined, undefined],
    velocity: [80, 80, undefined, undefined, undefined, undefined],
    bpm: 120,
    bar: {
      startTick: 0,
      stopTick: 1920,
      tick: 1920,
      fretStartTicks: [0, 0, 0, 0, 0, 0],
      fretStopTicks: [1920, 1920, 1920, 1920, 1920, 1920]
    },
    refActiveBows: Array(6).fill(null).map(() => ({
      velocity: [80, 80, undefined, undefined, undefined, undefined],
      bar: {
        fretStartTicks: [0, 0, 0, 0, 0, 0],
        fretStopTicks: [1920, 1920, 1920, 1920, 1920, 1920]
      }
    })),
    slideTrueType: 0,
    nextTabObj: {
      isRest: false,
      velocity: [70, 70, undefined, undefined, undefined, undefined]
    },
    ...tabObjOverrides
  } as any);

  describe('resolve', () => {
    test('should handle empty flatTOList', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle tabObj without slide', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(false)];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle basic slide', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true)];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle slide with no slide infos', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {}, {
        tab: [undefined, undefined, undefined, undefined, undefined, undefined],
        activeBows: [undefined, undefined, undefined, undefined, undefined, undefined],
        slideLandingTab: [undefined, undefined, undefined, undefined, undefined, undefined]
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle single fret slide', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {}, {
        tab: [2, undefined, undefined, undefined, undefined, undefined],
        activeBows: [2, undefined, undefined, undefined, undefined, undefined],
        slideLandingTab: [3, undefined, undefined, undefined, undefined, undefined]
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle auto slide adjustment', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, { auto: true })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle fast slide speed', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, { inSpeed: 'fast' })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle slow slide speed', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, { inSpeed: 'slow' })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle release slide', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {
        type: 'release',
        releaseWidth: 3,
        arrow: -1
      }, {
        tab: [5, undefined, undefined, undefined, undefined, undefined],
        activeBows: [5, undefined, undefined, undefined, undefined, undefined],
        slideLandingTab: [undefined, undefined, undefined, undefined, undefined, undefined]
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle release slide with matching strings', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {
        type: 'release'
      }, {
        tab: [7, undefined, undefined, undefined, undefined, undefined],
        activeBows: [7, undefined, undefined, undefined, undefined, undefined],
        slideLandingTab: [3, undefined, undefined, undefined, undefined, undefined]
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle release slide with hi-low detection', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {
        type: 'release'
      }, {
        tab: [5, 7, undefined, undefined, undefined, undefined],
        activeBows: [5, 7, undefined, undefined, undefined, undefined],
        slideLandingTab: [2, 3, undefined, undefined, undefined, undefined]
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle release slide with no direction detection', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {
        type: 'release'
      }, {
        tab: [5, undefined, undefined, undefined, undefined, undefined],
        activeBows: [5, undefined, undefined, undefined, undefined, undefined],
        slideLandingTab: [undefined, 3, undefined, undefined, undefined, undefined]
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle slide with strum applied', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {}, {
        styles: {
          slide: createMockSlide('to'),
          strum: { 
            _applied: true,
            startUntil: [1, 2],
            strumWidthMSec: 100,
            line: 1,
            linePos: 1
          } as any
        }
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle slide with continue to next rest note', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {}, {
        nextTabObj: {
          isRest: true,
          velocity: [70, 70, undefined, undefined, undefined, undefined],
          noteStr: 'rest'
        } as any
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle slide with no continue flag', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, { continue: undefined })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle user start tick before startable tick', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      const to = createMockTabObj(true, { startUntil: [0, 4] });
      to.refActiveBows = to.refActiveBows.map(ref => ({
        ...ref,
        noteStr: 'test',
        bar: {
          fretStartTicks: [500, 500, 0, 0, 0, 0],
          fretStopTicks: [1920, 1920, 1920, 1920, 1920, 1920]
        }
      })) as any;
      mixes.flatTOList = [to];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle mixed width strings', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {}, {
        tab: [2, 3, 4, undefined, undefined, undefined],
        activeBows: [2, 3, 4, undefined, undefined, undefined],
        slideLandingTab: [7, 5, 6, undefined, undefined, undefined]
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });

    test('should handle no matching landing strings', () => {
      const conduct = createMockConduct();
      const mixes = createMockMixes();
      mixes.flatTOList = [createMockTabObj(true, {}, {
        tab: [2, 3, undefined, undefined, undefined, undefined],
        activeBows: [2, 3, undefined, undefined, undefined, undefined],
        slideLandingTab: [undefined, undefined, 5, undefined, undefined, undefined]
      })];
      const result = ResolveSlide.resolve(conduct, mixes);
      expect(result instanceof Success).toBe(true);
    });
  });

  describe('toView', () => {
    test('should return null for single step slide', () => {
      const conduct = createMockConduct();
      const marks = { 
        fullNoteIndexWithTick: [],
        styleMappedGroupList: [],
        bendGroupNumberList: [],
        usedBendRange: []
      } as Marks;
      const to = createMockTabObj(true, {}, {
        tab: [2, undefined, undefined, undefined, undefined, undefined],
        slideLandingTab: [3, undefined, undefined, undefined, undefined, undefined]
      });
      const slide: StyleSlide = createMockSlide('to');
      const result = toView(conduct, marks, to, slide);
      expect(result).toBeNull();
    });

    test('should return slide notes for multi-step slide', () => {
      const conduct = createMockConduct();
      const marks = { 
        fullNoteIndexWithTick: [],
        styleMappedGroupList: [],
        bendGroupNumberList: [],
        usedBendRange: []
      } as Marks;
      const to = createMockTabObj(true);
      const slide: StyleSlide = createMockSlide('to');
      const result = toView(conduct, marks, to, slide);
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
      if (result) {
        expect(result.length).toBeGreaterThan(1);
      }
    });

    test('should handle release slide in toView', () => {
      const conduct = createMockConduct();
      const marks = { 
        fullNoteIndexWithTick: [],
        styleMappedGroupList: [],
        bendGroupNumberList: [],
        usedBendRange: []
      } as Marks;
      const to = createMockTabObj(true, {}, {
        tab: [5, undefined, undefined, undefined, undefined, undefined],
        activeBows: [5, undefined, undefined, undefined, undefined, undefined],
        slideLandingTab: [undefined, undefined, undefined, undefined, undefined, undefined]
      });
      const slide: StyleSlide = createMockSlide('release', {
        releaseWidth: 3,
        arrow: -1
      });
      const result = toView(conduct, marks, to, slide);
      expect(result).not.toBeNull();
    });
  });
}); 