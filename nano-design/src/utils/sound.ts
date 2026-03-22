const cache = new Map<string, HTMLAudioElement>()
let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function getAudio(name: string): HTMLAudioElement {
  let audio = cache.get(name)
  if (!audio) {
    audio = new Audio(`/sounds/${name}.wav`)
    cache.set(name, audio)
  }
  return audio
}

// Synthesized sounds
const synths: Record<string, () => void> = {
  BubblePop: () => {
    const cx = getCtx()
    const o = cx.createOscillator()
    const g = cx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(500, cx.currentTime)
    o.frequency.exponentialRampToValueAtTime(1200, cx.currentTime + 0.06)
    g.gain.setValueAtTime(0.1, cx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, cx.currentTime + 0.1)
    o.connect(g).connect(cx.destination)
    o.start(); o.stop(cx.currentTime + 0.1)
  },
}

export function playSound(name: string) {
  if (synths[name]) {
    synths[name]()
    return
  }
  const audio = getAudio(name)
  audio.currentTime = 0
  audio.play().catch(() => {})
}
