<script setup lang="ts">
const phoneVisible = '+&#052;&#057;&#049;&#053;&#049;/&#050;&#048;&#055;&#053;&#051;&#050;&#054;&#049;'
const phoneTechnical = '+&#052;&#057;&#049;&#053;&#049;&#050;&#048;&#055;&#053;&#051;&#050;&#054;&#049;'
const email = '&#105;&#110;&#102;&#111;&#064;&#098;&#097;&#115;&#116;&#105;&#097;&#110;&#103;&#097;&#110;&#122;&#101;&#046;&#109;&#101;'
const { t } = useLocalizationStore()
</script>

<template>
  <div class="card card-border border-base-300 bg-base-100 card-xl w-full">
    <div class="card-body gap-8">
      <p class="contact-info" v-html="t('impressumContact', { email, phoneVisible, phoneTechnical })" />
    </div>
  </div>
</template>

<style scoped>
.contact-info {
  white-space: pre-line;
}
</style>
