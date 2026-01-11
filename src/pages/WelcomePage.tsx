import {HabitInputForm} from '../components/HabitInputForm.tsx';
import {addHabits, getHabits} from '../services/api';
import type {Habit} from '../types/habit';
import {MAIN_PAGE} from "../App.tsx";
import {useNavigate} from "react-router-dom";
import {WelcomeComponent} from "../components/WelcomeComponent.tsx";

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
            setHabits(db_habits_with_id)
            console.log(`Saved ${habits.length} habits in the backend. Going to main page.`);
            navigate(MAIN_PAGE); // geht zur Hauptseite
        } catch (error) {
            console.log("Error adding habit to the backend db:");
            console.error(error);
            alert('Es gab einen kleinen Fehler (upsie! 💅). Frag Dari was los ist 🥺');
        }
    }

    //EMOJIS 💖✨🌸🌷🍓🦄🐰🐱🐣🍑🍒🍦🧁🍉💞💌🌈🎀👑💅💗💘💞🐶🍼🍬🍭🫧💟🩷🩰🧸🥰🥺🚰💧💦🌊🥤🔫🚿'😴🛏️🛌💤
    return (
        <div className="flex justify-center items-start sm:items-center min-h-[80vh] p-4">
            <div className="
                w-full             /* Am iPhone: Nutze die volle Breite (minus Padding vom Container) */
                max-w-md           /* Am kleinen iPad: Werde nicht breiter als ein schmales Tablet */
                md:max-w-2xl       /* Am MacBook: Begrenze die Breite auf ein schönes Maß (ca. 672px) */
                bg-white/80
                backdrop-blur-xl
                p-6 md:p-10        /* Innenabstand: Am Handy etwas weniger (p-6), am MacBook mehr (p-10) */
                rounded-3xl
                shadow-xl
                border border-pink-100"
                >
                <WelcomeComponent />
                <HabitInputForm onSubmit={handleSubmit}/>
            </div>
        </div>
    );
}
