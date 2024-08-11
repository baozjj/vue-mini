import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { Fragment, Text } from './vnode'

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
    setElementText: hostSetElementText
  } = options

  // 处理元素节点的函数
  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      // 如果旧节点不存在，说明是初次渲染，挂载新元素
      mountElement(newVNode, container, anchor)
    } else {
      // 否则为更新过程（此处省略处理逻辑）
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

  // 对比新旧节点，进行渲染更新的函数
  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode === newVNode) {
      return // 如果新旧节点相同，则无需更新
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

  // 渲染函数
  const render = (vnode, container) => {
    if (vnode === null) {
      // 如果 vnode 为空，执行卸载逻辑（此处省略）
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
