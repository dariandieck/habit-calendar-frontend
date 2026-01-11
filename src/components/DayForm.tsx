import type {Habit} from '../types/habit';
import {useState} from "react";
import type {Entry} from "../types/entry.ts";
import type {DayKeyFields} from "../types/dayKeyFields.ts";
import type {MotivationalSpeech} from "../types/motivationalSpeech.ts";

type Props = {
    habits: Habit[],
    onSubmit: (entries: Entry[], formDay: DayKeyFields) => Promise<void>,
    motivationalSpeech: MotivationalSpeech
};

const keyFieldMap: DayKeyFields = {
    good_field: "Was lief heute besonders gut?",
    why_good_field: "Warum lief das so gut heute?",
    bad_field: "Was lief heute nicht so gut?",
    improve_field: "Was kannst du morgen tun, um es besser zu machen?"
}

export function DayForm({habits, onSubmit, motivationalSpeech}: Props) {
    const [isSaving, setIsSaving] = useState(false);

    // direct aus habits die entries generieren. Habits müssten hier eine id haben (kommt aus db)
    const [entries, setEntries] = useState((): Entry[] => {
        return habits.map(h => (
            {h_id: h.h_id!, score: 1, day: ""}
        ));
    });

    const [formDay, setFormDay] = useState<DayKeyFields>({
        good_field: "", why_good_field: "", bad_field: "", improve_field: ""
    })


    const handleFieldValueChange = (field: keyof DayKeyFields, value: string) => {
        setFormDay(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Slider-Wert ändern
    const updateScore = (h_id: number, score: number) => {
        // durchlaufe alle entries (prev) und wenn die übergeben h_id stimmt (entry hat h_id als FK),
        // dann ändere dort den score und kopiere den rest vom bestehenden entry,
        // ansonsten übernehme den entry (unverändert)
        setEntries(prev =>
            prev.map(e => (e.h_id === h_id ? {...e, score} : e))
        );
    };

    const handleSubmit = async () => {
        setIsSaving(true);

        setTimeout(async () => {
            try {
                await onSubmit(entries, formDay);
            } catch (error) {
                console.log(`Could not save the day. Error: ${error}`);
                alert('Es gab einen kleinen Fehler (upsie! 💅). Frag Dari was los ist 🥺');
            } finally {
                setIsSaving(false)
            }
        }, 2000);
    };

    return (
        <div className="space-y-8">
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

            <div className="text-center space-y-2">
                <div className="border-t border-pink-100 m-auto max-w-8/12 flex justify-center"></div>
                <div className="pt-7">
                    <p className="text-pink-400 font-medium text-xl mb-2">
                        🌸 Zeit für dein Self-Care Check-in 🌸
                    </p>
                    <p className="text-gray-500 leading-relaxed italic text-sm px-4">
                        Hör in dich hinein: Worauf bist du heute besonders stolz? 💞 Was lief nicht so gut? 🥺
                        Reflektiere deinen heutigen Tag und schreibe deine Gedanken dazu auf!
                    </p>
                </div>
            </div>

            <div className="space-y-7">
                {(Object.keys(formDay) as (keyof DayKeyFields)[])
                    .filter(
                        k => !["d_id", "created_at", "day", "motivation_field"].includes(k)
                    )
                    .map((k, i) => (
                        <div className="flex flex-col gap-2" key={`day-input-field-${i}`}>
                            <label className="text-sm font-semibold text-purple-400 ml-1">
                                {`${keyFieldMap[k]} (*)`}
                            </label>
                            <textarea
                                value={formDay[k] || ""}
                                onChange={event =>
                                    handleFieldValueChange(k, event.target.value)}
                                className="w-full p-4 rounded-2xl border-2 border-pink-50 bg-white/50
                                    focus:border-pink-300 focus:ring-4 focus:ring-pink-100 outline-none
                                    transition-all min-h-[100px] text-base resize-none"
                                placeholder="Erzähl mir gerne alles 🧸"
                            />
                        </div>
                    ))
                }

            </div>

            <p className="text-gray-400 text-sm leading-relaxed italic">
                Felder mit (*) sind optional :)
            </p>

            <div
                className="mt-12 p-6 bg-linear-to-br from-purple-100/50 to-pink-100/50 rounded-2xl border border-white shadow-inner">
                <h3 className="text-purple-500 font-bold mb-2 flex items-center gap-2">
                    💭 Und noch ein motivierender Spruch für dich:
                </h3>
                <p className="italic text-gray-600 leading-relaxed">
                    "{motivationalSpeech.speech}"
                </p>
            </div>

            <div className="relative group w-full h-[64px] flex items-center justify-center">
                {/* DER REGENBOGEN-KREISEL (Jetzt auch aktiv wenn isSaving wahr ist) */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square 
                        bg-[conic-gradient(from_0deg,#ff0000,#ff8000,#ffff00,#00ff00,#00ffff,#0000ff,#8000ff,#ff00ff,#ff0000)] 
                        ${isSaving ? 'opacity-100 animate-[rainbow-spin_1s_linear_infinite] blur-md' : 'opacity-0 group-hover:opacity-100 group-hover:animate-rainbow-spin'} 
                        transition-all duration-500`}>
                    </div>
                </div>

                {/* DER BUTTON */}
                <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSubmit}
                    className={`relative z-20 overflow-hidden w-[calc(100%-8px)] h-[calc(100%-8px)] 
                        ${isSaving ? 'bg-white text-pink-500' : 'bg-linear-to-r from-pink-400 to-purple-500 text-white'}
                        font-bold rounded-[14px] shadow-lg transition-all duration-500
                        flex items-center justify-center gap-3 overflow-hidden`}
                >
                    {isSaving ? (
                        <>
                            <span className="animate-bounce">💖</span>
                            <span className="tracking-widest uppercase text-sm">Wird gespeichert...</span>
                            <span className="animate-bounce">💖</span>
                        </>
                    ) : (
                        <>
                            <span className="group-hover:animate-bounce">✨</span>
                            <span>Speichern</span>
                            <span className="group-hover:animate-bounce">✨</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
