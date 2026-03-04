import {useEffect} from "react";
import {useLocation} from "react-router-dom";

export const useLocationChanged = () => {
    const location = useLocation();
    useEffect(() => {
        console.log(`Navigated to route: "${location.pathname}".`);

        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [location.pathname]);
}