import { useState, useEffect } from 'react'
import { ChildId, ChildProfile, Pet } from '../types'
import { PetImage } from './PetImage'

interface Props {
  childId: ChildId
  profile: ChildProfile
  otherProfile: ChildProfile
  theme: any
  onVisit: (visitingPet: { pet: Pet; fromChildId: ChildId } | undefined) => void
  updateProfile: (id: string, updater: (p: ChildProfile) => ChildProfile) => void
}

interface VisitRecord {
  pet: Pet
  fromChildId: ChildId
  timestamp: number
}

function getFriendshipEmoji(level: number): string {
  if (level >= 61) return '💜'
  if (level >= 31) return '💙'
  if (level >= 11) return '💚'
  return '🤝'
}

function getFriendshipLabel(level: number): string {
  if (level >= 61) return '生死之交'
  if (level >= 31) return '好朋友'
  if (level >= 11) return '小伙伴'
  return '初次见面'
}

export default function PetVisitingPage({ childId, profile, otherProfile, theme, onVisit, updateProfile }: Props) {
  const [interacting, setInteracting] = useState(false)
  const [actionMsg, setActionMsg] = useState('')
  const [friendshipAnim, setFriendshipAnim] = useState(false)
  const [pendingVisit, setPendingVisit] = useState<VisitRecord | null>(null)
  const [visitHistory, setVisitHistory] = useState<VisitRecord[]>([])
  const [dispatchPet, setDispatchPet] = useState<Pet | null>(null)

  const VISIT_HISTORY_KEY = `visit-history-${childId}`
  const VISITING_NOTIF_KEY = `visiting-notif-${childId}`
  const dispatchPetKey = 'dispatch-pet-' + childId

  const visitingPet = profile.visitingPet
  const allMyPets = [profile.pet, ...profile.petsCollection]

  useEffect(() => {
    // Check for pending visit from other child
    try {
      const raw = localStorage.getItem(VISITING_NOTIF_KEY)
      if (raw) {
        const notif = JSON.parse(raw) as VisitRecord
        // Valid for 2 hours
        if (Date.now() - notif.timestamp < 2 * 60 * 60 * 1000) {
          setPendingVisit(notif)
        } else {
          localStorage.removeItem(VISITING_NOTIF_KEY)
        }
      }
    } catch { /* ignore */ }

    // Load visit history
    try {
      const raw = localStorage.getItem(VISIT_HISTORY_KEY)
      if (raw) {
        const history = JSON.parse(raw) as VisitRecord[]
        setVisitHistory(history.slice(0, 3))
      }
    } catch { /* ignore */ }

    // Load saved dispatch pet
    const savedDispatchId = localStorage.getItem(dispatchPetKey)
    if (savedDispatchId) {
      const found = allMyPets.find(p => p.id === savedDispatchId)
      if (found) setDispatchPet(found)
    }
  }, [])

  function doAction(action: string) {
    if (interacting) return
    setInteracting(true)
    const msgs: Record<string, string[]> = {
      抚摸: ['🐾 轻轻抚摸~好舒服呀！', '🐾 摸头杀！', '🐾 挠挠下巴~'],
      喂食: ['🍖 分享小鱼干！', '🍖 好吃的一起吃！', '🍖 特制零食来咯~'],
      陪玩: ['🎾 一起玩耍吧！', '🎾 追逐游戏开始！', '🎾 玩球球咯~'],
    }
    const lines = msgs[action] || [action]
    setActionMsg(lines[Math.floor(Math.random() * lines.length)])
    setTimeout(() => setActionMsg(''), 2000)
    setTimeout(() => setInteracting(false), 1500)
    setFriendshipAnim(true)
    setTimeout(() => setFriendshipAnim(false), 1500)
  }

  function dismissPendingVisit() {
    setPendingVisit(null)
    localStorage.removeItem(VISITING_NOTIF_KEY)
  }

  function sendMyPet() {
    const petToSend = dispatchPet || profile.pet
    // Save visit notification for other child
    const notifKey = `visiting-notif-${otherProfile.pet.id === profile.pet.id ? childId : childId}`
    // otherId = the other child's id
    const otherId: ChildId = childId === 'yuanyuan' ? 'xinbei' : 'yuanyuan'
    const notifData = JSON.stringify({ pet: petToSend, fromChildId: childId, timestamp: Date.now() })
    localStorage.setItem(`visiting-notif-${otherId}`, notifData)

    // Save to history
    const newRecord: VisitRecord = { pet: petToSend, fromChildId: childId, timestamp: Date.now() }
    const updatedHistory = [newRecord, ...visitHistory].slice(0, 3)
    localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(updatedHistory))
    setVisitHistory(updatedHistory)

    // Also update the visiting state locally
    onVisit({ pet: petToSend, fromChildId: childId })
  }

  const displayPet = pendingVisit?.pet || (visitingPet ? visitingPet.pet : otherProfile.pet)
  const displayFriendship = displayPet.friendship || 0
  const friendshipEmoji = getFriendshipEmoji(displayFriendship)
  const friendshipLabel = getFriendshipLabel(displayFriendship)

  return (
    <div className="p-4 space-y-4">
      {/* Pending visit banner */}
      {pendingVisit && (
        <div className="pixel-card rounded-3xl p-5 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-300 relative overflow-hidden">
          <button
            onClick={dismissPendingVisit}
            className="absolute top-2 right-2 text-orange-400 hover:text-orange-600 text-xl font-bold"
          >
            ×
          </button>
          <div className="text-center">
            <div className="text-5xl mb-2 animate-bounce">🎉</div>
            <h2 className="font-black text-xl text-orange-700">
              {pendingVisit.pet.nickname} 来做客了！
            </h2>
            <p className="text-sm text-orange-500 mt-1">快去和它玩！</p>
            <button
              onClick={dismissPendingVisit}
              className="mt-3 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-2xl font-bold text-sm active:scale-95 transition-all"
            >
              去迎接 🎊
            </button>
          </div>
        </div>
      )}

      {/* Visiting header */}
      <div className={`pixel-card rounded-3xl p-5 text-center ${theme.accentBg}`}>
        <div className="text-4xl mb-2">
          {visitingPet || pendingVisit ? '🎉' : '🏕️'}
        </div>
        <h2 className={`font-black text-lg ${theme.accent}`}>
          {visitingPet
            ? `${otherProfile.name}的宠物来做客啦！`
            : `${otherProfile.name}的小岛`}
        </h2>
        {visitingPet && (
          <p className="text-sm text-gray-500 mt-1">
            🎊 {visitingPet.pet.nickname} 来 {profile.name} 的小岛玩耍！
          </p>
        )}
      </div>

      {/* Visiting pet display */}
      <div className="pixel-card rounded-3xl p-6 bg-white">
        <div className="text-center">
          <div className={`relative inline-block ${interacting ? 'animate-bounce' : 'animate-float'}`}>
            <PetImage type={displayPet.type} size={120} />
            {(visitingPet || pendingVisit) && (
              <div className="absolute -top-2 -right-2 bg-yellow-300 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                做客中
              </div>
            )}
          </div>
          <h3 className="text-xl font-black mt-3">{displayPet.nickname}</h3>
          <p className="text-sm text-gray-500">等级 {displayPet.level}</p>

          {/* Hunger & Mood for visiting pet */}
          {(visitingPet || pendingVisit) && (
            <div className="mt-2 flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span>🍖</span>
                <span className="text-gray-600">{displayPet.hunger}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>💖</span>
                <span className="text-gray-600">{displayPet.mood}</span>
              </div>
            </div>
          )}

          {/* 友情值 */}
          <div className="mt-3 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{friendshipEmoji}</span>
              <span className="text-sm font-bold text-gray-600">友情值</span>
              <span className="text-2xl">{friendshipEmoji}</span>
            </div>
            <div className="w-40 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className={`h-full bg-pink-400 rounded-full transition-all ${friendshipAnim ? 'animate-pulse' : ''}`}
                style={{ width: `${Math.min(100, displayFriendship)}%` }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-pink-600">{displayFriendship}</span>
              <span className="text-xs text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">{friendshipLabel}</span>
            </div>
          </div>

          {/* Action speech */}
          {actionMsg && (
            <div className="mt-3 bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-4 py-2 text-sm font-bold text-yellow-700 animate-pop-in">
              {actionMsg}
            </div>
          )}
        </div>
      </div>

      {/* Interaction buttons */}
      <div className="pixel-card rounded-3xl p-4 bg-white">
        <h3 className="font-black text-sm text-gray-700 mb-3 text-center">🤗 互动</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '✋', label: '抚摸', color: 'bg-pink-100 hover:bg-pink-200' },
            { icon: '🍖', label: '喂食', color: 'bg-orange-100 hover:bg-orange-200' },
            { icon: '🎾', label: '陪玩', color: 'bg-blue-100 hover:bg-blue-200' },
          ].map(({ icon, label, color }) => (
            <button
              key={label}
              onClick={() => doAction(label)}
              disabled={interacting}
              className={`${color} rounded-2xl p-4 text-center transition-all active:scale-95 disabled:opacity-50`}
            >
              <div className="text-3xl mb-1">{icon}</div>
              <div className="text-sm font-bold text-gray-700">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 🦸 派遣我的宠物 */}
      <div className="pixel-card rounded-3xl p-4 bg-white">
        <h3 className="font-black text-sm text-gray-700 mb-3 text-center">🦸 派遣我的宠物</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {allMyPets.map(pet => (
            <button
              key={pet.id}
              onClick={() => {
                setDispatchPet(pet)
                localStorage.setItem(dispatchPetKey, pet.id)
              }}
              className={`flex-shrink-0 text-center rounded-2xl p-2 transition-all ${dispatchPet?.id === pet.id ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <PetImage type={pet.type} size={40} />
              <p className="text-xs font-bold mt-1 text-gray-600">{pet.nickname}</p>
            </button>
          ))}
        </div>
        <div className="text-center">
          {visitingPet ? (
            <p className="text-sm text-gray-500 mb-2">当前有宠物在做客！</p>
          ) : null}
          {/* 召唤回来按钮 — 宠物送出去后可随时召回 */}
        {visitingPet && (
          <button
            onClick={() => {
              if (window.confirm(`召唤 ${visitingPet.pet.nickname} 回来？`)) {
                updateProfile(childId, p => ({ ...p, visitingPet: undefined }))
                const otherId: ChildId = childId === 'yuanyuan' ? 'xinbei' : 'yuanyuan'
                localStorage.removeItem(`visiting-notif-${otherId}`)
              }
            }}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 mb-2"
          >
            🔙 召唤 {visitingPet.pet.nickname} 回来
          </button>
        )}
        <button
            onClick={sendMyPet}
            disabled={!!visitingPet}
            className={`${theme.button} ${theme.buttonText} px-6 py-3 rounded-2xl font-bold text-sm disabled:opacity-50 active:scale-95 transition-all`}
          >
            派遣 {dispatchPet?.nickname || profile.pet.nickname} 🎉
          </button>
        </div>
      </div>

      {/* 最近来做客的宠物 */}
      {visitHistory.length > 0 && (
        <div className="pixel-card rounded-3xl p-4 bg-white">
          <h3 className="font-black text-sm text-gray-700 mb-3 text-center">📜 最近来做客的宠物</h3>
          <div className="space-y-2">
            {visitHistory.map((record, idx) => {
              const ageMs = Date.now() - record.timestamp
              const ageStr = ageMs < 60000 ? '刚刚' : ageMs < 3600000 ? `${Math.floor(ageMs / 60000)}分钟前` : `${Math.floor(ageMs / 3600000)}小时前`
              return (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                  <PetImage type={record.pet.type} size={36} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700">{record.pet.nickname}</p>
                    <p className="text-xs text-gray-400">{ageStr}</p>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {record.fromChildId === 'yuanyuan' ? '🐥元元' : '🐺新北'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 友情等级说明 */}
      <div className="pixel-card rounded-2xl p-4 bg-gray-50">
        <p className="text-xs text-gray-500 text-center mb-2">💡 友情等级</p>
        <div className="flex justify-around text-xs">
          <div className="text-center">
            <div>🤝</div>
            <div className="text-gray-400">0-10</div>
          </div>
          <div className="text-center">
            <div>💚</div>
            <div className="text-gray-400">11-30</div>
          </div>
          <div className="text-center">
            <div>💙</div>
            <div className="text-gray-400">31-60</div>
          </div>
          <div className="text-center">
            <div>💜</div>
            <div className="text-gray-400">61-100</div>
          </div>
        </div>
      </div>
    </div>
  )
}
