

// Get the canvas element from the HTML document
var canvas = document.getElementById( 'canvas' );
// Get the canvas context to draw with
var ctx = canvas.getContext( '2d' );
// Get the canvas width and height for scaling
var width  = canvas.width,
    height = canvas.height;

// Name some basic colors for easy styling
var red = "#F00", green = "#0F0", blue = "#00F",
    cyan = "#0FF", magenta = "#F0F", yellow = "#FF0",
    orange = "#F80", lavender = "#9AF";
var colors = [red, yellow, green, cyan, blue, magenta];

// Setting styles for canvas stroke and fill
ctx.strokeStyle = lavender;
ctx.fillStyle   = orange;
ctx.lineWidth   = 5;

// Draw a line from start position to end position
//   start and end are [ x, y ] arrays
//   color is a #RGB hex string, or undefined
function drawLine( start, end, color ) {
  if (color === undefined) {
    color = lavender;
  }
  ctx.beginPath();
  ctx.moveTo( start[0], start[1] ); // x and y coordinates
  ctx.lineTo( end[0],   end[1] );   // x and y for end
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();
};

// Draw a circle at the given center position
//   center is a [ x, y ] array
//   radius is a float
//   color is a #RGB hex string, or undefined
function drawCircle( center, radius, color ) {
  if (color === undefined) {
    color = lavender;
  }
  ctx.beginPath();
  ctx.arc(
    center[0], // center x coordinate
    center[1], // center y coordinate
    radius,    // radius
    0,          // starting angle
    2 * Math.PI // ending angle
  ); 
  ctx.closePath();
  // Fill small circles, trace large circles
  if ( radius < 20 ) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
};

// Transform Leap coordinates to scene coordinates
//   leapPosition is a [ x, y, z ] array
//   returns a [ x, y ] array
function leapToScene( leapPosition, leapScalar ) {
  var canvasPos = [ 0, 0 ];
  canvasPos[0] = width/2 + leapPosition[0];
  canvasPos[1] = height  - leapPosition[1];
  return canvasPos;
};

// Create a Leap controller so we can emit gesture events
var controller = new Leap.Controller( { enableGestures: true } );

// Emit gesture events before emitting frame events
controller.addStep( function( frame ) {
  for ( var g = 0; g < frame.gestures.length; g++ ) {
    var gesture = frame.gestures[g];
    controller.emit( gesture.type, gesture, frame );
  }
  return frame; // Return frame data unmodified
});

// Frame event listener
controller.on( 'frame', function( frame ) {
  // Slowly fade away the last frame's canvas
  ctx.fillStyle = "rgba( 0, 0, 0, .2 )"; // Transparent black
  ctx.fillRect( 0, 0, width, height );
  
  for ( var p = 0; p < frame.pointables.length; p++ ) {
    var finger = frame.pointables[p];
    var position = leapToScene( finger.tipPosition );
    // Choose color based on the finger ID
    var color = colors[finger.id % 6];
    drawCircle( position, 10, color );
  }
});

// Circle gesture event listener
controller.on( 'circle', function( circle, frame ) {
  // Draw a circle for every circle state
  drawCircle( leapToScene(circle.center), circle.radius );
  // Print its data when the state is start or stop
  if (circle.state == 'start' || circle.state == 'stop') {
    console.log(circle.state, circle.type, circle.id,
                'radius:', circle.radius);
  }
});

// Swipe gesture event listener
controller.on( 'swipe', function( swipe, frame ) {
  // Choose color based on the gesture's pointable ID
  var color = colors[swipe.pointableIds[0] % 6];
  // Draw a line for every swipe state
  drawLine( leapToScene(swipe.startPosition),
            leapToScene(swipe.position), color );
  // Print its data when the state is start or stop
  if (swipe.state == 'start' || swipe.state == 'stop') {
    var dir = swipe.direction;
    var dirStr = dir[0] > 0.8 ? 'right' : dir[0] < -0.8 ? 'left'
               : dir[1] > 0.8 ? 'up'    : dir[1] < -0.8 ? 'down'
               : dir[2] > 0.8 ? 'backward' : 'forward';
    console.log(swipe.state, swipe.type, swipe.id, dirStr,
                'direction:', dir);
  }
});

// Start listening for frames
controller.connect();

