import type {Entry} from "../../types/entry.ts";
import {useAppDataContext} from "../../context/AppDataContext.tsx";
import {EntrySlider} from "../ui/EntrySlider.tsx";

interface HabitsInputSliderFormProps {
    entries: Entry[],
    setEntries: (value: (((prevState: Entry[]) => Entry[]) | Entry[])) => void
}

export function HabitsInputSliderForm({setEntries, entries}: HabitsInputSliderFormProps) {
    const {habits} = useAppDataContext();
    const updateScore = (h_id: number, score: number) => {
        // durchlaufe alle entries (prev) und wenn die übergeben h_id stimmt (entry hat h_id als FK),
        // dann ändere dort den score und kopiere den rest vom bestehenden entry,
        // ansonsten übernehme den entry (unverändert)
        setEntries(prev =>
            prev.map(e => (e.h_id === h_id ? {...e, score} : e))
        );
    };

    return (
        <div className="space-y-7">
            {habits.map(h => {
                // find the entry belonging to this habit
                const entry: Entry = entries.find(e => e.h_id === h.h_id)!
                return (
                    <EntrySlider key={`habit-slider-${h.h_id}`} entry={entry} habit={h} updateScore={updateScore}/>
                );
            })}
        </div>
    )
}