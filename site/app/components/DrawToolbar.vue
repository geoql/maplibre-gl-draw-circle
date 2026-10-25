<script setup lang="ts">
  import type { DrawModeId } from '~/data/modes';
  import { DRAW_MODES, RADIUS_PRESETS_KM } from '~/data/modes';

  const mode = defineModel<DrawModeId>('mode', { required: true });
  const radiusKm = defineModel<number>('radiusKm', { required: true });
  defineProps<{ count: number }>();
  const emit = defineEmits<{ clear: [] }>();

  const hint = computed(
    () => DRAW_MODES.find((m) => m.id === mode.value)?.hint ?? '',
  );
</script>

<template>
  <div class="grid gap-4">
    <fieldset>
      <legend class="mb-2 font-mono text-[0.7rem] tracking-wider text-ink-3">
        MODE
      </legend>
      <div class="grid grid-cols-3 border border-rule">
        <button
          v-for="(m, i) in DRAW_MODES"
          :key="m.id"
          type="button"
          :aria-pressed="mode === m.id"
          class="h-11 text-sm font-medium transition-colors"
          :class="[
            i > 0 ? 'border-l border-rule' : '',
            mode === m.id
              ? 'bg-ink text-paper'
              : 'text-ink-2 hover:bg-paper-2 hover:text-ink',
          ]"
          @click="mode = m.id"
        >
          {{ m.label }}
        </button>
      </div>
      <p class="mt-2 min-h-10 text-sm text-ink-2">{{ hint }}</p>
    </fieldset>

    <fieldset>
      <legend class="mb-2 font-mono text-[0.7rem] tracking-wider text-ink-3">
        CLICK RADIUS
      </legend>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="preset in RADIUS_PRESETS_KM"
          :key="preset"
          type="button"
          :aria-pressed="radiusKm === preset"
          class="h-9 min-w-14 border px-3 font-mono text-xs transition-colors"
          :class="
            radiusKm === preset
              ? 'border-accent text-accent-ink'
              : 'border-rule text-ink-2 hover:border-ink-3 hover:text-ink'
          "
          @click="
            radiusKm = preset;
            mode = 'draw_circle';
          "
        >
          {{ preset }} km
        </button>
        <button
          type="button"
          class="ml-auto h-9 px-2 font-mono text-xs text-ink-3 transition-colors hover:text-ink disabled:opacity-40"
          :disabled="count === 0"
          @click="emit('clear')"
        >
          clear all
        </button>
      </div>
    </fieldset>
  </div>
</template>
