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
    name: 'ComfyUI',
    // 文档根路径
    sidebar: {
      '/checkpoint': [
        {
          title: '模型',
          children: [
            {
              title: '图生文',
              link: '/checkpoint/text/01',
              children: [
                {
                  title: '动漫',
                  link: '/checkpoint/text/01',
                  children: [
                    {
                      link: '/checkpoint/text/01-ace',
                    },
                  ],
                },
                {
                  title: '全能',
                  link: '/checkpoint/all/01-dreamshaper',
                  children: [
                    {
                      link: '/checkpoint/text/01-dreamshaper',
                    },
                  ],
                },
                {
                  title: 'Flux',
                  link: '/checkpoint/flux/01-fp8',
                  children: [
                    {
                      link: '/checkpoint/flux/01-fp8',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // nav: [{ title: '模型', link: '/checkpoint/text/01-ace' }],
  },
});
