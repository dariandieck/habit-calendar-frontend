import {getDay, getHabits, getIsDay, pingBackend} from "./api.service.ts";
import {getToday} from "../utils/utils.ts";
import type {Habit} from "../types/habit.ts";
import type {Day} from "../types/day.ts";
import {getLocalDays} from "./db.service.ts";

export const tryFetchIsBackendAwake = async () => {
    try {
        const ping: boolean | undefined = (await pingBackend())?.message.includes("running");
        return !!ping;
    } catch (error) {
        console.log("Error while pinging the backend. Error:")
        console.error(error);
        return false;
    }
};
export const tryFetchIsTodayDayFromBackend = async () => {
    const res: boolean | undefined = await getIsDay(getToday())
    return !!res;
}
const tryFetchHabitsFromBackend = async (access_token: string) => {
    try {
        return await getHabits(access_token);
    } catch (err) {
        console.log('Error while requesting habits from backend. Error:');
        console.error(err);
        return [];
    }
};
const genSynthHabitsForDev = () => {
    const synthHabits: Habit[] = [
        {description: "Test habit1", h_id: 0, name: "habit1"},
        {description: "Test habit2", h_id: 1, name: "Sport"},
        {description: "Test habit3", h_id: 2, name: "Wasser trinken"}
    ];
    console.log(`DEV: Generated ${synthHabits.length} synth-habits.`);
    return synthHabits;
}
export const tryFetchHabits= async (access_token: string) => {
    if (import.meta.env.DEV) {
        return genSynthHabitsForDev();
    } else {
        return await tryFetchHabitsFromBackend(access_token);
    }
};
export const tryFetchDayFromBackend = async (access_token: string) => {
    try {
        const day: Day | null = await getDay(access_token, getToday());
        console.log(`${day
            ? "Loaded today's day entry from backend db."
            : "No day entry for today found in backend db."}
            `);
        return day;
    } catch (err) {
        console.log("Error while requesting today's day from backend. Error:");
        console.error(err);
        return null;
    }
};
export const tryFetchDayFromIndexedDB = async () => {
    try {
        const localDayThatIsToday: Day[] = (await getLocalDays()).filter(d => d.day === getToday());
        return localDayThatIsToday.length === 1 ? localDayThatIsToday[0] : null;
    } catch (err) {
        console.log("Error while loading today's day from indexed db. Error:");
        console.error(err);
        return null;
    }
}

export const tryFetchLocalTokenData = () => {
    const localToken = localStorage.getItem("access_token");
    const localExp = localStorage.getItem("exp");
    if (localToken && localExp) {
        console.log("Got access token from local storage. It might be invalid.")
        return {token: localToken, success: true, exp: localExp};
    } else {
        return {token: "", success: false, exp: ""}
    }
}