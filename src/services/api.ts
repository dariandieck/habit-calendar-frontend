import type {Habit} from '../types/habit';
import type {Day} from "../types/day.ts";
import type {MotivationalSpeech} from "../types/motivationalSpeech.ts";
import type {EmailResponse} from "../types/emailResponse.ts";
import type {Entry} from "../types/entry.ts";
import type {LoginData} from "../types/loginData.ts";
import type {LoginResponse} from "../types/loginResponse.ts";
import type {PingResponse} from "../types/pingResponse.ts";

export const BASE_URL = () => {
    if (import.meta.env.DEV) {
        return 'http://localhost:8080/v1';
    } else if (import.meta.env.PROD) {
        return 'https://test-dd-web-app-backend-c4evgedrd9facah5.germanywestcentral-01.azurewebsites.net/v1';
    }
};

export async function login(loginData: LoginData): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);

    const res = await fetch(`${BASE_URL()}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData
    });
    return await res.json();
}

export async function addHabits(token: string, habits: Habit[]): Promise<void> {
    const res = await fetch(`${BASE_URL()}/habits`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(habits),
    });

    if (!res.ok) {
        throw new Error(res.status + ': Fehler beim Speichern der Habits');
    }
}

export async function pingBackend(): Promise<PingResponse> {
    const res = await fetch(`${BASE_URL()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        throw new Error(res.status + ': Fehler beim Ping des Backends');
    }
    return await res.json();
}

export async function getHabits(token: string): Promise<Habit[]> {
    const res = await fetch(`${BASE_URL()}/habits`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error(res.status + ': Fehler beim laden der Habits');
    }

    return await res.json();
}

export async function getMotivationalSpeech(token: string, date: string): Promise<MotivationalSpeech> {
    const res = await fetch(`${BASE_URL()}/motivationalspeeches/${date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error(res.status + ': Fehler beim laden der motivational speech');
    }

    return await res.json();
}

export async function getCurrentDay(token: string, today: string): Promise<Day> {
    const res = await fetch(`${BASE_URL()}/days/date/${today}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error(res.status + ': Fehler beim laden des current days');
    }

    return await res.json();
}

export async function sendEmail(token:string, dbDay: Day, entries: Entry[]): Promise<EmailResponse> {
    const res = await fetch(`${BASE_URL()}/sendemail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({day: dbDay, entries: entries})
    });

    if (!res.ok) {
        throw new Error(res.status + ': Fehler beim senden der email');
    }

    return await res.json();
}