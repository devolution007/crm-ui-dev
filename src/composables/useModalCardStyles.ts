import { ScreenSize } from 'src/types'
import { computed, ComputedRef, CSSProperties } from 'vue'
import { Screen } from 'quasar'

export type ModalCardSize = 'small' | 'medium' | 'large'

// TIP: In addition with the useModalCardStyles, you can use the
// :full-width="$q.screen.lt.md" prop on the QDialog component

export function useModalCardStyles (
  size: ModalCardSize,
  applyFromScreen: ScreenSize = 'xs',
  additionalStyles: CSSProperties = {}
): {
  modalCardStyles: ComputedRef<CSSProperties>
} {
  const modalCardStyles = computed(() => {
    if (applyFromScreen !== 'xs' && Screen.lt[applyFromScreen]) {
      return {
        ...additionalStyles
      }
    }

    let styles = {}

    switch (size) {
      case 'small':
        styles = StylesSmallCompute()
        break
      case 'medium':
        styles = StylesMediumCompute()
        break
      case 'large':
        styles = StylesLargeCompute()
        break
    }
    return {
      ...styles,
      ...additionalStyles
    }
  })
  return {
    modalCardStyles
  }
}

const StylesSmallCompute = () => {
  let minWidth = '320px'
  let maxWidth = '320px'
  if (Screen.gt.xs) { // >= 600px < 1023.99px
    minWidth = '400px'
    maxWidth = '500px'
  }
  if (Screen.gt.sm) { // >= 1024px < 1439.99px
    minWidth = '600px'
    maxWidth = '700px'
  }
  return {
    minWidth,
    maxWidth
  }
}

const StylesMediumCompute = () => {
  let minWidth = '320px'
  let maxWidth = '320px'
  if (Screen.gt.xs) { // >= 600px < 1023.99px
    minWidth = '500px'
    maxWidth = '700px'
  }
  if (Screen.gt.sm) { // >= 1024px < 1439.99px
    minWidth = '600px'
    maxWidth = '700px'
  }
  return {
    minWidth,
    maxWidth
  }
}

const StylesLargeCompute = () => {
  let minWidth = '320px'
  let maxWidth = '320px'
  if (Screen.gt.xs) { // >= 600px < 1023.99px
    minWidth = '600px'
    maxWidth = '900px'
  }
  if (Screen.gt.sm) { // >= 1024px < 1439.99px
    minWidth = '950px'
    maxWidth = '1200px'
  }
  return {
    minWidth,
    maxWidth
  }
}
