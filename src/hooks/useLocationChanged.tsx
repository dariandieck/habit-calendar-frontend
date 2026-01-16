import {useEffect} from "react";
import {useLocation} from "react-router-dom";

export const useLocationChanged = () => {
    const location = useLocation();
    useEffect(() => {
        console.log(`Navigated to route: "${location.pathname}".`);
    }, [location.pathname]);
}