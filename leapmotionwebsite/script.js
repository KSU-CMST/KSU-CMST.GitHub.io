// Create a controller object
var controller = new Leap.Controller();

// Connect to the Leap Motion Controller
controller.connect();

// Event listener for the frame data
controller.on('frame', function(frame) {
  // Check if any hands are present in the current frame
  if (frame.hands.length > 0) {
    // Get the first hand in the frame
    var hand = frame.hands[0];

    // Get the hand position data
    var handPosition = hand.palmPosition;

    // Update the hand position display
    updateHandPositionDisplay(handPosition);
  }
});

// Function to update the hand position display
function updateHandPositionDisplay(handPosition) {
  var displayElement = document.getElementById('hand-position-display');

  // Format the hand position data
  var formattedPosition = 'X: ' + handPosition[0].toFixed(2) + '<br>' +
                          'Y: ' + handPosition[1].toFixed(2) + '<br>' +
                          'Z: ' + handPosition[2].toFixed(2);

  // Update the display content
  displayElement.innerHTML = formattedPosition;
}

// Event listener for the controller connection
controller.on('connect', function() {
  console.log('Leap Motion Controller connected');
});