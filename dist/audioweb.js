const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j']

const recordButton = document.querySelector('.record-button')
const playButton = document.querySelector('.play-button')
// const saveButton = document.querySelector('.save-button')
// const songLink = document.querySelector('.song-link')
const keys = document.querySelectorAll('.key')
const whiteKeys = document.querySelectorAll('.key.white')
const blackKeys = document.querySelectorAll('.key.black')

const currentSong = 'undefined'

const audioContext = new AudioContext()
const buffer = audioContext.createBuffer(1,audioContext.sampleRate*1, audioContext.sampleRate)

const channelData = buffer.getChannelData(0)

var randNote = Math.floor(Math.random()*10)
var freq =  Math.floor((Math.random() * 1000) + 1); 
var cut = audioContext.currentTime
var vibFreq = {vibrato: 4}
var bgVol = {BackVolume: .5}

for(let i=0 ; i<buffer.length; i++){
    channelData[i]= Math.random() *2 -1
}

const primaryGainControl = audioContext.createGain()
primaryGainControl.gain.setValueAtTime(0.05,0)
primaryGainControl.connect(audioContext.destination)

/*
document.getElementById('whitenoise').addEventListener("click", ()=>{
    const whiteNoise = audioContext.createBufferSource()
    whiteNoise.buffer = buffer
    whiteNoise.connect(primaryGainControl)
    whiteNoise.start()
})

//Snare
const snareFilter = audioContext.createBiquadFilter()
snareFilter.type = "highpass"
snareFilter.frequency.value= 1500;
snareFilter.connect(primaryGainControl)

document.getElementById('snareButton').addEventListener("click", ()=>{
    const whiteNoise = audioContext.createBufferSource()
    whiteNoise.buffer = buffer

    const whiteNoiseGain = audioContext.createGain()
    whiteNoiseGain.gain.setValueAtTime(1, audioContext.currentTime)
    whiteNoiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + .2)

    whiteNoise.connect(whiteNoiseGain)
    whiteNoiseGain.connect(snareFilter)
    whiteNoise.start()
    whiteNoise.stop(audioContext.currentTime + .2)

    const snareOSC = audioContext.createOscillator()
    snareOSC.frequency.setValueAtTime(300, audioContext.currentTime)
    snareOSC.type = "triangle"
    // snareOSC.frequency.exponentialRampToValueAtTime(.01, audioContext.currentTime + 1)

    const snareGain = audioContext.createGain()
    snareGain.gain.setValueAtTime(1, audioContext.currentTime)
    snareGain.gain.exponentialRampToValueAtTime(.01, audioContext.currentTime + .2)

    snareOSC.connect(snareGain)
    snareGain.connect(primaryGainControl)
    snareOSC.start()
    snareOSC.stop(audioContext.currentTime + .2)

})


//Kick
document.getElementById('kickButton').addEventListener("click", ()=>{
    const kickOSC = audioContext.createOscillator()
    kickOSC.frequency.setValueAtTime(650,0)
    kickOSC.type="sawtooth"
    kickOSC.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1)

    const kickGain = audioContext.createGain()
    kickGain.gain.setValueAtTime(1,0)
    kickGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1)

    kickOSC.connect(kickGain)
    kickGain.connect(primaryGainControl)
    kickOSC.start()
    kickOSC.stop(audioContext.currentTime + 1)
})

//HiHAT
const hihatURL = "https://unpkg.com/@teropa/drumkit@1.1.0/src/assets/hatOpen2.mp3"
document.getElementById('hiHatButton').addEventListener("click", async () => {
    const response = await fetch(hihatURL)
    const soundBuffer = await response.arrayBuffer()
    const hihatBuffer = await audioContext.decodeAudioData(soundBuffer)

    const hiHatSource = audioContext.createBufferSource()
    hiHatSource.buffer = hihatBuffer
    hiHatSource.playbackRate.setValueAtTime(1, 0)

    hiHatSource.connect(primaryGainControl)
    hiHatSource.start()
})
*/

const keyMap = [...keys].reduce((map,key) => {
    map[key.dataset.note] = key
    return map
  }, {})
  
let recordingStartTime
let songNotes = currentSong && currentSong.notes
  
console.log(currentSong)
  
keys.forEach(key => {
  key.addEventListener('click', () => playNote(key))
})
  
if(recordButton){
  recordButton.addEventListener('click', toggleRecording)
}
// if(saveButton){
//   saveButton.addEventListener('click', saveSong)
// }
playButton.addEventListener('click', () => {
    if(playButton.classList.contains('show')) playsong()
})
  
