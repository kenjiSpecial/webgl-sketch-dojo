module.exports = {
    getStats : function(){
        var stats = new Stats();
        stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

        // align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom  = '0px';
        stats.domElement.style.left = '0px';
        stats.domElement.style.zIndex= 9999;


        document.body.appendChild( stats.domElement );
        
        return stats;
    }
};