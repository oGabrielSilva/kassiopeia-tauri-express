<template>
  <UITopAppBarSafeArea style="flex: 1">
    <UISideHomeMenu />
    <UIHome />
  </UITopAppBarSafeArea>
</template>

<script setup lang="ts">
import UISideHomeMenu from '@app/components/home/menu/UISideHomeMenu.vue'
import UITopAppBarSafeArea from '@app/components/shared/UITopAppBarSafeArea.vue'
import UIHome from '@app/components/home/UIHome.vue'
import { useLayout } from '@app/composables/useLayout'

useLayout('DEFAULT')
</script>

<style scoped></style>
