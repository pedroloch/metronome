import { useEventListener } from '@vueuse/core'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'RangeInput',
  props: {
    min: {
      type: Number,
      default: 10,
    },
    max: {
      type: Number,
      default: 500,
    },
    modelValue: {
      type: Number,
      default: 100,
    },
    showNumbers: {
      type: Boolean,
    },
    showTooltip: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const calculateWidth = computed(() => {
      const value = ((props.modelValue - props.min) / props.max) * 100
      return value > 100 ? 100 : value
    })

    let clickTime: number

    const progressDrag = ref(false)

    const rangeInput = ref<HTMLElement>()

    const move = (e: MouseEvent) => {
      if (progressDrag.value && rangeInput.value) {
        const offsetLeft = rangeInput.value.getBoundingClientRect().left
        const width = rangeInput.value.offsetWidth
        const position = e.pageX - offsetLeft

        const value = props.min + (position / width) * (props.max - props.min)
        if (position >= 0 && position <= width) {
          emit('update:modelValue', value > 10 ? Math.ceil(value) : 10)
        }
      }
    }

    useEventListener(document, 'mousemove', move)
    useEventListener(document, 'pointermove', move)

    useEventListener(document, 'mouseup', () => {
      progressDrag.value = false
    })

    return () => (
      <div class='flex w-full m-auto items-center justify-center '>
        <div class='py-1 relative min-w-full'>
          <div
            class='h-2 bg-gray-200 rounded-full'
            onMousedown={() => (progressDrag.value = true)}
            onPointerdown={() => (progressDrag.value = true)}
            // onClick={(e) => {
            //   const value =
            //     props.min +
            //     (e.offsetX / rangeInput.value!.offsetWidth) *
            //       (props.max - props.min)

            //   e.stopPropagation()

            //   emit('update:modelValue', value > 10 ? Math.ceil(value) : 10)
            // }}
            ref={rangeInput}
          >
            <div
              class='absolute h-2 rounded-full bg-teal-600 w-0'
              style='width: 58.5714%;'
            ></div>
            <div
              style={`width: calc(${calculateWidth.value}% + 2px)`}
              class='absolute h-2 bg-gradient-to-l from-indigo-200 to-indigo-300 rounded-full'
            ></div>
            <div
              class='absolute h-4 flex items-center justify-center w-4 rounded-full bg-white shadow border border-gray-300 top-0 cursor-pointer'
              style={`left: ${calculateWidth.value}%`}
            >
              {props.showTooltip && (
                <div class='relative -mt-2 w-1'>
                  <div
                    class='absolute z-40 opacity-100 bottom-100 mb-2 min-w-full'
                    style={`left: -24px`}
                  >
                    <div class='relative shadow-md'>
                      <div class='bg-black -mt-8 text-white truncate text-xs rounded py-1 px-4'>
                        {props.modelValue}
                      </div>
                      <svg
                        class='absolute text-black w-full h-2 left-0 top-100'
                        x='0px'
                        y='0px'
                        viewBox='0 0 255 255'
                      >
                        <polygon
                          class='fill-current'
                          points='0,0 127.5,127.5 255,0'
                        ></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {props.showNumbers && (
              <>
                {' '}
                <div class='absolute text-gray-800 -ml-1 bottom-0 left-0 -mb-6'>
                  {props.min}
                </div>
                <div class='absolute text-gray-800 -mr-1 bottom-0 right-0 -mb-6'>
                  {props.max}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  },
})
