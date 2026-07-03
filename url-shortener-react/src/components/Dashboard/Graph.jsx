import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  Legend,
  Filler
);

const Graph = ({ graphData }) => {
  const labels = graphData?.map((item, i) => `${item.clickDate}`);
  const userPerDaya = graphData?.map((item) => item.count);

  const data = {
    labels:
     graphData.length > 0
        ? labels
        : ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Total Clicks",
        data:
         graphData.length > 0
            ? userPerDaya
            : [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
        backgroundColor:
         graphData.length > 0 ? "#2563EB" : "rgba(37, 99, 235, 0.08)", // Primary Blue
        borderColor: "#2563EB",
        pointBorderColor: "#2563EB",
        fill: true,
        tension: 0.4,
        barThickness: 24,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.04)"
        },
        ticks: {
          font: {
            family: "Inter",
            size: 11
          },
          color: "#6B7280",
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value.toString();
            }
            return "";
          },
        },
        title: {
          display: false,
        },
      },
      x: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "Inter",
            size: 11
          },
          color: "#6B7280"
        },
        title: {
          display: false,
        },
      },
    },
  };

  return <Bar className="w-full" data={data} options={options}></Bar>;
};

export default Graph;