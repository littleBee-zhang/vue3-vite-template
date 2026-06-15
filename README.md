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
├── api                  # 所有后端接口请求封装，按业务模块拆分js文件
│   ├── login.js         # 登录相关接口
│   ├── role.js          # 角色权限接口
│   └── device.js        # 设备管理接口（对应你菜单）
├── assets               # 静态资源：图片、全局scss、字体、图标
│   ├── images
│   └── style
├── constant             # 全局常量配置，地址、白名单、枚举值
│   ├── address.js       # BASE_URL 基础地址
│   └── whitelist.js     # 请求白名单（token/loading/加密白名单）
├── components           # 全局可复用公共组件，自动全局注册
│   ├── Former           # 封装el-form高阶表单
│   ├── Table            # 封装el-table带分页、筛选、批量操作
│   ├── Card             # 通用卡片容器
│   ├── Dialog           # 弹窗+确认提示封装
│   └── virtualSelect    # 大数据虚拟滚动下拉框（防卡顿）
├── layout               # 页面布局外壳（侧边栏+顶部导航+主内容区）
│   ├── Sidebar.vue
│   ├── Header.vue
│   └── index.vue        # 布局总容器
├── router               # 路由配置、动态路由、守卫
│   ├── index.js
│   └── modules          # 按业务拆分路由模块（device.js、system.js）
├── store                # Pinia/Vuex 状态管理
│   ├── user.js          # 用户token、信息
│   ├── menu.js          # 菜单列表、折叠状态
│   └── dict.js          # 全局字典缓存
├── utils                # 工具函数库
│   ├── request          # axios核心请求封装（cancelAllRequest、并发队列）
│   │   ├── index.js
│   │   ├── sign.js      # 请求签名加密工具
│   │   └── whitelist.js # 白名单配置（已迁移constant也可）
│   ├── format-date.js   # 日期格式化工具
│   ├── field-mapping.js # 字典值映射渲染（后端数字→前端文字）
│   └── desensitize.js   # 新增：手机号/身份证/姓名脱敏工具
└── views                # 业务页面视图，和菜单路由一一对应
    ├── login.vue
    ├── device            # 设备模块页面
    │   ├── deviceList.vue
    │   ├── deviceLog.vue
    │   └── deviceTransfer.vue
    └── system