import { onMounted, ref } from 'vue'

interface TapOptions {
  tries: number
  debounce: number
}

const tapOptions = {
  tries: 5,
  debounce: 3000,
}

export default (id: string, options: Partial<TapOptions> = tapOptions) => {
  options = Object.assign(tapOptions, options)
  const tempos: number[] = []
  let tempTap = 0
  const averageTempo = ref(0)
  const tapping = ref(false)
  let timeoutId: NodeJS.Timeout

  function convertToBPM(milisseconds: number): number {
    return Math.floor(60000 / milisseconds)
  }

  const findAverage = (arr: number[], tries: number) =>
    Math.floor(
      tempos.reduce((acc, cur) => {
        return acc + cur
      }, 0) / tries
    )

  const executeTap = () => {
    const tempo = Date.now() - tempTap
    if (tempTap) {
      if (tempos.length === options.tries) {
        averageTempo.value = findAverage(tempos, options.tries)
        tempos.shift()
      }
      tempos.push(convertToBPM(tempo))
    }

    tempTap = Date.now()
    tapping.value = true
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      console.log('aqui')
      tapping.value = false
      averageTempo.value = 0
      tempos.splice(0, options.tries)
    }, options.debounce)
  }

  document.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
      executeTap()
    }
  })

  onMounted(() => {
    document.getElementById(id)?.addEventListener('click', executeTap)
  })

  return { averageTempo, isTapping: tapping }
}
