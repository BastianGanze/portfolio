<script setup lang="ts">
import { useGameStore } from '~/stores/gameStore'

const { t } = useLocalizationStore()
const { connected } = useGameStore()
</script>

<template>
  <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
    <div class="card-body">
      <div role="alert" class="alert alert-info">
        <Icon size="2em" name="line-md:construction" />
        <span>{{ t('underConstruction') }}</span>
        <span class="flex-1">{{ connected }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
