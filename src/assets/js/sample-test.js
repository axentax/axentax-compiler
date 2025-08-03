/** @type {AudioContext | undefined} */
let ac;

let sfontBin;
let musicBin;
let synth;
let sfontId;
let musicLoaded = false;
let lastSFontIsDefault = false;
let playingStatus = 'Stopped';

let gprogressdown, playertimer, playerlen;

console.log('load: sample-test.js')
document.addEventListener('keydown', function(event) {
	if (event.keyCode === 32 || event.keyCode === 69) {
		event.preventDefault();
		playSound()
	}
});

function playSound() {
	if (playingStatus === 'Playing') {
		// synth.stopPlayer();
	} else if (playingStatus === 'Stopped') {
		doPlay();
	}
}


