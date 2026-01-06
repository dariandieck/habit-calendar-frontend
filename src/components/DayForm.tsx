import type {Habit} from '../types/habit';
import {useState} from "react";
import type {Entry} from "../types/entry.ts";
import type {DayKeyFields} from "../types/dayKeyFields.ts";

type Props = {
    habits: Habit[],
    onSubmit: (entries: Entry[], formDay: DayKeyFields) => Promise<void>
};

export function DayForm({ habits, onSubmit}: Props) {
    // direct aus habits die entries generieren. Habits müssten hier eine id haben (kommt aus db)
    const [entries, setEntries] = useState((): Entry[] => {
        return habits.map(h => (
            {h_id: h.h_id!, score: 1, day: ""}
        ));
    });

    const [formDay, setFormDay] = useState<DayKeyFields>({
        good_field: "", why_good_field: "", bad_field: "",
        improve_field: ""
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
        await onSubmit(entries, formDay);
    };

    return (
        <div>
            {habits.map(h => {
                // find the entry belonging to this habit
                const entry: Entry = entries.find(e => e.h_id === h.h_id)!
                return (
                    <div key={`habit-slider-${h.h_id}`}>
                        <div>{h.name}</div>
                        <div>{h.description}</div>
                        <input
                            type="range"
                            min={1}
                            max={100}
                            value={entry.score}
                            onChange={
                                event => updateScore(h.h_id!, Number(event.target.value))
                            }
                        />
                        <p>{entry.score}/100</p>
                    </div>
                );
            })}

            {
                // Erstelle für jeden key in day ein input field
                (Object.keys(formDay) as (keyof DayKeyFields)[])
                    .filter(
                        k => !["d_id", "created_at", "day", "motivation_field"].includes(k)
                    )
                    .map((k, i) => (
                        <div key={`day-input-field-${i}`}>
                            <div>{k}</div>
                            <textarea
                                value={formDay[k] || ""}
                                onChange={event =>
                                    handleFieldValueChange(k, event.target.value)}
                            />
                        </div>
                    ))
            }

            <button
                onClick={handleSubmit}
                className="p-2 bg-blue-500 text-white rounded"
            >
                Speichern
            </button>
        </div>
    );
}
