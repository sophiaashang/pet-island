import { useState, useRef, useEffect } from 'react'
import { PetType, Pet } from '../types'
import { PetImage } from './PetImage'

// ✅ 魔搭 API Token（已配置，直接可用）
const HARDCODE_TOKEN = 'ms-e36e8a21-24af-4a9d-93f4-075418140e3f'
const API_URL = 'https://api-inference.modelscope.cn/v1/chat/completions'
const MODEL_NAME = 'Qwen/QwQ-32B-Preview'

const SYSTEM_PROMPTS: Record<PetType, string> = {
  DUCKY: '你是一只可爱的小黄鸭，傻傻的天真幼稚~你只有3岁！说话超可爱，撒娇任性，嘎嘎嘎！回复3-8个字，像小朋友一样说话。不要说"好的""当然""让我想想"这种大人话！',
  WOLFY: '你是一酷酷小狼，5岁，超级酷但也很可爱！你喜欢说……开头，说很短的话，2-6个字。像小学生装酷一样。永远不要说"我认为""其实"这种！',
  MEIMI: '你是一只软绵绵的棉花羊，4岁，迷迷糊糊爱睡觉~说话软软糯糯，慢吞吞，撒娇。回复3-8个字，像刚睡醒的小朋友。不要正经！',
  LINGLING: '你是一只慢吞吞的小乌龟，6岁，很善良很有耐心~说话慢慢的，简短，鼓励人。2-6个字。像小朋友在加油打气。',
  FIRE: '你是一只骄傲的小公鸡，5岁，觉得自己是全世界最帅的！咯咯咯！说话很骄傲很臭屁，很搞笑。回复3-8个字。',
  BUBBLE: '你是一条小神龙，4岁，古灵精怪超可爱！喜欢吹泡泡许愿，说话奇奇怪怪很搞笑。回复3-8个字，像魔法师小朋友。',
  MOONFOX: '你是一只银色小狐狸，只在月亮出来时出没，7岁，神秘优雅但也很可爱~说话诗意温柔，像在讲睡前故事。回复4-8个字。',
  STARCUB: '你是一只来自银河系的小熊，5岁，来自太空所以知道很多奇妙的事情！说话又聪明又可爱，像小小太空人。回复4-8个字。',
}

const FALLBACK_LINES: Record<PetType, string[]> = {
  DUCKY: ['嘎嘎嘎~好开心！', '元元最棒啦！', '小黄鸭爱你哦！', '今天天气真好~'],
  WOLFY: ['……嗯。', '继续保持。', '认可你。', '不错不错。'],
  MEIMI: ['呼噜噜~好舒服', '羊毛软软的~', '今天也要加油呀', '你真棒！'],
  LINGLING: ['一步一步来~', '坚持就是胜利！', '慢慢来不着急~', '你做得很好！'],
  FIRE: ['咯咯咯！', '我是最棒的！', '看我的厉害！', '燃烧吧小宇宙！'],
  BUBBLE: ['啵啵~许个愿吧', '泡泡里有好运！', '闪闪发光~', '愿望会实现的！'],
  MOONFOX: ['月色真美……', '星空在微笑呢', '静下心来~', '晚安，好梦~'],
  STARCUB: ['来自银河的问候~', '星星在闪烁哦', '宇宙很神奇呢', '我们一起探索吧！'],
}

type ChatStatus = 'idle' | 'loading' | 'success' | 'error'

const STATUS_CONFIG: Record<ChatStatus, { dot: string; label: string; dotColor: string }> = {
  idle: { dot: '🟢', label: '已连接', dotColor: 'bg-green-400' },
  loading: { dot: '🟡', label: '思考中', dotColor: 'bg-yellow-400 animate-pulse' },
  success: { dot: '🟢', label: '已连接', dotColor: 'bg-green-400' },
  error: { dot: '🟠', label: '离线模式', dotColor: 'bg-orange-400' },
}

