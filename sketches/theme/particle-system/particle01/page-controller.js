var config = require('./config');

var PageController = function () {
    this.pageCategories = [
        "HOME",
        "ABOUT",
        "CHARACTER",
        "VIDEO",
        "GALLERY"
    ];
    this._pageNumber = 0;

    this.MAX_PAGE = this.pageCategories.length;

    this.pageTextDom = document.createElement('div');
    document.body.appendChild(this.pageTextDom);
    //this.pageTextDom.innerHTML = "test";
    this.pageTextDom.style.zIndex = "99999";
    this.pageTextDom.style.position = "absolute";
    this.pageTextDom.style.right = "30px";
    this.pageTextDom.style.top = "30px";
    this.pageTextDom.style.color = "#ffffff";
    this.pageTextDom.style.textAlign = "right";

    this.pageDDom = document.createElement('div');
    this.pageTextDom.appendChild(this.pageDDom);
    this.pageDDom.style.marginBottom = "5px";
    this.pageDDom.innerHTML = "(D): SCROLL DOWN";

    this.pageUDom = document.createElement('div');
    this.pageTextDom.appendChild(this.pageUDom);
    this.pageUDom.style.marginBottom = "20px";
    this.pageUDom.innerHTML = "(U): SCROLL UP";

    this.pageNumberDom = document.createElement('div');
    this.pageTextDom.appendChild(this.pageNumberDom);
    this.pageNumberDom.style.marginBottom = "5px";
    this.pageNumberDom.innerHTML = "PAGE  :  " + this.pageNumber;

    this.pageCategoryDom = document.createElement('div');
    this.pageTextDom.appendChild(this.pageCategoryDom);
    this.pageCategoryDom.innerHTML = this.pageCategories[this.pageNumber];


    this.isTransition = false;
    this.isCameraAnimation = true;
};

PageController.prototype.setCamera = function (camera) {
    this.camera = camera;
};

PageController.prototype.setPostEffect = function(postEffect){
    this.postEffect = postEffect;
};

PageController.prototype.pageDown = function () {
    if (this.isTransition) return;

    //console.log(this.pageNumber );
    if (this.pageNumber >= this.MAX_PAGE - 1) return;
    this.pageNumber = this.pageNumber + 1;
    this.isTransition = true;

    this.camera.animationZRate = 0;
    TweenMax.to(this.camera, 2.3, {
        animationY: -config.pageAnimationHeight * this.pageNumber,
        animationZRate : 1,
        ease: Power4.easeInOut,
        onUpdate  : this.twOnUpdate.bind(this),
        onComplete: this.twComplete.bind(this)
    });

};

PageController.prototype.pageUp = function () {
    if (this.isTransition) return;

    if (this.pageNumber <= 0) return;
    this.pageNumber = this.pageNumber - 1;
    this.isTransition = true;

    this.camera.animationZRate = 0;
    TweenMax.to(this.camera, 2.3, {
        animationY: -config.pageAnimationHeight * this.pageNumber,
        animationZRate : 1,
        ease: Power4.easeInOut,
        onUpdate  : this.twOnUpdate.bind(this),
        onComplete: this.twComplete.bind(this)
    });

};

PageController.prototype.twOnUpdate = function(){

    this.camera.animationZ = (1 - this.camera.animationZRate) * this.camera.animationZRate * 800;
    this.postEffect.uniforms.uOpacity.value = 1 -  (1 - this.camera.animationZRate) * this.camera.animationZRate;
};

PageController.prototype.twComplete = function () {
    this.isTransition = false;
    //this.isCameraAnimation = true;
};

Object.defineProperty(PageController.prototype, 'pageNumber', {
    get: function () {
        return this._pageNumber;
    },
    set: function (value) {
        this._pageNumber = value;

        var curCateogry = this.pageCategories[this._pageNumber];
        this.pageNumberDom.innerHTML = "PAGE  :  " + this._pageNumber;
        this.pageCategoryDom.innerHTML = curCateogry;
    }
});

var pageController = new PageController();
module.exports = pageController;