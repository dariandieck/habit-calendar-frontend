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

        onSubmit(cleaned);
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
                            className={`w-full sm:flex-1 p-3 rounded-xl border-2 text-base transition-all outline-none focus:ring-2 focus:ring-pink-300 ${
                                errors[i]?.name ? "border-red-300 bg-red-50" : "border-pink-100 bg-white focus:border-pink-400"}`}
                        />
                        <input
                            type="text"
                            value={habit.description}
                            onChange={e => updateHabit(i, "description", e.target.value)}
                            placeholder={`Beschreibung ${i + 1}. Habit`}
                            className={`w-full sm:flex-[2] p-3 rounded-xl border-2 text-base transition-all outline-none focus:ring-2 focus:ring-pink-300 ${
                                errors[i]?.description ? "border-red-300 bg-red-50" : "border-pink-100 bg-white focus:border-pink-400"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => removeHabit(i)}
                            className="p-3 hover:bg-red-100 rounded-full
                            flex items-center justify-center transition-all active:scale-70"
                        >➖</button>
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
                {/* DER REGENBOGEN-KREISEL */}
                {/* Wir machen ihn quadratisch und sehr groß (aspect-square), damit er beim Drehen alles abdeckt */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square
                          bg-[conic-gradient(from_0deg,#ff0000,#ff8000,#ffff00,#00ff00,#00ffff,#0000ff,#8000ff,#ff00ff,#ff0000)]
                          opacity-0 group-hover:opacity-100 group-hover:animate-rainbow-spin transition-opacity duration-500 blur-sm">
                    </div>
                </div>

                {/* DIE "MASKE" (Erzeugt den Abstand zwischen Regenbogen und Button) */}
                <div className="absolute inset-[6px] bg-pink-50 rounded-[14px] z-10 group-hover:bg-transparent transition-colors"></div>

                {/* DER EIGENTLICHE BUTTON */}
                <button
                    type="button"
                    onClick={submitHabits}
                    className="relative z-20 w-[calc(100%-4px)] h-[calc(100%-4px)] bg-linear-to-r from-pink-600 to-purple-600
                      text-white font-bold rounded-[14px] shadow-lg
                      transition-all duration-300
                      group-hover:scale-[0.99] group-active:scale-98
                      flex items-center justify-center gap-2"
                >
                    <span className="group-hover:animate-bounce">✨</span>
                    <span>Speichern</span>
                    <span className="group-hover:animate-bounce">✨</span>
                </button>
            </div>
        </div>
    );
}
