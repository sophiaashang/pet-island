# 萌宠任务岛 · 数据同步设置

## 第一步：创建数据表（ Supabase 数据库）

1. 打开 https://xeutfdyzttlnkgcdxyzm.supabase.co/project/dashboard
2. 左侧菜单 → **SQL Editor**（底部）
3. 粘贴以下 SQL，按 **Run** 执行：

```sql
create table if not exists pet_island_data (
  child_id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table pet_island_data enable row level security;

create policy "Allow all read" on pet_island_data for select using (true);
create policy "Allow all write" on pet_island_data for all using (true);
```

4. 看到 "Success" 就表示好了 ✅

## 第二步：三个设备填同一个地址
游戏里 → 👤 我的 → ☁️ 数据同步 → 填入：
`https://xeutfdyzttlnkgcdxyzm.supabase.co`

然后点「同步」按钮，3个设备数据就互通了！