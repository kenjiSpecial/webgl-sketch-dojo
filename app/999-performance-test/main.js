/**
 * Created by kenji on 01/05/2017.
 */
var count = 0;
var curCount = 0;
var totalCount = 120;
var sum = 0;


function benchMarkDescription(count, perf){
    return `${count + 1}: it takes ${perf} ms.`
}

function benchmark(){
    var array = [];
    var start = (window.performance || Date).now();
    for(var i = 0; i < 20000; i++){
        array = Math.pow(Math.sin(Math.random()), 2);
    }
    var end = (window.performance || Date).now();
    var perf = end - start;

    return perf
};


var title = document.createElement('h1');
title.innerHTML = 'performance';
document.body.appendChild(title);


for(count = 0; count < totalCount; count++){
    var perf = benchmark();

    var div = document.createElement('div');
    if(count % 10 === 9) div.innerHTML = benchMarkDescription(count, perf);
    document.body.appendChild(div);

    if(count >= 9){
        curCount++;
        sum += perf;
    }

}

var emptyDiv = document.createElement('div');
emptyDiv.innerHTML = '</br>========================</br></br>'
document.body.appendChild(emptyDiv);
var div = document.createElement('div');
div.innerHTML = `<strong>average performance is ${(sum/curCount).toFixed(5)} ms</strong>`
document.body.appendChild(div);

// memo
// May/01/2017
// chrome 57 / MacBook Pro (Retina, 15-inch, Mid 2015) / 16 GB 1600 MHz DDR3 / AMD Radeon R9 M370X 2048 MB Intel Iris Pro 1536 MB average 0.4ms - 0.5ms
// firefox / MacBook Pro (Retina, 15-inch, Mid 2015) / 16 GB 1600 MHz DDR3 / AMD Radeon R9 M370X 2048 MB Intel Iris Pro 1536 MB average 0.02ms - 0.03ms
// safari 10.0.2/ MacBook Pro (Retina, 15-inch, Mid 2015) / 16 GB 1600 MHz DDR3 / AMD Radeon R9 M370X 2048 MB Intel Iris Pro 1536 MB average 0.12ms - 0.13ms
// safari / iphone 5 / 3.5 ms
// safari / iphont 5s / 0.6ms
// safari / iphont 6/6 plus/6s/ / 0.4 - 0.5ms

