
export default function User(){
    return(
        <>
            <div className="m-6 pt-10 flex-wrap bg-blue-950 text-gray-100 grid grid-cols-10 grid-rows-2 grid-flow-col gap-2">

                {/*
                    comment
                */}
                <div className="bg-black inline-block
                    lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3
                    sm:col-start-4 sm:col-end-6 sm:row-start-1 sm:row-end-3
                    ">
                    nav
                </div>

                {/*
                    profile picture
                */}
                <img
                    className="inline-block h-fit w-fit min-h-[15rem] min-w-[15rem] rounded-full ring-2
                    lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-2
                    sm:col-start-4 sm:col-end-6 sm:row-start-1 sm:row-end-3 ring-white"
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="user profile picture"
                />
                {/*
                    username/score
                */}
                <div className="inline-block bg-amber-500
                    lg:col-start-6 lg:col-end-7 lg:row-start-1 lg:row-end-2
                    sm:col-start-4 sm:col-end-6 sm:row-start-3 sm:row-end-4">
                    <h1 className="text-2xl font-bold">John Doe de marcus the</h1>
                    <p className="p-4">10000 ? 100000! 100000$</p>
                </div>
            </div>
        </>
    )
}