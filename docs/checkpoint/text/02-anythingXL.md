---
title: 二次元
toc: content
order: 2
group: 
  title: 动漫
---

# AnythingXL_v50.safetensors
你需要这份二次元模型的更全面实用指南，我将在之前核心注释的基础上，重点补充**适用场景、推荐参数配置、高效触发词与负面提示词**，形成可直接落地使用的完整手册：

## 一、文件核心身份与用途（回顾精简）
`AnythingXL_v50.safetensors` 是针对 **Stable Diffusion XL（SDXL）架构** 训练的成熟日系二次元预训练模型，专注于生成高质量动漫、萌系角色、唯美插画，修复了前代版本的手部失真、面部比例失衡问题，支持高分辨率输出，是二次元AI创作的主流选择之一，存储格式为安全高效的`.safetensors`。

## 二、核心适用场景（精准匹配二次元创作需求）
该模型的风格稳定性和细节表现力，决定了其核心适用场景集中在**日系二次元相关创作**，具体可分为4大类，覆盖不同创作需求：
1.  **日系动漫角色立绘创作**
    -  适用场景：单人/多人角色人设图、游戏二次元角色原画、虚拟主播形象设计、同人角色立绘。
    -  核心优势：面部精致度高、萌系特征突出、服饰纹理还原细腻，能够精准呈现二次元角色的发型、妆容、配饰细节，生成的立绘可直接用于二次修改、投稿或商用（需遵守版权规范）。
    -  创作示例：校园少女校服立绘、古风仙侠角色形象、机甲少女人设图。
2.  **二次元唯美插画/漫画内页创作**
    -  适用场景：全场景唯美插画、漫画分镜内页、轻小说封面插图、二次元壁纸制作。
    -  核心优势：光影过渡自然、色彩鲜艳通透、场景氛围营造到位，支持复杂背景的还原，能够满足插画师的创作需求，大幅提升绘图效率。
    -  创作示例：樱花树下的少女插画、夜晚星空下的奇幻场景、校园日常漫画内页。
3.  **萌系Q版角色与文创周边设计**
    -  适用场景：Q版角色表情包、文创产品图案（钥匙扣、海报、笔记本）、自媒体二次元配图。
    -  核心优势：萌感表现力拉满、线条流畅简洁、色彩明快活泼，生成的Q版形象无需过多修改即可用于周边制作，降低文创设计门槛。
    -  创作示例：Q版二次元角色表情包、卡通风格文创海报、笔记本封面图案。
4.  **二次元风格概念设计**
    -  适用场景：二次元奇幻场景概念图、机甲/魔物角色设计、古风二次元场景布局。
    -  核心优势：细节丰富度高、风格一致性强，能够精准还原提示词中的复杂元素，为创作者提供灵感原型，辅助后续精细化设计。
    -  创作示例：二次元奇幻森林场景、未来机甲城市、古风仙侠宫殿布局。

## 三、推荐参数配置（以主流工具为例，兼顾稳定与效果）
### 核心适配工具：最新版 Automatic1111 WebUI（支持SDXL）、ComfyUI
### （一）Automatic1111 WebUI 推荐配置（优先推荐，操作便捷）
#### 1.  基础必配参数（保障核心画面质量，不可随意偏离）
| 参数名称 | 推荐取值 | 取值原因与说明 |
|----------|----------|----------------|
| 采样器（Sampler） | Euler a、DPM++ 2M Karras、DPM++ SDE Karras | 1.  Euler a：风格表现力最强，贴合二次元的灵动氛围，适合创作唯美插画；<br>2.  DPM++ 2M Karras：稳定性最优，细节保留完整，适合角色立绘、精准还原需求；<br>3.  避免使用LMS、DDIM等对SDXL支持不佳的采样器，画面易模糊。 |
| 采样步数（Steps） | 20-30步（最优25步） | 1.  少于20步：细节渲染不足，画面模糊、边缘锯齿明显；<br>2.  20-30步：平衡画质与效率，25步为黄金平衡点，既能还原完整细节，又不会过度占用显存；<br>3.  多于30步：显存消耗大幅增加，画质提升微乎其微，性价比过低。 |
| CFG Scale（提示词相关性） | 7-10（最优8） | 1.  低于7：提示词影响力弱，画面易偏离二次元风格，无法精准触发角色/场景元素；<br>2.  7-10：提示词与模型生成平衡，画面既符合预期，又保留一定创意性；<br>3.  高于10：画面过度拟合提示词，易出现色彩失真、面部崩坏、细节堆叠杂乱。 |
| 生成分辨率 | 基础分辨率：1024×1024、1280×960、960×1280 | 1.  该分辨率为SDXL架构最优基础分辨率，匹配AnythingXL_v50的训练数据，画面无拉伸变形；<br>2.  如需更大分辨率（如2048×2048），需开启「高清修复（Highres.fix）」，放大倍数1.5-2倍，避免直接拉伸导致模糊。 |
| 批次大小/批量计数 | 批次大小：1-2；批量计数：按需设置 | 1.  批次大小过大会占用大量显存，导致卡顿、显存溢出，1为最稳定选择；<br>2.  批量计数可根据需求设置，用于批量生成多张图筛选优质作品。 |

