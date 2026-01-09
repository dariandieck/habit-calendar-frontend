import { useOnlineStatus } from './hooks/useOnlineStatus';
import { syncWithBackend } from './services/sync';
import { useEffect, useState } from "react";
import { clearAllData } from "./services/db.ts";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {getCurrentDay, getHabits} from "./services/api.ts";
import type {Habit} from "./types/habit.ts";
import {MainPage} from "./pages/MainPage.tsx";
import {WelcomePage} from "./pages/WelcomePage.tsx";
import {DonePage} from "./pages/DonePage.tsx";
import type {Day} from "./types/day.ts";

export const MAIN_PAGE: string = "/"
export const WELCOME_PAGE: string = "/welcome"
export const DONE_PAGE: string = "/done"

type LoadingState = {
    isHabits: boolean;
    isDaySubmitted: boolean;
};

export default function AppRoutes() {
    const [isLoaded, setIsLoaded] = useState<LoadingState>({isHabits: false, isDaySubmitted: false});
    const [habits, setHabits] = useState<Habit[]>([]);
    const [currentDay, setCurrentDay] = useState<Day | null>(null);
    const online = useOnlineStatus();
    const location = useLocation();

    // init: clear indexedDB
    useEffect(() => {
        (async () => {
            await clearAllData();
        })();
        console.log("cleared indexedDB");
    }, []);

    // init: check if there are already habits in the backend
    useEffect(() => {
        const tryLoadHabitsFromBackend = async () => {
            try {
                const habits = await getHabits();
                setHabits(habits);
                console.log(`Loaded ${habits.length} habits from backend db.`);
            } catch (err) {
                console.log('Error while loading habits. Is the backend offline?');
                console.error(err);
            } finally {
                setIsLoaded(prev => ({
                    ...prev,
                    isHabits: true
                }));
            }
        };
        const generateSynthHabitsForDev = () => {
            // const synthHabits: Habit[] = [
            //     {description: "Test habit1", h_id: 0, name: "habit1"},
            //     {description: "Test habit2", h_id: 1, name: "Sport"},
            //     {description: "Test habit3", h_id: 2, name: "Wasser trinken"}
            // ];
            // setHabits(synthHabits);
            //setHabits([]);
            console.log(`Generated ${habits.length} habits for dev.`);
            setIsLoaded(prev => ({
                ...prev,
                isHabits: true
            }));
        }
        (async () => {
            if (import.meta.env.DEV) {
                generateSynthHabitsForDev();
            } else if (import.meta.env.PROD) {
                await tryLoadHabitsFromBackend();
            }
        })();
    }, []);

    // init: check if there is already a day entry for today in the backend
    useEffect(() => {
        (async () => {
            try {
                const day = await getCurrentDay();
                if(day !== null) { // so if there is a day entry (it's not null)
                    setCurrentDay(day)
                    console.log(`Loaded a day entry for today: "${day.day}".`);
                } else {
                    console.log("No day entry for today found.");
                }
            } catch (err) {
                console.log('Error while loading current Day. Is the backend offline?', )
                console.error(err);
            } finally {
                setIsLoaded(prev => ({
                    ...prev,
                    isDaySubmitted: true
                }));
            }
        })();
    }, []);

    // online changed: sync with backend
    /* eslint-disable */
    useEffect(() => {
        console.log(`User is now ${online ? 'online' : 'offline'}.`);
        if (online && location.pathname !== WELCOME_PAGE) {
            (async () => {
                const syncWasPerformed = await syncWithBackend();
                if (syncWasPerformed) console.log(`Synced with backend. Current page is "${location.pathname}".`);
            })();
        }
    }, [online]);
    /* eslint-enable */

    // pathname changed: log
    useEffect(() => {
        console.log(`Navigated to route: "${location.pathname}".`);
    }, [location.pathname]);


    if (!Object.values(isLoaded).some(Boolean)) {
        return (
            <p>Loading...</p>
        );
    }

    return (
        <Routes>
            {/* Hauptseite */}
            <Route
                path={MAIN_PAGE}
                element={
                    currentDay !== null
                    ? (<Navigate to={DONE_PAGE} replace />)
                    : habits.length === 0
                        ? (<Navigate to={WELCOME_PAGE} replace />)
                        : (<MainPage habits={habits} setCurrentDay={setCurrentDay} />)
                }
            />

            {/* Willkommensseite */}
            <Route
                path={WELCOME_PAGE}
                element={
                    currentDay !== null
                    ? (<Navigate to={DONE_PAGE} replace />)
                    : habits.length === 0
                        ? <WelcomePage setHabits={setHabits} />
                        : (<Navigate to={MAIN_PAGE} replace />)

                }
            />

            {/* Done-For-Today Seite */}
            <Route
                path={DONE_PAGE}
                element={
                    currentDay !== null
                        ? (<DonePage />)
                        : habits.length === 0
                            ? (<Navigate to={WELCOME_PAGE} replace />)
                            : (<Navigate to={MAIN_PAGE} replace />)
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={MAIN_PAGE} replace />} />
        </Routes>
    );
}