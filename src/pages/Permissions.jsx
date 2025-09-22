import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { toastError, toastSuccess } from "../utils/toast";
import { Add, CheckIcon, Close, Delete, Edit } from "../assets/Icons";

const headingList = ["URL", "Method", "Status", "Action"];
const Permissions = () => {
  const [permissionList, setPermissions] = useState([]);

  const getPermissions = async () => {
    try {
      const response = await api.get("/permissions");
      const { success, data, message } = response.data;
      setPermissions(data);
      if (!success) throw new Error(message || "Something went wrong");
      toastSuccess(message)
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const handleEdit = async (userData) => {
    try {
      const response = await api.post(`role/${userData.id}`, {
        name: "admin1",
        status: 1,
      });
      const { success, message, data } = response.data;
      if (!success) throw new Error(message);
      console.log(data);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`role/${id}`);
      const { success, message, data } = response.data;
      if (!success) throw new Error(message);
      console.log(data);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const Heading = ({ label, btnLabel }) => (
    <div className="flex justify-between">
      <div className="relative mb-3 w-[50%] flex gap-5">
        <label className="block mb-2 text-md font-medium uppercase">
          {label}
        </label>
      </div>
      <div className="mb-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 cursor-pointer text-white bg-blue-600 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-1"
        >
          <Add />
          {btnLabel}
        </button>
      </div>
    </div>
  );

  const TableHeader = ({ headingList }) => (
    <thead className="bg-gray-50">
      <tr>
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
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm ml-5">
        <Heading label="Permission List" btnLabel="Add Permission" />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader headingList={headingList} />
            <tbody className="bg-white divide-y divide-gray-200">
              {permissionList.map((i, index) => (
                <tr
                  key={index - i.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900">
                    {i.url}
                  </td>
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900">
                    {i.method}
                  </td>
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900">
                    {i.is_active ? (
                      <CheckIcon color="green" stroke="green" />
                    ) : (
                      <Close />
                    )}
                  </td>
                 
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900 flex gap-3">
                    <Edit fill="green" onClick={() => handleEdit(i)} />
                    <Delete fill="red" onClick={() => handleDelete(i.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
