# 萌宠任务岛 — 产品需求文档

> 最新版本：2026-04-27
> GitHub：https://github.com/sophiaashang/mengchong-island

---

## 一、概述

**面向用户：** 两个男孩 — 元元（5岁，大班）、新北（11岁，5年级）
**游戏类型：** 任务管理 + 宠物养成 + 学习助手 + 云端同步
**核心体验：** 可爱、有成就感、零外部依赖、完全离线可玩，云端同步可选

**技术栈：**
- 前端：React + TypeScript + Vite + TailwindCSS
- 部署：静态网页，支持所有现代浏览器
- 云同步：Supabase（REST API，PostgreSQL + RLS）
- AI对话：ModelScope API（QwQ-32B-Preview 模型）

---

## 二、四大核心模块

### 2.1 每日任务系统

**元元（5岁）任务：**
| 任务 | 图标 | 金币奖励 |
|------|------|----------|
| 英语作业（小i英语/绘本） | 📖 | 15 |
| 英语小书跟读 | 🎤 | 10 |
| 高斯数学每日一练 | 🔢 | 15 |
| 钢琴练习（哈农/小汤3） | 🎹 | 20 |
| 跳绳200次 | 🪁 | 20 |

**新北（11岁）任务：**
| 任务 | 图标 | 金币奖励 |
|------|------|----------|
| 校内语数英作业 | 📚 | 15 |
| 英语作业 | 📖 | 10 |
| 高斯数学每日一练 | 🔢 | 15 |
| 预复习 | 📝 | 10 |
| 钢琴练习1小时 | 🎹 | 20 |
| 体育运动 | 🏃 | 15 |

**机制：**
- 任务每天凌晨（或首次打开游戏时）自动检测日期，自动重置
- 每完成一个任务 → 获得金币 + 宠物心情+2
- 进度条实时显示今日完成比例

---

### 2.2 宠物养成系统

**8种宠物：**
| 宠物 | 类型 | 稀有度 | 特征 |
|------|------|--------|------|
| 🐤 小黄鸭 | DUCKY | ⭐ | 元元默认宠物，嘎嘎嘎撒娇型 |
| 🐺 小灰狼 | WOLFY | ⭐ | 新北默认宠物，酷酷简洁型 |
| 🐑 棉花羊 | MEIMI | ⭐⭐ | 迷糊爱睡觉，软糯型 |
| 🐢 磷磷龟 | LINGLING | ⭐⭐ | 慢慢吞吞正能量型 |
| 🐔 烈焰鸡 | FIRE | ⭐⭐⭐ | 骄傲搞笑咯咯型 |
| 🐉 泡泡龙 | BUBBLE | ⭐⭐⭐ | 古灵精怪许愿型 |
| 🦊 月光狐 | MOONFOX | ⭐⭐⭐⭐ | 神秘优雅诗意型 |
| 🧸 星际熊 | STARCUB | ⭐⭐⭐⭐ | 宇宙聪明睿智型 |

**宠物数值：**
- 饥饿值（hunger）：0-100，影响宠物活力
- 心情值（mood）：0-100，互动获得奖励
- 友情值（friendship）：做客时积累

**互动行为（首页直接按钮）：**
| 行为 | 图标 | 效果 | 物品消耗 |
|------|------|------|----------|
| 喂食 | 🍖 | 饥饿+食物效果，心情+5 | 食物道具（-1） |
| 洗澡 | 🛁 | 饥饿=100，心情+5 | 免费 |
| 玩耍 | 🎾 | 心情+10 | 玩具道具（-1） |
| 抚摸 | 🤚 | 心情+5，30分钟冷却 | 免费 |

**房间主题（3种）：**
- 🌿 草地（绿色渐变）
- 🏠 木地板（棕色渐变）
- ☁️ 云朵（蓝白渐变）

---

### 2.3 学习模块（艾宾浩斯记忆）

