export interface BendView {
    view: ViewInfo[];
    bend: Bend[][];
}
export interface ViewInfo {
    startTick: number;
    stopTick: number;
    row: string;
    line: number;
    linePos: number;
}
export interface Bend {
    tick: number;
    pitch: number;
}
export interface BendMidiSetter {
    bend: Bend[];
    hasMute: boolean;
    tabObjId: number;
}
