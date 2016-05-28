var glslify = require('glslify');
var raf = require('raf');
var Igloo = require('./igloo');
var program;

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var igloo = new Igloo(canvas, {alpha: true});
var quad = igloo.array(Igloo.QUAD2);
var vertexShader = glslify("./shader.vert");
var fragmentShader = glslify('./shader.frag');
program = igloo.program(vertexShader, fragmentShader);
var time = 0;

var id = raf(loop);

function loop() {
    time += 1/60;

    program.use()
        .uniform("uWindow", [window.innerWidth, window.innerHeight])
        .uniform("uTime", time)
        .attrib('points', quad, 2)
        .draw(igloo.gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);

    id = raf(loop);
}

window.addEventListener('resize', onResize);

function onResize(event) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;

    // Check if the canvas is not the same size.
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        // Set the viewport to match
        igloo.gl.viewport(0, 0, canvas.width, canvas.height);
    }
}