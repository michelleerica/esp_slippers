// data: x: -7.668800, y: 0.076688, z: 6.518480, compass: 208.944199

let circles = [];
let circleIndex = 0;
let circleCount = 0;
const MAX_CIRCLES = 100;

let drawPointer = {};
let colorCounter = 100;

function setup() {
  createCanvas(windowWidth, windowHeight); 
  background(0);
  colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each
  noStroke(); // Don't draw a border on shapes
  frameRate(10);
  noLoop();
  drawPointer = { x: width/2,  y: height/2 };
}

const objectConverter = str => {
  return str
    .split(',')
    .map(keyVal => {
      return keyVal
        .split(':')
        .map(_ => _.trim())
    })
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue[0]] = currentValue[1] ? Math.abs(currentValue[1]) : 0
      return accumulator
    }, {})
}

function checkWrapping() {
    if(drawPointer.x > width){
        drawPointer.x = 0;
    }
    if(drawPointer.x < 0){
        drawPointer.x = width;
    }
    if(drawPointer.y > height){
        drawPointer.y = 0;
    }
    if(drawPointer.y < 0){
        drawPointer.y = height;
    }
}

function drawCircles(x, y, z) {
    background(0); // clears screen

    drawPointer.x = x % windowWidth;
    drawPointer.y = y % windowHeight;
    drawPointer.z = (z * 5) % 100;
    checkWrapping();

    circles[circleIndex] = {
        size: drawPointer.z,
        x: drawPointer.x,
        y: drawPointer.y,
        hue: colorCounter % 255,
        bright: 255,
        opacity: (colorCounter + 75) % 255
    };
    
      // Increment index but WRAP, to keep array at fixed size
      // (i.e. will start overwriting circles at the start of the array
      // when the index reaches MAX_CIRCLES)
      circleIndex = (circleIndex + 1) % MAX_CIRCLES;
      colorCounter++;

    for (let i = 0; i < circles.length; i++) {
      var c = circles[i];
      fill(c.hue, 100, c.bright, c.opacity);
      ellipse(c.x, c.y, c.size, c.size); // draws circle
    } // for
} 

function webSocketInvoke() {
    if ('WebSocket' in window) {
        console.log('WebSocket is supported by your Browser!');
        var ws = new WebSocket('ws://localhost:8080/','echo-protocol');
        
        ws.onopen = function() {
            console.log('Connection created');
        };
        
        ws.onmessage = function (evt) { 
            const message = evt.data;
            const sensorData = objectConverter(message);
            colorCounter++;
            drawCircles(sensorData.x, sensorData.y, sensorData.z);
        };
        
        ws.onclose = function() {
            console.log('Connection closed'); 
        };
    } else {
        alert('WebSocket NOT supported by your Browser!');
    }
 }
 webSocketInvoke();

