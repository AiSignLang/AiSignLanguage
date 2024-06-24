import {fetchRestEndpoint} from "../../../support/FetchEndpoint.ts";
import config from "../../../config.ts";
import React, {useState} from "react";
import {IUser} from "../../../model/backend/IUser.ts";

interface IProps {
    setPicture: (picture: string) => void;
    picture: string;
}

export default function ImageUpload(prop: IProps) {
    const [showImage, setShowImage] = useState(prop.picture !== "")
    const drop = async (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault();
        dragLeave(event);
        if (event.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            if (event.dataTransfer.items[0].kind === 'file') {
                const file = event.dataTransfer.items[0].getAsFile();
                if (file && file.type.startsWith('image/')) { // Check if the file is an image
                    const form = new FormData();
                    form.append("avatar", file);
                    const response = await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/user/${sessionStorage.getItem("username")}/avatar`, "PUT", form, true);
                    if (response) {
                        prop.setPicture(response!.profilePic);
                    }
                }
            }
        }

    }

    const dragOver = (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.currentTarget.style.borderColor = 'green'; 
        event.currentTarget.style.opacity = '0.5'; 
    }

    const dragLeave = (event: React.DragEvent<HTMLFormElement>) => {
        event.currentTarget.style.borderColor = 'gray'; // Change border color back to gray when file leaves drop zone
        event.currentTarget.style.opacity = '1';
    }
    
    return (
        <form
            className="container mx-auto text-blueGray-500 border border-gray-500 w-52 h-52 bg-center bg-no-repeat bg-cover after:bg-opacity"
            onDrop={drop}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            onMouseLeave={() => {
                
                setShowImage(true)
            }}
            onMouseOver={() => {
                
                setShowImage(false)
            }}
            
        >
            { showImage  &&  prop.picture && !prop.picture.includes("default_pfp.webp")  ? (<img src={`${prop.picture}?${new Date().getTime()}`} alt="profile" className="w-52 h-52"/>)  :
                    (
                        <><label htmlFor="cover-photo" className="text-center block px-2  py-1 text-sm font-medium leading-6 text-gray-400">
                                Upload your profile picture! (optional)
                            </label>
                            <div
                                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-3 text-gray-400">
                                <div className="text-center">
                                    <div className="mt-4 flex text-sm leading-6">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-bg-secondary font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only"
                                                   accept="image/*"
                                                   onChange={async (event) => {
                                                       const file = event.target.files![0];
                                                       const form = new FormData();
                                                       form.append("avatar", file);
                                                       const response = await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/user/${sessionStorage.getItem("username")}/avatar`, "PUT", form, true);
                                                       if (response) {
                                                           prop.setPicture(response!.profilePic);
                                                       }
                                                   }}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5">PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                                </>
                    )
            }

        </form>
    )
}