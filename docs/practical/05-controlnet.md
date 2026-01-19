---
title: ControlNet
toc: content
order: 5
group:
  title: 实战
---

# ControlNet 文档

**版本**：v1.1（适配最新版ComfyUI与ControlNet-v1-1模型）
**适用场景**：AI绘画精准控制（ComfyUI平台）、模型开发、工作流设计
**作者**：AI绘画技术团队
**更新日期**：2026年1月

## 目录
1.  **概述**（定义、核心价值、发展历程）
2.  **核心技术原理**（架构设计、零卷积、控制信号注入机制）
3.  **安装与环境配置**（中文界面操作、预处理器、模型安装）
4.  **核心节点与参数详解**（ComfyUI中文界面）
5.  **ControlNet模型库与适用场景**（完整列表+匹配预处理器）
6.  **ComfyUI中文界面工作流实战**（单ControlNet、多ControlNet叠加）
7.  **高级技巧与优化策略**（动态强度、显存优化、模型版本选择）
8.  **常见问题与故障排除**（中文界面）
9.  **参考资料与资源链接**

---

## 一、概述

### 1.1 定义
ControlNet是由Lvmin Zhang（lllyasviel）等人于2023年在ICCV会议上提出的神经网络架构，作为**Stable Diffusion的外挂控制系统**，通过额外的条件图像（线稿、姿态、深度、分割等）实现对生成过程的**结构级精准控制**，在不改变主模型权重的前提下解决构图失控、姿态扭曲、透视错误等核心问题。

### 1.2 核心价值
1.  **无损兼容**：不修改主模型权重，可随时启用/禁用
2.  **多条件叠加**：支持同时使用多个ControlNet（如OpenPose+Depth+Lineart）
3.  **精细控制**：可设置控制强度、作用时间范围（start_percent/end_percent）
4.  **丰富生态**：社区提供30+预训练模型，覆盖边缘、姿态、深度、分割等多种控制需求
5.  **创作效率提升**：从"祈祷结果"转变为"按需求生成"，大幅减少迭代次数

### 1.3 发展历程
- 2023年3月：ControlNet-v1发布，支持Canny、OpenPose、Depth等基础控制
- 2023年7月：ControlNet-v1-1发布，模型性能提升，新增更多控制类型
- 2024年至今：支持SDXL、Flux等新一代模型，预处理器功能不断扩展

## 二、核心技术原理

### 2.1 整体架构
ControlNet在Stable Diffusion的UNet主干网络旁新增**独立控制分支**，主要包含三个核心组件：
1.  **Hint Encoder（提示编码器）**：将用户输入的控制图（如Canny边缘图）转换为多层级特征表示
2.  **Zero Convolution（零卷积层）**：作为控制分支与UNet主干的桥梁，初始权重全零，保障训练初期不破坏预训练模型知识
3.  **Residual Injection（残差注入机制）**：将控制特征逐层注入UNet对应层级，实现结构约束

### 2.2 零卷积技术（核心创新）
零卷积层是ControlNet的关键技术，其工作机制：
```python
# 零卷积实现示例（PyTorch）
class ZeroConv2d(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, 1)
        self.conv.weight.data.zero_()  # 权重初始化为零
        self.conv.bias.data.zero_()    # 偏置初始化为零
    def forward(self, x):
        return self.conv(x)
```
- **训练阶段**：零卷积层逐步学习条件信号与生成特征的映射关系
- **推理阶段**：控制分支生成的特征通过零卷积层注入UNet，引导生成结果遵循控制图结构

### 2.3 控制信号注入流程
1.  用户输入**控制图**（如线稿图片）
2.  **预处理器**（controlnet_aux）将控制图转换为标准化控制特征（如Canny边缘特征）
3.  **Hint Encoder**对控制特征进行多层级编码
4.  编码后的控制特征通过**零卷积层**与UNet对应层级特征融合
5.  融合后的特征输入UNet主干，生成遵循控制结构的图像

## 三、安装与环境配置（中文界面操作）

### 3.1 系统要求
| 组件 | 最低配置 | 推荐配置 |
|---|---|---|
| 显卡 | NVIDIA RTX 3060 12GB | NVIDIA RTX 4070Ti/4090（显存≥16GB） |
| 内存 | 16GB | 32GB |
| 系统 | Windows 10/11 或 Linux | Windows 11 |
| ComfyUI版本 | v0.2.0+ | 最新版 |
| CUDA版本 | 11.7+ | 12.1 |

