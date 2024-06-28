<template>
  <div>
    <UIViewHomeHeader
      :title="strings.stacksTitle"
      @click:add="isModalCreateStackVisible = true"
    />

    <UIStackForm
      v-if="isModalCreateStackVisible"
      @hide="isModalCreateStackVisible = false"
    />

    <div
      v-if="stackFetchPending"
      class="is-flex is-align-items-center g-1 is-justify-content-right py-5"
    >
      <span>{{ strings.await }}</span>
      <UIRoundedProgressBar />
    </div>

    <div v-else>
      <UIStackTable @update-stacks="reloadStacks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@app/stores/useI18n'
import UIViewHomeHeader from '@app/components/home/UIViewHomeHeader.vue'
import { onMounted, ref } from 'vue'

import { requireKassiopeiaToaster } from '@lib/kassiopeia-tools'
import { JsonAPI } from '@app/utilities/JsonAPI'
import { isForbidden } from '@app/utilities/isForbidden'
import { forbidden } from '@app/utilities/forbidden'
import { useHome } from '@app/stores/useHome'
import type { IStack } from '@app/models/Stack'
import UIRoundedProgressBar from '@app/components/shared/UIRoundedProgressBar.vue'
import { type ToasterKassiopeiaTool } from 'kassiopeia-tools'
import UIStackForm from '@app/components/home/views/stack/UIStackForm.vue'
import UIStackTable from '@app/components/home/views/stack/UIStackTable.vue'

const stackFetchPending = ref(true)
const isModalCreateStackVisible = ref(false)

const home = useHome()
const strings = useI18n()

let toaster: ToasterKassiopeiaTool

async function reloadStacks() {
  stackFetchPending.value = true

  try {
    const result = await JsonAPI.request.GET<IStack[]>('/stack?size=25')
    if (isForbidden(result)) return forbidden()

    if (result.error) return toaster.danger(result.error.message)

    home.updateStacks(result?.body ?? [])
    stackFetchPending.value = false
  } catch (error) {
    console.log(error)
    toaster.danger()
  }
}

onMounted(async () => {
  toaster = await requireKassiopeiaToaster()

  if (!home.stacks.hadFirstFetch) reloadStacks()
  else stackFetchPending.value = false
})
</script>

<style scoped></style>
