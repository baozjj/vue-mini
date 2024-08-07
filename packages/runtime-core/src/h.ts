import { isObject, isArray } from '@vue/shared'
import { VNode, createVNode, isVnode } from './vnode'

export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }

      return createVNode(type, propsOrChildren, null)
    } else {
      return createVNode(type, null, [])
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVnode(children)) {
      children = [children]
    }

    return createVNode(type, propsOrChildren, children)
  }
}
