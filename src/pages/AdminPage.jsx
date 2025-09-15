import { useEffect, useState } from "react";
import { toastError } from "../utils/toast";
import axiosClient from "../api/axiosClient";
import FormPage from './FormPage';
import Modal from "../components/Modal";
import Chart from "react-apexcharts";


const formConfig = {
  fields: [
    {
      id: "certificateType",
      type: "select",
      label: "Certificate Type",
      placeholder: "Enter your Certificate type",
      optionsFrom: "certificateType"
    },
    {
      id: "stoneType",
      type: "select",
      label: "Stone Type",
      placeholder: "Enter your Stone Type",
      optionsFrom: "stoneType",
    },
    {
      id: "shape",
      type: "select",
      label: "Shape",
      required: false,
      optionsFrom: "shape"
    },
    {
      id: "color",
      type: "select",
      label: "Color",
      required: false,
      optionsFrom: "color"
    },
    {
      id: "clarity",
      type: "select",
      label: "Clarity",
      required: false,
      optionsFrom: "clarity"
    }
  ]
};


export default function AdminPage() {
const [datasource, setDatasource] = useState({
  "stoneCount": 0,
    "imageCount": 0,
    "videoCount": 0,
    "pdfCount": 0
});
const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    (async() => {
      try {
      const response = await axiosClient.get('/stonedata/dashboard');
      const { data, success, message } = response?.data || {};
      setDatasource(data);
      if(!success)  throw new Error(message || 'Something went wrong');
    } catch(ex){
      toastError(ex.message);
    }})()
  },[])

  const stats = [
    { name: 'Total Stone', value: datasource.stoneCount },
    { name: 'Image Count', value: datasource.imageCount },
    { name: 'Video Count', value: datasource.videoCount },
    { name: 'PDF Count', value: datasource.pdfCount },
  ];

  const series = [Number(datasource.imageCount) || 0, Number(datasource.videoCount) || 0, Number(datasource.pdfCount) || 0];

    const stateData = {
      chart: {
        type: "donut",
        toolbar: { show: false },
      },
      labels: ["Images", "Videos", "PDFs"],
      colors: undefined, // blue, green, amber (customize as needed)
      theme: {
        monochrome: {
          enabled: true,
          color: "#3B82F6", // base blue (Tailwind blue-500)
          shadeTo: "light",
          shadeIntensity: 0.45,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => {
          // show absolute count inside dataLabels
          // const idx = opts.seriesIndex;
          return `${Math.round(val)}%`;
        },
      },
      tooltip: {
        y: {
          formatter: (val) => val,
          title: {
            formatter: (seriesName) => `${seriesName}:`
          }
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        offsetY: 6
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              width: "100%"
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      plotOptions: {
        pie: {
          donut: {
            size: "56%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "14px",
                color: "#6B7280"
              },
              value: {
                show: true,
                fontSize: "20px",
                color: "#111827",
                formatter: function (val) {
                  return val;
                }
              },
              // total: {
              //   show: true,
              //   label: "Total",
              //   formatter: function (w) {
              //     const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              //     return total;
              //   }
              // }
            }
          }
        }
      }
    };

  const [state, ] = useState(stateData);
  const handleFilterChange = (updatedValues) => {
    // Optionally handle live changes in admin form
    console.log('Admin form changed', updatedValues);
  };

  const handleApplyFilters = (formValues) => {
    // Submit admin form values somewhere
    console.log('Admin form submitted', formValues);
    setIsFilterOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening today.</p>
      </div> */}

      {/* Stats Grid */}
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 ml-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ml-4">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal isOpen={isFilterOpen} title="Filter" onClose={() => setIsFilterOpen(false)}>
        <FormPage 
          onFilter={handleApplyFilters} 
          onFilterChange={handleFilterChange} 
          formConfig={formConfig}  
        />
      </Modal>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm w-[50%] p-2 m-5">
           {/* Additional admin content can go here */}
        <h3 className="text-lg font-medium text-gray-900 mb-4">Digital Assets Chart</h3>
           <Chart options={state} series={series} type="donut" height={320} />
           </div>

    </div>
  );
}