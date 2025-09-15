import { useState, useMemo, useEffect } from "react";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import FormPage from "./FormPage";
import { toastError, toastSuccess } from "../utils/toast";
import Modal from "../components/Modal";

// const PAGE_SIZE = 50; // pagination handled client-side for now

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const formConfig = {
    fields: [
      {
        id: "tagNo",
        type: "text",
        label: "TAG no/ Demand ID",
        placeholder: "Enter your TAG no/ Demand ID"
      },
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
      },
      {
        id: "cut",
        type: "select",
        label: "Cut",
        required: false,
        optionsFrom: "cut"
      },
      {
        id: "polish",
        type: "select",
        label: "Polish",
        required: false,
        optionsFrom: "polish"
      },
      {
        id: "symmetry",
        type: "select",
        label: "Symmetry",
        required: false,
        optionsFrom: "symmetry"
      },
      {
        id: "fluorescence",
        type: "select",
        label: "Fluorescence",
        required: false,
        optionsFrom: "fluorescence"
      }
    ]
  }
  
  // Initial fetch on load (once)
  useEffect(() => {
    executeSearch({ term: "", activeFilters: {} });
  }, []);

  // Manual search executor (called only on button clicks)
  const executeSearch = async ({ term, activeFilters }) => {
    try {
      const queryParts = [];
      if (term) queryParts.push(`certificate_no=${term}`);
      Object.entries(activeFilters || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).trim() !== "") {
          queryParts.push(`${key}=${String(value)}`);
        }
      });
      const url = queryParts.length > 0
        ? `stonedata/search?${queryParts.join("&")}`
        : `stonedata/search`;
      const response = await api.get(url);
      const { data, success, message } = response?.data || {};
      const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      if (!success) throw new Error(message || 'Failed to fetch data');
      setDatasource(Array.isArray(rows) ? rows : []);
      toastSuccess('Data fetched successfully');
    } catch (ex) {
      toastError(ex.message || 'Something went wrong');
    }
  };

  const totalPages = Math.ceil(datasource.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = datasource.slice(startIndex, startIndex + itemsPerPage);

  const headingList = useMemo(() => {
    if (!datasource || datasource.length === 0) return [];
    return Object.keys(datasource[0]);
  }, [datasource]);

  const handleSearch = async () => {
    setCurrentPage(1);
    await executeSearch({ term: searchTerm, activeFilters: filters });
  };

  const handleFilterChange = (updatedValues) => {
    setFilters((prev) => ({ ...prev, ...(updatedValues || {}) }));
  };

  const handleApplyFilters = async (formValues) => {
    const mergedFilters = { ...(formValues || {}) };
    setFilters(mergedFilters);
    setCurrentPage(1);
    await executeSearch({ term: searchTerm, activeFilters: mergedFilters });
    setIsFilterOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-row justify-between items-end">
          <div className=" relative mb-3 w-[50%]">
            <label className="block mb-2 text-sm font-medium ">
              Certificate Number
            </label>
            <input
              type="search"
              id="search"
              value={searchTerm}
              className="form-input block w-[50%]"
              placeholder="Enter certificate Number"
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />

            <button
              type="button"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div className="mb-6">
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

        <Modal isOpen={isFilterOpen} title="Filter" onClose={() => setIsFilterOpen(false)}>
          <FormPage 
            onFilter={handleApplyFilters} 
            onFilterChange={handleFilterChange} 
            formConfig={formConfig}  
          />
        </Modal>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 mt-2">
          <p className="text-gray-600">
            Showing {datasource.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, datasource.length)} of {datasource.length} results
          </p>

          <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
              Per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="form-select w-20"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image, Video, PDF
                </th>
                {headingList.map((item, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={row?.id ?? rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => navigate(`/detail/${row.CertificateNo}`, {state: {certificateNo: row.CertificateNo}})}
                >
                  <td className="px-2 py-4 whitespace-nowrap text-sm flex gap-2">
                    {[
                      ["image", row.image_url],
                      ["video", row.video_url],
                      ["cert", row.cert_url],
                    ].map(([type, url]) => (
                      url ? (
                        <svg key={type} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-green-500">
                          <path d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg key={type} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-red-600">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )
                    ))}
                  </td>
                  {headingList.map((colKey) => (
                    <td
                      key={colKey}
                      className="px-4 py-2 whitespace-wrap text-sm text-gray-900"
                    >
                      {String(row?.[colKey] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                          currentPage === pageNumber
                            ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
