import { useState, useEffect, useRef } from 'react'
import { ChildId, ReviewEntry, HanziWord, PetWord } from '../types'

const HANZI_POOL: HanziWord[] = [
  { char: '日', pinyin: 'rì', word: '日出', emoji: '🌅' },{ char: '月', pinyin: 'yuè', word: '月亮', emoji: '🌙' },
  { char: '水', pinyin: 'shuǐ', word: '水果', emoji: '🍎' },{ char: '火', pinyin: 'huǒ', word: '火车', emoji: '🚂' },
  { char: '山', pinyin: 'shān', word: '高山', emoji: '⛰️' },{ char: '木', pinyin: 'mù', word: '树木', emoji: '🌳' },
  { char: '土', pinyin: 'tǔ', word: '土地', emoji: '🌱' },{ char: '人', pinyin: 'rén', word: '人们', emoji: '👫' },
  { char: '大', pinyin: 'dà', word: '大小', emoji: '📏' },{ char: '小', pinyin: 'xiǎo', word: '小心', emoji: '⚠️' },
  { char: '天', pinyin: 'tiān', word: '天空', emoji: '☁️' },{ char: '地', pinyin: 'dì', word: '地上', emoji: '🏞️' },
  { char: '风', pinyin: 'fēng', word: '刮风', emoji: '💨' },{ char: '雨', pinyin: 'yǔ', word: '下雨', emoji: '🌧️' },
  { char: '花', pinyin: 'huā', word: '花朵', emoji: '🌸' },{ char: '鸟', pinyin: 'niǎo', word: '小鸟', emoji: '🐦' },
  { char: '鱼', pinyin: 'yú', word: '金鱼', emoji: '🐟' },{ char: '虫', pinyin: 'chóng', word: '虫子', emoji: '🐛' },
  { char: '口', pinyin: 'kǒu', word: '门口', emoji: '🚪' },{ char: '目', pinyin: 'mù', word: '目光', emoji: '👀' },
  { char: '手', pinyin: 'shǒu', word: '手指', emoji: '✋' },{ char: '足', pinyin: 'zú', word: '足球', emoji: '⚽' },
  { char: '心', pinyin: 'xīn', word: '开心', emoji: '❤️' },{ char: '中', pinyin: 'zhōng', word: '中间', emoji: '🎯' },
  { char: '上', pinyin: 'shàng', word: '上面', emoji: '⬆️' },{ char: '下', pinyin: 'xià', word: '下面', emoji: '⬇️' },
  { char: '左', pinyin: 'zuǒ', word: '左边', emoji: '⬅️' },{ char: '右', pinyin: 'yòu', word: '右边', emoji: '➡️' },
  { char: '白', pinyin: 'bái', word: '白色', emoji: '⚪' },{ char: '黑', pinyin: 'hēi', word: '黑色', emoji: '⚫' },
]

