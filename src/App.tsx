import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChildIsland from './pages/ChildIsland'
import ParentPage from './pages/ParentPage'
import { GameState, ChildId, ChildProfile, Task } from './types'

const STORAGE_KEY = (childId: ChildId) => `pet-island-${childId}`

function makeDefaultDucky(): import('./types').Pet {
  return {
    id: 'ducky-0', name: '小黄鸭', type: 'DUCKY', nickname: '小黄鸭',
    stage: 0, hunger: 80, mood: 80, level: 0, tasksCompleted: 0,
    rarity: 'common',
    speechLines: ['嘎嘎嘎~今天的任务真棒！','元元最厉害了！小黄鸭给你比个心！','呜……好饿……能喂我吃点东西吗？','太开心啦！游来游去~'],
    currentLine: '', isNew: true,
  }
}

function makeDefaultWolfy(): import('./types').Pet {
  return {
    id: 'wolfy-0', name: '小灰狼', type: 'WOLFY', nickname: '小灰狼',
    stage: 0, hunger: 80, mood: 80, level: 0, tasksCompleted: 0,
    rarity: 'common',
    speechLines: ['……任务完成，还行。','继续保持，不错。','……肚子饿了。','你今天很努力。认可你。'],
    currentLine: '', isNew: false,
  }
}

function makeDefaultTasks(childId: ChildId): Task[] {
  if (childId === 'yuanyuan') {
    return [
      { id: 'yy-1', name: '英语作业', icon: '📖', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 15, forChild: 'yuanyuan', category: 'study', isCountable: false, completedToday: false },
      { id: 'yy-2', name: '英语小书跟读', icon: '🎤', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 10, forChild: 'yuanyuan', category: 'study', isCountable: false, completedToday: false },
      { id: 'yy-3', name: '高斯数学', icon: '🔢', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 15, forChild: 'yuanyuan', category: 'study', isCountable: false, completedToday: false },
      { id: 'yy-4', name: '钢琴练习', icon: '🎹', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 20, forChild: 'yuanyuan', category: 'piano', isCountable: false, completedToday: false },
      { id: 'yy-5', name: '跳绳200次', icon: '🪁', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 20, forChild: 'yuanyuan', category: 'sport', isCountable: true, countableTarget: 200, completedToday: false },
    ]
  }
  return [
    { id: 'xb-1', name: '校内语数英作业', icon: '📚', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 15, forChild: 'xinbei', category: 'study', isCountable: false, completedToday: false },
    { id: 'xb-2', name: '英语作业', icon: '📖', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 10, forChild: 'xinbei', category: 'study', isCountable: false, completedToday: false },
    { id: 'xb-3', name: '高斯数学', icon: '🔢', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 15, forChild: 'xinbei', category: 'study', isCountable: false, completedToday: false },
    { id: 'xb-4', name: '预复习', icon: '📝', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 10, forChild: 'xinbei', category: 'study', isCountable: false, completedToday: false },
    { id: 'xb-5', name: '钢琴练习1小时', icon: '🎹', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 20, forChild: 'xinbei', category: 'piano', isCountable: false, completedToday: false },
    { id: 'xb-6', name: '体育运动', icon: '🏃', type: 'daily', targetCount: 1, currentCount: 0, coinReward: 15, forChild: 'xinbei', category: 'sport', isCountable: false, completedToday: false },
  ]
}

function makeDefaultInventory(): import('./types').Item[] {
  return [
    { id: 'inv-bread', name: '面包', icon: '🥖', type: 'food', price: 10, effect: 30, count: 3 },
    { id: 'inv-fish', name: '小鱼干', icon: '🐟', type: 'food', price: 20, effect: 50, count: 2 },
  ]
}

function makeDefaultProfile(childId: ChildId): ChildProfile {
  return {
    name: childId === 'yuanyuan' ? '元元' : '新北',
    avatar: childId === 'yuanyuan' ? '🐥' : '🐺',
    pet: childId === 'yuanyuan' ? makeDefaultDucky() : makeDefaultWolfy(),
    tasks: makeDefaultTasks(childId),
    inventory: makeDefaultInventory(),
    petsCollection: [],
    totalCoins: childId === 'yuanyuan' ? 50 : 80,
    stats: { totalTasksCompleted: 0, totalCoinsEarned: 0, loginDays: 1, lastLoginDate: new Date().toDateString(), currentStreak: 1, friendshipEnergy: 0 },
    milestones: {},
  }
}

export function loadProfile(childId: ChildId): ChildProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY(childId))
    if (saved) {
      const parsed: ChildProfile = JSON.parse(saved)
      const today = new Date().toDateString()
      if (parsed.stats?.lastLoginDate !== today) {
        parsed.tasks = parsed.tasks.map((t: Task) => ({ ...t, completedToday: false }))
        parsed.stats.lastLoginDate = today
        parsed.stats.currentStreak = (parsed.stats.currentStreak || 0) + 1
      }
      return parsed
    }
  } catch {}
  return makeDefaultProfile(childId)
}

export function saveProfile(childId: ChildId, profile: ChildProfile) {
  try { localStorage.setItem(STORAGE_KEY(childId), JSON.stringify(profile)) } catch {}
}

interface GameContextType {
  profileMap: Record<ChildId, ChildProfile>
  currentChild: ChildId
  updateProfile: (id: string, updater: (p: ChildProfile) => ChildProfile) => void
  setCurrentChild: (childId: ChildId) => void
  refreshProfile: (childId: ChildId) => void
}

const GameContext = createContext<GameContextType>({} as any)
export const useGameContext = () => useContext(GameContext)

export default function App() {
  const [profileMap, setProfileMap] = useState<Record<ChildId, ChildProfile>>(() => ({
    yuanyuan: loadProfile('yuanyuan'),
    xinbei: loadProfile('xinbei'),
  }))
  const [currentChild, setCurrentChildState] = useState<ChildId>('yuanyuan')

  const refreshProfile = useCallback((childId: ChildId) => {
    setProfileMap(prev => ({ ...prev, [childId]: loadProfile(childId) }))
  }, [])

  const updateProfile = useCallback((id: string, updater: (p: ChildProfile) => ChildProfile) => {
    const childId = id as ChildId
    setProfileMap(prev => {
      const updated = updater(prev[childId])
      saveProfile(childId, updated)
      return { ...prev, [childId]: updated }
    })
  }, [])

  const setCurrentChild = useCallback((childId: ChildId) => {
    setCurrentChildState(childId)
    localStorage.setItem('pet-island-current', childId)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('pet-island-current')
    if (saved === 'yuanyuan' || saved === 'xinbei') setCurrentChildState(saved)
  }, [])

  return (
    <GameContext.Provider value={{ profileMap, currentChild, updateProfile, setCurrentChild, refreshProfile }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/island/:childId" element={<ChildIsland />} />
          <Route path="/parent" element={<ParentPage children={profileMap} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </GameContext.Provider>
  )
}
