import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { toastError, toastSuccess } from "../utils/toast";
import { Delete } from "../assets/Icons";
import { useAuth } from "../context/AuthContext";

const headingList = ["Name", "Email", "Role", "Action"];

const Heading = ({
  label
}) => (
  <div className="flex justify-between">
    <div className="relative mb-3 w-[50%] flex gap-5">
      <label className="block mb-2 text-md font-medium uppercase">
        {label}
      </label>
    </div>
  </div>
);

const UserPage = () => {
  const [datasource, setDatasource] = useState([]);
  const { user } = useAuth();
  const IsSuperAdmin = user.role.toLowerCase() === 'superadmin'

  const getUsers = async () => {
    try {
      const response = await api.get("/users");
      const { success, data, message } = response.data;
      setDatasource(data);
      if (!success) throw new Error(message || "Something went wrong");
    } catch (ex) {
      toastError(ex.message);
    }
  };
 
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`users/${id}`);
      const { success, message } = response.data;
      if (!success) throw new Error(message);
      const newData = datasource.filter((i) => i.id !== id);
      setDatasource(newData);
      toastSuccess(message);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

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
        <Heading
          label="User List"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader headingList={headingList} />
            <tbody className="bg-white divide-y divide-gray-200">
              {datasource?.map((i, index) => (
                <tr
                  key={`${index}-${i.id}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900">
                    {i.name}
                  </td>
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900">
                    {i.email}
                  </td>
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900">
                    {i.role.name}
                  </td>
                 
                   <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900 flex gap-3 cursor-pointer">
                     
                      {IsSuperAdmin && <Delete fill="red" onClick={() => handleDelete(i.id)} />}
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

export default UserPage;
