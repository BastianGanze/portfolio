<script setup lang="ts">
const { t } = useLocalizationStore()
const route = useRoute()
</script>

<template>
  <div>
    <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
      <div class="card-body">
        <div role="alert" class="alert alert-info">
          <Icon size="2em" name="line-md:construction" />
          <span>{{ route.params.id }} - {{ t('underConstruction') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
