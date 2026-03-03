import {useAppDataContext} from "../../context/AppDataContext.tsx";

export function MainHeader() {

    const { isYesterdaysMainForm } = useAppDataContext();

    return (
        <>
            <h1 className="text-3xl font-bold text-pink-500 mb-8 text-center drop-shadow-sm">
                ✨Tägliche Bewertung✨ {isYesterdaysMainForm && "[Gestriger Tag]"}
            </h1>
            <p className="text-gray-500 leading-relaxed text-md">
                Bewerte jeden deiner Habits heute auf einer Skala von 1-100 💘
            </p>
        </>
    );
}