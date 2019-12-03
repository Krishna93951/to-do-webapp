if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

function createElement(elem, attribute) {
    var element = document.createElement(elem, attribute);
    for (var i in attribute) {
        element.setAttribute(i, attribute[i]);
    }
    return element;
}