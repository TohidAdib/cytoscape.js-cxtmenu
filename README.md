cytoscape-cxtmenu
================================================================================

[![DOI](https://zenodo.org/badge/16010906.svg)](https://zenodo.org/badge/latestdoi/16010906)

![Preview](https://raw.githubusercontent.com/cytoscape/cytoscape.js-cxtmenu/master/preview.png)

## Description

A circular, swipeable context menu extension for Cytoscape.js 
- Demo with default options: [demo](https://cytoscape.github.io/cytoscape.js-cxtmenu)
- Demo with adaptative spotlight radius features: [demo](https://cytoscape.github.io/cytoscape.js-cxtmenu/demo-adaptative.html) 
- Demo with `outsideMenuCancel`: [demo](https://cytoscape.github.io/cytoscape.js-cxtmenu/demo-cancel-outside.html) 

This extension creates a widget that lets the user operate circular context menus on nodes in Cytoscape.js.  The user swipes along the circular menu to select a menu item and perform a command on either a node, a edge, or the graph background.

## Dependencies

 * Cytoscape.js ^3.2.0


```bash
npm install @tohid_adib/cytoscape-cxtmenu --save
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let cxtmenu = require('cytoscape-cxtmenu');

cytoscape.use( cxtmenu ); // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-cxtmenu'], function( cytoscape, cxtmenu ){
  cxtmenu( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## CSS

You can style the font of the command text with the `cxtmenu-content` class, and you can style disabled entries with the `cxtmenu-disabled` class.


## API

You initialise the plugin on the same HTML DOM element container used for Cytoscape.js:

```js
import cxtmenu from '@tohid_adib/cytoscape-cxtmenu'
cytoscape.use(cxtmenu)
```


## Build targets

* `npm run test` : Run Mocha tests in `./test`
* `npm run build` : Build `./src/**` into `cytoscape-cxtmenu.js`
* `npm run watch` : Automatically build on changes with live reloading (N.b. you must already have an HTTP server running)
* `npm run dev` : Automatically build on changes with live reloading with webpack dev server
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build:release`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-cxtmenu https://github.com/cytoscape/cytoscape.js-cxtmenu.git`
1. [Make a new release](https://github.com/cytoscape/cytoscape.js-cxtmenu/releases/new) for Zenodo.
