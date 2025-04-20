import { Midi } from '@tonejs/midi';
import { ErrorBase, IResult } from '../interface/utils.response.interface';
import { BuildMidiRequest } from '../interface/midi';
import { BPMPos } from '../interface/bpm';
import { ClickPoint } from '../interface/click';
export interface BuildToObj {
    error: null | ErrorBase;
    response: null | Midi;
}
/** Midi Builder */
export declare class MidiBuilder {
    /**
     * build
     */
    static build(bmrList: BuildMidiRequest[], bpmList: BPMPos[], clickList: ClickPoint[]): IResult<Midi, ErrorBase>;
}
