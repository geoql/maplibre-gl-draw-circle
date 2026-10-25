import { describe, expect, it, vi } from 'vitest';
import { createAnalytics } from '../../app/composables/use-analytics';

describe('createAnalytics', () => {
  it('sends one track() call to GA4, Plausible and OpenPanel', () => {
    const gtag = vi.fn();
    const plausible = vi.fn();
    const openpanel = vi.fn();
    const { track } = createAnalytics({
      ga: { gtag },
      plausible: { plausible },
      openpanel: { track: openpanel },
    });

    const props = { mode: 'drag_circle', radius_km: 1.25 } as const;
    track('circle_drawn', props);

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'circle_drawn', props);
    expect(plausible).toHaveBeenCalledOnce();
    expect(plausible).toHaveBeenCalledWith('circle_drawn', { props });
    expect(openpanel).toHaveBeenCalledOnce();
    expect(openpanel).toHaveBeenCalledWith('circle_drawn', props);
  });

  it('skips trackers that did not boot (GA4 has no property yet)', () => {
    const plausible = vi.fn();
    const openpanel = vi.fn();
    const { track } = createAnalytics({
      plausible: { plausible },
      openpanel: { track: openpanel },
    });

    expect(() => track('install_copied', { manager: 'pnpm' })).not.toThrow();
    expect(plausible).toHaveBeenCalledWith('install_copied', {
      props: { manager: 'pnpm' },
    });
    expect(openpanel).toHaveBeenCalledWith('install_copied', {
      manager: 'pnpm',
    });
  });
});
