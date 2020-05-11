/**
 * parseDom
 */
import uuidv4 from "uuid/v4";
import { isFun } from "./_utils";

let x24idMap = {};
window.x24idMap = x24idMap;

/**
 * 
 * @param {*} el 
 * @param {*} level 
 * @param {*} index 
 * @param {*} vnode 
 * @param {*} key 
 */

interface ParseOpts {
    ignore?: (...args: any[]) => boolean;
    ignoreAttr?: (...args: any[]) => boolean;
    enableProp?: boolean;
}

const defParseOpts = {
    ignore: el => false,
    ignoreAttr: (el, key) => false,
    enableProp: false
};

// export const parseDom = (
//     el, 
//     level = 0, 
//     index = 0, 
//     vnode = {}, 
//     options: DefParseOpts = defParseOpts, 
//     key = level + '.' + index,
// ) => {
//     const curr = Object.create(null);
//     // curr.x24id = el.x24id = el.x24id || x24id;

//     if (el.nodeType === document.TEXT_NODE) {
//         // x24id++;
//         curr.type = "_text";
//         curr.x24no = index;
//         curr.text = el.textContent;
//     } else if (el.nodeType === document.ELEMENT_NODE) {
//         // x24id++;
//         curr.type = el.tagName.toLowerCase();
//         curr.x24no = index;

//         const ignoreAttrList: string[] = (el.getAttribute("x24-ignore-attr") || "").split("|");
        
//         /**
//          * 忽略元素
//          */
//         if (el.hasAttribute("x24-ignore")) {
//             return;
//         }

//         if (options && isFun(options.ignore)) {
//             if (options.ignore(el)) return;
//         }

//         if (el.hasAttributes()) {
//             const attr = Object.create(null);
//             const encrypt = Object.create(null);
//             let keys = [];

//             for (let t of el.attributes) {

//                 if (t.nodeName === "x24-encrypt-attr") {
//                     keys = (t.nodeValue || "").split("|").filter(k => el.hasAttribute(k));
//                     if (keys.length) {
//                         encrypt["attr"] = keys;
//                     }
//                 }

//                 if (t.nodeName === "x24-encrypt-prop") {
//                     keys = (t.nodeValue || "").split("|").filter(k => k in el);
//                     if (keys.length) {
//                         encrypt["prop"] = keys;
//                     }
//                 }

//                 /**
//                  * 忽略属性
//                  */
//                 if (ignoreAttrList.indexOf(t.nodeName) > -1) {
//                     continue;
//                 }

//                 if (options && isFun(options.ignoreAttr)) {
//                     if (options.ignoreAttr(el, t.nodeName)) {
//                         continue;
//                     }
//                 }

//                 attr[t.nodeName] = t.nodeValue;
//             }

//             if (Object.keys(attr).length) {
//                 curr.attr = attr;
//             }

//             if (Object.keys(encrypt).length) {
//                 curr.encrypt = encrypt;
//             }
//         }

//         if (["input"].indexOf(curr.type) > -1) {
//             const prop = Object.create(null);
//             if (el.value) {
//                  prop.value = el.value;
//             }
//             if (Object.keys(prop).length) {
//                 curr.prop = prop;
//             }
//         }

//         if (el.hasChildNodes()) {
//             level++;
//             let ind = 0;
//             for (let child of el.childNodes) {
//                 if (~[document.TEXT_NODE, document.ELEMENT_NODE].indexOf(child.nodeType)) {
//                     parseDom(child, level, ind++, curr, options);
//                 }
//             }
//         } 

//     }
//     vnode[key] = curr;

//     return vnode;
// };

// window.parseDom = parseDom;

const x24idCreator = (el) => {
    if (!el.x24uuid) {
        el.x24uuid = uuidv4();
        x24idMap[el.x24uuid] = 0;
    }
    return () => x24idMap[el.x24uuid]++;
};


export const parseDom = (
    el, 
    index = () => 0, 
    vnode = Object.create(null), 
    options: ParseOpts = defParseOpts,
    updateX24id = x24idCreator(el)
) => {
    const curr = Object.create(null);
    const setX24Id = () => {
        el.x24id = "x24id" in el ? ~~el.x24id : updateX24id();
        vnode[el.x24id] = curr;
    };

    if (el.nodeType === document.TEXT_NODE) {
        if (el.parentNode.hasAttribute("x24-ignore-text")) {
            return vnode;
        }
        setX24Id();
        curr.type = "_text";
        curr.x24no = index();
        curr.attr = {
            text: el.textContent
        };
        if (el.parentNode.hasAttribute("x24-encrypt-text")) {
            curr.encrypt = {
                attr: ["text"]
            };
        }
    } else if (el.nodeType === document.ELEMENT_NODE) {
        /**
         * 忽略元素
         */
        if (el.hasAttribute("x24-ignore")) {
            return vnode;
        }

        if (options && isFun(options.ignore)) {
            if (options.ignore(el)) return vnode;
        }

        setX24Id();
        curr.type = el.tagName.toLowerCase();
        curr.x24no = index();

        if (window.x24Debug === true) {
            el.setAttribute("x24id", el.x24id);
            el.setAttribute("x24no", curr.x24no);
        }

        const ignoreAttrList: string[] = (el.getAttribute("x24-ignore-attr") || "").split("|").concat(["x24id", "x24no"]);

        if (el.hasAttributes()) {
            const attr = Object.create(null);
            const encrypt = Object.create(null);
            let keys = [];

            for (let t of el.attributes) {

                if (t.nodeName === "x24-encrypt-attr") {
                    keys = (t.nodeValue || "").split("|").filter(k => el.hasAttribute(k));
                    if (keys.length) {
                        encrypt["attr"] = keys;
                    }
                }

                if (t.nodeName === "x24-encrypt-prop") {
                    keys = (t.nodeValue || "").split("|").filter(k => k in el);
                    if (keys.length) {
                        encrypt["prop"] = keys;
                    }
                }

                /**
                 * 忽略属性
                 */
                if (ignoreAttrList.indexOf(t.nodeName) > -1) {
                    continue;
                }

                if (options && isFun(options.ignoreAttr)) {
                    if (options.ignoreAttr(el, t.nodeName)) {
                        continue;
                    }
                }

                attr[t.nodeName] = t.nodeValue;
            }

            if (Object.keys(attr).length) {
                curr.attr = attr;
            }

            if (Object.keys(encrypt).length) {
                curr.encrypt = encrypt;
            }
        }

        if (options.enableProp) {
            if (["input"].indexOf(curr.type) > -1) {
                const prop = Object.create(null);

                if (el.value) {
                    prop.value = el.value;
                }

                if (Object.keys(prop).length) {
                    curr.prop = prop;
                }
            }
        }

        if (el.hasChildNodes()) {
            let ind = 0;
            const updateIndex = () => ind++;
            for (let child of el.childNodes) {
                if (~[document.TEXT_NODE, document.ELEMENT_NODE].indexOf(child.nodeType)) {
                    parseDom(child, updateIndex, curr, options, updateX24id);
                }
            }
            
        } 

    }

    return vnode;
};

window.parseDom = parseDom;

