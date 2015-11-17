module.exports = function( _title, _caption, _url ){
    var wrapper = document.createElement('div');
    var title = document.createElement('h1');
    title.textContent = _title;
    title.style.marginBottom = "30px";

    var caption = document.createElement('p');
    caption.innerHTML= _caption;
    caption.style.marginBottom = "10px";

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

    var span = document.createElement('span')
    span.textContent = 'by';
    span.style.marginLeft = "10px";
    span.style.marginRight = "5px";

    var twitter = document.createElement('a');
    twitter.href = "https://twitter.com/kenji_special";
    twitter.target = "_blank";
    twitter.textContent = '@kenji_Specail';


    available.appendChild(a);
    available.appendChild(span);
    available.appendChild(twitter);

    wrapper.appendChild(title);
    wrapper.appendChild(caption);
    wrapper.appendChild(available);
    //wrapper.appendChild(url);

    document.body.appendChild(wrapper);

    return wrapper;
};

