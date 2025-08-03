import { DiatonicEvolverValue } from "../interface/diatonic"

/**
 * ダイアトニック進行テンプレート
 * 
 * 各スケール名ごとに、コード進行のプリフィックス配列（evolvedCodePrefix）と
 * 12音階のビン配列（bin）を定義する。
 * evolvedCodePrefixは各スケールの度数ごとのコードタイプを表現する。
 * binはスケール構成音を2進数で表現（1:使用音、0:非使用音）
 */
const diatonicEvolver: { [key in string]: DiatonicEvolverValue } = {
  'major': {
    evolvedCodePrefix: ['', 'm', 'm', '', '', 'm', 'dim'],
    bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  },
  'major 7th': {
    evolvedCodePrefix: ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
    bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
  },
  'major 6th': {
    evolvedCodePrefix: ['6', 'm7', 'm7', '6', '7', 'm7', 'm7b5'],
    bin: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
  },
  'minor': {
    evolvedCodePrefix: ['m', 'm7b5', '', 'm', 'm', '', 'm'],
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
  },
  'minor 7th': {
    evolvedCodePrefix: ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'],
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
  },
  'minor 6th': {
    evolvedCodePrefix: ['m7', 'm7b5', '6', 'm7', 'm7', '6', '7'],
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
  },
  'harmonic minor': {
    evolvedCodePrefix: ['m', 'dim', 'aug', 'm', '', '', 'dim'],
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1]
  },
  'harmonic minor 7th': {
    evolvedCodePrefix: ['mmaj7', 'm7b5', 'maj7#5', 'm7', '7', 'maj7', 'dim7'],
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1]
  },
  'melodic minor': {
    evolvedCodePrefix: ['m', 'm', 'aug', '', '', 'dim', 'dim'],
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1]
  },
  'melodic minor 7th': {
    evolvedCodePrefix: ['mmaj7', 'm7', 'maj7#5', '7', '7', 'm7b5', 'm7b5'],
    bin: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1]
  },
  'harmonic major': {
    evolvedCodePrefix: ['', 'm7b5', 'm', 'm', '', 'aug', 'm7b5'],
    bin: [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1]
  },
  'harmonic major 7th': {
    evolvedCodePrefix: ['maj7', 'm7b5', 'm7', 'mmaj7', '7', 'm7#5', 'maj7'],
    bin: [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1]
  },

}

/**
 * ダイアトニック進行テンプレートのクローン関数
 * 
 * 指定したスケール名のテンプレートをディープコピーして返す
 * structuredCloneを利用
 * @param scaleName スケール名
 * @returns DiatonicEvolverValueのクローン
 */
export const cloneDiatonicEvolver = (scaleName: string) => {
  return structuredClone(diatonicEvolver[scaleName]);
}