### 3.2 核心组件安装

#### 3.2.1 预处理器插件安装（必选）
预处理器（comfyui_controlnet_aux）是生成控制图的核心工具

**方法1（推荐，ComfyUI Manager）**
1.  点击顶部**ComfyUI Manager**
2.  进入**安装插件**，搜索"**comfyui_controlnet_aux**"
3.  点击**安装**，完成后**重启ComfyUI**（必须重启）

**方法2（手动安装）**
```bash
# 进入ComfyUI的custom_nodes目录
cd ComfyUI/custom_nodes

# 克隆仓库
git clone https://github.com/Fannovel16/comfyui_controlnet_aux.git

# 安装依赖
cd comfyui_controlnet_aux
pip install -r requirements.txt

# 重启ComfyUI
```

#### 3.2.2 ControlNet模型安装
1.  **下载渠道**：
    - Hugging Face官方：https://huggingface.co/lllyasviel/ControlNet-v1-1
    - 国内镜像：阿里云盘、百度网盘（搜索"ControlNet-v1-1模型"）
2.  **模型类型**：
    - 基础模型：control_v11p_sd15_xxx（适配SD1.5）
    - SDXL模型：control_v11p_sdxl_xxx（适配SDXL）
    - FP16版本：后缀为`_fp16.safetensors`（显存占用减少约50%）
3.  **安装步骤**：
    - 将模型文件（后缀`.pth`或`.safetensors`）复制到`ComfyUI/models/controlnet/`
    - 重启ComfyUI，模型会自动出现在**加载ControlNet模型**节点的下拉列表中

## 四、核心节点与参数详解（ComfyUI中文界面）

在ComfyUI中使用ControlNet，必须构建**预处理器→模型加载→应用ControlNet→KSampler**的完整链路

### 4.1 预处理器节点（中文名称+核心参数）

| 预处理器 | 中文名称 | 核心参数 | 作用 | 推荐模型 |
|---|---|---|---|---|
| Canny | 边缘检测（Canny） | low_threshold=100<br>high_threshold=200 | 提取物体边缘线条 | control_v11p_sd15_canny |
| OpenPose | 姿态检测（OpenPose） | detect_hand=True<br>detect_face=True<br>resize_to_fit=True | 提取人体姿态关键点 | control_v11p_sd15_openpose |
| Depth（MiDaS） | 深度估计（MiDaS） | background=white/black/neutral | 生成空间深度图 | control_v11f1p_sd15_depth |
| Lineart | 线稿提取 | coarse/anime | 提取干净线稿 | control_v11p_sd15_lineart |
| SoftEdge（HED） | 软边缘检测 | sigma=1.0 | 提取柔和边缘 | control_v11p_sd15_softedge |
| Scribble | 涂鸦提取 | - | 生成涂鸦控制图 | control_v11p_sd15_scribble |
| Segmentation | 语义分割 | - | 生成区域分割图 | control_v11p_sd15_seg |
| Tile | 平铺检测 | - | 生成纹理平铺图 | control_v11f1e_sd15_tile |

**使用技巧**：预处理器输出可通过**图像预览**节点查看，确认效果后再连接到ControlNet

### 4.2 加载ControlNet模型节点（中文：加载ControlNet模型）

**功能**：加载指定的ControlNet权重文件（必须与预处理器匹配）

**核心参数**：
- **ControlNet模型**：下拉选择已安装的模型文件
- **模型类型**：默认**SD1.5**（SDXL模型需手动选择SDXL类型）

**输出**：**CONTROL_NET**对象，连接到**应用ControlNet**节点

### 4.3 应用ControlNet节点（中文：应用ControlNet/应用ControlNet（高级））

**功能**：将ControlNet条件与文本提示融合，生成新的条件传递给KSampler

**核心参数（中文界面）**

