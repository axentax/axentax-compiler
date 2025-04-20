import { Midi } from "@tonejs/midi";
import { BuildMidiRequest } from "../interface/midi";
export declare class ModGuitarTimGM6mb {
    /**
     * create guitar midi
     */
    static create(trackStartIndex: number, midi: Midi, bmr: BuildMidiRequest): void;
}
