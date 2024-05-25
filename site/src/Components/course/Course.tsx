import Navbar from "../navbar/Navbar.tsx";
import { useLocation } from 'react-router-dom'
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
import {Bar, Radar} from 'react-chartjs-2'

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
    const data2 = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: '✅ Tasks Done',
                data: [3, 3, 3, 5, 3, 5],
                backgroundColor: 'rgba(47,47,47,0.8)',
                borderColor: "rgba(47,47,47,1)",
                borderWidth: 1,
            },
            {
                label: '⭐ Perfect Tasks',
                data: [1, 2, 3, 5, 2, 3],
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderColor: 'rgb(0,0,0)',
                borderWidth: 1,
            }
        ],
    };

    const options = {
        scales: {
            x: {
                grid: {
                    color: 'rgb(255,255,255,.1)',  // this will set the color of the grid lines on the x-axis
                },
                stacked: true,
            },
            y: {
                grid: {
                    color: 'rgb(255,255,255,.1)',  // this will set the color of the grid lines on the y-axis
                },
                beginAtZero: true,
            },
            r: {
                angleLines: {
                    color: 'rgb(255,255,255,.1)'  // this will set the color of the radial lines on the radar chart
                },
                grid: {
                    color: 'rgb(255,255,255,.1)',  // this will set the color of the circular grid lines on the radar chart
                },
                suggestedMin: 0,
                suggestedMax: 50
            }
        }
    };

    const radarData = {
        labels: ['Running', 'Swimming', 'Cycling', 'Weightlifting', 'Yoga'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [20, 10, 4, 2, 12],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }
        ]
    };
    const radarOptions = {
        scales: {
            r: {
                angleLines: {
                    color: 'rgb(255,255,255,.1)'  // this will set the color of the radial lines on the radar chart
                },
                grid: {
                    color: 'rgb(255,255,255,.1)',  // this will set the color of the circular grid lines on the radar chart
                },
                suggestedMin: 0,
                suggestedMax: 50
            }
        }
    };
    //Saturated colours
    //                    'rgba(0,132,255,0.2)',                     "rgba(0,132,255,1)",
    return (
        <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full">
            <Navbar></Navbar>
            <div className="grid grid-cols-2 grid-rows-2 h-screen">
                <div className="col-start-1 col-end-3 flex justify-center w-full h-1/2">
                    <div className="mt-20">
                        <h1 className="text-5xl font-bold text-gray-600">You <span
                            className="text-gradient bg-clip-text bg-red-gradient">haven't</span> done your tasks today
                            :(</h1>
                        <p className="mt-10 text-2xl bg-primary w-fit p-3.5 rounded hover:accent">
                            Do them now →
                        </p>
                    </div>
                </div>
                <div className="row-start-2 col-start-1">
                    <Radar data={radarData} options={radarOptions} />
                </div>
                <div className="row-start-2 col-start-2">
                    <Bar data={data2} options={options}/>
                </div>
            </div>
        </div>
    );
}