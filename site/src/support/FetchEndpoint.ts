import {StatusCodes} from "http-status-codes";
export async function fetchRestEndpoint<t>(route: string, method: "GET" |"POST" |"PUT" |"DELETE"|"PATCH", data?: object|string|FormData,authentication:boolean = true,onError?:(code:StatusCodes)=>void): Promise<t|undefined> {
    const options:RequestInit = { method };
    const auth = authentication ? sessionStorage.getItem('id_token') ?? "": "" ;
    console.log('auth', auth);
    if (!(data instanceof FormData)) {
        options.headers = {
            "Content-Type": typeof data == "string"
                ? 'text/plain'
                : 'application/json',
            "Authorization": `Bearer ${auth}`
        };
    } else {
        options.headers = {
            "Authorization": `Bearer ${auth}`
        };
    }
    if (data) {
        options.body = data instanceof  FormData 
            ? data
            : JSON.stringify(data);
    }
    const res = await fetch(route, options);
    if (!res.ok){
        onError?.(res.status);
    }
    if (!res.ok) {
        const error = new Error(`${method} ${res.url} ${res.status} (${res.statusText})`);
        throw error;
    }
    if (res.status !== 204) {
        return await res.json();
    }
}
