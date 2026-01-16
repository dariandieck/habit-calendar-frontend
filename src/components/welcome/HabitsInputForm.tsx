import { useState } from 'react';
import type {Habit} from '../../types/habit.ts';
import {RainbowButton} from "../ui/RainbowButton.tsx";

type Props = {
    onSubmit: (habits: Habit[]) => void;
};

type ErrorState = {
    [id: number]: {
        name: boolean;
        description: boolean;
    }
};

type LengthConflictState = {
    [id: number]: {
        lengthConflict: boolean;
    }
};

export function HabitsInputForm({ onSubmit }: Props) {
    const [habits, setHabits] = useState<Habit[]>([{ name: "", description: "" }]);
    const [errors, setErrors] = useState<ErrorState>({});
    const [lengthConflicts, setLengthConflicts] = useState<LengthConflictState>({});
    const [isSaving, setIsSaving] = useState(false);

    // fügt einen neuen leeren Habit hinzu
    const addEmptyHabit = () => {
        setHabits([...habits, { name: "", description: "" }]);
    }

    // aktualisiert entweder name oder description
    const updateHabit = (
            index: number, field: "name" | "description", value: string) => {
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

        const oldLengthConflicts = { ...lengthConflicts };
        if (!oldLengthConflicts[index]) {
            oldLengthConflicts[index] = { lengthConflict: false }; // falls noch nicht vorhanden
        }
        oldLengthConflicts[index]["lengthConflict"] = habits[index].name.split(" ").length > 5;
        setLengthConflicts(oldLengthConflicts);
    }

    const clearHabit = (index: number) => {
        const copy = [...habits];
        copy[index] = { name: "", description: "" };
        setHabits(copy);
    }

    // den Habit am Index löschen
    const removeHabit = (index: number) => {
        if (habits.length === 1) { // mindestens 1 Habit bleibt
            clearHabit(index);
            return
        }

        const copy = [...habits];
        copy.splice(index, 1);
        setHabits(copy);
    }

    const detectEmptyInputFields = () => {
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

    const detectLengthConflicts = () => {
        const newLengthConflicts: LengthConflictState = {};
        let anyLengthConflicts = false;

        for (let i = 0; i < habits.length; i++) {
            newLengthConflicts[i] = {
                lengthConflict: habits[i].name.split(" ").length > 5
            };
            if (!anyLengthConflicts && habits[i].name.split(" ").length > 5) {
                anyLengthConflicts = true;
            }
        }
        setLengthConflicts(newLengthConflicts);
        return anyLengthConflicts;
    }

    // filtert leere Habits und ruft onSubmit auf
    const submitHabits = () => {
        const anyEmptyFields = detectEmptyInputFields();
        if (anyEmptyFields) {
            alert("Bitte alle Felder ausfüllen :)");
            return;
        }

        const anyLengthConflicts = detectLengthConflicts();
        if (anyLengthConflicts) {
            alert("Der Habit-Name darf nur 5 Wörter lang sein :)");
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
                                errors[i]?.name || lengthConflicts[i]?.lengthConflict 
                                    ? "border-red-300 bg-red-50":"border-pink-50 bg-white/50"
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

            <RainbowButton isSubmit={false} onClick={submitHabits} isSaving={isSaving} text={"Speichern 🌸"}
                           actionEmoji={"🌸"} actionText={"Wird gespeichert..."}
            />
        </div>
    );
}
