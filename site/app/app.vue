<script setup lang="ts">
  import type { DrawModeId } from '~/data/modes';
  import type { CircleSummary } from '~/utils/circles';
  import { roundKm } from '~/data/modes';
  import { SITE } from '~/data/site';

  useSeoMeta({
    title: SITE.title,
    description: SITE.description,
    ogType: 'website',
    ogSiteName: SITE.name,
    ogUrl: `${SITE.url}/`,
    ogTitle: SITE.title,
    ogDescription: SITE.description,
    twitterCard: 'summary',
    twitterTitle: SITE.title,
    twitterDescription: SITE.description,
  });

  useHead({
    link: [{ rel: 'canonical', href: `${SITE.url}/` }],
  });

  const { track } = useAnalytics();

  const mode = ref<DrawModeId>('simple_select');
  const radiusKm = ref(2);
  const circles = ref<CircleSummary[]>([]);
  const focus = ref<CircleSummary | null>(null);
  const drawMap = useTemplateRef<{ clear: () => void }>('drawMap');

  function onCircles(next: CircleSummary[], nextFocus: CircleSummary | null) {
    circles.value = next;
    focus.value = nextFocus;
  }

  function onModeChange(next: DrawModeId) {
    mode.value = next;
  }

  function onClear() {
    track('circles_cleared', { count: circles.value.length });
    drawMap.value?.clear();
  }

  watch(mode, (next, previous) => {
    if (next !== previous) track('draw_mode_changed', { mode: next });
  });
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <SiteHeader />
    <main class="flex-1">
      <section
        aria-labelledby="title"
        class="mx-auto grid max-w-[90rem] gap-6 px-4 pt-8 pb-10 sm:px-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-x-12 lg:px-12 lg:pt-10"
      >
        <div class="min-w-0 lg:col-start-1 lg:row-start-1">
          <p class="font-mono text-[0.7rem] tracking-wider text-ink-3">
            MAPLIBRE GL · MAPBOX-GL-DRAW MODES
          </p>
          <h1
            id="title"
            class="mt-3 font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] font-semibold tracking-tight"
          >
            Circles you can
            <span class="font-serif font-normal text-accent italic">drag</span>,
            move and resize.
          </h1>
          <p class="mt-4 max-w-md text-base leading-relaxed text-ink-2">
            <span class="font-mono text-sm text-ink"
              >@geoql/maplibre-gl-draw-circle</span
            >
            adds circle modes to mapbox-gl-draw. Draw one below.
          </p>
          <div class="mt-5">
            <InstallCommand />
          </div>
        </div>

        <div
          class="h-[62svh] min-h-80 min-w-0 overflow-hidden border border-rule lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[calc(100dvh-8.5rem)] lg:min-h-[34rem]"
        >
          <ClientOnly>
            <DrawMap
              ref="drawMap"
              :mode="mode"
              :radius-km="radiusKm"
              @circles="onCircles"
              @mode-change="onModeChange"
              @created="
                (c) =>
                  track('circle_drawn', {
                    mode,
                    radius_km: roundKm(c.radiusKm),
                  })
              "
              @resized="
                (c) =>
                  track('circle_resized', { radius_km: roundKm(c.radiusKm) })
              "
            />
            <template #fallback>
              <div class="size-full bg-paper-2" />
            </template>
          </ClientOnly>
        </div>

        <div class="grid min-w-0 gap-6 lg:col-start-1 lg:row-start-2">
          <DrawToolbar
            v-model:mode="mode"
            v-model:radius-km="radiusKm"
            :count="circles.length"
            @clear="onClear"
          />
          <RadiusReadout :focus="focus" :count="circles.length" />
        </div>
      </section>

      <div class="border-t border-rule">
        <UsageSection :focus="focus" />
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
