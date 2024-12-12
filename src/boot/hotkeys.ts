import { boot } from 'quasar/wrappers'
import useSuperPanel from 'src/composables/useSuperPanel'

let lastShiftPressed: number | null = null
const KeyKey = 'Shift'
const TimeToWait = 500

export default boot(async () => {
  document.body.addEventListener('keyup', (e) => {
    if (e.key === KeyKey) {
      if (lastShiftPressed && (Date.now() - lastShiftPressed < TimeToWait)) {
        lastShiftPressed = null

        const { open } = useSuperPanel()
        open()
      } else {
        lastShiftPressed = Date.now()
      }
    }

    // do something expensive ...
  }, { passive: true })
})
