import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'ComfyUI',
  description: 'ComfyUI 模型库使用教程', // 站点描述（自定义）
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',

  // 情况2：部署到 普通项目仓库（推荐，格式：/[GitHub 仓库名]/）
  base: '/comfyui-doc/', // 替换为你的 GitHub 仓库名
  publicPath: '/comfyui-doc/', // 与 base 保持一致

  outputPath: 'dist', // Dumi 打包输出目录（默认就是 dist，可显式指定）
  mode: 'site', // 站点模式（博客/知识库选择 site，组件库选择 component）
  // more config: https://d.umijs.org/config
});
