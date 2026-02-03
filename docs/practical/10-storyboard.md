---
title: 分镜
toc: content
order: 10
group:
  title: 实战
---

# ComfyUI 分镜工作流全攻略

ComfyUI 分镜工作流是基于节点式可视化编程的分镜创作解决方案，能实现从文本、图像或视频到专业分镜的全流程控制。核心优势在于**精确控制**、**角色一致性**和**流程自动化**，适用于影视预可视化、漫画创作、动画分镜等多种场景。

---

## 一、分镜工作流核心概念

| 概念           | 说明                                                           | 关键节点/工具                             |
| -------------- | -------------------------------------------------------------- | ----------------------------------------- |
| **分镜类型**   | 单镜、多镜(2-9 镜)、连续叙事分镜                               | CR Comic Panel Templates、Prompt Iterator |
| **一致性控制** | 角色、场景、风格在多分镜中保持统一                             | IPAdapter、In-Context LoRA、ControlNet    |
| **提示词工程** | 分镜专属提示词结构：[SCENE-X] + 场景描述 + 角色动作 + 镜头语言 | closerAI、Cinematic Prompt Builder        |
| **排版系统**   | 分镜布局(横版/竖版/网格)、边框、阅读方向                       | CR Comic Panel Templates、Pixstri Comics  |

---

## 二、必备工具与模型

### 1. 核心插件安装

```bash
# 分镜排版节点
git clone https://github.com/RockOfFire/ComfyUI_Comfyroll_CustomNodes.git custom_nodes/ComfyUI_Comfyroll_CustomNodes

# 提示词迭代器(批量生成分镜)
git clone https://github.com/BizaNator/ComfyUI_PromptIterator.git custom_nodes/ComfyUI_PromptIterator

# 角色一致性控制
git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus.git custom_nodes/ComfyUI_IPAdapter_plus

# 视频分镜提取
git clone https://github.com/gitadmini/comfyui_extractstoryboards.git custom_nodes/comfyui_extractstoryboards
```

### 2. 推荐模型组合

| 用途           | 推荐模型                           | 说明                 |
| -------------- | ---------------------------------- | -------------------- |
| **基础生成**   | Flux、SDXL、Banana 2               | 高画质、风格多样     |
| **漫画分镜**   | Counterfeit-V3.0、Anything-V5      | 日系二次元风格适配   |
| **影视分镜**   | Realistic Vision、Deliberate       | 写实场景、镜头感强   |
| **ControlNet** | OpenPose、Canny、Depth             | 姿态、边缘、深度控制 |
| **IPAdapter**  | IP-Adapter-FaceID、IP-Adapter-Full | 角色面部与全身一致性 |

---

## 三、三种主流分镜工作流详解

### 🎬 1. 文本 → 分镜工作流（零基础创作）

**核心逻辑**：LLM 生成分镜描述 → 批量渲染 → 排版输出

#### 步骤 1：工作流搭建（5 大模块）

| 模块           | 节点配置                        | 参数要点                                           |
| -------------- | ------------------------------- | -------------------------------------------------- |
| **提示词生成** | Text Prompt + closerAI/LLM Node | 输入故事大纲，输出[SCENE-1]至[SCENE-N]分镜描述     |
| **模型加载**   | Checkpoint Loader + VAE Loader  | 选择分镜风格匹配的模型(如漫画用 Counterfeit)       |
| **批量渲染**   | Prompt Iterator + KSampler      | 迭代次数=N(分镜数)，每张分镜独立采样               |
| **一致性控制** | IPAdapter + Reference Image     | 用角色参考图锁定外观                               |
| **分镜排版**   | CR Comic Panel Templates        | 选择模板(H3=3 横版/V2=2 竖版)，设置边框厚度(2-5px) |

#### 步骤 2：提示词模板（最佳实践）

```
[整体风格] movie storyboard, professional cinematography, 8k, high detail, consistent character design

[SCENE-1] Wide shot of a cyberpunk city at night, neon lights reflecting on wet streets, main character (female, 20s, black leather jacket) walking towards camera, hands in pockets, determined expression, low angle shot, dramatic lighting

[SCENE-2] Medium shot of character entering a dark alley, looking over shoulder, rain pouring, backlight creating silhouette, shallow depth of field

[SCENE-3] Close-up of character's face, eyes widening as she sees something shocking, rain drops on cheek, extreme close-up on eyes
```

#### 步骤 3：执行与优化

1. 先渲染 1-2 个分镜测试风格和角色表现
2. 调整 IPAdapter 权重(0.6-0.8)优化一致性
3. 用 Prompt Iterator 批量生成所有分镜
4. 用 CR Comic Panel Templates 组合排版

