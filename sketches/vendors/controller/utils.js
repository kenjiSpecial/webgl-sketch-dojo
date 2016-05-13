module.exports = {
    key : function(event){

    },
    isArrow : function(event){
        if(event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40 )
            return true

        return false;
    },
    isCommand : function(event){
        if(event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 13 || event.keyCode == 32)
            return true

        return false
    },
    getCommand : function(event){
        if(event.keyCode == 33) return "x";
        else if(event.keyCode == 34) return "y";
        else if(event.keyCode == 13) return "a";
        else if(event.keyCode == 32) return "b";

        return false;
    }

}