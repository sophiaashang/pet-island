import { EvolutionStage, PetType } from '../types'

interface PetSVGProps {
  type?: PetType
  stage: EvolutionStage
  className?: string
  size?: number
}

export function DuckySVG({ stage, className = '', size = 96 }: PetSVGProps) {
  if (stage === 0) return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="20" y="32" width="24" height="20" rx="4" fill="#FFE033" stroke="#333" strokeWidth="2"/>
      {/* Head */}
      <circle cx="32" cy="24" r="14" fill="#FFE033" stroke="#333" strokeWidth="2"/>
      {/* Beak */}
      <ellipse cx="32" cy="28" rx="6" ry="4" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
      {/* Eyes */}
      <circle cx="26" cy="20" r="3" fill="#333"/>
      <circle cx="38" cy="20" r="3" fill="#333"/>
      <circle cx="27" cy="19" r="1" fill="white"/>
      <circle cx="39" cy="19" r="1" fill="white"/>
      {/* Blush */}
      <ellipse cx="22" cy="26" rx="4" ry="2.5" fill="#FFB7C5" opacity="0.7"/>
      <ellipse cx="42" cy="26" rx="4" ry="2.5" fill="#FFB7C5" opacity="0.7"/>
      {/* Wings */}
      <ellipse cx="16" cy="40" rx="5" ry="8" fill="#FFD000" stroke="#333" strokeWidth="1.5" transform="rotate(-15 16 40)"/>
      <ellipse cx="48" cy="40" rx="5" ry="8" fill="#FFD000" stroke="#333" strokeWidth="1.5" transform="rotate(15 48 40)"/>
      {/* Feet */}
      <ellipse cx="26" cy="53" rx="6" ry="3" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="38" cy="53" rx="6" ry="3" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
    </svg>
  )
  if (stage === 1) return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Fat body */}
      <ellipse cx="32" cy="40" rx="22" ry="20" fill="#FFE033" stroke="#333" strokeWidth="2"/>
      {/* Head */}
      <circle cx="32" cy="22" r="16" fill="#FFE033" stroke="#333" strokeWidth="2"/>
      {/* Beak */}
      <ellipse cx="32" cy="27" rx="7" ry="5" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
      {/* Eyes */}
      <circle cx="25" cy="17" r="4" fill="#333"/>
      <circle cx="39" cy="17" r="4" fill="#333"/>
      <circle cx="26" cy="16" r="1.5" fill="white"/>
      <circle cx="40" cy="16" r="1.5" fill="white"/>
      {/* Blush */}
      <ellipse cx="20" cy="24" rx="5" ry="3" fill="#FFB7C5" opacity="0.7"/>
      <ellipse cx="44" cy="24" rx="5" ry="3" fill="#FFB7C5" opacity="0.7"/>
      {/* Wings (bigger) */}
      <ellipse cx="8" cy="38" rx="7" ry="10" fill="#FFD000" stroke="#333" strokeWidth="1.5" transform="rotate(-10 8 38)"/>
      <ellipse cx="56" cy="38" rx="7" ry="10" fill="#FFD000" stroke="#333" strokeWidth="1.5" transform="rotate(10 56 38)"/>
      {/* Tail feathers */}
      <path d="M52 42 Q58 38 55 30" stroke="#FFD000" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M54 44 Q60 42 57 34" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Feet */}
      <ellipse cx="24" cy="61" rx="7" ry="3" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="40" cy="61" rx="7" ry="3" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
    </svg>
  )
  // Swan-duck stage 2
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Swan neck curve */}
      <path d="M30 36 Q30 18 40 12" stroke="#FFE033" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M30 36 Q30 18 40 12" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <ellipse cx="30" cy="42" rx="20" ry="16" fill="#FFE033" stroke="#333" strokeWidth="2"/>
      {/* Head */}
      <circle cx="42" cy="12" r="10" fill="#FFE033" stroke="#333" strokeWidth="2"/>
      {/* Beak */}
      <ellipse cx="50" cy="14" rx="6" ry="3.5" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
      {/* Crown/sparkle */}
      <polygon points="42,2 44,7 49,7 45,10 47,15 42,12 37,15 39,10 35,7 40,7" fill="#FFD700" stroke="#333" strokeWidth="1"/>
      {/* Eyes */}
      <circle cx="38" cy="10" r="2.5" fill="#333"/>
      <circle cx="39" cy="9.5" r="1" fill="white"/>
      {/* Blush */}
      <ellipse cx="34" cy="14" rx="3" ry="2" fill="#FFB7C5" opacity="0.7"/>
      <ellipse cx="48" cy="14" rx="3" ry="2" fill="#FFB7C5" opacity="0.7"/>
      {/* Wings */}
      <ellipse cx="10" cy="40" rx="8" ry="12" fill="#FFD000" stroke="#333" strokeWidth="1.5" transform="rotate(-10 10 40)"/>
      {/* Tail */}
      <path d="M48 46 Q56 42 53 32" stroke="#FFD000" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M50 48 Q58 46 55 36" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Feet */}
      <ellipse cx="22" cy="59" rx="6" ry="3" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="36" cy="59" rx="6" ry="3" fill="#FF9900" stroke="#333" strokeWidth="1.5"/>
    </svg>
  )
}