| 参数 | 中文名称 | 作用 | 推荐值 |
|---|---|---|---|
| positive | 正面条件 | 原始文本提示（CLIP编码输出） | - |
| negative | 负面条件 | 负面文本提示 | - |
| ControlNet模型 | ControlNet模型 | 加载的CONTROL_NET对象 | - |
| 图像 | 控制图 | 预处理器输出的控制图 | - |
| 控制强度 | control_weight | 控制程度（0-2，0=无控制） | 0.8-1.2 |
| 起始作用步数 | start_percent | 控制开始的采样百分比 | 0.0（从第一步开始） |
| 结束作用步数 | end_percent | 控制结束的采样百分比 | 1.0（全程控制） |
| 调整尺寸模式 | resize_mode | 控制图与latent尺寸不匹配时的处理 | 拉伸/填充/裁剪 |

**高级节点（应用ControlNet（高级））**
- 支持**条件融合模式**（添加/替换/相乘）
- 支持**多ControlNet叠加**（顺序连接多个应用ControlNet节点）

**关键连接**：
1.  输入：正面条件、负面条件、ControlNet模型、控制图
2.  输出：新的条件，连接到**KSampler**的**条件**输入端口（替换原始positive条件）

## 五、ControlNet模型库与适用场景（完整列表）

### 5.1 SD1.5模型库（推荐，生态最完善）

| 模型类型 | 中文名称 | 模型文件名 | 适用场景 | 预处理器 | 控制强度推荐 |
|---|---|---|---|---|---|
| Canny | 边缘控制 | control_v11p_sd15_canny | 产品设计、线稿上色 | Canny | 1.0-1.2 |
| OpenPose | 姿态控制 | control_v11p_sd15_openpose | 人物写真、动画角色 | OpenPose | 1.0-1.4 |
| Depth | 深度控制 | control_v11f1p_sd15_depth | 建筑可视化、室内设计 | MiDaS/ZoeDepth | 0.8-1.0 |
| Lineart | 线稿控制 | control_v11p_sd15_lineart | 插画创作、漫画 | Lineart | 1.0-1.2 |
| SoftEdge | 软边缘控制 | control_v11p_sd15_softedge | 水彩风格、肖像美化 | SoftEdge（HED） | 0.7-0.9 |
| Scribble | 涂鸦控制 | control_v11p_sd15_scribble | 儿童画转插画、创意涂鸦 | Scribble | 1.0-1.3 |
| Segmentation | 语义分割 | control_v11p_sd15_seg | 场景合成、区域风格迁移 | Segment Anything | 0.8-1.0 |
| Tile | 平铺控制 | control_v11f1e_sd15_tile | 图像放大、细节修复 | Tile | 0.9-1.1 |
| NormalMap | 法线控制 | control_v11p_sd15_normalbae | 3D效果、表面纹理 | NormalMap | 0.8-1.0 |
| Shuffle | 风格控制 | control_v11e_sd15_shuffle | 风格迁移、创意生成 | Shuffle | 0.6-0.8 |

### 5.2 SDXL模型库（适合高质量生成，需高显存）
- 模型文件名：control_v11p_sdxl_xxx（如control_v11p_sdxl_openpose）
- 适用场景：高分辨率（1024×1024+）、细节丰富的生成
- 显存要求：RTX 4070Ti 16GB+（推荐RTX 4090）
- 控制强度：0.7-0.9（SDXL模型对控制信号更敏感）

## 六、ComfyUI中文界面工作流实战

### 6.1 单ControlNet工作流（线稿上色，Canny）

**目标**：将线稿图片生成为水彩风格插画

**中文界面操作步骤**：
1.  **基础工作流搭建**
    - 添加**加载检查点**（选择SD1.5模型，如v1-5-pruned-emaonly）
    - 添加**CLIP文本编码**（正面：水彩风格，二次元少女，柔和色彩；负面：模糊，低质量）
    - 添加**KSampler**（步数25，采样器DPM++ 2M Karras，CFG scale 7，denoise 0.8）
    - 添加**VAE解码**和**图像预览**
2.  **ControlNet分支添加**
    - 添加**图像加载**（导入线稿图片）
    - 添加**边缘检测（Canny）**（high_threshold=180，low_threshold=100）
    - 添加**加载ControlNet模型**（选择control_v11p_sd15_canny）
    - 添加**应用ControlNet**（控制强度=1.2，start_percent=0.0，end_percent=1.0）
3.  **连接与生成**
    - 将应用ControlNet的输出条件连接到KSampler的条件输入
    - 点击**生成**，查看结果

