/**
 * 
 */
import { getChildrenVnodeMap } from "./utils";
import { VNodeDiff, X24DomVNode, Encrypt } from '../typings';

const fllterEmpty = (arr: string[] = []) => arr.filter(t => t !== "");
const diffType = (obj1, obj2) => (typeof obj1 !== typeof obj2) || (obj1.type !== obj2.type);
const isStr = (str: any) => typeof str === "string";
const isNum = (num: any) => typeof num === "number";
const isStrOrNum = (str: any) => isStr(str) || isNum(str);
const joinPath = (...paths: string[]) => fllterEmpty(paths).join("|");


export const diffStrOrNum = (
    oldVal, 
    newVal, 
    path, 
    encrypt: Encrypt | null, 
    callback = (diff: VNodeDiff) => console.log(diff)
) => {
    let dif: VNodeDiff = null;
    if (oldVal !== newVal) {
        dif = {
            path,
            value: newVal,
        };

        if (encrypt) {
            dif["encrypt"] = encrypt;
        }
    }
    dif && callback(dif);
};

/**
 * 虚拟dom diff
 * @param {*} oldVNode 原始虚拟dom
 * @param {*} newVNode 新的虚拟dom
 * @param {*} parentPath 父节点的路径
 * @param {*} currPath 当前路径
 * @param {*} batch 所有变化
 */
export function diff(
    oldVNode, 
    newVNode, 
    parentPath = "",
    currPath = '',
    batch: VNodeDiff[]  = []
) {
    const fullPath = joinPath(parentPath, currPath);

    /**
     * 文本节点
     */
    if (newVNode.type === "_text" && oldVNode.text !== newVNode.text) {
        diffStrOrNum(
            oldVNode.text || "", 
            newVNode.text || "", 
            `${fullPath}|text`, 
            newVNode.encrypt, 
            dif => batch.push(dif)
        );
        return;
    }

    /**
     * 节点类型不一样
     * 整个替换
     */
    if (diffType(oldVNode, newVNode)) {
        batch.push({
            path: fullPath,
            value: newVNode,
        });
        return;
    }

    /**
     * 节点类型一样
     * 但是都是字符串
     */
    if (isStrOrNum(oldVNode) && isStrOrNum(newVNode)) {
        diffStrOrNum(oldVNode || "", newVNode || "", fullPath, null, dif => batch.push(dif));
        return;
    }

    const diffInner = (oldVal, newVal, fpath, encrypt?) => {
        newVal = {
            ...(newVal || {})
        };

        Object.keys(oldVal).forEach(key => {
            const path = [fpath, key].join("|");
            if (newVal.hasOwnProperty(key)) {
                const temp = newVal[key];
                delete newVal[key];
                if (isStrOrNum(oldVal[key]) && isStrOrNum(temp)) {
                    diffStrOrNum(oldVal[key], temp, path, encrypt, dif => batch.push(dif));
                    return;
                }
    
                diff(oldVal[key], temp, fpath, key, batch);
            } else {
                batch.push({
                    path,
                    value: null,
                });
            }
        });

        Object.keys(newVal)
        .forEach(key => {
            if (Object.prototype.hasOwnProperty.call(oldVal, key)) return;
            batch.push({
                path: [fpath, key].join("|"),
                value: newVal[key]
            });
        });
    };

    /**
     * 属性直接取最新的
     */
    diffInner(oldVNode.attr || {}, newVNode.attr || {}, `${fullPath}|attr`, newVNode.encrypt);
    diffInner(oldVNode.prop || {}, newVNode.prop || {}, `${fullPath}|prop`, newVNode.encrypt);
    diffStrOrNum(oldVNode.x24no || '', newVNode.x24no || '', `${fullPath}|x24no`);
   
    /**
     * 对比子节点
     */
    const oChildren: any = getChildrenVnodeMap(oldVNode);
    const nChildren: any = getChildrenVnodeMap(newVNode);

    diffInner(oChildren, nChildren, fullPath);

    return batch;
}

// window.x24Diff = diff;