const PET_POOL: PetWord[] = [
  { word: 'clean', chinese: '干净的/打扫', english: 'clean', example: 'I clean my room every day.' },
  { word: 'drink', chinese: '喝', english: 'drink', example: 'I drink water every morning.' },
  { word: 'eat', chinese: '吃', english: 'eat', example: 'I eat breakfast at 7 o\'clock.' },
  { word: 'sleep', chinese: '睡觉', english: 'sleep', example: 'I sleep eight hours every night.' },
  { word: 'take a photo', chinese: '拍照', english: 'take a photo', example: 'Let me take a photo of this beautiful view.' },
  { word: 'beach', chinese: '海滩', english: 'beach', example: 'We played on the beach yesterday.' },
  { word: 'flower', chinese: '花', english: 'flower', example: 'The flower smells very sweet.' },
  { word: 'sea', chinese: '大海', english: 'sea', example: 'The sea is blue and beautiful.' },
  { word: 'sun', chinese: '太阳', english: 'sun', example: 'The sun is very bright today.' },
  { word: 'tree', chinese: '树', english: 'tree', example: 'There is a big tree in our garden.' },
  { word: 'book', chinese: '书', english: 'book', example: 'I read a book every night.' },
  { word: 'friend', chinese: '朋友', english: 'friend', example: 'Li Ming is my best friend.' },
  { word: 'music', chinese: '音乐', english: 'music', example: 'I listen to music when I am happy.' },
  { word: 'water', chinese: '水', english: 'water', example: 'Please give me a glass of water.' },
  { word: 'home', chinese: '家', english: 'home', example: 'I go home after school.' },
  { word: 'time', chinese: '时间', english: 'time', example: 'What time is it now?' },
  { word: 'food', chinese: '食物', english: 'food', example: 'Healthy food is important for us.' },
  { word: 'school', chinese: '学校', english: 'school', example: 'My school starts at 8 o\'clock.' },
  { word: 'teacher', chinese: '老师', english: 'teacher', example: 'My teacher is very kind.' },
  { word: 'game', chinese: '游戏', english: 'game', example: 'This game is very fun.' },
  { word: 'run', chinese: '跑', english: 'run', example: 'I run in the park every morning.' },
  { word: 'swim', chinese: '游泳', english: 'swim', example: 'I can swim very well.' },
  { word: 'read', chinese: '读/阅读', english: 'read', example: 'I read English books every day.' },
  { word: 'write', chinese: '写', english: 'write', example: 'I write my diary every night.' },
]

