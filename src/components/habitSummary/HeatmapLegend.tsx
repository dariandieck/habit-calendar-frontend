interface HeatmapLegendProps {
    colorRGB: string
}

export function HeatmapLegend({colorRGB}: HeatmapLegendProps) {
    return (
        <div className="mt-4 flex items-center justify-end text-[10px] text-gray-400 gap-2">
            <span>Niedrig</span>
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: `rgba(${colorRGB}, 0.3)`}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: `rgba(${colorRGB}, 0.6)`}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: `rgba(${colorRGB}, 0.8)`}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: `rgba(${colorRGB}, 1)`}}></div>
            </div>
            <span>Hoch</span>
        </div>
    )
}