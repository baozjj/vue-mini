import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { Fragment, Text, isSameVNodeType } from './vnode'
import { EMPTY_OBJ } from '@vue/shared'

// 渲染器选项接口，定义了操作 DOM 的必要方法
export interface RendererOptions {
  // 为指定的元素设置属性（属性打补丁）
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void
  // 为指定的元素设置文本内容
  setElementText(node: Element, text: string): void
  // 将指定元素插入到父元素中，anchor 表示插入的位置（锚点）
  insert(el, parent: Element, anchor?): void
  // 创建指定类型的元素
  createElement(type: string)
  remove(el: Element)
}

// 创建渲染器函数，接收一个渲染器选项对象
export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options)
}

// 基础渲染器创建函数，定义了渲染流程
function baseCreateRenderer(options: RendererOptions): any {
  // 解构传入的选项对象，获取各个 DOM 操作方法
  const {
    insert: hostInsert,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    remove: hostRemove
  } = options

  // 处理元素节点的函数
  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      // 如果旧节点不存在，说明是初次渲染，挂载新元素
      mountElement(newVNode, container, anchor)
    } else {
      // 否则为更新过程（此处省略处理逻辑）
      patchElement(oldVNode, newVNode)
    }
  }

  // 挂载元素的函数
  const mountElement = (vnode, container, anchor) => {
    const { type, props, shapeFlag } = vnode
    // 1. 创建元素
    const el = (vnode.el = hostCreateElement(type))

    // 2. 根据类型设置文本或子元素
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 如果节点类型是文本子节点，设置元素文本
      hostSetElementText(el, vnode.children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 如果节点类型是数组子节点，递归挂载子节点（此处省略处理逻辑）
    }

    // 3. 设置属性
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    // 4. 将元素插入到容器中
    hostInsert(el, container, anchor)
  }

  const patchElement = (oldVNode, newVNode) => {
    const el = (newVNode.el = oldVNode.el)

    const oldProps = oldVNode.props || EMPTY_OBJ
    const newProps = newVNode.props || EMPTY_OBJ

    patchChildren(oldVNode, newVNode, el, null)

    patchProps(el, newVNode, oldProps, newProps)
  }

  const patchChildren = (oldVNode, newVNode, container, anchor) => {
    const c1 = oldVNode && oldVNode.children
    const prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0
    const c2 = newVNode && newVNode.children
    const { shapeFlag } = newVNode

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 卸载旧子节点
      }

      if (c1 !== c2) {
        // 挂载新子节点的文本
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // diff
        } else {
          // 卸载
        }
      } else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 删除旧节点 text
          hostSetElementText(container, '')
        }

        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 单独新子节点的挂载
        }
      }
    }
  }

  const patchProps = (el: Element, vnode, oldProps, newProps) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const next = newProps[key]
        const prev = oldProps[key]
        if (next !== prev) {
          hostPatchProp(el, key, prev, next)
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  // 对比新旧节点，进行渲染更新的函数
  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode === newVNode) {
      return // 如果新旧节点相同，则无需更新
    }

    if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
      unmount(oldVNode)
      oldVNode = null
    }

    const { type, shapeFlag } = newVNode

    switch (type) {
      case Text:
        // 处理文本节点
        break
      case Comment:
        // 处理注释节点（此处省略）
        break
      case Fragment:
        // 处理 Fragment 节点（此处省略）
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 如果是普通元素，处理元素节点
          processElement(oldVNode, newVNode, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          // 如果是组件节点，处理组件（此处省略）
        }
        break
    }
  }

  const unmount = vnode => {
    // 卸载逻辑
    hostRemove(vnode.el)
  }

  // 渲染函数
  const render = (vnode, container) => {
    if (vnode === null) {
      // 如果 vnode 为空，执行卸载逻辑（此处省略）
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      // 否则进行渲染或更新
      patch(container._vnode || null, vnode, container)
    }

    // 缓存当前渲染的 vnode，方便下次更新时对比
    container._vnode = vnode
  }

  return {
    render // 返回渲染函数
  }
}
