import { defineComponent } from 'vue'
import {
  checkConditions,
  tempo,
  tempoConditions,
} from '../../composable/useMetronome'
import Minus from '../icons/Minus'
import Plus from '../icons/Plus'
import RangeInput from '../RangeInput'

export default defineComponent({
  name: 'TempoController',
  setup() {
    const iconsClasses =
      'w-8 text-indigo-400 cursor-pointer hover:text-indigo-200'

    const addValue = (value = 1) =>
      tempo.value < tempoConditions.max && (tempo.value += value)
    const removeValue = (value = 1) =>
      tempo.value > tempoConditions.min && (tempo.value -= value)

    return () => (
      <div class='flex flex-col justify-center items-center shadow rounded-2xl px-4 py-3 relative overflow-hidden bg-white space-y-1 w-full'>
        <div class='flex items-center space-x-1'>
          <Minus class={iconsClasses} onClick={() => removeValue()} />
          <input
            type='number'
            class='focus:outline-none focus-border-none  border-none text-center bg-transparent text-5xl font-medium text-gray-800 px-4 py-2 rounded-lg'
            {...tempoConditions}
            v-model={[tempo.value, ['number']]}
            onBlur={checkConditions}
          />
          <Plus class={iconsClasses} onClick={() => addValue()} />
        </div>
        <RangeInput {...tempoConditions} v-model={tempo.value} class='pb-1' />
      </div>
    )
  },
})
