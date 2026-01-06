import { useState } from 'react';
import type {Habit} from '../types/habit';
import "./HabitInputForm.css"

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
        <div>
            {habits.map((habit, i) => (
                <div
                    key={`habit-input-form-${i}`}
                    style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "8px"
                    }}
                >
                    <input
                        type="text"
                        value={habit.name}
                        onChange={e => updateHabit(i, "name", e.target.value)}
                        placeholder={`Name ${i + 1}. Habit`}
                        className={errors[i]?.name ? "habit-input-error" : ""}
                    />
                    <input
                        type="text"
                        value={habit.description}
                        onChange={e => updateHabit(i, "description", e.target.value)}
                        placeholder={`Beschreibung ${i + 1}. Habit`}
                        className={errors[i]?.description ? "habit-input-error" : ""}
                    />
                    <button
                        type="button"
                        onClick={() => removeHabit(i)}
                    >
                        ➖
                    </button>
                    {i === habits.length - 1 && <button type="button" onClick={addEmptyHabit}>➕</button>}

                </div>
            ))}

            <button type="button" onClick={submitHabits}>
                Speichern
            </button>
        </div>
    );
}
