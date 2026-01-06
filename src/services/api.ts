import type {Habit} from '../types/habit';
import type {Day} from "../types/day.ts";
import type {MotivationalSpeech} from "../types/motivationalSpeech.ts";

export const BASE_URL = 'http://localhost:8080/v1';

export async function addHabits(habits: Habit[]): Promise<void> {
    const res = await fetch(`${BASE_URL}/habits`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(habits),
    });

    if (!res.ok) {
        throw new Error('Fehler beim Speichern der Habits');
    }
}

export async function getHabits(): Promise<Habit[]> {
    const res = await fetch(`${BASE_URL}/habits`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        throw new Error('Fehler beim laden der Habits');
    }

    return await res.json();
}

export async function getMotivationalSpeech(date: string): Promise<MotivationalSpeech> {
    const res = await fetch(`${BASE_URL}/motivationalspeeches/${date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        throw new Error('Fehler beim laden der motivational speech');
    }

    return await res.json();
}

export async function getCurrentDay(): Promise<Day> {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const res = await fetch(`${BASE_URL}/days/date/${today}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        throw new Error('Fehler beim laden des current days');
    }

    return await res.json();
}
