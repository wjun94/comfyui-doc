---
title: 人物一致性
toc: content
order: 8
group:
  title: 实战
---

## 人物一致性

要实现高质量的 ComfyUI 动漫人物一致性（Character Consistency），目前社区最成熟的方案通常结合了 **IP-Adapter**、**ControlNet** 和 **角色设定图（Character Sheet）** 的逻辑。

这里为您推荐两套目前最主流的动漫一致性工作流方案，并提供核心节点的配置思路（由于 JSON 文件过大，无法直接展示全文，但我会指引您去哪里下载最优质的源文件）。

### 方案一：全能型动漫角色开发套件 (推荐)

**名称：** `ComfyUI_VNCCS` (Visual Novel Character Creation Suite)
**适用场景：** 制作视觉小说、动漫角色立绘、表情差分。
**核心逻辑：** 它不是一个单一的 JSON，而是一套分步骤的工作流（角色生成 -> 服装生成 -> 表情生成）。

- **下载地址：** 请在 GitHub 搜索 `AHEKOT/ComfyUI_VNCCS`
- **为什么推荐：**
- 专门针对动漫风格（Anime/Visual Novel）优化。
- **分步保存：** 它会将生成的角色特征保存为参数，后续生成不同表情/动作时，会自动调用之前保存的特征，保证 100%一致。
- **内置功能：** 包含自动抠图（Remove Background）、自动排版等实用功能。

### 方案二：基于 IP-Adapter 的灵活构建方案 (通用)

如果您想自己搭建或寻找单图一致性工作流，请寻找包含以下关键词的 JSON：`IPAdapter FaceID Plus V2` 或 `InstantID Anime`。

**核心节点架构 (您可以根据此逻辑在 ComfyUI 中复现)：**

1. **模型加载器 (Checkpoint Loader):**

- 推荐模型：`Pony Diffusion V6 XL` 或 `Animagine XL V3.1` (这两个对动漫角色的一致性理解最好)。

2. **IP-Adapter 模块 (核心):**

- **节点：** `IPAdapter Advanced`
- **模型：** `ip-adapter-plus-face_sdxl_vit-h` (对于动漫，有时标准版比 FaceID 版效果更自然，FaceID 容易把动漫脸画成真人脸)。
- **权重 (Weight):** 设置在 `0.6 - 0.8` 之间。过高会崩坏，过低无法保持特征。
- **参考图：** 输入一张你满意的角色“证件照”。

3. **ControlNet 模块 (动作控制):**

- **节点：** `ControlNet Apply`
- **模型：** `OpenPose` 或 `Depth`。
- **作用：** 保证你生成的角色是在你指定的动作下，而不是随机乱动。

4. **Latent 放大 (Upscale):**

- 为了修复动漫脸部的崩坏，必须包含 `FaceDetailer` (面部重绘) 节点。

### 寻找现成 JSON 的最佳资源库

您可以直接在以下平台搜索对应关键词下载 JSON 文件，直接拖入 ComfyUI 即可使用：

1. **OpenArt.ai / Civitai**

- 搜索关键词：`Consistent Character Workflow` 或 `Character Sheet`
- 筛选：选择 `Anime` 类别。

2. **GitHub**

- 搜索：`ComfyUI-Workflows-ZHO` (这类仓库通常收集了汉化且测试好的工作流)。

### 专家提示 (针对动漫一致性)

- **固定 Seed (种子):** 在调试角色特征时，务必锁定 Seed。
- **Prompt (提示词) 增强:** 即使有了 IP-Adapter，提示词中依然要保留描述角色的核心特征（例如：`blue hair, twin tails, red eyes, sailor school uniform`），这能辅助 AI 锁定特征。
- **关于 LoRA:** 如果您需要该角色生成 50 张以上的图，最稳妥的方法是用上述工作流生成 15-20 张该角色的多角度图（三视图），然后训练一个 **Character LoRA**。这是目前公认达到 99% 一致性的唯一方法。

## 训练 Lora

在 ComfyUI 中直接训练 LoRA 是完全可行的，虽然目前主流（也是最高效）的训练方式还是使用独立的 **Kohya_ss** GUI，但如果你希望**完全留在 ComfyUI 环境内**完成“数据处理 -> 训练 -> 测试”的闭环，你需要使用特定的训练节点。

以下是使用 ComfyUI 进行角色 LoRA 训练的完整指南，重点放在**动漫角色**（结合您之前的需求）。

---

### 方法一：ComfyUI 原生训练方案 (适合显存 > 12GB 用户)

