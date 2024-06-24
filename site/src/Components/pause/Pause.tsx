import Navbar from "../navbar/Navbar.tsx";
import {NavService} from "../../services/NavigationService.ts";
import {useLocation} from "react-router-dom";
import ImgPlaceholder from "../training/training-read/ImgPlaceholder.tsx";

export function Pause() {
    NavService.changeNavHighlight(useLocation().pathname);

    return (
        <div className="bg-bg-primary min-h-screen">
            <Navbar/>
            <div className="flex justify-center">
                <h1 className="text-white font-bold rounded mt-10 px-3 py-2">Good job & take a break! A well-rested mind is a powerful mind.</h1>

            </div>
            <div className="flex justify-center">
                <ImgPlaceholder picturePath={"Dreamer-rafiki.png"}/>
            </div>

        </div>
    );
}