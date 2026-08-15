/**
 * Mode-state shapes for the custom modes. The stock DrawCustomMode defaults
 * CustomModeState to `any`; these concrete types give the mode callbacks
 * real state typing. Features here are the circle features this library
 * creates/edits — they always carry mutable, non-null properties (mapbox's
 * DrawFeatureBase declares properties Readonly + nullable, which does not
 * match how modes operate on them).
 */
import type { Feature, GeoJsonTypes, Position } from 'geojson';

/** Properties this library reads/writes on circle features. */
export type CircleFeatureProperties = {
  isCircle?: boolean;
  center?: number[];
  radiusInKm?: number;
  user_isCircle?: boolean;
  active?: string;
  [key: string]: unknown;
};

/** A circle feature with the mutable property surface the modes use. */
export interface CircleDrawFeature {
  id: string;
  type: GeoJsonTypes;
  properties: CircleFeatureProperties;
  incomingCoords(coords: Position[][]): void;
  getCoordinate(path: string): Position;
  updateCoordinate(path: string | number, lng: number, lat: number): void;
  addCoordinate(path: string, lng: number, lat: number): void;
  removeCoordinate(path: string): void;
  changed(): void;
  isValid(): boolean;
  setProperty(property: string, value: unknown): void;
  toGeoJSON(): Feature;
}

/** GeoJSON feature carrying this library's circle properties. */
export type CircleGeoJSONFeature = Feature & {
  properties: CircleFeatureProperties;
};

/** State for CircleMode (extends draw_polygon). */
export interface CircleModeState {
  initialRadiusInKm: number;
  polygon: CircleDrawFeature & { id: string };
  currentVertexPosition: number;
}

/** State for DragCircleMode (extends draw_polygon). */
export interface DragCircleModeState {
  polygon: CircleDrawFeature & { id: string };
  currentVertexPosition: number;
}

/** State for DirectMode (extends direct_select). */
export interface DirectModeState {
  feature: CircleDrawFeature;
  featureId: string;
  selectedCoordPaths: string[];
  dragMoveLocation: { lng: number; lat: number };
  dragMoving?: boolean;
}

/** State for SimpleSelectMode (extends simple_select). */
export interface SimpleSelectModeState {
  dragMoveLocation: { lng: number; lat: number };
  dragMoving?: boolean;
}
