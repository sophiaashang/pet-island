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
  { word: 'abandon', chinese: '放弃', english: 'abandon', example: 'Never abandon your dreams.' },
  { word: 'ability', chinese: '能力', english: 'ability', example: 'She has the ability to learn quickly.' },
  { word: 'able', chinese: '能够', english: 'able', example: 'I am able to finish on time.' },
  { word: 'about', chinese: '关于', english: 'about', example: 'This book is about animals.' },
  { word: 'above', chinese: '在...之上', english: 'above', example: 'The birds fly above the clouds.' },
  { word: 'abroad', chinese: '在国外', english: 'abroad', example: 'She studies abroad in the UK.' },
  { word: 'absent', chinese: '缺席的', english: 'absent', example: 'He was absent from school yesterday.' },
  { word: 'accept', chinese: '接受', english: 'accept', example: 'Please accept my apologies.' },
  { word: 'accident', chinese: '事故', english: 'accident', example: 'The accident happened on the main road.' },
  { word: 'account', chinese: '账户', english: 'account', example: 'I created a new email account.' },
  { word: 'achieve', chinese: '实现/达到', english: 'achieve', example: 'Hard work helps you achieve your goals.' },
  { word: 'across', chinese: '穿过', english: 'across', example: 'The cat ran across the street.' },
  { word: 'active', chinese: '积极的/活跃的', english: 'active', example: 'He leads an active lifestyle.' },
  { word: 'actor', chinese: '演员', english: 'actor', example: 'The actor performed beautifully.' },
  { word: 'actually', chinese: '实际上', english: 'actually', example: 'I actually prefer tea to coffee.' },
  { word: 'add', chinese: '添加', english: 'add', example: 'Add some sugar to the tea.' },
  { word: 'advice', chinese: '建议', english: 'advice', example: 'Can you give me some advice?' },
  { word: 'afford', chinese: '负担得起', english: 'afford', example: 'I cannot afford a new car.' },
  { word: 'afraid', chinese: '害怕的', english: 'afraid', example: 'She is afraid of spiders.' },
  { word: 'after', chinese: '在...之后', english: 'after', example: 'Let\'s meet after school.' },
  { word: 'again', chinese: '再次', english: 'again', example: 'Please try again!' },
  { word: 'against', chinese: '反对', english: 'against', example: 'We are against bullying.' },
  { word: 'age', chinese: '年龄', english: 'age', example: 'What is your age?' },
  { word: 'agree', chinese: '同意', english: 'agree', example: 'I agree with your idea.' },
  { word: 'allow', chinese: '允许', english: 'allow', example: 'My parents allow me to play games.' },
  { word: 'alone', chinese: '独自地', english: 'alone', example: 'She likes to read alone.' },
  { word: 'already', chinese: '已经', english: 'already', example: 'I have already finished homework.' },
  { word: 'also', chinese: '也', english: 'also', example: 'I like reading and also enjoy drawing.' },
  { word: 'although', chinese: '虽然', english: 'although', example: 'Although it was raining, we went out.' },
  { word: 'always', chinese: '总是', english: 'always', example: 'He always arrives on time.' },
  { word: 'amazing', chinese: '令人惊讶的', english: 'amazing', example: 'The sunset was absolutely amazing.' },
  { word: 'ancient', chinese: '古代的', english: 'ancient', example: 'The Great Wall is an ancient wonder.' },
  { word: 'anger', chinese: '愤怒', english: 'anger', example: 'He could not control his anger.' },
  { word: 'animal', chinese: '动物', english: 'animal', example: 'Every animal has its own way of living.' },
  { word: 'announce', chinese: '宣布', english: 'announce', example: 'The school will announce results tomorrow.' },
  { word: 'anxious', chinese: '焦虑的', english: 'anxious', example: 'She felt anxious before the exam.' },
  { word: 'appear', chinese: '出现', english: 'appear', example: 'The sun appears early in summer.' },
  { word: 'apply', chinese: '申请', english: 'apply', example: 'You need to apply for this scholarship.' },
  { word: 'appreciate', chinese: '感激', english: 'appreciate', example: 'I really appreciate your help.' },
  { word: 'approach', chinese: '接近/方法', english: 'approach', example: 'The best approach is to stay calm.' },
  { word: 'argue', chinese: '争论', english: 'argue', example: 'They argue about politics every week.' },
  { word: 'arrange', chinese: '安排', english: 'arrange', example: 'Let\'s arrange a meeting for next week.' },
  { word: 'arrive', chinese: '到达', english: 'arrive', example: 'What time will you arrive?' },
  { word: 'article', chinese: '文章', english: 'article', example: 'I read an interesting article today.' },
  { word: 'artist', chinese: '艺术家', english: 'artist', example: 'The artist painted a beautiful landscape.' },
  { word: 'ashamed', chinese: '感到羞耻的', english: 'ashamed', example: 'He felt ashamed of his mistake.' },
  { word: 'assign', chinese: '分配', english: 'assign', example: 'The teacher will assign homework later.' },
  { word: 'assist', chinese: '帮助', english: 'assist', example: 'Can you assist me with this project?' },
  { word: 'assume', chinese: '假设', english: 'assume', example: 'I assume you are coming to the party.' },
  { word: 'athlete', chinese: '运动员', english: 'athlete', example: 'The athlete trained every day.' },
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
const EB = [1, 2, 4, 7, 15, 30]
const today = () => new Date().toISOString().slice(0, 10)
const dateN = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
const doy = (() => { const n = new Date(), s = new Date(n.getFullYear(), 0, 0); return Math.floor((n.getTime() - s.getTime()) / 864e5) })()
const getH = (d: number) => { const s = (d * 5) % HANZI_POOL.length; return [0,1,2,3,4].map(i => HANZI_POOL[(s+i) % HANZI_POOL.length]) }
const getW = (d: number) => { const s = (d * 8) % PET_POOL.length; return [0,1,2,3,4,5,6,7].map(i => PET_POOL[(s+i) % PET_POOL.length]) }

