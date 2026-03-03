import type {HeatmapDay} from "../../types/heatmapDay.ts";

interface HeatmapDayCellProps {
    day: HeatmapDay;
    score?: number;
    colorRGB: string;
}

export function HeatmapDayCell({ day, score, colorRGB }: HeatmapDayCellProps) {
    let backgroundColor = 'rgba(232,234,234,0.54)';
    if (score !== undefined) {
        const opacity = Math.max(0.2, score / 100);
        backgroundColor = `rgba(${colorRGB}, ${opacity})`;
    }

    return (
        <div
            className="w-3 h-3 rounded-sm group relative cursor-pointer transition-transform hover:scale-125 hover:z-50"
            style={{ backgroundColor }}
        >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none w-max">
                <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl flex flex-col items-center gap-1">
                    <span className="font-bold text-[10px] text-pink-200 uppercase tracking-wider">
                        {new Date(day.dateString).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                    <span className="font-semibold">
                        {score !== undefined ? `Score: ${score}` : 'Kein Eintrag 💤'}
                    </span>
                </div>
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
        </div>
    );
}