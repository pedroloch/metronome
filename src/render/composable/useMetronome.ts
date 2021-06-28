import { onUnmounted, provide, readonly, ref } from 'vue'

export interface MetronomeOptions {
  tempo: number
  compass: number[]
}

const defaultOpt: MetronomeOptions = {
  tempo: 100,
  compass: [3, 1, 1, 1] as number[],
}

let audioContext: AudioContext
let intervalID: NodeJS.Timeout
let practiceInterval: NodeJS.Timeout

let nextNoteTime = 0.0 // when the next note is due
export const currentNote = ref(0)
export const notePlayed = ref(-1)

export const tempo = ref<number>(defaultOpt.tempo)
export const tempoConditions = {
  min: 10,
  max: 350,
}

export const checkConditions = (e: FocusEvent) => {
  const { min, max } = tempoConditions
  const { value } = e.target as HTMLInputElement

  if (+value < min) tempo.value = min
  if (+value > max) tempo.value = max
}

export const volume = ref(50)

const notesInQueue = [] // notes that have been put into the web audio and may or may not have been played yet {note, time}
const lookahead = 25 // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1 // How far ahead to schedule audio (sec)

export const isRunning = ref(false)
export const compass = ref(defaultOpt.compass)

function nextNote() {
  {
    // Advance current note and time by a quarter note (crotchet if you're posh)
    const secondsPerBeat = 60.0 / tempo.value // Notice this picks up the CURRENT .value value to calculate beat length.
    nextNoteTime += secondsPerBeat // Add beat length to last beat time

    currentNote.value++ // Advance the beat number, wrap to zero
    if (currentNote.value == compass.value.length) {
      currentNote.value = 0
    }
  }
}

function scheduleNote(beatNumber: number, time: number) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time: time })

  // create an oscillator
  const osc = audioContext?.createOscillator()
  const envelope = audioContext?.createGain()

  if (osc && envelope && audioContext) {
    osc.frequency.value =
      compass.value[currentNote.value] === 0
        ? 1
        : 800 + compass.value[currentNote.value] * 300
    notePlayed.value = currentNote.value
    envelope.gain.value = (1.5 * volume.value) / 100
    envelope.gain.exponentialRampToValueAtTime(
      (1 * volume.value) / 100,
      time + 0.001
    )
    envelope.gain.exponentialRampToValueAtTime(
      (0.001 * volume.value) / 100,
      time + 0.02
    )
    osc.connect(envelope)
    envelope.connect(audioContext.destination)

    osc.start(time)
    osc.stop(time + 0.03)
  }
}

function scheduler() {
  // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
  if (audioContext) {
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
      scheduleNote(currentNote.value, nextNoteTime)
      nextNote()
    }
  }
}

export function start() {
  if (isRunning.value) return

  if (audioContext == null) {
    audioContext = new window.AudioContext()
  }

  isRunning.value = true
  currentNote.value = 0
  nextNoteTime = audioContext.currentTime + 0.03
  intervalID = setInterval(() => scheduler(), lookahead)
}

export function stop() {
  isRunning.value = false
  clearInterval(intervalID)
  clearInterval(practiceInterval)
}

export function toggle() {
  if (isRunning.value) {
    stop()
  } else {
    start()
  }
}

export function setTempo(val: number) {
  if (val >= 10 && val <= 500) tempo.value = val
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setCompass = (beats: number) => {
  console.log(beats)

  if (beats === 0 || beats > 16) return
  if (beats > compass.value.length)
    compass.value.push(...new Array(beats - compass.value.length).fill(1))
  if (beats < compass.value.length)
    compass.value = compass.value.slice(0, beats)
}

export const practice = ({
  startTempo,
  endTempo,
  interval,
  increaseBy,
}: {
  startTempo: number
  endTempo: number
  interval: number
  increaseBy: number
}) => {
  setTempo(startTempo)
  start()
  tempo.value -= increaseBy

  function startPractice() {
    tempo.value += increaseBy
    if (tempo.value < endTempo) {
      practiceInterval = setTimeout(
        startPractice,
        (60000 / tempo.value) * interval * compass.value.length
      )
    }
  }

  startPractice()
}
