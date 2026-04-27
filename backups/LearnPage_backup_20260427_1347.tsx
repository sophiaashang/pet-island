import { useState, useEffect, useRef } from 'react'
import { ChildId, ReviewEntry, HanziWord, PetWord } from '../types'

// Curated hanzi for 元元 (5 per day, rotating)
const HANZI_POOL: HanziWord[] = [
  { char: '日', pinyin: 'rì', word: '日出', emoji: '🌅' },
  { char: '月', pinyin: 'yuè', word: '月亮', emoji: '🌙' },
  { char: '水', pinyin: 'shuǐ', word: '水果', emoji: '🍎' },
  { char: '火', pinyin: 'huǒ', word: '火车', emoji: '🚂' },
  { char: '山', pinyin: 'shān', word: '高山', emoji: '⛰️' },
  { char: '木', pinyin: 'mù', word: '树木', emoji: '🌳' },
  { char: '土', pinyin: 'tǔ', word: '土地', emoji: '🌱' },
  { char: '人', pinyin: 'rén', word: '人们', emoji: '👫' },
  { char: '大', pinyin: 'dà', word: '大小', emoji: '📏' },
  { char: '小', pinyin: 'xiǎo', word: '小心', emoji: '⚠️' },
  { char: '天', pinyin: 'tiān', word: '天空', emoji: '☁️' },
  { char: '地', pinyin: 'dì', word: '地上', emoji: '🏞️' },
  { char: '风', pinyin: 'fēng', word: '刮风', emoji: '💨' },
  { char: '雨', pinyin: 'yǔ', word: '下雨', emoji: '🌧️' },
  { char: '花', pinyin: 'huā', word: '花朵', emoji: '🌸' },
  { char: '鸟', pinyin: 'niǎo', word: '小鸟', emoji: '🐦' },
  { char: '鱼', pinyin: 'yú', word: '金鱼', emoji: '🐟' },
  { char: '虫', pinyin: 'chóng', word: '虫子', emoji: '🐛' },
  { char: '口', pinyin: 'kǒu', word: '门口', emoji: '🚪' },
  { char: '目', pinyin: 'mù', word: '目光', emoji: '👀' },
  { char: '手', pinyin: 'shǒu', word: '手指', emoji: '✋' },
  { char: '足', pinyin: 'zú', word: '足球', emoji: '⚽' },
  { char: '心', pinyin: 'xīn', word: '开心', emoji: '❤️' },
  { char: '中', pinyin: 'zhōng', word: '中间', emoji: '🎯' },
  { char: '上', pinyin: 'shàng', word: '上面', emoji: '⬆️' },
  { char: '下', pinyin: 'xià', word: '下面', emoji: '⬇️' },
  { char: '左', pinyin: 'zuǒ', word: '左边', emoji: '⬅️' },
  { char: '右', pinyin: 'yòu', word: '右边', emoji: '➡️' },
  { char: '白', pinyin: 'bái', word: '白色', emoji: '⚪' },
  { char: '黑', pinyin: 'hēi', word: '黑色', emoji: '⚫' },
]

