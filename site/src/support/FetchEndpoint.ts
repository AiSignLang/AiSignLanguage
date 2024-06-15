import {StatusCodes} from "http-status-codes";
export async function fetchRestEndpoint<t>(route: string, method: "GET" |"POST" |"PUT" |"DELETE", data?: object,onError?:(code:StatusCodes)=>void): Promise<t|undefined> {
    const options:RequestInit = { method };
    const auth = sessionStorage.getItem('id_token');
 //   console.log('auth', auth);
    options.headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth}`,
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    const res = await fetch(route, options);
    if (!res.ok) {
        const error = new Error(`${method} ${res.url} ${res.status} (${res.statusText})`);
        throw error;
    }
    if (!res.ok){
        onError?.(res.status);
    }
    if (res.status !== 204) {
        return await res.json();
    }
}
