
import { PhotoIcon } from '@heroicons/react/24/solid'
import {useNavigate} from "react-router-dom";
import {fetchRestEndpoint} from "../../../support/FetchEndpoint.ts";
import config from "../../../config.ts";
import {useEffect, useState} from "react";
import ImageUpload from "./ImageUpload.tsx";

interface IProps {
    // TODO: Define your props here
    //sendData: (email: string, password: string) => void;
    changeStep: (step: number)=> void;
}

export default function UploadForm(prop: IProps) {
    const navigate = useNavigate();
    const [picture, setPicture] = useState("");
    useEffect(() => {
        (async () => {
            const response = await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/user/${localStorage.getItem("username")}`, "GET", null, true);
            if (response) {
                setPicture(response!.profilePic);
            }})();
    }, []);
    return (
        <div>
            <ImageUpload setPicture={setPicture} picture={picture}/>
            <div className="flex justify-between rounded mt-5 space-x-4">
                <button onClick={() => {
                    prop.changeStep(1);
                }} type="submit"
                        className="w-full justify-center py-2 px-4 rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary
                    inline-flex">go back
                </button>
                <button onClick={() => {
                    navigate('/profile');
                }} type="submit"
                        className="w-full justify-center py-2 px-4 rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary inline-flex">finnish up!
                </button>
            </div>

        </div>
    )
}
