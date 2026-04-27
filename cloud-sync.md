# 萌宠任务岛 - 云端同步设置

## 部署 Cloudflare Worker（免费，需要 cloudflare.com 账号）

1. 登录 https://dash.cloudflare.com
2. 创建 Workers & Pages → 创建 Worker → 随便起名如 pet-sync → 部署
3. 在 Worker 编辑页面，把 `wrangler.toml` 和 `worker.js` 的内容粘贴进去（这两个文件在项目根目录）
4. 保存并部署
5. 在 Worker 设置 → 环境变量，添加 `CLOUDFLARE_ACCOUNT_ID`（你的 Cloudflare Account ID，在账户概览里复制）
6. 在 Workers & Pages → 管理 → 你的 Worker → 设置 → KV 命名空间 → 创建命名空间，名称填 `pet-island-data`
7. 在 Worker 设置 → 绑定 → 添加绑定，变量名称填 `DATA`，KV 命名空间选 `pet-island-data`
8. 部署后，记下 Worker URL（如 `pet-sync.xxx.workers.dev`）

## 在游戏里配置同步
1. 打开游戏 → 左上角"👨‍👩‍👧"家长入口
2. 点"☁️ 数据同步"
3. 填入 Worker URL，点"保存"
4. 三个设备填同一个 URL，数据自动同步！
