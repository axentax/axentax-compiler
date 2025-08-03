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

// initializeSynthesizer("ChoriumRevA.sf2").then(sy => {
// 	console.log("ready")
// 	synth = sy});

// console.log("loading..")
// Promise.all([
// 	// Initialize the synthesizer
// 	initializeSynthesizer(null),
// 	// Load SMF file binary
// 	loadMusic(null)
// ]).then(r => {
// 	console.log("success")
// });

// function getFormInput(name) {
// 	return document.getElementById('DataSelector').elements[name];
// }

async function loadBinary(url) {
	const resp = await fetch(url);
	return await resp.arrayBuffer();
}

// async function loadBinaryFromFile(input) {
// 	if (input.files.length === 0) {
// 		return null;
// 	}
// 	const file = input.files[0];
// 	return await new Promise((resolve, reject) => {
// 		const reader = new FileReader();
// 		reader.onloadend = () => resolve(reader.result);
// 		reader.onerror = () => reject(new Error('Unable to read'));
// 		reader.readAsArrayBuffer(file);
// 	});
// }

// async function loadDefaultSFont() {
// 	if (sfontBin) {
// 		return sfontBin;
// 	}
// 	const buff = await loadBinary('/assets/ChoriumRevA.sf2');
// 	sfontBin = buff;
// 	return buff;
// }

// async function loadDefaultMusic() {
// 	if (musicBin) {
// 		return musicBin;
// 	}
// 	const buff = await loadBinary('/assets/zambra.midi');
// 	musicBin = buff;
// 	return buff;
// }

function loadSFont(useDefaultSFont) {
	if (sfontBin) {
		return sfontBin;
	}
	
	const buff = loadBinary('/assets/sf/TimGM6mb.sf2'); // FS-Gibson-Les-Paul-I5-HedSound.sf2
	// const buff = loadBinary('/assets/sf/Fender_Stratocaster.sf2');
	// Fender_Stratocaster.sf2

	// /assets/ChoriumRevA.sf2
	// Pianoteq_8_Classical_Guitar.sf2
	// Studio_FG460s_II_Pro_Guitar_Pack
	// TimGM6mb.sf2 // これがメイン
	sfontBin = buff;
	return buff;
	// return useDefaultSFont
	// 	? loadDefaultSFont()
	// 	: loadBinaryFromFile(getFormInput('DataSoundfontInput'))
	// 		.then(
	// 			// if soundfont is not selected, use default
	// 			(bin) => bin || loadDefaultSFont()
	// 		);
}

function loadMusic(useDefaultMusic) {
	if (musicBin) {
		console.log('no change data')
		return musicBin;
	}
	console.log('new data')
	const buff = loadBinary('/out/out.mid');//zambra.midi
	musicBin = buff;
	return buff;
	// return useDefaultMusic
	// 	? loadDefaultMusic()
	// 	: loadBinaryFromFile(getFormInput('DataSMFFileInput'))
	// 		.then(
	// 			// if SMF file is not selected, use default
	// 			(bin) => bin || loadDefaultMusic()
	// 		);
}

async function initializeSynthesizer(useDefaultSFont) {
	if (synth && useDefaultSFont) {
		console.log("111")
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
	// const useDefaultSFont = getFormInput('DataSoundfontSelect').value === 'default';
	// const useDefaultMusic = getFormInput('DataSMFFileSelect').value === 'default';
	const useDefaultSFont = true;
	const useDefaultMusic = true;

	setPlayingStatus('Preparing');

	console.log("loading..")

	const musicBin = await loadMusic(useDefaultMusic)

	const synth = await initializeSynthesizer(useDefaultSFont)

	// const [synth, musicBin] = await Promise.all([
	// 	// Initialize the synthesizer
	// 	initializeSynthesizer(useDefaultSFont),
	// 	// Load SMF file binary
	// 	loadMusic(useDefaultMusic)
	// ]);
	console.log("..done")
	
	// Load SMF file data to the synthesizer
	await synth.addSMFDataToPlayer(musicBin);

	synth.retrievePlayerTotalTicks().then(
		r => console.log(r)
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
		synth.stopPlayer();
	} else if (playingStatus === 'Stopped') {
		doPlay();
	}
}

function samplesToTime(at) {
	if(!at) at=0;
	const in_s = Math.ceil(at / 1000);
	const s = in_s % 60;
	const min = in_s / 60 | 0;
	const res =  min + ':' + (s === 0 ? '00' : s < 10 ? '0' + s : s);
	return res;
}

player_timer();
function player_timer(){

	var progress = _getid('progress');
	var progress2 = _getid('progress2');
	clearInterval(playertimer);
	playertimer = setInterval(function(){
		// player_updateui();
		if(synth && !gprogressdown && synth.isPlaying()){
			
			synth.retrievePlayerTotalTicks().then(function(v){
				var len=v;
				synth.retrievePlayerCurrentTick().then(function(v){
					var current=v;
					if(len<=0) len=0;
					if(current<=0) current=0;
					progress.max=len;
					progress.value=current;
					progress2.innerHTML=samplesToTime(current) + ' / ' + samplesToTime(len);
					playerlen=len;

					if (current === len) clearInterval(playertimer)
				});
			});

			// note view
			let hasEscape = false;
			for (let i = 0; i < noteRows.length; i++) {

				if (hasEscape) continue;

				noteRow = noteRows[i];
				if (noteRow.tick <= progress.value) {
					const _dom = _getid('noteRows');

					let startIndex = i - 20;
					let endIndex = i + 20;
					if (startIndex < 0) startIndex = 0;
					if (endIndex > noteRows.length - 1) endIndex = noteRows.length - 1
					
					let _htm = '';
					for (let n = startIndex; n <= endIndex; n++) {
						if (n === i) {
							_htm += '<span style="font-weight:normal;color:#fff;font-size:16px">' + noteRows[n].note + '</span><br>'
						} else {
							_htm += noteRows[n].note + '<br>'
						}
					}

					_dom.innerHTML = _htm;
					// hasEscape = true;
				}
			}

		}

	},100);
}

function progress_onmousemove(){
		var v=_getid('progress').value;
		_getid('progress2').innerHTML=samplesToTime(v)+' / ' +samplesToTime(playerlen);
}
function progress_onmouseup(){
	console.log(933)
	var v =_getid('progress').value;
	_getid('progress2').innerHTML=samplesToTime(v)+' / ' +samplesToTime(playerlen);
	if(synth){
		synth.seekPlayer(v);
	}
	// gprogressdown=false;
}

function _getid(id){
	return document.getElementById(id);
}
