require('../../../../src/js/vendors/controls/OrbitControls');

var raf     = require('raf');
var glslify = require('glslify');
var Particle = require('./particle');
var FrontParticle = require('./front-particle');
var pageController = require('./page-controller');
var bgEffectShader = require('./postEffect');
var bgEffect;

var container, stats;

//init();
var imageArr = [
    './assets/particles/particle4.png',
    './assets/particles/particle4.png',
    './assets/particles/particle2.png',
    './assets/particles/particle3.png',
    './assets/particles/bg.png'
];
var images = [];
var textures = [];

var loadeImage = 0;

var camera, debugCamera, cameraHelper, scene, renderer;
var particleSystem;
var isRender = true;
var mesh;
var lineSystem;
var uniforms;
var particleSize = 15000;
var particleFrontSize = 4000;
var totalParticleSize = particleSize + particleFrontSize;

var particles = [];
var frontParticles = [];

var clock = new THREE.Clock()
var bgColor, bgColor2;
var cameraControls;
var debugPlane;
var dt, id;

var positionAttribute;
var linePositionAttribute;
var lineGeometry;
var cameraPrevY, cameraDY = 0;
var cameraTheta = 0;
var bgImage;
var bgTexture;

var composer;

function init() {


    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 6000 );
    camera.cameraTheta = 0;
    camera.position.z = 2750;
    camera.animationY = 0;
    camera.animationZ = 0;



    debugCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000 );
    debugCamera.position.z =8000;
    debugCamera.position.x =8000;
    debugCamera.lookAt(camera.position);


    images.forEach(function(image){
        var texture = new THREE.Texture(image);
        texture.magFilter = texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        textures.push(texture);
    });

    bgTexture = new THREE.Texture(bgImage);
    bgTexture.magFilter =  bgTexture.minFilter = THREE.LinearFilter;
    bgTexture.premultiplyAlpha = true;
    bgTexture.needsUpdate = true;

    scene = new THREE.Scene();

    //cameraHelper = new THREE.CameraHelper(camera);

    var geometry = new THREE.BufferGeometry();
    lineGeometry = new THREE.BufferGeometry();

    var positions = new Float32Array( totalParticleSize * 3 );
    var velocities = new Float32Array( totalParticleSize * 3 );
    var randomTextureNumbers = new Float32Array(totalParticleSize);

    camera.updateMatrix();
    camera.updateMatrixWorld();
    scene.updateMatrixWorld();

    var ii;
    for( ii = 0; ii < particleSize; ii++){
        var particle = new Particle(ii, camera);
        particles.push(particle);
    }

    for( ii = 0; ii < particleFrontSize; ii++){
        var frontParticle = new FrontParticle( particleSize + ii, ii, camera);
        particles.push(frontParticle);
    }

    for ( var i = 0; i < totalParticleSize ; i++ ) {
        var particle = particles[i];

        positions[ 3 * i ]     = particle.position.x;
        positions[ 3 * i + 1 ] = particle.position.y;
        positions[ 3 * i + 2 ] = particle.position.z;

        randomTextureNumbers[i] = Math.random();
    }


    positionAttribute = new THREE.BufferAttribute( positions, 3 );
    geometry.addAttribute( 'position', positionAttribute );
    geometry.addAttribute( 'randomTexture', new THREE.BufferAttribute( randomTextureNumbers, 1 ) );

    geometry.computeBoundingSphere();

    uniforms =  {
        uTime    :  { type: "f", value: 0 },
        texture0 :  { type: "t", value: textures[0]},
        texture1 :  { type: "t", value: textures[1]},
        texture2 :  { type: "t", value: textures[2]},
        texture3 :  { type: "t", value: textures[3]}
    };


    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader   : glslify('./shader.vert'),
        fragmentShader : glslify('./shader.frag'),

        //blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true
    });

    particleSystem = new THREE.Points( geometry, material );
    scene.add( particleSystem );

    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });

    var lineMaterial = new THREE.ShaderMaterial({
        vertexShader   : glslify('./line-shader.vert'),
        fragmentShader : glslify('./line-shader.frag'),
        linewidth: 1,
        //blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true

    });

    //var geometry = new THREE.Geometry();


    var linePositions = new Float32Array(totalParticleSize * 3 * 2);
    for(var ii = 0; ii < totalParticleSize; ii++){
        var particle = particles[ii];
        linePositions[ 6 * ii ]     = particle.position.x;
        linePositions[ 6 * ii + 1 ] = particle.position.y;
        linePositions[ 6 * ii + 2 ] = particle.position.z;

        linePositions[ 6 * ii * 3 ] = particle.position.x;
        linePositions[ 6 * ii + 4 ] = particle.position.y;
        linePositions[ 6 * ii + 5 ] = particle.position.z;
    }

    linePositionAttribute = new THREE.BufferAttribute( linePositions, 3);
    lineGeometry.addAttribute( 'position', linePositionAttribute );


    var line = new THREE.LineSegments( lineGeometry, lineMaterial );
    scene.add( line );



    renderer = new THREE.WebGLRenderer( { antialias: true, alph: true } );
    bgColor = new THREE.Color(0x010718);
    bgColor2 = new THREE.Color(0x333333);
    renderer.setClearColor(bgColor);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    //console.log(bgTexture);
    //console.log(bgTexture.image);
    //bgEffectShader.uniforms.bgTex.value = bgTexture;
    //var width = window.innerWidth || 1;
    //var height = window.innerHeight || 1;
    //var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };

    //var renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );
    composer = new THREE.EffectComposer(renderer);
    composer.setSize( window.innerWidth, window.innerHeight );
    composer.addPass( new THREE.RenderPass(scene, camera));
    bgEffect = new THREE.ShaderPass(bgEffectShader);
    bgEffect.uniforms.bgTex.value = bgTexture;
    bgEffect.uniforms.uWindow.value = new THREE.Vector2( window.innerWidth, window.innerHeight );
    bgEffect.renderToScreen = true;
    composer.addPass(bgEffect);


    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );


    window.addEventListener( 'resize', onWindowResize, false );
    document.body.addEventListener("keydown", onKeyPress);
    //window.addEventListener("optimizedScroll", onScroll);
    renderer.domElement.addEventListener("mousewheel", onScroll);

    pageController.setCamera(camera);
    pageController.setPostEffect(bgEffect);
    bgEffect.uniforms.uOpacity.value = 1;
    //TweenMax.to(bgEffect.uniforms.uOpacity, 0.6, {value: 1.0, delay: 0.4});


    clock.start();
    raf(animate);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    bgEffect.uniforms.uWindow.value = new THREE.Vector2( window.innerWidth, window.innerHeight );
}

