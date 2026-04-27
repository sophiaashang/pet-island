import React, { useState, useRef } from 'react'
import { ChildProfile, ChildId } from '../types'
import { loadProfile, saveProfile } from '../App'

export const SYNC_URL_KEY = 'sync-url'
export const SYNC_ANON_KEY = 'sync-anon-key'
const LAST_SYNC_KEY = 'sync-lastTime'
export const DEBOUNCE_MS = 2000

// 默认内置同步配置
const DEFAULT_URL = 'https://xeutfdyzttlnkgcdxyzm.supabase.co'
const DEFAULT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldXRmZHl6dHRsbmtnY2R4eXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzE1NzYsImV4cCI6MjA5MTc0NzU3Nn0._fp8_LQbl_ow3k1MlAsfyIsNB6Ivrjn67Tb0ks0l8D0'

function getConfig() {
  return {
    url: localStorage.getItem(SYNC_URL_KEY) || DEFAULT_URL,
    anon: localStorage.getItem(SYNC_ANON_KEY) || DEFAULT_ANON,
  }
}

interface Props {
  children: { yuanyuan: ChildProfile; xinbei: ChildProfile }
}

// Test connection to Supabase
async function testConnection(syncUrl: string, anonKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${syncUrl.replace(/\/$/, '')}/rest/v1/pet_island_data?select=child_id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      }
    })
    return res.ok
  } catch {
    return false
  }
}

// Sync a child profile to Supabase (upsert via POST with Prefer: resolution=merge-duplicates)
export async function syncToCloud(childId: ChildId, data: ChildProfile): Promise<void> {
  if (!navigator.onLine) return
  const { url, anon } = getConfig()
  try {
    const payload = { child_id: childId, data: { ...data, _lastModified: Date.now() } }
    await fetch(`${url.replace(/\/$/, '')}/rest/v1/pet_island_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anon,
        'Authorization': `Bearer ${anon}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    // Offline or unreachable — silently ignore
  }
}

// Fetch a child profile from Supabase
export async function fetchFromCloud(childId: ChildId): Promise<Partial<ChildProfile> | null> {
  const { url, anon } = getConfig()
  try {
    const res = await fetch(
      `${url.replace(/\/$/, '')}/rest/v1/pet_island_data?child_id=eq.${childId}&select=data`,
      {
        method: 'GET',
        headers: {
          'apikey': anon,
          'Authorization': `Bearer ${anon}`,
          'Accept': 'application/json',
        }
      }
    )
    if (!res.ok) return null
    const arr = await res.json()
    if (!Array.isArray(arr) || arr.length === 0) return null
    return arr[0].data as Partial<ChildProfile>
  } catch {
    return null
  }
}

export default function SyncSettings({ children }: Props) {
  const [syncUrl, setSyncUrl] = useState(() => localStorage.getItem(SYNC_URL_KEY) || DEFAULT_URL)
  const [anonKey, setAnonKey] = useState(() => localStorage.getItem(SYNC_ANON_KEY) || DEFAULT_ANON)
  const [lastSync, setLastSync] = useState(() => localStorage.getItem(LAST_SYNC_KEY) || '')
  const [status, setStatus] = useState<'idle' | 'testing' | 'syncing' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    localStorage.setItem(SYNC_URL_KEY, syncUrl)
    localStorage.setItem(SYNC_ANON_KEY, anonKey)
    setMessage('✅ 设置已保存！')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleTest = async () => {
    if (!syncUrl) { setMessage('⚠️ 请先输入项目URL'); return }
    setStatus('testing')
    setMessage('正在测试连接…')
    const ok = await testConnection(syncUrl, anonKey || 'dummy')
    setStatus(ok ? 'ok' : 'error')
    setMessage(ok ? '✅ 连接成功！' : '❌ 连接失败，请检查URL')
  }

  const handleSyncNow = async () => {
    if (!syncUrl) { setMessage('⚠️ 请先配置设置'); return }
    setStatus('syncing')
    setMessage('正在同步…')
    try {
      await syncToCloud('yuanyuan', children.yuanyuan)
      await syncToCloud('xinbei', children.xinbei)
      const now = new Date().toLocaleString('zh-CN')
      localStorage.setItem(LAST_SYNC_KEY, now)
      setLastSync(now)
      setStatus('ok')
      setMessage('✅ 同步完成！')
    } catch {
      setStatus('error')
      setMessage('❌ 同步失败')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const getStatusDot = () => {
    if (!localStorage.getItem(SYNC_URL_KEY)) return <span style={{ color: '#ccc' }}>⚪ 未配置</span>
    if (status === 'ok') return <span style={{ color: '#4CAF50' }}>🟢 已连接</span>
    if (status === 'error') return <span style={{ color: '#f44336' }}>🔴 连接失败</span>
    return <span style={{ color: '#aaa' }}>⚪ 待测试</span>
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 12px rgba(102,126,234,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>☁️</span>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>数据同步</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '4px 12px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {isOpen ? '收起 ▲' : '展开 ▼'}
        </button>
      </div>

      {isOpen && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px' }}>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px', background: '#f0f4ff', borderRadius: '8px', padding: '8px 10px', lineHeight: 1.6 }}>
            ☁️ 填入同一URL+Key，三个设备数据自动同步
          </p>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', display: 'block', marginBottom: '4px' }}>
              Supabase 项目 URL
            </label>
            <input
              type="url"
              value={syncUrl}
              onChange={e => setSyncUrl(e.target.value)}
              placeholder="https://xxxx.supabase.co"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', display: 'block', marginBottom: '4px' }}>
              anon public key
            </label>
            <input
              type="text"
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              placeholder="eyJhbGc……（在Supabase设置里找）"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                background: '#4A90D9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              💾 保存
            </button>
            <button
              onClick={handleTest}
              disabled={status === 'testing'}
              style={{
                flex: 1,
                background: '#aaa',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {status === 'testing' ? '⏳ 测试中…' : '🔗 测试连接'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', color: '#888' }}>
              {getStatusDot()}
            </div>
            {lastSync && (
              <div style={{ fontSize: '12px', color: '#aaa' }}>
                上次同步：{lastSync}
              </div>
            )}
          </div>

          <button
            onClick={handleSyncNow}
            disabled={status === 'syncing'}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {status === 'syncing' ? '⏳ 同步中…' : '🔄 立即同步'}
          </button>

          {message && (
            <div style={{
              marginTop: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              background: message.startsWith('✅') ? '#e8f5e9' : message.startsWith('❌') ? '#ffebee' : '#fff8e1',
              color: message.startsWith('✅') ? '#2e7d32' : message.startsWith('❌') ? '#c62828' : '#f57f17',
              textAlign: 'center',
            }}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  )
}