**元元 — 认汉字（二年级以内）：**
- 每天5个新汉字
- 学习模式：显示拼音（大字）+ 4个汉字选项，选对才记住
- 复习模式：显示拼音 + 4个汉字选项，巩固记忆
- 艾宾浩斯复习节奏：当天→第2天→第4天→第7天→第15天→第30天
- 已掌握判断：艾宾浩斯等级达到6级（完成6次复习）

**新北 — 背PET英语单词：**
- 每天8个新单词
- 学习模式：显示英文单词 + 4个英文选项，选对才记住
- 复习模式：显示中文意思 + 4个英文选项
- 艾宾浩斯复习节奏同上
- 内置约400个PET核心词汇

**数据存储：** localStorage key = `pet-island-{childId}-reviews`，对象格式 `{[word]: ISO日期字符串}`

---

### 2.4 AI对话系统

**配置：**
- 模型：ModelScope QwQ-32B-Preview
- API：https://api-inference.modelscope.cn/v1/chat/completions
- Token：内置于代码（`ms-e36e8a21-24af-4a9d-93f4-075418140e3f`）
- 每只宠物有专属系统提示词（角色扮演风格）

**宠物系统提示词示例：**
- 小黄鸭：3岁傻小鸭，嘎嘎嘎，撒娇任性，回复3-8字
- 小灰狼：酷酷小学生，装酷，2-6字，用"……"开头
- 烈焰鸡：骄傲臭屁公鸡，咯咯咯，很搞笑

**交互：**
- 状态指示：🟢已连接 / 🟡思考中 / 🟠离线模式
- 思考动画：AI回复前显示"🤖正在思考..."
- 失败提示：网络错误时显示橙色警告并使用默认台词

---

## 三、副功能模块

### 3.1 扭蛋系统
- 单抽：300金币
- 十连：2880金币
- 保底：10抽内必出⭐⭐及以上
- 扭蛋池权重：棉花羊30% / 磷磷龟30% / 烈焰鸡20% / 泡泡龙15% / 月光狐4% / 星际熊1%

### 3.2 商店系统
道具（食物/玩具）消耗金币购买：
| 道具 | 价格 | 效果 |
|------|------|------|
| 面包 🥖 | 10 | 饱腹+30 |
| 小鱼干 🐟 | 20 | 饱腹+50 |
| 胡萝卜 🥕 | 12 | 饱腹+35 |
| 骨头 🦴 | 15 | 饱腹+40 |
| 皮球 ⚽ | 25 | 玩耍道具 |
| 飞盘 🥏 | 30 | 玩耍道具 |

### 3.3 宠物做客系统
- 派遣自己的宠物去对方小岛拜访
- 对方设备联网打开游戏时自动收到通知
- 做客时互动：喂食/玩耍/抚摸 → 双方友情值+1
- 友情等级：🤝0-10 / 💚11-30 / 💙31-60 / 💜61-100

### 3.4 多宠物系统
- 扭蛋抽到的宠物加入宠物背包
- 首页可展示所有宠物（主宠物大图 + 其他宠物小图）
- 点击小图可切换主宠物
- 所有互动行为作用于主宠物

---

## 四、云端数据同步

**实现方式：** Supabase PostgreSQL + REST API
**数据表：** `pet_island_data`
```sql
create table pet_island_data (
  child_id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);
-- RLS: 关闭（匿名可写）
```

**内置连接配置（代码中预填，无需用户操作）：**
- Project URL：`https://xeutfdyzttlnkgcdxyzm.supabase.co`
- anon Key：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（已内置于 SyncSettings.tsx）

**同步逻辑：**
1. App 加载时：GET 两个孩子的最新数据，与本地合并
2. 冲突解决：比较 `_lastModified` 时间戳，5分钟内以本地为准（设备时钟误差容许）
3. 本地变更后：防抖2秒自动 POST 上传
4. 做客状态：同样通过 Supabase 同步（`visiting-notif-{childId}` 标记）

**同步入口：** 游戏内 → 家长入口 → ☁️ 数据同步（已预填URL，直接点"立即同步"）

---

## 五、技术架构

