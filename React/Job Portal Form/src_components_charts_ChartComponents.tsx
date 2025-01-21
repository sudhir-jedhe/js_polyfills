import type React from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js"
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

interface ChartProps {
  data: ChartData
  title: string
}

export const PieChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="chart-container">
    <h3>{title}</h3>
    <Pie data={data} />
  </div>
)

export const BarChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="chart-container">
    <h3>{title}</h3>
    <Bar
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" as const },
          title: { display: true, text: title },
        },
      }}
    />
  </div>
)

export const LineChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="chart-container">
    <h3>{title}</h3>
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" as const },
          title: { display: true, text: title },
        },
      }}
    />
  </div>
)

export const DoughnutChart: React.FC<ChartProps> = ({ data, title }) => (
  <div className="chart-container">
    <h3>{title}</h3>
    <Doughnut data={data} />
  </div>
)

