import { ModBullet } from '../../src/conductor/compile-block/unfold-bullet/bullet';
import { CSymbolType } from '../../src/conductor/interface/compile';
import { E400, Success } from '../../src/conductor/interface/utils.response.interface';

describe('ModBullet', () => {
  const createMixes = (tuningLength = 6) => ({
    dualId: 0,
    regionList: [
      { tuning: Array(tuningLength).fill({}) }
    ],
    marks: {
      styleMappedGroupList: [1, 2, 3]
    }
  });

  const createSymbol = (token: string, noteStr: string, line = 1, linePos = 1, styles = {}) => ({
    type: CSymbolType.bullet,
    token,
    line,
    linePos,
    regionRegionForDualConnection: 0,
    decidedProp: {
      noteStr,
      styles,
      extensionViewProp: {},
      tick: {},
      chordDicRef: undefined
    },
    locationInfoRefStackUpList: []
  });

  test('should split valid bullet', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/3-5-7', '1/3-5-7')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
    expect(dualLists[0].length).toBe(3);
    expect(dualLists[0][0].token).toContain('3');
    expect(dualLists[0][1].token).toContain('5');
    expect(dualLists[0][2].token).toContain('7');
  });

  test('should error on invalid string number', () => {
    const mixes = createMixes(6);
    const symbols = [
      createSymbol('7/3-5-7', '7/3-5-7')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof E400).toBe(true);
    if (result instanceof E400) {
      expect(result.message).toMatch(/Not Found strings/);
    }
  });

  test('should error on invalid fret token', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/3-x-7', '1/3-x-7')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof E400).toBe(true);
    if (result instanceof E400) {
      expect(result.message).toMatch(/Invalid fret token option/);
    }
  });

  test('should error on missing fret', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/', '1/')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof E400).toBe(true);
    if (result instanceof E400) {
      expect(result.message).toMatch(/Not found fret token/);
    }
  });

  test('should error on missing fret token with string 2', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('2/', '2/')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof E400).toBe(true);
    if (result instanceof E400) {
      expect(result.message).toBe('Not found fret token. 2/\ne.g. 6/1-2-3');
    }
  });

  test('should error on invalid string number 0', () => {
    const mixes = createMixes(6); // 6 string guitar
    const symbols = [
      createSymbol('0/1', '0/1')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof E400).toBe(true);
    if (result instanceof E400) {
      expect(result.message).toMatch(/Not Found strings '0'. Only the tuning string can be specified/);
    }
  });

  test('should error on invalid fret token with x', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/1x', '1/1x')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof E400).toBe(true);
    if (result instanceof E400) {
      expect(result.message).toMatch(/Invalid fret token option '1x'. Permitted frets include n,m,M,D,d,U,u,R,r/);
    }
  });

  test('should handle non-bullet symbols', () => {
    const mixes = createMixes();
    const symbols = [
      { type: CSymbolType.note, token: 'dummy', line: 1, linePos: 1, regionRegionForDualConnection: 0, decidedProp: { noteStr: '', styles: {}, extensionViewProp: {}, tick: {}, chordDicRef: undefined }, locationInfoRefStackUpList: [] }
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
    expect(dualLists[0].length).toBe(1);
    expect(dualLists[0][0].token).toBe('dummy');
  });

  test('should handle mapped group with no positive values', () => {
    const mixes = createMixes();
    mixes.marks.styleMappedGroupList = [0, 0, 0];
    const symbols = [
      createSymbol('1/3-5-7', '1/3-5-7')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
  });

  test('should handle complex bullet with styles', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/3m-5M-7d', '1/3m-5M-7d', 1, 1, {
        legato: true,
        bd: { value: 1.5 },
        mapped: [{ group: -1, to: [1, 2] }],
        approach: { type: 'slide' },
        continue: true,
        delay: { value: 0.5 }
      })
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
  });

  test('should handle bullet with suffix and r note', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/3~-r^-5=', '1/3~-r^-5=')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
  });

  test('should handle bullet with R note', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/R-5-7', '1/R-5-7')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
  });

  test('should handle bullet with double dash', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/3--5-7', '1/3--5-7')
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
  });

  test('should handle bullet with prefix', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol("'1/3-5-7", "'1/3-5-7")
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
  });

  test('should handle all style types', () => {
    const mixes = createMixes();
    const symbols = [
      createSymbol('1/3-5', '1/3-5', 1, 1, {
        bd: { value: 1.0 },
        bpm: 120,
        until: [1, 4],
        degree: { scale: 'major' },
        legato: true,
        mapped: [{ group: -1, to: [1] }],
        scaleX: { factor: 1.2 },
        staccato: true,
        velocity: 100,
        velocityPerBows: [90, 95],
        turn: { direction: 'up' },
        approach: { type: 'slide' },
        continue: true,
        delay: { value: 0.3 },
        slide: { target: 5 },
        stroke: { direction: 'down' },
        strum: { pattern: 'basic' }
      })
    ];
    const dualLists = [symbols];
    const result = ModBullet.apply(mixes as any, dualLists as any);
    expect(result instanceof Success).toBe(true);
  });
}); 