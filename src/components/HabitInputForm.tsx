import { useState } from 'react';
import type {Habit} from '../types/habit';

type Props = {
    onSubmit: (habits: Habit[]) => void;
};

type ErrorState = {
    [id: number]: {
        name: boolean;
        description: boolean;
    }
};

export function HabitInputForm({ onSubmit }: Props) {
    const [habits, setHabits] = useState<Habit[]>([{ name: "", description: "" }]);
    const [errors, setErrors] = useState<ErrorState>({});
    const [isSaving, setIsSaving] = useState(false);

    // fügt einen neuen leeren Habit hinzu
    function addEmptyHabit() {
        setHabits([...habits, { name: "", description: "" }]);
    }

    // aktualisiert entweder name oder description
    function updateHabit(index: number, field: "name" | "description", value: string) {
        const oldHabits = [...habits];
        oldHabits[index] = { ...oldHabits[index], [field]: value };
        setHabits(oldHabits);

        // Fehler-State updaten
        const oldErrors = { ...errors };
        if (!oldErrors[index]) {
            oldErrors[index] = { name: false, description: false }; // falls noch nicht vorhanden
        }
        // nur das aktuelle Feld updaten
        oldErrors[index][field] = value.trim() === "";
        setErrors(oldErrors); // neuen State setzen
    }

    function clearHabit(index: number) {
        const copy = [...habits];
        copy[index] = { name: "", description: "" };
        setHabits(copy);
    }

    // den Habit am Index löschen
    function removeHabit(index: number) {
        if (habits.length === 1) { // mindestens 1 Habit bleibt
            clearHabit(index);
            return
        }

        const copy = [...habits];
        copy.splice(index, 1);
        setHabits(copy);
    }

    function detectErrorsInInputFields() {
        const newErrors: ErrorState = {};
        let anyErrors = false;

        for (let i = 0; i < habits.length; i++) {
            newErrors[i] = {
                name: habits[i].name.trim() === "",
                description: habits[i].description.trim() === "",
            };
            if (!anyErrors && (habits[i].name.trim() === "" || habits[i].description.trim() === "")) {
                anyErrors = true;
            }
        }
        setErrors(newErrors);
        return anyErrors;
    }

    // filtert leere Habits und ruft onSubmit auf
    function submitHabits() {
        const anyErrors = detectErrorsInInputFields();
        if (anyErrors) {
            alert("Bitte alle Felder ausfüllen :)");
            return;
        }
        const cleaned: Habit[] = habits
            .filter(h => h.name.trim() !== "" && h.description.trim() !== "");
        if (cleaned.length === 0 || (habits.length === 1 && habits[0].description === "" && habits[0].name === "")) {
            alert('Mindestens ein Habit sollte eingetragen werden :)');
            return;
        }

        setIsSaving(true);

        setTimeout(() => {
            onSubmit(cleaned);
            setIsSaving(false);
        }, 2000);
    }

    return (
        <div className="space-y-4">
            {habits.map((habit, i) => (
                <div
                    key={`habit-input-form-${i}`}
                    className="relative p-3 rounded-2xl bg-pink-50/30 border border-pink-100 flex flex-col gap-3"
                >
                    <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <input
                            type="text"
                            value={habit.name}
                            onChange={e => updateHabit(i, "name", e.target.value)}
                            placeholder={`Name ${i + 1}. Habit`}
                            className={`w-full sm:flex-[2] p-3 rounded-xl border-2 text-base transition-all 
                                outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 ${
                                errors[i]?.name ? "border-red-300 bg-red-50":"border-pink-50 bg-white/50"
                            }`}
                        />
                        <input
                            type="text"
                            value={habit.description}
                            onChange={e => updateHabit(i, "description", e.target.value)}
                            placeholder={`Beschreibung ${i + 1}. Habit`}
                            className={`w-full sm:flex-[2] p-3 rounded-xl border-2 text-base transition-all 
                                outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 ${
                                errors[i]?.description ? "border-red-300 bg-red-50":"border-pink-50 bg-white/50"
                            }`}
                        />

                        <div className="sm:hidden flex justify-center mt-2 w-full">
                            <button
                                type="button"
                                onClick={() => removeHabit(i)}
                                className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-pink-200
                                    text-pink-400 rounded-full text-sm font-bold shadow-sm
                                    hover:bg-pink-50 transition-all active:scale-90"
                            >
                                <span>Habit entfernen</span>
                                <span className="text-lg">➖</span>
                            </button>
                        </div>

                        <div className="hidden sm:block lg:block flex items-center align-middle justify-center m-auto">
                            <button
                                type="button"
                                onClick={() => removeHabit(i)}
                                className="p-3 text-lg hover:bg-red-100 rounded-full transition-all active:scale-70"
                            >➖</button>
                        </div>

                    </div>
                </div>
            ))}

            <div className="flex justify-center mt-2">
                <button
                    type="button"
                    onClick={addEmptyHabit}
                    className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-pink-200
                        text-pink-400 rounded-full text-sm font-bold shadow-sm
                        hover:bg-pink-50 transition-all active:scale-90"
                >
                    <span>Habit hinzufügen</span>
                    <span className="text-lg">➕</span>
                </button>
            </div>


            <div className="relative group mt-8 w-full h-[64px] flex items-center justify-center">

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
                    onClick={submitHabits}
                    className={`relative z-20 w-[calc(100%-8px)] h-[calc(100%-8px)] 
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
