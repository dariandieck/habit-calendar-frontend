import {MainHeader} from '../components/main/MainHeader.tsx';
import type {Day, DayKeyFields} from '../types/day';
import {
    trySaveDayLocalAndSyncLaterOn,
    trySaveEmailLocalAndSyncLaterOn,
    trySaveEntriesLocalAndSyncLaterOn
} from "../services/db.service.ts";
import type {Entry} from "../types/entry.ts";
import {syncWithBackend} from "../services/sync.service.ts";
import {getToday, getYesterday} from "../utils/utils.ts";
import {useAuthContext} from "../context/AuthContext.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {MainForm} from "../components/main/MainForm.tsx";
import {GoToHabitSummaryCard} from "../components/ui/GoToHabitSummaryCard.tsx";
import {RainbowButton} from "../components/ui/RainbowButton.tsx";

export function MainPage() {
    const { tokenData } = useAuthContext();
    const { setIsTodayDay, isYesterdaysMainForm, setIsYesterdayDay, setIsYesterdaysMainForm } = useAppDataContext();

    const handleSubmit = async (
            entries: Entry[], formDay: DayKeyFields, motivationalSpeech: string) => {

        const created_at = new Date().toISOString()
        const day = isYesterdaysMainForm ? getYesterday() : getToday();

        const dbEntries: Entry[] = entries.map(entry => ({
            ...entry,
            day: day
        }));

        const dbDay: Day = {
            ...formDay,
            day: day,
            created_at: created_at,
            motivation_field: motivationalSpeech
        }
        // save in indexedDB and then sync to backend
        await trySaveDayLocalAndSyncLaterOn(dbDay);
        await trySaveEntriesLocalAndSyncLaterOn(dbEntries);
        // send email
        await trySaveEmailLocalAndSyncLaterOn({day: dbDay, entries: dbEntries});

        console.log(`Day saved for the day "${day}" (${isYesterdaysMainForm ? "Yesterday" : "Today"}). Navigating to done page.`);
        const synced = await syncWithBackend(tokenData.access_token);
        if (!synced) {
            console.log("Errors while syncing data with backend. But the items are in the " +
                "queue and should get synced later on!");
        } else {
            console.log("Sync with backend completed right away without any errors.")
        }

        if(isYesterdaysMainForm) {
            setIsYesterdayDay(true);
            setIsYesterdaysMainForm(false);
        } else {
            setIsTodayDay(true);
        }

        sessionStorage.removeItem(`${isYesterdaysMainForm ? "yesterday" : "today"}_entries`);
        sessionStorage.removeItem(`${isYesterdaysMainForm ? "yesterday" : "today"}_formDay`);
    }

    const handleGoBackToMainForm = () => {
        setIsYesterdaysMainForm(false);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <>
            <div className="flex justify-center items-start p-4">
                <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-6 rounded-3xl
                shadow-xl border border-pink-100 space-y-4">
                    <MainHeader />

                    <MainForm key={isYesterdaysMainForm ? "yesterday" : "today"} handleSubmit={handleSubmit}/>

                    {isYesterdaysMainForm && (
                        <div className="flex justify-center">
                            <div className="w-full max-w-60">
                                <RainbowButton
                                    isSubmit={false}
                                    isSaving={false}
                                    text={"Zurück zum heutigen Tag"}
                                    actionEmoji={""}
                                    actionText={""}
                                    onClick={handleGoBackToMainForm}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <GoToHabitSummaryCard small={false}/>
        </>
    )
}
