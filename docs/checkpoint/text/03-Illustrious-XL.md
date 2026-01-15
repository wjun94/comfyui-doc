---
title: SDXL
toc: content
order: 3
group:
  title: 动漫
---

# Illustrious-XL-v0.1.safetensors 完整使用指南

你需要一份关于该模型的全面使用解析，包括注释、适用场景、参数配置、提示词及优化技巧，以下是详细内容：

## 一、模型核心注释

1.  **模型本质**：Illustrious-XL-v0.1.safetensors 是基于 **Stable Diffusion XL (SDXL)** 架构训练的二次元/日系插画风格专用 Checkpoint 模型（权重文件），`safetensors` 格式是目前主流的安全高效模型格式，相比传统 `ckpt` 格式，无恶意代码风险、加载速度更快、显存占用更低且支持断点加载。
2.  **核心优势**：主打高精细度二次元画面呈现，人物五官还原稳定、色彩饱和度适中且层次感强、服装褶皱与毛发细节刻画出色，对二次元插画的风格把控性优于通用 SDXL 模型，生成画面不易出现“崩脸”“比例失调”等常见问题。
3.  **配套依赖**：该模型为 SDXL 系列，需在支持 SDXL 的运行环境中使用（如 Automatic1111 WebUI 最新版、ComfyUI），建议搭配 SDXL 专用 VAE（如 `sdxl_vae.safetensors` 或 `anime_xl_vae.safetensors`）修复色彩偏灰问题。

## 二、适用场景

### 核心适用场景（发挥模型最大优势）

1.  **二次元商业创作**：游戏角色立绘、轻小说/漫画封面、动漫周边图案设计（如抱枕、海报）。
2.  **个人创意创作**：原创二次元人设绘制、动漫同人图制作、个性化头像/壁纸（手机/电脑）生成。
3.  **社交媒体视觉内容**：短视频二次元配图、小红书/微博动漫风格打卡图、二次元虚拟形象设计。
4.  **二次元风格练习**：美术生参考用插画生成、二次元风格构图灵感获取。

### 不适用场景（避坑提醒）

1.  写实类内容（如真人肖像、写实风景、工业产品实拍图），模型对写实细节的还原能力薄弱，生成结果会有强烈二次元违和感。
2.  复杂机械结构、高精度工程图纸，模型无法精准还原机械零件的逻辑与细节。
3.  暗黑重口、超抽象艺术风格，模型原生风格偏向清新/精致，此类风格需大量额外 LoRA 辅助，效果不稳定。

## 三、推荐参数配置

### 基础参数（Automatic1111 WebUI/ComfyUI 通用，优先推荐）

| 参数项                | 推荐取值                                                        | 说明                                                                                                |
| --------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 采样器                | DPM++ 2M Karras、DPM++ SDE Karras                               | 兼顾生成速度与画面质量，Karras 变体对二次元细节优化更友好；追求灵动风格可选用 Euler a               |
| 采样步数              | 20-30 步                                                        | 20 步即可满足基础精细度，30 步细节更饱满，超过 30 步显存占用增加且画面收益递减                      |
| 分辨率                | 1024×1024（原生）、896×1152/1152×896、2048×2048（开启高清修复） | SDXL 原生分辨率，竖版/横版插画可调整为不对称分辨率，2048×2048 需依赖高清修复避免模糊                |
| CFG Scale（引导系数） | 7-10                                                            | 平衡提示词遵从度与画面创意性，低于 7 易跑题（脱离二次元风格），高于 10 画面僵硬、色彩过曝、细节失真 |
| 生成精度              | FP16                                                            | 显存占用适中，画面效果足够；24G 以上显存可尝试 FP32，细节提升有限但显存占用翻倍                     |

### 进阶参数（优化体验，按需开启）

1.  **高清修复（Hires. fix）**
    - 开启状态：建议开启（尤其分辨率低于 1024×1024 或需要大尺寸图片时）
    - 放大算法：R-ESRGAN 4x+ Anime6B（二次元专用，放大无锯齿，细节保留最佳）
    - 放大倍数：1.5-2.0 倍
    - 重绘幅度：0.2-0.4（保留原图核心风格与细节，仅优化清晰度，过高易改变原图构图）
2.  **VAE 配置**：在 WebUI 「设置-稳定扩散-VAE」中选择 `anime_xl_vae.safetensors`，重启生效，解决模型生成画面偏灰、色彩暗淡的问题。
3.  **批次设置**：12G 显存建议批次大小=1、批次数量=2-4；24G 显存可批次大小=2-4，提升批量生成效率。

## 四、触发词与负面提示词

### 核心原则

该模型对英文提示词支持更优，采用「**核心风格触发词（必带）+ 主体描述 + 细节补充 + 画质提升词**」的结构，提示词排序越靠前，权重越高（可通过 `()` 提升权重，`((()))` 权重更高，`[]` 降低权重）。

### 1. 正向触发词（含核心触发词与示例）

#### （1）核心触发词（必带，激活模型原生风格）

```
Illustrious style, anime style, masterpiece, best quality
```

- `Illustrious style`：模型专属风格触发词，是激活该模型二次元插画风格的关键，必须放在提示词最前端。

