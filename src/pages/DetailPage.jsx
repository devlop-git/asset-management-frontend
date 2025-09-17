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
        const response = await api.get(
          `stonedata/stone-details?certificate_no=${payload}`
        );
        const { data, success, message } = response?.data || {};
        if (!success) throw new Error(message || 'Failed to fetch details');
        setDatasource(data);
        data.image_url ? setShowImage(true) : setShowImage(false);
        data.video_url ? setShowVideo(true) : setShowVideo(false);
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
      const response = await api.post(
        `stonedata/upload-media`,
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const { success, message } = response?.data || {};
      if (!success) throw new Error(message || 'Upload failed');
      toastSuccess(message || 'Uploaded');
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
            Stone Detail
          </h1>
          {/* <p className="text-gray-600">
            Here the description of diamond certificate
          </p> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {/* Image card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button type="button" onClick={() => setShowImage(!showImage)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50" aria-expanded={showImage}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4v-4H5a2 2 0 01-2-2V5z" /></svg>
                <span className="font-medium text-gray-900">Upload Image</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${showImage ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showImage && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700">Select image</label>
                <input className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2" id="image_input" type="file" accept="image/*" onChange={uploadImage} />
                {datasource?.stonedata.image_url ? (
                  <a href={datasource.stonedata.image_url} target="_blank" className="block">
                    <img src={datasource.stonedata.image_url} alt="diamond" className="mt-3 max-h-60 rounded border" />
                  </a>
                ) : <Spinner />}
              </div>
            )}
          </div>

          {/* Video card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button type="button" onClick={() => setShowVideo(!showVideo)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50" aria-expanded={showVideo}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" /><rect x="3" y="6" width="12" height="12" rx="2" ry="2" /></svg>
                <span className="font-medium text-gray-900">Upload Video</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${showVideo ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showVideo && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700">Select video</label>
                <input className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2" id="video_input" type="file" accept="video/mp4,video/x-m4v,video/*" onChange={uploadVideo} />
                {datasource?.stonedata.video_url ? (
                  <video controls className="mt-3 w-full max-w-full rounded border">
                    <source src={datasource.stonedata.video_url} type="video/mp4" />
                  </video>
                ) : <Spinner />}
              </div>
            )}
          </div>

          {/* PDF card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button type="button" onClick={() => setShowPdf(!showPdf)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50" aria-expanded={showPdf}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-6.75a2.25 2.25 0 00-2.25-2.25h-10.5A2.25 2.25 0 004.5 7.5v9a2.25 2.25 0 002.25 2.25h4.757" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 8.25h6m-6 3h3M16.5 18.75l2.25 2.25 4.5-4.5" /></svg>
                <span className="font-medium text-gray-900">Upload PDF</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${showPdf ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showPdf && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700">Select PDF</label>
                <input className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2" id="pdf_input" type="file" accept="application/pdf,image/*" />
                {datasource?.stonedata.cert_url && (
                  <a href={datasource.stonedata.cert_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 underline mt-3">Open PDF in new tab</a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
