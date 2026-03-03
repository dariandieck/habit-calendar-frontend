import { useState } from "react";
import {RainbowButton} from "../ui/RainbowButton.tsx";
import {useNavigate} from "react-router-dom";
import {HABIT_SUMMARY_PAGE} from "../../routes/RouteRedirector.tsx";

export function GoToHabitSummaryCard() {
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate()

    const onSubmit = () => {
        setIsSaving(true);
        setTimeout(async () => {
            navigate(HABIT_SUMMARY_PAGE);
            setIsSaving(false);
        }, 2000);
    };

    return (
        <div className="flex justify-center items-center pb-5">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl px-10 py-10 rounded-3xl shadow-2xl border border-pink-100 text-center">

                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-500 mb-4">
                    ✨ Habit Summary ✨
                </h2>

                <p className="text-gray-600 leading-relaxed italic">
                    Schaue dir genau an, wie du deine Habits in der letzten Zeit bewertet hast.
                    Hier findest du deine persönliche <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-500">Habit Summary!</span>
                </p>

                <div className="mt-8 flex justify-center">
                    <RainbowButton
                        isSubmit={false}
                        isSaving={isSaving}
                        text={"Summary ansehen 🌸"}
                        actionEmoji={"🌸"}
                        actionText={"Summary wird geladen..."}
                        onClick={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
}