document.addEventListener('keydown', e => {
    if (e.repeat) return
    const key = e.key
    const whiteKeyIndex = WHITE_KEYS.indexOf(key)
    const blackKeyIndex = BLACK_KEYS.indexOf(key)
  
    if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex])
    if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex])
})
  
function toggleRecording(){
    recordButton.classList.toggle('active')
    if(isRecording()){
      startRecording()
    } else{
      stopRecording()
    }
}
  
  function isRecording(){
    return recordButton != null && recordButton.classList.contains('active')
  }
  
  function startRecording(){
    recordingStartTime = Date.now()
    songNotes = []
    playButton.classList.remove('show')
    // recordButton.innerHTML = "P"
    // saveButton.classList.remove('show')
  }
  
  function stopRecording(){
    // playsong()
    playButton.classList.add('show')
    // recordButton.innerHTML = "<i class= ' ' fas circle ' ' ></i>"
    // saveButton.classList.add('show')
  }
  
function playsong(){
    if (songNotes.length === 0) return
    let len = songNotes.length
    songNotes.forEach(note =>{
      setTimeout(() => {
        playButton.classList.add('active')
        playNote(keyMap[note.key])
        len -= 1
        if (len === 0) playButton.classList.remove('active')
      }, note.startTime)
    })
}

function recordNote(note){
  songNotes.push({
    key: note,
    startTime: Date.now() - recordingStartTime
  })
}

function playNote(key){
      // console.log(key)
      if(isRecording()) recordNote(key.dataset.note)
      const noteOSC = audioContext.createOscillator()
      noteOSC.frequency.setValueAtTime(parseFloat(key.dataset.freq), audioContext.currentTime)
      noteOSC.type="sawtooth"
     
      const vibarato = audioContext.createOscillator()
      vibarato.frequency.setValueAtTime(vibFreq.vibrato  ,0)
      vibarato.type="square"
      const vibaratoGain = audioContext.createGain()
      vibaratoGain.gain.setValueAtTime(10,0)
      vibarato.connect(vibaratoGain)
      vibaratoGain.connect(noteOSC.frequency)
      // vibaratoGain.connect(vibaratoGain.gain)
      vibarato.start()

      const attackTime = 0.2
      const decayTime = 0.3
      const sustainLevel = 0.7
      const releaseTime = 0.2

      const now = audioContext.currentTime
      const noteGain = audioContext.createGain()
      noteGain.gain.setValueAtTime(0,0)      
      noteGain.gain.linearRampToValueAtTime(1, now + attackTime)
      noteGain.gain.linearRampToValueAtTime(sustainLevel, now + decayTime)
      noteGain.gain.setValueAtTime(sustainLevel, now+1 - releaseTime)
      noteGain.gain.linearRampToValueAtTime(0,now+2)

      noteOSC.connect(noteGain)
      noteGain.connect(primaryGainControl)
      noteOSC.start()
      noteOSC.stop(now + 2)
}


function playMelody(freq){
        const noteOSC = audioContext.createOscillator()
        noteOSC.frequency.setValueAtTime(freq, audioContext.currentTime)
        noteOSC.type="sine"
        // noteOSC.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + .5)

        const vibarato = audioContext.createOscillator()
        vibarato.frequency.setValueAtTime(10,0)
        // vibarato.type="square"
        const vibaratoGain = audioContext.createGain()
        vibaratoGain.gain.setValueAtTime(5,0)
        vibarato.connect(vibaratoGain)
        vibaratoGain.connect(noteOSC.frequency)
        // vibaratoGain.connect(vibaratoGain.gain)
        vibarato.start()

        const attackTime = 0.2
        const decayTime = 0.3
        const sustainLevel = bgVol.BackVolume * 0.7
        const releaseTime = 0.2

        const now = audioContext.currentTime
        const noteGain = audioContext.createGain()
        noteGain.gain.setValueAtTime(0,0)      
        noteGain.gain.linearRampToValueAtTime(bgVol.BackVolume, now + attackTime)
        noteGain.gain.linearRampToValueAtTime(sustainLevel, now + decayTime)
        noteGain.gain.setValueAtTime(sustainLevel, now+1 - releaseTime)
        noteGain.gain.linearRampToValueAtTime(0,now+5)

        noteOSC.connect(noteGain)
        noteGain.connect(primaryGainControl)
        noteOSC.start()
        noteOSC.stop(now + 10)
}

const loop = () => {
    if (audioContext.currentTime - cut > (Math.random()+1.5)){
        freq =  Math.floor((Math.random() * 300) + 100); 
        cut = audioContext.currentTime
        playMelody(freq)
        // console.log(freq)
    }
    window.requestAnimationFrame(loop)
}
loop()