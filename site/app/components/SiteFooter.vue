<script setup lang="ts">
  import { SITE } from '~/data/site';

  const LINKS = [
    {
      label: 'Source on GitHub',
      href: SITE.github,
      meta: 'geoql/maplibre-gl-draw-circle',
    },
    {
      label: 'npm package',
      href: SITE.npm,
      meta: '@geoql/maplibre-gl-draw-circle',
    },
    { label: 'JSR package', href: SITE.jsr, meta: 'jsr.io' },
  ] as const;
</script>

<template>
  <footer class="border-t border-ink">
    <div
      class="mx-auto grid max-w-[90rem] gap-8 px-4 py-10 sm:px-8 lg:grid-cols-12 lg:px-12"
    >
      <div class="lg:col-span-6">
        <p class="font-display text-2xl font-semibold tracking-tight">
          Geo<span class="font-serif font-normal text-accent italic">QL</span>
        </p>
        <p class="mt-2 text-sm text-ink-2">
          MIT licensed. Basemap © OpenFreeMap, © OpenStreetMap contributors.
        </p>
      </div>
      <ul class="grid gap-3 text-sm lg:col-span-6" role="list">
        <li v-for="link in LINKS" :key="link.href">
          <OutboundLink
            :href="link.href"
            placement="footer"
            class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule pb-2 transition-colors hover:text-accent-ink"
          >
            <span>{{ link.label }}</span>
            <span class="min-w-0 font-mono text-xs break-all text-ink-3">{{
              link.meta
            }}</span>
          </OutboundLink>
        </li>
      </ul>
    </div>
  </footer>
</template>