export function WolfySVG({ stage, className = '', size = 96 }: PetSVGProps) {
  if (stage === 0) return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="32" cy="40" rx="16" ry="18" fill="#A0A0A0" stroke="#333" strokeWidth="2"/>
      {/* Head */}
      <circle cx="32" cy="22" r="15" fill="#A0A0A0" stroke="#333" strokeWidth="2"/>
      {/* Ears */}
      <polygon points="20,14 16,0 28,10" fill="#A0A0A0" stroke="#333" strokeWidth="1.5"/>
      <polygon points="44,14 48,0 36,10" fill="#A0A0A0" stroke="#333" strokeWidth="1.5"/>
      <polygon points="22,12 19,3 27,10" fill="#CC8888"/>
      <polygon points="42,12 45,3 37,10" fill="#CC8888"/>
      {/* Snout */}
      <ellipse cx="32" cy="27" rx="7" ry="5" fill="#D0D0D0" stroke="#333" strokeWidth="1.5"/>
      {/* Eyes */}
      <circle cx="25" cy="20" r="3.5" fill="#333"/>
      <circle cx="39" cy="20" r="3.5" fill="#333"/>
      <circle cx="26" cy="19" r="1.2" fill="white"/>
      <circle cx="40" cy="19" r="1.2" fill="white"/>
      {/* Nose */}
      <ellipse cx="32" cy="26" rx="3" ry="2" fill="#333"/>
      {/* Mouth */}
      <path d="M29 30 Q32 33 35 30" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Tail */}
      <path d="M46 44 Q56 40 54 30" stroke="#A0A0A0" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M46 44 Q56 40 54 30" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="22" y="52" width="7" height="8" rx="3" fill="#909090" stroke="#333" strokeWidth="1.5"/>
      <rect x="35" y="52" width="7" height="8" rx="3" fill="#909090" stroke="#333" strokeWidth="1.5"/>
    </svg>
  )
  if (stage === 1) return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Body - bigger, silver */}
      <ellipse cx="32" cy="38" rx="18" ry="20" fill="#B8B8B8" stroke="#333" strokeWidth="2"/>
      {/* Silver chest marking */}
      <ellipse cx="32" cy="44" rx="10" ry="12" fill="#E8E8E8" opacity="0.5"/>
      {/* Head */}
      <circle cx="32" cy="20" r="17" fill="#B8B8B8" stroke="#333" strokeWidth="2"/>
      {/* Ears - larger, sharper */}
      <polygon points="18,14 12,-2 30,10" fill="#B8B8B8" stroke="#333" strokeWidth="1.5"/>
      <polygon points="46,14 52,-2 34,10" fill="#B8B8B8" stroke="#333" strokeWidth="1.5"/>
      <polygon points="20,12 15,1 28,10" fill="#AACCCC"/>
      <polygon points="44,12 49,1 36,10" fill="#AACCCC"/>
      {/* Eyes - glowing cool */}
      <circle cx="25" cy="18" r="4" fill="#4FC3F7"/>
      <circle cx="39" cy="18" r="4" fill="#4FC3F7"/>
      <circle cx="25" cy="18" r="2.5" fill="#333"/>
      <circle cx="39" cy="18" r="2.5" fill="#333"/>
      <circle cx="26" cy="17" r="1.2" fill="white"/>
      <circle cx="40" cy="17" r="1.2" fill="white"/>
      {/* Snout */}
      <ellipse cx="32" cy="25" rx="8" ry="6" fill="#D8D8D8" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="32" cy="24" rx="3.5" ry="2.5" fill="#333"/>
      <path d="M28 28 Q32 31 36 28" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Fur markings */}
      <path d="M14 38 Q18 35 20 38" stroke="#888" strokeWidth="1" fill="none"/>
      <path d="M44 38 Q46 35 50 38" stroke="#888" strokeWidth="1" fill="none"/>
      {/* Tail */}
      <path d="M48 42 Q60 36 58 24" stroke="#B8B8B8" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M48 42 Q60 36 58 24" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M54 26 Q60 20 58 14" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="20" y="52" width="8" height="10" rx="3" fill="#A0A0A0" stroke="#333" strokeWidth="1.5"/>
      <rect x="36" y="52" width="8" height="10" rx="3" fill="#A0A0A0" stroke="#333" strokeWidth="1.5"/>
    </svg>
  )
  // Snow wolf king stage 2
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Body - majestic white */}
      <ellipse cx="32" cy="40" rx="20" ry="20" fill="#F0F8FF" stroke="#333" strokeWidth="2"/>
      {/* Ice chest marking */}
      <ellipse cx="32" cy="46" rx="11" ry="13" fill="#E0F4FF" opacity="0.6"/>
      {/* Crown/mane */}
      <polygon points="32,0 34,6 38,3 36,9 42,8 38,12 44,16 36,14 40,20 32,16 24,20 28,14 20,16 26,12 22,8 28,9 26,3 30,6" fill="#87CEEB" stroke="#333" strokeWidth="1"/>
      {/* Head */}
      <circle cx="32" cy="22" r="18" fill="#F0F8FF" stroke="#333" strokeWidth="2"/>
      {/* Ears - majestic */}
      <polygon points="16,16 8,-2 28,10" fill="#F0F8FF" stroke="#333" strokeWidth="1.5"/>
      <polygon points="48,16 56,-2 36,10" fill="#F0F8FF" stroke="#333" strokeWidth="1.5"/>
      <polygon points="18,14 12,1 26,10" fill="#CCE8FF"/>
      <polygon points="46,14 52,1 38,10" fill="#CCE8FF"/>
      {/* Crown jewel eyes - regal */}
      <circle cx="24" cy="18" r="5" fill="#1E90FF"/>
      <circle cx="40" cy="18" r="5" fill="#1E90FF"/>
      <circle cx="24" cy="18" r="3" fill="#87CEEB"/>
      <circle cx="40" cy="18" r="3" fill="#87CEEB"/>
      <circle cx="25" cy="17" r="1.2" fill="white"/>
      <circle cx="41" cy="17" r="1.2" fill="white"/>
      {/* Snout */}
      <ellipse cx="32" cy="26" rx="9" ry="7" fill="#E8F4FF" stroke="#333" strokeWidth="1.5"/>
      <ellipse cx="32" cy="25" rx="4" ry="3" fill="#333"/>
      <path d="M27 29 Q32 33 37 29" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Ice crystals on body */}
      <circle cx="20" cy="38" r="2" fill="#87CEEB" opacity="0.8"/>
      <circle cx="44" cy="38" r="2" fill="#87CEEB" opacity="0.8"/>
      {/* Tail - fluffy with ice */}
      <path d="M50 44 Q64 36 62 20" stroke="#F0F8FF" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M50 44 Q64 36 62 20" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M56 22 Q62 14 60 8" stroke="#87CEEB" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <circle cx="60" cy="8" r="3" fill="#87CEEB"/>
      <circle cx="62" cy="14" r="2" fill="#87CEEB" opacity="0.7"/>
      {/* Legs */}
      <rect x="18" y="52" width="9" height="10" rx="3" fill="#E0EFFF" stroke="#333" strokeWidth="1.5"/>
      <rect x="37" y="52" width="9" height="10" rx="3" fill="#E0EFFF" stroke="#333" strokeWidth="1.5"/>
    </svg>
  )
}

