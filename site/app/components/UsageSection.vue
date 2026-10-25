<script setup lang="ts">
  import type { CircleSummary } from '~/utils/circles';
  import { USAGE_SNIPPET } from '~/data/usage';

  const props = defineProps<{ focus: CircleSummary | null }>();

  const feature = computed(() =>
    JSON.stringify(
      {
        type: 'Feature',
        properties: props.focus
          ? {
              isCircle: true,
              center: props.focus.center.map((n) => Number(n.toFixed(6))),
              radiusInKm: Number(props.focus.radiusKm.toFixed(4)),
            }
          : {},
        geometry: { type: 'Polygon', coordinates: ['… 64 vertices'] },
      },
      null,
      2,
    ),
  );
</script>

<template>
  <section
    aria-labelledby="usage-title"
    class="mx-auto grid max-w-[90rem] gap-10 px-4 py-14 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-20"
  >
    <div class="lg:col-span-4">
      <h2
        id="usage-title"
        class="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Four modes, one control.
      </h2>
      <p class="mt-4 max-w-md text-base leading-relaxed text-ink-2">
        Register the modes on mapbox-gl-draw and add it to a MapLibre map.
        Circles stay true geodesic polygons, and every feature carries its
        <code class="font-mono text-sm text-ink">center</code> and
        <code class="font-mono text-sm text-ink">radiusInKm</code>, so you never
        recompute them from 64 vertices.
      </p>
    </div>
    <div class="grid min-w-0 gap-6 lg:col-span-8 xl:grid-cols-2">
      <figure class="min-w-0">
        <figcaption
          class="mb-2 font-mono text-[0.7rem] tracking-wider text-ink-3"
        >
          MAP.TS
        </figcaption>
        <pre
          class="overflow-x-auto border border-rule bg-paper-2 p-4 font-mono text-[0.78rem] leading-relaxed"
        ><code>{{ USAGE_SNIPPET }}</code></pre>
      </figure>
      <figure class="min-w-0">
        <figcaption
          class="mb-2 font-mono text-[0.7rem] tracking-wider text-ink-3"
        >
          SELECTED FEATURE · LIVE
        </figcaption>
        <pre
          class="overflow-x-auto border border-rule bg-paper-2 p-4 font-mono text-[0.78rem] leading-relaxed"
        ><code>{{ feature }}</code></pre>
      </figure>
    </div>
  </section>
</template>
