import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameContext } from '../App'
import { ChildId, Item } from '../types'
import { PetSVG, getPetAnimation, getStageFromTasks } from '../components/PetSVGs'
import { GachaPage } from '../components/GachaPage'
import { ShopPage } from '../components/ShopPage'
import { InventoryPage } from '../components/InventoryPage'

const TABS = ['🏠 首页', '📋 任务', '🍖 喂食', '🎰 扭蛋', '🎒 背包']

export default function ChildIsland() {
  const { childId } = useParams<{ childId: string }>()
  const navigate = useNavigate()
  const { profileMap, updateProfile, setCurrentChild } = useGameContext()
  const id = (childId as ChildId) || 'yuanyuan'
  const profile = profileMap[id]
  const [tab, setTab] = useState(0)
  const [petSpeech, setPetSpeech] = useState('')
  const [showCoinAnim, setShowCoinAnim] = useState(false)

  if (!profile) return <div className="p-8 text-center">加载中...</div>

  const isYuanyuan = id === 'yuanyuan'
  const theme = isYuanyuan
    ? { primary: 'bg-yellow-100 border-yellow-400', accent: 'text-yellow-700', bg: 'bg-yellow-50', button: 'bg-yellow-400 hover:bg-yellow-500', buttonText: 'text-yellow-900' }
    : { primary: 'bg-blue-100 border-blue-400', accent: 'text-blue-700', bg: 'bg-blue-50', button: 'bg-blue-400 hover:bg-blue-500', buttonText: 'text-blue-900' }

  function handleCompleteTask(taskIdx: number) {
    const task = profile.tasks[taskIdx]
    if (task.completedToday) return
    updateProfile(id, p => {
      const tasks = p.tasks.map((t, i) => i === taskIdx ? { ...t, completedToday: true, currentCount: t.targetCount } : t)
      const completedCount = tasks.filter(t => t.completedToday).length
      const bonus = completedCount === tasks.length ? 50 : 0
      return {
        ...p, tasks,
        totalCoins: p.totalCoins + task.coinReward + bonus,
        pet: {
          ...p.pet,
          mood: Math.min(100, p.pet.mood + 5),
          speechLines: p.pet.speechLines,
          currentLine: p.pet.speechLines[Math.floor(Math.random() * p.pet.speechLines.length)],
        },
        stats: { ...p.stats, totalTasksCompleted: p.stats.totalTasksCompleted + 1, totalCoinsEarned: p.stats.totalCoinsEarned + task.coinReward + bonus }
      }
    })
    setShowCoinAnim(true)
    setTimeout(() => setShowCoinAnim(false), 1500)
  }

  function handleFeedPet(item: Item) {
    const idx = profile.inventory.findIndex(i => i.id === item.id)
    if (idx < 0) return
    updateProfile(id, p => ({
      ...p,
      inventory: p.inventory.map((it, i) => i === idx ? { ...it, count: Math.max(0, it.count - 1) } : it).filter(i => i.count > 0),
      pet: {
        ...p.pet,
        hunger: Math.min(100, p.pet.hunger + item.effect),
        mood: Math.min(100, p.pet.mood + 5),
        currentLine: p.pet.speechLines[Math.floor(Math.random() * p.pet.speechLines.length)],
      }
    }))
    petSpeak()
  }

  function petSpeak() {
    const lines = profile.pet.speechLines
    setPetSpeech(lines[Math.floor(Math.random() * lines.length)])
    setTimeout(() => setPetSpeech(''), 3000)
  }

  const stage = getStageFromTasks(profile.pet.tasksCompleted)
  const petAnim = getPetAnimation(profile.pet)

  const completedTasks = profile.tasks.filter(t => t.completedToday).length
  const totalTasks = profile.tasks.length
  const allDone = completedTasks === totalTasks

  return (
    <div className="min-h-screen pb-20" style={{ background: theme.bg }}>
      {/* Header */}
      <div className={`${theme.primary} border-b-4 px-4 py-3 flex items-center justify-between sticky top-0 z-20`}>
        <button onClick={() => navigate('/')} className="text-2xl">←</button>
        <div className="text-center">
          <h1 className={`text-xl font-black ${theme.accent}`}>
            {isYuanyuan ? '🐥 元元的岛屿' : '🐺 新北的小岛'}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-sm font-bold text-gray-700">🪙 {profile.totalCoins}</span>
            {showCoinAnim && <span className="text-sm animate-pop-in">✨+💰</span>}
          </div>
        </div>
        <button onClick={() => navigate('/parent')} className="text-sm">👨‍👩‍👧</button>
      </div>

      {/* Tab bar */}
      <div className="flex bg-white border-b-2 overflow-x-auto">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-bold transition-all border-b-2 ${i === tab ? theme.accent + ' border-current' : 'text-gray-400 border-transparent'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 0 && (
        <div className="p-4">
          {/* Pet Display */}
          <div className="pixel-card rounded-3xl p-6 text-center mb-4">
            <div className="relative inline-block">
              <PetSVG type={profile.pet.type} stage={stage} className={petAnim} size={120} />
              {petSpeech && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white border-2 border-gray-400 rounded-2xl px-4 py-2 text-sm font-bold shadow-lg animate-pop-in whitespace-nowrap">
                  💬 {petSpeech}
                </div>
              )}
            </div>
            <h2 className="text-xl font-black mt-2">{profile.pet.name}</h2>
            <p className="text-sm text-gray-500">等级 {profile.pet.level} · {stage === 0 ? '初级' : stage === 1 ? '中级' : '高级'}</p>
            {/* Status bars */}
            <div className="mt-3 space-y-2 max-w-xs mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold w-10">🍖</span>
                <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${profile.pet.hunger < 30 ? 'bg-red-400' : profile.pet.hunger < 60 ? 'bg-yellow-400' : 'bg-green-400'}`}
                    style={{ width: `${profile.pet.hunger}%` }} />
                </div>
                <span className="text-xs font-bold w-8">{profile.pet.hunger}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold w-10">💖</span>
                <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                  <div className="h-full bg-pink-400 rounded-full transition-all" style={{ width: `${profile.pet.mood}%` }} />
                </div>
                <span className="text-xs font-bold w-8">{profile.pet.mood}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={petSpeak} className={`${theme.button} ${theme.buttonText} px-4 py-2 rounded-2xl font-bold text-sm`}>
                💬 互动
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className="pixel-card rounded-3xl p-4">
            <h3 className="font-black text-gray-800 mb-3">📊 今日进度</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${(completedTasks / totalTasks) * 100}%` }} />
              </div>
              <span className="font-black text-green-700">{completedTasks}/{totalTasks}</span>
            </div>
            {allDone ? (
              <div className="bg-green-100 border-2 border-green-400 rounded-2xl p-3 text-center">
                <p className="font-black text-green-700 text-lg">🎉🎉🎉 太棒了！全部完成！</p>
                <p className="text-sm text-green-600">+50 bonus coins!</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">再完成 {totalTasks - completedTasks} 个任务就能获得奖励啦～</p>
            )}
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="p-4 space-y-3">
          <h2 className="font-black text-lg text-gray-800 mb-2">📋 今日任务</h2>
          {profile.tasks.map((task, idx) => (
            <div key={task.id}
              className={`pixel-card rounded-2xl p-4 flex items-center gap-3 ${task.completedToday ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
              <span className="text-3xl">{task.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-base truncate ${task.completedToday ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.name}</p>
                <p className="text-xs text-gray-500">奖励 🪙{task.coinReward}</p>
              </div>
              <button
                onClick={() => handleCompleteTask(idx)}
                disabled={task.completedToday}
                className={`px-5 py-3 rounded-2xl font-black text-sm transition-all ${task.completedToday ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-400 hover:bg-green-500 text-green-900 active:scale-95'}`}>
                {task.completedToday ? '✅' : '完成'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && <ShopPage isYuanyuan={isYuanyuan} theme={theme} onFeed={handleFeedPet} profile={profile} updateProfile={updateProfile} id={id} />}

      {tab === 3 && <GachaPage isYuanyuan={isYuanyuan} theme={theme} profile={profile} updateProfile={updateProfile} id={id} />}

      {tab === 4 && <InventoryPage theme={theme} profile={profile} isYuanyuan={isYuanyuan} />}
    </div>
  )
}
