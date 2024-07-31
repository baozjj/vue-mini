import { ComputedRefImpl } from './computed'
import { Dep, createDep } from './dep'

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<object, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  computed?: ComputedRefImpl<T>
  constructor(public fn: () => T) {}

  run() {
    activeEffect = this
    return this.fn()
  }
}

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = createDep()
    depsMap.set(key, dep)
  }

  trackEffects(dep)
  console.log('track 收集依赖', targetMap)
}

/**
 * 利用 dep 依次跟踪指定 key 的 所有 effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

/**
 * 触发依赖
 * @param target
 * @param key
 * @param newValue
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep: Dep | undefined = depsMap.get(key)
  if (!dep) return
  triggerEffects(dep)
  console.log('trigger 触发依赖')
}

/**
 * 依次触发 dep 中保存的依赖
 * @param dep
 */

export function triggerEffects(dep: Dep) {
  const effects = Array.isArray(dep) ? dep : [...dep]

  effects.forEach(effect => {
    triggerEffect(effect)
  })
}

/**
 *  触发指定依赖
 * @param effect
 */

export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}
