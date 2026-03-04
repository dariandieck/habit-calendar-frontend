import type {HeatmapDay} from "../../types/heatmapDay.ts";
import {useEffect, useRef, useState} from "react";

interface HeatmapDayCellProps {
    day: HeatmapDay;
    score?: number;
    colorRGB: string;
}

export function HeatmapDayCell({ day, score, colorRGB }: HeatmapDayCellProps) {
    const [isClicked, setIsClicked] = useState(false);
    const cellRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
                setIsClicked(false);
            }
        };
        if (isClicked) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        setTimeout(() => {
            setIsClicked(false);
        }, 2500);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isClicked]);

    let backgroundColor = 'rgba(232,234,234,0.54)';
    if (score !== undefined) {
        const opacity = Math.max(0.2, score / 100);
        backgroundColor = `rgba(${colorRGB}, ${opacity})`;
    }

    return (
        <div
            ref={cellRef}
            className={`w-3 h-3 rounded-sm group relative cursor-pointer transition-transform hover:scale-125 
                hover:z-50 ${isClicked ? 'scale-125 z-50' : ''}`}
            style={{ backgroundColor }}
            onClick={() => setIsClicked(!isClicked)}
        >
            <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center 
                    z-50 pointer-events-none w-max transition-all duration-200 ease-out origin-bottom 
                    ${isClicked ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-2 ' +
                    'group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'}`}
            >
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