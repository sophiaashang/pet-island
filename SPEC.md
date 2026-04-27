# 萌宠任务岛 — 产品需求文档

> 最新版本：2026-04-27 v2
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

**元元 — 认汉字（二年级以内，30字池，每天5个）：**
- 学习模式：显示拼音（大字）+ 4个汉字表情包选项，选对才记住
- 复习模式：显示拼音 + 4个汉字选项，巩固记忆
- 艾宾浩斯复习节奏：当天→第2天→第4天→第7天→第15天→第30天
- 已掌握判断：艾宾浩斯等级达到6级（完成6次复习）
- **已知Bug（已修复）：** 复习时答对正确项后错误跳格（guardRef时机问题）

**新北 — 背PET英语单词（约100词，每天8个）：**
- 学习模式：显示英文单词 + 4个中文选项，选对才记住
- 复习模式：显示中文意思 + 4个英文单词选项
- 艾宾浩斯复习节奏同上

**数据存储：** localStorage key = `pet-island-{childId}-reviews`

---

### 2.4 AI对话系统

**配置：**
- 模型：ModelScope QwQ-32B-Preview
- API：https://api-inference.modelscope.cn/v1/chat/completions
- Token：内置于代码（`ms-e36e8a21-24af-4a9d-93f4-075418140e3f`）

**每只宠物有专属系统提示词**（角色扮演风格，3-8字回复）

---

## 三、副功能模块

### 3.1 扭蛋系统
- 单抽：300金币 | 十连：2880金币
- 保底：10抽内必出⭐⭐及以上
- 扭蛋池：棉花羊30%/磷磷龟30%/烈焰鸡20%/泡泡龙15%/月光狐4%/星际熊1%

### 3.2 商店系统
道具（食物/玩具）消耗金币购买

### 3.3 宠物做客系统
派遣宠物去对方小岛拜访，友情值+1，友情等级：🤝💚💙💜

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

**内置连接配置（代码中预填）：**
- Project URL：`https://xeutfdyzttlnkgcdxyzm.supabase.co`
- anon Key：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（已内置）

**同步逻辑：**
1. App 加载时：GET 两个孩子的最新数据，与本地合并
2. 冲突解决：比较 `_lastModified` 时间戳，5分钟内以本地为准
3. 本地变更后：防抖2秒自动 POST 上传
4. 同步入口：游戏内 → 家长入口 → ☁️ 数据同步

---

## 五、代码变更记录

### v2 (2026-04-27)
**Bug修复：**
- [x] 学习模块复习跳过bug：`guardRef.current = true` 必须在 `setTimeout` 之前设置，防止自动跳过 effect 在等待期间误触发
- [x] 家长页孩子数据不显示（childId 判断错误）

**代码备份：** `backups/App_backup_20260427_*.tsx`、`backups/LearnPage_backup_20260427_*.tsx`

### v1 (2026-04-27)
- [x] 初始版本：任务系统、宠物系统、学习系统、AI对话、扭蛋、Supabase云同步

---

## 六、技术架构

### 6.1 localStorage Key 映射
| Key | 内容 |
|-----|------|
| `pet-sel` | 当前选中的孩子 ID（yuan/xin） |
| `pet-yuan` | 元元完整游戏数据（JSON） |
| `pet-xin` | 新北完整游戏数据（JSON） |
| `pet-island-{childId}-reviews` | 艾宾浩斯复习记录 |
| `sync-url` | Supabase 项目 URL（默认已填） |
| `sync-anon-key` | Supabase anon Key（默认已填） |

### 6.2 ChildProfile 类型（核心类型）
```typescript
interface ChildProfile {
  coins: number           // 金币余额
  pet: Pet              // 主宠物
  pets: Pet[]           // 主宠物列表
  petsCollection: Pet[]  // 扭蛋收藏宠物
  tasks: Task[]         // 今日任务列表
  inventory: Item[]     // 背包道具
  roomTheme: 'grass' | 'wood' | 'cloud'
  visitingPet: { pet: Pet; fromChildId: ChildId } | null
  reviews: Record<string, ReviewEntry>  // 艾宾浩斯记录
  todayNew: number       // 今日新学数量
  _date: string          // 本地存储日期
  _lastModified?: number // 云端冲突解决时间戳
}
```

---

## 七、后续优化建议

1. 📊 学习进度可视化 — 艾宾浩斯日历视图
2. 🎬 宠物动画 — CSS动画让宠物更生动
3. 🔔 家长推送通知 — 微信/邮件通知
4. 💾 数据导出/导入 — JSON手动备份
5. 🏆 宠物成就系统
6. 📰 学习日报推送
7. 🔄 强制刷新同步按钮
8. 📖 宠物图鉴页
