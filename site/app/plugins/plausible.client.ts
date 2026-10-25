import type { PlausibleFn } from '~/types/analytics';
import { isAutomationBrowser } from '~/utils/automation-browser';

export default defineNuxtPlugin(() => {
  const { plausibleScriptId, plausibleApiHost } = useRuntimeConfig().public;
  if (!plausibleScriptId || !plausibleApiHost || isAutomationBrowser()) return;

  // The pa-*.js tracker only boots if `window.plausible.o` is already set
  // when it loads. Plausible's official snippet: define the queue stub and
  // call init() BEFORE the async script arrives.
  const w = window as unknown as { plausible?: PlausibleFn };
  const stub: PlausibleFn =
    w.plausible ??
    ((...args: unknown[]) => {
      (stub.q ||= []).push(args);
    });
  stub.init ||= (options?: Record<string, unknown>) => {
    stub.o = options || {};
  };
  w.plausible = stub;
  stub.init({
    autoCapturePageviews: true,
    captureOnLocalhost: import.meta.dev,
  });

  useHead({
    script: [
      {
        src: `${plausibleApiHost}/js/pa-${plausibleScriptId}.js`,
        async: true,
      },
    ],
  });

  const plausible = (...args: unknown[]) => {
    w.plausible?.(...args);
  };

  return {
    provide: {
      plausible: { plausible },
    },
  };
});
