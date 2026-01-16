import {createContext, useContext, useState, type ReactNode, useCallback} from "react";
import type { Habit } from "../types/habit";
import type { Day } from "../types/day";
import * as React from "react";
import {
    tryFetchDayFromIndexedDB, tryFetchHabitsFromBackend,
    tryFetchIsBackendAwake,
    tryFetchIsTodayDayFromBackend, tryFetchLocalHabits
} from "../services/fetch.service.ts";
import {useAuthContext} from "./AuthContext.tsx";

type AppDataContextType = {
    habits: Habit[];
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    todayDay: Day | null;
    setTodayDay: React.Dispatch<React.SetStateAction<Day | null>>;
    isTodayDay: boolean;
    setIsTodayDay: React.Dispatch<React.SetStateAction<boolean>>;
    isBackendAwake: boolean;
    setIsBackendAwake: React.Dispatch<React.SetStateAction<boolean>>;
    isDataLoaded: boolean;
    setIsDataLoaded:  React.Dispatch<React.SetStateAction<boolean>>;
    loadAllAppData: () => Promise<void>
};


const AppDataContext =
    createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
    const { isUserLoggedIn, tokenData } = useAuthContext()
    const [habits, setHabits] = useState<Habit[]>([]);
    const [todayDay, setTodayDay] = useState<Day | null>(null);
    const [isTodayDay, setIsTodayDay] = useState<boolean>(false)
    const [isBackendAwake, setIsBackendAwake] = useState<boolean>(false);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

    const loadAllAppData = useCallback(async () => {
        console.log("(Re)loading all the app data...");
        setIsDataLoaded(false)

        // isBackendAwake
        const isBackendAwake = await tryFetchIsBackendAwake();
        setIsBackendAwake(isBackendAwake);
        console.log(`${isBackendAwake 
            ? "Got ping from the backend. Backend is awake." 
            : "Backend is not awake (ping no result)."}
        `);

        // first, try to get the day locally
        const todayDayIndexedDB = await tryFetchDayFromIndexedDB();
        if (todayDayIndexedDB) {
            // if we get a day here, no need to load anything else (since backend is also awake)
            console.log("Loaded today's day entry from indexed db.");
            setTodayDay(todayDayIndexedDB)
            setIsTodayDay(true);
            setIsDataLoaded(true);
            return;
        }
        console.log("No day entry for today found in indexed db. Looking in the backend next.");

        if (isBackendAwake) {
            const isTodayDayFromBackend = await tryFetchIsTodayDayFromBackend();
            if (isTodayDayFromBackend) {
                // before the user is even logged in we get to know if there is a day for today. Then same logic applies
                console.log("Confirmed that there is a day for today from the backend.")
                setIsTodayDay(true);
                setIsDataLoaded(true);
                return;
            }
            console.log("Confirmed that there no day for today from the backend. Looking for the habits next.")
        }


        // anything below here is when we don't have a day
        const habits: Habit[] = tryFetchLocalHabits();
        if (habits.length > 0) {
            console.log(`Found ${habits.length} habits in localstorage.`);
            setHabits(habits);
            setIsDataLoaded(true);
            return;
        }
        console.log("No Habits found locally. Looking in the backend next.");

        if (!isUserLoggedIn) {
            console.log("Can not get habits from backend. User does not have a valid session. " +
                "He needs to log in before fetching the Habits.");
        } else if (isBackendAwake) {
            const habits: Habit[] = await tryFetchHabitsFromBackend(tokenData.access_token);
            setHabits(habits);
            if (habits.length === 0) {
                console.log("No habits were (found/)fetched.")
            } else {
                localStorage.setItem("habits", JSON.stringify(habits));
                console.log(`${habits.length} habits have been (found/)fetched.`);
            }
        }

        setIsDataLoaded(true)
        console.log("Finished (re)loading all the app data!");
    }, [isUserLoggedIn, tokenData.access_token]);

    return (
        <AppDataContext.Provider value={{
            habits, setHabits,
            todayDay, setTodayDay,
            isTodayDay, setIsTodayDay,
            isBackendAwake, setIsBackendAwake,
            isDataLoaded, setIsDataLoaded,
            loadAllAppData
        }}>
            {children}
        </AppDataContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAppDataContext() {
    const context = useContext(AppDataContext);
    if (!context) throw new Error("useAppData must be used within AppDataProvider");
    return context;
}


