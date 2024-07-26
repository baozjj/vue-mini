// 对于 webpack 而言，它在打包的时候会产生许多 冗余的代码，这样的一种情况在我们开发大型项目时候没有什么影响，但是如果我能是开发一个 库 的时候，那么这些冗余的代码就会大大增加库体积，这就不美好了。
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

// https://www.rollupjs.com/guide/big-list-of-options
export default [
  {
    // 入口文件
    input: 'packages/vue/src/index.ts',
    // 打包出口
    output: [
      // 导出 iife 格式
      {
        // 开启 sourcemap
        sourcemap: true,
        // 导出文件地址
        file: './packages/vue/dist/vue.js',
        // 生成包的格式
        format: 'iife',
        // 变量名
        name: 'Vue'
      }
    ],
    // 插件
    plugins: [
      // ts
      typescript({
        sourceMap: true
      }),
      // 模块导入的路径补全
      resolve(),
      // 转 commonjs 为 ESM
      commonjs()
    ]
  }
]