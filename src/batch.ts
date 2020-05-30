/**
 * 
 */
import { deepClone } from "./utils";

/**
 * 根据原始vnode, 以及差异，还原当前的vnode
 * @param {*} oldVNode 
 * @param {*} diffs 
 */
export const batch = (oldVNode, diffs) => {
    const cloneVNode = deepClone(oldVNode);
    
    diffs.forEach(({
        path = '',
        value = null
    }) => {
        let tempNode = cloneVNode;
        let paths = path.split("|");
        let tempPath = paths.shift() || '';

        while (paths.length) {
            tempNode = tempNode[tempPath] || {};
            tempPath = paths.shift() || '';
        }

        if (value === null) {
            delete tempNode[tempPath];
        } else {
            tempNode[tempPath] = value;
        }
    });

    return cloneVNode;
};

// window.x24Batch = batch;
