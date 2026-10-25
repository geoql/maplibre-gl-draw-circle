<script setup lang="ts">
  import type { Map as MaplibreMap, StyleSpecification } from 'maplibre-gl';
  import type MapboxDraw from '@mapbox/mapbox-gl-draw';
  import type { DrawModeId } from '~/data/modes';
  import type { CircleSummary } from '~/utils/circles';
  import { SITE } from '~/data/site';
  import { summarizeCircles, seedCircle } from '~/utils/circles';
  import { DRAW_STYLES } from '~/utils/draw-theme';

  const props = defineProps<{ mode: DrawModeId; radiusKm: number }>();
  const emit = defineEmits<{
    circles: [circles: CircleSummary[], focus: CircleSummary | null];
    modeChange: [mode: DrawModeId];
    created: [circle: CircleSummary];
    resized: [circle: CircleSummary];
  }>();

  const container = useTemplateRef<HTMLDivElement>('container');
  const colorMode = useColorMode();
  const ready = ref(false);

  let map: MaplibreMap | null = null;
  let draw: MapboxDraw | null = null;
  let frame = 0;

  const styleUrl = computed(() =>
    colorMode.value === 'dark' ? SITE.mapStyleDark : SITE.mapStyle,
  );

  function publish() {
    frame = 0;
    if (!draw) return;
    const circles = summarizeCircles(draw.getAll().features);
    const selected = new Set(draw.getSelectedIds());
    const focus =
      circles.find((c) => selected.has(c.id)) ?? circles.at(-1) ?? null;
    emit('circles', circles, focus);
  }

  function schedulePublish() {
    if (!frame) frame = requestAnimationFrame(publish);
  }

  function applyMode(mode: DrawModeId) {
    if (!draw || draw.getMode() === mode) return;
    if (mode === 'draw_circle') {
      draw.changeMode(mode, { initialRadiusInKm: props.radiusKm });
    } else if (mode === 'drag_circle') {
      draw.changeMode(mode);
    } else {
      draw.changeMode(mode);
    }
  }

  // Keep mapbox-gl-draw's sources and layers across a basemap swap.
  function keepDrawLayers(
    previous: StyleSpecification | undefined,
    next: StyleSpecification,
  ): StyleSpecification {
    if (!previous) return next;
    const isDraw = (id: string) => id.startsWith('mapbox-gl-draw');
    const sources = Object.fromEntries(
      Object.entries(previous.sources).filter(([id]) => isDraw(id)),
    );
    const layers = previous.layers.filter(
      (layer) => 'source' in layer && isDraw(String(layer.source)),
    );
    return {
      ...next,
      sources: { ...next.sources, ...sources },
      layers: [...next.layers, ...layers],
    };
  }

  onMounted(async () => {
    const [
      { Map, NavigationControl, setWorkerUrl },
      { default: workerUrl },
      { default: Draw },
      lib,
    ] = await Promise.all([
      import('maplibre-gl'),
      // MapLibre 6 + a bundler: point it at the emitted worker file once
      // (v5-to-v6 migration guide, "setWorkerUrl() is bundler-only").
      import('maplibre-gl/dist/maplibre-gl-worker.mjs?url'),
      import('@mapbox/mapbox-gl-draw'),
      import('@geoql/maplibre-gl-draw-circle'),
    ]);
    if (!container.value) return;
    setWorkerUrl(workerUrl);

    map = new Map({
      container: container.value,
      style: styleUrl.value,
      center: [72.8777, 19.076],
      zoom: 11.6,
      attributionControl: { compact: true },
    });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

    draw = new Draw({
      displayControlsDefault: false,
      userProperties: true,
      styles: DRAW_STYLES,
      modes: {
        ...Draw.modes,
        draw_circle: lib.CircleMode,
        drag_circle: lib.DragCircleMode,
        direct_select: lib.DirectMode,
        simple_select: lib.SimpleSelectMode,
      },
    });
    map.addControl(draw);

    map.on('draw.create', (event) => {
      const [circle] = summarizeCircles(event.features);
      if (circle) emit('created', circle);
    });
    map.on('draw.update', (event) => {
      if (event.action !== 'change_coordinates') return;
      const [circle] = summarizeCircles(event.features);
      if (circle) emit('resized', circle);
    });
    map.on('draw.modechange', (event) => {
      const mode =
        event.mode === 'direct_select' ? 'simple_select' : event.mode;
      if (
        mode === 'draw_circle' ||
        mode === 'drag_circle' ||
        mode === 'simple_select'
      ) {
        emit('modeChange', mode);
      }
    });
    map.on('draw.render', schedulePublish);
    map.on('draw.delete', schedulePublish);
    map.once('load', () => {
      draw?.add(seedCircle([72.8777, 19.076], 2));
      applyMode(props.mode);
      ready.value = true;
      schedulePublish();
    });
  });

  watch(
    () => props.mode,
    (mode) => applyMode(mode),
  );

  // A new preset radius applies to the next click-drawn circle.
  watch(
    () => props.radiusKm,
    (radiusKm) => {
      if (draw?.getMode() === 'draw_circle') {
        draw.changeMode('draw_circle', { initialRadiusInKm: radiusKm });
      }
    },
  );

  watch(styleUrl, (url) => {
    map?.setStyle(url, { transformStyle: keepDrawLayers });
  });

  function clear() {
    draw?.deleteAll();
    draw?.changeMode('simple_select');
    schedulePublish();
  }

  defineExpose({ clear });

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame);
    map?.remove();
    map = null;
    draw = null;
  });
</script>

<template>
  <div class="relative size-full">
    <div
      ref="container"
      class="size-full"
      role="application"
      aria-label="Map. Draw circles with the toolbar modes."
    />
    <div
      v-if="!ready"
      class="pointer-events-none absolute inset-0 grid place-items-center bg-paper-2 font-mono text-xs text-ink-3"
    >
      Loading map
    </div>
  </div>
</template>
