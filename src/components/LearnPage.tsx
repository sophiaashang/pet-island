import { useState, useEffect, useRef } from 'react'
import { ChildId, ReviewEntry, HanziWord, PetWord } from '../types'

// ============== 汉 字 池 ==============
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

// ============== 新北 PET 词 池 ==============
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

// ============== 元元每周PET词汇（每周10词，循环覆盖52周）==============
const YUAN_WEEKS: PetWord[][] = [
  // 第1周
  [
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
  ],
  // 第2周
  [
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
  ],
  // 第3周
  [
    { word: 'run', chinese: '跑', english: 'run', example: 'I run in the park every morning.' },
    { word: 'swim', chinese: '游泳', english: 'swim', example: 'I can swim very well.' },
    { word: 'read', chinese: '读/阅读', english: 'read', example: 'I read English books every day.' },
    { word: 'write', chinese: '写', english: 'write', example: 'I write my diary every night.' },
    { word: 'play', chinese: '玩', english: 'play', example: 'Children like to play in the park.' },
    { word: 'draw', chinese: '画画', english: 'draw', example: 'I draw pictures in art class.' },
    { word: 'sing', chinese: '唱歌', english: 'sing', example: 'I like to sing English songs.' },
    { word: 'jump', chinese: '跳', english: 'jump', example: 'The rabbit can jump very high.' },
    { word: 'walk', chinese: '走路', english: 'walk', example: 'I walk to school every day.' },
    { word: 'climb', chinese: '爬', english: 'climb', example: 'I climb the hill with my dad.' },
  ],
  // 第4周
  [
    { word: 'rain', chinese: '雨', english: 'rain', example: 'The rain stopped and the sun came out.' },
    { word: 'snow', chinese: '雪', english: 'snow', example: 'It snowed last winter.' },
    { word: 'wind', chinese: '风', english: 'wind', example: 'The wind is very strong today.' },
    { word: 'cloud', chinese: '云', english: 'cloud', example: 'There are white clouds in the sky.' },
    { word: 'sky', chinese: '天空', english: 'sky', example: 'The sky is blue today.' },
    { word: 'star', chinese: '星星', english: 'star', example: 'I can see many stars at night.' },
    { word: 'moon', chinese: '月亮', english: 'moon', example: 'The moon is round tonight.' },
    { word: 'rainbow', chinese: '彩虹', english: 'rainbow', example: 'A rainbow appeared after the rain.' },
    { word: 'river', chinese: '河流', english: 'river', example: 'The river flows through the city.' },
    { word: 'lake', chinese: '湖泊', english: 'lake', example: 'We went boating on the lake.' },
  ],
  // 第5周
  [
    { word: 'happy', chinese: '开心的', english: 'happy', example: 'I am very happy today.' },
    { word: 'sad', chinese: '伤心的', english: 'sad', example: 'She looked sad this morning.' },
    { word: 'angry', chinese: '生气的', english: 'angry', example: 'He was angry because he lost his book.' },
    { word: 'tired', chinese: '累的', english: 'tired', example: 'I am tired after playing sports.' },
    { word: 'excited', chinese: '兴奋的', english: 'excited', example: 'The children were excited about the trip.' },
    { word: 'scared', chinese: '害怕的', english: 'scared', example: 'I am scared of the dark.' },
    { word: 'proud', chinese: '自豪的', english: 'proud', example: 'I felt proud when I got an A.' },
    { word: 'bored', chinese: '无聊的', english: 'bored', example: 'I am bored at home today.' },
    { word: 'sick', chinese: '生病的', english: 'sick', example: 'I was sick last week.' },
    { word: 'hungry', chinese: '饿的', english: 'hungry', example: 'I am hungry. When is dinner?' },
  ],
  // 第6周
  [
    { word: 'red', chinese: '红色', english: 'red', example: 'The apple is red.' },
    { word: 'blue', chinese: '蓝色', english: 'blue', example: 'The sky is blue.' },
    { word: 'green', chinese: '绿色', english: 'green', example: 'The grass is green.' },
    { word: 'yellow', chinese: '黄色', english: 'yellow', example: 'The banana is yellow.' },
    { word: 'orange', chinese: '橙色', english: 'orange', example: 'The orange is sweet.' },
    { word: 'purple', chinese: '紫色', english: 'purple', example: 'Grapes can be purple.' },
    { word: 'pink', chinese: '粉色', english: 'pink', example: 'Her dress is pink.' },
    { word: 'brown', chinese: '棕色', english: 'brown', example: 'The bear is brown.' },
    { word: 'black', chinese: '黑色', english: 'black', example: 'The cat is black.' },
    { word: 'white', chinese: '白色', english: 'white', example: 'The snow is white.' },
  ],
  // 第7周
  [
    { word: 'father', chinese: '爸爸', english: 'father', example: 'My father works in a bank.' },
    { word: 'mother', chinese: '妈妈', english: 'mother', example: 'My mother cooks breakfast for me.' },
    { word: 'brother', chinese: '哥哥/弟弟', english: 'brother', example: 'I play games with my brother.' },
    { word: 'sister', chinese: '姐姐/妹妹', english: 'sister', example: 'My sister is in Grade 4.' },
    { word: 'grandma', chinese: '奶奶/外婆', english: 'grandma', example: 'My grandma tells me stories.' },
    { word: 'grandpa', chinese: '爷爷/外公', english: 'grandpa', example: 'My grandpa grows vegetables.' },
    { word: 'baby', chinese: '婴儿', english: 'baby', example: 'The baby is sleeping now.' },
    { word: 'doctor', chinese: '医生', english: 'doctor', example: 'The doctor helped me feel better.' },
    { word: 'nurse', chinese: '护士', english: 'nurse', example: 'The nurse is very gentle.' },
    { word: 'policeman', chinese: '警察', english: 'policeman', example: 'The policeman directed traffic.' },
  ],
  // 第8周
  [
    { word: 'Monday', chinese: '星期一', english: 'Monday', example: 'Monday is the first day of school.' },
    { word: 'Tuesday', chinese: '星期二', english: 'Tuesday', example: 'I have art class on Tuesday.' },
    { word: 'Wednesday', chinese: '星期三', english: 'Wednesday', example: 'Wednesday is the middle of the week.' },
    { word: 'Thursday', chinese: '星期四', english: 'Thursday', example: 'Thursday comes after Wednesday.' },
    { word: 'Friday', chinese: '星期五', english: 'Friday', example: 'Friday is my favorite day!' },
    { word: 'Saturday', chinese: '星期六', english: 'Saturday', example: 'I sleep late on Saturday.' },
    { word: 'Sunday', chinese: '星期日', english: 'Sunday', example: 'Sunday is a rest day.' },
    { word: 'today', chinese: '今天', english: 'today', example: 'What are you doing today?' },
    { word: 'tomorrow', chinese: '明天', english: 'tomorrow', example: 'Tomorrow is a holiday.' },
    { word: 'yesterday', chinese: '昨天', english: 'yesterday', example: 'Yesterday was my birthday.' },
  ],
]

