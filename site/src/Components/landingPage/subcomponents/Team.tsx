const people = [
    {
        name: 'Tsolmonbat Batbold',
        role: 'Frontend & Backend',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        name: 'Elija Lambourne',
        role: 'Frontend & KI',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        name: 'Alexander Resch',
        role: 'Backend & KI',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },

    // More people...
]

export default function Team() {
    return (
        <div className="bg-white py-24">
            <div className="flex justify-center mx-auto max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Introduction: The Team of AiSL</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        3rd year HTL Leonding students who want to try out/learn new things
                    </p>
                </div>
            </div>
            <div className="flex justify-center mt-20">
                <ul role="list"
                    className="grid gap-x-8 gap-y-12 sm:grid-cols-3 sm:gap-y-16 xl:col-span-3 text-center">
                    {people.map((person) => (
                        <li key={person.name}>
                            <div className="flex items-center gap-x-10">
                                <img className="h-16 w-16 rounded-full" src={person.imageUrl} alt=""/>
                                <div>
                                    <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                                    <p className="text-sm font-semibold leading-6 text-indigo-600">{person.role}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}