import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { toastError, toastSuccess } from "../utils/toast";
import { Add, CheckIcon, Close, Delete, Edit } from "../assets/Icons";
import { useAuth } from './../context/AuthContext';
import Modal from './../components/Modal';

const headingList = ["URL", "Method", "Status", "Action"];
const Heading = ({
  label,
  btnLabel,
  isFilterOpen,
  setIsFilterOpen,
  permissionData,
  setPermissionData,
  handleSave,
}) => (
  <div className="flex justify-between">
    <div className="relative mb-3 w-[50%] flex gap-5">
      <label className="block mb-2 text-md font-medium uppercase">
        {label}
      </label>
    </div>

    <Modal
      isOpen={isFilterOpen}
      title={btnLabel}
      onClose={() => setIsFilterOpen(false)}
      footer={
        <button
          type="button"
          onClick={handleSave}
          className="text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {btnLabel}
        </button>
      }
      className="w-[30%]"
    >
      <div className="flex flex-col gap-3">
        <label className="block text-sm font-medium text-gray-900">
           URL
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2"
          id="url_input"
          type="text"
          value={permissionData.url}
          placeholder="Enter URL"
          onChange={(e) =>
            setPermissionData((prev) => ({ ...prev, url: e.target.value }))
          }
        />
        <label className="block text-sm font-medium text-gray-900">
           Method Name
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2"
          id="method_input"
          type="text"
          value={permissionData.method}
          placeholder="Enter Method Name"
          onChange={(e) =>
            setPermissionData((prev) => ({ ...prev, method: e.target.value }))
          }
        />
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-900">Status</label>
          <input
            type="checkbox"
            name="is_active"
            className="mt-1"
            checked={permissionData.is_active}
            onChange={(e) =>
              setPermissionData((prev) => ({ ...prev, is_active: e.target.checked }))
            }
          />
        </div>
      </div>
    </Modal>
    <div className="mb-2">
      <button
        type="button"
        className="inline-flex items-center gap-2 cursor-pointer text-white bg-blue-600 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-1"
        onClick={() => setIsFilterOpen(true)}
      >
        <Add />
        {btnLabel}
      </button>
    </div>
  </div>
);
const Permissions = () => {
  const [permissionList, setPermissions] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [permissionData, setPermissionData] = useState({ method: "", url: '', is_active: true });
  const [editingPermissionId, setEditingPermissionId] = useState(null);
   const { user } = useAuth();
  const IsSuperAdmin = user.role.toLowerCase() === 'superadmin';

  const handleEditClick = (permission) => {
    setEditingPermissionId(permission.id);
    setPermissionData({ method: permission.method ?? "", url: permission.url, is_active: !!permission.is_active });
    setIsFilterOpen(true);
  };

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

  const handleAdd = async () => {
    try {
      const response = await api.post(`permissions`, {
        method: permissionData.method,
        url: permissionData.url,
        is_active: permissionData.is_active ? 1 : 0,
      });
      const { success, message, data } = response.data;
      if (!success) throw new Error(message);
      setIsFilterOpen(false);
      setPermissions((prev) => [...prev, data]);
      setPermissionData({ method: "", url: "", is_active: false });
      toastSuccess(message);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.put(`permissions/${editingPermissionId}`, {
        method: permissionData.method,
        url: permissionData.url,
        is_active: permissionData.is_active ? 1 : 0,
      });
      const { success, message, data } = response.data;
      if (!success) throw new Error(message);
      setIsFilterOpen(false);
      setPermissions((prev) => prev.map((r) => (r.id === editingPermissionId ? data : r)));
      setEditingPermissionId(null);
      setPermissionData({ method: "", url: '', is_active: false });
      toastSuccess(message);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`permissions/${id}`);
      const { success, message } = response.data;
      if (!success) throw new Error(message);
      const newData = permissionList.filter((i) => i.id !== id);
      setPermissions(newData);
      toastSuccess(message);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  useEffect(() => {
    getPermissions();
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
       <div className="bg-wh  ite p-6 rounded-lg shadow-sm ml-5">
        <Heading
          label="Permission List"
          btnLabel={editingPermissionId ? "Edit Permission" : "Add Permission"}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={(open) => {
            if (!open) {
              setEditingPermissionId(null);
              setPermissionData({ method: "", url: '', is_active: true });
            }
            setIsFilterOpen(open);
          }}
          permissionData={permissionData}
          setPermissionData={setPermissionData}
          handleSave={editingPermissionId ? handleUpdate : handleAdd}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader headingList={headingList} />
            <tbody className="bg-white divide-y divide-gray-200">
              {permissionList.map((i, index) => (
                <tr
                  key={`${index}-${i.id}`}
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
                 
                  <td className="px-4 py-2 whitespace-wrap text-sm text-gray-900 flex gap-3 cursor-pointer">
                    <Edit fill="green" onClick={() => handleEditClick(i)} />
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

export default Permissions;
