import { isAutomationBrowser } from '~/utils/automation-browser';

export default defineNuxtPlugin(() => {
  const gtagId = useRuntimeConfig().public.gtagId;
  if (!gtagId || isAutomationBrowser()) return;

  const { proxy } = useScriptGoogleAnalytics({ id: gtagId });

  const gtag = (...args: unknown[]) => {
    (proxy.gtag as (...a: unknown[]) => void)(...args);
  };

  return {
    provide: {
      ga: { gtag },
    },
  };
});
