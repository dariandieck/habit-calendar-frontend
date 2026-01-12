import { useOnlineStatus } from './hooks/useOnlineStatus';
import { syncWithBackend } from './services/sync';
import { useEffect, useState } from "react";
import {getLocalDays} from "./services/db.ts";
import { useLocation } from 'react-router-dom';
import {getCurrentDay, getHabits, pingBackend} from "./services/api.ts";
import type {Habit} from "./types/habit.ts";
import type {Day} from "./types/day.ts";
import {LoadingPage} from "./pages/LoadingPage.tsx";
import type {LoginResponse} from "./types/loginResponse.ts";
import {LoginPage} from "./pages/LoginPage.tsx";
import {RouteRedirector} from "./components/RouteRedirector.tsx";

type LoadingState = {
    isBackendAwake: boolean;
    isHabits: boolean;
    isDaySubmitted: boolean;
};

export default function AppRoutes() {
    const [isLoaded, setIsLoaded] = useState<LoadingState>({isBackendAwake: false,
        isHabits: false, isDaySubmitted: false});
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loginTokenData, setLoginTokenData] = useState<LoginResponse>(() => {
        const savedToken = localStorage.getItem("access_token");
        const exp = localStorage.getItem("exp");
        if (savedToken && exp) {
            console.log("Got access token from local storage. It might be invalid.")
            return {token: savedToken, success: true, exp: exp};
        } else {
            return {token: "", success: false, exp: ""}
        }
    });
    const [currentDay, setCurrentDay] = useState<Day | null>(null);
    const online = useOnlineStatus();
    const location = useLocation();

    // init: check if backend is awake
    useEffect(() => {
        (async () => {
            try {
                const res = await pingBackend();
                if (res?.message.includes("running")) {
                    console.log("Got ping from Backend! Backend is running.");
                    setIsLoaded(prev => ({
                        ...prev,
                        isBackendAwake: true,
                    }));
                } else {
                    console.log("Did not get ping from Backend! Backend is not running.");
                }
            } catch (error) {
                console.log("Error while pinging the backend. Error:")
                console.error(error);
                setIsLoaded(prev => ({
                    ...prev,
                    isBackendAwake: false,
                }));
            }
        })();

    }, []);

    useEffect(() => {
        console.log(isLoaded);
    }, [isLoaded]);

    // init: check if there are already habits in the backend
    useEffect(() => {
        const tryLoadHabitsFromBackend = async () => {
            try {
                const habits = await getHabits(loginTokenData.token);
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
            const synthHabits: Habit[] = [
                {description: "Test habit1", h_id: 0, name: "habit1"},
                {description: "Test habit2", h_id: 1, name: "Sport"},
                {description: "Test habit3", h_id: 2, name: "Wasser trinken"}
            ];
            setHabits(synthHabits);
            setHabits([]);
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
                if (!isJWTValid()) {
                    console.log("No habits are going to get fetched because user is not logged in.")
                    return;
                } else {
                    await tryLoadHabitsFromBackend();
                }
            }
        })();
    }, []);

    // init: check if there is already a day entry for today in the backend
    useEffect(() => {
        if (!isJWTValid()) {
            console.log("No day is going to get fetched because user is not logged in.")
            return;
        }
        (async () => {
            try {
                const today: string = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
                const localDays: Day[] = await getLocalDays();
                const filtered: Day[] = localDays.filter(d => d.day === today);
                let day = filtered.length === 1 ? filtered[0] : null;
                if (day !== null) {
                    setCurrentDay(day)
                    console.log(`Loaded a day entry for today: "${day.day}" from local indexedDB.`);
                } else {
                    console.log("No day found in indexedDB. Looking in backend db now.")
                    day = await getCurrentDay(loginTokenData.token, today);
                    if(day !== null) { // so if there is a day entry (it's not null)
                        setCurrentDay(day)
                        console.log(`Loaded a day entry for today: "${day.day}" from backend db.`);
                    } else {
                        console.log("No day entry for today found.");
                    }
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
    useEffect(() => {
        if (online && isJWTValid()) {
            (async () => {
                const syncWasPerformed = await syncWithBackend(loginTokenData.token);
                if (syncWasPerformed) {
                    console.log(`Synced with backend.`);
                    window.location.reload();
                }
            })();
        }
    }, [loginTokenData.token, online]);

    // timer to log out when token is expired
    useEffect(() => {
        if (!loginTokenData.token || !loginTokenData.exp) return;

        const expiryTime = new Date(loginTokenData.exp).getTime();
        const currentTime = new Date().getTime();
        const delay = expiryTime - currentTime;

        if (delay <= 0) {
            console.log("Token is expired. Logging out.");
            handleLogout();
            return;
        }

        console.log(`Timer for access token started: Token runs out in ${Math.round(delay / 1000)} seconds.`);

        const timer = setTimeout(() => {
            console.log("Token is expired. Logging out.");
            handleLogout();
        }, delay);

        return () => clearTimeout(timer);

    }, [loginTokenData.token, loginTokenData.exp]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("exp");
        setLoginTokenData({ token: "", success: false, exp: "" });
        console.log("Logged out.");
    };

    // pathname changed: log
    useEffect(() => {
        console.log(`Navigated to route: "${location.pathname}".`);
    }, [location.pathname]);

    const isJWTValid = () => {
        const isValid: boolean = loginTokenData.success && loginTokenData.token !== "" && loginTokenData.exp !== ""
        const expiryDate: Date = new Date(loginTokenData.exp);
        const now: Date = new Date();
        const isExpired: boolean = expiryDate.getTime() < now.getTime();
        return isValid && !isExpired;
    }

    return (
        <>
            {
                Object.values(isLoaded).every(Boolean)
                ? <RouteRedirector habits={habits} currentDay={currentDay} setHabits={setHabits}
                                   access_token={loginTokenData.token} setCurrentDay={setCurrentDay} />
                : (<LoadingPage />)
            }
            {!isJWTValid() && <LoginPage setLoginTokenData={setLoginTokenData} />}


        </>
    );
}