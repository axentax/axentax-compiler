// Jest setup file
// グローバルな設定やモックをここに追加できます

// テストタイムアウトを延長（必要に応じて）
jest.setTimeout(30000);

// グローバルなモックや設定を追加
global.console = {
  ...console,
  // テスト中のログ出力を制御（必要に応じて）
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}; 