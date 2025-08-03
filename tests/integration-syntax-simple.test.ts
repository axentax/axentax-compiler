import { Conductor } from '../src/conductor/conductor';

// npm test -- tests/integration-syntax-simple.test.ts --testNamePattern="integration-main"

describe('Integration Tests: Simple Syntax', () => {
  test('integration-main', () => {
    const syntax = `
      set.play.velocities: 60|55|62|62|55|45
      
      @@ {
        C:map((
          3
        ))
        C:degree(
          E
          minor
          7th
          mode
          3th
        )
        C:step(
          3
          (4
          
          5)
        )
      }
    `;
    const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
    expect(result.error).toBeNull();
  });

  test('integration-main-error', () => {
    const syntax = `
      @@ {
        C:degree(
          E
          (minor)
          7th
          mode
          3th
        )
      }
    `;
    const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
    expect(result.error !== null).toBe(true);
  });

  test('integration-main-error', () => {
    const syntax = `
      set.style.degree: X
      @@ { C }
    `;
    const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
    expect(result.error !== null).toBe(true);
  });

  test('integration-main-error', () => {
    const syntax = `
      set.foo: X
      @@ { C }
    `;
    const result = Conductor.convertToObj(true, true, syntax, [], new Map(), {});
    expect(result.error !== null).toBe(true);
  });
});

