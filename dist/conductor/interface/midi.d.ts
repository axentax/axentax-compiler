import { BendMidiSetter } from "./bend";
import { Region } from "./region";
import { TabObj } from "./tab";
export type BuildMidiRequest = {
    regionList: Region[];
    flatTOList: TabObj[];
    bend: {
        bendNormalList: BendMidiSetter[];
        bendChannelList: BendMidiSetter[];
    };
    pan: number;
    soundfontProp: {
        normal: number;
        mute: number;
    };
};