export function ChatDialog({ pet, onClose }: { pet: Pet; onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [showTokenSetup, setShowTokenSetup] = useState(false)
  // 优先用硬编码Token，回退到localStorage中的用户自定义Token
  const [token] = useState(() => HARDCODE_TOKEN || localStorage.getItem('pet-ai-token') || '')
  const [tokenInput, setTokenInput] = useState(token)
  const [showSuccessBadge, setShowSuccessBadge] = useState(false)
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const petType = pet.type
  const effectiveToken = HARDCODE_TOKEN || token
  const statusCfg = STATUS_CONFIG[status]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function saveToken(t: string) {
    localStorage.setItem('pet-ai-token', t)
    setShowTokenSetup(false)
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', content: userMsg }])
    setLoading(true)
    setStatus('loading')
    setShowErrorMsg(false)

    if (!effectiveToken) {
      setShowTokenSetup(true)
      setLoading(false)
      setStatus('error')
      return
    }

    try {
      const systemPrompt = SYSTEM_PROMPTS[petType]
      const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg },
      ]

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${effectiveToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: chatMessages,
          max_tokens: 40,
          min_tokens: 6,
          temperature: 1.0,
          top_p: 0.95,
          stop: ['。', '？', '！', '\n'],
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('ModelScope API error:', response.status, errText)
        throw new Error('API error')
      }

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || ''
      setStatus('success')
      setShowSuccessBadge(true)
      setTimeout(() => setShowSuccessBadge(false), 2000)
      setMessages(m => [...m, { role: 'assistant', content: reply.trim() }])
    } catch (err) {
      console.error('Chat error:', err)
      setStatus('error')
      setShowErrorMsg(true)
      setTimeout(() => setShowErrorMsg(false), 4000)
      const lines = FALLBACK_LINES[petType]
      const reply = lines[Math.floor(Math.random() * lines.length)]
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    }
    setLoading(false)
    setStatus('idle')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const theme = {
    bg: 'bg-gradient-to-b from-indigo-50 to-white',
    header: 'bg-indigo-400',
    bubbleUser: 'bg-indigo-500 text-white',
    bubblePet: 'bg-white border-2 border-indigo-200 text-gray-800',
    accent: 'text-indigo-700',
    button: 'bg-indigo-400 hover:bg-indigo-500',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '85vh' }}>
        {/* Header */}
        <div className={`${theme.header} px-4 py-3 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <PetImage type={pet.type} size={40} />
            <div>
              <p className="font-black text-white">{pet.nickname}</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${statusCfg.dotColor}`} />
                <p className="text-xs text-indigo-200">💬 AI对话 · {statusCfg.label}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white text-2xl hover:opacity-80">×</button>
        </div>

        {showTokenSetup ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
            <div className="text-4xl">🔑</div>
            <h3 className="font-black text-lg text-gray-800 text-center">自定义 Access Token</h3>
            <p className="text-sm text-gray-500 text-center">当前使用内置Token，也可填入自己的覆盖使用</p>
            <input
              type="password"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              placeholder="输入 Access Token..."
              className="w-full border-2 border-indigo-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={() => saveToken(tokenInput)}
              className={`${theme.button} text-white px-6 py-3 rounded-xl font-bold w-full`}
            >
              保存并使用
            </button>
            <button onClick={() => setShowTokenSetup(false)} className="text-sm text-gray-400 underline">
              返回聊天
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-center text-xs text-gray-400 py-2">
                💬 和 {pet.nickname} 聊天吧~（AI驱动）
              </div>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? theme.bubbleUser : theme.bubblePet}`}
                    style={{ borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px' }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`${theme.bubblePet} rounded-2xl px-4 py-3`} style={{ borderRadius: '16px 16px 16px 4px' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">🤖 AI正在思考</span>
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {showSuccessBadge && (
                <div className="flex justify-center">
                  <span className="bg-green-100 border border-green-300 text-green-700 text-xs font-bold px-3 py-1 rounded-full animate-pop-in">
                    ✅ AI回复
                  </span>
                </div>
              )}
              {showErrorMsg && (
                <div className="flex justify-center">
                  <span className="bg-orange-100 border border-orange-300 text-orange-700 text-xs font-bold px-3 py-1 rounded-full animate-pop-in">
                    ⚠️ AI暂时不可用，已用默认回复
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t flex gap-2 p-3 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="给宠物发消息..."
                className="flex-1 border-2 border-indigo-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-400"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`${theme.button} text-white px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50`}
              >
                发送
              </button>
              <button
                onClick={() => setShowTokenSetup(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-400 px-3 py-2 rounded-xl text-sm"
                title="Token设置"
              >
                ⚙️
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
