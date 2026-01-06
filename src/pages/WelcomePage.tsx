import {HabitInputForm} from '../components/HabitInputForm.tsx';
import {addHabits, getHabits} from '../services/api';
import type {Habit} from '../types/habit';
import {MAIN_PAGE} from "../App.tsx";
import {useNavigate} from "react-router-dom";

interface WelcomePageProps {
    setHabits: (value: (((prevState: Habit[]) => Habit[]) | Habit[])) => void
}

export function WelcomePage({setHabits}: WelcomePageProps) {
    const navigate = useNavigate();

    async function handleSubmit(habits: Habit[]) {
        if (habits.length === 0) return; // should never be the case because of early filters
        try {
            await addHabits(habits); // habits im backend speichern
            const db_habits_with_id: Habit[] = await getHabits()
            setHabits(db_habits_with_id) // set habits local for session (nicht indexedDB oder localStorage, nur im code)
            alert('Habits gespeichert 💖🧸🥰🥺');
            console.log(`Saved ${habits.length} habits in the backend. Going to main page.`);
            navigate(MAIN_PAGE); // geht zur Hauptseite
            // send email here
        } catch (error) {
            console.log("Error adding habit to the backend db:");
            console.error(error);
            alert('Es gab einen kleinen Fehler (upsie! 💅). Frag Dari was los ist 🥺');
            return;
        }
    }

    //const emojis: string = '💖✨🌸🌷🍓🦄🐰🐱🐣🍑🍒🍦🧁🍉💞💌🌈🎀👑💅💗💘💫🐶🍼🍬🍭🫧💟🩷🩰🧸🥰🥺'

    return (
        <div>
            <h1>✨Willkommen zu deinem Daily Habit Kalender ✨</h1>
            <p>
                In diesem Kalender geht es darum, deine Gewohnheiten oder auch Habits genannt, zu erfassen,
                diese täglich zu bewerten und zu reflektieren 🧸🌸
            </p>
            <p>
                Das hilft dir bei deiner Reise, wieder Kontrolle zu erlangen und schlechte Angewohnheiten bleiben zu
                lassen, um dich mehr auf die guten Sachen konzentrieren zu können 👑💅
            </p>
            <p>
                Welche Habits möchtest du täglich bewerten? 💞💌🌈
            </p>
            <p>Beispiele könnten sein:</p>
            <ol>
                <li>🍓 Aktiv sport betreiben</li>
                <li>🦄 Nicht an Fingernägeln kauen</li>
                <li>🍬 Gesund essen / keine Süßigkeiten essen etc...</li>
            </ol>
            <p>
                Schreibe genau auf, was die schlechte Gewohnheit ist.
                Lege zusätzlich einen Kurzbegriff (Name) für diese Gewohnheit an (max. 3 Worte)
            </p>

            <HabitInputForm onSubmit={handleSubmit}/>
        </div>
    );
}
