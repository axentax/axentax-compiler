/**
 * BPM位置型
 *
 * テンポ変化の位置情報を表現する
 * tick、BPM、ミリ秒時間を含む
 */
export type BPMPos = {
    /** tick（タイミング） */
    tick: number;
    /** BPM（テンポ） */
    bpm: number;
    /** ミリ秒時間 */
    timeMS: number;
};
