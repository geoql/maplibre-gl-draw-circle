import createVertex from '../../vendor/mapbox-gl-draw/src/lib/create_vertex.js';
import type { Polygon } from 'geojson';

type GeoJSON = {
  type: 'Feature';
  properties: {
    meta?: 'vertex';
    parent?: string;
    coord_path?: string;
    active?: boolean;
    user_isCircle?: boolean;
    id?: string;
    [key: string]: unknown;
  };
  geometry: Polygon;
};

/**
 * Create supplementary points for circle
 *
 * @param {GeoJSON} g - GeoJSON object
 * @returns {GeoJSON[] | null} GeoJSON object
 */
const createSupplementaryPointsForCircle = (g: GeoJSON): GeoJSON[] | null => {
  const { properties, geometry } = g;

  if (!properties.user_isCircle) return null;

  const supplementaryPoints: GeoJSON[] = [];
  const vertices = geometry.coordinates[0].slice(0, -1);
  for (let i = 0; i < vertices.length; i += Math.round(vertices.length / 4)) {
    const vertex = vertices[i];
    if (vertex) {
      supplementaryPoints.push(
        createVertex(String(properties.id), vertex, `0.${i}`, false),
      );
    }
  }
  return supplementaryPoints;
};

export default createSupplementaryPointsForCircle;
export { createSupplementaryPointsForCircle };
