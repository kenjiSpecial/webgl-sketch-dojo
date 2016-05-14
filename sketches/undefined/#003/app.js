var ua = navigator.userAgent.toLowerCase();
var isiOS = (/ip(hone|od|ad)/i).test(ua) && !window.MSStream;
var isDroid = (/android/i).test(ua);
var isTablet = (isiOS || isDroid || (/tablet/).test(ua));
window.isTablet = isTablet


var raf = require('raf');
require('vendors/controls/TrackballControls');
var createCaption = require('vendors/caption');
import CustomMesh from "./mesh";

var scene, camera, renderer;
var meshArr = [];
var customMesh;

var imageURLs = [
    "./assets/instgram/icon-outline.png",
    "./assets/instgram/icon-normal.png",
    "./assets/instgram/icon-play.png",
    "./assets/instgram/icon-pause.png",
];
var mouse = new THREE.Vector2(-9999, -9999);
var textures = {};
var loader = new THREE.TextureLoader();
var meshCount = 0;
var click = 0;
var LENGTH;
var light;
var id;
var stats, wrapper;
var time, controls;

var isAnimation = true;
var raycaster, INTERSECTED;

scene = new THREE.Scene();



// var script = document.createElement('script');
// script.src = 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js';
// script.type = 'text/javascript';
// document.getElementsByTagName('head')[0].appendChild(script);

(function(){


    // camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera  = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );
    camera.position.z = 400;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    document.body.appendChild(renderer.domElement);

    setComponent();

    time = new THREE.Clock();
    time.start();
    
    var count=0;

    imageURLs.forEach(function(imageURL, index){
        loader.load(imageURL, function(texture){
            // textures.push(texture);
            var imageSrc = texture.image.src;

            if(imageSrc.indexOf("outline") > 0) textures['outline'] = texture;
            else if(imageSrc.indexOf("normal") > 0)textures['normal'] = texture;
            else if(imageSrc.indexOf("play") > 0) textures['play'] = texture;
            else if(imageSrc.indexOf("pause") > 0) textures['pause'] = texture;
            console.log(imageSrc);
            console.log(textures);

            count++;
            if(imageURLs.length == count) createMesh();
        }.bind(this))
    }.bind(this));

    //
})();

function createMesh(){
    var length;
    if(window.isTablet) length = 9;
    else                length = 13;

    var size = (length - 1)/2;
    for(var xx = -size; xx <= size; xx++){
        for(var yy = -size; yy <= size; yy++){
            customMesh = new CustomMesh(textures, xx, yy, length);
            
            scene.add(customMesh);
            meshArr.push(customMesh);
            customMesh.addEventListener('play', onPlay);
            customMesh.addEventListener('pause', onPause);
        }
    }

    raycaster = new THREE.Raycaster();

    raf(animate);
}

function setComponent(){
    var title = 'Instgram Icon Visual Player';
    var caption = '';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/undefined/%23003';

    wrapper = createCaption(title, caption, url);
    wrapper.style.position = "absolute";


    stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';

    stats.domElement.style.zIndex= 9999;
    if(window.isTablet){
        wrapper.style.width = (window.innerWidth - 20) + "px";
        wrapper.style.top = '10px';
        wrapper.style.left = '10px';
        stats.domElement.style.bottom  = '10px';
        stats.domElement.style.left = '10px';
    }else{
        wrapper.style.width = (window.innerWidth/2 - 50) + "px";
        wrapper.style.top = '50px';
        wrapper.style.left = '30px';
        stats.domElement.style.bottom  = '30px';
        stats.domElement.style.left = '30px';
    }

    document.body.appendChild( stats.domElement );
}

function animate() {
    stats.begin();

    var dt = time.getDelta ();

    meshArr.forEach(function(mesh){
        mesh.updateLoop(dt)
    });

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( meshArr);
    if ( intersects.length == 1 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {
            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            document.body.style.cursor = "pointer";
            INTERSECTED.onOver();
            // meshArr.forEach(function(mesh){
            //     mesh.onOver();
            // });
            if(isTablet){
                onClick()
            }else{
                window.addEventListener("click", onClick);
            }
        }
    } else {
        if(INTERSECTED) {
            document.body.style.cursor = "default";
            window.removeEventListener("click", onClick);
            // INTERSECTED.onOut();
            meshArr.forEach(function(mesh){
                mesh.onOut();
            });
            INTERSECTED = null;
        }

    }
    
    renderer.render(scene, camera);

    stats.end();

    id = raf(animate);
}

function onClick(ev){
    INTERSECTED.onClick();
};

function onPlay(event){
    var selectedItem = event.item;
    
    meshArr.forEach(function(mesh){
        mesh.onPlay(selectedItem);
    })
}

function onPause(event){
    var selectedItem = event.item;

    meshArr.forEach(function(mesh){
        mesh.onPause(selectedItem);
    })
}


window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});


window.addEventListener("resize", function(ev){
    camera.left = window.innerWidth/-2;
    camera.right = window.innerWidth/2;
    camera.top = window.innerHeight/2;
    camera.bottom = -window.innerHeight/2;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});

if(isTablet){
    window.addEventListener('touchstart', function(event){
        event.preventDefault();
        var touches = event.changedTouches;
        mouse.x = ( touches[0].pageX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( touches[0].pageY / window.innerHeight ) * 2 + 1
    });

    window.addEventListener('touchmove', function(event){
        event.preventDefault();
        var touches = event.changedTouches;
        mouse.x = ( touches[0].pageX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( touches[0].pageY / window.innerHeight ) * 2 + 1
    });

    window.addEventListener("touchend", function(event){
        event.preventDefault();

        mouse.x = 9999; //( touches[0].pageX / window.innerWidth ) * 2 - 1;
        mouse.y = 9999; //- ( touches[0].pageY / window.innerHeight ) * 2 + 1

        // setTimeout(function(){
            meshArr.forEach(function(mesh){
                mesh.onOut();
            });
        // }.bind(this), 1000)

    })
}else{
     window.addEventListener('mousemove', function(event){
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    });
}
