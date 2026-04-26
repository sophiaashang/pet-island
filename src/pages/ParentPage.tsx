import React, { useState } from 'react'
import { ChildId, ChildProfile, Task } from '../types'

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#333',
    marginBottom: '12px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  statLabel: { color: '#666', fontSize: '14px' },
  statValue: { color: '#333', fontWeight: 600 },
  button: {
    background: '#4A90D9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
  },
}

interface Props {
  children: { yuanyuan: ChildProfile; xinbei: ChildProfile }
  onUpdateTask?: (childId: ChildId, updater: (p: ChildProfile) => ChildProfile) => void
}

export default function ParentPage({ children }: Props) {
  const [selected, setSelected] = useState<ChildId>('yuanyuan')
  const child = children[selected]
  const todayStr = new Date().toISOString().slice(0, 10)
  const completedToday = child.tasks.filter(t => t.completedToday).length

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#333', marginBottom: '16px', textAlign: 'center' }}>👨‍👩‍👧‍👦 家长管理</h1>
      
      {/* Child selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['yuanyuan', 'xinbei'] as ChildId[]).map(id => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            style={{
              ...styles.button,
              background: selected === id ? '#4A90D9' : '#ccc',
              flex: 1,
            }}
          >
            {children[id].avatar} {children[id].name}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.title}>{child.avatar} {child.name} 今日情况</div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>任务完成</span>
          <span style={styles.statValue}>{completedToday} / {child.tasks.length}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>金币余额</span>
          <span style={styles.statValue}>💰 {child.totalCoins}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>连续登录</span>
          <span style={styles.statValue}>{child.stats.currentStreak} 天</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>宠物心情</span>
          <span style={styles.statValue}>{child.pet.mood > 70 ? '😊' : child.pet.mood > 40 ? '😐' : '😢'}</span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.title}>📋 今日任务</div>
        {child.tasks.map(task => (
          <div key={task.id} style={{ ...styles.statRow, opacity: task.completedToday ? 0.5 : 1 }}>
            <span style={styles.statLabel}>{task.icon} {task.name}</span>
            <span style={{ color: task.completedToday ? '#4CAF50' : '#999' }}>
              {task.completedToday ? '✅ 完成' : '⏳ 进行中'}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.title}>🎯 里程碑进度</div>
        {Object.entries(child.milestones).map(([key, m]) => (
          <div key={key} style={styles.statRow}>
            <span style={styles.statLabel}>{key}</span>
            <span style={styles.statValue}>
              {m.completed ? '✅ 已完成' : `进行中 ${m.progress}%`}
            </span>
          </div>
        ))}
        {Object.keys(child.milestones).length === 0 && (
          <p style={{ color: '#999', fontSize: '13px' }}>暂无里程碑任务</p>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.title}>💡 使用说明</div>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>
          本游戏以信任为核心，孩子完成任务后系统自动发放奖励。<br/>
          家长可查看完成情况，无需每日手动确认。<br/>
          如需调整任务内容，请联系陆沉更新配置。
        </p>
      </div>
    </div>
  )
}