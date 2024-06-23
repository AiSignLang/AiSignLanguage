
import { PhotoIcon } from '@heroicons/react/24/solid'
import {useNavigate} from "react-router-dom";

interface IProps {
    // TODO: Define your props here
    //sendData: (email: string, password: string) => void;
    changeStep: (step: number)=> void;
}

export default function UploadForm(prop: IProps) {
    const navigate = useNavigate();
    
    return (
        <div>
            <form className="container mx-auto text-blueGray-500 border border-gray-500">
                <label htmlFor="cover-photo" className="text-center block text-sm font-medium leading-6 text-gray-400">
                    Upload your profile picture up! (optional)
                </label>
                <div
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-gray-400">
                    <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12" aria-hidden="true"/>
                        <div className="mt-4 flex text-sm leading-6">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-bg-secondary font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only"
                                       accept="image/*"/>
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5">PNG, JPG up to 10MB</p>
                    </div>
                </div>

            </form>
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
