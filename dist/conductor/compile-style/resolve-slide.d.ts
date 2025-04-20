import { Conduct, Marks, Mixes } from "../interface/conduct";
import { StyleSlide } from "../interface/style";
import { TabObj } from "../interface/tab";
import { SimpleResult } from "../interface/utils.response.interface";
export declare class ResolveSlide {
    static resolve(conduct: Conduct, mixes: Mixes): SimpleResult;
}
export declare function toView(conduct: Conduct, marks: Marks, to: TabObj, slide: StyleSlide): TabObj[] | null;
