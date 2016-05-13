var EventDispatcher = require('./EventDispatcher');
var utils = require('./utils');
var _ = require('lodash');

module.exports = (function(){
    var _controller;
    
    var Controller = function(){
        _.bindAll(this, "onKeyDown", "onKeyPress", "onMouseMove", "onKeyUp");
        this._directionMap = {
            "up"   : false,
            "down"  : false,
            "left"  : false,
            "right" : false
        }

        this._commandMap = {
            "x" : false,
            "y" : false,
            "a" : false,
            "b" : false
        }
    };


    _.extend(Controller.prototype, {
        connect : function(){
            window.addEventListener("keydown", this.onKeyDown);
            window.addEventListener("keypress", this.onKeyPress);
            window.addEventListener("keyup", this.onKeyUp);
            window.addEventListener("mousemove", this.onMouseMove);
        },
        disconnect : function(){
            window.removeEventListener("keydown", this.onKeyDown);
            window.removeEventListener("keypress", this.onKeyPress);
            window.addEventListener("keyup", this.onKeyUp);
            window.removeEventListener("mousemove", this.onMouseMove);
        },
        onKeyUp : function(event){
            if(utils.isArrow(event)){
                this.onKeyArrow(event.keyIdentifier.toLowerCase(), false);
                return;
            }

            if(utils.isCommand(event)){
                this.onKeyCommand(event, false);
                return;
            }

        },
        onKeyDown: function(event){

            if(utils.isArrow(event)){
                this.onKeyArrow(event.keyIdentifier.toLowerCase(), true);
                return;
            }

            if(utils.isCommand(event)){
                this.onKeyCommand(event, true);
                return;
            }

        },
        onKeyCommand : function(event, value){
            var command = utils.getCommand(event);
            var object = {};
            object[command] = value;
            this.commandMap = object;
            if(value == true) this.dispatchEvent({type: "keyDown", command : command });
            else              this.dispatchEvent({type: "keyUp",   command : command });
        },
        onKeyArrow : function( key, value){
            var object = {};
            object[key] = value;
            this.directionMap = object;
        },
        onKeyPress : function(event){
        },
        onMouseMove : function(event){
            // console.log(event);
        }
    });


    Object.defineProperty(Controller.prototype, 'directionMap', {
        get : function(){
            return this._directionMap;
        },
        set : function(opts){
            var key;
            for(key in opts){
                this._directionMap[key] = opts[key];
            }

            var count = 0;
            var directionNumber = 0;
            for(key in this._directionMap){
                if(this.directionMap[key])
                    directionNumber += Math.pow(2, count)

                count++
            }

            // console.log(directionNumber);
            if(directionNumber == 1)       this.direction = "up"
            else if(directionNumber == 2)  this.direction = "down"
            else if(directionNumber == 8)  this.direction = "right";
            else if(directionNumber == 4)  this.direction = "left"
            else if(directionNumber == 9)  this.direction = "upRight";
            else if(directionNumber == 5)  this.direction = "upLeft";
            else if(directionNumber == 10) this.direction = "downRight";
            else if(directionNumber == 6)  this.direction = "downLeft"
            else                           this.direction = null
        }
    });

    Object.defineProperty(Controller.prototype, "commandMap", {
        get: function () {
            return this._commandMap;
        },
        set: function (opts) {
            var key;
            for (key in opts) {
                this._commandMap[key] = opts[key];
            }

            var count = 0;
            var commandNumber = 0;
            for (key in this._commandMap) {
                if (this._commandMap[key])
                    commandNumber += Math.pow(2, count)
                count++
            }
        }
    });




    EventDispatcher.prototype.apply( Controller.prototype );
    if(!_controller) _controller = new Controller();
    return _controller;
})();