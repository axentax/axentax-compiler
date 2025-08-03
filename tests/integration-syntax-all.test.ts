import { Conductor } from '../src/conductor/conductor';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 統合テスト: syntax-all.tsの全regionを5個ずつグループ化してテスト
 * 各グループには以下の設定が適用される:
 * - set.click.inst: 42
 * - set.style.until: 1/4
 * - set.dual.pan: true
 * - set.dual.panning: [0.5, 0, 1]
 * - set.style.scale: E minor
 * - set.song.key: E
 */
describe('Integration Tests: Syntax All Regions', () => {
  const requestDir = path.join(__dirname, 'integration/request');
  const expectDir = path.join(__dirname, 'integration/expect');
  
  // リクエストファイル一覧を取得
  const requestFiles = fs.readdirSync(requestDir)
    .filter(file => file.startsWith('syntax-group-') && file.endsWith('.txt'))
    .sort();
  
  // 各リクエストファイルに対してテストを生成
  requestFiles.forEach((requestFile, index) => {
    const groupNumber = index + 1;
    const expectFile = requestFile.replace('.txt', '.json');
    
    test(`Group ${groupNumber.toString().padStart(2, '0')}: ${requestFile}`, () => {
      // リクエストファイルを読み込み
      const requestPath = path.join(requestDir, requestFile);
      const syntax = fs.readFileSync(requestPath, 'utf8');
      
      // ConvertToObjを実行
      const result = Conductor.convertToObj(
        true,    // hasStyleCompile
        false,   // hasMidiBuild (MIDIは不要)
        syntax,
        [],      // allowAnnotation
        new Map(), // chordDic
        {}       // mapSeed
      );
      
      // 期待値ファイルのパス
      const expectPath = path.join(expectDir, expectFile);
      
      // 期待値を抽出（stylesを除外し、循環参照を処理）
      let actualExpectation = null as any;
      if (result.response && result.response.mixesList) {
        actualExpectation = {
          mixesList: result.response.mixesList.map(mix => ({
            flatTOList: mix.flatTOList.map((item: any) => {
              // stylesを除外し、循環参照を防ぐためにJSONで安全にシリアライズ
              const cleanItem = JSON.parse(JSON.stringify(item, (key, value) => {
                // stylesキーを除外
                if (key === 'styles') {
                  return undefined;
                }
                return value;
              }));
              return cleanItem;
            })
          }))
        };
      }
      
      const actualResult = {
        hasError: result.error !== null,
        error: result.error,
        expectation: actualExpectation
      };
      
      // 期待値ファイルが存在するかチェック
      if (fs.existsSync(expectPath)) {
        const expectedResult = JSON.parse(fs.readFileSync(expectPath, 'utf8'));
        
        // プレースホルダーの場合は、実際の結果で更新
        if (expectedResult._note) {
          // console.log(`Updating expectation for ${expectFile}`);
          fs.writeFileSync(expectPath, JSON.stringify(actualResult, null, 2));
        } else {
          // 期待値と比較
          expect(actualResult.hasError).toBe(expectedResult.hasError);
          
          if (actualResult.hasError) {
            // エラーの場合
            expect(actualResult.error).toBeTruthy();
          } else {
            // 成功の場合
            expect(actualResult.error).toBeNull();
            expect(actualResult.expectation).toEqual(expectedResult.expectation);
          }
        }
      } else {
        // 期待値ファイルが存在しない場合は作成
        // console.log(`Creating new expectation file: ${expectFile}`);
        fs.writeFileSync(expectPath, JSON.stringify(actualResult, null, 2));
      }
      
      // 基本的な検証: コンパイルが正常に動作することを確認
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      
      // エラーがない場合の追加検証
      if (!result.error) {
        expect(result.response).toBeTruthy();
        expect(result.response!.mixesList).toBeDefined();
        expect(Array.isArray(result.response!.mixesList)).toBe(true);
        if (result.response!.mixesList.length > 0) {
          expect(Array.isArray(result.response!.mixesList[0].flatTOList)).toBe(true);
        }
      }
    });
  });
  
  // 全体的な統計情報をテスト後に出力
  afterAll(() => {
    // console.log(`\\n=== Integration Test Summary ===`);
    // console.log(`Total groups tested: ${requestFiles.length}`);
    // console.log(`Expected total regions: ~${requestFiles.length * 5} (5 per group, except last group)`);
    // console.log(`Settings applied to all tests:`);
    // console.log(`  - set.click.inst: 42`);
    // console.log(`  - set.style.until: 1/4`);
    // console.log(`  - set.dual.pan: true`);
    // console.log(`  - set.dual.panning: [0.5, 0, 1]`);
    // console.log(`  - set.style.scale: E minor`);
    // console.log(`  - set.song.key: E`);
    // console.log(`=================================\\n`);
  });
});