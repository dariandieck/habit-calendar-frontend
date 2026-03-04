import { useMemo } from 'react';
import { HeatmapDayCell } from "./HeatmapDayCell.tsx";
import type {Habit} from "../../types/habit.ts";
import type {HeatmapDay} from "../../types/heatmapDay.ts";
import {HeatmapLegend} from "./HeatmapLegend.tsx";


interface HabitHeatmapBlockProps {
    habit: Habit;
    habitEntries: Record<string, number>;
    visibleDays: HeatmapDay[];
    colorRGB: string;
}

export function HabitHeatmapBlock({ habit, habitEntries, visibleDays, colorRGB }: HabitHeatmapBlockProps) {
    const monthLabels = useMemo(() => {
        const labels: { name: string, colIndex: number }[] = [];
        visibleDays.forEach((day, index) => {
            if (day.dayOfMonth === 1) {
                const colIndex = Math.floor(index / 7);
                labels.push({ name: day.monthName, colIndex });
            }
        });
        return labels;
    }, [visibleDays]);

    return (
        <div className="bg-white/50 rounded-2xl p-6 border border-pink-50 shadow-sm transition-all hover:shadow-xl">
            <div className="max-w-full mb-1">
                <div className="font-bold text-gray-800 flex items-center gap-2">
                    <p className="truncate">{habit.name}</p>
                </div>
                <div className="text-xs text-gray-400 italic">
                    <p className="truncate">{habit.description}</p>
                </div>
            </div>

            <div className="relative flex pb-4">

                <div className="grid grid-rows-7 gap-1 pr-2 pt-6 text-[10px] text-gray-400 font-medium">
                    <span className="h-3 leading-[12px] flex items-center">Mo</span>
                    <span className="h-3"></span> {/* Di */}
                    <span className="h-3 leading-[12px] flex items-center">Mi</span>
                    <span className="h-3"></span> {/* Do */}
                    <span className="h-3 leading-[12px] flex items-center">Fr</span>
                    <span className="h-3"></span> {/* Sa */}
                    <span className="h-3 leading-[12px] flex items-center">So</span>
                </div>

                <div className="relative flex-1 overflow-visible min-w-0">
                    <div className="relative h-6 w-full text-[10px] text-gray-400 font-medium">
                        {monthLabels.map((label, i) => (
                            <span
                                key={`month-label-${i}`}
                                className="absolute bottom-1"
                                style={{ left: `${label.colIndex * 16}px` }}
                            >
                                {label.name}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
                        {visibleDays.map(day => {
                            const score = habitEntries[day.dateString];
                            return (
                                <HeatmapDayCell
                                    key={`day-cell-${habit.h_id}-${day.dateString}`}
                                    day={day}
                                    score={score}
                                    colorRGB={colorRGB}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <HeatmapLegend colorRGB={colorRGB}/>
        </div>
    );
}