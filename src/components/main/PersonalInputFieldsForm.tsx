import {type DayKeyFields, keyFieldMap} from "../../types/day.ts";

interface PersonalInputFieldsFormProps {
    formDay: DayKeyFields,
    setFormDay: (value: (((prevState: DayKeyFields) => DayKeyFields) | DayKeyFields)) => void,
    isSaving: boolean
}

export function PersonalInputFieldsForm({setFormDay, formDay, isSaving}: PersonalInputFieldsFormProps) {

    const handleFieldValueChange = (field: keyof DayKeyFields, value: string) => {
        setFormDay(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <>
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
                                disabled={isSaving}
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
        </>
    )
}