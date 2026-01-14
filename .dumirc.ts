import { defineConfig } from 'dumi';

export default defineConfig({
  title: '我的dumi文档',
  base: '/comfyui-doc/',
  publicPath: '/comfyui-doc/', // 与 base 保持一致

  // 关键配置：部署到 GitHub Pages 的基础路径
  // 情况1：部署到 个人/组织主页（仓库名必须是 [用户名].github.io）
  // base: '/',
  // publicPath: '/',

  outputPath: 'dist', // Dumi 打包输出目录（默认就是 dist，可显式指定）

  themeConfig: {
    name: 'comfyui文档',
  },
});
