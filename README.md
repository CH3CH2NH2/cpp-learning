# C++ 学习网站 🚀

一个带 AI 助教的 C++ 结构化学习平台。

## 功能

- 📖 **结构化知识树** — 从 C++ 基础教程解析出 8 大章节、47 个小节
- 💬 **AI 对话助教** — 随时提问，基于 DeepSeek API 的流式对话
- 🔍 **AI 代码分析器** — 粘贴 C++ 代码，AI 自动分析 Bug、风格和改进建议
- 📝 **AI 智能测验** — 根据当前知识点自动生成选择题，自适应难度

## 快速开始

### 前置要求

- Node.js >= 18
- DeepSeek API Key（[申请地址](https://platform.deepseek.com/)）

### 安装

```bash
# 1. 安装依赖
cd backend
npm install

# 2. 配置 API Key
# 方式 A：复制 .env.example 为 .env 并填入 Key
cp .env.example .env
# 方式 B：直接设置环境变量
# export DEEPSEEK_API_KEY=sk-your-key-here

# 3. 解析知识点数据
node ../scripts/parse-markdown.js

# 4. 启动
npm start
```

浏览器打开 http://localhost:3000

## 项目结构

```
d:/cpp-learning/
├── backend/                    # Node.js 后端
│   ├── server.js              # Express 主入口
│   ├── routes/                # API 路由
│   │   ├── chat.js           # AI 对话
│   │   ├── analyze.js        # 代码分析
│   │   └── quiz.js           # 智能测验
│   ├── services/
│   │   └── deepseek.js       # DeepSeek API 封装
│   └── data/
│       └── knowledge.json    # 结构化知识点
├── frontend/                   # 前端页面
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── app.js
│       └── components/
├── scripts/
│   └── parse-markdown.js     # Markdown 解析器
└── README.md
```

## 技术栈

- **前端**: 纯 HTML + CSS + JavaScript（零构建）
- **后端**: Node.js + Express
- **AI**: DeepSeek API（OpenAI 兼容接口）
- **内容**: Markdown → 结构化 JSON
