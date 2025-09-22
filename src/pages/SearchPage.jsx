import { useState, useMemo, useEffect, useCallback } from "react";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import FormPage from "./FormPage";
import { toastError, toastSuccess } from "../utils/toast";
import { Close } from "../assets/Icons";

const formConfig = {
  fields: [
    {
      id: "tagNo",
      type: "text",
      label: "TAG no/ Demand ID",
      placeholder: "Enter your TAG no/ Demand ID",
    },
    {
      id: "certificateType",
      type: "select",
      label: "Certificate Type",
      placeholder: "Enter your Certificate type",
      optionsFrom: "certificateType",
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
      optionsFrom: "shape",
    },
    {
      id: "color",
      type: "select",
      label: "Color",
      required: false,
      optionsFrom: "color",
    },
    {
      id: "clarity",
      type: "select",
      label: "Clarity",
      required: false,
      optionsFrom: "clarity",
    },
    {
      id: "cut",
      type: "select",
      label: "Cut",
      required: false,
      optionsFrom: "cut",
    },
    {
      id: "polish",
      type: "select",
      label: "Polish",
      required: false,
      optionsFrom: "polish",
    },
    {
      id: "symmetry",
      type: "select",
      label: "Symmetry",
      required: false,
      optionsFrom: "symmetry",
    },
    {
      id: "fluorescence",
      type: "select",
      label: "Fluorescence",
      required: false,
      optionsFrom: "fluorescence",
    },
  ],
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [totalCount, setTotal] = useState();
  const [totalPages, setTotalPages] = useState();
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  // Initial fetch on load (once)
  useEffect(() => {
    executeSearch({ term: "", activeFilters: {}, page: 1 });
  }, []);

  // Manual search executor (called only on button clicks)
  const executeSearch = useCallback(
    async ({
      term,
      activeFilters,
      page = currentPage,
      pageSize = itemsPerPage,
    }) => {
      try {
        const queryParts = [];
        if (term) queryParts.push(`certificate_no=${term}`);
        Object.entries(activeFilters || {}).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
          ) {
            queryParts.push(`${key}=${String(value)}`);
          }
        });
        const url =
          queryParts.length > 0
            ? `stonedata/search?pageSize=${pageSize}&page=${page}&${queryParts.join(
                "&"
              )}`
            : `stonedata/search?pageSize=${pageSize}&page=${page}`;
        const response = await api.get(url);
        const { data, success, message } = response?.data || {};
        const payload = data;
        let rows = [];
        let total = 0;
        let pages = 0;
        if (Array.isArray(payload)) {
          rows = payload;
        } else if (payload && Array.isArray(payload.data)) {
          rows = payload.data;
          total = Number(payload.total) || 0;
          pages = Number(payload.totalPages) || 0;
        }
        if (!success) throw new Error(message || "Failed to fetch data");
        setDatasource(Array.isArray(rows) ? rows : []);
        setTotal(total);
        setTotalPages(pages);
        toastSuccess("Data fetched successfully");
      } catch (ex) {
        toastError(ex.message || "Something went wrong");
      }
    },
    [currentPage, itemsPerPage]
  );
  const isLastPage = totalPages
    ? currentPage >= totalPages
    : datasource.length < itemsPerPage;
  const startIndex =
    (currentPage - 1) * itemsPerPage + (datasource.length ? 1 : 0);
  const endIndex = (currentPage - 1) * itemsPerPage + datasource.length;

  const headingList = useMemo(() => {
    if (!datasource || datasource.length === 0) return [];
    const excluded = new Set(["image_url", "video_url", "cert_url"]);
    return Object.keys(datasource[0]).filter((key) => !excluded.has(key));
  }, [datasource]);

  const handleSearch = async () => {
    setCurrentPage(1);
    await executeSearch({ term: searchTerm, activeFilters: filters, page: 1 });
  };

  const handleFilterChange = (updatedValues) => {
    setFilters((prev) => ({ ...prev, ...(updatedValues || {}) }));
  };

  const handleApplyFilters = async (formValues) => {
    const mergedFilters = { ...(formValues || {}) };
    setFilters(mergedFilters);
    setCurrentPage(1);
    await executeSearch({
      term: searchTerm,
      activeFilters: mergedFilters,
      page: 1,
    });
    setIsFilterOpen(false);
  };

  const handlePageChange = async (page) => {
    if (page < 1) return;
    setCurrentPage(page);
    await executeSearch({ term: searchTerm, activeFilters: filters, page });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="flex flex-row justify-between items-center">
          <div className="relative mb-3 w-[50%]">
            {/* <label className="block mb-2 text-sm font-medium ">
              Certificate Number
            </label> */}
            <div className="flex items-center gap-2">
              <input
                type="search"
                id="search"
                value={searchTerm}
                className="form-input w-[50%]"
                placeholder="Enter Certificate Number"
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setIsFilterOpen((v) => !v)}
              className="inline-flex items-center gap-2 text-white bg-[#E0B86A] hover:bg-orange-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M7 12h10M10 18h4"
                />
              </svg>
              {isFilterOpen ? 'Hide Filters' : 'Filter'}
            </button>
          </div>
        </div>
        {isFilterOpen && (
          <div className="mt-3 border border-gray-200 rounded-md bg-white">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Filters</h3>
              <button className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setIsFilterOpen(false)}><Close /></button>
            </div>
            <div className="p-4">
              <FormPage
                onFilter={handleApplyFilters}
                onFilterChange={handleFilterChange}
                formConfig={formConfig}
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Image, Video, PDF
                </th>
                {headingList.map((item, index) => (
                  <th
                    key={index}
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datasource.map((row, rowIndex) => (
                <tr
                  key={row?.id ?? rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() =>
                    navigate(`/detail/${row.certificateNo}`, {
                      state: { certificateNo: row.certificateNo },
                    })
                  }
                >
                  <td className="px-2 py-4 whitespace-nowrap text-sm flex gap-6">
                    {[
                      ["image", row.image_url],
                      ["video", row.video_url],
                      ["cert", row.cert_url],
                    ].map(([type, url]) =>
                      url ? (
                        <svg
                          key={type}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 text-green-500"
                        >
                          <path d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg
                          key={type}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 text-red-600"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )
                    )}
                  </td>
                  {headingList.map((colKey) => (
                    <td
                      key={colKey}
                      className="px-2 py-2 whitespace-nowrap text-sm text-gray-900"
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
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 sm:px-6 py-2">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
            <div>
              {/* <p className="text-sm text-gray-700">Page <span className="font-medium">{currentPage}</span>{totalPages ? <> of <span className="font-medium">{totalPages}</span></> : null}</p> */}
              <p className="text-gray-600">
                {totalCount > 0 ? (
                  <>
                    Showing {startIndex} - {endIndex} of {totalCount}
                  </>
                ) : (
                  <>
                    Showing {datasource.length} results on page {currentPage}
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                Per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={async (e) => {
                  const val = Number(e.target.value);
                  setItemsPerPage(val);
                  setCurrentPage(1);
                  await executeSearch({
                    term: searchTerm,
                    activeFilters: filters,
                    page: 1,
                    pageSize: val,
                  });
                }}
                className="form-select w-24"
              >
                <option value={10}>10</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
                <option value={2000}>2000</option>
              </select>
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
                {totalPages
                  ? (() => {
                      const maxToShow = 5;
                      let start = 1;
                      let end = totalPages;
                      if (totalPages > maxToShow) {
                        if (currentPage <= 3) {
                          start = 1;
                          end = 5;
                        } else if (currentPage >= totalPages - 2) {
                          start = totalPages - 4;
                          end = totalPages;
                        } else {
                          start = currentPage - 2;
                          end = currentPage + 2;
                        }
                      }
                      const buttons = [];
                      for (let p = start; p <= end; p++) {
                        buttons.push(
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                              currentPage === p
                                ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      }
                      return buttons;
                    })()
                  : null}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={isLastPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