const YUAN_WEEKS: PetWord[][] = [
  [{ word: 'clean', chinese: '干净的/打扫', english: 'clean', example: 'I clean my room every day.' },
   { word: 'drink', chinese: '喝', english: 'drink', example: 'I drink water every morning.' },
   { word: 'eat', chinese: '吃', english: 'eat', example: 'I eat breakfast at 7 o\'clock.' },
   { word: 'sleep', chinese: '睡觉', english: 'sleep', example: 'I sleep eight hours every night.' },
   { word: 'take a photo', chinese: '拍照', english: 'take a photo', example: 'Let me take a photo of this beautiful view.' },
   { word: 'beach', chinese: '海滩', english: 'beach', example: 'We played on the beach yesterday.' },
   { word: 'flower', chinese: '花', english: 'flower', example: 'The flower smells very sweet.' },
   { word: 'sea', chinese: '大海', english: 'sea', example: 'The sea is blue and beautiful.' },
   { word: 'sun', chinese: '太阳', english: 'sun', example: 'The sun is very bright today.' },
   { word: 'tree', chinese: '树', english: 'tree', example: 'There is a big tree in our garden.' }],
  [{ word: 'book', chinese: '书', english: 'book', example: 'I read a book every night.' },
   { word: 'friend', chinese: '朋友', english: 'friend', example: 'Li Ming is my best friend.' },
   { word: 'music', chinese: '音乐', english: 'music', example: 'I listen to music when I am happy.' },
   { word: 'water', chinese: '水', english: 'water', example: 'Please give me a glass of water.' },
   { word: 'home', chinese: '家', english: 'home', example: 'I go home after school.' },
   { word: 'time', chinese: '时间', english: 'time', example: 'What time is it now?' },
   { word: 'food', chinese: '食物', english: 'food', example: 'Healthy food is important for us.' },
   { word: 'school', chinese: '学校', english: 'school', example: 'My school starts at 8 o\'clock.' },
   { word: 'teacher', chinese: '老师', english: 'teacher', example: 'My teacher is very kind.' },
   { word: 'game', chinese: '游戏', english: 'game', example: 'This game is very fun.' }],
  [{ word: 'run', chinese: '跑', english: 'run', example: 'I run in the park every morning.' },
   { word: 'swim', chinese: '游泳', english: 'swim', example: 'I can swim very well.' },
   { word: 'read', chinese: '读/阅读', english: 'read', example: 'I read English books every day.' },
   { word: 'write', chinese: '写', english: 'write', example: 'I write my diary every night.' },
   { word: 'play', chinese: '玩', english: 'play', example: 'Children like to play in the park.' },
   { word: 'draw', chinese: '画画', english: 'draw', example: 'I draw pictures in art class.' },
   { word: 'sing', chinese: '唱歌', english: 'sing', example: 'I like to sing English songs.' },
   { word: 'jump', chinese: '跳', english: 'jump', example: 'The rabbit can jump very high.' },
   { word: 'walk', chinese: '走路', english: 'walk', example: 'I walk to school every day.' },
   { word: 'climb', chinese: '爬', english: 'climb', example: 'I climb the hill with my dad.' }],
  [{ word: 'rain', chinese: '雨', english: 'rain', example: 'The rain stopped and the sun came out.' },
   { word: 'snow', chinese: '雪', english: 'snow', example: 'It snowed last winter.' },
   { word: 'wind', chinese: '风', english: 'wind', example: 'The wind is very strong today.' },
   { word: 'cloud', chinese: '云', english: 'cloud', example: 'There are white clouds in the sky.' },
   { word: 'sky', chinese: '天空', english: 'sky', example: 'The sky is blue today.' },
   { word: 'star', chinese: '星星', english: 'star', example: 'I can see many stars at night.' },
   { word: 'moon', chinese: '月亮', english: 'moon', example: 'The moon is round tonight.' },
   { word: 'rainbow', chinese: '彩虹', english: 'rainbow', example: 'A rainbow appeared after the rain.' },
   { word: 'river', chinese: '河流', english: 'river', example: 'The river flows through the city.' },
   { word: 'lake', chinese: '湖泊', english: 'lake', example: 'We went boating on the lake.' }],
  [{ word: 'happy', chinese: '开心的', english: 'happy', example: 'I am very happy today.' },
   { word: 'sad', chinese: '伤心的', english: 'sad', example: 'She looked sad this morning.' },
   { word: 'angry', chinese: '生气的', english: 'angry', example: 'He was angry because he lost his book.' },
   { word: 'tired', chinese: '累的', english: 'tired', example: 'I am tired after playing sports.' },
   { word: 'excited', chinese: '兴奋的', english: 'excited', example: 'The children were excited about the trip.' },
   { word: 'scared', chinese: '害怕的', english: 'scared', example: 'I am scared of the dark.' },
   { word: 'proud', chinese: '自豪的', english: 'proud', example: 'I felt proud when I got an A.' },
   { word: 'bored', chinese: '无聊的', english: 'bored', example: 'I am bored at home today.' },
   { word: 'sick', chinese: '生病的', english: 'sick', example: 'I was sick last week.' },
   { word: 'hungry', chinese: '饿的', english: 'hungry', example: 'I am hungry. When is dinner?' }],
  [{ word: 'red', chinese: '红色', english: 'red', example: 'The apple is red.' },
   { word: 'blue', chinese: '蓝色', english: 'blue', example: 'The sky is blue.' },
   { word: 'green', chinese: '绿色', english: 'green', example: 'The grass is green.' },
   { word: 'yellow', chinese: '黄色', english: 'yellow', example: 'The banana is yellow.' },
   { word: 'orange', chinese: '橙色', english: 'orange', example: 'The orange is sweet.' },
   { word: 'purple', chinese: '紫色', english: 'purple', example: 'Grapes can be purple.' },
   { word: 'pink', chinese: '粉色', english: 'pink', example: 'Her dress is pink.' },
   { word: 'brown', chinese: '棕色', english: 'brown', example: 'The bear is brown.' },
   { word: 'black', chinese: '黑色', english: 'black', example: 'The cat is black.' },
   { word: 'white', chinese: '白色', english: 'white', example: 'The snow is white.' }],
  [{ word: 'father', chinese: '爸爸', english: 'father', example: 'My father works in a bank.' },
   { word: 'mother', chinese: '妈妈', english: 'mother', example: 'My mother cooks breakfast for me.' },
   { word: 'brother', chinese: '哥哥/弟弟', english: 'brother', example: 'I play games with my brother.' },
   { word: 'sister', chinese: '姐姐/妹妹', english: 'sister', example: 'My sister is in Grade 4.' },
   { word: 'grandma', chinese: '奶奶/外婆', english: 'grandma', example: 'My grandma tells me stories.' },
   { word: 'grandpa', chinese: '爷爷/外公', english: 'grandpa', example: 'My grandpa grows vegetables.' },
   { word: 'baby', chinese: '婴儿', english: 'baby', example: 'The baby is sleeping now.' },
   { word: 'doctor', chinese: '医生', english: 'doctor', example: 'The doctor helped me feel better.' },
   { word: 'nurse', chinese: '护士', english: 'nurse', example: 'The nurse is very gentle.' },
   { word: 'policeman', chinese: '警察', english: 'policeman', example: 'The policeman directed traffic.' }],
  [{ word: 'Monday', chinese: '星期一', english: 'Monday', example: 'Monday is the first day of school.' },
   { word: 'Tuesday', chinese: '星期二', english: 'Tuesday', example: 'I have art class on Tuesday.' },
   { word: 'Wednesday', chinese: '星期三', english: 'Wednesday', example: 'Wednesday is the middle of the week.' },
   { word: 'Thursday', chinese: '星期四', english: 'Thursday', example: 'Thursday comes after Wednesday.' },
   { word: 'Friday', chinese: '星期五', english: 'Friday', example: 'Friday is my favorite day!' },
   { word: 'Saturday', chinese: '星期六', english: 'Saturday', example: 'I sleep late on Saturday.' },
   { word: 'Sunday', chinese: '星期日', english: 'Sunday', example: 'Sunday is a rest day.' },
   { word: 'today', chinese: '今天', english: 'today', example: 'What are you doing today?' },
   { word: 'tomorrow', chinese: '明天', english: 'tomorrow', example: 'Tomorrow is a holiday.' },
   { word: 'yesterday', chinese: '昨天', english: 'yesterday', example: 'Yesterday was my birthday.' }],
]