### 🎨 2. 图像 → 分镜工作流（手绘线稿转分镜）

**核心逻辑**：线稿输入 → ControlNet 约束 → 风格迁移 → 分镜排版

#### 关键节点链路

```
Load Image(线稿) → Canny Preprocessor → ControlNet Model(Canny) →
KSampler(受ControlNet约束) → VAE Decode → CR Comic Panel Templates
```

#### 一致性强化技巧

1. **姿态锁定**：用 OpenPose 预处理器提取线稿中角色骨骼，确保多分镜动作连贯
2. **构图保留**：Canny 边缘检测强度设为 0.8-1.0，强制生成图贴合原始线稿布局
3. **风格统一**：在正向提示词中加入相同的风格词(如"Studio Ghibli style")

### 🎥 3. 视频 → 分镜工作流（现有视频提取关键帧）

**核心逻辑**：视频输入 → 关键帧检测 → 分镜提取 → 后处理 → 排版

#### 节点配置

```
Video Loader → comfyui_extractstoryboards(关键帧提取) →
Image Upscale(可选) → CR Comic Panel Templates(排版)
```

#### 参数设置

| 节点           | 参数                    | 说明                         |
| -------------- | ----------------------- | ---------------------------- |
| **视频加载**   | 帧率=15fps，分辨率=720p | 降低计算量，提高处理速度     |
| **关键帧提取** | 阈值=0.3，最小间隔=3 帧 | 避免相似帧过多，保留关键动作 |
| **后处理**     | 去模糊、增强对比度      | 提升分镜清晰度               |

---

## 四、高级技巧：连续叙事分镜一致性控制

### 1. In-Context LoRA 角色绑定法

1. 生成角色参考图(多角度:正面/侧面/背面)
2. 用 In-Context LoRA 节点加载参考图
3. 在每个分镜提示词中加入`(Character)`标签关联角色
4. LoRA 权重设为 0.5-0.7，平衡一致性与创造性

### 2. 镜头语言参数化

| 镜头类型          | 提示词关键词                                | 推荐分辨率      |
| ----------------- | ------------------------------------------- | --------------- |
| 全景(Wide Shot)   | wide shot, establishing shot, full scene    | 1920×1080(16:9) |
| 中景(Medium Shot) | medium shot, character from waist up        | 1080×1080(1:1)  |
| 特写(Close-up)    | close-up, facial expression, detail on eyes | 1080×1920(9:16) |
| 俯拍(Top-down)    | bird's eye view, overhead shot              | 1280×720        |

---

## 五、一键九分镜自动化工作流（进阶）

### 完整节点链路

```
Text Input(小说章节) → LLM Node(分割为9段剧情) →
Prompt Iterator(9次循环) → Banana 2 Node(图像生成) →
IPAdapter(角色一致性) → CR Comic Panel Templates(3×3网格排版) →
Preview Image(输出)
```

### 触发机制

1. 添加**Button Node**作为总控开关
2. 将所有分镜生成节点连接到 Button 的输出端
3. 点击一次按钮自动完成 9 个分镜的全部流程

---

## 六、常见问题与解决方案

| 问题             | 解决方案                                            |
| ---------------- | --------------------------------------------------- |
| 角色在分镜中变脸 | 增加 IPAdapter 权重(0.7→0.8)，使用多角度参考图      |
| 分镜间风格不一致 | 在所有提示词中加入相同的风格关键词，统一模型和 LoRA |
| 排版混乱         | 使用预定义模板(H3/V2)，调整边框厚度和间距           |
| 生成速度慢       | 降低分辨率(1024→768)，减少采样步数(20→15)           |

---

## 七、工作流模板分享

### 基础三分镜模板(JSON 片段)

```json
{
  "nodes": [
    {
      "type": "CR_ComicPanelTemplates",
      "inputs": { "template": "H3", "border_thickness": 3 }
    },
    {
      "type": "PromptIterator",
      "inputs": { "prompts": "[SCENE-1]...\n[SCENE-2]...\n[SCENE-3]..." }
    }
  ]
}
```

---

## 总结

ComfyUI 分镜工作流的核心价值在于将**创意 → 视觉 → 排版**的全流程可视化、模块化和自动化。通过掌握节点组合、一致性控制和提示词工程三大核心技能，创作者可以高效产出专业级分镜作品，大幅提升影视、漫画和动画项目的前期创作效率。

下面为你提供**可直接导入 ComfyUI 的 9 格分镜（3×3 网格）完整工作流 JSON 模板**，包含批量生成、角色一致性控制、自动排版全流程，复制后保存为 `.json` 文件导入即可使用。

