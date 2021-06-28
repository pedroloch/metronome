import { useEventListener } from '@vueuse/core'
import { computed, defineComponent, ref } from 'vue'
import { volume } from '../../composable/useMetronome'
import Volume from '../icons/Volume'

export default defineComponent({
  name: 'VolumeController',
  setup() {
    const volumeRange = ref<HTMLElement>()
    const volumeDrag = ref(false)

    useEventListener(document, 'mouseup', () => {
      volumeDrag.value = false
    })

    useEventListener(document, 'mousemove', (e) => {
      if (volumeDrag.value && volumeRange.value) {
        const offsetLeft = volumeRange.value.getBoundingClientRect().left
        const width = volumeRange.value.offsetWidth
        const position = e.pageX - offsetLeft

        if (position >= 0 && position <= width) {
          volume.value = (position / width) * 100
        }
      }
    })

    return () => (
      <div class='absolute bg-gray-500 bg-opacity-50 inset-0 flex justify-center items-center'>
        <div class='max-w-xs w-full volume-modal'>
          <div class='w-10/12 bg-white py-2.5 rounded flex justify-center items-center text-gray-600 m-auto shadow'>
            <div class='w-full flex space-x-2 items-center px-3'>
              <Volume
                class='h-7 cursor-pointer'
                onClick={() =>
                  volume.value ? (volume.value = 0) : (volume.value = 100)
                }
              />
              <div
                class='w-full h-2 bg-gray-200 rounded relative cursor-pointer'
                onMousedown={() => (volumeDrag.value = true)}
                onClick={({ offsetX }) => {
                  volume.value =
                    (offsetX / volumeRange.value!.offsetWidth) * 100
                }}
                ref={volumeRange}
              >
                <div
                  class='absolute h-2 bg-indigo-600 rounded'
                  style={`width: ${volume.value}%`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