const EB = [1, 2, 4, 7, 15, 30]
const todayStr = () => new Date().toISOString().slice(0, 10)
const dateN = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }

function getWeekOfYear(): number {
  const now = new Date(); const start = new Date(now.getFullYear(), 0, 1)
  return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
}

function getYuanWeekWords(): PetWord[] {
  return YUAN_WEEKS[(getWeekOfYear() - 1) % YUAN_WEEKS.length]
}

const _doy = (() => { const n = new Date(), s = new Date(n.getFullYear(), 0, 0); return Math.floor((n.getTime() - s.getTime()) / 864e5) })()
const getHanzi = (d: number) => { const s = (d * 5) % HANZI_POOL.length; return [0,1,2,3,4].map(i => HANZI_POOL[(s+i) % HANZI_POOL.length]) }
const getPet = (d: number) => { const s = (d * 8) % PET_POOL.length; return [0,1,2,3,4,5,6,7].map(i => PET_POOL[(s+i) % PET_POOL.length]) }
const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5)

interface Props { childId: ChildId; theme: any }

export default function LearnPage({ childId, theme }: Props) {
  const isY = childId === 'yuanyuan'

  // Reviews
  const [reviews, setReviews] = useState<Record<string, ReviewEntry>>(() => {
    try { return JSON.parse(localStorage.getItem(`pet-island-${childId}-reviews`) || '{}') } catch { return {} }
  })

  // Tab: hanzi(元元识字|新北PET词) | words(元元本周词) | review
  const [tab, setTab] = useState<'hanzi'|'words'|'review'>('hanzi')

  // LEARN state
  const [learnIdx, setLearnIdx] = useState(0)
  const [learnOpts, setLearnOpts] = useState<(HanziWord|PetWord)[]>([])
  const [selIdx, setSelIdx] = useState<number|null>(null)
  const [wrongIdx, setWrongIdx] = useState<number|null>(null)
  const [correctIdx, setCorrectIdx] = useState<number|null>(null)
  const [flash, setFlash] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [done, setDone] = useState(false)  // completed all items

  // REVIEW state
  const [reviewIdx, setReviewIdx] = useState(0)
  const [reviewOpts, setReviewOpts] = useState<(HanziWord|PetWord)[]>([])
  const [rSelIdx, setRSelIdx] = useState<number|null>(null)
  const [rWrongIdx, setRWrongIdx] = useState<number|null>(null)
  const [rCorrectIdx, setRCorrectIdx] = useState<number|null>(null)
  const [rFlash, setRFlash] = useState(false)
  const reviewGuard = useRef(false)

  const weekNum = getWeekOfYear()
  const yuanWords = getYuanWeekWords()

  // Which content are we showing? 'hanzi' | 'pet' (Xinbei's PET words)
  // For Yuan: hanzi tab → hanzi pool, words tab → yuan words
  // For Xinbei: hanzi tab → PET pool
  const learnContent: 'hanzi' | 'pet' | 'yuan-words' =
    isY ? (tab === 'words' ? 'yuan-words' : 'hanzi')
        : 'pet'

  const learnPool: (HanziWord|PetWord)[] =
    learnContent === 'hanzi' ? getHanzi(_doy)
    : learnContent === 'pet' ? getPet(_doy)
    : yuanWords

  // Due reviews (all types mixed)
  const dueItems = Object.entries(reviews)
    .filter(([, e]) => e.nextReviewDate <= todayStr() && e.level < 6)
    .map(([k]) => {
      const isHanzi = k.startsWith('hanzi-')
      const isYuan = k.startsWith('yuan-')
      const findK = isHanzi ? k.slice(6) : k.slice(isYuan ? 5 : 5)
      const pool: (HanziWord|PetWord)[] = isHanzi ? HANZI_POOL : (isYuan ? yuanWords : PET_POOL)
      const item = pool.find(p => (p as any).word === findK || (p as any).char === findK) || pool[0]
      return { k, item }
    })

  const currentItem: HanziWord|PetWord|null = learnPool[learnIdx] ?? null
  const reviewItem = dueItems[reviewIdx]

  const saveReview = (key: string, ok: boolean) => {
    const prev: ReviewEntry = reviews[key] || { level: 0, nextReviewDate: todayStr(), learnedDate: todayStr(), correctCount: 0, incorrectCount: 0 }
    const lvl = ok ? Math.min(prev.level + 1, 6) : 1
    const entry: ReviewEntry = {
      level: lvl,
      nextReviewDate: lvl >= 6 ? '2099-01-01' : dateN(EB[lvl-1] ?? 30),
      learnedDate: prev.learnedDate || todayStr(),
      correctCount: ok ? (prev.correctCount || 0) + 1 : (prev.correctCount || 0),
      incorrectCount: !ok ? (prev.incorrectCount || 0) + 1 : (prev.incorrectCount || 0),
    }
    const next = { ...reviews, [key]: entry }
    setReviews(next)
    localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(next))
  }

  // Populate learn options
  useEffect(() => {
    if (!currentItem || tab === 'review') return
    setSelIdx(null); setWrongIdx(null); setCorrectIdx(null); setShowNext(false); setDone(false)

    const correct = currentItem
    const isHanziItem = (currentItem as any).char !== undefined

    if (isHanziItem) {
      const c = currentItem as HanziWord
      const wrong = HANZI_POOL.filter(h => h.char !== c.char)
      setLearnOpts(shuffle([...shuffle(wrong).slice(0, 3), c]))
    } else {
      const c = currentItem as PetWord
      const pool: PetWord[] = learnContent === 'yuan-words' ? yuanWords : PET_POOL
      const wrong = pool.filter(p => p.word !== c.word)
      setLearnOpts(shuffle([...shuffle(wrong).slice(0, 3), c]))
    }
  }, [tab, learnIdx])

  // Populate review options
  useEffect(() => {
    if (tab !== 'review' || !reviewItem) return
    setRSelIdx(null); setRWrongIdx(null); setRCorrectIdx(null)
    const isHanzi = reviewItem.k.startsWith('hanzi-')
    const c = reviewItem.item
    if ((c as any).char !== undefined) {
      const h = c as HanziWord
      const wrong = HANZI_POOL.filter(x => x.char !== h.char)
      setReviewOpts(shuffle([...shuffle(wrong).slice(0, 3), h]))
    } else {
      const p = c as PetWord
      const isYuan = reviewItem.k.startsWith('yuan-')
      const pool: PetWord[] = isYuan ? yuanWords : PET_POOL
      const wrong = pool.filter(x => x.word !== p.word)
      setReviewOpts(shuffle([...shuffle(wrong).slice(0, 3), p]))
    }
  }, [tab, reviewIdx])

  function handleLearnClick(idx: number) {
    if (selIdx !== null) return
    const opt = learnOpts[idx]
    const isHanziItem = (opt as any).char !== undefined
    const ok = isHanziItem
      ? (opt as HanziWord).char === (currentItem as HanziWord).char
      : (opt as PetWord).word === (currentItem as PetWord).word

    if (ok) {
      setSelIdx(idx); setCorrectIdx(idx); setFlash(true)
      setTimeout(() => setFlash(false), 600)
      const key = isHanziItem
        ? `hanzi-${(currentItem as HanziWord).char}`
        : isY ? `yuan-${(currentItem as PetWord).word}` : `word-${(currentItem as PetWord).word}`
      saveReview(key, true)

      // After correct: decide next state
      if (learnIdx >= learnPool.length - 1) {
        // Last item: mark done, show completion screen
        setShowNext(false)
        setDone(true)
      } else {
        setShowNext(true)
      }
    } else {
      setSelIdx(idx); setWrongIdx(idx)
      setTimeout(() => { setWrongIdx(null); setSelIdx(null) }, 800)
    }
  }

  function handleReviewClick(idx: number) {
    if (rSelIdx !== null) return
    const opt = reviewOpts[idx]
    const isHanziItem = (opt as any).char !== undefined
    const ok = isHanziItem
      ? (opt as HanziWord).char === (reviewItem.item as HanziWord).char
      : (opt as PetWord).word === (reviewItem.item as PetWord).word
    reviewGuard.current = true
    if (ok) {
      setRSelIdx(idx); setRCorrectIdx(idx); setRFlash(true)
      saveReview(reviewItem.k, true)
      setTimeout(() => {
        reviewGuard.current = false
        setReviewIdx(i => i < dueItems.length - 1 ? i + 1 : 0)
      }, 1000)
    } else {
      setRSelIdx(idx); setRWrongIdx(idx)
      setTimeout(() => { setRWrongIdx(null); setRSelIdx(null) }, 800)
      saveReview(reviewItem.k, false)
    }
  }

  function handleLearnNext() {
    setLearnIdx(i => i + 1)
  }

  function handleGoToReview() {
    setTab('review')
    setReviewIdx(0)
  }

  // Button class: only correct=green, wrong=red, others=hidden, unselected=default
  function btnCls(idx: number, corr: number|null, wrong: number|null, sel: number|null, disabled: boolean) {
    const b = 'w-full py-3 rounded-2xl font-black text-lg text-center transition-all'
    // After selection
    if (sel !== null) {
      if (idx === corr) return `${b} bg-green-400 text-white`
      if (idx === wrong) return `${b} bg-red-400 text-white`
      return `${b} bg-gray-100 text-gray-300`  // other options grayed out
    }
    return `${b} bg-white border-2 border-gray-200 active:scale-95 hover:bg-gray-50`
  }

  const ac = (theme as any)?.accentColor || 'blue'
  const bc = `bg-${ac}-`
  const tc = `text-${ac}-`

  // Pool label
  const poolLabel = learnContent === 'hanzi' ? '字' : '词'

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`font-black text-lg ${tc}-700`}>
          {isY && tab === 'hanzi' ? '🅰️ 认字学习'
            : isY && tab === 'words' ? '📖 本周单词'
            : tab === 'review' ? '📖 复习'
            : '📖 PET 词汇'}
        </h2>
        <span className={`text-xs font-bold px-2 py-1 bg-white rounded-full ${tc}-700`}>
          {isY && tab === 'words' ? `第${weekNum}周` : new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-white rounded-2xl p-1 border-2 border-gray-200">
        {isY && <button onClick={() => { setTab('hanzi'); setLearnIdx(0); setDone(false) }} className={`flex-1 py-2 rounded-xl font-bold text-xs ${tab === 'hanzi' ? `${bc}500 text-white` : 'text-gray-400'}`}>🅰️ 认字</button>}
        {isY && <button onClick={() => { setTab('words'); setLearnIdx(0); setDone(false) }} className={`flex-1 py-2 rounded-xl font-bold text-xs ${tab === 'words' ? `${bc}500 text-white` : 'text-gray-400'}`}>📖 本周单词</button>}
        {!isY && <button onClick={() => setTab('hanzi')} className={`flex-1 py-2 rounded-xl font-bold text-xs ${tab === 'hanzi' ? `${bc}500 text-white` : 'text-gray-400'}`}>📖 学词</button>}
        <button onClick={() => setTab('review')} className={`flex-1 py-2 rounded-xl font-bold text-xs ${tab === 'review' ? `${bc}500 text-white` : 'text-gray-400'}`}>
          🔄 复习 {dueItems.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 ml-1">{dueItems.length}</span>}
        </button>
      </div>

      {/* ======================= LEARN ======================= */}
      {(tab === 'hanzi' || tab === 'words') && (
        <div className="space-y-3">
          {/* Done / Completion screen */}
          {done && (
            <div className="pixel-card rounded-3xl p-8 text-center space-y-4">
              <div className="text-5xl mb-2">🎉</div>
              <p className="font-black text-gray-700 text-lg">太棒了！今天学的都记住了！</p>
              <p className="text-sm text-gray-500">学完 {learnPool.length} 个{poolLabel}，可以开始复习了~</p>
              <div className="flex flex-col gap-2">
                <button onClick={handleGoToReview} className={`${bc}500 hover:${bc}600 text-white py-3 rounded-2xl font-black text-base transition-all active:scale-95`}>
                  📖 开始复习
                </button>
                <button onClick={() => { setLearnIdx(0); setDone(false); setSelIdx(null); setWrongIdx(null); setCorrectIdx(null) }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-2xl font-bold text-sm transition-all">
                  🔄 再学一遍
                </button>
              </div>
            </div>
          )}

          {/* Question card */}
          {!done && currentItem && (
            <>
              <div className={`pixel-card rounded-3xl p-5 ${flash ? 'bg-green-100 border-2 border-green-400' : 'bg-white'} transition-all`}>

                {/* HANZI: pinyin → character */}
                {learnContent === 'hanzi' && (() => {
                  const h = currentItem as HanziWord
                  return (
                    <>
                      <div className="text-center mb-2">
                        <p className="text-5xl font-black text-gray-700">{h.pinyin}</p>
                        <p className="text-sm text-gray-400 mt-1">选出这个读音对应的字</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(learnOpts as HanziWord[]).map((opt, i) => (
                          <button key={opt.char} onClick={() => handleLearnClick(i)} disabled={selIdx !== null}
                            className={btnCls(i, correctIdx, wrongIdx, selIdx, selIdx !== null)}>{opt.char}</button>
                        ))}
                      </div>
                    </>
                  )
                })()}

                {/* PET: English word → Chinese meaning */}
                {(learnContent === 'pet' || learnContent === 'yuan-words') && (() => {
                  const p = currentItem as PetWord
                  return (
                    <>
                      <div className="text-center mb-4">
                        <p className="text-2xl font-black text-blue-700">{p.word}</p>
                        <p className="text-sm text-gray-400 mt-1">选出正确的中文意思</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(learnOpts as PetWord[]).map((opt, i) => (
                          <button key={opt.word + i} onClick={() => handleLearnClick(i)} disabled={selIdx !== null}
                            className={`${btnCls(i, correctIdx, wrongIdx, selIdx, selIdx !== null)} text-sm`}>
                            <div className="text-base font-black">{opt.chinese}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  )
                })()}

                {selIdx !== null && correctIdx !== null && <div className="mt-3 text-center"><span className="bg-green-400 text-white px-4 py-1 rounded-full font-bold text-sm">✅ 正确！</span></div>}
                {selIdx !== null && wrongIdx !== null && <div className="mt-3 text-center"><span className="bg-red-400 text-white px-4 py-1 rounded-full font-bold text-sm">❌ 不对哦，再试一次！</span></div>}
              </div>

              {/* Next button (not last item) */}
              {showNext && (
                <button onClick={handleLearnNext} className="w-full bg-green-400 hover:bg-green-500 text-white py-3 rounded-2xl font-black text-base transition-all active:scale-95">
                  下一个 →
                </button>
              )}

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {learnPool.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === learnIdx ? 'bg-yellow-400 w-4' : i < learnIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-center text-xs text-gray-400">第 {learnIdx + 1} / {learnPool.length} {poolLabel}</p>
            </>
          )}
        </div>
      )}

      {/* ======================= REVIEW ======================= */}
      {tab === 'review' && (
        <div className="space-y-3">
          {dueItems.length === 0 ? (
            <div className="pixel-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-black text-gray-700 text-lg">暂时没有要复习的！</p>
              <p className="text-sm text-gray-500 mt-1">学完新词后再来吧~</p>
            </div>
          ) : (
            <>
              <div className={`pixel-card rounded-3xl p-5 ${rFlash ? 'bg-green-100 border-2 border-green-400' : 'bg-white'} transition-all`}>

                {/* Hanzi review */}
                {(reviewItem.item as any).char !== undefined && (() => {
                  const h = reviewItem.item as HanziWord
                  return (
                    <>
                      <div className="text-center mb-2">
                        <p className="text-5xl font-black text-gray-700">{h.pinyin}</p>
                        <p className="text-sm text-gray-400 mt-1">选出这个读音对应的字</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(reviewOpts as HanziWord[]).map((opt, i) => (
                          <button key={opt.char} onClick={() => handleReviewClick(i)} disabled={rSelIdx !== null}
                            className={btnCls(i, rCorrectIdx, rWrongIdx, rSelIdx, rSelIdx !== null)}>{opt.char}</button>
                        ))}
                      </div>
                    </>
                  )
                })()}

                {/* PET word review */}
                {(reviewItem.item as any).word !== undefined && (() => {
                  const p = reviewItem.item as PetWord
                  return (
                    <>
                      <div className="text-center mb-4">
                        <p className="text-2xl font-black text-blue-700">{p.word}</p>
                        <p className="text-sm text-gray-400 mt-1">选出正确的中文意思</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(reviewOpts as PetWord[]).map((opt, i) => (
                          <button key={opt.word + i} onClick={() => handleReviewClick(i)} disabled={rSelIdx !== null}
                            className={`${btnCls(i, rCorrectIdx, rWrongIdx, rSelIdx, rSelIdx !== null)} text-sm`}>
                            <div className="text-base font-black">{opt.chinese}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  )
                })()}

                {rSelIdx !== null && rCorrectIdx !== null && <div className="mt-3 text-center"><span className="bg-green-400 text-white px-4 py-1 rounded-full font-bold text-sm">✅ 正确！</span></div>}
                {rSelIdx !== null && rWrongIdx !== null && <div className="mt-3 text-center"><span className="bg-red-400 text-white px-4 py-1 rounded-full font-bold text-sm">❌ 不对哦，再试一次！</span></div>}
              </div>

              <div className="flex items-center justify-center gap-2">
                {dueItems.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === reviewIdx ? 'bg-yellow-400 w-4' : i < reviewIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-center text-xs text-gray-400">第 {reviewIdx + 1} / {dueItems.length} 题</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
