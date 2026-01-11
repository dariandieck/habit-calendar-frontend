import {DayForm} from '../components/DayForm';
import type {Day} from '../types/day';
import {trySaveDayLocalAndSyncLaterOn, trySaveEntriesLocalAndSyncLaterOn} from "../services/db.ts";
import type {Habit} from "../types/habit.ts";
import {DONE_PAGE} from "../App.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getMotivationalSpeech, sendEmail} from "../services/api.ts";
import type {MotivationalSpeech} from "../types/motivationalSpeech.ts";
import type {Entry} from "../types/entry.ts";
import {syncWithBackend} from "../services/sync.ts";
import type {DayKeyFields} from "../types/dayKeyFields.ts";
import type {EmailResponse} from "../types/emailResponse.ts";


interface MainPageProps {
    habits: Habit[],
    setCurrentDay: (value: (((prevState: (Day | null)) => (Day | null)) | Day | null)) => void
}

export function MainPage({habits, setCurrentDay}: MainPageProps) {
    const navigate = useNavigate();
    const [motivationalSpeech, setMotivationalSpeech] = useState<MotivationalSpeech>({
        day: "",
        speech: "konnte nicht geladen werden 🥺"
    });

    // load LLM motivational speech from backend
    useEffect(() => {
        (async () => {
            const today = new Date().toISOString().slice(0, 10);
            try {
                const dbMotivationalSpeech = await getMotivationalSpeech(today)
                if (dbMotivationalSpeech !== null) {
                    setMotivationalSpeech(dbMotivationalSpeech)
                    console.log("Motivational Speech loaded from backend")
                } else {
                    console.log("Motivational Speech from backend is null")
                }
            } catch (e) {
                console.log("Error while trying to get motivational speech. Is the backend offline?");
                console.error(e);
            }
        })();
    }, []);

    const handleSubmit = async (entries: Entry[], formDay: DayKeyFields) => {
        const created_at = new Date().toISOString()
        const today = created_at.slice(0, 10); // YYYY-MM-DD

        const dbEntries: Entry[] = entries.map(entry => ({
            ...entry,
            day: today
        }));

        const dbDay: Day = {
            ...formDay,
            day: today,
            created_at: created_at,
            motivation_field: motivationalSpeech.speech
        }
        // save in indexedDB and then sync to backend
        await trySaveDayLocalAndSyncLaterOn(dbDay);
        await trySaveEntriesLocalAndSyncLaterOn(dbEntries);
        setCurrentDay(dbDay);
        const synced = await syncWithBackend();
        if (synced) {
            console.log("Synced new day with backend.")
        } else {
            console.log("Could not sync new day with backend. But the items are in the " +
                "queue and should get synced later on!")
        }
        console.log(`Day saved for the day "${today}". Navigating to done page.`);
        navigate(DONE_PAGE); // geht zur Done page
        const sendEmailResponse: EmailResponse = await sendEmail(dbDay, dbEntries);
        if (sendEmailResponse.success) {
            console.log("Successfully sent confirmation email");
        } else {
            console.log("Did not send confirmation email. Error:");
            console.error(sendEmailResponse.message)
        }
    };

    return (
        <div className="flex justify-center items-start p-4">
            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl
                shadow-xl border border-pink-100">
                <h1 className="text-3xl font-bold text-pink-500 mb-8 text-center drop-shadow-sm">
                    ✨ Tägliche Bewertung ✨
                </h1>
                <div className="mb-4">
                    <p className="text-gray-500 leading-relaxed text-md">
                        Bewerte jeden deiner Habits heute auf einer Skala von 1-100 💘
                    </p>
                </div>
                <DayForm habits={habits} motivationalSpeech={motivationalSpeech} onSubmit={handleSubmit}/>
            </div>
        </div>
    )
}
