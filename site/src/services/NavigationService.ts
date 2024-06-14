import {navigation} from "../Components/navbar/Navbar.tsx";

class NavigationService {
    public changeNavHighlight(location: string){
        navigation.forEach((item) => {
            if(item.href === location){
                item.current = true;
            }else{
                item.current = false;
            }
        });
    }
}

export const NavService = new NavigationService();