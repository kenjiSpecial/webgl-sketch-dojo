"use strict";

var THREE = require('three');
var size = require('size');
var OrbitControl = require('three-orbit-controls')(THREE);
var _ = require('underscore');
var raf = require('raf');

export default class ThreeKiso {
    constructor(params){
        _.bindAll(this, "onKeyDown", "tick");

        this.objects = {};
        this.updateCallbacks = [];

        params = Object.assign({
            fov: 75,
            zNear:1,
            zFar:10000,
            alpha : true,
            pixelRatio: window.devicePixelRatio,
            antialias: (window.devicePixelRatio === 1),
            orbitControl : true,
            autoStart : true,
            addGui    : true
        }, params);

        var container;
        if(params.container) container = document.getElementById(params.container);
        if(!container) container = document.body;
        this.container = container;


        this.renderer = new THREE.WebGLRenderer({
            antialias: params.antialias,
            alpha: params.alpha
        });
        this.renderer.setClearColor( 0x000000 );

        this.container.appendChild(this.renderer.domElement);

        // camera
        this.camera = new THREE.PerspectiveCamera(
            params.fov,
            size.width/size.height,
            params.zNear,
            params.zFar
        );


        this.scene = new THREE.Scene();

        this.clock = new THREE.Clock();


        this.resize();
        size.addListener(this.resize, this);


        if(params.orbitControl) this.createOrbitControls();
        if(params.autoStart) this.start();

        // if(params.addGui) this.datOui =  oui.datoui();

        document.addEventListener('keydown', this.onKeyDown)

    }
    add ( object, key ){
        this.objects[key] = object;
        this.scene.add(object);
    }
    addUpdateCallback(callback){
        this.updateCallbacks.push(callback);
    }
    removeUpdateCallback(callback){
        var selectedNum;

        this.updateCallbacks.forEach(function(updateCall, index){
            if(updateCall == callback) selectedNum = index;
        });

        this.updateCallbacks.splice(selectedNum, 1);
    }
    remove (o) {
        var object;

        if (typeof o === 'string') {
            object = this.objects[o];
        }
        else {
            object = o;
        }

        if (object) {
            object.parent.remove(object);
            delete this.objects[o];
        }
    }
    createOrbitControls(){
        this.controls = new OrbitControl(this.camera)
    }
    start (){
        this.isUpdate = true;
        this.clock.start();
        // TweenMax.ticker.addEventListener("tick", this.tick, this);
        this.tickId = raf(this.tick);
    }
    stop(){
        this.isUpdate = false;
        this.clock.stop();

        raf.cancel(this.tickId);
    }
    tick(){
        this.update()
        this.renderer.render(this.scene, this.camera);

        this.tickId = raf(this.tick);
    }
    update(){
        var dt = this.clock.getDelta();

        this.updateCallbacks.forEach(function(updateCalback){updateCalback(dt);});
    }
    resize(){
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(size.width, size.height);
    }
    onKeyDown(e){
        if(e.which == 27){
            if(this.isUpdate) this.stop();
            else              this.start();
        }
    }
    addHelper(x = 0, y = 0, z = 0 ){
        if(!this.helpContainer) {
            this.helpContainer = new THREE.Object3D();
            var axisHelper = new THREE.AxisHelper( 5 );
            axisHelper.position.set(x, y, z);
            this.helpContainer.add( axisHelper );
            this.axisHelper = axisHelper;

            var gridHelper = new THREE.GridHelper( 100, 10 );
            this.helpContainer.add( gridHelper );
            this.gridHelper = gridHelper;
        }

        this.scene.add(this.helpContainer);

    }
    removeHelper(){
        if(this.helpContainer) this.scene.remove(this.helpContainer)
    }
}