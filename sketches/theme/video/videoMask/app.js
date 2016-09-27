var App = require('./index');

var image = new Image();
image.onload = function(){
    var app = new App({image : image, isDebug : true});
    app.start();
};
image.src = "./assets/hello-world.png"
