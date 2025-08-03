import { ModTick_dual } from '../../src/conductor/compile-block/mod-8-tick';
import { Conduct } from '../../src/conductor/interface/conduct';
import { TabObj } from '../../src/conductor/interface/tab';

describe('mod-8-tick.ts coverage', () => {
  
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
      fretStartTicks: [],
      fretStopTicks: []
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

  test('resolve with basic conduct should return success', () => {
    const mockConduct: Conduct = {
      regionLength: 2,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
            startLayerTick: 0,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          },
          {
            tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
            startLayerTick: 480,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 480,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined, undefined, undefined, undefined, undefined],
            velocity: [80, undefined, undefined, undefined, undefined, undefined],
            noteStr: 'C'
          }),
          createMockTabObj({
            regionIndex: 1,
            regionNoteIndex: 0,
            tabObjId: 2,
            note: 'D',
            tab: [2, undefined, undefined, undefined, undefined, undefined],
            velocity: [80, undefined, undefined, undefined, undefined, undefined],
            noteStr: 'D'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[0].bar.fretStartTicks[0]).toBeDefined();
    expect(mockConduct.mixesList[0].flatTOList[0].bar.fretStopTicks[0]).toBeDefined();
  });

  test('resolve with rest notes should handle correctly', () => {
    const mockConduct: Conduct = {
      regionLength: 1,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            note: 'rest',
            tab: [-1, undefined],
            velocity: [0, undefined],
            isRest: true,
            noteStr: 'rest'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[0].activeBows[0]).toBeUndefined();
  });

  test('resolve with continue notes should maintain active state', () => {
    const mockConduct: Conduct = {
      regionLength: 1,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            noteStr: 'C'
          }),
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 1,
            tabObjId: 2,
            note: 'continue',
            tab: [undefined, undefined],
            velocity: [undefined, undefined],
            continueX: true,
            noteStr: 'continue'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[1].activeBows[0]).toBe(0);
  });

  test('resolve with strum style should not continue when no fret specified', () => {
    const mockConduct: Conduct = {
      regionLength: 1,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            noteStr: 'C'
          }),
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 1,
            tabObjId: 2,
            note: 'strum',
            tab: [undefined, undefined],
            velocity: [undefined, undefined],
            continueX: true,
            styles: { strum: { 
              line: 0, 
              linePos: 0, 
              endPos: 1, 
              startUntil: [1, 4], 
              strumWidthMSec: 50,
              _applied: undefined 
            } },
            noteStr: 'strum'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[1].activeBows[0]).toBeUndefined();
  });

  test('resolve with slide style should set landing tab', () => {
    const mockConduct: Conduct = {
      regionLength: 1,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            styles: { slide: { 
              line: 0, 
              linePos: 0, 
              endPos: 1, 
              rowString: 'slide',
              type: 'to', 
              startUntil: [1, 4], 
              inSpeedLevel: 25,
              releaseWidth: 0
            } },
            noteStr: 'C'
          }),
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 1,
            tabObjId: 2,
            note: 'D',
            tab: [2, undefined],
            velocity: [80, undefined],
            noteStr: 'D'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[0].slideLandingTab).toEqual([2, undefined]);
  });

  test('resolve with slide followed by rest should set type to release', () => {
    const mockConduct: Conduct = {
      regionLength: 1,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            styles: { slide: { 
              line: 0, 
              linePos: 0, 
              endPos: 1, 
              rowString: 'slide',
              type: 'to', 
              startUntil: [1, 4], 
              inSpeedLevel: 25,
              releaseWidth: 0
            } },
            noteStr: 'C'
          }),
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 1,
            tabObjId: 2,
            note: 'rest',
            tab: [-1, undefined],
            velocity: [0, undefined],
            isRest: true,
            noteStr: 'rest'
          }),
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 2,
            tabObjId: 3,
            note: 'D',
            tab: [2, undefined],
            velocity: [80, undefined],
            noteStr: 'D'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[0].styles.slide?.type).toBe('release');
  });

  test('resolve with multiple regions and offset should handle correctly', () => {
    const mockConduct: Conduct = {
      regionLength: 2,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 240,
            offsetTickWidth: 120,
            trueStartLayerTick: 0,
            deactive: false
          },
          {
            tuning: ['E', 'A'],
            startLayerTick: 240,
            usedTotalTick: 240,
            offsetTickWidth: 0,
            trueStartLayerTick: 240,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            bar: {
              tick: 120,
              startTick: 0,
              stopTick: 120,
              fretStartTicks: [],
              fretStopTicks: []
            },
            noteStr: 'C'
          }),
          createMockTabObj({
            regionIndex: 1,
            regionNoteIndex: 0,
            tabObjId: 2,
            note: 'continue',
            tab: [undefined, undefined],
            velocity: [undefined, undefined],
            continueX: true,
            noteStr: 'continue'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[1].activeBows[0]).toBe(0);
  });

  test('resolve with deactive region should handle currentLastTick correctly', () => {
    const mockConduct: Conduct = {
      regionLength: 3,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 240,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          },
          {
            tuning: ['E', 'A'],
            startLayerTick: 240,
            usedTotalTick: 240,
            offsetTickWidth: 0,
            trueStartLayerTick: 240,
            deactive: true
          },
          {
            tuning: ['E', 'A'],
            startLayerTick: 480,
            usedTotalTick: 240,
            offsetTickWidth: 0,
            trueStartLayerTick: 480,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            noteStr: 'C'
          }),
          createMockTabObj({
            regionIndex: 2,
            regionNoteIndex: 0,
            tabObjId: 2,
            note: 'continue',
            tab: [undefined, undefined],
            velocity: [undefined, undefined],
            continueX: true,
            noteStr: 'continue'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[1].activeBows[0]).toBe(0);
  });

  test('resolve with currentLastTick -1 should handle fretStopTicks correctly', () => {
    const mockConduct: Conduct = {
      regionLength: 1,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 240,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            noteStr: 'C'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[0].bar.fretStopTicks[0]).toBeDefined();
  });

  test('resolve with stopTick longer than tick should adjust correctly', () => {
    const mockConduct: Conduct = {
      regionLength: 1,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            bar: {
              tick: 240,
              startTick: 0,
              stopTick: 1000,
              fretStartTicks: [],
              fretStopTicks: []
            },
            noteStr: 'C'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    const tabObj = mockConduct.mixesList[0].flatTOList[0];
    expect(tabObj.bar.stopTick).toBe(tabObj.bar.startTick + tabObj.bar.tick);
  });

  test('resolve should set prevTabObj and nextTabObj references', () => {
    const mockConduct: Conduct = {
      regionLength: 1,
      mixesList: [{
        regionList: [
          {
            tuning: ['E', 'A'],
            startLayerTick: 0,
            usedTotalTick: 480,
            offsetTickWidth: 0,
            trueStartLayerTick: 0,
            deactive: false
          }
        ],
        flatTOList: [
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 0,
            tab: [0, undefined],
            velocity: [80, undefined],
            noteStr: 'C'
          }),
          createMockTabObj({
            regionIndex: 0,
            regionNoteIndex: 1,
            tabObjId: 2,
            note: 'D',
            tab: [2, undefined],
            velocity: [80, undefined],
            noteStr: 'D'
          })
        ]
      }]
    } as Conduct;

    const result = ModTick_dual.resolve(mockConduct, 0);
    
    expect(result.fail()).toBe(false);
    expect(mockConduct.mixesList[0].flatTOList[1].prevTabObj).toBe(mockConduct.mixesList[0].flatTOList[0]);
    expect(mockConduct.mixesList[0].flatTOList[0].nextTabObj).toBe(mockConduct.mixesList[0].flatTOList[1]);
  });

});