import { Navigate, Route, Routes } from "react-router-dom";
import { WelcomePage } from "../pages/WelcomePage.tsx";
import { MainPage } from "../pages/MainPage.tsx";
import { DonePage } from "../pages/DonePage.tsx";
import { useAppDataContext } from "../context/AppDataContext.tsx";
import {HabitSummaryPage} from "../pages/HabitSummaryPage.tsx";

export const MAIN_PAGE: string = "/";
export const WELCOME_PAGE: string = "/welcome";
export const DONE_PAGE: string = "/done";
export const HABIT_SUMMARY_PAGE: string = "/habit-summary";

export function RouteRedirector() {
    const { habits, isYesterdaysMainForm, isTodayDay } = useAppDataContext();

    return (
        <Routes>
            <Route
                path={MAIN_PAGE}
                element={
                    isYesterdaysMainForm
                        ? <MainPage />
                        : isTodayDay
                            ? <Navigate to={DONE_PAGE} replace />
                            : habits.length > 0
                                ? <MainPage />
                                : <Navigate to={WELCOME_PAGE} replace />
                }
            />

            <Route
                path={WELCOME_PAGE}
                element={
                    habits.length === 0
                        ? <WelcomePage />
                        : <Navigate to={MAIN_PAGE} replace />
                }
            />

            <Route
                path={DONE_PAGE}
                element={
                    isYesterdaysMainForm
                        ? <Navigate to={MAIN_PAGE} replace />
                        : isTodayDay
                            ? <DonePage />
                            : <Navigate to={MAIN_PAGE} replace />
                }
            />

            <Route
                path={HABIT_SUMMARY_PAGE}
                element={
                    habits.length === 0
                        ? <Navigate to={WELCOME_PAGE} replace />
                        : <HabitSummaryPage />
                }
            />

            {/* --- FALLBACK --- */}
            <Route path="*" element={<Navigate to={MAIN_PAGE} replace />} />
        </Routes>
    );
}