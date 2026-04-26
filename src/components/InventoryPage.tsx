import { ChildProfile } from '../types'
import { PetSVG } from './PetSVGs'

interface Props {
  theme: any; profile: ChildProfile; isYuanyuan: boolean;
}

export function InventoryPage({ theme, profile }: Props) {
  const allPets = [profile.pet, ...profile.petsCollection]

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-black text-xl text-center mb-2">📖 图鉴</h2>
      
      {/* Collection count */}
      <div className={`pixel-card rounded-2xl p-4 ${theme.cardBg} text-center`}>
        <div className="text-4xl font-black text-2xl">{allPets.length}</div>
        <div className="text-sm text-gray-500">已收集宠物</div>
      </div>

      {/* Pet list */}
      <div className="space-y-3">
        {allPets.map((pet, i) => (
          <div key={pet.id} className={`pixel-card rounded-2xl p-4 ${i === 0 ? theme.cardBg : 'bg-white'}`}>
            <div className="flex items-center gap-4">
              <PetSVG type={pet.type} stage={pet.stage} size={64} className="animate-bounce-idle" />
              <div className="flex-1">
                <div className="font-black text-base">{pet.nickname || pet.name}
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    Lv.{pet.level}
                  </span>
                </div>
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <span>🍖 {pet.hunger}</span>
                  <span>😊 {pet.mood}</span>
                  <span>✅ {pet.tasksCompleted}次任务</span>
                </div>
              </div>
              {pet.isNew && <span className="text-xs bg-yellow-300 px-2 py-1 rounded-full font-bold">NEW</span>}
            </div>
          </div>
        ))}
      </div>

      {allPets.length === 1 && (
        <p className="text-center text-sm text-gray-400 py-4">
          还有更多宠物等着你！去扭蛋机抽新宠吧~
        </p>
      )}
    </div>
  )
}
