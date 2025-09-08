import { CompileSymbols } from '../../interface/compile';
import { Conduct } from '../../interface/conduct';
import { SimpleResult } from '../../interface/utils.response.interface';

/**
 * UnfoldMappedクラス
 *
 * マップ展開処理を行うクラス
 * マップスタイルが適用されたシンボルを展開し、音程シフトや複製を行う
 * グループ化されたマップ処理と単体マップ処理を管理する
 */
export declare class UnfoldMapped {
    /**
     * マップ適用メソッド
     *
     * マップスタイルが適用されたシンボルを展開し、音程シフトや複製を実行する
     * グループ化されたマップ処理を順次実行し、シードキャッシュを管理する
     *
     * @param conduct コンダクターオブジェクト
     * @param dualId デュアルブロックID
     * @param symbolsList シンボル配列
     * @returns 処理結果（成功またはエラー）
     */
    static apply(conduct: Conduct, dualId: number, symbolsList: CompileSymbols[]): SimpleResult;
}
