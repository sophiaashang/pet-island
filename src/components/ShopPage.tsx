import { ChildProfile, Item } from '../types'
import { FOOD_SHOP, TOY_SHOP } from '../gachaData'

interface Props {
  isYuanyuan: boolean; theme: any; onFeed: (item: Item) => void;
  profile: ChildProfile; updateProfile: (id: string, fn: (p: ChildProfile) => ChildProfile) => void; id: string;
}

export function ShopPage({ isYuanyuan, theme, onFeed, profile, updateProfile, id }: Props) {
  const allFoods = FOOD_SHOP()
  const allToys = TOY_SHOP()
  const myFoods = profile.inventory.filter(i => i.type === 'food')
  const myToys = profile.inventory.filter(i => i.type === 'toy')

  function buyItem(item: Item) {
    if (profile.totalCoins < item.price) return
    updateProfile(id, p => ({
      ...p, totalCoins: p.totalCoins - item.price,
      inventory: [...p.inventory, { ...item, count: item.count + 1 }]
    }))
  }

  function useItem(item: Item) {
    updateProfile(id, p => {
      const newHunger = Math.min(100, p.pet.hunger + (item.type === 'food' ? item.effect : 0))
      const newMood = Math.min(100, p.pet.mood + (item.type === 'toy' ? item.effect : 10))
      return {
        ...p,
        pet: { ...p.pet, hunger: newHunger, mood: newMood },
        inventory: p.inventory.map(i => i.id === item.id ? { ...i, count: Math.max(0, i.count - 1) } : i).filter(i => i.count > 0),
      }
    })
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-black text-xl text-center mb-2">🛒 商店</h2>
      
      {/* My inventory */}
      <div className={`pixel-card rounded-2xl p-4 ${theme.cardBg}`}>
        <h3 className="font-bold text-sm mb-2">🎒 背包</h3>
        <div className="grid grid-cols-4 gap-2">
          {profile.inventory.filter(i => i.count > 0).map(item => (
            <button key={item.id} onClick={() => useItem(item)}
              className="bg-white rounded-xl p-2 text-center hover:scale-105 transition-transform shadow-sm">
              <div className="text-2xl">{item.icon}</div>
              <div className="text-xs font-bold mt-1">{item.name}</div>
              <div className="text-xs text-gray-400">x{item.count}</div>
            </button>
          ))}
          {profile.inventory.filter(i => i.count > 0).length === 0 && (
            <p className="text-sm text-gray-400 col-span-4 text-center py-4">背包空空，逛逛商店吧~</p>
          )}
        </div>
      </div>

      {/* Food shop */}
      <div className="pixel-card rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-2">🍖 食物</h3>
        <div className="grid grid-cols-3 gap-2">
          {allFoods.map(food => (
            <button key={food.id} onClick={() => buyItem(food)}
              disabled={profile.totalCoins < food.price}
              className="bg-orange-50 rounded-xl p-3 text-center disabled:opacity-40 hover:scale-105 transition-transform">
              <div className="text-3xl">{food.icon}</div>
              <div className="font-bold text-sm mt-1">{food.name}</div>
              <div className="text-xs text-orange-600">+{food.effect}饱食度</div>
              <div className="text-xs font-bold mt-1">🪙{food.price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Toy shop */}
      <div className="pixel-card rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-2">🧸 玩具</h3>
        <div className="grid grid-cols-2 gap-2">
          {allToys.map(toy => (
            <button key={toy.id} onClick={() => buyItem(toy)}
              disabled={profile.totalCoins < toy.price}
              className="bg-pink-50 rounded-xl p-3 text-center disabled:opacity-40 hover:scale-105 transition-transform">
              <div className="text-3xl">{toy.icon}</div>
              <div className="font-bold text-sm mt-1">{toy.name}</div>
              <div className="text-xs text-pink-600">+{toy.effect}开心</div>
              <div className="text-xs font-bold mt-1">🪙{toy.price}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
