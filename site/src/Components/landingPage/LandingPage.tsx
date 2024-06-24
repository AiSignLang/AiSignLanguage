import Header from "./subcomponents/Header.tsx";
import Team from "./subcomponents/Team.tsx";
import Subnav from "./subcomponents/Subnav.tsx";
import Text from "./subcomponents/Text.tsx";

function LandingPage(){
    return (
        <div className="bg-bg-secondary">
            <Subnav/>
            <Header/>
            <Text/>
            <Team/>
        </div>
    )
}


export default LandingPage;