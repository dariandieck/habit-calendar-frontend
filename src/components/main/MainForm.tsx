import {HabitsInputSliderForm} from "./HabitsInputSliderForm.tsx";
import {PersonalInputFieldsForm} from "./PersonalInputFieldsForm.tsx";
import {RainbowButton} from "../ui/RainbowButton.tsx";
import type {Entry} from "../../types/entry.ts";
import type {DayKeyFields} from "../../types/day.ts";
import {useEffect, useState} from "react";
import {MotivationalSpeechBlock} from "./MotivationalSpeechBlock.tsx";
import type {MotivationalSpeech} from "../../types/motivationalSpeech.ts";
import {useAuthContext} from "../../context/AuthContext.tsx";
import {tryFetchMotivationalSpeechFromBackend} from "../../services/fetch.service.ts";
import {MainBanner} from "./MainBanner.tsx";
import {useAppDataContext} from "../../context/AppDataContext.tsx";
import {useSessionStorageState} from "../../hooks/useSessionStorageState.tsx";

interface MainFormProps {
    handleSubmit: (entries: Entry[], formDay: DayKeyFields, motivationalSpeech: string) => Promise<void>
}

export function MainForm({handleSubmit}: MainFormProps) {
    const { habits } = useAppDataContext();
    const { isUserLoggedIn, tokenData } = useAuthContext();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [motivationalSpeech, setMotivationalSpeech] = useState<MotivationalSpeech>({
        day: "",
        speech: "konnte nicht geladen werden 🥺"
    });
    const [entries, setEntries] = useSessionStorageState<Entry[]>("entries",
        habits.map(h=> ({h_id: h.h_id!, score: 50, day: ""}))
    );
    const [formDay, setFormDay] = useSessionStorageState<DayKeyFields>("formDay", {
        how_are_you_field: "", stress_field: "", good_field: "", why_good_field: "", bad_field: "", improve_field: ""
    });

    // load LLM motivational speech from backend
    useEffect(() => {
        (async () => {
            if (!isUserLoggedIn) return;

            const motivationalSpeech = await tryFetchMotivationalSpeechFromBackend(
                tokenData.access_token);
            if (motivationalSpeech) {
                setMotivationalSpeech(motivationalSpeech)
                console.log("Got a motivational speech for today.")
            } else {
                console.log("Motivational speech for today is null.")
            }
        })();
    }, [isUserLoggedIn, tokenData.access_token]);

    const onSubmit = () => {
        setIsSaving(true);

        setTimeout(async () => {
            try {
                await handleSubmit(entries, formDay, motivationalSpeech.speech);
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

            <HabitsInputSliderForm entries={entries} setEntries={setEntries}/>

            <MainBanner />

            <PersonalInputFieldsForm isSaving={isSaving} formDay={formDay} setFormDay={setFormDay}/>

            <MotivationalSpeechBlock motivationalSpeech={motivationalSpeech.speech}/>


            <RainbowButton isSubmit={false} isSaving={isSaving} onClick={onSubmit}
                           text={"Speichern ✨"} actionEmoji={"✨"} actionText={"Wird gespeichert..."}
            />
        </div>
    )
}