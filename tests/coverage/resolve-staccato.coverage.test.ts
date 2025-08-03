import { ResolveStaccato } from '../../src/conductor/compile-style/resolve-staccato';
import { Success } from '../../src/conductor/interface/utils.response.interface';
import { Mixes } from '../../src/conductor/interface/conduct';

describe('resolve-staccato', () => {
  describe('ResolveStaccato.resolve', () => {
    test('should resolve staccato with valid staccato settings', () => {
      const mixes: Mixes = {
        flatTOList: [
          {
            styles: {
              staccato: {
                cutUntil: [1, 4] // 1/4 staccato
              }
            },
            bar: {
              startTick: 0,
              stopTick: 1000,
              fretStopTicks: [500, 750, null, 800]
            }
          }
        ]
      } as any;

      const result = ResolveStaccato.resolve(mixes);
      
      expect(result instanceof Success).toBe(true);
      // 1/4 * 1000 = 250ティック後にカット
      expect(mixes.flatTOList[0].bar.fretStopTicks[0]).toBe(250); // 0 + 250
      expect(mixes.flatTOList[0].bar.fretStopTicks[1]).toBe(250); // 0 + 250  
      expect(mixes.flatTOList[0].bar.fretStopTicks[2]).toBe(null); // null は変更されない
      expect(mixes.flatTOList[0].bar.fretStopTicks[3]).toBe(250); // 0 + 250
    });

    test('should resolve staccato with different cut ratio', () => {
      const mixes: Mixes = {
        flatTOList: [
          {
            styles: {
              staccato: {
                cutUntil: [1, 8] // 1/8 staccato
              }
            },
            bar: {
              startTick: 100,
              stopTick: 900,
              fretStopTicks: [400, 500]
            }
          }
        ]
      } as any;

      const result = ResolveStaccato.resolve(mixes);
      
      expect(result instanceof Success).toBe(true);
      // (900 - 100) / 8 * 1 = 100ティック後にカット
      expect(mixes.flatTOList[0].bar.fretStopTicks[0]).toBe(200); // 100 + 100
      expect(mixes.flatTOList[0].bar.fretStopTicks[1]).toBe(200); // 100 + 100
    });

    test('should not resolve staccato when slide is present', () => {
      const mixes: Mixes = {
        flatTOList: [
          {
            styles: {
              staccato: {
                cutUntil: [1, 4]
              },
              slide: {} // slideがある場合はスタッカートを適用しない
            },
            bar: {
              startTick: 0,
              stopTick: 1000,
              fretStopTicks: [500, 750]
            }
          }
        ]
      } as any;

      const result = ResolveStaccato.resolve(mixes);
      
      expect(result instanceof Success).toBe(true);
      // slideがある場合は元の値のまま
      expect(mixes.flatTOList[0].bar.fretStopTicks[0]).toBe(500);
      expect(mixes.flatTOList[0].bar.fretStopTicks[1]).toBe(750);
    });

    test('should not resolve staccato when staccato is not present', () => {
      const mixes: Mixes = {
        flatTOList: [
          {
            styles: {}, // staccatoなし
            bar: {
              startTick: 0,
              stopTick: 1000,
              fretStopTicks: [500, 750]
            }
          }
        ]
      } as any;

      const result = ResolveStaccato.resolve(mixes);
      
      expect(result instanceof Success).toBe(true);
      // staccatoがない場合は元の値のまま
      expect(mixes.flatTOList[0].bar.fretStopTicks[0]).toBe(500);
      expect(mixes.flatTOList[0].bar.fretStopTicks[1]).toBe(750);
    });

    test('should handle empty flatTOList', () => {
      const mixes: Mixes = {
        flatTOList: []
      } as any;

      const result = ResolveStaccato.resolve(mixes);
      
      expect(result instanceof Success).toBe(true);
    });

    test('should handle multiple notes with different staccato settings', () => {
      const mixes: Mixes = {
        flatTOList: [
          {
            styles: {
              staccato: {
                cutUntil: [1, 2] // 1/2 staccato
              }
            },
            bar: {
              startTick: 0,
              stopTick: 1000,
              fretStopTicks: [500]
            }
          },
          {
            styles: {
              staccato: {
                cutUntil: [3, 4] // 3/4 staccato
              }
            },
            bar: {
              startTick: 1000,
              stopTick: 2000,
              fretStopTicks: [800]
            }
          }
        ]
      } as any;

      const result = ResolveStaccato.resolve(mixes);
      
      expect(result instanceof Success).toBe(true);
      // 1つ目: 1000 / 2 * 1 = 500ティック後にカット
      expect(mixes.flatTOList[0].bar.fretStopTicks[0]).toBe(500); // 0 + 500
      // 2つ目: 1000 / 4 * 3 = 750ティック後にカット
      expect(mixes.flatTOList[1].bar.fretStopTicks[0]).toBe(1750); // 1000 + 750
    });
  });
});