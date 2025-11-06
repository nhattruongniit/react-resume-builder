import { Zap } from "lucide-react"

interface InfoBadgeProps {
  title?: string;
  icon?: React.ReactNode;
}

function InfoBadge({ title = 'Simple Process', icon: Icon = <Zap width={14} /> }: InfoBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-green-800 bg-green-400/10 border border-green-200 rounded-full px-4 py-1.5">
      {Icon}
      <span>{title}</span>
    </div> 
  )
}

export default InfoBadge