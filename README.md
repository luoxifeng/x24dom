# x24dom
一个超小型的虚拟dom库，当然它有diff,以及patch

## 特点
- 小，使用简单但功能齐全
- 序列化与反序列化dom
- 截取某一时刻的dom快照
- 忽略一部分dom节点
- 收集每一步dom的变化diff
- 根据原始dom与diff还原任意时刻的dom

## 做什么
如果你使用过html2canvas这类把dom截成图片的库，
那么此库是把dom序列化成json的库。
因此你可以使用这个库来保留页面中dom，
在页面生命周期中每一次变化的快照，
不过你不用担心每一次保留快照的大小，
因为你可以选择保留每一次变化与上一次(或首次渲染)快照的差异，
此库提供让你还原任何一次dom快照的api,以此你可以用很小的成本，
完成一个用户操作行为还原的可视化系统，可以达到如录屏的效果

## api usage
- renderToString  
把vdom渲染成字符串

- parsedom  
把真实dom转换成vnode
- utils 

- diff
对比两个vnode得到差异

- patch
根据原始的vnode以及diff产生的vnodediff合成新的vnode
- vnode  

## 真实场景demo
