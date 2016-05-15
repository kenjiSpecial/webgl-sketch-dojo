var createCaption = require('vendors/caption');

module.exports = {
    createCaption : function(opts){
        var title = opts.title;
        var caption = opts.caption;
        var url = opts.url;


        var captionTop  = opts.top || 50;
        var captionLeft = opts.left || 30;

        var wrapper = createCaption(title, caption, url);
        wrapper.style.position = "absolute";
        wrapper.style.top  = captionTop + 'px';
        wrapper.style.left = captionLeft + 'px';

        return wrapper;
    },
    createStats : function(opts){
        var statsBottom    = opts.bottom || 30;
        var statsLeft   = opts.left || 30;

        var stats = new Stats();
        stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

        // align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom  = statsBottom + 'px';
        stats.domElement.style.left = statsLeft + 'px';
        stats.domElement.style.zIndex= 9999;

        document.body.appendChild( stats.domElement );

        return stats;
    }
}