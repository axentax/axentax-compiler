import { Conduct } from "./conductor/interface/conduct";
import { StyleKeys } from "./conductor/interface/style";
import { Tick } from "./conductor/interface/tab";


export interface Region {
  id: number;
  s: { l: number, p: number };
  e: { l: number, p: number };
}

export interface NoteView {

  /** total index */
  t: number;
  /** region index */
  r: number;
  regionInnerIndex: number;

  sym: string;
  tab: string;
  
  bar: Tick;
  /** start tick */
  st: number;
  /** end tick */
  et: number;

  /**  */
  bpm: number;

  /** syntax position */
  sp: { l: number, p: number };
  ep: { l: number, p: number };

  /**
   * style on note
   * bend, slide, strum, stroke
   */
  styleKeys: StyleKeys[];

  /** bend data on note */ // 一旦渡すが実運用では、必要時だけの取得にするか
  bendObj: { // 鳴っている最中に表示するかはパフォーマンス次第
    startTick: number;
    endTick: number[]
    bend: {
      tick: number;
      pitch: number;
    }[],
  }[] // 無データ間隔必要
}


export interface NodeJsView {
  regions: Region[];
  noteList: NoteView[][];

  syntax: string;
}

export class ToNodejsView {

  static createView(conduct: Conduct): NodeJsView {
    const { mixesList } = conduct;

    const regionList: Region[] = mixesList[0].regionList.map(bl => {
      return {
        id: bl.id,
        s: { l: bl.start.line, p: bl.start.linePos },
        e: { l: bl.end.line, p: bl.end.linePos }
      }
    })

    const view: NodeJsView = {
      regions: regionList,
      noteList: [],
      syntax: ''
    } as NodeJsView;

    for (let dualId = 0; dualId < mixesList.length; dualId++) {
      getView(view, conduct, dualId);
    }

    return view;
  }

}

/**
 * regions
 */
function getView(view: NodeJsView, { mixesList }: Conduct, dualId: number) {
  const mixes = mixesList[dualId];
  const noteList: NoteView[] = [];
  for (let ti = 0; ti < mixes.flatTOList.length; ti++) {
    const to = mixes.flatTOList[ti];

    if (!/^#/.test(to.noteStr)) {

      const noteView: NoteView = {} as NoteView;
      noteView.t = ti;
      noteView.r = to.regionIndex;
      // noteView.regionInnerIndex = to.blockNoteIndex;
      noteView.sym = to.noteStr;
      noteView.tab = '[' + to.tab.join() + ']';

      const startFretMinTick = Math.min(...to.bar.fretStartTicks.map(ft => ft !== undefined ? ft : -1));

      /* istanbul ignore next: startFretMinTick が -1 になる状況は極めて稀で、通常は適切な fret start tick が設定される */
      noteView.st = startFretMinTick !== -1 ? startFretMinTick : to.bar.startTick;

      noteView.et = to.bar.stopTick;
      // noteView.bpm = to.bpm;
      noteView.sp = { l: to.syntaxLocation.line, p: to.syntaxLocation.linePos },
      noteView.ep = { l: to.syntaxLocation.endLine!, p: to.syntaxLocation.endPos! },
      // noteView.styleKeys = Object.keys(to.style) as StyleKeys[];
      noteList.push(noteView)
    }
  }

  view.noteList.push(noteList);
}
