/* istanbul ignore file */
import { MidiBuilder } from "./conductor/compile-midi/midi-builder";
import { ToNodejsView, NodeJsView } from "./to-nodejs-view";
import { Conductor } from "./conductor/conductor";
import { ErrorBase, Warning } from "./conductor/interface/utils.response.interface";
import { sampleSyntax } from "./sample-syntax";
import * as fs from 'fs-extra';

export class ConductTester {

  /**
   * compile starter
  */
  static call(prop: {
    compose?: boolean,
    isRequiredMidiFile?: boolean
  } = { compose: true, isRequiredMidiFile: true }) {
    // http://localhost:3000/2

    // convert（将来カスタマイズようにconduct全て受け取る）sampleSyntaxはUIから受け取る
    const conductRes = Conductor.convert(sampleSyntax, [
      {
        name: 'compose',
        dualIdRestrictions: [1, 2],
        // withParentheses: true
      },
      {
        name: '/compose',
        dualIdRestrictions: [1, 2],
        // withParentheses: false
      }
    ], new Map(), {}, false);
    
    // Error # エラーの場合、UIにエラー情報返却
    if (conductRes.fail()) { this.renderError(conductRes); return; }
    // Warning render console for develop # ワーニングも含めてUIに返却
    if (conductRes.res.warnings.length) { this.renderWarnings(conductRes.res.warnings); }

    // midi生成を伴わない場合、201を返却 # memo: コード情報のみ確認する場合は別途メソッド作成
    let viewForNodejs: NodeJsView = {} as NodeJsView;
    if (!prop.isRequiredMidiFile) {
      // console.log('..no create midi');
      return;
    } else {
      // 開発環境nodejs用
      viewForNodejs = ToNodejsView.createView(conductRes.res);
    }

    // create midi
    const midi = MidiBuilder.build(
      [0, 1, 2].map(dualId => {
        return {
          regionList: conductRes.res.mixesList[dualId].regionList,
          flatTOList: conductRes.res.mixesList[dualId].flatTOList,
          pan: conductRes.res.settings.dual.panning[dualId] >= 0 ? conductRes.res.settings.dual.panning[dualId] : 0.5,
          soundfontProp: { normal: 24, mute: 28 }, // 24
          bend: conductRes.res.mixesList[dualId].bendBank
        }
      }),
      // BPM
      conductRes.res.bpmPosList,
      // Click
      conductRes.res.clickPointList
    );
    if (midi.fail()) throw '----- fail create midi -----';

    fs.writeFileSync("src/out/out2.mid", Buffer.from(midi.res.toArray()))
    
    viewForNodejs.syntax = sampleSyntax;
    return { conduct: conductRes, view: viewForNodejs };
  }

  /**
   * for dev
   * @param err 
   * @param conduct 
   */
  static renderError(err: ErrorBase) {
    console.log(
      `\x1b[31m`
      + (
        err.line >= 0 && err.linePos >= 0
          ? `Error on line [${err.line}:${err.linePos}]: `
          : err.line >= 0
            ? `Error on line [${err.line}]: `
            : ''
      )
      + `${err.message}\x1b[39m`
    );
    // console.log('token:"' + err.token + '"');
    // console.log('message:', err.message)
    // console.log(`statusCode: ${err.statusCode}`, err.statusCode);
  }

  /**
   * for dev
   * @param warnings 
   */
  static renderWarnings(warnings: Warning[]) {
    warnings.forEach(w => console.log(
      `\x1b[33mWarning on line [${w.line}${w.pos ? ':' + w.pos : ''}]: ${w.message}\x1b[39m`
    ));
  }
}