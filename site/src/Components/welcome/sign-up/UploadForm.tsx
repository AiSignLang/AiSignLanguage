/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { PhotoIcon } from '@heroicons/react/24/solid'

export default function UploadForm() {
    return (
        <div>
            <form className="container mx-auto text-blueGray-500 border border-gray-500">
                <label htmlFor="cover-photo" className="text-center block text-sm font-medium leading-6 text-gray-400">
                    Upload your user photo
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
                                <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5">PNG, JPG up to 10MB</p>
                    </div>
                </div>
            </form>

        </div>
    )
}
