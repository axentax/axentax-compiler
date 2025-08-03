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

// 
let noteIndexStatus1 = 0;
let noteIndex1 = 0;
//
let noteIndexStatus2 = 0;
let noteIndex2 = 0;

async function loadBinary(url) {
	const resp = await fetch(url);
	return await resp.arrayBuffer();
}

function loadSFont(useDefaultSFont) {
	if (sfontBin) {
		return sfontBin;
	}

	// CORSで引っかかる
	// const buff = loadBinary('/assets/sf/TimGM6mb_slim2.sf2'); // TimGM6mb.sf2 // merlin_vienna.sf2 // FS-Gibson-Les-Paul-I5-HedSound.sf2
	const buff = loadBinary('/assets/sf/TimGM6mb_slim2.sf2'); // TimGM6mb.sf2 // merlin_vienna.sf2 // FS-Gibson-Les-Paul-I5-HedSound.sf2
	sfontBin = buff;
	return buff;
}

function loadMusic(useDefaultMusic) {
	if (musicBin) {
		console.log('no change data')
		return musicBin;
	}
	console.log('new data')
	const buff = loadBinary('/out/out2.mid');//zambra.midi
	musicBin = buff;
	return buff;
}

async function initializeSynthesizer(useDefaultSFont) {
	if (synth && useDefaultSFont) {
		// console.log("111")
		return synth;
	}
	console.log("000")

	// Load Soundfont binary asynchronously
	const promiseSFont = loadSFont(useDefaultSFont);
	lastSFontIsDefault = useDefaultSFont;

	if (!ac) {
		ac = new AudioContext();
	}

	if (synth) {
		await synth.unloadSFontAsync(sfontId);
	} else {
		// Initialize AudioWorklet
		await ac.audioWorklet.addModule('/assets/js/libfluidsynth-2.3.0.js');
		await ac.audioWorklet.addModule('/assets/js/js-synthesizer.worklet.js');
		// Create the synthesizer instance for AudioWorkletNode
		synth = new JSSynth.AudioWorkletNodeSynthesizer();
		// https://www.fluidsynth.org/api/settings_synth.html#settings_synth_overflow_released
		synth.init(ac.sampleRate); // setting渡しても適用されない
		console.log('# init')
		const node = synth.createAudioNode(ac); // setting渡しても適用されない
		node.connect(ac.destination);
	}

	// Load binaries
	const sfontBin = await promiseSFont;

	// Load SoundFont data to the synthesizer
	sfontId = await synth.loadSFont(sfontBin);

	return synth;
}

function setPlayingStatus(status) {
	document.getElementById('PlayingStatus').innerText = status;
	playingStatus = status;
}

async function doPlay() {
	const useDefaultSFont = true;
	const useDefaultMusic = true;

	setPlayingStatus('Preparing');

	console.log("--- init loading..")
	const musicBin = await loadMusic(useDefaultMusic)
	const synth = await initializeSynthesizer(useDefaultSFont)
	console.log("--- init loading.. done")

	// Load SMF file data to the synthesizer
	console.log("musicBin", musicBin)
	await synth.addSMFDataToPlayer(musicBin);

	synth.retrievePlayerTotalTicks().then(
		r => console.log("retrievePlayerTotalTicks>", r)
	)

	// Play the loaded SMF data
	await synth.playPlayer();

	setPlayingStatus('Playing');

	// Wait for finishing playing
	await synth.waitForPlayerStopped();

	// Wait for all voices stopped
	await synth.waitForVoicesStopped();

	// Reset synthesizer (release loaded SMF data)
	// await synth.resetPlayer(); // これは曲を変更(solo再生成)した場合

	setPlayingStatus('Stopped');
}

function playMusic() {
	if (playingStatus === 'Playing') {

		console.log('---stop')

		noteIndex1 = 0;
		synth.stopPlayer();
		noteIndexStatus1 = 0;

	} else if (playingStatus === 'Stopped') {

		console.log('---start')
		// # search

		doPlay();

	}
}

