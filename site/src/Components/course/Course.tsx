import Navbar from "../navbar/Navbar.tsx";
import {Link, useLocation} from 'react-router-dom'
import {NavService} from "../../services/NavigationService.ts";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, BarController, BarElement, RadarController, RadialLinearScale,
} from 'chart.js'
import {Bar} from 'react-chartjs-2'
import {courseService} from "../../services/CourseService.ts";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LinearScale,
    CategoryScale
)

interface IProps {
    courseID: string;
}

export function Course(props: IProps) {
    NavService.changeNavHighlight(useLocation().pathname);
    console.log("Courseprops", props);
    console.log(courseService.getDoneTasksCount())
    //Saturated colours
    //                    'rgba(0,132,255,0.2)',                     "rgba(0,132,255,1)",
    return (
        <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full flex flex-col justify-center">
            <Navbar></Navbar>
            <div className="flex justify-center w-full flex-grow items-center">
                <div className="mt-20">
                    <h1 className="text-4xl font-bold text-gray-600">
                        You <span className="text-gradient bg-clip-text bg-red-gradient">haven't</span> done your
                        exercises today :(
                    </h1>
                    <div className="flex justify-center gap-10">
                        <Link to="/exercise?type=next"
                              className="mt-10 text-xl bg-primary w-fit p-3.5 rounded hover:bg-primary-hover">
                            Do them now
                        </Link>
                        <Link to="/pause"
                              className="mt-10 text-xl w-fit p-3.5 rounded text-gray-600 hover:text-text-primary">
                            I need time off →
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
}