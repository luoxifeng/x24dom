/**
 * renderToString
 */
import { getChildrenVnodeArr, domAttrStringify } from "./_utils";

interface Attr {
    [key: string]: string;
}

/**
 * 
 * @param {*} vnode 
 */
export const renderToString = ({ type = "", attr = null, text = "", ...children }) => {
    let str = "";
    let attrStr = "";
    let childList = [];
    let endTag = "";
    attr = attr || {};

    const tag = type.trim().toLowerCase();
    if (tag === "") {
        str += "";
    } else if (tag === "_text") {
        str += attr.text + "";
    } else {
        attrStr = domAttrStringify(attr);
        str += `<${type} ${attrStr}>`;
        endTag = `</${type}>`;
    }
   
    childList = getChildrenVnodeArr(children);

    for (let child of childList) {
        if (typeof child === "string") {
            str += child;
        } else if (typeof child === "object") {
            str += renderToString(child);
        }
    }

    str += endTag;

    return str;
};

// window.renderToString = renderToString;
