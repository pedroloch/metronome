import { useEventListener } from '@vueuse/core'
import {
  Component,
  computed,
  defineComponent,
  onUnmounted,
  ref,
  watchEffect,
} from 'vue'
import CursorClick from './components/icons/CursorClick'
import Pause from './components/icons/Pause'
import Play from './components/icons/Play'
import Volume from './components/icons/Volume'
import BeatsController from './components/metronome/BeatsController'
import PracticeController from './components/metronome/PracticeController'
import TempoController from './components/metronome/TempoController'
import VolumeController from './components/metronome/VolumeController'

import { isRunning, tempo, toggle, volume } from './composable/useMetronome'

import useTap from './composable/useTap'

interface MenuItem {
  icon: Component
  name: string
  action: () => void
  id?: string
}

export default defineComponent({
  name: 'App',
  setup() {
    const showVolume = ref(false)
    const showPractice = ref(false)

    const { averageTempo, isTapping } = useTap('tap')

    watchEffect(() => {
      if (averageTempo.value && averageTempo.value < 350)
        tempo.value = averageTempo.value
    })

    const menu = computed<MenuItem[]>(() => [
      {
        icon: Volume,
        name: 'Volume',
        action: () => {
          showVolume.value = !showVolume.value
        },
        id: 'volume',
      },
      {
        icon: isRunning.value ? Pause : Play,
        name: isRunning.value ? 'Pause' : 'Play',
        action: () => {
          toggle()
        },
      },
      {
        icon: CursorClick,
        name: !isTapping.value ? 'Tap' : 'Keep tapping',
        action: () => {},
        id: 'tap',
      },
    ])

    useEventListener(document, 'click', (e) => {
      if (
        !(e.target as HTMLElement).closest('.volume-modal') &&
        !(e.target as HTMLElement).closest('#volume')
      )
        showVolume.value = false
      if (
        !(e.target as HTMLElement).closest('#practice-modal') &&
        !(e.target as HTMLElement).matches('#practice-btn')
      )
        showPractice.value = false
    })

    onUnmounted(() => {
      stop()
    })

    return () => (
      <div class='h-screen flex flex-col items-center justify-center bg-indigo-50 pt-5'>
        <div class='max-w-xs w-full py-6 px-5 space-y-5'>
          <TempoController />
          <BeatsController />
          <div class='flex gap-2'>
            {menu.value.map(
              ({ icon: Icon, action, name, id }: MenuItem, index) => (
                <div
                  class='w-full flex flex-col justify-center items-center  rounded-lg cursor-pointer space-y-1 hover:bg-white py-2 transition select-none'
                  key={index}
                  onClick={action}
                  id={id ?? name.toLowerCase()}
                >
                  {/* @ts-ignore */}
                  <Icon class='h-8 text-gray-500' />
                  <small class='text-xs text-indigo-900'>{name}</small>
                </div>
              )
            )}
          </div>
          <div
            class='bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-400 cursor-pointer font-light tracking-wide'
            id='practice-btn'
            onClick={() => (showPractice.value = true)}
          >
            Practice Mode
          </div>
        </div>
        <VolumeController v-show={showVolume.value} />
        <PracticeController
          v-show={showPractice.value}
          onClose={() => (showPractice.value = false)}
        />
      </div>
    )
  },
})
