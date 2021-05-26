export default function createElement(vnode){
    const domNode = document.createElement(vnode.sel);
    vnode.elm = domNode;
    if(vnode.text !== '' && (!vnode.children || vnode.children.length === 0) ){
        domNode.innerHTML = vnode.text;
    }else if(Array.isArray(vnode.children) && vnode.children.length > 0){
        for(let i of vnode.children){
            const childDom = createElement(i);
            domNode.appendChild(childDom);
        }
    }
    return domNode;
}