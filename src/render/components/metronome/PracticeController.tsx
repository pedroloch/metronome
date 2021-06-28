import { defineComponent, reactive } from 'vue'
import { practice, stop, tempoConditions } from '../../composable/useMetronome'
import Minus from '../icons/Minus'
import Plus from '../icons/Plus'

export default defineComponent({
  name: 'PracticeController',
  props: {
    onClose: { type: Function, required: true },
  },
  setup(props) {
    const practiceInputs = reactive({
      startTempo: 60,
      endTempo: 120,
      increaseBy: 1,
      interval: 4,
    })

    interface PracticeInput {
      label: string
      input: keyof typeof practiceInputs
    }

    const inputs: PracticeInput[] = [
      {
        label: 'Start time',
        input: 'startTempo',
      },
      {
        label: 'End time',
        input: 'endTempo',
      },
      {
        label: 'Increase By',
        input: 'increaseBy',
      },
      {
        label: 'Every',
        input: 'interval',
      },
    ]

    const decrease = (input: keyof typeof practiceInputs) => {
      practiceInputs[input] > 0 && practiceInputs[input]--
    }
    const increase = (input: keyof typeof practiceInputs) => {
      practiceInputs[input] < tempoConditions.max && practiceInputs[input]++
    }

    const checkConditions = (
      input: keyof typeof practiceInputs,
      e: FocusEvent
    ) => {
      const { min, max } = tempoConditions
      const { value } = e.target as HTMLInputElement

      if (+value < min) practiceInputs[input] = min
      if (+value > max) practiceInputs[input] = max
    }

    return () => (
      <div class='absolute bg-gray-500 bg-opacity-50 inset-0 flex justify-center items-center'>
        <div
          class=' bg-white p-3 w-52 rounded shadow flex flex-col items-center justify-center text-gray-800 z-50'
          id='practice-modal'
        >
          <span class='text-2xl mb-1'>Practice</span>
          <div class='flex flex-col items-center justify-center space-y-1'>
            {inputs.map(({ input, label }) => (
              <div class='flex flex-col items-center justify-center mb-1'>
                <small>{label}</small>
                <div class='flex space-x-3 items-center justify-center'>
                  <Minus
                    class='h-4 bg-green-500 text-white p-px rounded cursor-pointer'
                    onClick={() => decrease(input)}
                  />
                  <input
                    type='number'
                    class='text-sm text-center p-0 border-none w-12'
                    v-model={[practiceInputs[input], ['number']]}
                    min={
                      input === 'startTempo' || input === 'endTempo'
                        ? tempoConditions.min
                        : 1
                    }
                    max={
                      input === 'startTempo' || input === 'endTempo'
                        ? tempoConditions.max
                        : 100
                    }
                    onBlur={(e) => {
                      if (input === 'startTempo' || input === 'endTempo')
                        checkConditions(input, e)
                    }}
                  />
                  <Plus
                    class='h-4 bg-green-500 text-white p-px rounded cursor-pointer'
                    onClick={() => increase(input)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            class='mt-4 bg-indigo-600 text-white w-full py-1 rounded hover:bg-indigo-500'
            onClick={() => {
              stop()
              practice(practiceInputs)
              props.onClose()
            }}
          >
            Start
          </button>
        </div>
      </div>
    )
  },
})
