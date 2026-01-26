import {MainHeader} from '../components/main/MainHeader.tsx';
import type {Day, DayKeyFields} from '../types/day';
import {
    trySaveDayLocalAndSyncLaterOn,
    trySaveEmailLocalAndSyncLaterOn,
    trySaveEntriesLocalAndSyncLaterOn
} from "../services/db.service.ts";
import {useNavigate} from "react-router-dom";
import type {Entry} from "../types/entry.ts";
import {syncWithBackend} from "../services/sync.service.ts";
import {DONE_PAGE} from "../routes/RouteRedirector.tsx";
import {getToday} from "../utils/utils.ts";
import {useAuthContext} from "../context/AuthContext.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {MainForm} from "../components/main/MainForm.tsx";

export function MainPage() {
    const { tokenData } = useAuthContext();
    const { setIsTodayDay } = useAppDataContext();
    const navigate = useNavigate();

    const handleSubmit = async (
            entries: Entry[], formDay: DayKeyFields, motivationalSpeech: string) => {

        const created_at = new Date().toISOString()
        const today = getToday();

        const dbEntries: Entry[] = entries.map(entry => ({
            ...entry,
            day: today
        }));

        const dbDay: Day = {
            ...formDay,
            day: today,
            created_at: created_at,
            motivation_field: motivationalSpeech
        }
        // save in indexedDB and then sync to backend
        await trySaveDayLocalAndSyncLaterOn(dbDay);
        await trySaveEntriesLocalAndSyncLaterOn(dbEntries);
        // send email
        await trySaveEmailLocalAndSyncLaterOn({day: dbDay, entries: dbEntries});

        console.log(`Day saved for the day "${today}". Navigating to done page.`);
        const synced = await syncWithBackend(tokenData.access_token);
        if (!synced) {
            console.log("Could not sync new day with backend. But the items are in the " +
                "queue and should get synced later on!");
        } else {
            console.log("Sync with backend completed right away.")
        }
        sessionStorage.removeItem("entries");
        sessionStorage.removeItem("formDay");

        setIsTodayDay(true);

        navigate(DONE_PAGE); // geht zur Done page
    }

    return (
        <div className="flex justify-center items-start p-4">
            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl
                shadow-xl border border-pink-100">

                <MainHeader />

                <MainForm handleSubmit={handleSubmit}/>

            </div>
        </div>
    )
}