//

function animate() {
    dt = clock.getDelta();

    id = raf( animate );

    if(cameraPrevY){
        cameraDY = camera.animationY - cameraPrevY;
    }


        camera.cameraTheta += 1/600;
        //if(camera.cameraTheta > 2 * Math.PI)camera.cameraTheta -= 2 * Math.PI;

    camera.position.z = 2750 + 10 * Math.cos(camera.cameraTheta * 2) + camera.animationZ;
    camera.position.y = 10 *  Math.sin(camera.cameraTheta * 3) + camera.animationY;
    camera.position.x = 10 *  Math.sin(camera.cameraTheta * 5) ;

    camera.rotation.x = 0.02 *  Math.sin(camera.cameraTheta * 4);
    camera.rotation.y = 0.02 *  Math.sin(camera.cameraTheta * 5);
    camera.rotation.z = 0.02 *  Math.sin(camera.cameraTheta * 7);



    render();

    cameraPrevY = camera.animationY;
    stats.update();

}

function render() {
    //cameraControls.update();

    particles.forEach(function(particle){
        particle.update(dt, positionAttribute);
    });


    particles.forEach(function(particles){
        particles.updateLine(linePositionAttribute, cameraDY);
    });

    positionAttribute.needsUpdate = true;
    linePositionAttribute.needsUpdate = true;

    /**
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
    renderer.enableScissorTest(true);
    renderer.setClearColor(bgColor);
    renderer.render( scene, camera );
     */
    composer.render();

}


//init();

imageArr.forEach(function(imageUrl){
    var image = new Image();
    image.onload = onload.bind(this, image, imageUrl);
    image.src = imageUrl;
});

function onload(image, url){
    loadeImage++;

    if(url.indexOf("bg" ) > 0){
        bgImage = image;
    }else{
        images.push(image);
    }

    if(loadeImage == imageArr.length) init();
}

function onKeyPress(ev){

    if(ev.charCode == 99){
        if(isRender){
            raf.cancel(id);
        }else{
            dt = clock.getDelta();
            id = raf(animate);
        }
        isRender = !isRender;
    }

    //console.log(ev.charCode);

    if(ev.keyCode == 68 || ev.keyCode == 40){
        pageController.pageDown(bgEffect);
    }

    if(ev.keyCode  == 38 || ev.keyCode == 85){
        pageController.pageUp(bgEffect);

    }
}

function onScroll(event){
    //console.log(event);
    if(event.deltaY > 0){
        pageController.pageDown();
    }else{
        pageController.pageUp();
    }
}