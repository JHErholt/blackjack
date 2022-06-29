export class Ele {
    static make(tagName, props, nest) {
        var elelement = document.createElement(tagName);
        if (props) {
            for (var name in props) {
                if (name.indexOf("on") === 0) {
                    elelement.addEventListener(name.substr(2).toLowerCase(), props[name], false);
                } else if (typeof props[name] === "function") {
                    if (name == "function") {
                        if (props[name].call() != "") {
                            elelement.setAttribute(props[name].call(), "");
                        }
                    } else {
                        elelement.setAttribute(name, props[name].call());
                    }
                } else {
                    elelement.setAttribute(name, props[name]);
                }
            }
        }
        if (!nest) {
            return elelement;
        } else if (nest instanceof Function) {
            return Ele.#nester(elelement, nest.call());
        } else {
            return Ele.#nester(elelement, nest);
        }
    }
    static #nester(el, nest) {
        if (typeof nest === "string") {
            var textnode = document.createTextNode(nest);
            el.appendChild(textnode);
        } else if (nest instanceof Array) {
            for (var i = 0; i < nest.length; i++) {
                if (typeof nest[i] === "string") {
                    var textnode = document.createTextNode(nest[i]);
                    el.appendChild(textnode);
                } else if (nest[i] instanceof Node) {
                    el.appendChild(nest[i]);
                }
            }
        } else if (nest instanceof Node) {
            el.appendChild(nest);
        }
        return el;
    }
}