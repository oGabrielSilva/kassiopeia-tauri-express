import { type IStack, Stack } from '@app/models/Stack'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

type TMenuOptions = 'DASHBOARD' | 'ALL_POSTS' | 'WRITE' | 'MY_POSTS' | 'STACKS'

export const useHome = defineStore('Home', () => {
  const isNavbarHiddenRef = ref(true)
  const sideMenuOptionSelectedRef = ref<TMenuOptions>('ALL_POSTS')

  const isNavbarHidden = computed(() => isNavbarHiddenRef.value)
  const sideMenuOptionSelected = computed(() => sideMenuOptionSelectedRef.value)

  const stacksReactive = reactive({
    stacks: [] as Stack[],
    hadFirstFetch: false,
  })
  const stacks = computed(() => ({
    stacks: stacksReactive.stacks,
    hadFirstFetch: stacksReactive.hadFirstFetch,
  }))

  function updateSideMenuOptionSelected(option: TMenuOptions) {
    sideMenuOptionSelectedRef.value = option
  }

  function updateNavbarState() {
    isNavbarHiddenRef.value = !isNavbarHiddenRef.value
  }

  function updateStacks(stacks: IStack[]) {
    stacksReactive.stacks = stacks.map((stack) => Stack.from(stack))
    stacksReactive.hadFirstFetch = true
  }

  function addStack(stack?: IStack | null) {
    if (!stack) return
    const stacks = [...stacksReactive.stacks, Stack.from(stack)]
    stacksReactive.stacks = stacks
  }

  return {
    isNavbarHidden,
    updateNavbarState,
    updateSideMenuOptionSelected,
    sideMenuOptionSelected,
    stacks,
    updateStacks,
    addStack,
  }
})