### 5.1 项目结构
```
pet-game/
├── src/
│   ├── App.tsx              # 主应用：路由、状态管理、云同步
│   ├── types.ts              # TypeScript类型定义
│   ├── main.tsx             # 入口
│   ├── pages/
│   │   ├── HomePage.tsx     # 孩子选择页
│   │   ├── ChildIsland.tsx  # 主游戏页（Tab导航）
│   │   └── ParentPage.tsx   # 家长页（双孩子数据视图）
│   ├── components/
│   │   ├── PetImage.tsx     # 宠物图片组件（CDN URL）
│   │   ├── GachaPage.tsx    # 扭蛋系统
│   │   ├── ShopPage.tsx     # 商店系统
│   │   ├── InventoryPage.tsx # 背包系统
│   │   ├── LearnPage.tsx    # 学习系统（艾宾浩斯）
│   │   ├── PetVisitingPage.tsx  # 宠物做客
│   │   ├── ChatDialog.tsx    # AI对话弹窗
│   │   ├── SyncSettings.tsx # 云同步配置
│   │   └── PetSVGs.tsx      # 宠物SVG（备用）
│   ├── gachaData.ts          # 扭蛋概率数据
│   └── index.css            # 全局样式
├── dist/                     # 编译输出目录
├── backups/                  # 代码备份
├── SPEC.md                  # 本文档
├── SYNC_SETUP.md           # 同步设置指南
├── worker.js                # Cloudflare Worker（可选）
└── wrangler.toml           # Worker配置
```

### 5.2 localStorage Key 映射
| Key | 内容 |
|-----|------|
| `pet-sel` | 当前选中的孩子 ID（yuan/xin） |
| `pet-yuan` | 元元完整游戏数据（JSON） |
| `pet-xin` | 新北完整游戏数据（JSON） |
| `pet-island-{childId}-reviews` | 艾宾浩斯复习记录 |
| `sync-url` | Supabase 项目 URL（默认已填） |
| `sync-anon-key` | Supabase anon Key（默认已填） |
| `visiting-notif-{childId}` | 做客通知标记 |
| `visit-history-{childId}` | 做客历史记录 |

### 5.3 ChildProfile 类型
```typescript
interface ChildProfile {
  coins: number           // 金币余额
  pet: Pet               // 主宠物
  pets: Pet[]            // 主宠物列表（含主宠物）
  petsCollection: Pet[]   // 扭蛋获得的收藏宠物
  tasks: Task[]          // 今日任务列表
  inventory: Item[]      // 背包道具
  roomTheme: 'grass' | 'wood' | 'cloud'
  visitingPet: { pet: Pet; fromChildId: ChildId } | null
  words: string[]        // 已学汉字/单词列表
  reviews: Record<string, ReviewEntry>  // 艾宾浩斯记录
  todayNew: number       // 今日新学数量
  _date: string          // 本地存储日期（用于任务重置判断）
  _lastModified?: number // 时间戳（用于云端冲突解决）
}
```

### 5.4 已知问题与限制
- [x] 复习跳两格bug（已修复，使用 `reviewJustAdvanced` ref 守卫）
- [x] 学习卡片直接给答案（已修复，改为多选模式）
- [x] 家长页孩子数据不显示（已修复，childId 判断修正）
- [x] 云端同步写入权限（已修复，Supabase RLS 策略已配置）
- [x] AI 对话模型选错（已修复，改用 QwQ-32B-Preview）
- [ ] 设备时钟差异可能导致云同步冲突（已知，5分钟容差）

---

## 六、后续优化建议（待实施）

1. **学习进度可视化** — 艾宾浩斯日历视图，已掌握/待复习一目了然
2. **宠物动画增强** — Lottie动画或CSS动画让宠物更生动
3. **家长推送通知** — 孩子完成任务时微信/邮件通知家长
4. **数据导出/导入** — JSON文件手动备份（离线场景）
5. **宠物成就系统** — 完成特定任务解锁称号
6. **学习日报** — 每日学习情况汇总推送给家长
7. **强制刷新按钮** — 同步面板加手动刷新
8. **宠物图鉴** — 收集全部宠物后解锁图鉴页