#### （2）完整示例（分两类，可直接复用修改）

##### 示例 1：二次元女性角色立绘

```
(Illustrious style), anime style, masterpiece, best quality, ultra-detailed, 1girl, long silver hair, crimson eyes, Gothic lolita dress, lace trim, bow tie, gentle smile, standing, full body, soft lighting, vibrant colors, sharp focus, detailed clothing folds, detailed hair strands, clean background, white background
```

##### 示例 2：二次元场景插画（樱花树下）

```
(Illustrious style), anime style, masterpiece, best quality, ultra-detailed, 1boy and 1girl, sitting on a cherry blossom branch, pink petals falling, sunset, golden glow, distant mountain, peaceful atmosphere, high detail, cinematic lighting, soft blur background
```

#### （3）常用补充词（按需添加）

- 人物细节：`detailed eyes, perfect face, proportional body, smooth skin, delicate hands`
- 光影氛围：`soft moonlight, warm sunlight, neon light, cinematic lighting, backlighting`
- 画质强化：`ultra-high resolution, 8k, sharp edges, vivid colors, high contrast`

### 2. 负面提示词（规避瑕疵，分基础款与进阶款）

#### （1）基础款（必带，规避核心常见问题）

```
lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, ugly, deformed, mutated
```

- 核心作用：规避低分辨率、五官/肢体比例失调、文字水印、模糊、低质量等基础问题。

#### （2）进阶款（针对该模型易出现的瑕疵，按需补充）

```
extra limbs, disfigured face, crossed eyes, overexposed, washed out colors, messy background, incoherent details, blurry foreground, distorted clothing, bad proportions, floating objects, cartoonish (excessive), flat colors
```

- 核心作用：规避该模型偶尔出现的色彩过曝、面部扭曲、背景杂乱、服装变形等问题。

## 五、额外使用优化技巧

1.  **LoRA 搭配优化**：该模型可搭配 SDXL 二次元 LoRA 强化特定风格，推荐 LoRA 及权重（0.6-0.8 最佳，避免权重过高盖过模型原生风格）：
    - 风格强化：`Gothic Lolita XL LoRA`、`Cherry Blossom XL LoRA`、`Watercolor Anime XL LoRA`
    - 细节强化：`Anime Eyes Detail XL LoRA`、`Clothing Fold XL LoRA`
    - 避坑：避免同时加载 3 个以上 LoRA，易出现风格冲突、画面崩裂。
2.  **Embedding 辅助**：搭配 SDXL 专用负向 Embedding（如 `EasyNegative XL`），放入 WebUI 的 `embeddings` 文件夹，在负面提示词中添加 `EasyNegative XL`，可进一步强化负面提示效果，减少画面瑕疵。
3.  **显存优化（低显存用户必备）**：
    - 开启 WebUI 启动参数中的 `--xformers`，降低显存占用约 30%，不损失画面质量。
    - 关闭不必要插件（如实时预览、图片浏览器），分辨率优先选择 896×896，避免 OOM（显存不足）。
    - 采用「先小图后放大」策略：先生成 896×896 小图，满意后再用高清修复放大至 1792×1792。
4.  **提示词与种子微调技巧**：
    - 固定种子（Seed）：找到满意的画面后，固定种子值，仅微调提示词（增减细节），可快速优化画面，避免重新生成浪费时间。
    - 精简提示词：控制在 50 词以内，冗长提示词会导致模型注意力分散，细节还原下降。
5.  **后期微调**：生成图片后，用 Clip Studio Paint、Photoshop 进行小幅优化：
    - 用「液化工具」修正轻微五官/肢体比例问题。
    - 用「曲线工具」调整色彩饱和度与对比度，让画面更鲜艳。
    - 用「降噪工具」去除少量 jpeg 伪影，提升画面干净度。
6.  **风格拓展**：在核心触发词 `Illustrious style` 后添加辅助风格词，可拓展衍生风格，示例：
    - 水彩风：`Illustrious style, watercolor style, soft brush strokes`
    - 赛博朋克二次元：`Illustrious style, cyberpunk style, neon lights, futuristic city`
    - 国风二次元：`Illustrious style, traditional Chinese painting style, hanfu, red peony`

## 六、总结

1.  **核心定位**：Illustrious-XL-v0.1.safetensors 是 SDXL 架构下的优质二次元插画模型，`safetensors` 格式安全高效，核心优势是高细节、稳五官、优色彩，适合二次元创作爱好者与商业插画从业者。
2.  **关键要点**：使用时需必带专属触发词 `Illustrious style`，参数优先选择 DPM++ 2M Karras（20-30 步）、CFG 7-10、1024×1024 分辨率，搭配基础负面提示词规避核心瑕疵。
3.  **优化核心**：通过「LoRA/Embedding 搭配」「提示词结构化」「后期微调」可大幅提升画面质量，低显存用户可借助 `xformers` 与「先小后大」策略解决显存不足问题。
4.  **避坑提醒**：不适合写实类创作，避免高 CFG 值（>10）、过多冲突 LoRA 与冗长提示词，才能充分发挥模型的原生优势。s'sss
