<script setup lang="ts">
  import type { CircleSummary } from '~/utils/circles';

  const props = defineProps<{ focus: CircleSummary | null; count: number }>();

  const radius = computed(() =>
    props.focus ? props.focus.radiusKm.toFixed(2) : '0.00',
  );
  const center = computed(() =>
    props.focus
      ? `${props.focus.center[1].toFixed(4)}°, ${props.focus.center[0].toFixed(4)}°`
      : '—',
  );
</script>

<template>
  <section
    aria-label="Radius of the selected circle"
    class="border-t border-rule pt-4"
  >
    <p class="font-mono text-[0.7rem] tracking-wider text-ink-3">
      RADIUS · {{ focus ? 'LIVE' : 'NO CIRCLE' }}
    </p>
    <p
      class="mt-1 flex items-baseline gap-2 font-display leading-none font-semibold tracking-tight tabular-nums"
      aria-live="polite"
    >
      <span class="text-[clamp(3.5rem,9vw,6.5rem)]">{{ radius }}</span>
      <span class="font-serif text-3xl font-normal text-accent italic">km</span>
    </p>
    <dl class="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs">
      <dt class="text-ink-3">center</dt>
      <dd class="text-right text-ink-2 tabular-nums">{{ center }}</dd>
      <dt class="text-ink-3">circles</dt>
      <dd class="text-right text-ink-2 tabular-nums">{{ count }}</dd>
    </dl>
  </section>
</template>
