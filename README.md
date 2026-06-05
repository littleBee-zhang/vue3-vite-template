# Vue3 中后台管理系统

## 项目介绍
基于 Vue3 + Vite + Element Plus 开发的企业级中后台管理系统  
内置常用工具类、组件封装、请求封装、权限控制、字典映射、日期工具等。

## 环境要求
- Node.js >= 16.0.0
- Vite >= 5.0.0
- Vue >= 3.3.0

## 🚀 启动命令
```bash
# 安装依赖
npm install
# 开发启动
npm run dev
# 打包
npm run build
# 代码校验
npm run lint
```

## 技术栈
框架：Vue3 (Composition API)
构建：Vite
UI：Element Plus
请求：Axios
日期：Dayjs
工具：MD5 加密、签名算法、表单 / 表格 / 弹窗封装

## 目录结构
src
├── api                     # 接口请求
├── assets                  # 静态资源
├── constant                # 全局常量
├── components              # 全局公共组件
│   ├── Former              # 表单组件
│   ├── Table               # 表格组件
│   ├── Card                # 卡片组件
│   ├── Dialog              # 弹窗 + Confirm
│   └── virtualSelect       # 增强下拉框（虚拟下拉框）
├── layout                  # 路由渲染
├── router                  # 路由
├── store                   # 状态管理
├── utils                   # 工具函数
│   ├── request             # 请求封装
│   ├── request/sign.js     # 签名工具
│   ├── format-date         # 日期格式化
│   └── field-mapping       # 字典映射（大数据优化）
└── views                   # 业务页面