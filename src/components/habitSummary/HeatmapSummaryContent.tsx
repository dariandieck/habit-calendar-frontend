import {HabitHeatmapBlock} from "./HabitHeatmapBlock.tsx";
import type {Habit} from "../../types/habit.ts";
import {useMemo} from "react";
import type {Entry} from "../../types/entry.ts";
import type {HeatmapDay} from "../../types/heatmapDay.ts";

interface HeatmapSummaryContentProps {
    habits: Habit[],
    entries: Entry[],
    visibleDays: HeatmapDay[]
}

// there only are 7 habits (as of 28.02.2026)
const habitColors = [
    "14, 165, 233",
    "34, 197, 94",
    "168, 85, 247",
    "245, 158, 11",
    "16, 185, 129",
    "236, 72, 153",
    "244, 63, 94"
];

export function HeatmapSummaryContent({habits, entries, visibleDays}: HeatmapSummaryContentProps) {
    const entriesByHabit = useMemo(() => {
        const map: Record<number, Record<string, number>> = {};
        if (!entries || entries.length === 0) return map;

        entries.forEach(entry => {
            if (!map[entry.h_id]) map[entry.h_id] = {};
            map[entry.h_id][entry.day] = entry.score;
        });
        return map;
    }, [entries]);

    return (
        <div className="space-y-5">
            {habits?.map((habit) => {
                const habitEntries = habit.h_id ? entriesByHabit[habit.h_id] || {} : {};
                const colorRGB = habit.h_id ? habitColors[habit.h_id - 1] || habitColors[0] : habitColors[0];

                return (
                    <HabitHeatmapBlock
                        key={`habit-heatmap-block-${habit.h_id}`}
                        habit={habit}
                        habitEntries={habitEntries}
                        visibleDays={visibleDays}
                        colorRGB={colorRGB}
                    />
                );
            })}
        </div>
    )
}