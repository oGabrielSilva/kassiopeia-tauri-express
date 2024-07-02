import { User } from '@app/auth/models/User'
import { Stack, type IStack } from '@app/models/Stack'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { forbidden } from '@app/utilities/forbidden'
import { isForbidden } from '@app/utilities/isForbidden'
import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

type TMenuOptions = 'DASHBOARD' | 'ALL_POSTS' | 'WRITE' | 'MY_POSTS' | 'STACKS'

export const useHome = defineStore('Home', () => {
  //ref
  const isNavbarHiddenRef = ref(true)
  const sideMenuOptionSelectedRef = ref<TMenuOptions>('ALL_POSTS')

  //reactive
  const stacksReactive = reactive({
    stacks: [] as Stack[],
    hadFirstFetch: false,
  })

  const editorsReactive = reactive({
    editors: [] as User[],
    loaded: false,
  })

  //computed
  const editors = computed(() => ({
    arr: editorsReactive.editors ? editorsReactive.editors : [],
    hadFirstFetch: editorsReactive.loaded,
  }))
  const isNavbarHidden = computed(() => isNavbarHiddenRef.value)
  const sideMenuOptionSelected = computed(() => sideMenuOptionSelectedRef.value)
  const stacks = computed(() => ({
    stacks: stacksReactive.stacks,
    hadFirstFetch: stacksReactive.hadFirstFetch,
  }))

  //actions
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

  function loadEditors() {
    return new Promise<void>((resolve) => {
      JsonAPI.request
        .GET('/user?role=editor')
        .then((result) => {
          if (isForbidden(result)) return forbidden()

          if (result.error) {
            requireKassiopeiaToaster().then((toaster) =>
              toaster.danger(result.error?.message),
            )
            return
          }

          if (Array.isArray(result.body)) {
            editorsReactive.editors = (result.body as Array<unknown>).map(
              (user) => User.from(user),
            )
            editorsReactive.loaded = true
          }
        })
        .catch(console.log)
        .finally(() => resolve())
    })
  }

  return {
    isNavbarHidden,
    updateNavbarState,
    updateSideMenuOptionSelected,
    sideMenuOptionSelected,
    stacks,
    updateStacks,
    addStack,
    loadEditors,
    editors,
  }
})
