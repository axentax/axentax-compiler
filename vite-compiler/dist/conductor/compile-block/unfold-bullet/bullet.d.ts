import { CompileSymbols } from '../../interface/compile';
import { Mixes } from '../../interface/conduct';
import { SimpleResult } from '../../interface/utils.response.interface';

/**
 * ModBulletクラス
 *
 * タブ譜形式の記譜（例：2/4-5-7）を個別のノートシンボルに展開する
 * フレット指定、演奏指示、一部スタイル情報の継承も処理する
 */
export declare class ModBullet {
    /**
     * バレット適用メソッド
     *
     * シンボル配列内のバレットシンボルを展開し、個別のノートシンボルに変換する
     * デュアルブロック対応で、各ブロック内のバレットを順次処理する
     *
     * @param mixes ミックスオブジェクト
     * @param symbolsDualLists デュアルブロック対応のシンボル配列
     * @returns 処理結果（成功またはエラー）
     */
    static apply(mixes: Mixes, symbolsDualLists: CompileSymbols[][]): SimpleResult;
}
