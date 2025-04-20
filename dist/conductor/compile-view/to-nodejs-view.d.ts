import { Conduct } from "../interface/conduct";
import { StyleKeys } from "../interface/style";
import { Tick } from "../interface/tab";
export interface Region {
    id: number;
    s: {
        l: number;
        p: number;
    };
    e: {
        l: number;
        p: number;
    };
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
    sp: {
        l: number;
        p: number;
    };
    ep: {
        l: number;
        p: number;
    };
    /**
     * style on note
     * bend, slide, strum, stroke
     */
    styleKeys: StyleKeys[];
    /** bend data on note */ bendObj: {
        startTick: number;
        endTick: number[];
        bend: {
            tick: number;
            pitch: number;
        }[];
    }[];
}
export interface NodeJsView {
    regions: Region[];
    noteList: NoteView[][];
    syntax: string;
}
export declare class ToNodejsView {
    static createView(conduct: Conduct): NodeJsView;
}
