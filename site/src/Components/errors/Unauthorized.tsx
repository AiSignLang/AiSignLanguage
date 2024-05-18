export function Unauthorized() {
    return (
        <div className="min-h-screen h-full flex flex-col sm:flex-row bg-bg-primary text-text-primary p-8">
            <div className="w-full sm:w-1/2 flex items-center justify-center text-text-primary">
                <div>
                    <h1 className="text-6xl font-bold">401</h1>
                    <p className="text-xl">Unauthorized</p>
                    <p className="text-md">You are not authorized to use this page!</p>
                    <a href="/" className="mt-4 inline-block text-text-primary py-2 hover:text-primary">
                        ← Go back home
                    </a>
                </div>
            </div>
            <div className="w-full sm:w-1/2 flex items-center justify-center">
                <img src="../../../public/img/error/401.svg" alt="401 error image"
                     className="object-cover h-full w-full "/>
            </div>
        </div>
    );
}