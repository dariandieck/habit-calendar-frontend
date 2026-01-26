import type {Entry} from "../../types/entry.ts";
import type {Habit} from "../../types/habit.ts";
import {useConfetti} from "../../hooks/useConfetti.tsx";
import {
    bad_highThresh, bad_lowThresh, good_highThresh, good_lowThresh, isBadScore, isGoodScore, isPerfectScore,
    isWorstScore
} from "../../utils/utils.ts";

interface EntrySliderProps {
    entry: Entry,
    habit: Habit,
    updateScore: (h_id: number, score: number) => void
}

export function EntrySlider(
    {entry, habit, updateScore}: EntrySliderProps) {

    // good
    const good_emojis = ["✅", "🔥", "💪", "💯", "😍"];
    useConfetti(entry.score, good_lowThresh, good_highThresh, good_emojis);

    // bad
    const bad_emojis = ["😭", "😢", "😞", "🥺", "😥"]
    useConfetti(entry.score, bad_lowThresh, bad_highThresh, bad_emojis);

    return (
        <>
            <div className="flex justify-between items-end mb-2">
                <div className="max-w-[80%]">
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                        <p className="truncate">{habit.name}</p>
                    </div>
                    <div className="text-xs text-gray-400 italic">
                        <p className="truncate">{habit.description}</p>
                    </div>
                </div>
                <div className={
                    `text-lg font-black px-3 py-1 rounded-full 
                                    border transition-all duration-500 ${
                        isGoodScore(entry.score)
                            ? "bg-green-100 text-green-500 border-green-200 scale-110 shadow-sm animate-glow-zoom-happy"
                            : isBadScore(entry.score)
                                ? "bg-purple-100 text-purple-400 border-purple-200 scale-110 shadow-sm animate-glow-zoom-sad"
                                : "bg-pink-50 text-pink-400 border-pink-100"}
                                `}
                >
                    {isPerfectScore(entry.score) ? "😍" : isWorstScore(entry.score) ? "🥺" : entry.score}
                    <span className="text-[10px] opacity-60 ml-0.5">/{good_highThresh}</span>
                </div>
            </div>
            <input
                type="range"
                min={bad_lowThresh}
                max={good_highThresh}
                value={entry.score}
                onChange={event =>
                    updateScore(habit.h_id!, Number(event.target.value))}
                className="w-full h-3 bg-pink-100 rounded-lg appearance-none cursor-pointer
                             accent-pink-400 transition-all hover:accent-pink-500"
            />
        </>
    )
}