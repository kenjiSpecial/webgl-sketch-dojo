/**
 * Created by kenji on 3/3/16.
 */
"use strict";

(function () {
    var dataList = {};
    var loadedCount = 0, count = 0;
    //var template = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';
    var template, jsonData;
    var wrapper;
    var mainContainer;


    function loadJSON(jsonFile, callback, name) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', jsonFile, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText, name);
            }
        };
        xobj.send(null);
    }



    function onLoadJsonDone(response) {
        jsonData = JSON.parse(response);

        onLoadDone();
    }

    function onLoadDone(){
        count = 0;

        jsonData.forEach(function( data ){
            count++;
            var dataLowerCase = data.toLowerCase().split(' ').join('-')
            dataList[dataLowerCase] = {title : data};
            var jsonFile = "/assets/data/site/" + dataLowerCase + ".json"
            loadJSON(jsonFile, onLoadJsonDone2, dataLowerCase);
        });

    };

    function onLoadJsonDone2(response, name) {
        dataList[name].data = JSON.parse(response);

        loadedCount++;
        if(count == loadedCount) init();
    };

    function init() {
        // console.log(dataList);
        // console.log(ksApp.TemplateEngine(template));
        var text = new EJS({url : "/assets/ejs/template.ejs"}).render({data: dataList});
        wrapper.innerHTML = text;
        console.log(mainContainer   );
        TweenMax.to(mainContainer, 0.8, {opacity : 1, ease: Quint.easeOut });
    }

    window.onload = function () {
        wrapper = document.getElementById("wrapper");
        mainContainer = document.getElementById("main-container");
        loadJSON("/assets/data/config.json", onLoadJsonDone);
    }

})();