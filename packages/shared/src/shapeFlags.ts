/**
 * 表示 Vue 虚拟 DOM 中不同类型的形状标志的枚举。
 * 这些标志用于在渲染过程中高效地识别 vnode（虚拟节点）的类型及其特征。
 */
export const enum ShapeFlags {
  /**
   * 表示一个普通的 HTML 元素，例如 <div>、<span>。
   */
  ELEMENT = 1,

  /**
   * 表示一个函数式组件。
   * 函数式组件是没有状态的组件，只通过函数来渲染内容。
   */
  FUNCTIONAL_COMPONENT = 1 << 1,

  /**
   * 表示一个有状态的组件。
   * 这种组件内部维护着自己的状态，并通过状态的变化来渲染内容。
   */
  STATEFUL_COMPONENT = 1 << 2,

  /**
   * 表示子节点为文本节点。
   */
  TEXT_CHILDREN = 1 << 3,

  /**
   * 表示子节点为数组，通常是多个子节点的组合。
   */
  ARRAY_CHILDREN = 1 << 4,

  /**
   * 表示子节点为插槽（Slots）。
   * 插槽是 Vue 中的一种机制，用于在父组件中嵌入子组件内容。
   */
  SLOTS_CHILDREN = 1 << 5,

  /**
   * 表示 Teleport 组件。
   * Teleport 是 Vue 3 中的新特性，用于将子组件的渲染位置移动到 DOM 中的其他地方。
   */
  TELEPORT = 1 << 6,

  /**
   * 表示 Suspense 组件。
   * Suspense 组件用于处理异步组件的加载，在加载完成之前可以展示一个 fallback。
   */
  SUSPENSE = 1 << 7,

  /**
   * 表示组件应该保持激活状态。
   * 这个标志通常用于 <KeepAlive> 组件，指示组件应该被缓存以便于后续的重新激活。
   */
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,

  /**
   * 表示组件已被保持激活状态。
   * 当组件被 <KeepAlive> 缓存后，会设置这个标志。
   */
  COMPONENT_KEPT_ALIVE = 1 << 9,

  /**
   * 组合标志，用于表示任何类型的组件（函数式组件或有状态组件）。
   */
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
