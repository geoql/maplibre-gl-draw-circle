const ignorePatterns = [
  /(?:^|\/)jsr\.json$/,
  /(?:^|\/)CHANGELOG\.md$/,
  /(?:^|\/)pnpm-lock\.yaml$/,
  /(?:^|\/)dist\//,
  // The demo site has its own oxlint/oxfmt config (rules below).
  /(?:^|\/)site\//,
];

const isSite = (file) => /(?:^|\/)site\//.test(file);

const isIgnored = (file) =>
  ignorePatterns.some((pattern) => pattern.test(file));

export default {
  /** @param {string[]} files */
  'site/**/*.{js,ts,vue,json,jsonc,md,css}': (files) => {
    const site = files.filter(isSite);
    if (site.length === 0) return [];
    const code = site.filter((f) => /\.(?:js|ts|vue)$/.test(f));
    return [
      ...(code.length > 0
        ? [`pnpm --filter site exec oxlint --fix ${code.join(' ')}`]
        : []),
      `pnpm --filter site exec oxfmt --write ${site.join(' ')}`,
    ];
  },
  /** @param {string[]} files */
  '*.{js,ts}': (files) => {
    const filtered = files.filter((f) => !isIgnored(f));
    return filtered.length > 0
      ? [
          `vp lint --fix ${filtered.join(' ')}`,
          `vp fmt --write ${filtered.join(' ')}`,
        ]
      : [];
  },
  /** @param {string[]} files */
  '*.{json,jsonc,md,yml,yaml,css}': (files) => {
    const filtered = files.filter((f) => !isIgnored(f));
    return filtered.length > 0 ? [`vp fmt --write ${filtered.join(' ')}`] : [];
  },
};
