let defaults = {
  menuRadius: 256, // the radius of the circular menu in pixels
  selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
  commands: [ // an array of commands to list in the menu or a function that returns the array
    /*
    { // example command
      fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
      content: 'a command name' // html/text content to be displayed in the menu
      contentStyle: {}, // css key:value pairs to set the command's css in js if you want
      select: function(ele){ // a function to execute when the command is selected
        console.log( ele.id() ) // `ele` holds the reference to the active element
      },
      enabled: true // whether the command is selectable
    }
    */
  ], // function( ele ){ return [ /*...*/ ] }, // example function for commands
  fillColor: 'rgba(17,20,24,0.7)', // the background colour of the menu
  activeFillColor: 'rgba(95, 107, 124, 0.7)', // the colour used to indicate the selected command
  activePadding: 0, // additional size in pixels for the active command
  indicatorSize: 0, // the size in pixels of the pointer to the active command
  separatorWidth: 1, // the empty spacing in pixels between successive commands
  separatorHoveredCommandsWidth: 4.3,
  separatorColor: '#000',
  spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
  minSpotlightRadius: 102.5, // the minimum radius in pixels of the spotlight
  maxSpotlightRadius: 102.5, // the maximum radius in pixels of the spotlight
  openMenuEvents: 'cxttap', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
  itemColor: 'white', // the colour of text in the command's content
  itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
  zIndex: 9999, // the z-index of the ui div and canves
  atMouse: false, // draw menu at mouse position
  autoOpen: true,
  onClose: () => {},
};

module.exports = defaults;
