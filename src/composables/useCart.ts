import { ref } from 'vue'

const rightCartOpen = ref(true)
export default function useCart () {
  const showCart = () => {
    rightCartOpen.value = true
  }
  const closeCart = () => {
    rightCartOpen.value = false
  }

  return { rightCartOpen, showCart, closeCart }
}
