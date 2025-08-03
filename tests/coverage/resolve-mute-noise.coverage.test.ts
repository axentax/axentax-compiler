import { ResolveMuteNoise } from '../../src/conductor/compile-style/resolve-mute-noise';
import { Mixes } from '../../src/conductor/interface/conduct';

describe('ResolveMuteNoise', () => {
  describe('resolve', () => {
    test('should handle empty flatTOList', () => {
      const mockMixes: Mixes = {
        dualId: 0,
        regionList: [],
        flatTOList: [],
        bendBank: {
          bendNormalList: [],
          bendChannelList: []
        },
        marks: {
          styleMappedGroupList: [],
          fullNoteIndexWithTick: [],
          bendGroupNumberList: [],
          usedBendRange: []
        }
      };

      const result = ResolveMuteNoise.resolve(mockMixes);
      expect(result.fail()).toBe(false);
    });

    test('should handle rest noise for first tab object', () => {
      const mockTabObj = {
        isRest: true,
        styles: { restNoise: true },
        tab: [1, 2, 3, 4, 5, 6],
        bar: {
          startTick: 100,
          fretStartTicks: [0, 0, 0, 0, 0, 0],
          fretStopTicks: [0, 0, 0, 0, 0, 0]
        }
      };

      const mockMixes: Mixes = {
        dualId: 0,
        regionList: [],
        flatTOList: [mockTabObj as any],
        bendBank: {
          bendNormalList: [],
          bendChannelList: []
        },
        marks: {
          styleMappedGroupList: [],
          fullNoteIndexWithTick: [],
          bendGroupNumberList: [],
          usedBendRange: []
        }
      };

      const result = ResolveMuteNoise.resolve(mockMixes);
      expect(result.fail()).toBe(false);
      expect(mockTabObj.tab).toEqual([0, 0, 0, 0, 0, 0]);
      expect(mockTabObj.bar.fretStartTicks).toEqual([100, 100, 100, 100, 100, 100]);
      expect(mockTabObj.bar.fretStopTicks).toEqual([101, 101, 101, 101, 101, 101]);
    });

    test('should handle rest noise for non-first tab object', () => {
      const prevTabObj = {
        activeBows: [1, undefined, 3, undefined, 5, undefined]
      };

      const mockTabObj = {
        isRest: true,
        styles: { restNoise: true },
        tab: [1, 2, 3, 4, 5, 6],
        bar: {
          startTick: 200,
          fretStartTicks: [0, 0, 0, 0, 0, 0],
          fretStopTicks: [0, 0, 0, 0, 0, 0]
        },
        prevTabObj
      };

      const mockMixes: Mixes = {
        dualId: 0,
        regionList: [],
        flatTOList: [{} as any, mockTabObj as any],
        bendBank: {
          bendNormalList: [],
          bendChannelList: []
        },
        marks: {
          styleMappedGroupList: [],
          fullNoteIndexWithTick: [],
          bendGroupNumberList: [],
          usedBendRange: []
        }
      };

      const result = ResolveMuteNoise.resolve(mockMixes);
      expect(result.fail()).toBe(false);
      expect(mockTabObj.tab).toEqual([1, undefined, 3, undefined, 5, undefined]);
      expect(mockTabObj.bar.fretStartTicks).toEqual([200, 0, 200, 0, 200, 0]);
      expect(mockTabObj.bar.fretStopTicks).toEqual([201, 0, 201, 0, 201, 0]);
    });

    test('should handle non-rest tab objects', () => {
      const mockTabObj = {
        isRest: false,
        styles: { restNoise: false },
        tab: [1, 2, 3, 4, 5, 6],
        bar: {
          startTick: 100,
          fretStartTicks: [0, 0, 0, 0, 0, 0],
          fretStopTicks: [0, 0, 0, 0, 0, 0]
        }
      };

      const mockMixes: Mixes = {
        dualId: 0,
        regionList: [],
        flatTOList: [mockTabObj as any],
        bendBank: {
          bendNormalList: [],
          bendChannelList: []
        },
        marks: {
          styleMappedGroupList: [],
          fullNoteIndexWithTick: [],
          bendGroupNumberList: [],
          usedBendRange: []
        }
      };

      const result = ResolveMuteNoise.resolve(mockMixes);
      expect(result.fail()).toBe(false);
      // Should not modify non-rest objects
      expect(mockTabObj.tab).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test('should handle rest without restNoise style', () => {
      const mockTabObj = {
        isRest: true,
        styles: { restNoise: false },
        tab: [1, 2, 3, 4, 5, 6],
        bar: {
          startTick: 100,
          fretStartTicks: [0, 0, 0, 0, 0, 0],
          fretStopTicks: [0, 0, 0, 0, 0, 0]
        }
      };

      const mockMixes: Mixes = {
        dualId: 0,
        regionList: [],
        flatTOList: [mockTabObj as any],
        bendBank: {
          bendNormalList: [],
          bendChannelList: []
        },
        marks: {
          styleMappedGroupList: [],
          fullNoteIndexWithTick: [],
          bendGroupNumberList: [],
          usedBendRange: []
        }
      };

      const result = ResolveMuteNoise.resolve(mockMixes);
      expect(result.fail()).toBe(false);
      // Should not modify rest without restNoise style
      expect(mockTabObj.tab).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
}); 