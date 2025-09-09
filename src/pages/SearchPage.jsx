import { useState, useMemo, useEffect } from "react";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import FormPage from "./FormPage";
import { toastError, toastSuccess } from "../utils/toast";

// const PAGE_SIZE = 50; // pagination handled client-side for now

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [filteredData, setFilterData] = useState({});
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();
  

  // No URL param syncing; state is internal only

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
      const rows = response?.data?.data ?? response?.data ?? [];
      setDatasource(Array.isArray(rows) ? rows : []);
      toastSuccess('Data fetched successfully');
    } catch (ex) {
      toastError(ex.message || 'Something went wrong');
    }
  };

  // filter dropdown data
  useEffect(() => { 
    (async () => {
      try {
        const response = await api.get(
          'stonedata/filterData'
        );
        const filterData = response?.data || {};
        setFilterData(filterData);
      } catch (ex) {
        toastError(ex.message || 'Something went wrong');
      }
    })();
  }, []);


  // const filteredData = useMemo(() => {
  //   return mockData.filter(item =>
  //     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.role.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [searchTerm]);

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

  const handleApplyFilters = async () => {
    const mergedFilters = { ...filters };
    setFilters(mergedFilters);
    setCurrentPage(1);
    await executeSearch({ term: searchTerm, activeFilters: mergedFilters });
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
        <div className="flex flex-row justify-between">
          <div className=" relative mb-6 w-[50%]">
            <label className="block mb-2 text-sm font-medium ">
              Certificate Number
            </label>
            <input
              type="search"
              id="search"
              // className="block w-[50%] p-4 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              className="form-input block w-[50%]"
              placeholder="Enter certificate Number"
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />

            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <div
          id="accordion-flush"
          data-accordion="collapse"
          data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          data-inactive-classes="text-gray-500"
        >
          <h2 id="accordion-flush-heading-1">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center justify-between w-full py-5 font-medium cursor-pointer border-b border-gray-200 dark:border-gray-700 gap-3"
              data-accordion-target="#accordion-flush-body-1"
              aria-expanded="true"
              aria-controls="accordion-flush-body-1"
            >
              <span>Filter</span>
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
          {showFilter && (
            <div
              id="accordion-flush-body-1"
              aria-labelledby="accordion-flush-heading-1"
            >
              <div className="py-5 border-b border-gray-200 dark:border-gray-700 mb-3">
                {/* <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Filters will be showing here.
                </p> */}
                <FormPage onFilter={handleApplyFilters} onFilterChange={handleFilterChange} filterData={filteredData} />
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 mt-4">
          <p className="text-gray-600">
            Showing {datasource.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, datasource.length)} of{" "}
            {datasource.length} results
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
                  Action
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
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      type="button"
                      onClick={() => navigate(`/detail/${row.CertificateNo}`, {state: {certificateNo: row.CertificateNo}})}
                      className="text-black-600 hover:text-blue-800"
                      title="View"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-5 h-5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </button>
                  </td>
                  {headingList.map((colKey) => (
                    <td
                      key={colKey}
                      className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
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
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
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
