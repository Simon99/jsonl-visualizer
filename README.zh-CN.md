# JSONL 时间轴可视化工具

[English](./README.md) | [繁體中文](./README.zh-TW.md) | **简体中文**

一个基于 React 的网页应用程序，用于可视化和分析来自 Claude 对话的 JSONL 日志文件。这个工具提供直观的时间轴界面，让您可以探索用户与 AI 助理之间的对话，包括工具使用和响应。

## 功能特色

- 📊 **交互式时间轴视图**：以左右分离的方式呈现本地端与服务器端操作的对话可视化
- 🔍 **搜索功能**：在所有事件中进行全文搜索
- 🌏 **多语言支持**：自动检测浏览器语言（简体中文、繁体中文、英文）
- 🎨 **深色模式支持**：可在浅色和深色主题之间切换
- 📁 **多种导出格式**：导出为 Markdown、HTML 或 JSONL
- 🔧 **工具识别**：自动识别并分类本地端与服务器端工具
- 🔗 **智能链接呈现**：网页搜索结果显示标题和可点击的链接
- 📱 **响应式设计**：支持桌面和移动设备

## 安装说明

### 系统需求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 设置步骤

1. 克隆仓库：
```bash
git clone https://github.com/julung/jsonl-visualizer.git
cd jsonl-visualizer
```

2. 安装依赖包：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 打开浏览器并前往：
```
http://localhost:5173
```

## 在线版本

您也可以直接使用部署在 GitHub Pages 的在线版本：
[https://julung.github.io/jsonl-visualizer/](https://julung.github.io/jsonl-visualizer/)

## 生产环境构建

创建生产环境版本：

```bash
npm run build
```

构建完成的文件会在 `dist` 目录中。

预览生产环境版本：
```bash
npm run preview
```

部署至 GitHub Pages：
```bash
npm run deploy
```

## 技术架构

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具和开发服务器
- **Tailwind CSS 3** - 样式设计
- **Lucide React** - 图标库
- **date-fns** - 日期格式化
- **i18next** - 国际化支持

## 项目结构

```
jsonl-visualizer/
├── src/
│   ├── components/
│   │   ├── Timeline.tsx       # 主要时间轴组件
│   │   ├── TimelineSimple.tsx # 简化的时间轴视图
│   │   └── EventCard.tsx      # 事件显示组件
│   ├── utils/
│   │   ├── parser.ts          # JSONL 解析逻辑
│   │   └── exporter.ts        # 导出功能
│   ├── config/
│   │   └── toolConfig.ts      # 工具位置配置
│   ├── types/
│   │   └── timeline.ts        # TypeScript 定义
│   ├── locales/              # 多语言翻译文件
│   │   ├── en.json           # 英文
│   │   ├── zh-TW.json        # 繁体中文
│   │   └── zh-CN.json        # 简体中文
│   ├── i18n.ts               # 国际化配置
│   └── App.tsx               # 主应用程序组件
├── public/                   # 静态资源
└── package.json             # 项目依赖包
```

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 贡献

欢迎贡献！请随时提交 issue 或 pull request。

## 联系方式

如有问题或需要支持，请在 GitHub 上开启 issue。