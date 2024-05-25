import AIView from "../AIView.tsx";
import Navbar, {navigation} from "../navbar/Navbar.tsx";
import {useLocation} from "react-router-dom";
import {NavService} from "../../services/NavigationService.ts";

interface IProps {
    // TODO: Define your props here
}

export function Sandbox(props: IProps) {
    NavService.changeNavHighlight(useLocation().pathname);

    return (
        <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full">
            <Navbar></Navbar>
            <AIView></AIView>
        </div>
    );
};