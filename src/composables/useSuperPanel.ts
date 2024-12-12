import { computed, ref, watch } from 'vue'
import { Notify } from 'quasar'
import { Router } from 'vue-router'
import { CallType, useCall } from 'stores/call'

export type SelectionItemType = 'goto_customer' | 'goto_order' | 'goto_issue' | 'enter_command'
  | 'goto_customers_and_search' | 'call_in_and_search' | 'call_out_and_search' | 'call_end'

export interface SelectionItem {
  id: string
  type: SelectionItemType
  title: string
  hint?: string
  payload?: string | number
}

interface Command {
  title: string
  description: string
  command: string
  selectType: SelectionItemType
  isNeedArgs: boolean // if true, then command will be executed only if args passed
}

const commandsList: Command[] = [
  {
    title: 'Customer Search',
    description: 'Go to customers page and search for :query',
    command: 'cs',
    selectType: 'goto_customers_and_search',
    isNeedArgs: true
  },
  {
    title: 'Call (inbound)',
    description: 'Start a new incoming call and search customers for :query',
    command: 'call_in',
    selectType: 'call_in_and_search',
    isNeedArgs: true
  },
  {
    title: 'Call (outbound)',
    description: 'Start a new outbound call and search customers for :query',
    command: 'call_out',
    selectType: 'call_out_and_search',
    isNeedArgs: true
  },
  {
    title: 'Call End',
    description: 'End current call',
    command: 'call_end',
    selectType: 'call_end',
    isNeedArgs: false
  }
]

const loading = ref(false)
const isOpen = ref(false)
const searchValue = ref<null | string>(null)
const activeIndex = ref<number>(0)
const selectionHistory = ref<SelectionItem[]>([])

export default function useSuperPanel () {
  watch(searchValue, async () => {
    activeIndex.value = 0
  })

  const close = (): void => {
    isOpen.value = false
    searchValue.value = ''
  }

  const callEndCommand = async (): Promise<void> => {
    const callState = useCall()
    if (!callState.call) {
      Notify.create({
        message: 'No active call',
        color: 'negative'
      })
      return
    }
    close()
    await callState.showEndCallDialog()
  }

  const callAndSearchCommand = async (item: SelectionItem, type: CallType, router: Router) => {
    const callState = useCall()
    if (callState.call && callState.call.customer) {
      Notify.create({
        message: 'You are already in a call',
        color: 'negative'
      })
      return
    }

    if (callState.call) {
      close()
      await router.push(`/customers?search=${item.payload}`)
      return
    }

    loading.value = true
    await callState.startCall(type)
      .finally(() => {
        loading.value = false
      })

    close()
    await router.push(`/customers?search=${item.payload}`)
  }

  const open = () => {
    isOpen.value = true
  }

  const addToHistory = (item: SelectionItem): void => {
    selectionHistory.value = [
      item,
      ...selectionHistory.value.filter((i) => i.id !== item.id)
    ]
  }

  const selectionVariants = computed(() => {
    const variants: SelectionItem[] = []

    if (searchValue.value === null || searchValue.value === '') {
      return selectionHistory.value
    }

    // Commands autocomplete
    if (searchValue.value.startsWith('/') && !searchValue.value.includes(' ')) {
      const enteredCommand = searchValue.value.slice(1)
      commandsList.filter(command => command.command.startsWith(enteredCommand)).forEach(command => {
        variants.push({
          id: `enter_command_${command.command}`,
          type: command.isNeedArgs ? 'enter_command' : command.selectType,
          title: `/${command.command} - ${command.title}`,
          hint: command.description,
          payload: `/${command.command} `
        })
      })

      // Helps to find commands by first letters (e.g. /co for /call_out)
      const enteredParts = enteredCommand.split('')
      if (enteredParts.length > 1) {
        commandsList.filter(command => {
          const commandParts = command.command.split('_').map(p => p[0])
          return enteredParts.every((part, index) => part === commandParts[index])
        }).forEach(command => {
          if (variants.find(v => v.id === `enter_command_${command.command}`)) return
          variants.push({
            id: `enter_command_${command.command}`,
            type: 'enter_command',
            title: `/${command.command} - ${command.title}`,
            hint: command.description,
            payload: `/${command.command} `
          })
        })
      }
    }

    // Commands execution
    if (searchValue.value.startsWith('/') && searchValue.value.includes(' ') && searchValue.value.length > 1) {
      const commandPart = searchValue.value.split(' ')[0].substring(1)
      const valuePart = searchValue.value.split(' ').slice(1).join(' ')
      const command = commandsList.find(command => command.command === commandPart)
      if (command) {
        variants.push({
          id: `enter_command_${command.command}`,
          type: command.selectType,
          title: `/${command.command} - ${command.title}`,
          hint: command.description.replace(':query', valuePart),
          payload: valuePart
        })
      }
    }

    // Direct navigation to entities
    if (searchValue.value.length > 0 && /^\d+$/.test(searchValue.value)) {
      variants.push({
        id: `goto_order_${searchValue.value}`,
        type: 'goto_order',
        title: `Go to Order #${searchValue.value}`,
        payload: searchValue.value
      })

      variants.push({
        id: `goto_customer_${searchValue.value}`,
        type: 'goto_customer',
        title: `Go to Customer ID: ${searchValue.value}`,
        payload: searchValue.value
      })
    }

    return variants
  })

  const selectItem = async (item: SelectionItem | null, router: Router) => {
    if (!item && selectionVariants.value.length === 0) {
      Notify.create({
        message: 'Undefined command',
        color: 'negative'
      })
      return
    }

    if (!item) {
      item = selectionVariants.value[activeIndex.value]
    }

    if (item) {
      const index = selectionVariants.value.findIndex((i) => i.id === item?.id)
      if (index !== -1) {
        activeIndex.value = index
      }

      addToHistory(item)
    }

    switch (item.type) {
      case 'goto_customer':
        close()
        await router.push(`/customers/${item.payload}`)
        break
      case 'goto_order':
        close()
        await router.push(`/order/${item.payload}`)
        break
      case 'enter_command':
        searchValue.value = item.payload as string
        break
      case 'goto_customers_and_search':
        close()
        await router.push(`/customers?search=${item.payload}`)
        break
      case 'call_in_and_search':
        await callAndSearchCommand(item, 'inbound', router)
        break
      case 'call_out_and_search':
        await callAndSearchCommand(item, 'outbound', router)
        break
      case 'call_end':
        await callEndCommand()
        break
      default:
        Notify.create({
          message: `The command ${item.type} is not implemented yet`,
          color: 'negative'
        })
        break
    }
  }

  const selectNextIndex = () => {
    if (activeIndex.value < selectionVariants.value.length - 1) {
      activeIndex.value++
    } else {
      activeIndex.value = 0
    }
  }

  const selectPrevIndex = () => {
    if (activeIndex.value > 0) {
      activeIndex.value--
    } else {
      activeIndex.value = selectionVariants.value.length - 1
    }
  }

  return {
    activeIndex,
    isOpen,
    commandsList,
    close,
    open,
    loading,
    selectItem,
    selectionVariants,
    searchValue,
    addToHistory,
    selectionHistory,
    selectNextIndex,
    selectPrevIndex
  }
}