const EB = [1, 2, 4, 7, 15, 30]
const today = () => new Date().toISOString().slice(0, 10)
const dateN = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }

// 一年第几周（从1开始）
function getWeekOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
}

// 获取元元本周PET词（每周循环）
function getYuanWeekWords(): PetWord[] {
  const week = ((getWeekOfYear() - 1) % YUAN_WEEKS.length) // 0-based index
  return YUAN_WEEKS[week]
}

const doy = (() => { const n = new Date(), s = new Date(n.getFullYear(), 0, 0); return Math.floor((n.getTime() - s.getTime()) / 864e5) })()
const getH = (d: number) => { const s = (d * 5) % HANZI_POOL.length; return [0,1,2,3,4].map(i => HANZI_POOL[(s+i) % HANZI_POOL.length]) }
const getW = (d: number) => { const s = (d * 8) % PET_POOL.length; return [0,1,2,3,4,5,6,7].map(i => PET_POOL[(s+i) % PET_POOL.length]) }

interface Props { childId: ChildId; theme: any }

// 设计原则：
// LearnTab：答对后显示"下一个"按钮，用户主动点击才进下一题（不用auto-skip，无时序bug）
// ReviewTab：答对后1秒自动进下一题（auto-skip + reviewGuard保护）
export default function LearnPage({ childId, theme }: Props) {
  const [tab, setTab] = useState<'learn'|'review'>('learn')
  const [reviews, setReviews] = useState<Record<string,ReviewEntry>>(() => { try { return JSON.parse(localStorage.getItem(`pet-island-${childId}-reviews`) || '{}') } catch { return {} } })

  // --- Learn tab state ---
  const [ls, setLs] = useState<'c'|'ok'|'err'>('c')      // c=choice, ok=correct, err=wrong
  const [li, setLi] = useState(0)                          // current item index
  const [hO, setHO] = useState<HanziWord[]>([])
  const [wO, setWO] = useState<PetWord[]>([])
  const [si, setSi] = useState<number|null>(null)          // selected option index
  const [wi, setWi] = useState<number|null>(null)          // wrong option index
  const [fl, setFl] = useState(false)                       // flash green on correct
  // justLearnedRef: 答对后置为true，下次渲染显示"下一个"按钮；用户点按钮后设回false
  const justLearnedRef = useRef(false)

  // --- Review tab state ---
  const [rs, setRs] = useState<'c'|'ok'|'err'>('c')
  const [ri, setRi] = useState(0)
  const [ro, setRo] = useState<(HanziWord|PetWord)[]>([])
  const [rsi, setRsi] = useState<number|null>(null)
  const [rwi, setRwi] = useState<number|null>(null)
  const [rf, setRf] = useState(false)
  const [rm, setRm] = useState('')
  const reviewGuard = useRef(false)

  const isY = childId === 'yuanyuan'
  const yuanWords = getYuanWeekWords()
  const weekNum = getWeekOfYear()
  // 元元用每周PET词；新北用PET词池（每天8词轮换）
  const todaysWords: (HanziWord|PetWord)[] = isY ? getH(doy) : getW(doy)
  const dk = Object.entries(reviews).filter(([,e]) => e.nextReviewDate <= today() && e.level < 6).map(([k]) => k)
  const ma = Object.entries(reviews).filter(([,e]) => e.level >= 6).length
  // 已掌握的不算新学
  const nc = todaysWords.filter(item => {
    const k = isY ? `yuan-${(item as PetWord).word}` : `word-${(item as PetWord).word}`
    return !reviews[k]
  }).length
  const di = dk.map(k => k.startsWith('hanzi-') ? { k, item: HANZI_POOL.find(h => h.char === k.slice(6)) || HANZI_POOL[0], t: 'h' as const } : { k, item: PET_POOL.find(p => p.word === k.slice(5)) || PET_POOL[0], t: 'w' as const })
  const ci: HanziWord|PetWord = todaysWords[li]
  const ck = isY ? `hanzi-${(ci as HanziWord).char}` : `word-${(ci as PetWord).word}`
  const al = !!reviews[ck] || justLearnedRef.current
  const cr = di[ri]

    useEffect(() => {
    if (tab !== 'learn' || !ci) return
    if (isY) {
      const c = ci as HanziWord
      setHO([...HANZI_POOL.filter(h => h.char !== c.char).sort(() => Math.random()-.5).slice(0,3), c].sort(() => Math.random()-.5))
    } else {
      const w = ci as PetWord
      setWO([...PET_POOL.filter(p => p.word !== w.word).sort(() => Math.random()-.5).slice(0,3), w].sort(() => Math.random()-.5))
    }
    setLs('c'); setSi(null); setWi(null)
  }, [tab, li])

  // Learn: handle option selection
  // NO auto-advance — correct answer shows "下一个" button; user clicks to advance
  function handleLearnSelect(idx: number) {
    if (ls !== 'c') return
    setSi(idx)
    const ok = isY
      ? (hO[idx] as HanziWord).char === (ci as HanziWord).char
      : (wO[idx] as PetWord).word === (ci as PetWord).word
    if (ok) {
      setLs('ok'); setFl(true); setTimeout(() => setFl(false), 600)
      // Save to reviews immediately
      const e: ReviewEntry = { learnedDate: today(), nextReviewDate: dateN(EB[0]), level: 0, correctCount: 0, incorrectCount: 0 }
      const u = { ...reviews, [ck]: e }
      setReviews(u); localStorage.setItem(`pet-island-${childId}-reviews`, JSON.stringify(u))
      // Signal: next render should show "下一个" button
      justLearnedRef.current = true
    } else {
      setLs('err'); setWi(idx)
      setTimeout(() => { setLs('c'); setSi(null); setWi(null) }, 800)
    }
  }

  // Learn: user clicks "下一个" to advance to next item
  function handleLearnNext() {
    justLearnedRef.current = false
    setLi(i => Math.min(i + 1, todaysWords.length - 1))
  }

  // Review: init options
  useEffect(() => {
    if (tab !== 'review' || !cr) return
    if (cr.t === 'h') {
      const c = cr.item as HanziWord
      setRo([...HANZI_POOL.filter(h => h.char !== c.char).sort(() => Math.random()-.5).slice(0,3), c].sort(() => Math.random()-.5))
    } else {
      const w = cr.item as PetWord
      setRo([...PET_POOL.filter(p => p.word !== w.word).sort(() => Math.random()-.5).slice(0,3), w].sort(() => Math.random()-.5))
    }
    setRs('c'); setRsi(null); setRwi(null); setRm('')
  }, [tab, ri])

  // Review: auto-skip mastered items (level>=6) — guarded so it doesn't fire during 'ok' display
  useEffect(() => {
    if (tab !== 'review') return
    if (reviewGuard.current) { reviewGuard.current = false; return }
    if (!cr) return
    const e = reviews[cr.k]
    if (!e || e.level >= 6) { reviewGuard.current = true; setRi(i => Math.min(i + 1, di.length - 1)) }
  }, [tab, ri])

  // Review: handle selection
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
      // Guard BEFORE setTimeout — prevents auto-skip during 1s display
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

  const showLearnNext = ls === 'ok' && justLearnedRef.current

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className={`pixel-card rounded-3xl p-4 bg-${ac}-100`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`font-black text-lg text-${ac}-700`}>
            {isY ? (tab === 'learn' ? '📝 认字学习' : '📖 本周单词') : (tab === 'learn' ? '📖 PET 词汇' : '📖 PET 复习')}
          </h2>
          <span className={`text-xs font-bold px-2 py-1 bg-white rounded-full text-${ac}-700`}>
            {isY && tab === 'learn' ? `第${weekNum}周` : new Date().toLocaleDateString('zh-CN', {month:'long',day:'numeric'})}
          </span>
        </div>
        <div className="flex gap-4 text-sm">
          <span>🆕 新 <strong>{nc}{isY ? `/${yuanWords.length}` : '/8'}</strong></span>
          <span>📅 待复习 <strong>{dk.length}</strong></span>
          <span>🏆 已掌握 <strong>{ma}</strong></span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-white rounded-2xl p-1 border-2 border-gray-200">
        <button onClick={() => setTab('learn')} className={`flex-1 py-2 rounded-xl font-bold text-sm ${tab==='learn'?bc+' text-white':'text-gray-400'}`}>
          📚 学{isY ? '字' : '词'}
        </button>
        <button onClick={() => setTab('review')} className={`flex-1 py-2 rounded-xl font-bold text-sm ${tab==='review'?bc+' text-white':'text-gray-400'}`}>
          🔄 复习 {dk.length>0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 ml-1">{dk.length}</span>}
        </button>
      </div>

      {/* ===== LEARN TAB ===== */}
      {tab === 'learn' && (
        <div className="space-y-3">
          {li >= todaysWords.length ? (
            <div className="pixel-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-black text-gray-700 text-lg">太棒了！{isY ? '字都学完了！' : '词都学完了！'}</p>
              <p className="text-sm text-gray-500 mt-1">明天再来学新内容吧~</p>
            </div>
          ) : (
            <>
              {/* Question card */}
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
                        return <button key={opt.char} onClick={() => handleLearnSelect(i)} disabled={ls !== 'c'} className={`${cls(isS,isW,isCA,ls)} ${ls!=='c'?'disabled:cursor-not-allowed':''}`}>{opt.emoji}</button>
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
                      {(wO as PetWord[]).map((opt, i) => {
                        const isS = si === i, isW = i === wi, isCA = (ci as PetWord).word === opt.word
                        return <button key={opt.word+i} onClick={() => handleLearnSelect(i)} disabled={ls !== 'c'} className={`${cls(isS,isW,isCA,ls)} text-sm`}><div className="text-base font-black">{opt.chinese}</div></button>
                      })}
                    </div>
                  </>
                )}
                {ls === 'ok' && (
                  <div className="mt-3 text-center"><span className="bg-green-400 text-white px-4 py-1 rounded-full font-bold text-sm">✅ 正确！</span></div>
                )}
                {ls === 'err' && (
                  <div className="mt-3 text-center"><span className="bg-red-400 text-white px-4 py-1 rounded-full font-bold text-sm">❌ 不对哦，再试一次！</span></div>
                )}
              </div>

              {/* Next button — only shows after correct answer (no auto-advance) */}
              {showLearnNext && li < todaysWords.length - 1 && (
                <button onClick={handleLearnNext}
                  className="w-full bg-green-400 hover:bg-green-500 text-white py-3 rounded-2xl font-black text-base transition-all active:scale-95">
                  下一个 →
                </button>
              )}
              {showLearnNext && li >= todaysWords.length - 1 && (
                <div className="text-center">
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">🎉 这组词学完了！</span>
                </div>
              )}

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2">
                {todaysWords.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === li ? 'bg-yellow-400 w-4' : i < li ? 'bg-green-400' : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-center text-xs text-gray-400">第 {li + 1} / {todaysWords.length} 个{isY ? '字' : '词'}</p>
            </>
          )}
        </div>
      )}

      {/* ===== REVIEW TAB ===== */}
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