// PetSVG: shows SVG for DUCKY/WOLFY, falls back to generic for others
export function PetSVG({ type, stage, className = '', size = 96 }: { type: string; stage: EvolutionStage; className?: string; size?: number }) {
  if (type === 'DUCKY') return <DuckySVG stage={stage} className={className} size={size} />
  if (type === 'WOLFY') return <WolfySVG stage={stage} className={className} size={size} />
  // Generic placeholder for other pets
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" fill={getPetColor(type as PetType)} stroke="#333" strokeWidth="2"/>
      <circle cx="24" cy="26" r="4" fill="#333"/>
      <circle cx="40" cy="26" r="4" fill="#333"/>
      <path d="M24 40 Q32 46 40 40" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

export function getPetAnimation(pet: { mood: number; hunger: number }) {
  if (pet.hunger < 20) return 'animate-wiggle'
  if (pet.mood < 30) return 'animate-shake'
  if (pet.mood > 80) return 'animate-float'
  return 'animate-bounce-idle'
}

export function getStageFromTasks(tasksCompleted: number): EvolutionStage {
  if (tasksCompleted >= 50) return 2
  if (tasksCompleted >= 20) return 1
  return 0
}

export function getPetColor(type: PetType): string {
  switch (type) {
    case 'DUCKY': return '#FFE033'
    case 'WOLFY': return '#A0A0A0'
    case 'MEIMI': return '#FFFFFF'
    case 'LINGLING': return '#7DC850'
    case 'FIRE': return '#FF6B35'
    case 'BUBBLE': return '#7EC8E3'
    case 'MOONFOX': return '#E8E8FF'
    case 'STARCUB': return '#9B7EC8'
    default: return '#FFB7C5'
  }
}
