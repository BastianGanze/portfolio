<script setup lang="ts">
const { t } = useLocalizationStore()
</script>

<template>
  <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
    <div class="card-body">
      <div role="alert" class="alert alert-info">
        <Icon size="2em" name="line-md:construction" />
        <span>{{ t('underConstruction') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
