import {navigate} from "../../model/Utils.ts";

export function Logout(){
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    navigate('/')
}