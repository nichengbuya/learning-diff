import vNode from './vNode';
export default function h(sel, data, c){
    if(arguments.length !== 3){
        throw new Error('参数多了')
    }
    if(typeof c === 'string' || typeof c === 'number'){
        return vNode(sel, data,undefined, c , undefined)
    }else if(Array.isArray(c)){
        let children = [];      
        for(let i of c){
            if(typeof i === 'object' && !i.hasOwnProperty('sel')){
                throw new Error('type error')
            }
            children.push(i);
        }
        return vNode(sel, data,children, undefined, undefined)
    }else if(typeof c === 'object' && c.hasOwnProperty('sel')){
        const children = [c];
        return vNode(sel, data,children,undefined, undefined)
    }else{
        throw new Error('类型不对')
    }
}