var getNormal = require('./polyline-normals')

var output = [
    new THREE.Vector2(100, 100),
    new THREE.Vector2(100, 200),
    new THREE.Vector2(200, 250),
    new THREE.Vector2(400, 200),
    new THREE.Vector2(380, 200),
    new THREE.Vector2(350, 200),
]

var canvas = document.createElement('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas)

var ctx = canvas.getContext('2d')

var normals = getNormal(output);

console.log(normals);
var lineWidth = 20;
var halfLineWidth = lineWidth/2;

for(var ii = 0; ii < output.length-1; ii++){
    ctx.strokeStyle = '#ffffff';
    var {normal} = normals[ii];
    var leftPt = output[ii].clone().addScaledVector(normal, halfLineWidth);
    var rightPt = output[ii].clone().addScaledVector(normal, -halfLineWidth);

    var {normal} = normals[ii + 1];
    var leftNextPt  = output[ii + 1].clone().addScaledVector(normal, halfLineWidth);
    var rightNextPt = output[ii + 1].clone().addScaledVector(normal, -halfLineWidth);

    ctx.beginPath();
    ctx.moveTo(leftPt.x, leftPt.y);
    ctx.lineTo(rightPt.x, rightPt.y);
    ctx.lineTo(leftNextPt.x, leftNextPt.y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftNextPt.x, leftNextPt.y);
    ctx.lineTo(rightNextPt.x, rightNextPt.y);
    ctx.lineTo(rightPt.x, rightPt.y);
    ctx.closePath();
    ctx.stroke();
}