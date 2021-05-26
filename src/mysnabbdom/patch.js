import createElement from './createElement';
import vNode from './vnode';

export default function patch(oldVnode, newVnode) {
    if (!oldVnode.sel) {
        oldVnode = vNode(oldVnode.tagName.toLowerCase(), {}, undefined, undefined, oldVnode);
    }
    if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
        patchVnode(oldVnode, newVnode);
    } else {
        const dom = createElement(newVnode)
        if (oldVnode.elm.parentNode && dom) {
            oldVnode.elm.parentNode.insertBefore(dom, oldVnode.elm);
        }
        oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
}
function patchVnode(oldVnode, newVnode) {
    if (newVnode === oldVnode) return;
    if (newVnode.text && (newVnode.children === undefined || newVnode.children.length === 0)) {
        //old 和 new 都是text
        oldVnode.elm.innerHTML = newVnode.text;
    } else {
        //old 是 text，new是children
        if (oldVnode.children === undefined || oldVnode.children.length === 0) {
            oldVnode.elm.innerHTML = '';
            for (let i of newVnode.children) {
                const dom = createElement(i);
                oldVnode.elm.appendChild(dom);
            }
        } else {
            // diff 核心 新旧都有children
            updateVnode(oldVnode.elm, oldVnode.children, newVnode.children)
        }
    }
}
function isSameNode(oldVnode, newVnode) {
    return oldVnode.sel === newVnode.sel && oldVnode.key === newVnode.key;
}
function updateVnode(parentElm, oldCh, newCh) {
    let oldStartIndex = 0;
    let oldEndIndex = oldCh.length - 1;
    let newStartIndex = 0;
    let newEndIndex = newCh.length - 1;
    let oldStartNode = oldCh[oldStartIndex];
    let oldEndNode = oldCh[oldEndIndex];
    let newStartNode = newCh[newStartIndex];
    let newEndNode = newCh[newEndIndex];
    let keymap;
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (oldStartNode === null || oldCh[oldStartIndex] === undefined) {
            oldStartNode = oldCh[++oldStartIndex]
        } else if (oldEndNode === null || oldCh[oldEndIndex] === undefined) {
            oldEndNode = oldCh[--oldEndIndex]
        } else if (newStartNode === null || newCh[newStartIndex] === undefined) {
            newStartNode = newCh[++newStartIndex]
        } else if (newEndNode === null || newCh[newEndIndex] === undefined) {
            newEndNode = newCh[--newEndIndex]
        } else if (isSameNode(oldStartNode, newStartNode)) {
            console.log('命中1')
            patchVnode(oldStartNode, newStartNode);
            oldStartNode = oldCh[++oldStartIndex];
            newStartNode = newCh[++newStartIndex];
        } else if (isSameNode(oldEndNode, newEndNode)) {
            console.log('命中2')
            patchVnode(oldEndNode, newEndNode);
            oldEndNode = oldCh[--oldEndIndex];
            newEndNode = newCh[--newEndIndex];
        } else if (isSameNode( oldStartNode,newEndNode)) {
            console.log('命中3')
            patchVnode( oldStartNode,newEndNode);
            parentElm.insertBefore(oldStartNode.elm, oldEndNode.elm.nextSibling);
            oldStartNode = oldCh[++oldStartIndex];
            newEndNode = newCh[--newEndIndex];

        } else if (isSameNode( oldEndNode,newStartNode)) {
            console.log('命中4')
            patchVnode(oldEndNode,newStartNode);
            parentElm.insertBefore(oldEndNode.elm, oldStartNode.elm);
            oldEndNode = oldCh[--oldEndIndex];
            newStartNode = newCh[++newStartIndex];
        } else {
            //四种策略没有命中但是节点在 start 和 end 之间
            console.log('词典策略')
            if (!keymap) {
                keymap = {};
                for (let i = oldStartIndex; i <= oldEndIndex; i++) {
                    const key = oldCh[i].key;
                    if (key) {
                        keymap[oldCh[i].key] = i;
                    }
                }
            }
            const inOldIndex = keymap[newStartNode.key]
            if (!inOldIndex) {
                parentElm.insertBefore(createElement(newStartNode), oldStartNode.elm);
            } else {
                const elemove = oldCh[inOldIndex];
                patchVnode(elemove, newStartNode);
                oldCh[inOldIndex] = undefined;
                parentElm.insertBefore(elemove.elm, oldStartNode.elm)
            }
            newStartNode = newCh[++newStartIndex];
        }
    }
    
    if (newStartIndex <= newEndIndex) {
        //需要新增节点
        console.log('新增')
        const before = oldCh[oldStartIndex]? oldCh[oldStartIndex].elm:null
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            parentElm.insertBefore(createElement(newCh[i]),before );
        }
    } else if (oldStartIndex <= oldEndIndex) {
        //需要删除节点
        console.log('删除')
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            if (oldCh[i]) {
                parentElm.removeChild(oldCh[i].elm)
            }
        }
    }

}