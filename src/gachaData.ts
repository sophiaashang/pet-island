import { Pet, PetType, Rarity, Item } from './types'

export interface GachaPet {
  type: PetType; name: string; nickname: string; rarity: Rarity;
  rarityStars: string; speechLines: string[]; color: string;
}

export const GACHA_POOL: GachaPet[] = [
  { type: 'MEIMI', name: '棉花羊', nickname: '棉花羊', rarity: 'common', rarityStars: '⭐⭐',
    speechLines: ['呼噜噜……好困……', '棉花糖一样软的羊毛~', '今天的阳光好舒服呀'], color: '#FFFFFF' },
  { type: 'LINGLING', name: '磷磷龟', nickname: '磷磷龟', rarity: 'common', rarityStars: '⭐⭐',
    speechLines: ['一步一步……慢慢来', '坚持就是胜利！', '今天的草好香呀'], color: '#7DC850' },
  { type: 'FIRE', name: '烈焰鸡', nickname: '烈焰鸡', rarity: 'rare', rarityStars: '⭐⭐⭐',
    speechLines: ['咯咯咯！我是最棒的！', '早起的公鸡有虫吃！', '看我的华丽羽毛！'], color: '#FF6B35' },
  { type: 'BUBBLE', name: '泡泡龙', nickname: '泡泡龙', rarity: 'rare', rarityStars: '⭐⭐⭐',
    speechLines: ['啵啵~泡泡里藏着愿望', '看我的闪闪泡泡！', '许个愿吧~'], color: '#7EC8E3' },
  { type: 'MOONFOX', name: '月光狐', nickname: '月光狐', rarity: 'epic', rarityStars: '⭐⭐⭐⭐',
    speechLines: ['月色真美……', '听说你有个秘密？', '只在深夜出现哦'], color: '#E8E8FF' },
  { type: 'STARCUB', name: '星际熊', nickname: '星际熊', rarity: 'legendary', rarityStars: '⭐⭐⭐⭐',
    speechLines: ['来自银河尽头……', '星星们都在看着我', '宇宙的秘密，你想听吗？'], color: '#9B7EC8' },
]

export const GACHA_WEIGHTS: Array<{ type: PetType; weight: number }> = [
  { type: 'MEIMI', weight: 30 }, { type: 'LINGLING', weight: 30 },
  { type: 'FIRE', weight: 20 }, { type: 'BUBBLE', weight: 15 },
  { type: 'MOONFOX', weight: 4 }, { type: 'STARCUB', weight: 1 },
]

export function pullGacha(pityCounter: number): { pet: GachaPet; newPity: number } {
  const totalWeight = GACHA_WEIGHTS.reduce((sum, g) => sum + g.weight, 0)
  const rollingPity = pityCounter >= 30
  let roll = Math.random() * (rollingPity ? totalWeight + 1 : totalWeight)
  let selectedType: PetType = 'MEIMI'
  for (const g of GACHA_WEIGHTS) {
    roll -= g.weight
    if (roll <= 0) { selectedType = g.type; break }
  }
  if (rollingPity && selectedType === 'MEIMI') {
    selectedType = Math.random() < 0.5 ? 'MOONFOX' : 'STARCUB'
  }
  const newPity = ['MOONFOX','STARCUB'].includes(selectedType) ? 0 : pityCounter + 1
  return { pet: GACHA_POOL.find(g => g.type === selectedType)!, newPity }
}

export function gachaPetToPet(gachaPet: GachaPet): Pet {
  return {
    id: `${gachaPet.type}-${Date.now()}`,
    name: gachaPet.name, type: gachaPet.type, nickname: gachaPet.name,
    stage: 0, hunger: 80, mood: 80, level: 0, tasksCompleted: 0,
    rarity: gachaPet.rarity, speechLines: gachaPet.speechLines,
    currentLine: '', isNew: true,
  }
}

export function FOOD_SHOP(): Item[] {
  return [
    { id: 'shop-bread', name: '面包', icon: '🥖', type: 'food', price: 10, effect: 30, count: 0 },
    { id: 'shop-fish', name: '小鱼干', icon: '🐟', type: 'food', price: 20, effect: 50, count: 0 },
    { id: 'shop-carrot', name: '胡萝卜', icon: '🥕', type: 'food', price: 15, effect: 40, count: 0 },
    { id: 'shop-burger', name: '汉堡', icon: '🍔', type: 'food', price: 30, effect: 70, count: 0 },
    { id: 'shop-candy', name: '糖果', icon: '🍬', type: 'food', price: 8, effect: 20, count: 0 },
    { id: 'shop-cake', name: '蛋糕', icon: '🎂', type: 'food', price: 50, effect: 100, count: 0 },
  ]
}

export function TOY_SHOP(): Item[] {
  return [
    { id: 'shop-ball', name: '皮球', icon: '🏀', type: 'toy', price: 25, effect: 10, count: 0 },
    { id: 'shop-yarn', name: '毛线球', icon: '🧶', type: 'toy', price: 20, effect: 10, count: 0 },
  ]
}
