# maplibre-gl-draw-circle 🌎

[![CI](https://img.shields.io/github/actions/workflow/status/vinayakkulkarni/maplibre-gl-draw-circle/ci.yml?logo=github-actions&branch=main)](https://github.com/vinayakkulkarni/maplibre-gl-draw-circle/actions/workflows/ci.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/vinayakkulkarni/maplibre-gl-draw-circle/codeql.yml?logo=github-actions&branch=main)](https://github.com/vinayakkulkarni/maplibre-gl-draw-circle/actions/workflows/codeql.yml)
[![Ship.js Trigger](https://img.shields.io/github/actions/workflow/status/vinayakkulkarni/maplibre-gl-draw-circle/shipjs-trigger.yml?label=⛴%20Ship.js%20trigger)](https://github.com/vinayakkulkarni/maplibre-gl-draw-circle/actions/workflows/shipjs-trigger.yml)
[![npm](https://img.shields.io/npm/dm/maplibre-gl-draw-circle?logo=npm)](http://npm-stat.com/charts.html?package=maplibre-gl-draw-circle)
[![npm](https://img.shields.io/npm/v/maplibre-gl-draw-circle/latest?logo=npm)](https://www.npmjs.com/package/maplibre-gl-draw-circle)
[![npm bundle size (version)](https://img.shields.io/bundlephobia/min/maplibre-gl-draw-circle/latest?label=@latest%20size&logo=vue.js)](https://bundlephobia.com/package/maplibre-gl-draw-circle@latest)
[![npm type definitions](https://img.shields.io/npm/types/maplibre-gl-draw-circle)](https://github.com/vinayakkulkarni/maplibre-gl-draw-circle/blob/master/package.json)
[![DeepScan grade](https://deepscan.io/api/teams/9055/projects/18331/branches/446995/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=9055&pid=18331&bid=446995)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/vinayakkulkarni/maplibre-gl-draw-circle)](https://snyk.io/test/github/vinayakkulkarni/maplibre-gl-draw-circle)
[![GitHub contributors](https://img.shields.io/github/contributors/vinayakkulkarni/maplibre-gl-draw-circle?logo=github)](https://github.com/vinayakkulkarni/maplibre-gl-draw-circle/graphs/contributors)

[![eslint](https://img.shields.io/npm/dependency-version/maplibre-gl-draw-circle/dev/eslint?logo=eslint)](https://eslint.org/)
[![prettier](https://img.shields.io/npm/dependency-version/maplibre-gl-draw-circle/dev/prettier?logo=prettier)](https://prettier.io/)
[![vite](https://img.shields.io/npm/dependency-version/maplibre-gl-draw-circle/dev/vite?logo=vite)](https://vitejs.dev/)
[![typescript](https://img.shields.io/npm/dependency-version/maplibre-gl-draw-circle/dev/typescript?logo=TypeScript)](https://www.typescriptlang.org/)

Adds support for drawing and editing a circle feature using [mapbox-gl-draw](https://github.com/mapbox/mapbox-gl-draw) library.

## Demo

##### Circle mode
![Circle Mode Demo](demo/CircleModeDemo.gif)

##### Drag Circle mode
![Drag Circle Mode Demo](demo/DragCircleDemo.gif)


## Usage

### Installation

```
npm install maplibre-gl-draw-circle
```

```
import {
    CircleMode,
    DragCircleMode,
    DirectMode,
    SimpleSelectMode
} from 'maplibre-gl-draw-circle';


// userProperties has to be enabled
const draw = new MapboxDraw({
  defaultMode: "draw_circle",
  userProperties: true,
  modes: {
    ...MapboxDraw.modes,
    draw_circle  : CircleMode,
    drag_circle  : DragCircleMode,
    direct_select: DirectMode,
    simple_select: SimpleSelectMode
  }
});

// Add this draw object to the map when map loads
map.addControl(draw);
```

The default radius units are in **kilometers** and initial radius is **2km**.

```
// Provide the default radius as an option to CircleMode
draw.changeMode('draw_circle', { initialRadiusInKm: 0.5 });
```

It fires the same events as the mapbox-gl-draw library. For more information follow this [link](https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md#events).

Sample feature object returned in `draw.create` event
```
{
  "id": "e184898e58feaa5c2c56f20a178ffe2c",
  "type": "Feature",
  "properties": {
    "isCircle": true,
    "center": [
      -0.2472604947478203,
      51.53200220026099
    ],
    "radiusInKm": 2
  },
  "geometry": {
    "coordinates": [], // populated with 64 vertices used to render the circle
    "type": "Polygon"
  }
}
```

## Changelog

### v1.1.0

* Added a new DragCircle mode.
* Fixed issue (#5), where the polygon mode was not working when used along with CircleMode.