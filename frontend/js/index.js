// data: x: -7.668800, y: 0.076688, z: 6.518480, compass: 208.944199
console.log("hello")

let circles = [];
let circleIndex = 0;
let circleCount = 0;
const MAX_CIRCLES = 100;

let sensor = { x: 0, y: 0, z: 0, compass: 0 };

let drawPointer = {};
let colorCounter = 100;
let center = {};
let graph = {
    x: [],
    y: [],
    z: [],
    compass: [],
    index: 0
}

const controls = {
    xyScale: 10,
    x: 0, y: 0, z: 0,
    gravity: 7,
    clearScreen: true
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  background(0);
  colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each
  noStroke(); // Don't draw a border on shapes
  frameRate(10);
  noLoop();
  drawPointer = { x: width/2,  y: height/2 };

  const gui = new dat.GUI();
  gui.add(controls, "xyScale", 10, 20);
  gui.add(controls, "gravity", -2, 12);
  gui.add(controls, "clearScreen");

  gui.add(sensor, "x", -20, 20).listen();
  gui.add(sensor, "y", -20, 20).listen();
  gui.add(sensor, "z", -20, 20).listen();
  gui.add(sensor, "compass", 0, 360).listen();
  center = {
      x: windowWidth/2,
      y: windowHeight/2
  }
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
      accumulator[currentValue[0]] = +currentValue[1]; //? currentValue[1] : 0
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
    if( controls.clearScreen ) background(0); // clears screen

    stroke(50);
    line(windowWidth/2, 0, windowWidth/2, windowHeight); // crosshairs
    line(0, windowHeight/2, windowWidth, windowHeight/2); // crosshairs
    

    stroke(255, 0, 0);
    
    const xGraphPosition = 100;
    
    // for (let i = 1; i < windowWidth; i++) {
    //     line(
    //         i-1, xGraphPosition + map(graph.z[i-1], -10, 10, -100, 100),
    //         i,   xGraphPosition + map(graph.z[i], -10, 10, -100, 100)
    //     );
    // }

    noStroke();

    // drawPointer.x = (x * controls.xyScale) % windowWidth;
    // drawPointer.y = (y * controls.xyScale) % windowHeight;
    // drawPointer.z = ( (z - GRAVITY) * 5) % 100;  // subtract 10 to remove the influence of gravity!
    // checkWrapping();

    drawPointer.x = map(y,   -controls.xyScale, controls.xyScale,  -windowWidth/2,  windowWidth/2 );
    drawPointer.y = map(z-controls.gravity, -controls.xyScale, controls.xyScale, -windowHeight/2, windowHeight/2 );
    drawPointer.z = map(x,   -controls.xyScale, controls.xyScale, 10, 100);

    window.draw = drawPointer;

    circles[circleIndex] = {
        size: drawPointer.z,
        x: drawPointer.x,
        y: drawPointer.y,
        z: drawPointer.z * 5,
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
      ellipse(
        center.x + c.x,  // what the accelerometer calls 'y' is actually left-right horizontal movement
        center.y + c.y,  // use accel up/down for screen y axis
        c.size,
        c.size); // draws circle
    } // for
    //   fill(colorCounter % 255, 100, 255, (colorCounter + 75) % 255);
    //   ellipse( center.x + drawPointer.x, center.y + drawPointer.y, drawPointer.z, drawPointer.z);
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
            window.sensor = sensorData;
            sensor.x = sensorData.x;
            sensor.y = sensorData.y;
            sensor.z = sensorData.z - controls.gravity;
            sensor.compass = sensorData.compass;
            // console.log('sensorData:', sensorData.x, sensorData.y)
            graph.x[graph.index] = sensor.x;
            graph.y[graph.index] = sensor.y;
            graph.z[graph.index] = sensor.z;
            graph.compass[graph.index] = sensor.compass;
            graph.index = (graph.index + 1 ) % windowWidth;
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

function keyPressed(key){
    // console.log(key);

    if( key.key === ' ' ){
        background( 0 );
        circles.length = 0;
        circleIndex = 0;
    }
} // keyPressed