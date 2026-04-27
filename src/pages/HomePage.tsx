import { useNavigate } from 'react-router-dom'
import { useGameContext } from '../App'
import { PetImage } from '../components/PetImage'

export default function HomePage() {
  const navigate = useNavigate()
  const { profileMap } = useGameContext()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)' }}>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-green-800 mb-2 drop-shadow-lg">
          🌿 萌宠任务岛 🌿
        </h1>
        <p className="text-lg text-green-700 font-semibold">选择你的小岛，开启冒险！</p>
      </div>

      {/* Kids Cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        {/* Yuan Yuan */}
        <button
          onClick={() => navigate('/island/yuanyuan')}
          className="flex-1 bg-yellow-100 border-4 border-yellow-400 rounded-3xl p-6
            hover:scale-105 transition-transform cursor-pointer pixel-card"
          style={{ boxShadow: '6px 6px 0 #D4A017' }}>
          <div className="text-center">
            <div className="text-6xl mb-3">🐥</div>
            <PetImage type="DUCKY" size={80} className="mx-auto animate-bounce-idle" />
            <h2 className="text-2xl font-black text-yellow-800 mt-3">元元的小岛</h2>
            <p className="text-yellow-700 font-semibold mt-1 text-sm">5岁 · 大班</p>
            <div className="mt-3 flex justify-center gap-2 text-xs">
              <span className="bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full font-bold">
                🪙 {profileMap.yuanyuan?.totalCoins ?? 0}
              </span>
              <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-bold">
                ✅ {profileMap.yuanyuan?.tasks.filter(t => t.completedToday).length ?? 0}/{profileMap.yuanyuan?.tasks.length ?? 0}
              </span>
            </div>
          </div>
        </button>

        {/* Xinbei */}
        <button
          onClick={() => navigate('/island/xinbei')}
          className="flex-1 bg-blue-100 border-4 border-blue-400 rounded-3xl p-6
            hover:scale-105 transition-transform cursor-pointer pixel-card"
          style={{ boxShadow: '6px 6px 0 #2E4A6E' }}>
          <div className="text-center">
            <div className="text-6xl mb-3">🐺</div>
            <PetImage type="WOLFY" size={80} className="mx-auto animate-bounce-idle" />
            <h2 className="text-2xl font-black text-blue-800 mt-3">新北的小岛</h2>
            <p className="text-blue-700 font-semibold mt-1 text-sm">11岁 · 5年级</p>
            <div className="mt-3 flex justify-center gap-2 text-xs">
              <span className="bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full font-bold">
                🪙 {profileMap.xinbei?.totalCoins ?? 0}
              </span>
              <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-bold">
                ✅ {profileMap.xinbei?.tasks.filter(t => t.completedToday).length ?? 0}/{profileMap.xinbei?.tasks.length ?? 0}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Parent button */}
      <button
        onClick={() => navigate('/parent')}
        className="mt-8 text-gray-500 text-sm hover:text-gray-700 transition-colors underline">
        👨‍👩‍👧 家长管理入口
      </button>
    </div>
  )
}
