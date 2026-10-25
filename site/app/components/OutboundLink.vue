<script setup lang="ts">
  import type { AnalyticsEventMap } from '~/types/analytics';

  const props = defineProps<{
    href: string;
    placement: AnalyticsEventMap['outbound_click']['placement'];
  }>();

  const { track } = useAnalytics();

  function onClick() {
    track('outbound_click', { target: props.href, placement: props.placement });
  }
</script>

<template>
  <a :href="props.href" rel="noopener" @click="onClick">
    <slot />
  </a>
</template>
