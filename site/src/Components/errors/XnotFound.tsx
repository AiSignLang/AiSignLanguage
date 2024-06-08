interface IProps {
    subject: string; //What hasn't been found
    message?: string; //Error message to display
}

export function XnotFound(props: IProps) {
    return (
        <div className="h-full min-h-screen flex flex-col sm:flex-row bg-bg-primary text-text-primary p-8">
            <div className="w-full sm:w-1/2 flex items-center justify-center text-text-primary">
                <div>
                    <h1 className="text-6xl font-bold">404</h1>
                    <p className="text-xl">{props.subject} not found!</p>
                    <p className="text-md">{props.message ? `${props.message}` : 'The page you are looking for does not exist or another error occurred.'}</p>
                    <a href="/" className="mt-4 inline-block text-text-primary py-2 hover:text-primary">
                        ← Go back home
                    </a>
                </div>
            </div>
            <div className="w-full sm:w-1/2 flex items-center justify-center">
                <img src="../../../public/img/error/404.svg" alt="404 error image"
                     className="object-cover h-full w-full "/>
            </div>
        </div>
    );
}