#### 2.  进阶优化参数（降低显存占用，提升画面质感，必开优化）
1.  **精度模式**：选择「FP16」（优先）或「BF16」
    -  说明：降低显存占用约50%，画面质量损失可忽略不计，兼容绝大多数中高端显卡（RTX 30系列及以上），是平衡性能与画质的最优选择。
2.  **显存优化功能**：
    -  必开：「xFormers」（大幅降低显存占用，提升加载与推理速度，无画质损失）；
    -  中端显存（12-16GB）：额外开启「Attention Slicing（显存切片）」「MedVRAM」；
    -  低端显存（8-10GB）：额外开启「LowVRAM」（牺牲少量推理速度，保障模型正常运行）。
3.  **高清修复（Highres.fix）**：
    -  开启条件：需要生成分辨率＞1024×1024时；
    -  推荐配置：放大算法选择「R-ESRGAN 4x+」「RealESRGAN_x4plus_anime_6B」（二次元专属放大算法，无锯齿，细节保留更优）；二次采样器选择「DPM++ 2M Karras」；二次步数10-15步。
4.  **VAE 配置**：加载「sd_xl_vae.safetensors」
    -  说明：模型默认VAE色彩偏灰，加载SDXL专属VAE可优化色彩饱和度与通透感，让二次元画面更鲜艳唯美，避免出现“灰蒙感”。
5.  **种子（Seed）**：
    -  随机种子（-1）：用于获取更多创意性作品，适合初期筛选；
    -  固定种子：用于基于优质作品微调参数（如提示词、CFG Scale），优化画面细节，无需重新生成全新图像。

### （二）ComfyUI 核心参数补充（适合资深创作者，可控性更强）
1.  模型加载：选择「AnythingXL_v50.safetensors」，搭配SDXL专用Clip文本编码器；
2.  采样配置：采样器选择「SDXL Karras」，步数25-30步，CFG Scale 8；
3.  分辨率：1024×1024，如需放大，添加「ESRGAN 4x」节点进行后期放大；
4.  VAE 配置：在模型加载节点后添加「Load VAE」节点，选择「sd_xl_vae.safetensors」；
5.  优化配置：开启「xFormers Attention」节点，降低显存占用，提升推理速度。

## 四、高效触发词（正面）与负面提示词（避坑）
### （一）核心触发词（正面）：按功能分类，可直接组合使用
#### 1.  风格触发词（激活模型二次元日系风格，必加核心）
```
anime style, Japanese anime, manga style, Anything style, XL anime, cute anime style, vibrant anime aesthetic
```
-  关键说明：`Anything style` 是该模型的专属风格触发词，能够精准激活Anything系列的经典二次元风格，效果远超普通`anime style`，优先加入提示词开头。

#### 2.  质量触发词（提升画面整体质感，奠定优质基础）
```
masterpiece, best quality, ultra detailed, high resolution, 8k, absurdres, top quality, highres, finely detailed, intricate details, sharp focus
```

