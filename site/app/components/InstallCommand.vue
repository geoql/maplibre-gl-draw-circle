<script setup lang="ts">
  import type { PackageManager } from '~/data/site';
  import { INSTALL_COMMANDS } from '~/data/site';

  const MANAGERS = Object.keys(INSTALL_COMMANDS) as PackageManager[];

  const manager = ref<PackageManager>('pnpm');
  const copied = ref(false);
  const { track } = useAnalytics();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const command = computed(() => INSTALL_COMMANDS[manager.value]);

  async function copy() {
    await navigator.clipboard.writeText(command.value);
    copied.value = true;
    track('install_copied', { manager: manager.value });
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1800);
  }

  onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="border border-rule bg-paper-2">
    <div
      class="flex items-center justify-between border-b border-rule pr-1 pl-3"
    >
      <div role="tablist" aria-label="Package manager" class="flex">
        <button
          v-for="m in MANAGERS"
          :key="m"
          type="button"
          role="tab"
          :aria-selected="manager === m"
          class="h-9 px-2 font-mono text-xs transition-colors"
          :class="
            manager === m
              ? 'text-ink underline decoration-accent decoration-2 underline-offset-[10px]'
              : 'text-ink-3 hover:text-ink'
          "
          @click="manager = m"
        >
          {{ m }}
        </button>
      </div>
      <button
        type="button"
        class="h-8 px-3 font-mono text-xs text-ink-2 transition-colors hover:text-accent-ink"
        :aria-label="copied ? 'Copied' : 'Copy install command'"
        @click="copy"
      >
        {{ copied ? 'copied' : 'copy' }}
      </button>
    </div>
    <pre
      class="px-3 py-3 font-mono text-[0.8rem] leading-relaxed break-all whitespace-pre-wrap text-ink"
    ><code><span class="text-ink-3 select-none">$ </span>{{ command }}</code></pre>
    <span class="sr-only" aria-live="polite">{{
      copied ? 'Install command copied' : ''
    }}</span>
  </div>
</template>