function samplesToTime(at) {
	if (!at) at = 0;
	const in_s = Math.ceil(at / 1000);
	const s = in_s % 60;
	const min = in_s / 60 | 0;
	const res = min + ':' + (s === 0 ? '00' : s < 10 ? '0' + s : s);
	return res;
}

player_timer();
function player_timer() {

	// setTime loop
	var progress = _getid('progress');
	var progress2 = _getid('progress2');
	const noteView = _getid('noteView');

	const noteRowClass = document.getElementsByClassName("noteRow");
	const noteRowClass2 = document.getElementsByClassName("noteRow");

	clearInterval(playertimer);
	playertimer = setInterval(function () {

		// player_updateui();
		if (synth && !gprogressdown && synth.isPlaying()) {

			synth.retrievePlayerTotalTicks().then(function (v) {
				var len = v;
				synth.retrievePlayerCurrentTick().then(function (tick) {
					var current = tick;

					if (noteIndexStatus1 === 0) {
						noteIndexStatus1 = 1;
						// search note
						for (let ni = 0; ni < view.noteList[0].length; ni++) {
							// console.log('#######=========== SEARCH', ni); // , tick, 'view', view.noteList.length, 'status', noteIndexStatus1);
							const note1 = view.noteList[0][ni];
							if (tick <= note1.et) {
								noteIndex1 = ni;
								break;
							}
						}
					}
					else {
						let note1 = view.noteList[0][noteIndex1 + 1];
						if (tick > note1.st) {
							// 		console.log(note.sym);
							noteIndex1++;
							document.getElementById("noteView1").innerHTML = note1.sym;
							noteRowClass[note1.sp.l - 1].style.backgroundColor = "#333";
							noteRowClass[note1.sp.l - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
						}
					}

					if (noteIndexStatus2 === 0) {
						noteIndexStatus2 = 1;
						// search note
						for (let ni = 0; ni < view.noteList[1].length; ni++) {
							// console.log('#######=========== SEARCH', ni); // , tick, 'view', view.noteList.length, 'status', noteIndexStatus1);
							const note2 = view.noteList[0][ni];
							if (tick < note2.et) {
								noteIndex2 = ni;
								break;
							}
						}
					}
					else {
						let note2 = view.noteList[1][noteIndex2 + 1];
						if (tick >= note2.st) {
							// 		console.log(note.sym);
							noteIndex2++;
							document.getElementById("noteView2").innerHTML = note2.sym;
							noteRowClass2[note2.sp.l - 1].style.backgroundColor = "#222";
							noteRowClass2[note1.sp.l - 2].scrollIntoView({ behavior: 'smooth', block: 'center' });
						}
					}

					if (len <= 0) len = 0;
					if (current <= 0) current = 0;
					progress.max = len;
					progress.value = current;
					progress2.innerHTML = current + '..' + samplesToTime(current) + ' / ' + samplesToTime(len);
					// document.getElementById("noteView").innerHTML = note.sym;// noteIndexStatus + ':' + tick + ':' + noteIndex + ':' + view.noteList[0][noteIndex].sym;

					playerlen = len;
					if (current === len) clearInterval(playertimer)
				});
			});

		}
	}, 3);
}

function progress_onmousemove() {
	var v = _getid('progress').value;
	console.log(932)
	noteIndexStatus1 = 0;
	noteIndexStatus2 = 0;
	_getid('progress2').innerHTML = samplesToTime(v) + ' / ' + samplesToTime(playerlen);
}
function progress_onmouseup() {
	console.log(933)
	noteIndexStatus1 = 0;
	noteIndexStatus2 = 0;
	var v = _getid('progress').value;
	_getid('progress2').innerHTML = samplesToTime(v) + ' / ' + samplesToTime(playerlen);
	if (synth) {
		synth.seekPlayer(v);
	}
	// gprogressdown=false;
}

function _getid(id) {
	return document.getElementById(id);
}
