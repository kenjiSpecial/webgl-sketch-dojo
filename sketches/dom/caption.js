module.exports = function( _title, _caption, _url ){
    var wrapper = document.createElement('div');
    var title = document.createElement('h1');
    title.textContent = _title;
    title.style.marginBottom = "45px";

    var caption = document.createElement('p');
    caption.innerHTML= _caption;
    caption.style.marginBottom = "30px";

    var available = document.createElement('div');
    var codeP = document.createElement('span');
    codeP.style.marginRight = "10px";
    codeP.textContent = "codes are available:";
    available.appendChild(codeP);

    var url = document.createElement('div');
    url.textContent = "url: ";

    var a = document.createElement('a');
    a.href = _url;
    a.target = "_blank";
    a.textContent = 'here';

    available.appendChild(a);

    wrapper.appendChild(title);
    wrapper.appendChild(caption);
    wrapper.appendChild(available);
    //wrapper.appendChild(url);

    document.body.appendChild(wrapper);

    return wrapper;
};

