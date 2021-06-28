import { computed, defineComponent } from 'vue'
import { setCompass, compass, notePlayed } from '../../composable/useMetronome'
import Minus from '../icons/Minus'
import Plus from '../icons/Plus'

export default defineComponent({
  name: 'BeatsController',
  setup() {
    const getClass = (
      notePlayed: number,
      index: number,
      beat: number,
      pitch: number
    ) => {
      if (beat > pitch) {
        if (notePlayed === index) return 'bg-blue-300 opacity-50'
        else return 'bg-yellow-500'
      } else {
        return 'bg-gray-700'
      }
    }

    const getWidth = computed(() => {
      if (compass.value.length > 12) return 'w-3'
      if (compass.value.length > 8) return 'w-4'
      if (compass.value.length > 4) return 'w-5'
      return 'w-6'
    })

    const changePitch = (index: number) => {
      if (compass.value[index] === 0) compass.value[index] = 3
      else compass.value[index]--
    }

    return () => (
      <div>
        <div class='flex justify-end items-center mb-1 text-gray-600 text-sm'>
          <span class='mr-2'>Beats</span>
          <Minus
            class='h-3.5 bg-indigo-200 rounded  p-px cursor-pointer'
            onClick={() => setCompass(compass.value.length - 1)}
          />
          <span class='mx-2'>{compass.value.length}</span>
          <Plus
            class='h-3.5 bg-indigo-200 rounded  p-px cursor-pointer'
            onClick={() => setCompass(compass.value.length + 1)}
          />
        </div>
        <div class='bg-gray-800 flex py-8 w-full rounded px-2'>
          {compass.value.map((beat, i) => (
            <div
              class='w-full flex flex-col justify-center items-center cursor-pointer'
              onClick={() => changePitch(i)}
            >
              {[2, 1, 0].map((pitch) => (
                <span
                  key={pitch}
                  class={[
                    'h-6',
                    getClass(notePlayed.value, i, beat, pitch),
                    getWidth.value,
                  ]}
                ></span>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  },
})
