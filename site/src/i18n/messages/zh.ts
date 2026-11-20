import type { Messages } from '../types'

const messages: Messages = {
  "meta": {
    "title": "Blindfold — 遮住上下文的 AI 智能体技能",
    "headline": "遮住上下文的 AI 智能体技能",
    "description": "让 AI 智能体暂时蒙上眼睛的技能。它遮住已有的上下文，让独立的子智能体从零开始思考，找到真正新的方案。支持 Claude Code、Codex 及所有 Agent Skills 客户端。",
    "share": "知道得越多，想到的越少。Blindfold 遮住智能体已知的一切，让全新的子智能体从零开始思考。",
    "imageAlt": "蒙着眼睛的 Blindfold 吉祥物，周围浮现发光的灵感灯泡",
    "keywords": "Blindfold, AI 智能体, Agent Skills, Claude Code, Codex, 子智能体, 头脑风暴, 上下文锚定, 插件",
    "noscript": "请开启 JavaScript 以查看本页的交互内容。"
  },
  "nav": {
    "home": "Blindfold，回到顶部",
    "sections": "章节",
    "language": "语言"
  },
  "story": {
    "aria": "上下文越满，思路越窄；遮住之后，思路重新打开",
    "heroTag": [
      "知道得越多，",
      "想到的越少。"
    ],
    "heroDesc": "让 AI 智能体暂时蒙上眼睛的技能。遮住已有上下文，让独立的子智能体从零开始重新思考。",
    "cue": "向下滚动，填满上下文",
    "chapters": [
      "一个需求，可以走的方向数不胜数。",
      "读代码、听过去的尝试，对话越长，思路就越偏向一边。",
      "150k tokens。窗口才用了 15%，可无论问什么，答案都只流向已有的那一个。",
      "只留下简报，偏向一边的思路又向四面八方打开。"
    ],
    "lead": "知道得越少，\n想到的越多。"
  },
  "why": {
    "label": "为什么需要",
    "manifesto": "智能体会把已经看过的界面和代码当作锚点。对话越长，即使要求新的设计稿，也走不出起点多远。同一个模型，只要看不到已有成果，就会找到不同的路。"
  },
  "how": {
    "label": "工作方式",
    "blindzone": "蒙着眼睛进行的步骤",
    "steps": [
      {
        "name": "提取",
        "desc": "从已有工作中只提取必须遵守的需求，写成一份简短的简报。"
      },
      {
        "name": "隔离",
        "desc": "启动多个只带着简报的子智能体。读取文件被禁止。"
      },
      {
        "name": "发散",
        "desc": "每个智能体在不知道现有方案的情况下，各自设计不同的方案。"
      }
    ]
  },
  "compare": {
    "label": "对比 · 示例",
    "title": "同样的请求，不同的起点。",
    "ask": "请求",
    "prompt": "为了减少新用户流失，想重新设计引导流程",
    "withoutAria": "不用 Blindfold：三个方案都是现有三步表单的变体",
    "withAria": "使用 Blindfold：三条不同的方向",
    "mainAgent": "主智能体",
    "subagents": "子智能体 × 3 · 各自独立",
    "loaded": [
      "当前界面与代码",
      "之前的 7 版设计稿",
      "96 轮对话",
      "3 次放弃的尝试"
    ],
    "briefWhat": "只保留需求的一页纸",
    "goal": "减少注册过程中的流失，把注册完成率提升到 55% 以上。",
    "context": "设计师、开发者、产品经理共用的网页协作白板。目前注册完成率 38% · 品牌主色 #3B5BFD，文字 #111318 · Logo 是左上角的文字标志 · 收集邮箱、密码、职位 · 必须在 360px 的首屏内完成。",
    "results": "结果 · 3 个方案",
    "sameForm": "都还是三步表单",
    "blindResults": "彼此看不到对方的答案",
    "verdictWithout": "三个方案都是现有三步表单的变体。",
    "verdictWith": "三条不同的方向。",
    "nudges": [
      "只换按钮颜色",
      "只润色提示文案",
      "只加进度条"
    ],
    "alts": [
      {
        "title": "对话式引导",
        "desc": "一次只问一个问题，像聊天一样收集三项信息，看起来完全不像表单。"
      },
      {
        "title": "先用再说",
        "desc": "无需注册即可直接使用产品，在第一次保存时才请用户注册。"
      },
      {
        "title": "单卡片注册",
        "desc": "把三个字段放在一张卡片上，职位用标签选择，步骤指示消失。"
      }
    ],
    "pickHint": "右侧三个方案既没看过彼此的答案，也没看过现有方案。选一个试试。",
    "pickThen": "接下来由主智能体按照现有的设计系统和代码落地。",
    "sketch": {
      "email": "邮箱",
      "password": "密码",
      "role": "职位",
      "hint": "30 秒就好！",
      "next": "下一步",
      "askEmail": "你的邮箱是？",
      "emailAnswer": "me@studio.cn",
      "askRole": "你做什么工作？",
      "roles": [
        "设计",
        "开发",
        "产品",
        "其他"
      ],
      "saveToSignUp": "注册后即可保存",
      "quickSignUp": "10 秒注册",
      "start": "开始使用"
    }
  },
  "start": {
    "label": "开始使用",
    "copyFail": "请手动选择复制",
    "when": "当设计稿只在同一个方向上小幅变化，或者需要一个全新方向时。",
    "get": "一份需求简报，以及多个彼此独立的方案。",
    "then": "主智能体把你选中的方案整合进现有项目。"
  },
  "install": {
    "short": "安装",
    "title": "安装 Blindfold",
    "options": "其他安装方式",
    "method": "选择安装方式",
    "where": {
      "skills": "在终端中运行。",
      "claude": "在 Claude Code 中按顺序运行。",
      "codex": "在终端中按顺序运行。"
    },
    "invoke": "在智能体中使用",
    "request": "请求",
    "copy": "复制",
    "copied": "已复制"
  }
}

export default messages
