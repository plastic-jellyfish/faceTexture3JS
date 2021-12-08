const audioContext = new AudioContext()
const buffer = audioContext.createBuffer(1,audioContext.sampleRate*1, audioContext.sampleRate)

const channelData = buffer.getChannelData(0)

var randNote = Math.floor(Math.random()*10)
var freq =  Math.floor((Math.random() * 1000) + 1); 
var cut = audioContext.currentTime


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
//piano:)
const notes= [
    {name:"C", frequency: 261.63},
    {name:"C#", frequency: 277.18},
    {name:"D", frequency: 293.66},
    {name:"D#", frequency: 311.13},
    {name:"E", frequency: 329.63},
    {name:"F", frequency: 349.23},
    {name:"F#", frequency: 369.99},
    {name:"G", frequency: 392.0},
    {name:"G#", frequency: 415.3},
    {name:"A", frequency: 440.0},
    {name:"A#", frequency: 466.16},
    {name:"B", frequency: 493.88},
    {name:"C", frequency: 523.25}
]

function playMelody(freq){
// notes.forEach(({name,frequency}) => {
    // const noteButton = document.createElement('button')
    // noteButton.innerText=name
    // document.getElementById(notes[randNote].name).addEventListener("click", () => {
        const noteOSC = audioContext.createOscillator()
        noteOSC.frequency.setValueAtTime(freq, audioContext.currentTime)
        noteOSC.type="square"
        // noteOSC.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + .5)

        const vibarato = audioContext.createOscillator()
        vibarato.frequency.setValueAtTime(5,0)
        // vibarato.type="square"
        const vibaratoGain = audioContext.createGain()
        vibaratoGain.gain.setValueAtTime(10,0)
        vibarato.connect(vibaratoGain)
        vibaratoGain.connect(noteOSC.frequency)
        // vibaratoGain.connect(vibaratoGain.gain)
        vibarato.start()

        const attackTime = 0.2
        const decayTime = 0.3
        const sustainLevel = 0.3
        const releaseTime = 0.2

        const now = audioContext.currentTime
        const noteGain = audioContext.createGain()
        noteGain.gain.setValueAtTime(0,0)      
        noteGain.gain.linearRampToValueAtTime(.5, now + attackTime)
        noteGain.gain.linearRampToValueAtTime(sustainLevel, now + decayTime)
        noteGain.gain.setValueAtTime(sustainLevel, now+1 - releaseTime)
        noteGain.gain.linearRampToValueAtTime(0,now+5)

        noteOSC.connect(noteGain)
        noteGain.connect(primaryGainControl)
        noteOSC.start()
        noteOSC.stop(now + 10)
 
    // })  
    // document.body.appendChild(noteButton)
// })
}

const loop = () => {
    if (audioContext.currentTime - cut > (Math.random()+1.5)){
        freq =  Math.floor((Math.random() * 500) + 100); 
        cut = audioContext.currentTime
        playMelody(freq)
        // console.log(freq)
    }
    window.requestAnimationFrame(loop)
}
loop()