// PET vocabulary for 新北 (~100 words)
const PET_POOL: PetWord[] = [
  { word: 'abandon', chinese: '放弃', english: 'abandon', example: 'Never abandon your dreams, no matter what happens.' },
  { word: 'ability', chinese: '能力', english: 'ability', example: 'She has the ability to learn languages quickly.' },
  { word: 'able', chinese: '能够', english: 'able', example: 'I am able to finish the task on time.' },
  { word: 'about', chinese: '关于', english: 'about', example: 'This book is about animals in the wild.' },
  { word: 'above', chinese: '在...之上', english: 'above', example: 'The birds fly above the clouds.' },
  { word: 'abroad', chinese: '在国外', english: 'abroad', example: 'She studies abroad in the UK.' },
  { word: 'absent', chinese: '缺席的', english: 'absent', example: 'He was absent from school yesterday.' },
  { word: 'accept', chinese: '接受', english: 'accept', example: 'Please accept my sincere apologies.' },
  { word: 'accident', chinese: '事故', english: 'accident', example: 'The accident happened on the main road.' },
  { word: 'account', chinese: '账户', english: 'account', example: 'I created a new email account.' },
  { word: 'achieve', chinese: '实现/达到', english: 'achieve', example: 'Hard work helps you achieve your goals.' },
  { word: 'across', chinese: '穿过', english: 'across', example: 'The cat ran across the street.' },
  { word: 'active', chinese: '积极的/活跃的', english: 'active', example: 'He leads an active and healthy lifestyle.' },
  { word: 'actor', chinese: '演员', english: 'actor', example: 'The actor performed on stage beautifully.' },
  { word: 'actually', chinese: '实际上', english: 'actually', example: 'I actually prefer tea to coffee.' },
  { word: 'add', chinese: '添加', english: 'add', example: 'Add some sugar to the tea.' },
  { word: 'advice', chinese: '建议', english: 'advice', example: 'Can you give me some advice on this?' },
  { word: 'afford', chinese: '负担得起', english: 'afford', example: 'I cannot afford to buy a new car.' },
  { word: 'afraid', chinese: '害怕的', english: 'afraid', example: 'She is afraid of spiders.' },
  { word: 'after', chinese: '在...之后', english: 'after', example: 'Let\'s meet after school.' },
  { word: 'again', chinese: '再次', english: 'again', example: 'Please try again!' },
  { word: 'against', chinese: '反对', english: 'against', example: 'We are against bullying.' },
  { word: 'age', chinese: '年龄', english: 'age', example: 'What is your age?' },
  { word: 'agree', chinese: '同意', english: 'agree', example: 'I agree with your idea.' },
  { word: 'allow', chinese: '允许', english: 'allow', example: 'My parents allow me to play games on weekends.' },
  { word: 'alone', chinese: '独自地', english: 'alone', example: 'She likes to read alone in her room.' },
  { word: 'already', chinese: '已经', english: 'already', example: 'I have already finished my homework.' },
  { word: 'also', chinese: '也', english: 'also', example: 'I like reading and also enjoy drawing.' },
  { word: 'although', chinese: '虽然', english: 'although', example: 'Although it was raining, we went out.' },
  { word: 'always', chinese: '总是', english: 'always', example: 'He always arrives on time.' },
  { word: 'amazing', chinese: '令人惊讶的', english: 'amazing', example: 'The sunset was absolutely amazing.' },
  { word: 'ancient', chinese: '古代的', english: 'ancient', example: 'The Great Wall is an ancient wonder.' },
  { word: 'anger', chinese: '愤怒', english: 'anger', example: 'He could not control his anger.' },
  { word: 'animal', chinese: '动物', english: 'animal', example: 'Every animal has its own way of living.' },
  { word: 'announce', chinese: '宣布', english: 'announce', example: 'The school will announce the results tomorrow.' },
  { word: 'anxious', chinese: '焦虑的', english: 'anxious', example: 'She felt anxious before the exam.' },
  { word: 'appear', chinese: '出现', english: 'appear', example: 'The sun appears early in summer.' },
  { word: 'apply', chinese: '申请', english: 'apply', example: 'You need to apply for this scholarship.' },
  { word: 'appreciate', chinese: '感激', english: 'appreciate', example: 'I really appreciate your help.' },
  { word: 'approach', chinese: '接近/方法', english: 'approach', example: 'The best approach is to stay calm.' },
  { word: 'argue', chinese: '争论', english: 'argue', example: 'They argue about politics every week.' },
  { word: 'arrange', chinese: '安排', english: 'arrange', example: 'Let\'s arrange a meeting for next week.' },
  { word: 'arrive', chinese: '到达', english: 'arrive', example: 'What time will you arrive at the station?' },
  { word: 'article', chinese: '文章', english: 'article', example: 'I read an interesting article today.' },
  { word: 'artist', chinese: '艺术家', english: 'artist', example: 'The artist painted a beautiful landscape.' },
  { word: 'ashamed', chinese: '感到羞耻的', english: 'ashamed', example: 'He felt ashamed of his mistake.' },
  { word: 'assign', chinese: '分配', english: 'assign', example: 'The teacher will assign homework later.' },
  { word: 'assist', chinese: '帮助', english: 'assist', example: 'Can you assist me with this project?' },
  { word: 'assume', chinese: '假设', english: 'assume', example: 'I assume you are coming to the party.' },
  { word: 'athlete', chinese: '运动员', english: 'athlete', example: 'The athlete trained every day for the competition.' },
  { word: 'attack', chinese: '攻击', english: 'attack', example: 'The dog seemed ready to attack.' },
  { word: 'attend', chinese: '参加', english: 'attend', example: 'I will attend the lecture tomorrow.' },
  { word: 'attention', chinese: '注意力', english: 'attention', example: 'Pay attention to the teacher.' },
  { word: 'attitude', chinese: '态度', english: 'attitude', example: 'A positive attitude helps a lot.' },
  { word: 'attract', chinese: '吸引', english: 'attract', example: 'Flowers attract butterflies.' },
  { word: 'audience', chinese: '观众', english: 'audience', example: 'The audience clapped loudly.' },
  { word: 'avoid', chinese: '避免', english: 'avoid', example: 'Try to avoid making the same mistake.' },
  { word: 'award', chinese: '奖项', english: 'award', example: 'She won the best student award.' },
  { word: 'balance', chinese: '平衡', english: 'balance', example: 'Keep a balance between study and rest.' },
  { word: 'basic', chinese: '基本的', english: 'basic', example: 'Learning basic grammar is important.' },
  { word: 'bear', chinese: '忍受/熊', english: 'bear', example: 'I cannot bear this hot weather.' },
  { word: 'beauty', chinese: '美丽', english: 'beauty', example: 'The beauty of nature is amazing.' },
  { word: 'behave', chinese: '表现', english: 'behave', example: 'Please behave well in public.' },
  { word: 'belief', chinese: '信念', english: 'belief', example: 'Everyone has the right to their own belief.' },
  { word: 'belong', chinese: '属于', english: 'belong', example: 'This book belongs to me.' },
  { word: 'benefit', chinese: '益处', english: 'benefit', example: 'Reading has many benefits.' },
  { word: 'blame', chinese: '责备', english: 'blame', example: 'Don\'t blame others for your mistakes.' },
  { word: 'blanket', chinese: '毯子', english: 'blanket', example: 'The blanket keeps me warm at night.' },
  { word: 'board', chinese: '木板/董事会', english: 'board', example: 'Write your name on the board.' },
  { word: 'bored', chinese: '无聊的', english: 'bored', example: 'I am bored with this game.' },
  { word: 'borrow', chinese: '借（入）', english: 'borrow', example: 'Can I borrow your pencil?' },
  { word: 'bother', chinese: '打扰', english: 'bother', example: 'Sorry to bother you.' },
  { word: 'brave', chinese: '勇敢的', english: 'brave', example: 'The brave soldier saved many lives.' },
  { word: 'breath', chinese: '呼吸', english: 'breath', example: 'Take a deep breath and relax.' },
  { word: 'breathe', chinese: '呼吸（动词）', english: 'breathe', example: 'It\'s important to breathe deeply.' },
  { word: 'brilliant', chinese: '出色的', english: 'brilliant', example: 'She is a brilliant student.' },
  { word: 'broad', chinese: '宽阔的', english: 'broad', example: 'The river is very broad here.' },
  { word: 'budget', chinese: '预算', english: 'budget', example: 'We need to plan our budget carefully.' },
  { word: 'build', chinese: '建造', english: 'build', example: 'They want to build a new school.' },
  { word: 'burden', chinese: '负担', english: 'burden', example: 'Don\'t carry too heavy a burden.' },
  { word: 'calculate', chinese: '计算', english: 'calculate', example: 'Can you calculate the total cost?' },
  { word: 'calm', chinese: '平静的', english: 'calm', example: 'Stay calm and think carefully.' },
  { word: 'campaign', chinese: '活动/运动', english: 'campaign', example: 'The school held a charity campaign.' },
  { word: 'cancel', chinese: '取消', english: 'cancel', example: 'We had to cancel the trip due to rain.' },
  { word: 'capable', chinese: '有能力的', english: 'capable', example: 'She is capable of finishing this alone.' },
  { word: 'capital', chinese: '首都/资本', english: 'capital', example: 'Beijing is the capital of China.' },
  { word: 'captain', chinese: '队长/船长', english: 'captain', example: 'The captain led the team to victory.' },
  { word: 'capture', chinese: '捕获', english: 'capture', example: 'The photo captures a beautiful moment.' },
  { word: 'career', chinese: '职业', english: 'career', example: 'She wants to pursue a career in medicine.' },
  { word: 'careful', chinese: '仔细的', english: 'careful', example: 'Be careful when crossing the road.' },
  { word: 'castle', chinese: '城堡', english: 'castle', example: 'The castle stands on a hill.' },
  { word: 'cause', chinese: '原因/导致', english: 'cause', example: 'What is the cause of this problem?' },
  { word: 'celebrate', chinese: '庆祝', english: 'celebrate', example: 'We celebrate New Year with fireworks.' },
  { word: 'century', chinese: '世纪', english: 'century', example: 'This painting is from the 19th century.' },
  { word: 'ceremony', chinese: '仪式', english: 'ceremony', example: 'The opening ceremony was wonderful.' },
  { word: 'challenge', chinese: '挑战', english: 'challenge', example: 'This test is a big challenge for me.' },
  { word: 'chamber', chinese: '房间', english: 'chamber', example: 'The royal chamber was beautifully decorated.' },
  { word: 'champion', chinese: '冠军', english: 'champion', example: 'She became the world champion in swimming.' },
  { word: 'channel', chinese: '频道/渠道', english: 'channel', example: 'Change the TV channel, please.' },
  { word: 'chapter', chinese: '章节', english: 'chapter', example: 'Read the first chapter for tomorrow.' },
  { word: 'character', chinese: '角色/性格', english: 'character', example: 'The story has many interesting characters.' },
]

const EBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30]

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

function getDateStr(daysFromNow: number) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function getHanziForToday(dayOfYear: number): HanziWord[] {
  const start = (dayOfYear * 5) % HANZI_POOL.length
  return [0, 1, 2, 3, 4].map(i => HANZI_POOL[(start + i) % HANZI_POOL.length])
}

function getWordsForToday(dayOfYear: number): PetWord[] {
  const start = (dayOfYear * 8) % PET_POOL.length
  return [0, 1, 2, 3, 4, 5, 6, 7].map(i => PET_POOL[(start + i) % PET_POOL.length])
}

type LearnState = 'choice' | 'correct' | 'wrong'
type ReviewState = 'choice' | 'correct' | 'wrong'

interface Props {
  childId: ChildId
  theme: any
}

export default function LearnPage({ childId, theme }: Props) {
  const [tab, setTab] = useState<'learn' | 'review'>('learn')
  const [reviews, setReviews] = useState<Record<string, ReviewEntry>>(() => {
    try {
      const saved = localStorage.getItem(`pet-island-${childId}-reviews`)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  // Learn tab state
  const [learnState, setLearnState] = useState<LearnState>('choice')
  const [learnIdx, setLearnIdx] = useState(0)
  const [hanziOptions, setHanziOptions] = useState<HanziWord[]>([])
  const [wordOptions, setWordOptions] = useState<PetWord[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [wrongIdx, setWrongIdx] = useState<number | null>(null)
  const [cardFlash, setCardFlash] = useState(false)
  const [learnedKeys, setLearnedKeys] = useState<string[]>([])

  // Review tab state
  const [reviewState, setReviewState] = useState<ReviewState>('choice')
  const [reviewIdx, setReviewIdx] = useState(0)
  const [reviewOptions, setReviewOptions] = useState<(HanziWord | PetWord)[]>([])
  const [reviewSelectedIdx, setReviewSelectedIdx] = useState<number | null>(null)
  const [reviewWrongIdx, setReviewWrongIdx] = useState<number | null>(null)
  const [reviewCardFlash, setReviewCardFlash] = useState(false)
  const [reviewMsg, setReviewMsg] = useState('')
  // Guard: prevent useEffect from double-advancing after manual correct advance
  const reviewJustAdvanced = useRef(false)

  const isYuanyuan = childId === 'yuanyuan'
  const dayOfYear = getDayOfYear()
  const todayStr = getTodayStr()

  // Get today's new items
  const todaysNew: HanziWord[] | PetWord[] = isYuanyuan ? getHanziForToday(dayOfYear) : getWordsForToday(dayOfYear)

  // Filter reviews due today
  const dueForReview = Object.entries(reviews).filter(([key, entry]) => {
    return entry.nextReviewDate <= todayStr && entry.level < 6
  }).map(([key]) => key)

  const mastered = Object.entries(reviews).filter(([, e]) => e.level >= 6).length
  const newCount = todaysNew.filter(item => {
    const key = isYuanyuan ? `hanzi-${(item as HanziWord).char}` : `word-${(item as PetWord).word}`
    return !reviews[key] && !learnedKeys.includes(key)
  }).length
  const dueCount = dueForReview.length

  // Current learn item
  const currentItem = (todaysNew as (HanziWord | PetWord)[])[learnIdx]
  const isHanzi = isYuanyuan
  const currentKey = isHanzi ? `hanzi-${(currentItem as HanziWord).char}` : `word-${(currentItem as PetWord).word}`
  const isAlreadyLearned = !!reviews[currentKey] || learnedKeys.includes(currentKey)

  // Generate options when item changes
  function generateHanziOptions(correct: HanziWord): HanziWord[] {
    const wrong = HANZI_POOL.filter(h => h.char !== correct.char)
    const shuffled = wrong.sort(() => Math.random() - 0.5).slice(0, 3)
    const combined = [...shuffled, correct].sort(() => Math.random() - 0.5)
    return combined
  }

  function generateWordOptions(correct: PetWord): PetWord[] {
    const wrong = PET_POOL.filter(w => w.word !== correct.word)
    const shuffled = wrong.sort(() => Math.random() - 0.5).slice(0, 3)
    const combined = [...shuffled, correct].sort(() => Math.random() - 0.5)
    return combined
  }

  // Initialize options when moving to learn tab or changing item
  useEffect(() => {
    if (tab === 'learn' && !isAlreadyLearned && currentItem) {
      if (isHanzi) {
        setHanziOptions(generateHanziOptions(currentItem as HanziWord))
      } else {
        setWordOptions(generateWordOptions(currentItem as PetWord))
      }
      setLearnState('choice')
      setSelectedIdx(null)
      setWrongIdx(null)
    }
  }, [tab, learnIdx])

  // On tab change: skip to first unlearned item
  useEffect(() => {
    if (tab === 'learn') {
      let idx = learnIdx
      const all = isYuanyuan ? getHanziForToday(dayOfYear) : getWordsForToday(dayOfYear)
      while (idx < all.length) {
        const key = isYuanyuan
          ? `hanzi-${(all[idx] as HanziWord).char}`
          : `word-${(all[idx] as PetWord).word}`
        if (!reviews[key] && !learnedKeys.includes(key)) break
        idx++
      }
      if (idx !== learnIdx && idx < all.length) setLearnIdx(idx)
    }
  }, [tab])

  function handleLearnSelect(optionIdx: number) {
    if (learnState !== 'choice') return
    setSelectedIdx(optionIdx)

    if (isHanzi) {
      const correct = currentItem as HanziWord
      const selected = hanziOptions[optionIdx]
      if (selected.char === correct.char) {
        setLearnState('correct')
        setCardFlash(true)
        setTimeout(() => setCardFlash(false), 600)
        const newEntry: ReviewEntry = {
          learnedDate: todayStr,
          nextReviewDate: getDateStr(EBINGHAUS_INTERVALS[0]),
          level: 0,
          correctCount: 0,
          incorrectCount: 0,
        }
        const updated = { ...reviews, [currentKey]: newEntry }
        setReviews(updated)
        localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(updated))
        setLearnedKeys(k => [...k, currentKey])
        setTimeout(() => {
          if (learnIdx < todaysNew.length - 1) {
            setLearnIdx(i => i + 1)
          }
        }, 1200)
      } else {
        setLearnState('wrong')
        setWrongIdx(optionIdx)
        setTimeout(() => {
          setLearnState('choice')
          setSelectedIdx(null)
          setWrongIdx(null)
        }, 800)
      }
    } else {
      const correct = currentItem as PetWord
      const selected = wordOptions[optionIdx]
      if (selected.word === correct.word) {
        setLearnState('correct')
        setCardFlash(true)
        setTimeout(() => setCardFlash(false), 600)
        const newEntry: ReviewEntry = {
          learnedDate: todayStr,
          nextReviewDate: getDateStr(EBINGHAUS_INTERVALS[0]),
          level: 0,
          correctCount: 0,
          incorrectCount: 0,
        }
        const updated = { ...reviews, [currentKey]: newEntry }
        setReviews(updated)
        localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(updated))
        setLearnedKeys(k => [...k, currentKey])
        setTimeout(() => {
          if (learnIdx < todaysNew.length - 1) {
            setLearnIdx(i => i + 1)
          }
        }, 1200)
      } else {
        setLearnState('wrong')
        setWrongIdx(optionIdx)
        setTimeout(() => {
          setLearnState('choice')
          setSelectedIdx(null)
          setWrongIdx(null)
        }, 800)
      }
    }
  }

  // Review tab
  const dueItems = dueForReview.map(key => {
    if (key.startsWith('hanzi-')) {
      const char = key.replace('hanzi-', '')
      return { key, item: HANZI_POOL.find(h => h.char === char) || HANZI_POOL[0], type: 'hanzi' as const }
    } else {
      const word = key.replace('word-', '')
      return { key, item: PET_POOL.find(w => w.word === word) || PET_POOL[0], type: 'word' as const }
    }
  })

  const currentReview = dueItems[reviewIdx]
  const isReviewHanzi = currentReview?.type === 'hanzi'

  useEffect(() => {
    if (tab === 'review' && currentReview) {
      if (isReviewHanzi) {
        const correct = currentReview.item as HanziWord
        const wrong = HANZI_POOL.filter(h => h.char !== correct.char)
        const shuffled = wrong.sort(() => Math.random() - 0.5).slice(0, 3)
        setReviewOptions([...shuffled, correct].sort(() => Math.random() - 0.5))
      } else {
        const correct = currentReview.item as PetWord
        const wrong = PET_POOL.filter(w => w.word !== correct.word)
        const shuffled = wrong.sort(() => Math.random() - 0.5).slice(0, 3)
        setReviewOptions([...shuffled, correct].sort(() => Math.random() - 0.5))
      }
      setReviewState('choice')
      setReviewSelectedIdx(null)
      setReviewWrongIdx(null)
      setReviewMsg('')
    }
  }, [tab, reviewIdx])

  // Guard: prevent double-skip when dueItems shrinks after correct answer
  useEffect(() => {
    if (tab !== 'review') return
    if (reviewJustAdvanced.current) {
      reviewJustAdvanced.current = false
      return
    }
    // Auto-skip items that no longer need review (level>=6 or moved to future)
    if (currentReview && (currentReview.item as any).char !== undefined) {
      const entry = reviews[currentReview.key]
      if (!entry || entry.level >= 6) {
        setReviewIdx(i => i + 1)
      }
    }
  }, [tab, reviewIdx])

  function handleReviewSelect(optionIdx: number) {
    if (reviewState !== 'choice') return
    setReviewSelectedIdx(optionIdx)

    if (isReviewHanzi) {
      const correct = currentReview.item as HanziWord
      const selected = reviewOptions[optionIdx] as HanziWord
      if (selected.char === correct.char) {
        setReviewState('correct')
        setReviewCardFlash(true)
        setTimeout(() => setReviewCardFlash(false), 600)
        const entry = reviews[currentReview.key]
        const newLevel = Math.min(6, (entry?.level || 0) + 1)
        const interval = EBINGHAUS_INTERVALS[Math.min(newLevel, EBINGHAUS_INTERVALS.length - 1)]
        const updated: ReviewEntry = {
          ...entry,
          level: newLevel,
          correctCount: (entry?.correctCount || 0) + 1,
          incorrectCount: entry?.incorrectCount || 0,
          nextReviewDate: newLevel >= 6 ? '9999-12-31' : getDateStr(interval),
        }
        const newReviews = { ...reviews, [currentReview.key]: updated }
        setReviews(newReviews)
        localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(newReviews))
        setTimeout(() => {
          const atLast = reviewIdx >= dueItems.length - 1
          reviewJustAdvanced.current = true
          if (!atLast) {
            setReviewIdx(i => i + 1)
          } else {
            setReviewState('choice')
            setReviewSelectedIdx(null)
          }
        }, 1000)
      } else {
        setReviewState('wrong')
        setReviewWrongIdx(optionIdx)
        setReviewMsg('记不住哦，再复习一次')
        const entry = reviews[currentReview.key]
        const newLevel = Math.max(0, (entry?.level || 0) - 1)
        const updated: ReviewEntry = {
          ...entry,
          level: newLevel,
          incorrectCount: (entry?.incorrectCount || 0) + 1,
          nextReviewDate: getDateStr(1),
        }
        const newReviews = { ...reviews, [currentReview.key]: updated }
        setReviews(newReviews)
        localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(newReviews))
        setTimeout(() => {
          setReviewState('choice')
          setReviewSelectedIdx(null)
          setReviewWrongIdx(null)
        }, 1500)
      }
    } else {
      const correct = currentReview.item as PetWord
      const selected = reviewOptions[optionIdx] as PetWord
      if (selected.word === correct.word) {
        setReviewState('correct')
        setReviewCardFlash(true)
        setTimeout(() => setReviewCardFlash(false), 600)
        const entry = reviews[currentReview.key]
        const newLevel = Math.min(6, (entry?.level || 0) + 1)
        const interval = EBINGHAUS_INTERVALS[Math.min(newLevel, EBINGHAUS_INTERVALS.length - 1)]
        const updated: ReviewEntry = {
          ...entry,
          level: newLevel,
          correctCount: (entry?.correctCount || 0) + 1,
          incorrectCount: entry?.incorrectCount || 0,
          nextReviewDate: newLevel >= 6 ? '9999-12-31' : getDateStr(interval),
        }
        const newReviews = { ...reviews, [currentReview.key]: updated }
        setReviews(newReviews)
        localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(newReviews))
        // Set flag BEFORE setTimeout to guard against useEffect re-running
        const atLast = reviewIdx >= dueItems.length - 1
        reviewJustAdvanced.current = true
        setTimeout(() => {
          if (!atLast) {
            setReviewIdx(i => i + 1)
          } else {
            setReviewState('choice')
            setReviewSelectedIdx(null)
          }
        }, 1000)
      } else {
        setReviewState('wrong')
        setReviewWrongIdx(optionIdx)
        setReviewMsg('记不住哦，再复习一次')
        const entry = reviews[currentReview.key]
        const newLevel = Math.max(0, (entry?.level || 0) - 1)
        const updated: ReviewEntry = {
          ...entry,
          level: newLevel,
          incorrectCount: (entry?.incorrectCount || 0) + 1,
          nextReviewDate: getDateStr(1),
        }
        const newReviews = { ...reviews, [currentReview.key]: updated }
        setReviews(newReviews)
        localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(newReviews))
        setTimeout(() => {
          setReviewState('choice')
          setReviewSelectedIdx(null)
          setReviewWrongIdx(null)
        }, 1500)
      }
    }
  }

  const accentColor = isYuanyuan ? 'yellow' : 'blue'
  const accent = `text-${accentColor}-700`
  const accentBg = `bg-${accentColor}-100`
  const button = `bg-${accentColor}-400 hover:bg-${accentColor}-500`
  const buttonText = `text-${accentColor}-900`

  return (
    <div className="p-4 space-y-4">
      {/* Progress header */}
      <div className={`pixel-card rounded-3xl p-4 ${accentBg}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`font-black text-lg ${accent}`}>
            {isYuanyuan ? '📝 认字学习' : '📖 PET 词汇'}
          </h2>
          <span className={`text-xs font-bold px-2 py-1 bg-white rounded-full ${accent}`}>
            {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1">🆕 新 <strong>{newCount}{isYuanyuan ? '/5' : '/8'}</strong></span>
          <span className="flex items-center gap-1">📅 待复习 <strong>{dueCount}</strong></span>
          <span className="flex items-center gap-1">🏆 已掌握 <strong>{mastered}</strong></span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-white rounded-2xl p-1 border-2 border-gray-200">
        <button onClick={() => setTab('learn')}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === 'learn' ? `${button} text-white` : 'text-gray-400'}`}>
          📚 学新{isYuanyuan ? '字' : '词'}
        </button>
        <button onClick={() => setTab('review')}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === 'review' ? `${button} text-white` : 'text-gray-400'}`}>
          🔄 复习 {dueCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5">{dueCount}</span>}
        </button>
      </div>

      {/* Learn tab */}
      {tab === 'learn' && (
        <div className="space-y-3">
          {learnIdx >= todaysNew.length ? (
            <div className="pixel-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-black text-gray-700 text-lg">太棒了！今天学完了！</p>
              <p className="text-sm text-gray-500 mt-1">明天再来学新内容吧~</p>
            </div>
          ) : isAlreadyLearned ? (
            <div className="pixel-card rounded-3xl p-8 text-center bg-green-50 border-2 border-green-200">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-black text-green-700">已学会！</p>
              <button onClick={() => learnIdx < todaysNew.length - 1 && setLearnIdx(i => i + 1)}
                className="mt-3 bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-xl font-bold text-sm">
                下一个 →
              </button>
            </div>
          ) : (
            <>
              {/* Question card */}
              {/* Question card */}
              <div className={`pixel-card rounded-3xl p-5 ${cardFlash ? 'bg-green-100 border-2 border-green-400 animate-pulse' : 'bg-white'} transition-all`}>
                {isHanzi ? (
                  <>
                    <div className="text-center mb-2">
                      <p className="text-5xl font-black text-gray-700 mb-1">
                        {(currentItem as HanziWord).pinyin}
                      </p>
                      <p className="text-sm text-gray-400">选出发音相同的字</p>
                    </div>
                    {/* 4 emoji option buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {hanziOptions.map((opt, optIdx) => {
                        const isSelected = selectedIdx === optIdx
                        const isWrong = optIdx === wrongIdx
                        const isCorrectAnswer = (currentItem as HanziWord).char === opt.char
                        return (
                          <button
                            key={opt.char}
                            onClick={() => handleLearnSelect(optIdx)}
                            disabled={learnState !== 'choice'}
                            className={`
                              py-4 rounded-2xl text-center text-4xl font-black transition-all active:scale-95
                              ${isWrong ? 'bg-red-200 border-2 border-red-400 animate-shake' : ''}
                              ${isSelected && learnState === 'correct' ? 'bg-green-200 border-2 border-green-400' : ''}
                              ${isSelected && learnState === 'choice' ? 'bg-yellow-100 border-2 border-yellow-400' : ''}
                              ${!isSelected && !isWrong && learnState === 'choice' ? 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent' : ''}
                              ${learnState === 'correct' && isCorrectAnswer ? 'bg-green-200 border-2 border-green-400' : ''}
                              ${learnState === 'wrong' && isCorrectAnswer ? 'bg-green-100 border-2 border-green-300' : ''}
                              disabled:cursor-not-allowed
                            `}
                          >
                            {opt.emoji}
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-2xl font-black text-blue-700">{(currentItem as PetWord).word}</p>
                      <p className="text-sm text-gray-400 mt-1">选出对应的中文解释</p>
                    </div>
                    {/* 4 Chinese meaning option buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {wordOptions.map((opt, optIdx) => {
                        const isSelected = selectedIdx === optIdx
                        const isWrong = optIdx === wrongIdx
                        const isCorrectAnswer = (currentItem as PetWord).word === opt.word
                        return (
                          <button
                            key={opt.word + optIdx}
                            onClick={() => handleLearnSelect(optIdx)}
                            disabled={learnState !== 'choice'}
                            className={`
                              py-4 px-2 rounded-2xl text-center font-bold text-sm transition-all active:scale-95
                              ${isWrong ? 'bg-red-200 border-2 border-red-400 animate-shake' : ''}
                              ${isSelected && learnState === 'correct' ? 'bg-green-200 border-2 border-green-400' : ''}
                              ${isSelected && learnState === 'choice' ? 'bg-yellow-100 border-2 border-yellow-400' : ''}
                              ${!isSelected && !isWrong && learnState === 'choice' ? 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent' : ''}
                              ${learnState === 'correct' && isCorrectAnswer ? 'bg-green-200 border-2 border-green-400' : ''}
                              ${learnState === 'wrong' && isCorrectAnswer ? 'bg-green-100 border-2 border-green-300' : ''}
                              disabled:cursor-not-allowed
                            `}
                          >
                            <div className="text-base font-black">{opt.chinese}</div>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
                {/* Feedback */}
                {learnState === 'correct' && (
                  <div className="mt-3 text-center animate-pop-in">
                    <span className="bg-green-400 text-white px-4 py-1 rounded-full font-bold text-sm">✅ 正确！太棒了！</span>
                  </div>
                )}
                {learnState === 'wrong' && (
                  <div className="mt-3 text-center animate-pop-in">
                    <span className="bg-red-400 text-white px-4 py-1 rounded-full font-bold text-sm">❌ 不对哦，再试一次！</span>
                  </div>
                )}
              </div>

              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2">
                {todaysNew.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === learnIdx ? 'bg-yellow-400 w-4' : idx < learnIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-center text-xs text-gray-400">
                第 {learnIdx + 1} / {todaysNew.length} 个 {isYuanyuan ? '字' : '词'}
              </p>
            </>
          )}
        </div>
      )}

      {/* Review tab */}
      {tab === 'review' && (
        <div className="space-y-3">
          {dueItems.length === 0 ? (
            <div className="pixel-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-black text-gray-700 text-lg">太棒了！</p>
              <p className="text-sm text-gray-500 mt-1">今天没有需要复习的内容~</p>
            </div>
          ) : (
            <>
              {/* Review question card */}
              <div className={`pixel-card rounded-3xl p-5 ${reviewCardFlash ? 'bg-green-100 border-2 border-green-400 animate-pulse' : 'bg-white'} transition-all`}>
                {isReviewHanzi ? (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-3xl font-black text-gray-700">{(currentReview.item as HanziWord).pinyin}</p>
                      <p className="text-base text-gray-500">选出发音相同的字</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(reviewOptions as HanziWord[]).map((opt, optIdx) => {
                        const isWrong = optIdx === reviewWrongIdx
                        const isSelected = reviewSelectedIdx === optIdx
                        const isCorrectAnswer = (currentReview.item as HanziWord).char === opt.char
                        return (
                          <button
                            key={opt.char}
                            onClick={() => handleReviewSelect(optIdx)}
                            disabled={reviewState !== 'choice'}
                            className={`
                              py-4 rounded-2xl text-center text-4xl font-black transition-all active:scale-95
                              ${isWrong ? 'bg-red-200 border-2 border-red-400 animate-shake' : ''}
                              ${isSelected && reviewState === 'correct' ? 'bg-green-200 border-2 border-green-400' : ''}
                              ${isSelected && reviewState === 'choice' ? 'bg-yellow-100 border-2 border-yellow-400' : ''}
                              ${!isSelected && !isWrong && reviewState === 'choice' ? 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent' : ''}
                              ${reviewState === 'correct' && isCorrectAnswer ? 'bg-green-200 border-2 border-green-400' : ''}
                              ${reviewState === 'wrong' && isCorrectAnswer ? 'bg-green-100 border-2 border-green-300' : ''}
                              disabled:cursor-not-allowed
                            `}
                          >
                            {opt.char}
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-2">
                      <p className="text-2xl font-black text-blue-700">{(currentReview.item as PetWord).chinese}</p>
                      <p className="text-xs text-gray-400 mt-1">选出对应的英文单词</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(reviewOptions as PetWord[]).map((opt, optIdx) => {
                        const isWrong = optIdx === reviewWrongIdx
                        const isSelected = reviewSelectedIdx === optIdx
                        const isCorrectAnswer = (currentReview.item as PetWord).word === opt.word
                        return (
                          <button
                            key={opt.word + optIdx}
                            onClick={() => handleReviewSelect(optIdx)}
                            disabled={reviewState !== 'choice'}
                            className={`
                              py-4 px-2 rounded-2xl text-center font-bold text-sm transition-all active:scale-95
                              ${isWrong ? 'bg-red-200 border-2 border-red-400 animate-shake' : ''}
                              ${isSelected && reviewState === 'correct' ? 'bg-green-200 border-2 border-green-400' : ''}
                              ${isSelected && reviewState === 'choice' ? 'bg-yellow-100 border-2 border-yellow-400' : ''}
                              ${!isSelected && !isWrong && reviewState === 'choice' ? 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent' : ''}
                              ${reviewState === 'correct' && isCorrectAnswer ? 'bg-green-200 border-2 border-green-400' : ''}
                              ${reviewState === 'wrong' && isCorrectAnswer ? 'bg-green-100 border-2 border-green-300' : ''}
                              disabled:cursor-not-allowed
                            `}
                          >
                            <div className="text-base font-black">{opt.word}</div>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
                {reviewMsg && (
                  <div className="mt-3 text-center animate-pop-in">
                    <span className="bg-red-400 text-white px-4 py-1 rounded-full font-bold text-sm">{reviewMsg}</span>
                  </div>
                )}
                {reviewState === 'correct' && (
                  <div className="mt-3 text-center animate-pop-in">
                    <span className="bg-green-400 text-white px-4 py-1 rounded-full font-bold text-sm">✅ 正确！</span>
                  </div>
                )}
              </div>

              {/* Review progress */}
              <div className="flex items-center justify-center gap-2">
                {dueItems.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === reviewIdx ? 'bg-yellow-400 w-4' : idx < reviewIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-center text-xs text-gray-400">
                第 {reviewIdx + 1} / {dueItems.length} 个
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