interface Props { childId: ChildId; theme: any }

// Key fix: learnGuardRef prevents learn tab auto-skip from firing
// while the "correct" feedback is being displayed (1.2s).
// reviewGuardRef prevents review tab auto-skip during its 1s "correct" display.
export default function LearnPage({ childId, theme }: Props) {
  const [tab, setTab] = useState<'learn'|'review'>('learn')
  const [reviews, setReviews] = useState<Record<string,ReviewEntry>>(() => { try { return JSON.parse(localStorage.getItem(`pet-island-${childId}-reviews`) || '{}') } catch { return {} } })
  // Learn tab
  const [ls, setLs] = useState<'c'|'ok'|'err'>('c')
  const [li, setLi] = useState(0)
  const [hO, setHO] = useState<HanziWord[]>([])
  const [wO, setWO] = useState<PetWord[]>([])
  const [si, setSi] = useState<number|null>(null)
  const [wi, setWi] = useState<number|null>(null)
  const [fl, setFl] = useState(false)
  const [lk, setLk] = useState<string[]>([])
  // Review tab
  const [rs, setRs] = useState<'c'|'ok'|'err'>('c')
  const [ri, setRi] = useState(0)
  const [ro, setRo] = useState<(HanziWord|PetWord)[]>([])
  const [rsi, setRsi] = useState<number|null>(null)
  const [rwi, setRwi] = useState<number|null>(null)
  const [rf, setRf] = useState(false)
  const [rm, setRm] = useState('')
  // Guards prevent auto-skip from firing during feedback display
  const learnGuard = useRef(false)
  const reviewGuard = useRef(false)

  const isY = childId === 'yuanyuan'
  const tn: (HanziWord|PetWord)[] = isY ? getH(doy) : getW(doy)
  const dk = Object.entries(reviews).filter(([,e]) => e.nextReviewDate <= today() && e.level < 6).map(([k]) => k)
  const ma = Object.entries(reviews).filter(([,e]) => e.level >= 6).length
  const nc = tn.filter(item => { const k = isY ? `hanzi-${(item as HanziWord).char}` : `word-${(item as PetWord).word}`; return !reviews[k] && !lk.includes(k) }).length
  const di = dk.map(k => k.startsWith('hanzi-') ? { k, item: HANZI_POOL.find(h => h.char === k.slice(6)) || HANZI_POOL[0], t: 'h' as const } : { k, item: PET_POOL.find(p => p.word === k.slice(5)) || PET_POOL[0], t: 'w' as const })
  const ci = tn[li]
  const ck = isY ? `hanzi-${(ci as HanziWord).char}` : `word-${(ci as PetWord).word}`
  const al = !!reviews[ck] || lk.includes(ck)
  const cr = di[ri]

  // Init options
  useEffect(() => {
    if (tab !== 'learn' || al || !ci) return
    if (isY) { const c = ci as HanziWord; setHO([...HANZI_POOL.filter(h => h.char !== c.char).sort(() => Math.random()-.5).slice(0,3), c].sort(() => Math.random()-.5)) }
    else { const w = ci as PetWord; setWO([...PET_POOL.filter(p => p.word !== w.word).sort(() => Math.random()-.5).slice(0,3), w].sort(() => Math.random()-.5)) }
    setLs('c'); setSi(null); setWi(null)
  }, [tab, li])

  // Learn tab: skip learned items when switching tabs
  useEffect(() => {
    if (tab !== 'learn') return
    let idx = li
    const all = isY ? getH(doy) : getW(doy)
    while (idx < all.length) {
      const k = isY ? `hanzi-${(all[idx] as HanziWord).char}` : `word-${(all[idx] as PetWord).word}`
      if (!reviews[k] && !lk.includes(k)) break
      idx++
    }
    if (idx !== li && idx < all.length) setLi(idx)
  }, [tab])

  function handleLearnSelect(idx: number) {
    if (ls !== 'c') return
    setSi(idx)
    const ok = isY ? (hO[idx] as HanziWord).char === (ci as HanziWord).char : (wO[idx] as PetWord).word === (ci as PetWord).word
    if (ok) {
      setLs('ok'); setFl(true); setTimeout(() => setFl(false), 600)
      const e: ReviewEntry = { learnedDate: today(), nextReviewDate: dateN(EB[0]), level: 0, correctCount: 0, incorrectCount: 0 }
      const u = { ...reviews, [ck]: e }
      setReviews(u); localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(u))
      setLk(k => [...k, ck])
      // FIX: set guard BEFORE timeout so auto-skip effect doesn't fire during display
      learnGuard.current = true
      setTimeout(() => {
        learnGuard.current = false
        setLi(i => i + 1)
      }, 1200)
    } else {
      setLs('err'); setWi(idx)
      setTimeout(() => { setLs('c'); setSi(null); setWi(null) }, 800)
    }
  }

  // Learn tab auto-skip: skip items that are now learned (but NOT during feedback display)
  useEffect(() => {
    if (tab !== 'learn') return
    if (learnGuard.current) return  // skip during feedback display
    if (!al) return
    let idx = li + 1
    const all = isY ? getH(doy) : getW(doy)
    while (idx < all.length) {
      const k = isY ? `hanzi-${(all[idx] as HanziWord).char}` : `word-${(all[idx] as PetWord).word}`
      if (!reviews[k] && !lk.includes(k)) break
      idx++
    }
    if (idx !== li && idx < all.length) setLi(idx)
  }, [tab, li, al])

  // Review options init
  useEffect(() => {
    if (tab !== 'review' || !cr) return
    if (cr.t === 'h') { const c = cr.item as HanziWord; setRo([...HANZI_POOL.filter(h => h.char !== c.char).sort(() => Math.random()-.5).slice(0,3), c].sort(() => Math.random()-.5)) }
    else { const w = cr.item as PetWord; setRo([...PET_POOL.filter(p => p.word !== w.word).sort(() => Math.random()-.5).slice(0,3), w].sort(() => Math.random()-.5)) }
    setRs('c'); setRsi(null); setRwi(null); setRm('')
  }, [tab, ri])

  // Review auto-skip: skip mastered items (level >= 6). Guard prevents skip during 'ok'/'err' display.
  useEffect(() => {
    if (tab !== 'review') return
    if (reviewGuard.current) { reviewGuard.current = false; return }
    if (!cr) return
    const e = reviews[cr.k]
    if (!e || e.level >= 6) { reviewGuard.current = true; setRi(i => Math.min(i + 1, di.length - 1)) }
  }, [tab, ri])

  function handleReviewSelect(idx: number) {
    if (rs !== 'c' || !cr) return
    setRsi(idx)
    const isH = cr.t === 'h'
    const correct = cr.item as HanziWord | PetWord
    const sel = ro[idx] as HanziWord | PetWord
    const ok = isH ? (sel as HanziWord).char === (correct as HanziWord).char : (sel as PetWord).word === (correct as PetWord).word
    if (ok) {
      setRs('ok'); setRf(true); setTimeout(() => setRf(false), 600)
      const e = reviews[cr.k]
      const nl = Math.min(6, (e?.level || 0) + 1)
      const iv = EB[Math.min(nl, EB.length - 1)]
      const updated: ReviewEntry = { ...e, level: nl, correctCount: (e?.correctCount||0)+1, incorrectCount: e?.incorrectCount||0, nextReviewDate: nl >= 6 ? '9999-12-31' : dateN(iv) }
      const nr = { ...reviews, [cr.k]: updated }
      setReviews(nr); localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(nr))
      // FIX: guard BEFORE timeout so auto-skip doesn't fire during 1s "ok" display
      reviewGuard.current = true
      const atLast = ri >= di.length - 1
      setTimeout(() => {
        reviewGuard.current = false
        if (!atLast) setRi(i => i + 1)
        else { setRs('c'); setRsi(null) }
      }, 1000)
    } else {
      setRs('err'); setRwi(idx); setRm('记不住哦，再复习一次')
      const e = reviews[cr.k]
      const nl = Math.max(0, (e?.level || 0) - 1)
      const updated: ReviewEntry = { ...e, level: nl, incorrectCount: (e?.incorrectCount||0)+1, nextReviewDate: dateN(1) }
      setReviews({ ...reviews, [cr.k]: updated }); localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify({ ...reviews, [cr.k]: updated }))
      setTimeout(() => { setRs('c'); setRsi(null); setRwi(null) }, 1500)
    }
  }

  const ac = isY ? 'yellow' : 'blue'
  const bc = `bg-${ac}-400 hover:bg-${ac}-500`
  function cls(isS: boolean, isW: boolean, isCA: boolean, st: string, size: string = 'text-4xl') {
    let c = `py-4 rounded-2xl text-center font-black transition-all active:scale-95 ${size} `
    if (isW) return c + 'bg-red-200 border-2 border-red-400 animate-shake'
    if (isS && st === 'ok') return c + 'bg-green-200 border-2 border-green-400'
    if (isS && st === 'c') return c + 'bg-yellow-100 border-2 border-yellow-400'
    if (!isS && !isW && st === 'c') return c + 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
    if (st === 'ok' && isCA) return c + 'bg-green-200 border-2 border-green-400'
    if (st === 'err' && isCA) return c + 'bg-green-100 border-2 border-green-300'
    return c + 'bg-gray-50 border-2 border-transparent'
  }

  return (
    <div className="p-4 space-y-4">
      <div className={`pixel-card rounded-3xl p-4 bg-${ac}-100`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`font-black text-lg text-${ac}-700`}>{isY ? '📝 认字学习' : '📖 PET 词汇'}</h2>
          <span className={`text-xs font-bold px-2 py-1 bg-white rounded-full text-${ac}-700`}>{new Date().toLocaleDateString('zh-CN', {month:'long',day:'numeric'})}</span>
        </div>
        <div className="flex gap-4 text-sm">
          <span>🆕 新 <strong>{nc}{isY?'/5':'/8'}</strong></span>
          <span>📅 待复习 <strong>{dk.length}</strong></span>
          <span>🏆 已掌握 <strong>{ma}</strong></span>
        </div>
      </div>
      <div className="flex bg-white rounded-2xl p-1 border-2 border-gray-200">
        <button onClick={() => setTab('learn')} className={`flex-1 py-2 rounded-xl font-bold text-sm ${tab==='learn'?bc+' text-white':'text-gray-400'}`}>
          📚 学新{isY?'字':'词'}
        </button>
        <button onClick={() => setTab('review')} className={`flex-1 py-2 rounded-xl font-bold text-sm ${tab==='review'?bc+' text-white':'text-gray-400'}`}>
          🔄 复习 {dk.length>0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 ml-1">{dk.length}</span>}
        </button>
      </div>

      {tab === 'learn' && (
        <div className="space-y-3">
          {li >= tn.length ? (
            <div className="pixel-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-black text-gray-700 text-lg">太棒了！今天学完了！</p>
              <p className="text-sm text-gray-500 mt-1">明天再来学新内容吧~</p>
            </div>
          ) : al ? (
            <div className="pixel-card rounded-3xl p-8 text-center bg-green-50 border-2 border-green-200">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-black text-green-700">已学会！</p>
              <button onClick={() => setLi(i => Math.min(i + 1, tn.length - 1))} className="mt-3 bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-xl font-bold text-sm">下一个 →</button>
            </div>
          ) : (
            <>
              <div className={`pixel-card rounded-3xl p-5 ${fl?'bg-green-100 border-2 border-green-400 animate-pulse':'bg-white'} transition-all`}>
                {isY ? (
                  <>
                    <div className="text-center mb-2">
                      <p className="text-5xl font-black text-gray-700 mb-1">{(ci as HanziWord).pinyin}</p>
                      <p className="text-sm text-gray-400">选出发音相同的字</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {hO.map((opt, i) => {
                        const isS = si === i, isW = i === wi, isCA = (ci as HanziWord).char === opt.char
                        return <button key={opt.char} onClick={() => handleLearnSelect(i)} disabled={ls!=='c'} className={`${cls(isS,isW,isCA,ls)} ${ls!=='c'?'disabled:cursor-not-allowed':''}`}>{opt.emoji}</button>
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-2xl font-black text-blue-700">{(ci as PetWord).word}</p>
                      <p className="text-sm text-gray-400 mt-1">选出对应的中文解释</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {wO.map((opt, i) => {
                        const isS = si === i, isW = i === wi, isCA = (ci as PetWord).word === opt.word
                        return <button key={opt.word+i} onClick={() => handleLearnSelect(i)} disabled={ls!=='c'} className={`${cls(isS,isW,isCA,ls)} text-sm`}><div className="text-base font-black">{opt.chinese}</div></button>
                      })}
                    </div>
                  </>
                )}
                {ls === 'ok' && <div className="mt-3 text-center"><span className="bg-green-400 text-white px-4 py-1 rounded-full font-bold text-sm">✅ 正确！太棒了！</span></div>}
                {ls === 'err' && <div className="mt-3 text-center"><span className="bg-red-400 text-white px-4 py-1 rounded-full font-bold text-sm">❌ 不对哦，再试一次！</span></div>}
              </div>
              <div className="flex items-center justify-center gap-2">
                {tn.map((_: any, i: number) => <div key={i} className={"w-2 h-2 rounded-full transition-all " + (i === li ? "bg-yellow-400 w-4" : i < li ? "bg-green-400" : "bg-gray-200")} />)}
              </div>
              <p className="text-center text-xs text-gray-400">第 {li + 1} / {tn.length} 个 {isY?'字':'词'}</p>
            </>
          )}
        </div>
      )}

      {tab === 'review' && (
        <div className="space-y-3">
          {di.length === 0 ? (
            <div className="pixel-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-black text-gray-700 text-lg">太棒了！</p>
              <p className="text-sm text-gray-500 mt-1">今天没有需要复习的内容~</p>
            </div>
          ) : !cr ? (
            <div className="pixel-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-black text-gray-700 text-lg">复习完毕！</p>
              <p className="text-sm text-gray-500 mt-1">今天的复习都完成了~</p>
            </div>
          ) : (
            <>
              <div className={`pixel-card rounded-3xl p-5 ${rf?'bg-green-100 border-2 border-green-400 animate-pulse':'bg-white'} transition-all`}>
                {cr.t === 'h' ? (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-3xl font-black text-gray-700">{(cr.item as HanziWord).pinyin}</p>
                      <p className="text-base text-gray-500">选出发音相同的字</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(ro as HanziWord[]).map((opt, i) => {
                        const isS = rsi === i, isW = i === rwi, isCA = (cr.item as HanziWord).char === opt.char
                        return <button key={opt.char} onClick={() => handleReviewSelect(i)} disabled={rs!=='c'} className={`${cls(isS,isW,isCA,rs)} ${rs!=='c'?'disabled:cursor-not-allowed':''}`}>{opt.char}</button>
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-2">
                      <p className="text-2xl font-black text-blue-700">{(cr.item as PetWord).chinese}</p>
                      <p className="text-xs text-gray-400 mt-1">选出对应的英文单词</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(ro as PetWord[]).map((opt, i) => {
                        const isS = rsi === i, isW = i === rwi, isCA = (cr.item as PetWord).word === opt.word
                        return <button key={opt.word+i} onClick={() => handleReviewSelect(i)} disabled={rs!=='c'} className={`${cls(isS,isW,isCA,rs)} text-sm`}><div className="text-base font-black">{opt.word}</div></button>
                      })}
                    </div>
                  </>
                )}
                {rm && <div className="mt-3 text-center"><span className="bg-red-400 text-white px-4 py-1 rounded-full font-bold text-sm">{rm}</span></div>}
                {rs === 'ok' && <div className="mt-3 text-center"><span className="bg-green-400 text-white px-4 py-1 rounded-full font-bold text-sm">✅ 正确！</span></div>}
              </div>
              <div className="flex items-center justify-center gap-2">
                {di.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === ri ? 'bg-yellow-400 w-4' : i < ri ? 'bg-green-400' : 'bg-gray-200'}`} />)}
              </div>
              <p className="text-center text-xs text-gray-400">第 {ri + 1} / {di.length} 个</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
