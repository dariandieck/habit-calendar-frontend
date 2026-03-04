import { useEffect, useMemo, useState } from 'react';
import { useAppDataContext } from "../context/AppDataContext.tsx";
import { generateLast365Days } from "../utils/utils.ts";
import type {HeatmapDay} from "../types/heatmapDay.ts";
import {HeatmapSummaryHeader} from "../components/habitSummary/HeatmapSummaryHeader.tsx";
import {HeatmapSummaryContent} from "../components/habitSummary/HeatmapSummaryContent.tsx";
import {RainbowButton} from "../components/ui/RainbowButton.tsx";
import {useNavigate} from "react-router-dom";

export function HabitSummaryPage() {
    const { habits, entries } = useAppDataContext();
    const [daysToShow, setDaysToShow] = useState<number>(32 * 7);
    const pastDays: HeatmapDay[] = useMemo(() => generateLast365Days(), []);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const smallest = 500;
            const minWeeks = 21;
            const maxWeeks = 34;

            const weeks = Math.min(Math.round(minWeeks + (currentWidth - smallest) * 0.06), maxWeeks);

            setDaysToShow(weeks * 7);
        };
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const visibleDays = useMemo(() => {
        return pastDays.slice(-daysToShow);
    }, [daysToShow, pastDays]);

    const handleGoBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/', { replace: true });
        }
    }

    return (
        <div className="flex justify-center items-center p-4">
            <div className="w-full max-w-2xl space-y-10 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-pink-100">
                <HeatmapSummaryHeader />
                <HeatmapSummaryContent habits={habits} entries={entries} visibleDays={visibleDays}/>
                <RainbowButton
                    isSubmit={false}
                    isSaving={false}
                    text={"Zurück"}
                    actionEmoji={""}
                    actionText={""}
                    onClick={handleGoBack}
                />
            </div>
        </div>
    );
}