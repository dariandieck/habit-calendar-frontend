import type {Entry} from "../../types/entry.ts";
import {useAppDataContext} from "../../context/AppDataContext.tsx";

interface HabitsInputSliderFormProps {
    entries: Entry[],
    setEntries: (value: (((prevState: Entry[]) => Entry[]) | Entry[])) => void
}

export function HabitsInputSliderForm({setEntries, entries}: HabitsInputSliderFormProps) {
    const {habits} = useAppDataContext();

    // Slider-Wert ändern
    const updateScore = (h_id: number, score: number) => {
        // durchlaufe alle entries (prev) und wenn die übergeben h_id stimmt (entry hat h_id als FK),
        // dann ändere dort den score und kopiere den rest vom bestehenden entry,
        // ansonsten übernehme den entry (unverändert)
        setEntries(prev =>
            prev.map(e => (e.h_id === h_id ? {...e, score} : e))
        );
    };

    return (
        <div className="space-y-5">
            {habits.map(h => {
                // find the entry belonging to this habit
                const entry: Entry = entries.find(e => e.h_id === h.h_id)!
                const isFullScore = entry.score > 95;
                return (
                    <div className="group" key={`habit-slider-${h.h_id}`}>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <div className="font-bold text-gray-800 flex items-center gap-2">
                                    {h.name}
                                    {isFullScore && (
                                        <span className="animate-[bounce_0.5s_ease-in-out_infinite] text-lg">
                                                ✅
                                            </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-400 italic">{h.description}</div>
                            </div>
                            <div className={`text-lg font-black px-3 py-1 rounded-full border 
                                transition-all duration-500 ${
                                isFullScore
                                    ? "bg-green-100 text-green-500 border-green-200 scale-110 shadow-sm"
                                    : "bg-pink-50 text-pink-400 border-pink-100"
                            }`}>
                                {entry.score}<span className="text-[10px] opacity-60 ml-0.5">/100</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={100}
                            value={entry.score}
                            onChange={event =>
                                updateScore(h.h_id!, Number(event.target.value))}
                            className="w-full h-3 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-400 transition-all hover:accent-pink-500"
                        />
                    </div>
                );
            })}
        </div>
    )
}