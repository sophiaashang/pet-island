import { PetType } from '../types'

const PET_IMAGES: Record<PetType, string> = {
  DUCKY: 'https://cdn.hailuoai.com/mcp/image_tool/output/500460485766438916/387751032226725/1777275882_33f43569.png',
  WOLFY: 'https://cdn.hailuoai.com/mcp/image_tool/output/500460485766438916/387751032226725/1777275912_7f520f5d.png',
  MEIMI: 'https://cdn.hailuoai.com/mcp/image_tool/output/500460485766438916/387751032226725/1777275954_e4cb1a33.png',
  LINGLING: 'https://cdn.hailuoai.com/mcp/image_tool/output/500460485766438916/387751032226725/1777275982_bc5df671.png',
  FIRE: 'https://cdn.hailuoai.com/mcp/image_tool/output/500460485766438916/387751032226725/1777276018_65e1e322.png',
  BUBBLE: 'https://cdn.hailuoai.com/mcp/image_tool/output/500460485766438916/387751032226725/1777276046_111a2b0f.png',
  MOONFOX: 'https://cdn.hailuoai.com/mcp/image_tool/output/500460485766438916/387751032226725/1777276082_e914a171.png',
  STARCUB: 'https://cdn.hailuoai.com/mcp/image_tool/output/500460485766438916/387751032226725/1777276110_e058cde3.png',
}

export function PetImage({ type, size = 96, className = '' }: { type: PetType; size?: number; className?: string }) {
  return (
    <img
      src={PET_IMAGES[type]}
      alt={type}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
      className={className}
      loading="eager"
    />
  )
}
