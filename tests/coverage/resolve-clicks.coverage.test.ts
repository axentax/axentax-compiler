import { ResolveClicks } from '../../src/conductor/compile-style/resolve-clicks';
import { Conduct } from '../../src/conductor/interface/conduct';

describe('ResolveClicks', () => {
  describe('resolve', () => {
    test('should handle empty click list', () => {
      const mockConduct: Conduct = {
        flash: {
          click: []
        },
        mixesList: [{
          marks: {
            fullNoteIndexWithTick: [0, 480, 960, 1440]
          }
        }],
        clickPointList: [],
        settings: {
          click: {
            accent: 1,
            until: [1, 4],
            velocity: 80,
            inst: 0
          }
        }
      } as any;

      ResolveClicks.resolve(mockConduct);
      expect(mockConduct.clickPointList).toEqual([]);
    });

    test('should handle start click', () => {
      const mockConduct: Conduct = {
        flash: {
          click: [{
            start: {
              until: 1,
              fullNoteIndex: 1
            }
          }]
        },
        mixesList: [{
          marks: {
            fullNoteIndexWithTick: [0, 480, 960, 1440]
          }
        }],
        clickPointList: [],
        settings: {
          click: {
            accent: 1,
            until: [1, 4],
            velocity: 80,
            inst: 0
          }
        }
      } as any;

      ResolveClicks.resolve(mockConduct);
      expect(mockConduct.clickPointList.length).toBeGreaterThan(0);
    });

    test('should handle start and stop clicks', () => {
      const mockConduct: Conduct = {
        flash: {
          click: [
            {
              start: {
                until: 1,
                fullNoteIndex: 1
              }
            },
            {
              stop: {
                noteIndex: 2
              }
            }
          ]
        },
        mixesList: [{
          marks: {
            fullNoteIndexWithTick: [0, 480, 960, 1440]
          }
        }],
        clickPointList: [],
        settings: {
          click: {
            accent: 1,
            until: [1, 4],
            velocity: 80,
            inst: 0
          }
        }
      } as any;

      ResolveClicks.resolve(mockConduct);
      expect(mockConduct.clickPointList.length).toBeGreaterThan(0);
    });

    test('should handle multiple start clicks', () => {
      const mockConduct: Conduct = {
        flash: {
          click: [
            {
              start: {
                until: 1,
                fullNoteIndex: 1
              }
            },
            {
              start: {
                until: 2,
                fullNoteIndex: 2
              }
            }
          ]
        },
        mixesList: [{
          marks: {
            fullNoteIndexWithTick: [0, 480, 960, 1440]
          }
        }],
        clickPointList: [],
        settings: {
          click: {
            accent: 1,
            until: [1, 4],
            velocity: 80,
            inst: 0
          }
        }
      } as any;

      ResolveClicks.resolve(mockConduct);
      expect(mockConduct.clickPointList.length).toBeGreaterThan(0);
    });

    test('should handle accent settings', () => {
      const mockConduct: Conduct = {
        flash: {
          click: [{
            start: {
              until: 1,
              fullNoteIndex: 1
            }
          }]
        },
        mixesList: [{
          marks: {
            fullNoteIndexWithTick: [0, 480, 960, 1440]
          }
        }],
        clickPointList: [],
        settings: {
          click: {
            accent: 2,
            until: [1, 4],
            velocity: 80,
            inst: 0
          }
        }
      } as any;

      ResolveClicks.resolve(mockConduct);
      expect(mockConduct.clickPointList.length).toBeGreaterThan(0);
    });

    test('should handle velocity settings', () => {
      const mockConduct: Conduct = {
        flash: {
          click: [{
            start: {
              until: 1,
              fullNoteIndex: 1
            }
          }]
        },
        mixesList: [{
          marks: {
            fullNoteIndexWithTick: [0, 480, 960, 1440]
          }
        }],
        clickPointList: [],
        settings: {
          click: {
            accent: 1,
            until: [1, 4],
            velocity: 100,
            inst: 0
          }
        }
      } as any;

      ResolveClicks.resolve(mockConduct);
      expect(mockConduct.clickPointList.length).toBeGreaterThan(0);
      
      // Check that velocity is capped at 1.0 when velocityMax would exceed 1
      const clickPoint = mockConduct.clickPointList[0];
      expect(clickPoint.velocity).toBeLessThanOrEqual(1.0);
    });

    test('should handle remaining status at end', () => {
      const mockConduct: Conduct = {
        flash: {
          click: [{
            start: {
              until: 1,
              fullNoteIndex: 1
            }
          }]
        },
        mixesList: [{
          marks: {
            fullNoteIndexWithTick: [0, 480, 960, 1440]
          }
        }],
        clickPointList: [],
        settings: {
          click: {
            accent: 1,
            until: [1, 4],
            velocity: 80,
            inst: 0
          }
        }
      } as any;

      ResolveClicks.resolve(mockConduct);
      expect(mockConduct.clickPointList.length).toBeGreaterThan(0);
    });
  });
}); 