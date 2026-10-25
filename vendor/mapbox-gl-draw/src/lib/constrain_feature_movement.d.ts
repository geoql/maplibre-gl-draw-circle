/** Type companion for the vendored constrain_feature_movement.js. */
import type { Feature } from 'geojson';

export default function constrainFeatureMovement(
  geojsonFeatures: Feature[],
  delta: { lng: number; lat: number },
): { lng: number; lat: number };
