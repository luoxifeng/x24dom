const typeIsCreator = (type: string) => (target: any) => typeof target === type;
export const isFun = typeIsCreator("function");
export const isObj = typeIsCreator("object");

export const deepClone = (obj: any) => {
  let clone = { ...obj };

  Object.keys(clone)
    .forEach(key => {
      clone[key] = isObj(obj[key]) ? deepClone(obj[key]) : obj[key]
    });

  return Array.isArray(obj) && obj.length
      ? (clone.length = obj.length) && Array.from(clone)
      : (Array.isArray(obj) ? Array.from(obj) : clone);
};

export const getChildrenVnodeMap = (vnode: any = {}) => {
  return Object.keys(vnode)
      .filter(key => /\d+/.test(key))
      .reduce((acc, key) => {
          acc[key] = vnode[key];
          return acc;
      }, {});
};

export const getChildrenVnodeArr = (vnode = {}) => {
  const children = getChildrenVnodeMap(vnode);
  return Object.values(children).sort((a: any, b: any) => a.x24no - b.x24no);
};

export const domAttrStringify = (attr = {}) => {
  const strs = [];

  for (let [key, value] of Object.entries(attr)) {
      strs.push(`${key}="${value}"`);
  }

  return strs.join(" ");
};

export const isDomElement = (() => {
  return typeof HTMLElement === 'object' ? el => el instanceof HTMLElement
      : el => el && typeof el === 'object' && el.nodeType === 1 && typeof el.nodeName === 'string';
})();


