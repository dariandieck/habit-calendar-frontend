import type {Habit} from "../types/habit.ts";
import type {Day} from "../types/day.ts";
import {Navigate, Route, Routes} from "react-router-dom";
import {WelcomePage} from "../pages/WelcomePage.tsx";
import {MainPage} from "../pages/MainPage.tsx";
import {DonePage} from "../pages/DonePage.tsx";

export const MAIN_PAGE: string = "/"
export const WELCOME_PAGE: string = "/welcome"
export const DONE_PAGE: string = "/done"

type RouteRedirectorProps = {
    habits: Habit[],
    currentDay: Day | null,
    setHabits: (value: (((prevState: Habit[]) => Habit[]) | Habit[])) => void,
    setCurrentDay: (value: (((prevState: (Day | null)) => (Day | null)) | Day | null)) => void,
    access_token: string
}

export function RouteRedirector({habits, currentDay, setHabits, setCurrentDay, access_token}: RouteRedirectorProps) {
    return (
        <Routes>
            {/* --- Route Redirector --- */}
            <Route path={MAIN_PAGE}
                   element={
                       currentDay !== null
                           ? <Navigate to={DONE_PAGE} replace/>
                           : habits.length === 0
                               ? <Navigate to={WELCOME_PAGE} replace/>
                               : <Navigate to={MAIN_PAGE} replace/>
                   }
            />
            {/* --- Actual Pages --- */}
            <Route path={WELCOME_PAGE} element={<WelcomePage setHabits={setHabits} access_token={access_token}/>}/>
            <Route path={MAIN_PAGE} element={<MainPage habits={habits} setCurrentDay={setCurrentDay}
                                                       access_token={access_token}/>}/>
            <Route path={DONE_PAGE} element={<DonePage/>}/>

            {/* --- FALLBACK --- */}
            <Route path="*" element={<Navigate to={MAIN_PAGE} replace/>}/>
        </Routes>
    )
}