#### 3.  细节强化触发词（针对二次元高频重点部位，提升精致度）
-  面部/眼部（二次元核心，决定角色美观度）：
  ```
  detailed eyes, beautiful eyes, large eyes, sparkling eyes, perfect face, delicate facial features, smooth skin, fair skin, soft smile, rosy cheeks
  ```
-  发型/服饰（提升角色辨识度与细节感）：
  ```
  detailed hair, intricate hairstyle, shiny hair, long flowing hair, beautiful clothes, detailed clothing, intricate fabric texture, school uniform, traditional kimono, frilled dress
  ```
-  光影/场景（营造氛围，提升画面层次感）：
  ```
  soft lighting, vibrant colors, beautiful background, detailed background, cinematic lighting, cherry blossom, night sky, starry sky, sunbeam, gentle breeze
  ```

#### 4.  角色/场景元素触发词（按需替换，贴合具体创作主题）
-  角色类型：
  ```
  1girl, solo, school girl, magical girl, vampire, samurai, cute loli, handsome boy, twin tails, short hair
  ```
-  场景类型：
  ```
  classroom, cherry blossom tree, traditional Japanese house, fantasy forest, beach, night city, library, ancient Chinese palace
  ```

#### 5.  实用提示词组合示例（可直接复制使用，快速出图）
-  示例1：日系校园少女立绘
  ```
  masterpiece, best quality, ultra detailed, 8k, anime style, Anything style, 1girl, solo, school uniform, long black twin tails, detailed eyes, beautiful eyes, soft smile, cherry blossom background, soft lighting, smooth skin, sharp focus
  ```
-  示例2：古风二次元唯美插画
  ```
  masterpiece, best quality, ultra detailed, 8k, anime style, Anything style, 1girl, solo, traditional Chinese hanfu, long silver hair, detailed eyes, flowing sleeves, ancient palace background, moonlight, soft lighting, vibrant colors, intricate fabric texture
  ```

### （二）优质负面提示词（避坑，避免画面崩坏与风格偏离）
#### 1.  通用质量避坑（避免低质画面，必加）
```
low quality, worst quality, blurry, blurry image, pixelated, low resolution, jpeg artifacts, noisy, faded, dull colors
```

#### 2.  二次元高频崩坏避坑（重点，解决手部/面部/身体比例问题）
```
bad hands, deformed hands, extra hands, missing hands, bad fingers, deformed fingers, extra fingers, missing fingers, deformed face, bad face, ugly face, distorted facial features, missing eyes, extra eyes, crossed eyes, deformed body, disproportionate body, bad anatomy, extra limbs, missing limbs, floating limbs
```

#### 3.  风格偏离/违和避坑（避免脱离日系二次元风格）
```
photorealistic, realistic, 3d, 3d render, plastic, doll, cartoonish (过度卡通，如需Q版可删除), text, watermark, signature, logo, ugly, mutilated, gross, violent
```

#### 4.  负面提示词组合示例（直接复制使用，全覆盖避坑）
```
low quality, worst quality, blurry, pixelated, bad hands, deformed hands, bad fingers, deformed fingers, deformed face, ugly face, disproportionate body, bad anatomy, photorealistic, 3d, text, watermark, signature
```

## 五、额外使用优化技巧
1.  提示词权重调整：使用`()`提升权重（如`(detailed eyes:1.2)`），`[]`降低权重（如`[blurry:0.5]`），重点强化眼部、面部等核心细节；
2.  结合ControlNet：搭配「OpenPose」控制角色姿态，「Canny」控制画面线条，「Segmentation」控制场景元素，进一步提升画面可控性；
3.  分批微调：生成优质图像后，固定种子，仅微调1-2个提示词或CFG Scale，避免大幅修改导致画面质量下降。

## 总结
1.  `AnythingXL_v50.safetensors` 主打日系二次元创作，适用立绘、插画、Q版设计等多个场景，风格稳定且细节出色；
2.  推荐参数以「25步采样、CFG=8、1024×1024分辨率、FP16精度」为核心，搭配SDXL VAE可实现最佳效果；
3.  正面提示词优先加入`Anything style`激活专属风格，负面提示词重点规避手部/面部崩坏，可直接复制示例快速出图。