

// TODO: Need an UserService
export default function User(){
    return(
        <>
            <div className="grid grid-cols-3">
                {/*
                    profile picture
                */}
                <img
                    className="inline-block h-fit w-fit min-h-[15rem] min-w-[15rem] rounded-full ring-2 ring-white
                    md:col-start-1 md:col-end-4 md:row-start-1
                    xs:col-start-1 xs:col-end-4 xs:row-start-1
                    "
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="user profile picture"
                />
                {/*
                    username/score
                */}
                <div className="inline-block pt-5
                    md:col-start-2 md:row-start-1
                     sm:col-start-1 sm:col-end-4 sm:row-start-2
                    xs:col-start-1 xs:col-end-4 xs:row-start-2
                ">
                    <h1 className="text-3xl">John Doe de marcus the</h1>

                    {/* TODO: Score needs to be put in here */}
                    <div>
                        <span className="p-4 text-left">100 ? 10! 3$</span>
                        <span className="p-4 ">100 ? 10! 3$</span>
                        <span className="p-4">100 ? 10! 3$</span>
                    </div>

                </div>

                <div className="col-start-3"></div>
            </div>
        </>
    )
}