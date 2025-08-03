/**
 * ModFingerboardクラス（未使用・将来拡張用）
 * 
 * ギターの指板（フィンガーボード）情報を管理するユーティリティクラス。
 * チューニングごとの指板音名配列を生成・キャッシュ・取得する。
 * 
 * 現在は全てコメントアウトされており、将来の拡張時に使用予定。
 * 
 * - setBoard(): 指板情報の設定・キャッシュ
 * - getBoard(): 指板情報の取得
 * - makeBoard(): 指板情報の生成（プライベートメソッド）
 */
// export class ModFingerboard {

//   /**
//    * [未使用]指板情報の設定・キャッシュ
//    * 
//    * 指定したチューニングの指板情報を生成し、キャッシュに保存する。
//    * 既にキャッシュ済みの場合は何もしない。
//    * 
//    * @param conduct コンダクターオブジェクト
//    * @param tuning チューニング配列
//    */
//   // static setBoard(conduct: Conduct, tuning: IKey[]) {
//   //   const key = tuning.join('');
//   //   if (!conduct.dic.board.sym[key]) this.makeBoard(conduct, tuning);

//   //   // console.log("conduct.dic.board.sym[key]>", conduct.dic.board.sym[key])
//   // }

//   /**
//    * 指板情報の取得
//    * 
//    * 指定したチューニングの指板情報を取得する。
//    * キャッシュにない場合は自動生成する。
//    * 
//    * @param conduct コンダクターオブジェクト
//    * @param tuning チューニング配列
//    * @returns 指板音名配列の配列（弦ごとの音名配列）
//    */
//   // static getBoard(conduct: Conduct, tuning: IKey[]): BoardSym['string'] {
//   //   const key = tuning.join('');
//   //   // if (!conduct.dic.board.sym[key]) this.makeBoard(conduct, tuning);
//   //   return conduct.dic.board.sym[key];
//   // }

//   /**
//    * [未使用]指板情報の生成（プライベートメソッド）
//    * 
//    * 指定したチューニングに基づいて指板情報を生成する。
//    * 各弦の開始音から25フレット分の音名配列を作成する。
//    * 
//    * @param conduct コンダクターオブジェクト
//    * @param tuning チューニング配列
//    */
//   // private static makeBoard(conduct: Conduct, tuning: IKey[]) {
//   //   const board: IKey[][] = [];
//   //   const key = tuning.join('');

//   //   for(let ti = 0; ti < tuning.length; ti++) {
//   //     const startIndex = globalVars.iKey32material.indexOf(tuning[ti]);
//   //     board.push(globalVars.iKey32material.slice(startIndex, startIndex + 25) as IKey[]);
//   //   }
//   //   conduct.dic.board.sym[key] =  board;
//   // }
// }
