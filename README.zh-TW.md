# JSONL 時間軸視覺化工具

[English](./README.md) | **繁體中文** | [简体中文](./README.zh-CN.md)

一個基於 React 的網頁應用程式，用於視覺化和分析來自 Claude 對話的 JSONL 日誌檔案。這個工具提供直覺的時間軸介面，讓您可以探索使用者與 AI 助理之間的對話，包括工具使用和回應。

## 功能特色

- 📊 **互動式時間軸檢視**：以左右分離的方式呈現本地端與伺服器端操作的對話視覺化
- 🔍 **搜尋功能**：在所有事件中進行全文搜尋
- 🌏 **多語言支援**：自動偵測瀏覽器語言（繁體中文、簡體中文、英文）
- 🎨 **深色模式支援**：可在淺色和深色主題之間切換
- 📁 **多種匯出格式**：匯出為 Markdown、HTML 或 JSONL
- 🔧 **工具識別**：自動識別並分類本地端與伺服器端工具
- 🔗 **智慧連結呈現**：網頁搜尋結果顯示標題和可點擊的連結
- 📱 **響應式設計**：支援桌面和行動裝置

## 安裝說明

### 系統需求

- Node.js 18.0 或更高版本
- npm 或 yarn 套件管理器

### 設定步驟

1. 複製儲存庫：
```bash
git clone https://github.com/julung/jsonl-visualizer.git
cd jsonl-visualizer
```

2. 安裝相依套件：
```bash
npm install
```

3. 啟動開發伺服器：
```bash
npm run dev
```

4. 開啟瀏覽器並前往：
```
http://localhost:5173
```

## 線上版本

您也可以直接使用部署在 GitHub Pages 的線上版本：
[https://julung.github.io/jsonl-visualizer/](https://julung.github.io/jsonl-visualizer/)

## 正式環境建置

建立正式環境版本：

```bash
npm run build
```

建置完成的檔案會在 `dist` 目錄中。

預覽正式環境版本：
```bash
npm run preview
```

部署至 GitHub Pages：
```bash
npm run deploy
```

## 技術架構

- **React 18** - UI 框架
- **TypeScript** - 型別安全
- **Vite** - 建置工具和開發伺服器
- **Tailwind CSS 3** - 樣式設計
- **Lucide React** - 圖示庫
- **date-fns** - 日期格式化
- **i18next** - 國際化支援

## 專案結構

```
jsonl-visualizer/
├── src/
│   ├── components/
│   │   ├── Timeline.tsx       # 主要時間軸元件
│   │   ├── TimelineSimple.tsx # 簡化的時間軸檢視
│   │   └── EventCard.tsx      # 事件顯示元件
│   ├── utils/
│   │   ├── parser.ts          # JSONL 解析邏輯
│   │   └── exporter.ts        # 匯出功能
│   ├── config/
│   │   └── toolConfig.ts      # 工具位置設定
│   ├── types/
│   │   └── timeline.ts        # TypeScript 定義
│   ├── locales/              # 多語言翻譯檔案
│   │   ├── en.json           # 英文
│   │   ├── zh-TW.json        # 繁體中文
│   │   └── zh-CN.json        # 簡體中文
│   ├── i18n.ts               # 國際化設定
│   └── App.tsx               # 主應用程式元件
├── public/                   # 靜態資源
└── package.json             # 專案相依套件
```

## 瀏覽器支援

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 貢獻

歡迎貢獻！請隨時提交 issue 或 pull request。

## 聯絡方式

如有問題或需要支援，請在 GitHub 上開啟 issue。