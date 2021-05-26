import h from './mysnabbdom/h';
import patch from './mysnabbdom/patch';
const vnode = h('ul', {}, [
    h('li', { key: 'q' }, 'q'),
    h('li', { key: 'a' }, 'a'),
    h('li', { key: 'b' }, 'b'),
    h('li', { key: 'd' }, 'd'),
    h('li', { key: 'c' }, 'c'),
    h('li', { key: 'e' }, 'e')
])
const container = document.getElementById('container')
patch(container, vnode)

const vnode2 = h('ul', {}, [
    h('li', { key: 'q' }, 'q'),
    h('li', { key: 'b' }, [
        h('p', { key: 'p'},'dididdi')
    ]),
    h('li', { key: 'd' }, 'd'),

])
const btn = document.querySelector('.button');
btn.onclick = () => {
    patch(vnode, vnode2);
}
