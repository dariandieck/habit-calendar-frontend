import {getDay, getHabits, getIsDay, getMotivationalSpeech, pingBackend} from "./api.service.ts";
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
export const tryFetchLocalHabits = (): Habit[] => {
    const habitsString: string | null = localStorage.getItem("habits");
    if (habitsString) {
        return JSON.parse(habitsString);
    } else {
        return [];
    }
};
export const tryFetchHabitsFromBackend= async (access_token: string) => {
    try {
        return await getHabits(access_token);
    } catch (err) {
        console.log('Error while requesting habits from backend. Error:');
        console.error(err);
        return [];
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

export const tryFetchMotivationalSpeechFromBackend
    = async (access_token: string) => {
    try {
        return await getMotivationalSpeech(access_token, getToday())
    } catch (e) {
        console.log("Error while trying to get motivational speech. Error:");
        console.error(e);
        return null;
    }
}