**优化技巧**：
- 若线稿细节丢失，降低denoise值（0.7-0.8）
- 若颜色与线稿不匹配，调整提示词或增加负面提示词
- 可使用**图像预览**节点查看Canny控制图效果

### 6.2 多ControlNet叠加工作流（OpenPose+Depth）

**目标**：生成人物姿势精准且空间层次分明的场景

**关键步骤**：
1.  搭建基础工作流（同线稿上色）
2.  添加两个ControlNet分支：
    - 分支1：**姿态检测（OpenPose）** + **control_v11p_sd15_openpose**（控制强度=1.2）
    - 分支2：**深度估计（MiDaS）** + **control_v11f1p_sd15_depth**（控制强度=0.8）
3.  **多ControlNet叠加**（使用高级节点）
    - 第一个**应用ControlNet（高级）**：连接OpenPose模型和控制图，输出条件1
    - 第二个**应用ControlNet（高级）**：连接Depth模型和控制图，输入条件1，输出条件2
    - 将条件2连接到KSampler的条件输入
4.  **生成参数**：步数30，采样器DPM++ 2M Karras，CFG scale 7，denoise 0.8

**效果**：人物姿势完全符合参考图，同时场景具有自然的空间深度

## 七、高级技巧与优化策略

### 7.1 动态控制强度（调度节点）
使用**调度节点**实现ControlNet强度随采样步数变化（前期强控制保证结构，后期弱控制释放创意）

**实现步骤**：
1.  添加**调度节点**（中文：调度/关键帧）
2.  设置关键帧：step 0 → 1.2，step 15 → 0.5
3.  将调度节点的输出连接到**应用ControlNet**的**控制强度**参数
4.  生成时，ControlNet强度会自动按关键帧变化

### 7.2 显存优化（适合中低端显卡）
1.  **使用FP16模型**：下载后缀为`_fp16.safetensors`的模型（显存占用减少约50%）
2.  **启用低显存模式**：
    ```bash
    python main.py --lowvram  # 低显存模式
    # 或
    python main.py --normalvram  # 普通显存模式
    ```
3.  **分块处理**：使用**Tile VAE**和**Tile ControlNet**（适合大尺寸生成）
4.  **减少ControlNet数量**：优先使用最关键的1-2个ControlNet，避免同时使用3个以上
5.  **降低分辨率**：生成时先使用512×512，再通过**高清修复**放大

### 7.3 模型版本选择
- **SD1.5**：模型丰富、速度快、显存占用低（推荐大多数用户）
- **SDXL**：生成质量更高、细节更丰富，但速度慢、显存占用高（需要RTX 4080Ti+）
- **Flux**：最新模型，支持高分辨率，但ControlNet生态尚在完善中

## 八、常见问题与故障排除（中文界面）

| 问题 | 症状 | 可能原因 | 解决方法 |
|---|---|---|---|
| 预处理器节点不显示 | 搜索不到Canny/OpenPose等预处理器 | 未安装comfyui_controlnet_aux或未重启 | 1. 确认安装插件<br>2. 重启ComfyUI<br>3. 检查custom_nodes目录 |
| 模型加载失败 | 加载模型时提示错误，下拉列表为空 | 模型路径错误、文件损坏、版本不匹配 | 1. 确认模型放在controlnet目录<br>2. 检查文件后缀（.pth/.safetensors）<br>3. 确认模型版本与主模型匹配 |
| 控制效果不明显 | 生成图像与控制图差异大 | 模型与预处理器不匹配、控制强度低、denoise高 | 1. 确保模型与预处理器匹配<br>2. 提高控制强度（1.0-1.2）<br>3. 降低denoise值（0.7-0.8） |
| 显存溢出 | 生成时提示"CUDA out of memory" | 显存不足、模型过大、分辨率高 | 1. 使用FP16模型<br>2. 启用低显存模式<br>3. 降低分辨率（512×512）<br>4. 减少ControlNet数量 |
| 人物姿势扭曲 | 即使使用OpenPose，姿势仍不正确 | OpenPose检测失败、控制强度低 | 1. 检查OpenPose控制图（是否有完整骨架）<br>2. 启用detect_hand和detect_face<br>3. 提高控制强度（1.2-1.4） |
