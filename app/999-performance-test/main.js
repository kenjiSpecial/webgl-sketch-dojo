/**
 * Created by kenji on 01/05/2017.
 */
let count = 0;
let totalCount = 100;
let sum = 0;

function benchMarkDescription(count, perf){
    return `${count}: it takes ${perf} ms.`
}

function benchmark(){
    let array = [];
    let start = (window.performance || Date).now();
    for(let i = 0; i < 20000; i++){
        array = Math.pow(Math.sin(Math.random()), 2);
    }
    let end = (window.performance || Date).now();
    let perf = end - start;

    return perf
};


let title = document.createElement('h1');
title.innerHTML = 'performance';
document.body.appendChild(title);


for(count = 0; count < totalCount; count++){
    let perf = benchmark();

    let div = document.createElement('div');
    div.innerHTML = benchMarkDescription(count, perf);
    document.body.appendChild(div);

    sum += perf;
}

let emptyDiv = document.createElement('div');
emptyDiv.innerHTML = '</br>========================</br></br>'
document.body.appendChild(emptyDiv);
let div = document.createElement('div');
div.innerHTML = `<strong>average performance is ${(sum/totalCount).toFixed(5)} s</strong>`
document.body.appendChild(div);

