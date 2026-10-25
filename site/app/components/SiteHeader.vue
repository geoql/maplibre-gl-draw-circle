<script setup lang="ts">
  import { SITE } from '~/data/site';
</script>

<template>
  <header class="border-b border-rule bg-paper">
    <div
      class="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12"
    >
      <OutboundLink
        :href="SITE.geoql"
        placement="header"
        class="shrink-0 font-display text-base font-semibold tracking-tight"
        aria-label="GeoQL home"
      >
        Geo<span class="font-serif font-normal text-accent italic">QL</span>
      </OutboundLink>

      <nav aria-label="Project links" class="min-w-0">
        <ul class="flex items-center gap-1 font-mono text-xs text-ink-2">
          <li>
            <OutboundLink
              :href="SITE.github"
              placement="header"
              class="inline-flex h-9 items-center px-2 transition-colors hover:text-ink sm:px-3"
            >
              GitHub
            </OutboundLink>
          </li>
          <li>
            <OutboundLink
              :href="SITE.npm"
              placement="header"
              class="inline-flex h-9 items-center px-2 transition-colors hover:text-ink sm:px-3"
            >
              npm
            </OutboundLink>
          </li>
          <li class="ml-1">
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
