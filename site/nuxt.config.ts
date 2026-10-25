import tailwindcss from '@tailwindcss/vite';

// Cloudflare compatibility date — keep the two copies below in sync.
const COMPATIBILITY_DATE = '2026-10-25';

const HOST = 'maplibre-gl-draw-circle.geoql.in';

export default defineNuxtConfig({
  compatibilityDate: COMPATIBILITY_DATE,

  modules: ['@nuxtjs/color-mode', '@nuxt/scripts', '@openpanel/nuxt'],

  devtools: { enabled: false },

  css: ['maplibre-gl/dist/maplibre-gl.css', '~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Cookie-backed so the server renders the right class on <html>; the
  // module's inline head script resolves "system" before first paint.
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storage: 'cookie',
    storageKey: 'draw-circle-color-mode',
  },

  // Public IDs ship in the HTML; they are not secrets. GA4 has no property
  // yet: an empty gtagId skips GA4 entirely (see plugins/google-analytics).
  // Override per env with NUXT_PUBLIC_GTAG_ID.
  runtimeConfig: {
    public: {
      siteUrl: `https://${HOST}`,
      gtagId: 'G-S6H5VNST1D',
      plausibleScriptId: 'IAPCSj0Iz6UXWyWnhV2Hw',
      plausibleApiHost: 'https://analytics.geoql.in',
    },
  },

  openpanel: {
    clientId: 'e9c82e86-64a2-4b4a-9f09-ad3bb8b49e2b',
    apiUrl: 'https://events.geoql.in/api',
    trackScreenViews: true,
    trackOutgoingLinks: true,
    trackAttributes: true,
    proxy: false,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'preload',
          href: '/fonts/clash-display-600.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/satoshi-400.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ],
    },
  },

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      nodeCompat: true,
      deployConfig: true,
      // Merged into the generated .output/server/wrangler.json.
      wrangler: {
        name: 'maplibre-gl-draw-circle-demo',
        account_id: 'bd11b1c42ee2759044a1769f80f704dd',
        compatibility_date: COMPATIBILITY_DATE,
        workers_dev: true,
        preview_urls: false,
        routes: [{ pattern: HOST, custom_domain: true }],
        observability: { enabled: true },
      },
    },
  },

  typescript: {
    strict: true,
  },
});
