import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameContext } from '../App'
import { ChildId, Item, Pet, RoomTheme } from '../types'
import { getStageFromTasks } from '../components/PetSVGs'
import { GachaPage } from '../components/GachaPage'
import { ShopPage } from '../components/ShopPage'
import { InventoryPage } from '../components/InventoryPage'
import { PetImage } from '../components/PetImage'
import { ChatDialog } from '../components/ChatDialog'
import LearnPage from '../components/LearnPage'
import PetVisitingPage from '../components/PetVisitingPage'

const BASE_TABS = ['🏠 小窝', '📋 任务', '🍖 喂食', '🎰 扭蛋', '🎒 背包']

const ROOM_THEMES: Array<{ id: RoomTheme; label: string; gradient: string }> = [
  { id: 'grass', label: '🌿草地', gradient: 'linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)' },
  { id: 'wood', label: '🏠木地板', gradient: 'linear-gradient(135deg, #d4a574 0%, #c4956a 50%, #a0785a 100%)' },
  { id: 'cloud', label: '☁️云朵', gradient: 'linear-gradient(135deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%)' },
]

export default function ChildIsland() {
  const { childId } = useParams<{ childId: string }>()
  const navigate = useNavigate()
  const { profileMap, updateProfile } = useGameContext()
  const id = (childId as ChildId) || 'yuanyuan'
  const profile = profileMap[id]
  const otherId: ChildId = id === 'yuanyuan' ? 'xinbei' : 'yuanyuan'
  const otherProfile = profileMap[otherId]

  const [tab, setTab] = useState(0)
  const [petSpeech, setPetSpeech] = useState('')
  const [showCoinAnim, setShowCoinAnim] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showRoomPicker, setShowRoomPicker] = useState(false)
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null)
  const [noItemTooltip, setNoItemTooltip] = useState(false)

  if (!profile) return <div className="p-8 text-center">加载中...</div>

  const isYuanyuan = id === 'yuanyuan'
  const theme = isYuanyuan
    ? { primary: 'bg-yellow-100 border-yellow-400', accent: 'text-yellow-700', bg: 'bg-yellow-50', button: 'bg-yellow-400 hover:bg-yellow-500', buttonText: 'text-yellow-900', accentBg: 'bg-yellow-50' }
    : { primary: 'bg-blue-100 border-blue-400', accent: 'text-blue-700', bg: 'bg-blue-50', button: 'bg-blue-400 hover:bg-blue-500', buttonText: 'text-blue-900', accentBg: 'bg-blue-50' }

  const allPets = [profile.pet, ...profile.petsCollection]
  const activePetId = profile.activePetId || profile.pet.id
  const activePet = allPets.find(p => p.id === activePetId) || profile.pet

  const learnTabName = isYuanyuan ? '📝 认字' : '📖 背单词'
  const visitingTabName = '🏕️ 做客'
  const TABS = [...BASE_TABS, learnTabName, visitingTabName]

  // Count inventory items
  const foodCount = profile.inventory.filter(i => i.type === 'food').reduce((s, i) => s + i.count, 0)
  const toyCount = profile.inventory.filter(i => i.type === 'toy').reduce((s, i) => s + i.count, 0)

  // Check touch cooldown (30 min)
  const lastTouchKey = `pet-island-${id}-lastTouch`
  const lastTouch = parseInt(localStorage.getItem(lastTouchKey) || '0')
  const touchCooldownMs = 30 * 60 * 1000
  const canTouch = Date.now() - lastTouch >= touchCooldownMs

  function showFloatingEmoji(emoji: string) {
    setFloatingEmoji(emoji)
    setTimeout(() => setFloatingEmoji(null), 1000)
  }

  function applyToAllPets(updater: (pet: Pet) => Pet) {
    updateProfile(id, p => ({
      ...p,
      pet: updater(p.pet),
      petsCollection: p.petsCollection.map(updater),
    }))
  }

  function handleFeed() {
    const foodItem = profile.inventory.find(i => i.type === 'food' && i.count > 0)
    if (!foodItem) {
      setNoItemTooltip(true)
      setTimeout(() => setNoItemTooltip(false), 2000)
      return
    }
    const idx = profile.inventory.findIndex(i => i.id === foodItem.id)
    applyToAllPets(pet => ({
      ...pet,
      hunger: Math.min(100, pet.hunger + foodItem.effect),
      mood: Math.min(100, pet.mood + 5),
    }))
    updateProfile(id, p => ({
      ...p,
      inventory: p.inventory.map((it, i) => i === idx ? { ...it, count: Math.max(0, it.count - 1) } : it).filter(i => i.count > 0),
    }))
    showFloatingEmoji('+🍖')
    petSpeak()
  }

  function handleBath() {
    applyToAllPets(pet => ({
      ...pet,
      hunger: 100,
      mood: Math.min(100, pet.mood + 5),
    }))
    showFloatingEmoji('+🛁')
    petSpeak()
  }

  function handlePlay() {
    const toyItem = profile.inventory.find(i => i.type === 'toy' && i.count > 0)
    if (!toyItem) {
      setNoItemTooltip(true)
      setTimeout(() => setNoItemTooltip(false), 2000)
      return
    }
    const idx = profile.inventory.findIndex(i => i.id === toyItem.id)
    applyToAllPets(pet => ({
      ...pet,
      mood: Math.min(100, pet.mood + 10),
    }))
    updateProfile(id, p => ({
      ...p,
      inventory: p.inventory.map((it, i) => i === idx ? { ...it, count: Math.max(0, it.count - 1) } : it).filter(i => i.count > 0),
    }))
    showFloatingEmoji('+🎾')
    petSpeak()
  }

  function handleTouch() {
    if (!canTouch) {
      const remaining = Math.ceil((touchCooldownMs - (Date.now() - lastTouch)) / 60000)
      setPetSpeech(`${remaining}分钟后再摸摸我~`)
      setTimeout(() => setPetSpeech(''), 2000)
      return
    }
    localStorage.setItem(lastTouchKey, String(Date.now()))
    applyToAllPets(pet => ({
      ...pet,
      mood: Math.min(100, pet.mood + 5),
    }))
    showFloatingEmoji('+💖')
    petSpeak()
  }

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
    updateProfile(id, p => {
      const feedPetFn = (pet: Pet) => ({
        ...pet,
        hunger: Math.min(100, pet.hunger + item.effect),
        mood: Math.min(100, pet.mood + 5),
        currentLine: pet.speechLines[Math.floor(Math.random() * pet.speechLines.length)],
      })
      return {
        ...p,
        inventory: p.inventory.map((it, i) => i === idx ? { ...it, count: Math.max(0, it.count - 1) } : it).filter(i => i.count > 0),
        pet: feedPetFn(p.pet),
        petsCollection: p.petsCollection.map(feedPetFn),
      }
    })
    petSpeak()
  }

  function petSpeak() {
    const lines = activePet.speechLines
    setPetSpeech(lines[Math.floor(Math.random() * lines.length)])
    setTimeout(() => setPetSpeech(''), 3000)
  }

  function setActivePet(petId: string) {
    updateProfile(id, p => ({ ...p, activePetId: petId }))
  }

  function setRoomTheme(themeId: RoomTheme) {
    updateProfile(id, p => ({
      ...p,
      pet: { ...p.pet, roomTheme: themeId },
      petsCollection: p.petsCollection.map(pet => ({ ...pet, roomTheme: pet.roomTheme || themeId })),
    }))
    setShowRoomPicker(false)
  }

  function handleVisit(visitingPet: { pet: Pet; fromChildId: ChildId } | undefined) {
    // Save visit notification for the other child
    if (visitingPet) {
      const notifKey = `visiting-notif-${otherId}`
      localStorage.setItem(notifKey, JSON.stringify({
        pet: visitingPet.pet,
        fromChildId: visitingPet.fromChildId,
        timestamp: Date.now(),
      }))
    }
    updateProfile(id, p => ({ ...p, visitingPet }))
  }

  const stage = getStageFromTasks(activePet.tasksCompleted)
  const roomThemeId = (activePet as Pet).roomTheme || 'grass'
  const roomTheme = ROOM_THEMES.find(r => r.id === roomThemeId) || ROOM_THEMES[0]
  const completedTasks = profile.tasks.filter(t => t.completedToday).length
  const totalTasks = profile.tasks.length
  const allDone = completedTasks === totalTasks

  const tabLearnIdx = TABS.indexOf(learnTabName)
  const tabVisitingIdx = TABS.indexOf(visitingTabName)
  const isLearnTab = tab === tabLearnIdx
  const isVisitingTab = tab === tabVisitingIdx

  return (
    <div className="min-h-screen pb-20" style={{ background: theme.bg }}>
      {showChat && <ChatDialog pet={activePet} onClose={() => setShowChat(false)} />}

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
            className={`flex-shrink-0 px-3 py-3 text-sm font-bold transition-all border-b-2 ${i === tab ? theme.accent + ' border-current' : 'text-gray-400 border-transparent'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Home tab - Pet display with room */}
      {tab === 0 && (
        <div className="p-4 space-y-4">
          {/* Room area */}
          <div className="rounded-3xl overflow-hidden relative" style={{ background: roomTheme.gradient }}>
            <div className="p-6 text-center relative">
              {/* Room theme picker */}
              <button onClick={() => setShowRoomPicker(!showRoomPicker)}
                className="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/30 px-2 py-1 rounded-full text-xs z-10">
                🎨 {roomTheme.label}
              </button>
              {showRoomPicker && (
                <div className="absolute top-10 right-2 z-10 bg-white rounded-2xl shadow-lg p-2 space-y-1">
                  {ROOM_THEMES.map(rt => (
                    <button key={rt.id} onClick={() => setRoomTheme(rt.id)}
                      className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${rt.id === roomThemeId ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-gray-100'}`}>
                      {rt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Main pet display */}
              <div className="relative inline-block">
                <div className={`relative inline-block ${activePet.hunger < 20 ? 'animate-wiggle' : activePet.mood > 80 ? 'animate-float' : 'animate-bounce-idle'}`}>
                  <PetImage type={activePet.type} size={120} />
                </div>
                {petSpeech && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white border-2 border-gray-400 rounded-2xl px-4 py-2 text-sm font-bold shadow-lg animate-pop-in whitespace-nowrap">
                    💬 {petSpeech}
                  </div>
                )}
                {/* Floating emoji animation */}
                {floatingEmoji && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl font-black animate-pop-in">
                    {floatingEmoji}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-black text-white mt-2 drop-shadow">{activePet.nickname}</h2>
              <p className="text-sm text-white/80">
                等级 {activePet.level} · {stage === 0 ? '🌱初级' : stage === 1 ? '⭐中级' : '🌟高级'}
                {profile.petsCollection.length > 0 && <span> · {allPets.length}只宠物</span>}
              </p>

              {/* Status bars */}
              <div className="mt-3 space-y-2 max-w-xs mx-auto">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold w-10 text-white">🍖</span>
                  <div className="flex-1 bg-white/40 rounded-full h-5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${activePet.hunger < 30 ? 'bg-red-400' : activePet.hunger < 60 ? 'bg-yellow-400' : 'bg-green-400'}`}
                      style={{ width: `${activePet.hunger}%` }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-white">{activePet.hunger}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold w-10 text-white">💖</span>
                  <div className="flex-1 bg-white/40 rounded-full h-5 overflow-hidden">
                    <div className="h-full bg-pink-400 rounded-full transition-all" style={{ width: `${activePet.mood}%` }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-white">{activePet.mood}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4 justify-center">
                <button onClick={petSpeak} className="bg-white/30 hover:bg-white/50 text-white px-4 py-2 rounded-2xl font-bold text-sm backdrop-blur-sm">
                  💬 互动
                </button>
                <button onClick={() => setShowChat(true)} className="bg-indigo-400/80 hover:bg-indigo-500 text-white px-4 py-2 rounded-2xl font-bold text-sm backdrop-blur-sm">
                  💬 AI对话
                </button>
              </div>
            </div>
          </div>

          {/* Pet interaction buttons */}
          <div className="pixel-card rounded-3xl p-4 bg-white relative">
            <h3 className="font-black text-sm text-gray-700 mb-3 text-center">🎮 和宠物互动</h3>
            <div className="grid grid-cols-4 gap-2">
              {/* 喂食 */}
              <div className="relative">
                <button
                  onClick={handleFeed}
                  className="w-full bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all rounded-2xl p-3 text-center"
                >
                  <div className="text-3xl mb-1">🍖</div>
                  <div className="text-xs font-bold text-gray-700">喂食</div>
                  <div className="text-xs text-orange-500 font-bold">{foodCount}个</div>
                </button>
                {noItemTooltip && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap z-10 animate-pop-in">
                    去商店补充！
                  </div>
                )}
              </div>

              {/* 洗澡 */}
              <button
                onClick={handleBath}
                className="bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all rounded-2xl p-3 text-center"
              >
                <div className="text-3xl mb-1">🛁</div>
                <div className="text-xs font-bold text-gray-700">洗澡</div>
                <div className="text-xs text-blue-500 font-bold">免费</div>
              </button>

              {/* 玩耍 */}
              <div className="relative">
                <button
                  onClick={handlePlay}
                  className="w-full bg-purple-50 hover:bg-purple-100 active:scale-95 transition-all rounded-2xl p-3 text-center"
                >
                  <div className="text-3xl mb-1">🎾</div>
                  <div className="text-xs font-bold text-gray-700">玩耍</div>
                  <div className="text-xs text-purple-500 font-bold">{toyCount}个</div>
                </button>
              </div>

              {/* 抚摸 */}
              <button
                onClick={handleTouch}
                className={`active:scale-95 transition-all rounded-2xl p-3 text-center ${canTouch ? 'bg-pink-50 hover:bg-pink-100' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <div className="text-3xl mb-1">🤚</div>
                <div className="text-xs font-bold text-gray-700">抚摸</div>
                <div className={`text-xs font-bold ${canTouch ? 'text-pink-500' : 'text-gray-400'}`}>
                  {canTouch ? '免费' : '30min'}
                </div>
              </button>
            </div>
          </div>

          {/* Multi-pet collection row */}
          {allPets.length > 1 && (
            <div className="pixel-card rounded-3xl p-4 bg-white">
              <h3 className="font-black text-sm text-gray-700 mb-3 text-center">🎒 宠物收藏</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
                {allPets.map(pet => (
                  <button key={pet.id} onClick={() => setActivePet(pet.id)}
                    className={`flex-shrink-0 text-center transition-all ${pet.id === activePetId ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}>
                    <PetImage type={pet.type} size={pet.id === activePetId ? 64 : 48} />
                    <p className="text-xs font-bold mt-1 text-gray-600 truncate max-w-[60px]">{pet.nickname}</p>
                    {pet.id === activePetId && <span className="text-xs bg-yellow-300 px-1 rounded">主宠</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progress Card */}
          <div className="pixel-card rounded-3xl p-4 bg-white">
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

      {/* Task tab */}
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

      {/* Feed tab */}
      {tab === 2 && <ShopPage isYuanyuan={isYuanyuan} theme={theme} onFeed={handleFeedPet} profile={profile} updateProfile={updateProfile} id={id} />}

      {/* Gacha tab */}
      {tab === 3 && <GachaPage isYuanyuan={isYuanyuan} theme={theme} profile={profile} updateProfile={updateProfile} id={id} />}

      {/* Inventory tab */}
      {tab === 4 && <InventoryPage theme={theme} profile={profile} isYuanyuan={isYuanyuan} />}

      {/* Learning tab */}
      {isLearnTab && <LearnPage childId={id} theme={theme} />}

      {/* Visiting tab */}
      {isVisitingTab && (
        <PetVisitingPage
          childId={id}
          profile={profile}
          otherProfile={otherProfile}
          theme={theme}
          onVisit={handleVisit}
        />
      )}
    </div>
  )
}
