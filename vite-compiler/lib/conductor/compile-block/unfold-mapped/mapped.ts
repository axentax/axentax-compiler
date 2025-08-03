import { CompileSymbols } from "../../interface/compile";
import { Conduct } from "../../interface/conduct";
import { MapSeed } from "../../interface/dic-map-seed";
import { SimpleResult, simpleSuccess } from "../../interface/utils.response.interface";
import { MappedGroup } from "./map-group";


/**
 * UnfoldMappedクラス
 * 
 * マップ展開処理を行うクラス
 * マップスタイルが適用されたシンボルを展開し、音程シフトや複製を行う
 * グループ化されたマップ処理と単体マップ処理を管理する
 */
export class UnfoldMapped {

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
  static apply(conduct: Conduct, dualId: number, symbolsList: CompileSymbols[]): SimpleResult {
    const mixes = conduct.mixesList[dualId];
    const { marks } = mixes;

    // シードキャッシュ: キャッシュを一回の処理内で保持（暫定）
    const seed: MapSeed = conduct.dic.mapSeed; //{};

    // グループ存在チェック: mapped指定がない場合処理完了
    const marksGroups = marks.styleMappedGroupList;
    if (!marksGroups.length) return simpleSuccess();

    // ↓ stepでの styleMappedGroupList がバグっていてこちらを疑っていた 20241009
    // ---
    // グループ > 0 の場合 // 次に、グループ化されたものを、それぞれ複製処理
    // ---
    for (let gi = 0; gi < marksGroups.length; gi++) {
      const group = marksGroups[gi];
      const resGroup = MappedGroup.resolve(seed, conduct, dualId, group, symbolsList);
      if (resGroup.fail()) return resGroup;
    }

    return simpleSuccess();
  }

}
