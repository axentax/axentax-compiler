
import { Midi } from "@tonejs/midi";
import { Conductor } from '../src/conductor/conductor';
import { ChordDicMap } from '../src/conductor/interface/dic-chord';
import { MapSeed } from '../src/conductor/interface/dic-map-seed';
import { AllowAnnotation } from '../src/conductor/conductor';

// --- Mock Data ---
const allowAnnotations: AllowAnnotation[] = [{ name: 'compose', dualIdRestrictions: [] }];
const chordDic: ChordDicMap = new Map();
const mapSeed: MapSeed = {};

// --- Syntax to Test ---
const testSyntax = `
@@ { |||||12~~~:bd(0..2/12 2, 4.. 1 vib) }
`;

// --- Execution ---
try {
  const result = Conductor.convertToObj(
    true, // hasStyleCompile
    true, // hasMidiBuild
    testSyntax,
    allowAnnotations,
    chordDic,
    mapSeed
  );

  // --- Output ---
  if (result.error) {
    console.error('Error:', result.error);
  } else {
    console.log('Success!');
    // console.log('Response:', JSON.stringify(result.response, null, 2));
    if (result.midi) {
      console.log('MIDI data (ArrayBuffer) created, size:', result.midi.byteLength);
      
      // Parse MIDI data to inspect notes
      const midi = new Midi(result.midi);
      console.log('MIDI Tracks:', midi.tracks.length);
      midi.tracks.forEach((track, index) => {
        console.log(`Track ${index}:`);
        track.notes.forEach(note => {
          console.log(`  Note: ${note.name}, Time: ${note.time}, Duration: ${note.duration}, Velocity: ${note.velocity}`);
        });
      });
    }
  }

} catch (e) {
  console.error('An unexpected error occurred:', e);
}
