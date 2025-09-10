import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useLocation, useParams } from "react-router-dom";
import { toastError } from "../utils/toast";
import { toastSuccess } from './../utils/toast';
import Spinner from "../components/Spinner";

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-base font-semibold text-gray-800">
      {value || "-"}
    </span>
  </div>
);

const DetailPage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [datasource, setDatasource] = useState({});
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showPdf, setShowPdf] = useState(false);


  useEffect(() => {
    const payload = id || state?.certificateNo;
    (async () => {
      try {
        const { data } = await api.get(
          `stonedata/stone-details?certificate_no=${payload}`
        );
        setDatasource(data);
      } catch (ex) {
        toastError(ex.message || 'Something went wrong');
      }
    })();
  }, []);

  async function uploadMedia(type, file) {
    const formdata = new FormData();
    formdata.append('media', file);
    formdata.append('type', type); // images, videos, pdf
    formdata.append('diamond_code', datasource.certificate_no);
    formdata.append('stone_id', datasource.id);

    try {
      const { data } = await api.post(
        `stonedata/upload-media`,
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toastSuccess(data?.message);
    } catch (err) {
      toastError(err.message || 'Something went wrong');
    }

  }

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadMedia('images', file);
      // for preview purpose only
      const imageUrl = URL.createObjectURL(file);
      setDatasource((prev) => ({ ...prev, image_url: imageUrl }));
    }
  }
  const uploadVideo = async (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadMedia('videos', file);
      // for preview purpose only
      const videoUrl = URL.createObjectURL(file);
      setDatasource((prev) => ({ ...prev, video_url: videoUrl }));
    }
  } 

  if(!datasource.tag_no) return <Spinner />
  return (
    <div className="mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Stock detail
          </h1>
          {/* <p className="text-gray-600">
            Here the description of diamond certificate
          </p> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          <DetailRow label="TAG No / Demand ID" value={datasource?.tag_no} />
          <DetailRow label="Certificate Type" value={datasource?.lab} />
          <DetailRow label="Certificate No" value={datasource.certificate_no} />
          <DetailRow label="Stone Type" value={datasource.stone_type} />
          <DetailRow label="Shape" value={datasource.shape} />
          <DetailRow label="Carat (Avg Wt)" value={datasource.carat} />
          <DetailRow label="girdle" value={datasource.girdle} />
          <DetailRow label="Color" value={datasource.color} />
          <DetailRow label="Clarity" value={datasource.clarity} />
          <DetailRow label="Cut" value={datasource.cut} />
          <DetailRow label="Polish" value={datasource.polish} />
          <DetailRow label="Symmetry" value={datasource.symmetry} />
          <DetailRow label="Fluorescence" value={datasource.fluorescence} />
          <DetailRow label="Intensity" value={datasource.intensity} />
        </div>

        {/* upload image */}
        <div
          id="accordion-flush"
          data-accordion="collapse"
          data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          data-inactive-classes="text-gray-500"
        >
          <h2 id="accordion-flush-heading-1">
            <button
              type="button"
              onClick={() => setShowImage(!showImage)}
              className="flex items-center justify-between w-full py-5 font-medium cursor-pointer border-b border-gray-200 dark:border-gray-700 gap-3"
              data-accordion-target="#accordion-flush-body-1"
              aria-expanded="true"
              aria-controls="accordion-flush-body-1"
            >
              <span>Upload Image</span>
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" d="M9 5 5 1 1 5" />
              </svg>
            </button>
          </h2>
          {showImage && (
            <div
              id="accordion-flush-body-1"
              aria-labelledby="accordion-flush-heading-1"
            >
              <div className=" w-full py-5 border-b border-gray-200 dark:border-gray-700 mb-3">
                <input
                  className="block w-[30%] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none p-2"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                />
                <a
                  href={datasource?.image_url}
                  target="_blank"
                  className="h-60 w-80 mt-4"
                >
                  <img
                    src={datasource?.image_url}
                    alt="diamond"
                    className="h-60 w-80 mt-4"
                  />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* upload video */}
        <div
          id="accordion-flush"
          data-accordion="collapse"
          data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          data-inactive-classes="text-gray-500"
        >
          <h2 id="accordion-flush-heading-1">
            <button
              type="button"
              onClick={() => setShowVideo(!showVideo)}
              className="flex items-center justify-between w-full py-5 font-medium cursor-pointer border-b border-gray-200 dark:border-gray-700 gap-3"
              data-accordion-target="#accordion-flush-body-1"
              aria-expanded="true"
              aria-controls="accordion-flush-body-1"
            >
              <span>Upload Video</span>
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" d="M9 5 5 1 1 5" />
              </svg>
            </button>
          </h2>
          {showVideo && (
            <div
              id="accordion-flush-body-1"
              aria-labelledby="accordion-flush-heading-1"
            >
              <div className=" w-full py-5 border-b border-gray-200 dark:border-gray-700 mb-3">
                <input
                  className="block w-[30%] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none p-2"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                  accept="video/mp4,video/x-m4v,video/*"
                  onChange={uploadVideo}
                />
                <video width="450" height="500" controls className="mt-2">
                  <source
                    src={datasource?.video_url}
                    type="video/mp4"
                  />
                </video>
                {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p> */}
              </div>
            </div>
          )}
        </div>

        {/* upload PDf */}
        <div
          id="accordion-flush"
          data-accordion="collapse"
          data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          data-inactive-classes="text-gray-500"
        >
          <h2 id="accordion-flush-heading-1">
            <button
              type="button"
              onClick={() => setShowPdf(!showPdf)}
              className="flex items-center justify-between w-full py-5 font-medium cursor-pointer border-b border-gray-200 dark:border-gray-700 gap-3"
              data-accordion-target="#accordion-flush-body-1"
              aria-expanded="true"
              aria-controls="accordion-flush-body-1"
            >
              <span>Upload Pdf</span>
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" d="M9 5 5 1 1 5" />
              </svg>
            </button>
          </h2>
          {showPdf && (
            <div
              id="accordion-flush-body-1"
              aria-labelledby="accordion-flush-heading-1"
            >
              <div className=" w-full py-5 border-b border-gray-200 dark:border-gray-700 mb-3 flex flex-row items-center gap-4 justify-start">
                <div>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none p-2"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    accept="application/pdf,image/*"
                  />
                </div>
                <a
                  href={datasource?.cert_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline pl-2"
                >
                  Open PDF in new tab
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