## 工作流

### 一、完整 9 镜分镜工作流 JSON

<a href="/comfyui-doc/practical/json/storyboard.json" target="_blank" >下载示例文件(JSON)</a>

### 二、使用前必做配置（关键！）

1. **替换核心资源**
   - 模型：将 `CheckpointLoaderSimple` 节点的 `ckpt_name` 改为你本地的写实/漫画模型（如 `realisticVisionV51_v51VAE.safetensors`、`Counterfeit-V3.0.safetensors`）。
   - 角色参考图：将 `LoadImage` 节点的 `image` 改为你的角色参考图路径（需放在 ComfyUI `input` 文件夹），保证 9 镜角色外观一致。
   - IPAdapter 模型：`IPAdapterModelLoader` 节点的 `ipadapter_file` 改为你本地的 IPAdapter 模型（推荐 `ip-adapter-plus_sd15.safetensors`）。
2. **安装必备插件**
   需提前安装以下自定义节点，否则工作流无法运行：
   ```bash
   # 分镜排版 + 图片列表节点
   git clone https://github.com/RockOfFire/ComfyUI_Comfyroll_CustomNodes.git custom_nodes/ComfyUI_Comfyroll_CustomNodes
   # 提示词批量迭代节点
   git clone https://github.com/BizaNator/ComfyUI_PromptIterator.git custom_nodes/ComfyUI_PromptIterator
   # IPAdapter 角色一致性节点
   git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus.git custom_nodes/ComfyUI_IPAdapter_plus
   ```
3. **调整分镜提示词**
   打开 `PromptIterator` 节点，修改 `prompts` 输入框内的 9 条分镜描述，每条对应 1 个分镜，可自定义场景、动作、镜头语言（如全景/中景/特写、俯拍/仰拍等）。

### 三、核心参数优化建议

1. **角色一致性**：`IPAdapterApply` 节点的 `weight` 建议设为 `0.7-0.8`，权重过高会导致画面僵硬，过低则角色变形。
2. **画质与速度**：`KSampler` 步数设为 `25-30`，采样器用 `dpmpp_2m_sde_gpu`，兼顾速度与画质；分辨率默认 `768×768`，显存不足可改为 `640×640`。
3. **排版样式**：`CR_ComicPanelTemplates` 节点可调整 `border_thickness`（边框厚度）、`border_color`（边框颜色）、`margin`（分镜间距），适配不同风格。

### 四、工作流执行逻辑

1. `PromptIterator` 批量迭代 9 条分镜提示词，自动生成对应种子；
2. `IPAdapter` 绑定角色参考图，确保 9 个分镜角色外观、服饰统一；
3. `KSampler` 逐一生成分镜图像，传入 `CR_ImageList` 汇总；
4. `CR_ComicPanelTemplates` 自动将 9 张图拼接为 3×3 网格分镜，最终预览输出。

## 工作流添加注释和分组

以下是**添加完整注释、功能分组、节点说明**的 9 镜分镜工作流 JSON，导入后在 ComfyUI 中会自动显示分组色块与节点注释，结构更清晰，便于修改和调试。

### 带注释+分组的 9 镜分镜工作流 JSON

<a href="/comfyui-doc/practical/json/storyboard1.json" target="_blank" >下载示例文件(JSON)</a>

### 二、分组与注释说明

1. **分组逻辑**（6 大功能模块，色块区分）
   - 【1.基础模型加载】：主模型、CLIP、VAE 基础组件加载
   - 【2.全局提示词配置】：所有分镜通用的正负向基础提示词
   - 【3.分镜提示词迭代器】：9 条分镜提示词批量迭代，核心控制模块
   - 【4.角色一致性控制】：IPAdapter 绑定角色参考图，保证 9 镜角色统一
   - 【5. latent 与采样生成】：图像生成核心，分辨率、采样参数控制
   - 【6.分镜排版与输出】：9 图拼接 3×3 网格，最终预览输出
2. **节点注释**
   每个节点通过 `notes` 字段标注**核心作用、关键参数、修改要点**，无需额外文档即可快速理解每个模块的功能，新手也能精准定位修改位置（如模型路径、提示词、IPAdapter 权重、排版参数等）。
3. **使用要点**
   - 导入后可直接在 ComfyUI 中看到分组色块与节点注释，双击节点可查看详细说明
   - 需替换的关键项已在注释中标注（模型名、角色参考图、IPAdapter 模型），按本地文件修改即可
   - 分组支持拖拽调整，可根据操作习惯重新布局模块位置，不影响工作流功能
