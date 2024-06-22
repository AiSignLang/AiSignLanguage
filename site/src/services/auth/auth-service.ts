import { navigate } from "../../model/Utils";

export function Logout(){
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('username');
    navigate("/")
}