要在 ComfyUI 内部训练，你需要安装核心插件：**`ComfyUI-Lora-Training`** (作者: nullquant) 或 **`ComfyUI-Simple-Trainer`**。

#### 1. 核心节点与工作流逻辑

这个工作流不像生成图片那样即时反馈，它更像是一个批处理脚本。

- **Dataset Loader (数据集加载):** 指定你电脑上存放训练图片的文件夹路径。
- **Lora Training Config (训练配置):** 设置学习率、Steps、Epochs 等参数。
- **Model Loader (底模加载):** 选择 SDXL, Pony V6, 或 Animagine V3 作为底模（推荐 Pony V6 用于动漫角色）。
- **Train Lora (执行训练):** 连接上述节点，点击 Queue Prompt 开始“炼丹”。

#### 2. 为什么很多人不推荐在 ComfyUI 内训练？

- **显存占用:** 训练比生成更吃显存。ComfyUI 本身占用一部分资源，如果显存不够容易 OOM (Out of Memory)。
- **界面交互:** 没有 Kohya_ss 那样清晰的进度条和即时的 Loss（损失值）图表监控。
- **灵活性:** 调整参数不如专门的 GUI 方便。

---

### 方法二：黄金标准流程 (数据准备 + 外部训练 + ComfyUI 测试)

这是目前最稳健的流程。为了保证角色一致性，**数据准备（Dataset）** 比在哪里点击“开始训练”更重要。

#### 第一步：高质量数据集准备 (决定成败的关键)

既然是为了**角色一致性**，素材必须精挑细选。

1. **图片数量:** 准备 **15-25 张**该角色的图片。

- **全身图 (Full body):** 3-5 张。
- **半身图 (Upper body):** 5-8 张。
- **大头照 (Close-up):** 3-5 张（用于学习面部细节）。
- **背景:** 尽量是白底或简单的背景。如果有复杂背景，必须抠图或打标处理。

2. **图片预处理 (Pre-processing):**

- 分辨率：建议裁剪为 `1024x1024` (SDXL/Pony 标准)。
- 可以使用 ComfyUI 的 `WD14 Tagger` 节点自动给图片打标。

3. **打标策略 (Tagging):**

- 创建一个文本文件与图片同名。
- **Trigger Word (触发词):** 在每个文本文件的最前面加上角色的唯一名字，例如 `kuro_hime, 1girl, ...`。
- **保留特征 Tag:** 不要删除描述角色核心特征的词（如 `blue eyes`, `twintails`），这样 LoRA 才能学会这些特征属于这个角色。

#### 第二步：推荐训练参数 (针对 Pony/Animagine 底模)

如果你坚持在 ComfyUI 内训练，或者使用 Kohya，请参考以下针对动漫角色的“黄金参数”：

- **Base Model (底模):** `Pony Diffusion V6 XL` (目前最强动漫底模)
- **Resolution:** `1024,1024`
- **Network Rank (Dim):** `32` 或 `128` (角色 LoRA 32 足够，想要极高细节选 128)。
- **Network Alpha:** 设置为 Rank 的一半 (如 Rank 32, Alpha 16) 或 相等。
- **Learning Rate (学习率):** `0.0004` (SDXL/Pony 建议比 SD1.5 高一点)。
- **Optimizer:** `AdamW8bit` 或 `Prodigy` (Prodigy 可以自动适应学习率，适合新手)。
- **Epochs:** 10-15。
- **Repeats:** 每张图重复 10 次。
- _总步数估算:_ 图片数 (20) x Repeats (10) x Epochs (10) = 2000 步左右。

#### 第三步：在 ComfyUI 中测试 LoRA

训练完成后，生成的 `.safetensors` 文件放入 `ComfyUI/models/loras`。

1. **加载 LoRA:** 使用 `Load LoRA` 节点，连接在 Checkpoint 和 CLIP 之间。
2. **权重测试:** 推荐使用 `XY Plot` 脚本节点。

- 测试权重从 `0.6` 到 `1.0`。
- 测试提示词是否包含触发词 (`trigger word`)。

3. **验证一致性:** 生成三视图（Front, Side, Back）看角色特征是否崩坏。

### 总结建议

如果您是**初次尝试**训练角色 LoRA：

1. **不要直接在 ComfyUI 里死磕训练节点**。配置环境和路径非常容易出错。
2. **推荐路径:**

- 下载 **Kohya_ss** (本地 GUI) 或者使用 **LiblibAI / Google Colab** (云端训练)。
- 训练好 `.safetensors` 文件后。
- 回到 **ComfyUI**，利用你的一致性工作流（上一轮提到的）+ 这个 LoRA，你将获得完美的角色控制力。
