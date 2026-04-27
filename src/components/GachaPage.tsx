import { useState } from 'react'
import { GACHA_POOL, pullGacha, gachaPetToPet } from '../gachaData'
import { PetSVG } from './PetSVGs'
import { GachaPet, ChildProfile, Pet } from '../types'

interface Props {
  isYuanyuan: boolean; theme: any; profile: ChildProfile;
  updateProfile: (id: string, fn: (p: ChildProfile) => ChildProfile) => void; id: string;
}

export function GachaPage({ isYuanyuan, theme, profile, updateProfile, id }: Props) {
  const [pity, setPity] = useState(() => {
    const saved = localStorage.getItem(`pet-island-pity-${id}`)
    return saved ? parseInt(saved) : 0
  })
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState<GachaPet | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [pulls, setPulls] = useState<GachaPet[]>([])

  function savePity(p: number) {
    localStorage.setItem(`pet-island-pity-${id}`, String(p))
    setPity(p)
  }

  function doSinglePull() {
    if (profile.totalCoins < 300) return
    setRolling(true)
    setResult(null)
    setShowResult(false)
    setTimeout(() => {
      const { pet, newPity } = pullGacha(pity)
      setResult(pet)
      setPulls([pet])
      savePity(newPity)
      updateProfile(id, p => ({
        ...p, totalCoins: p.totalCoins - 300,
        petsCollection: [...p.petsCollection, gachaPetToPet(pet)],
        pet: pet.type === 'DUCKY' || pet.type === 'WOLFY' ? p.pet : { ...p.pet, mood: Math.min(100, p.pet.mood + 10) }
      }))
      setRolling(false)
      setShowResult(true)
    }, 1200)
  }

  function doMultiPull() {
    if (profile.totalCoins < 2880) return
    setRolling(true)
    setResult(null)
    setShowResult(false)
    setTimeout(() => {
      const results: GachaPet[] = []
      let p = pity
      for (let i = 0; i < 10; i++) {
        const { pet, newPity } = pullGacha(p)
        results.push(pet)
        p = newPity
      }
      setPulls(results)
      setResult(results[0])
      savePity(p)
      updateProfile(id, p2 => ({
        ...p2, totalCoins: p2.totalCoins - 2880,
        petsCollection: [...p2.petsCollection, ...results.map(gachaPetToPet)],
        pet: { ...p2.pet, mood: Math.min(100, p2.pet.mood + 20) }
      }))
      setRolling(false)
      setShowResult(true)
    }, 2000)
  }

  return (
    <div className="p-4">
      <h2 className="font-black text-xl text-gray-800 mb-2 text-center">🎰 扭蛋机</h2>
      <div className="pixel-card rounded-3xl p-4 mb-4 text-center">
        <div className="text-6xl mb-2">{rolling ? '🎲' : '🎰'}</div>
        <p className="text-sm text-gray-500 mb-3">保底进度: {pity >= 10 ? '10/10 已触发！' : `${pity}/10`}</p>
        {pity >= 30 && !rolling && <p className="text-xs text-red-500 font-bold">✨ 下一次必出珍稀！</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={doSinglePull} disabled={rolling || profile.totalCoins < 80}
          className={`${theme.button} ${theme.buttonText} py-4 rounded-2xl font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all`}>
          单抽 🪙300
        </button>
        <button onClick={doMultiPull} disabled={rolling || profile.totalCoins < 2880}
          className="bg-purple-400 hover:bg-purple-500 text-white py-4 rounded-2xl font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all">
          十连 🪙2880
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 mb-3">💰 金币: {profile.totalCoins}</div>

      {showResult && pulls.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-black text-center text-gray-700">
            {pulls.length === 1 ? '🎉 恭喜获得！' : '🎊 十连结果！'}
          </h3>
          {pulls.map((pet, i) => (
            <div key={i} className={`pixel-card rounded-2xl p-4 flex items-center gap-4 ${pet.rarity === 'epic' || pet.rarity === 'legendary' ? 'bg-purple-50' : pet.rarity === 'rare' ? 'bg-orange-50' : 'bg-white'}`}>
              <div className="animate-pop-in">
                <PetSVG type={pet.type} stage={0} size={64} className={pet.rarity === 'legendary' ? 'animate-float' : pet.rarity === 'epic' ? 'animate-sparkle' : ''} />
              </div>
              <div>
                <p className="font-black text-lg">{pet.name}</p>
                <p className="text-sm text-gray-500">{pet.rarityStars} {pet.rarity === 'epic' ? '珍稀' : pet.rarity === 'legendary' ? '传说' : pet.rarity === 'rare' ? '稀有' : '普通'}</p>
                <p className="text-xs text-gray-400 mt-1">{pet.speechLines[0]}</p>
              </div>
              {pet.rarity === 'legendary' && <span className="ml-auto text-2xl">🌟</span>}
              {pet.rarity === 'epic' && <span className="ml-auto text-2xl">✨</span>}
            </div>
          ))}
        </div>
      )}

      {/* Rarity info */}
      <div className="mt-6 pixel-card rounded-2xl p-4">
        <h3 className="font-black text-sm text-gray-700 mb-2">📖 扭蛋概率</h3>
        <div className="space-y-1 text-xs text-gray-600">
          <div>⭐⭐ 棉花羊 / 磷磷龟 <span className="float-right">各 30%</span></div>
          <div>⭐⭐⭐ 烈焰鸡 <span className="float-right">20%</span></div>
          <div>⭐⭐⭐ 泡泡龙 <span className="float-right">15%</span></div>
          <div>⭐⭐⭐⭐ 月光狐 <span className="float-right">4%</span></div>
          <div>⭐⭐⭐⭐ 星际熊 <span className="float-right">1%</span></div>
        </div>
      </div>
    </div>
  )
}
