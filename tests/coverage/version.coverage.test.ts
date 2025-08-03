import { app_version } from '../../src/conductor/version';

describe('version.ts coverage', () => {
  test('app_version should be defined and a string', () => {
    expect(app_version).toBeDefined();
    expect(typeof app_version).toBe('string');
  });
}); 